package app.studyloop.backend.dto;

import app.studyloop.backend.domain.Profile;

import java.time.Instant;

public class ConnectionDto {
    private Long connectionId;
    private Profile profile;
    private String status;
    private String note;
    private Instant createdAt;

    public ConnectionDto() {}

    public ConnectionDto(Long connectionId, Profile profile, String status, String note, Instant createdAt) {
        this.connectionId = connectionId;
        this.profile = profile;
        this.status = status;
        this.note = note;
        this.createdAt = createdAt;
    }

    public Long getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(Long connectionId) {
        this.connectionId = connectionId;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long connectionId;
        private Profile profile;
        private String status;
        private String note;
        private Instant createdAt;

        public Builder connectionId(Long connectionId) {
            this.connectionId = connectionId;
            return this;
        }

        public Builder profile(Profile profile) {
            this.profile = profile;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder note(String note) {
            this.note = note;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ConnectionDto build() {
            return new ConnectionDto(connectionId, profile, status, note, createdAt);
        }
    }
}
