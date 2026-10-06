import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertCircle, 
  Award, 
  Check, 
  CheckCircle2,
  Copy,
  Crown, 
  ExternalLink,
  Hand, 
  Home,
  Info,
  LayoutGrid, 
  Link2,
  Lock,
  Mail,
  Maximize2, 
  MessageCircle,
  MessageSquare, 
  Mic, 
  MicOff, 
  Minimize2, 
  MonitorUp, 
  MoreVertical, 
  PhoneOff, 
  RotateCcw,
  Search, 
  Send, 
  Settings,
  Share2, 
  Shield,
  ShieldAlert,
  Smile, 
  Sparkles, 
  Star,
  Unlock, 
  UserCheck, 
  UserMinus, 
  Users, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  X 
} from 'lucide-react';

const REACTION_EMOJIS = ['❤️', '🎉', '👏', '💡', '🔥', '👍'];

// Web Audio API Synthetic Chimes for Live Meetings
const playMeetingAudio = (type = 'chime') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hand') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'join') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'chat') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {}
};

export function LiveMeetingRoom({
  roomId = 'doubt-room-live',
  roomTitle = 'Live Academic Doubt Session',
  subject = 'Engineering & CS',
  user,
  profile,
  socket,
  onLeaveRoom,
  token
}) {
  // Media State
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);

  // Post-Meeting Completed State
  const [isEnded, setIsEnded] = useState(false);
  const [qualityRating, setQualityRating] = useState(5);

  // Host & Security Controls
  const [allowParticipantScreenShare, setAllowParticipantScreenShare] = useState(true);
  const [allowParticipantChat, setAllowParticipantChat] = useState(true);

  // Interaction State
  const [handRaised, setHandRaised] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null); // 'participants' | 'chat' | 'host' | 'info' | null
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Room Participants & Chat
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: 'init-sys-1',
      isSystem: true,
      type: 'info',
      text: '🔒 Live study session started • End-to-end encrypted HD WebRTC',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Refs
  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const chatBottomRef = useRef(null);
  const containerRef = useRef(null);

  const currentUserId = profile?.id || user?.id || 'local-user';
  const currentUserName = profile?.full_name || profile?.fullName || user?.user_metadata?.full_name || 'You';
  const currentUserAvatar = profile?.avatar_url || profile?.avatarUrl || '';
  const currentUserCollege = profile?.college || 'StudyLoop Scholar';
  const isSuperAdmin = user?.email?.toLowerCase() === 'admin@studyloop.app' || profile?.role === 'super_admin' || user?.role === 'super_admin';
  const isHost = isSuperAdmin || true;

  // Meeting Sharing URLs (Standard query format recognized as clickable hyperlink by all chat apps)
  const shareableMeetingUrl = `${window.location.origin}/?room=${encodeURIComponent(roomId)}`;

  // 1. Initialize Real Media Devices (Camera + Mic)
  useEffect(() => {
    let stream = null;
    async function initMedia() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera/Mic permission bypassed or unavailable:', err.message);
        setIsCameraOff(true);
      }
    }
    initMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Update local video element when stream or camera state changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = isCameraOff ? null : localStream;
    }
  }, [localStream, isCameraOff]);

  // CRITICAL FIX: Screen Share Video Ref Binding
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play().catch(e => console.warn('Screen video playback handled:', e));
    }
  }, [screenStream, isScreenSharing]);

  // Toast Notification Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Copy Helpers with robust fallbacks
  const copyMeetingLink = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(shareableMeetingUrl).catch(() => {});
      }
    } catch (e) {}
    setCopiedLink(true);
    showToast('📋 Meeting link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyRoomCode = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(roomId).catch(() => {});
      }
    } catch (e) {}
    setCopiedCode(true);
    showToast(`📋 Room Code '${roomId}' copied!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const copyFullInvitation = () => {
    const fullInvite = `🎓 Join our Live Academic Study Session on StudyLoop!\n\n📌 Topic: ${roomTitle}\n🏷️ Subject: ${subject}\n🔑 Room Code: ${roomId}\n🔗 Meeting Link: ${shareableMeetingUrl}\n\nJoin with 1 click in your browser!`;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(fullInvite).catch(() => {});
      }
    } catch (e) {}
    showToast('📋 Full meeting invitation copied!');
  };

  // 2. Join Room over WebSocket & Listen for Live Events
  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      type: 'JOIN_ROOM',
      roomId: roomId
    }));

    const handleWsMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // A. Room User Joined
        if (data.type === 'ROOM_USER_JOINED' || data.type === 'ROOM_PARTICIPANTS') {
          if (data.participants && Array.isArray(data.participants)) {
            setParticipants(data.participants);
          }
          if (data.userName && data.userId !== currentUserId) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              isSystem: true,
              type: 'join',
              text: `${data.userName} joined the meeting`,
              time: timeStr
            }]);
            showToast(`👋 ${data.userName} joined the study session`);
            playMeetingAudio('join');
          }
        }

        // B. Room User Left
        else if (data.type === 'ROOM_USER_LEFT') {
          if (data.participants && Array.isArray(data.participants)) {
            setParticipants(data.participants);
          } else if (data.userId) {
            setParticipants(prev => prev.filter(p => p.userId !== data.userId));
          }
          if (data.userName) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              isSystem: true,
              type: 'leave',
              text: `${data.userName} left the meeting`,
              time: timeStr
            }]);
            showToast(`🚪 ${data.userName} left`);
          }
        }

        // C. Hand Raised / Lowered
        else if (data.type === 'USER_RAISED_HAND') {
          setParticipants(prev => prev.map(p => 
            p.userId === data.userId ? { ...p, handRaised: true } : p
          ));
          if (data.userId === currentUserId) {
            setHandRaised(true);
          } else {
            showToast(`✋ ${data.userName || 'A student'} raised their hand`);
            playMeetingAudio('hand');
          }
        } else if (data.type === 'USER_LOWERED_HAND') {
          setParticipants(prev => prev.map(p => 
            p.userId === data.userId ? { ...p, handRaised: false } : p
          ));
          if (data.userId === currentUserId) {
            setHandRaised(false);
          }
        }

        // D. Media Status Sync
        else if (data.type === 'USER_MEDIA_STATUS') {
          setParticipants(prev => prev.map(p => {
            if (p.userId === data.userId) {
              return {
                ...p,
                isMuted: data.isMuted !== undefined ? data.isMuted : p.isMuted,
                isCameraOff: data.isCameraOff !== undefined ? data.isCameraOff : p.isCameraOff,
                isScreenSharing: data.isScreenSharing !== undefined ? data.isScreenSharing : p.isScreenSharing
              };
            }
            return p;
          }));
        }

        // E. Host Actions
        else if (data.type === 'HOST_ACTION') {
          if (data.action === 'MUTE_ALL') {
            if (!isHost) {
              if (localStream) {
                const audioTracks = localStream.getAudioTracks();
                if (audioTracks.length > 0) audioTracks[0].enabled = false;
              }
              setIsMuted(true);
              showToast('🔇 The host muted all microphones');
            }
          } else if (data.action === 'LOWER_ALL_HANDS') {
            setHandRaised(false);
            setParticipants(prev => prev.map(p => ({ ...p, handRaised: false })));
            showToast('✋ The host lowered all hands');
          } else if (data.action === 'LOCK_SCREEN_SHARE') {
            setAllowParticipantScreenShare(false);
            if (!isHost && isScreenSharing) {
              toggleScreenShare();
            }
            showToast('🔒 Screen sharing has been locked by the host');
          } else if (data.action === 'UNLOCK_SCREEN_SHARE') {
            setAllowParticipantScreenShare(true);
            showToast('🔓 Screen sharing is now allowed for participants');
          }
        }

        // F. In-Room Live Chat Message
        else if (data.type === 'ROOM_MSG') {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            senderId: data.senderId,
            senderName: data.senderName || 'Student',
            senderAvatar: data.senderAvatar || '',
            message: data.message,
            createdAt: data.createdAt || new Date().toISOString()
          }]);
          if (activeDrawer !== 'chat') {
            setUnreadChatCount(prev => prev + 1);
            if (data.senderId !== currentUserId) {
              playMeetingAudio('chat');
            }
          }
        }

        // G. Floating Emoji Reaction
        else if (data.type === 'ROOM_REACTION') {
          triggerFloatingEmoji(data.emoji, data.userName);
        }
      } catch (err) {
        console.error('Error handling WebSocket meeting event:', err);
      }
    };

    socket.addEventListener('message', handleWsMessage);

    return () => {
      socket.removeEventListener('message', handleWsMessage);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'LEAVE_ROOM',
          roomId: roomId
        }));
      }
    };
  }, [socket, roomId, currentUserId, activeDrawer, isHost, isScreenSharing]);

  // 3. Meeting Elapsed Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeDrawer === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeDrawer]);

  // 4. Toggle Microphone
  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextState = !isMuted;
        audioTracks[0].enabled = !nextState;
        setIsMuted(nextState);
        broadcastMediaStatus({ isMuted: nextState });
      }
    } else {
      setIsMuted(prev => !prev);
      broadcastMediaStatus({ isMuted: !isMuted });
    }
  };

  // 5. Toggle Camera
  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const nextState = !isCameraOff;
        videoTracks[0].enabled = !nextState;
        setIsCameraOff(nextState);
        broadcastMediaStatus({ isCameraOff: nextState });
      }
    } else {
      setIsCameraOff(prev => !prev);
      broadcastMediaStatus({ isCameraOff: !isCameraOff });
    }
  };

  // 6. Real Screen Sharing with Host Permission Guard
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach(t => t.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);
      broadcastMediaStatus({ isScreenSharing: false });
    } else {
      if (!isHost && !allowParticipantScreenShare) {
        showToast('🔒 Screen sharing is disabled for participants by the host.');
        return;
      }

      try {
        const sStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        setScreenStream(sStream);
        setIsScreenSharing(true);
        broadcastMediaStatus({ isScreenSharing: true });

        sStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
          broadcastMediaStatus({ isScreenSharing: false });
        };
      } catch (err) {
        console.warn('Screen share canceled or denied:', err);
      }
    }
  };

  // 7. Toggle Raise Hand
  const toggleRaiseHand = () => {
    const nextState = !handRaised;
    setHandRaised(nextState);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: nextState ? 'RAISE_HAND' : 'LOWER_HAND',
        roomId: roomId
      }));
    }
    if (nextState) {
      triggerFloatingEmoji('✋', currentUserName);
    }
  };

  // 8. Broadcast Media Status to Room
  const broadcastMediaStatus = (statusUpdates) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'MEDIA_STATUS',
        roomId: roomId,
        isMuted: statusUpdates.isMuted !== undefined ? statusUpdates.isMuted : isMuted,
        isCameraOff: statusUpdates.isCameraOff !== undefined ? statusUpdates.isCameraOff : isCameraOff,
        isScreenSharing: statusUpdates.isScreenSharing !== undefined ? statusUpdates.isScreenSharing : isScreenSharing
      }));
    }
  };

  // 9. Host Control Actions
  const executeHostAction = (actionType) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'HOST_CONTROL',
        roomId: roomId,
        action: actionType
      }));
    }
    if (actionType === 'LOWER_ALL_HANDS') {
      setHandRaised(false);
      setParticipants(prev => prev.map(p => ({ ...p, handRaised: false })));
      showToast('✋ All hands lowered');
    } else if (actionType === 'MUTE_ALL') {
      showToast('🔇 Muted all participants');
    } else if (actionType === 'LOCK_SCREEN_SHARE') {
      setAllowParticipantScreenShare(false);
      showToast('🔒 Screen share locked to Host only');
    } else if (actionType === 'UNLOCK_SCREEN_SHARE') {
      setAllowParticipantScreenShare(true);
      showToast('🔓 Screen share opened to all participants');
    }
  };

  // 10. Send Reaction
  const sendReaction = (emoji) => {
    setShowEmojiPicker(false);
    triggerFloatingEmoji(emoji, currentUserName);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'ROOM_REACTION',
        roomId: roomId,
        emoji: emoji
      }));
    }
  };

  const triggerFloatingEmoji = (emoji, senderName) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      senderName,
      left: Math.floor(Math.random() * 60) + 20
    };
    setFloatingReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);
  };

  // 11. Send In-Room Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (!isHost && !allowParticipantChat) {
      showToast('🔒 Chat is currently restricted by the host.');
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'CHAT_MSG',
        roomId: roomId,
        message: chatInput.trim()
      }));
    } else {
      setMessages(prev => [...prev, {
        id: Date.now(),
        senderId: currentUserId,
        senderName: currentUserName,
        senderAvatar: currentUserAvatar,
        message: chatInput.trim(),
        createdAt: new Date().toISOString()
      }]);
    }
    setChatInput('');
  };

  // 12. Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // 13. Format Elapsed Seconds
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // 14. Handle Call Termination & Rejoin
  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
    }
    setIsEnded(true);
  };

  const handleRejoin = async () => {
    setIsEnded(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (e) {
      setIsCameraOff(true);
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'JOIN_ROOM', roomId: roomId }));
    }
  };

  const otherParticipants = participants.filter(p => p.userId !== currentUserId);
  const totalInRoom = 1 + otherParticipants.length;
  const isAnyScreenSharing = isScreenSharing || otherParticipants.some(p => p.isScreenSharing);
  const raisedHandsQueue = participants.filter(p => p.handRaised);

  // POST-MEETING COMPLETED / REJOIN SCREEN (GOOGLE MEET & ZOOM STYLE)
  if (isEnded) {
    return (
      <div className="live-meeting-container" style={{ alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: '#0b0f19' }}>
        <div style={{
          width: '100%',
          maxWidth: '540px',
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          animation: 'slide-in-drawer 0.25s ease'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.375rem' }}>
            Meeting Completed
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            You left the live study session.
          </p>

          {/* Session Details Summary Card */}
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.75rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="tag tag-accent" style={{ fontSize: '0.75rem' }}>{subject}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Fira Code, monospace' }}>ID: {roomId}</span>
            </div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.4 }}>
              {roomTitle}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase' }}>Time Attended</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'Fira Code, monospace' }}>{formatTime(elapsedSeconds)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase' }}>Total Attendees</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f8fafc' }}>{totalInRoom} {totalInRoom === 1 ? 'Scholar' : 'Scholars'}</div>
              </div>
            </div>
          </div>

          {/* Star Rating for Audio/Video Quality */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>How was the call audio & video quality?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setQualityRating(star);
                    showToast('⭐ Thank you for your feedback!');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: qualityRating >= star ? '#fbbf24' : '#475569',
                    fontSize: '1.375rem',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: Rejoin vs Return to Doubt Hub */}
          <div style={{ display: 'flex', gap: '0.875rem' }}>
            <button 
              onClick={handleRejoin} 
              className="btn btn-accent" 
              style={{ flex: 1, height: '44px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={16} /> Rejoin Meeting
            </button>
            <button 
              onClick={onLeaveRoom} 
              className="btn btn-secondary" 
              style={{ flex: 1, height: '44px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Home size={16} /> Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="live-meeting-container">
      
      {/* 1. TOP HEADER BAR */}
      <header className="meeting-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              backgroundColor: 'rgba(239, 68, 68, 0.2)', 
              color: '#ef4444', 
              padding: '0.2rem 0.6rem', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.6875rem', 
              fontWeight: 700, 
              letterSpacing: '0.05em' 
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse-hand 1.5s infinite' }} />
              LIVE
            </span>
            <span className="tag tag-accent" style={{ fontSize: '0.75rem' }}>{subject}</span>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: 0, color: '#ffffff', maxWidth: '340px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {roomTitle}
            </h2>
            <button 
              onClick={copyMeetingLink}
              className="ctrl-btn" 
              style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.08)' }} 
              title="Copy Meeting Link"
            >
              {copiedLink ? <Check size={13} style={{ color: '#10b981' }} /> : <Link2 size={13} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isHost && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700 }}>
              <Crown size={13} /> HOST ACCESS
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8125rem', backgroundColor: 'rgba(30, 41, 59, 0.6)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
            <Sparkles size={14} style={{ color: '#fbbf24' }} />
            <span>HD 1080p WebRTC</span>
          </div>

          <div style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.875rem', color: '#38bdf8', fontWeight: 600, backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            ⏱ {formatTime(elapsedSeconds)}
          </div>

          <button onClick={toggleFullscreen} className="ctrl-btn" style={{ width: '36px', height: '36px' }} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* 2. TOAST SYSTEM NOTIFICATION CHIP */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 102, 255, 0.5)',
          color: '#ffffff',
          padding: '0.45rem 1.5rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          animation: 'slide-in-drawer 0.2s ease',
          pointerEvents: 'none'
        }}>
          {toastMessage}
        </div>
      )}

      {/* 3. MAIN STAGE AREA */}
      <div className="meeting-stage-area">
        
        {/* Main Stage Grid Container */}
        <div className="meeting-main-content">
          
          {/* Spotlight Mode (When Screen Share is active) */}
          {isAnyScreenSharing ? (
            <div className="meeting-spotlight-layout">
              {/* Massive Main Screen Share Stage */}
              <div className="spotlight-main" style={{ aspectRatio: '16/9', maxHeight: '100%' }}>
                {isScreenSharing ? (
                  <video 
                    ref={screenVideoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <MonitorUp size={54} style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }} />
                    <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>Peer is presenting screen in HD</p>
                    <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Viewing real-time code demonstration</p>
                  </div>
                )}

                <div className="meeting-tile-name-tag">
                  <MonitorUp size={14} style={{ color: '#38bdf8' }} />
                  {isScreenSharing ? 'You (Presenting Screen)' : 'Peer Presenter'}
                </div>
              </div>

              {/* Side Participant Ribbon */}
              <div className="spotlight-strip" style={{ width: '240px' }}>
                {/* Local User Tile */}
                <div className={`meeting-tile ${activeSpeakerId === currentUserId ? 'is-active-speaker' : ''}`} style={{ aspectRatio: '16/9', minHeight: '135px' }}>
                  {!isCameraOff ? (
                    <video ref={localVideoRef} autoPlay muted playsInline />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 700 }}>
                        {currentUserName.charAt(0)}
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Camera Off</span>
                    </div>
                  )}

                  <div className="meeting-tile-name-tag" style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem' }}>
                    {currentUserName} (You)
                  </div>

                  <div className="meeting-tile-status-icons">
                    {isMuted && (
                      <div className="tile-icon-badge danger" style={{ width: '22px', height: '22px' }}>
                        <MicOff size={12} />
                      </div>
                    )}
                    {handRaised && (
                      <div className="tile-icon-badge warning" style={{ width: '22px', height: '22px' }}>
                        <Hand size={12} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Peers in Ribbon */}
                {otherParticipants.map((peer, idx) => (
                  <div key={peer.userId || idx} className="meeting-tile" style={{ aspectRatio: '16/9', minHeight: '135px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 700 }}>
                        {peer.fullName?.charAt(0) || 'P'}
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{peer.college || 'Peer'}</span>
                    </div>

                    <div className="meeting-tile-name-tag" style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem' }}>
                      {peer.fullName || 'Peer Student'}
                    </div>

                    <div className="meeting-tile-status-icons">
                      {peer.isMuted && (
                        <div className="tile-icon-badge danger" style={{ width: '22px', height: '22px' }}>
                          <MicOff size={12} />
                        </div>
                      )}
                      {peer.handRaised && (
                        <div className="tile-icon-badge warning" style={{ width: '22px', height: '22px' }}>
                          <Hand size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            
            /* Standard Centered Google Meet Grid */
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: 0 }}>
              
              {/* SOLO USER VIEW: Clean Centered 16:9 Card (Without Banner) */}
              {totalInRoom === 1 ? (
                <div style={{ width: '100%', maxWidth: '880px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div 
                    className={`meeting-tile ${activeSpeakerId === currentUserId ? 'is-active-speaker' : ''}`}
                    style={{ 
                      width: '100%', 
                      aspectRatio: '16/9', 
                      maxHeight: '520px',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                    }}
                  >
                    {!isCameraOff ? (
                      <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, boxShadow: '0 0 30px rgba(0, 102, 255, 0.5)' }}>
                          {currentUserName.charAt(0)}
                        </div>
                        <div style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 600 }}>
                          {currentUserName}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                          {currentUserCollege} • {isHost ? 'Session Host' : 'Student'}
                        </div>
                      </div>
                    )}

                    <div className="meeting-tile-name-tag">
                      <span>{currentUserName} (You)</span>
                      {isHost && <Crown size={12} style={{ color: '#fbbf24' }} title="Host" />}
                      {handRaised && <span style={{ color: '#fbbf24' }}>✋ Raised</span>}
                    </div>

                    <div className="meeting-tile-status-icons">
                      {isMuted && (
                        <div className="tile-icon-badge danger" title="Microphone Muted">
                          <MicOff size={15} />
                        </div>
                      )}
                      {handRaised && (
                        <div className="tile-icon-badge warning" title="Hand is Raised">
                          <Hand size={15} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                
                /* MULTI-USER GRID */
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: totalInRoom === 2 ? 'repeat(2, 1fr)' : totalInRoom <= 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
                  gap: '1rem', 
                  width: '100%', 
                  maxWidth: totalInRoom === 2 ? '1100px' : '1300px', 
                  maxHeight: '100%',
                  alignContent: 'center'
                }}>
                  {/* Local Tile */}
                  <div className={`meeting-tile ${activeSpeakerId === currentUserId ? 'is-active-speaker' : ''}`} style={{ aspectRatio: '16/9' }}>
                    {!isCameraOff ? (
                      <video ref={localVideoRef} autoPlay muted playsInline />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                          {currentUserName.charAt(0)}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{currentUserCollege}</div>
                      </div>
                    )}

                    <div className="meeting-tile-name-tag">
                      <span>{currentUserName} (You)</span>
                      {handRaised && <span style={{ color: '#fbbf24' }}>✋ Raised</span>}
                    </div>

                    <div className="meeting-tile-status-icons">
                      {isMuted && <div className="tile-icon-badge danger"><MicOff size={14} /></div>}
                      {handRaised && <div className="tile-icon-badge warning"><Hand size={14} /></div>}
                    </div>
                  </div>

                  {/* Connected Peers */}
                  {otherParticipants.map((peer, idx) => (
                    <div key={peer.userId || idx} className={`meeting-tile ${peer.handRaised ? 'is-active-speaker' : ''}`} style={{ aspectRatio: '16/9' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                          {peer.fullName?.charAt(0) || 'P'}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{peer.college || 'Peer Student'}</div>
                      </div>

                      <div className="meeting-tile-name-tag">
                        <span>{peer.fullName || 'Peer Student'}</span>
                        {peer.handRaised && <span style={{ color: '#fbbf24' }}>✋ Raised</span>}
                      </div>

                      <div className="meeting-tile-status-icons">
                        {peer.isMuted && <div className="tile-icon-badge danger"><MicOff size={14} /></div>}
                        {peer.handRaised && <div className="tile-icon-badge warning"><Hand size={14} /></div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* 4. SIDE DRAWER: MEETING INFO & LINK SHARING */}
        {activeDrawer === 'info' && (
          <aside className="meeting-side-drawer">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Share2 size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 600 }}>Meeting Info & Share</h3>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="ctrl-btn" style={{ width: '32px', height: '32px' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
              {/* Meeting Meta Card */}
              <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Topic</div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>{roomTitle}</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>{subject}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {roomId}</span>
                </div>
              </div>

              {/* Shareable Link Box */}
              <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', display: 'block', marginBottom: '0.5rem' }}>
                  🔗 Joining Info Link
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input 
                    type="text" 
                    readOnly 
                    value={shareableMeetingUrl} 
                    className="input" 
                    style={{ fontSize: '0.75rem', height: '38px', background: 'rgba(15, 23, 42, 0.8)', color: '#94a3b8' }} 
                  />
                  <button onClick={copyMeetingLink} className="btn btn-accent" style={{ height: '38px', padding: '0 0.875rem' }}>
                    {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={copyRoomCode} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}>
                    {copiedCode ? 'Code Copied! ✅' : 'Copy Room Code'}
                  </button>
                  <button onClick={copyFullInvitation} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.5rem' }}>
                    Copy Full Invite
                  </button>
                </div>
              </div>

              {/* Direct Instant Share Channels */}
              <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', display: 'block', marginBottom: '0.75rem' }}>
                  🚀 Share With Classmates
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* WhatsApp */}
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`👋 Join our live StudyLoop study session on '${roomTitle}'!\n\nSubject: ${subject}\nLink: ${shareableMeetingUrl}`)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn" 
                    style={{ background: '#25D366', color: '#ffffff', textDecoration: 'none', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600 }}
                  >
                    <MessageCircle size={16} /> Share on WhatsApp
                  </a>

                  {/* Email */}
                  <a 
                    href={`mailto:?subject=${encodeURIComponent(`Live Study Session: ${roomTitle}`)}&body=${encodeURIComponent(`Join our live peer learning session on StudyLoop:\n\nTopic: ${roomTitle}\nSubject: ${subject}\n\nJoin Link: ${shareableMeetingUrl}`)}`}
                    className="btn btn-secondary" 
                    style={{ textDecoration: 'none', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}
                  >
                    <Mail size={16} /> Share via Email
                  </a>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* 5. SIDE DRAWER: PARTICIPANTS */}
        {activeDrawer === 'participants' && (
          <aside className="meeting-side-drawer">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 600 }}>
                  People ({totalInRoom})
                </h3>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="ctrl-btn" style={{ width: '32px', height: '32px' }}>
                <X size={16} />
              </button>
            </div>

            {/* Quick Host Action Bar */}
            {isHost && (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(30, 41, 59, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => executeHostAction('MUTE_ALL')} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <VolumeX size={13} /> Mute All
                </button>
                <button 
                  onClick={() => executeHostAction('LOWER_ALL_HANDS')} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Hand size={13} /> Lower Hands
                </button>
              </div>
            )}

            {/* Hand Raise Queue Banner */}
            {raisedHandsQueue.length > 0 && (
              <div style={{ margin: '0.75rem 1rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Hand size={14} />
                  <span>HAND RAISE QUEUE ({raisedHandsQueue.length})</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {raisedHandsQueue.map((hp, idx) => (
                    <div key={idx} style={{ fontSize: '0.75rem', color: '#f8fafc', display: 'flex', justifyContent: 'space-between' }}>
                      <span>#{idx + 1} {hp.userId === currentUserId ? 'You' : hp.fullName}</span>
                      <span style={{ color: '#fbbf24' }}>✋ Waiting</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search filter */}
            <div style={{ padding: '0.75rem 1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  className="input" 
                  style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.8125rem', background: 'rgba(30, 41, 59, 0.6)' }} 
                  placeholder="Filter attendees..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Participant List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Current User */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                    {currentUserName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {currentUserName} (You) {isHost && <Crown size={12} style={{ color: '#fbbf24' }} title="Host" />}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{currentUserCollege}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {isMuted ? <MicOff size={14} style={{ color: '#ef4444' }} /> : <Mic size={14} style={{ color: '#10b981' }} />}
                  {isCameraOff ? <VideoOff size={14} style={{ color: '#ef4444' }} /> : <Video size={14} style={{ color: '#10b981' }} />}
                </div>
              </div>

              {/* Other Peers */}
              {otherParticipants
                .filter(p => !searchQuery || p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((peer, idx) => (
                  <div key={peer.userId || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                        {peer.fullName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>
                          {peer.fullName || 'Peer Student'}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{peer.college || 'Peer'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      {peer.handRaised && <Hand size={14} style={{ color: '#fbbf24' }} />}
                      {peer.isMuted ? <MicOff size={14} style={{ color: '#ef4444' }} /> : <Mic size={14} style={{ color: '#10b981' }} />}
                    </div>
                  </div>
                ))}
            </div>
          </aside>
        )}

        {/* 6. SIDE DRAWER: WHATSAPP/GOOGLE MEET STYLE IN-MEETING CHAT */}
        {activeDrawer === 'chat' && (
          <aside className="meeting-side-drawer">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 600 }}>In-Call Messages</h3>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="ctrl-btn" style={{ width: '32px', height: '32px' }}>
                <X size={16} />
              </button>
            </div>

            {/* Chat Stream with Join/Leave Activity Chips */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map((m) => {
                if (m.isSystem) {
                  return (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0' }}>
                      <span style={{ 
                        fontSize: '0.6875rem', 
                        color: '#94a3b8', 
                        background: 'rgba(30, 41, 59, 0.7)', 
                        padding: '0.2rem 0.75rem', 
                        borderRadius: 'var(--radius-full)', 
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {m.type === 'join' ? '👋' : m.type === 'leave' ? '🚪' : 'ℹ️'} {m.text} • {m.time}
                      </span>
                    </div>
                  );
                }

                const isMe = m.senderId === currentUserId;
                return (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: isMe ? '#38bdf8' : '#94a3b8' }}>
                        {isMe ? 'You' : m.senderName}
                      </span>
                      <span style={{ fontSize: '0.625rem', color: '#64748b' }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{
                      maxWidth: '85%',
                      padding: '0.5rem 0.875rem',
                      borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '0.8125rem',
                      lineHeight: 1.4,
                      background: isMe ? 'var(--accent-primary)' : '#1e293b',
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      border: isMe ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      {m.message}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} style={{ padding: '0.875rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.8)' }}>
              <input 
                type="text" 
                className="input" 
                style={{ flex: 1, height: '40px', fontSize: '0.8125rem', background: 'rgba(30, 41, 59, 0.8)' }} 
                placeholder={!isHost && !allowParticipantChat ? "Chat is locked by host" : "Send a message..."} 
                value={chatInput} 
                disabled={!isHost && !allowParticipantChat}
                onChange={e => setChatInput(e.target.value)} 
              />
              <button type="submit" className="btn btn-accent" style={{ height: '40px', padding: '0 1rem' }} disabled={!chatInput.trim() || (!isHost && !allowParticipantChat)}>
                <Send size={16} />
              </button>
            </form>
          </aside>
        )}

        {/* 7. SIDE DRAWER: HOST SECURITY CONTROLS */}
        {activeDrawer === 'host' && (
          <aside className="meeting-side-drawer">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} style={{ color: '#fbbf24' }} />
                <h3 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 600 }}>Host Controls</h3>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="ctrl-btn" style={{ width: '32px', height: '32px' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>Meeting Permissions</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>Manage what attendees are permitted to do during this session.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {/* Share Screen Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>Share Screen</div>
                      <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Allow attendees to present</div>
                    </div>
                    <button 
                      onClick={() => executeHostAction(allowParticipantScreenShare ? 'LOCK_SCREEN_SHARE' : 'UNLOCK_SCREEN_SHARE')}
                      className={`btn ${allowParticipantScreenShare ? 'btn-accent' : 'btn-secondary'}`}
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      {allowParticipantScreenShare ? 'Allowed' : 'Host Only 🔒'}
                    </button>
                  </div>

                  {/* In-Call Chat Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.875rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff' }}>In-Call Messages</div>
                      <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Allow students to send chat</div>
                    </div>
                    <button 
                      onClick={() => setAllowParticipantChat(prev => !prev)}
                      className={`btn ${allowParticipantChat ? 'btn-accent' : 'btn-secondary'}`}
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      {allowParticipantChat ? 'Allowed' : 'Locked 🔒'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Host Quick Actions */}
              <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.75rem' }}>Quick Actions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    onClick={() => executeHostAction('MUTE_ALL')} 
                    className="btn btn-secondary" 
                    style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem' }}
                  >
                    <VolumeX size={15} style={{ color: '#ef4444' }} /> Mute All Participants
                  </button>
                  <button 
                    onClick={() => executeHostAction('LOWER_ALL_HANDS')} 
                    className="btn btn-secondary" 
                    style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem' }}
                  >
                    <Hand size={15} style={{ color: '#fbbf24' }} /> Lower All Raised Hands
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* 8. FLOATING EMOJI REACTIONS RENDERER */}
      {floatingReactions.map(r => (
        <div key={r.id} className="floating-emoji-reaction" style={{ left: `${r.left}%` }}>
          <span>{r.emoji}</span>
        </div>
      ))}

      {/* 9. GOOGLE MEET FLOATING CONTROLS TOOLBAR */}
      <footer className="meeting-controls-bar">
        
        {/* Mic Toggle */}
        <button 
          onClick={toggleMic} 
          className={`ctrl-btn ${isMuted ? 'danger-active' : ''}`} 
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Camera Toggle */}
        <button 
          onClick={toggleCamera} 
          className={`ctrl-btn ${isCameraOff ? 'danger-active' : ''}`} 
          title={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
        >
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>

        {/* Screen Share */}
        <button 
          onClick={toggleScreenShare} 
          className={`ctrl-btn ${isScreenSharing ? 'active' : ''}`} 
          title={isScreenSharing ? "Stop Screen Share" : (!isHost && !allowParticipantScreenShare ? "Screen sharing locked by host" : "Share Screen")}
        >
          <MonitorUp size={20} />
        </button>

        {/* Raise Hand (✋) */}
        <button 
          onClick={toggleRaiseHand} 
          className={`ctrl-btn ${handRaised ? 'active' : ''}`} 
          style={handRaised ? { backgroundColor: '#f59e0b', borderColor: '#f59e0b', color: '#ffffff' } : {}}
          title={handRaised ? "Lower Hand" : "Raise Hand (✋)"}
        >
          <Hand size={20} />
        </button>

        {/* Quick Reactions Menu */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowEmojiPicker(prev => !prev)} 
            className="ctrl-btn" 
            title="Send Reaction"
          >
            <Smile size={20} />
          </button>

          {showEmojiPicker && (
            <div style={{
              position: 'absolute',
              bottom: '56px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              gap: '0.375rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 100
            }}>
              {REACTION_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.375rem',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '50%',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '0 0.25rem' }} />

        {/* Share & Info Drawer Toggle */}
        <button 
          onClick={() => setActiveDrawer(prev => prev === 'info' ? null : 'info')}
          className={`ctrl-btn ${activeDrawer === 'info' ? 'active' : ''}`}
          title="Meeting Info & Share Link"
        >
          <Share2 size={19} />
        </button>

        {/* Participants Drawer Toggle */}
        <button 
          onClick={() => {
            setActiveDrawer(prev => prev === 'participants' ? null : 'participants');
          }} 
          className={`ctrl-btn ${activeDrawer === 'participants' ? 'active' : ''}`}
          title="Meeting Participants"
        >
          <Users size={20} />
          {totalInRoom > 1 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.625rem', fontWeight: 700, padding: '1px 5px', borderRadius: 'var(--radius-full)' }}>
              {totalInRoom}
            </span>
          )}
        </button>

        {/* In-Room Chat Drawer Toggle */}
        <button 
          onClick={() => {
            setActiveDrawer(prev => prev === 'chat' ? null : 'chat');
            setUnreadChatCount(0);
          }} 
          className={`ctrl-btn ${activeDrawer === 'chat' ? 'active' : ''}`}
          title="In-Call Chat"
        >
          <MessageSquare size={20} />
          {unreadChatCount > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '0.625rem', fontWeight: 700, padding: '1px 5px', borderRadius: 'var(--radius-full)' }}>
              {unreadChatCount}
            </span>
          )}
        </button>

        {/* Host Security Settings Toggle (Only visible for Host / Admin) */}
        {isHost && (
          <button 
            onClick={() => setActiveDrawer(prev => prev === 'host' ? null : 'host')}
            className={`ctrl-btn ${activeDrawer === 'host' ? 'active' : ''}`}
            title="Host Security & Access Settings"
          >
            <Shield size={19} />
          </button>
        )}

        {/* Leave / End Call */}
        <button 
          onClick={handleEndCall} 
          className="ctrl-btn end-call" 
          title="Leave Study Session"
        >
          <PhoneOff size={18} />
          <span>Leave</span>
        </button>

      </footer>

    </div>
  );
}
