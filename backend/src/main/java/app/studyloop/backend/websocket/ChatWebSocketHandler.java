package app.studyloop.backend.websocket;

import app.studyloop.backend.domain.DirectChat;
import app.studyloop.backend.domain.DirectMessage;
import app.studyloop.backend.domain.DoubtMessage;
import app.studyloop.backend.domain.Profile;
import app.studyloop.backend.repository.DirectChatRepository;
import app.studyloop.backend.repository.DirectMessageRepository;
import app.studyloop.backend.repository.DoubtMessageRepository;
import app.studyloop.backend.repository.ProfileRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketHandler.class);

    @Value("${supabase.jwt.secret:}")
    private String jwtSecret;

    @Value("${supabase.jwt.verify-signature:false}")
    private boolean verifySignature;

    private final ProfileRepository profileRepository;
    private final DoubtMessageRepository doubtMessageRepository;
    private final DirectChatRepository directChatRepository;
    private final DirectMessageRepository directMessageRepository;
    private StringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map of userId -> Set of WebSocketSessions
    private final Map<UUID, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();
    
    // Map of session ID -> userId
    private final Map<String, UUID> sessionUsers = new ConcurrentHashMap<>();
    
    // Map of roomId (string) -> Set of userIds currently in the room
    private final Map<String, Set<UUID>> roomParticipants = new ConcurrentHashMap<>();

    // Map of roomId -> Set of userIds who raised hand
    private final Map<String, Set<UUID>> roomRaisedHands = new ConcurrentHashMap<>();

    // Map of roomId -> Map of userId -> media status map (isMuted, isCameraOff, isScreenSharing)
    private final Map<String, Map<UUID, Map<String, Object>>> roomMediaStatus = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(ProfileRepository profileRepository,
                                 DoubtMessageRepository doubtMessageRepository,
                                 DirectChatRepository directChatRepository,
                                 DirectMessageRepository directMessageRepository) {
        this.profileRepository = profileRepository;
        this.doubtMessageRepository = doubtMessageRepository;
        this.directChatRepository = directChatRepository;
        this.directMessageRepository = directMessageRepository;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    public void setRedisTemplate(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        UUID userId = extractUserId(session);
        if (userId == null) {
            log.warn("WebSocket connection attempt rejected: Invalid JWT token");
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        sessionUsers.put(session.getId(), userId);
        userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(session);

        // Update online presence in Redis with 60 second expiry
        updatePresenceInRedis(userId, true);

        log.info("User {} connected with WebSocket session {}", userId, session.getId());
        
        // Send connection confirmation
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of(
            "type", "CONNECTED",
            "userId", userId.toString()
        ))));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        UUID senderId = sessionUsers.get(session.getId());
        if (senderId == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }

        try {
            WsMessage wsMsg = objectMapper.readValue(message.getPayload(), WsMessage.class);
            wsMsg.setSenderId(senderId);

            switch (wsMsg.getType()) {
                case "HEARTBEAT":
                    updatePresenceInRedis(senderId, true);
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of("type", "HEARTBEAT_ACK"))));
                    break;

                case "JOIN_ROOM":
                    handleJoinRoom(senderId, wsMsg, session);
                    break;

                case "LEAVE_ROOM":
                    handleLeaveRoom(senderId, wsMsg);
                    break;

                case "GET_ROOM_PARTICIPANTS":
                    handleGetRoomParticipants(wsMsg, session);
                    break;

                case "RAISE_HAND":
                    handleRaiseHand(senderId, wsMsg);
                    break;

                case "LOWER_HAND":
                    handleLowerHand(senderId, wsMsg);
                    break;

                case "MEDIA_STATUS":
                    handleMediaStatus(senderId, wsMsg);
                    break;

                case "ROOM_REACTION":
                    handleRoomReaction(senderId, wsMsg);
                    break;

                case "CHAT_MSG": // Room doubt chat message
                    handleRoomChatMessage(senderId, wsMsg);
                    break;

                case "DIRECT_MSG": // 1:1 direct message
                    handleDirectMessage(senderId, wsMsg);
                    break;

                case "RTC_SIGNAL": // WebRTC signaling
                    handleRtcSignal(senderId, wsMsg);
                    break;

                case "HOST_CONTROL":
                    handleHostControl(senderId, wsMsg);
                    break;

                default:
                    log.warn("Unknown message type: {}", wsMsg.getType());
            }
        } catch (Exception e) {
            log.error("Error processing websocket message: {}", e.getMessage(), e);
        }
    }

    private void handleJoinRoom(UUID senderId, WsMessage wsMsg, WebSocketSession session) throws IOException {
        String roomId = wsMsg.getRoomId();
        if (!StringUtils.hasText(roomId)) return;

        roomParticipants.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(senderId);

        // Fetch joining user profile
        Profile sender = profileRepository.findById(senderId).orElse(null);
        String senderName = sender != null ? sender.getFullName() : "Student";
        String senderAvatar = sender != null ? sender.getAvatarUrl() : "";
        String senderCollege = sender != null ? sender.getCollege() : "";

        log.info("User {} ({}) joined Live Room {}", senderId, senderName, roomId);

        // Get full list of current participants in this room
        List<Map<String, Object>> participantsList = buildParticipantsList(roomId);

        // Broadcast to ALL members in the room (including the joining member)
        Map<String, Object> outbound = new HashMap<>();
        outbound.put("type", "ROOM_USER_JOINED");
        outbound.put("roomId", roomId);
        outbound.put("userId", senderId.toString());
        outbound.put("userName", senderName);
        outbound.put("userAvatar", senderAvatar);
        outbound.put("userCollege", senderCollege);
        outbound.put("participants", participantsList);

        String json = objectMapper.writeValueAsString(outbound);
        broadcastToUsers(roomParticipants.get(roomId), json);
    }

    private void handleLeaveRoom(UUID senderId, WsMessage wsMsg) throws IOException {
        String roomId = wsMsg.getRoomId();
        if (!StringUtils.hasText(roomId)) return;

        Set<UUID> participants = roomParticipants.get(roomId);
        if (participants != null) {
            participants.remove(senderId);
        }

        Set<UUID> hands = roomRaisedHands.get(roomId);
        if (hands != null) {
            hands.remove(senderId);
        }

        Map<UUID, Map<String, Object>> media = roomMediaStatus.get(roomId);
        if (media != null) {
            media.remove(senderId);
        }

        Profile sender = profileRepository.findById(senderId).orElse(null);
        String senderName = sender != null ? sender.getFullName() : "Student";

        log.info("User {} ({}) left Live Room {}", senderId, senderName, roomId);

        List<Map<String, Object>> updatedList = buildParticipantsList(roomId);

        if (participants != null && !participants.isEmpty()) {
            Map<String, Object> outbound = new HashMap<>();
            outbound.put("type", "ROOM_USER_LEFT");
            outbound.put("roomId", roomId);
            outbound.put("userId", senderId.toString());
            outbound.put("userName", senderName);
            outbound.put("participants", updatedList);

            String json = objectMapper.writeValueAsString(outbound);
            broadcastToUsers(participants, json);
        }
    }

    private void handleGetRoomParticipants(WsMessage wsMsg, WebSocketSession session) throws IOException {
        String roomId = wsMsg.getRoomId();
        if (!StringUtils.hasText(roomId)) return;

        List<Map<String, Object>> list = buildParticipantsList(roomId);
        Map<String, Object> outbound = new HashMap<>();
        outbound.put("type", "ROOM_PARTICIPANTS");
        outbound.put("roomId", roomId);
        outbound.put("participants", list);

        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(outbound)));
    }

    private void handleRaiseHand(UUID senderId, WsMessage wsMsg) throws IOException {
        String roomId = wsMsg.getRoomId();
        if (!StringUtils.hasText(roomId)) return;

        roomRaisedHands.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(senderId);

        Profile sender = profileRepository.findById(senderId).orElse(null);
        String senderName = sender != null ? sender.getFullName() : "Student";
        String senderAvatar = sender != null ? sender.getAvatarUrl() : "";

        Set<UUID> participants = roomParticipants.get(roomId);
        if (participants != null) {
            Map<String, Object> outbound = new HashMap<>();
            outbound.put("type", "USER_RAISED_HAND");
            outbound.put("roomId", roomId);
            outbound.put("userId", senderId.toString());
            outbound.put("userName", senderName);
            outbound.put("userAvatar", senderAvatar);
            outbound.put("timestamp", Instant.now().toEpochMilli());

            String json = objectMapper.writeValueAsString(outbound);
            broadcastToUsers(participants, json);
        }
    }

    private void handleLowerHand(UUID senderId, WsMessage wsMsg) throws IOException {
        String roomId = wsMsg.getRoomId();
        if (!StringUtils.hasText(roomId)) return;

        Set<UUID> hands = roomRaisedHands.get(roomId);
        if (hands != null) {
            hands.remove(senderId);
        }

        Set<UUID> participants = roomParticipants.get(roomId);
        if (participants != null) {
            Map<String, Object> outbound = new HashMap<>();
            outbound.put("type", "USER_LOWERED_HAND");
            outbound.put("roomId", roomId);
            outbound.put("userId", senderId.toString());

            String json = objectMapper.writeValueAsString(outbound);
            broadcastToUsers(participants, json);
        }
    }

    private void handleMediaStatus(UUID senderId, WsMessage wsMsg) throws IOException {
        String roomId = wsMsg.getRoomId();
        if (!StringUtils.hasText(roomId)) return;

        Map<UUID, Map<String, Object>> roomMedia = roomMediaStatus.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>());
        Map<String, Object> userMedia = roomMedia.computeIfAbsent(senderId, k -> new ConcurrentHashMap<>());
        if (wsMsg.getIsMuted() != null) userMedia.put("isMuted", wsMsg.getIsMuted());
        if (wsMsg.getIsCameraOff() != null) userMedia.put("isCameraOff", wsMsg.getIsCameraOff());
        if (wsMsg.getIsScreenSharing() != null) userMedia.put("isScreenSharing", wsMsg.getIsScreenSharing());

        Set<UUID> participants = roomParticipants.get(roomId);
        if (participants != null) {
            Map<String, Object> outbound = new HashMap<>();
            outbound.put("type", "USER_MEDIA_STATUS");
            outbound.put("roomId", roomId);
            outbound.put("userId", senderId.toString());
            outbound.put("isMuted", wsMsg.getIsMuted());
            outbound.put("isCameraOff", wsMsg.getIsCameraOff());
            outbound.put("isScreenSharing", wsMsg.getIsScreenSharing());

            String json = objectMapper.writeValueAsString(outbound);
            broadcastToUsers(participants, json);
        }
    }

    private void handleRoomReaction(UUID senderId, WsMessage wsMsg) throws IOException {
        String roomId = wsMsg.getRoomId();
        if (!StringUtils.hasText(roomId) || !StringUtils.hasText(wsMsg.getEmoji())) return;

        Profile sender = profileRepository.findById(senderId).orElse(null);
        String senderName = sender != null ? sender.getFullName() : "Student";

        Set<UUID> participants = roomParticipants.get(roomId);
        if (participants != null) {
            Map<String, Object> outbound = new HashMap<>();
            outbound.put("type", "ROOM_REACTION");
            outbound.put("roomId", roomId);
            outbound.put("userId", senderId.toString());
            outbound.put("userName", senderName);
            outbound.put("emoji", wsMsg.getEmoji());

            String json = objectMapper.writeValueAsString(outbound);
            broadcastToUsers(participants, json);
        }
    }

    private List<Map<String, Object>> buildParticipantsList(String roomId) {
        List<Map<String, Object>> list = new ArrayList<>();
        Set<UUID> userIds = roomParticipants.get(roomId);
        if (userIds == null || userIds.isEmpty()) {
            return list;
        }

        Set<UUID> raisedHands = roomRaisedHands.getOrDefault(roomId, Collections.emptySet());
        Map<UUID, Map<String, Object>> media = roomMediaStatus.getOrDefault(roomId, Collections.emptyMap());

        for (UUID uId : userIds) {
            Profile profile = profileRepository.findById(uId).orElse(null);
            Map<String, Object> pMap = new HashMap<>();
            pMap.put("userId", uId.toString());
            pMap.put("fullName", profile != null ? profile.getFullName() : "Student");
            pMap.put("avatarUrl", profile != null ? profile.getAvatarUrl() : "");
            pMap.put("college", profile != null ? profile.getCollege() : "");
            pMap.put("handRaised", raisedHands.contains(uId));

            Map<String, Object> userMedia = media.get(uId);
            pMap.put("isMuted", userMedia != null ? userMedia.getOrDefault("isMuted", false) : false);
            pMap.put("isCameraOff", userMedia != null ? userMedia.getOrDefault("isCameraOff", false) : false);
            pMap.put("isScreenSharing", userMedia != null ? userMedia.getOrDefault("isScreenSharing", false) : false);

            list.add(pMap);
        }
        return list;
    }

    private void handleRoomChatMessage(UUID senderId, WsMessage wsMsg) throws IOException {
        if (!StringUtils.hasText(wsMsg.getRoomId()) || !StringUtils.hasText(wsMsg.getMessage())) {
            return;
        }

        UUID dbRoomId;
        try {
            dbRoomId = UUID.fromString(wsMsg.getRoomId());
        } catch (IllegalArgumentException e) {
            dbRoomId = UUID.nameUUIDFromBytes(wsMsg.getRoomId().getBytes(StandardCharsets.UTF_8));
        }

        // Save to database
        DoubtMessage dbMsg = DoubtMessage.builder()
                .roomId(dbRoomId)
                .senderId(senderId)
                .message(wsMsg.getMessage())
                .createdAt(Instant.now())
                .build();
        try {
            doubtMessageRepository.save(dbMsg);
        } catch (Exception e) {
            log.warn("Could not persist doubt message to DB: {}", e.getMessage());
        }

        // Fetch sender details
        Profile sender = profileRepository.findById(senderId).orElse(null);
        String senderName = sender != null ? sender.getFullName() : "Student";
        String senderAvatar = sender != null ? sender.getAvatarUrl() : "";

        // Broadcast to all participants in this room
        Set<UUID> participants = roomParticipants.get(wsMsg.getRoomId());
        if (participants != null) {
            Map<String, Object> outboundPayload = new HashMap<>();
            outboundPayload.put("type", "ROOM_MSG");
            outboundPayload.put("roomId", wsMsg.getRoomId());
            outboundPayload.put("senderId", senderId.toString());
            outboundPayload.put("senderName", senderName);
            outboundPayload.put("senderAvatar", senderAvatar);
            outboundPayload.put("message", wsMsg.getMessage());
            outboundPayload.put("createdAt", dbMsg.getCreatedAt().toString());

            String outboundJson = objectMapper.writeValueAsString(outboundPayload);
            broadcastToUsers(participants, outboundJson);
        }
    }

    private void handleDirectMessage(UUID senderId, WsMessage wsMsg) throws IOException {
        if (wsMsg.getChatId() == null || !StringUtils.hasText(wsMsg.getMessage())) {
            return;
        }

        DirectChat chat = directChatRepository.findById(wsMsg.getChatId()).orElse(null);
        if (chat == null) {
            return;
        }

        // Identify recipient
        UUID recipientId = chat.getUser1Id().equals(senderId) ? chat.getUser2Id() : chat.getUser1Id();

        // Save to database
        DirectMessage dbMsg = DirectMessage.builder()
                .chatId(wsMsg.getChatId())
                .senderId(senderId)
                .message(wsMsg.getMessage())
                .createdAt(Instant.now())
                .build();
        directMessageRepository.save(dbMsg);

        // Fetch sender details
        Profile sender = profileRepository.findById(senderId).orElse(null);
        String senderName = sender != null ? sender.getFullName() : "Student";
        String senderAvatar = sender != null ? sender.getAvatarUrl() : "";

        Map<String, Object> outboundPayload = new HashMap<>();
        outboundPayload.put("type", "DIRECT_MSG");
        outboundPayload.put("chatId", wsMsg.getChatId().toString());
        outboundPayload.put("senderId", senderId.toString());
        outboundPayload.put("senderName", senderName);
        outboundPayload.put("senderAvatar", senderAvatar);
        outboundPayload.put("message", wsMsg.getMessage());
        outboundPayload.put("createdAt", dbMsg.getCreatedAt().toString());

        String outboundJson = objectMapper.writeValueAsString(outboundPayload);

        // Forward to both sender and recipient sessions
        sendToUser(senderId, outboundJson);
        sendToUser(recipientId, outboundJson);
    }

    private void handleRtcSignal(UUID senderId, WsMessage wsMsg) throws IOException {
        if (wsMsg.getTargetUserId() == null) {
            return;
        }

        Profile sender = profileRepository.findById(senderId).orElse(null);
        String senderName = sender != null ? sender.getFullName() : "Student";
        String senderAvatar = sender != null ? sender.getAvatarUrl() : "";

        Map<String, Object> outboundPayload = new HashMap<>();
        outboundPayload.put("type", "RTC_SIGNAL");
        outboundPayload.put("senderId", senderId.toString());
        outboundPayload.put("senderName", senderName);
        outboundPayload.put("senderAvatar", senderAvatar);
        outboundPayload.put("roomId", wsMsg.getRoomId());
        outboundPayload.put("signalData", wsMsg.getSignalData());

        String outboundJson = objectMapper.writeValueAsString(outboundPayload);
        sendToUser(wsMsg.getTargetUserId(), outboundJson);
    }

    private void sendToUser(UUID userId, String payload) {
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(new TextMessage(payload));
                    } catch (IOException e) {
                        log.error("Failed to send message to session {}: {}", session.getId(), e.getMessage());
                    }
                }
            }
        }
    }

    private void broadcastToUsers(Collection<UUID> userIds, String payload) {
        if (userIds == null) return;
        for (UUID uId : userIds) {
            sendToUser(uId, payload);
        }
    }

    private void updatePresenceInRedis(UUID userId, boolean isOnline) {
        if (redisTemplate == null) {
            return;
        }
        try {
            String key = "user:" + userId.toString() + ":online";
            if (isOnline) {
                redisTemplate.opsForValue().set(key, "true", 60, TimeUnit.SECONDS);
            } else {
                redisTemplate.delete(key);
            }
        } catch (Exception e) {
            log.debug("Redis presence cache update bypassed: {}", e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        UUID userId = sessionUsers.remove(session.getId());
        if (userId != null) {
            Set<WebSocketSession> sessions = userSessions.get(userId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    userSessions.remove(userId);
                    updatePresenceInRedis(userId, false);
                    log.info("User {} disconnected completely", userId);
                }
            }

            // Remove from room participants mapping and notify peers
            for (Map.Entry<String, Set<UUID>> entry : roomParticipants.entrySet()) {
                String roomId = entry.getKey();
                Set<UUID> members = entry.getValue();
                if (members.remove(userId)) {
                    Set<UUID> hands = roomRaisedHands.get(roomId);
                    if (hands != null) hands.remove(userId);

                    Map<UUID, Map<String, Object>> media = roomMediaStatus.get(roomId);
                    if (media != null) media.remove(userId);

                    List<Map<String, Object>> updatedList = buildParticipantsList(roomId);
                    if (!members.isEmpty()) {
                        Map<String, Object> outbound = new HashMap<>();
                        outbound.put("type", "ROOM_USER_LEFT");
                        outbound.put("roomId", roomId);
                        outbound.put("userId", userId.toString());
                        outbound.put("participants", updatedList);

                        String json = objectMapper.writeValueAsString(outbound);
                        broadcastToUsers(members, json);
                    }
                }
            }
        }
    }

    public boolean isUserOnline(UUID userId) {
        if (redisTemplate != null) {
            try {
                String key = "user:" + userId.toString() + ":online";
                return Boolean.TRUE.equals(redisTemplate.hasKey(key));
            } catch (Exception e) {
                // fallback
            }
        }
        Set<WebSocketSession> sessions = userSessions.get(userId);
        return sessions != null && !sessions.isEmpty();
    }

    private UUID extractUserId(WebSocketSession session) {
        try {
            URI uri = session.getUri();
            if (uri == null) return null;

            String query = uri.getQuery();
            if (!StringUtils.hasText(query)) return null;

            String token = null;
            for (String param : query.split("&")) {
                String[] pair = param.split("=");
                if (pair.length == 2 && "token".equalsIgnoreCase(pair[0])) {
                    token = pair[1];
                    break;
                }
            }

            if (!StringUtils.hasText(token)) return null;

            if (verifySignature && StringUtils.hasText(jwtSecret)) {
                Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
                return UUID.fromString(claims.getSubject());
            } else {
                String[] parts = token.split("\\.");
                if (parts.length >= 2) {
                    String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                    Map<String, Object> claims = objectMapper.readValue(payloadJson, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
                    return UUID.fromString((String) claims.get("sub"));
                }
            }
        } catch (Exception e) {
            log.error("Failed to authenticate WebSocket connection: {}", e.getMessage());
        }
        return null;
    }

    @SuppressWarnings("unused")
    private static class WsMessage {
        private String type; // HEARTBEAT, JOIN_ROOM, LEAVE_ROOM, CHAT_MSG, DIRECT_MSG, RTC_SIGNAL, RAISE_HAND, LOWER_HAND, MEDIA_STATUS, ROOM_REACTION, GET_ROOM_PARTICIPANTS
        private String roomId;
        private UUID chatId;
        private UUID senderId;
        private String message;
        private UUID targetUserId;
        private Object signalData;
        private Boolean isMuted;
        private Boolean isCameraOff;
        private Boolean isScreenSharing;
        private String emoji;

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getRoomId() { return roomId; }
        public void setRoomId(String roomId) { this.roomId = roomId; }

        public UUID getChatId() { return chatId; }
        public void setChatId(UUID chatId) { this.chatId = chatId; }

        public UUID getSenderId() { return senderId; }
        public void setSenderId(UUID senderId) { this.senderId = senderId; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public UUID getTargetUserId() { return targetUserId; }
        public void setTargetUserId(UUID targetUserId) { this.targetUserId = targetUserId; }

        public Object getSignalData() { return signalData; }
        public void setSignalData(Object signalData) { this.signalData = signalData; }

        public Boolean getIsMuted() { return isMuted; }
        public void setIsMuted(Boolean isMuted) { this.isMuted = isMuted; }

        public Boolean getIsCameraOff() { return isCameraOff; }
        public void setIsCameraOff(Boolean isCameraOff) { this.isCameraOff = isCameraOff; }

        public Boolean getIsScreenSharing() { return isScreenSharing; }
        public void setIsScreenSharing(Boolean isScreenSharing) { this.isScreenSharing = isScreenSharing; }

        public String getEmoji() { return emoji; }
        public void setEmoji(String emoji) { this.emoji = emoji; }

        private Boolean isCameraOff;
        private Boolean isScreenSharing;
        private String emoji;
        private String action; // MUTE_ALL, LOWER_ALL_HANDS, LOCK_SCREEN_SHARE, UNLOCK_SCREEN_SHARE

        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
    }

    private void handleHostControl(UUID senderId, WsMessage wsMsg) throws IOException {
        String roomId = wsMsg.getRoomId();
        if (!StringUtils.hasText(roomId) || !StringUtils.hasText(wsMsg.getAction())) return;

        Set<UUID> participants = roomParticipants.get(roomId);
        if (participants == null || participants.isEmpty()) return;

        if ("LOWER_ALL_HANDS".equalsIgnoreCase(wsMsg.getAction())) {
            Set<UUID> hands = roomRaisedHands.get(roomId);
            if (hands != null) hands.clear();
        }

        Profile sender = profileRepository.findById(senderId).orElse(null);
        String hostName = sender != null ? sender.getFullName() : "Host";

        Map<String, Object> outbound = new HashMap<>();
        outbound.put("type", "HOST_ACTION");
        outbound.put("roomId", roomId);
        outbound.put("hostId", senderId.toString());
        outbound.put("hostName", hostName);
        outbound.put("action", wsMsg.getAction());
        outbound.put("participants", buildParticipantsList(roomId));

        String json = objectMapper.writeValueAsString(outbound);
        broadcastToUsers(participants, json);
    }
}
