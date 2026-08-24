package app.studyloop.backend.dto;

import app.studyloop.backend.domain.Profile;

import java.time.Instant;
import java.util.UUID;

public class DirectChatThreadDto {
    private UUID chatId;
    private Profile peer;
    private Instant createdAt;
    private boolean online;

    public DirectChatThreadDto() {}

    public DirectChatThreadDto(UUID chatId, Profile peer, Instant createdAt, boolean online) {
        this.chatId = chatId;
        this.peer = peer;
        this.createdAt = createdAt;
        this.online = online;
    }

    public UUID getChatId() {
        return chatId;
    }

    public void setChatId(UUID chatId) {
        this.chatId = chatId;
    }

    public Profile getPeer() {
        return peer;
    }

    public void setPeer(Profile peer) {
        this.peer = peer;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID chatId;
        private Profile peer;
        private Instant createdAt;
        private boolean online;

        public Builder chatId(UUID chatId) {
            this.chatId = chatId;
            return this;
        }

        public Builder peer(Profile peer) {
            this.peer = peer;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder online(boolean online) {
            this.online = online;
            return this;
        }

        public DirectChatThreadDto build() {
            return new DirectChatThreadDto(chatId, peer, createdAt, online);
        }
    }
}
