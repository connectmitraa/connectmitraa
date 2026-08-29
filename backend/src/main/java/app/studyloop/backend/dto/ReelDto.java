package app.studyloop.backend.dto;

import app.studyloop.backend.domain.Profile;
import app.studyloop.backend.domain.Reel;

public class ReelDto {
    private Reel reel;
    private Profile creator;
    private boolean likedByCurrentUser;

    public ReelDto() {}

    public ReelDto(Reel reel, Profile creator, boolean likedByCurrentUser) {
        this.reel = reel;
        this.creator = creator;
        this.likedByCurrentUser = likedByCurrentUser;
    }

    public Reel getReel() { return reel; }
    public void setReel(Reel reel) { this.reel = reel; }

    public Profile getCreator() { return creator; }
    public void setCreator(Profile creator) { this.creator = creator; }

    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Reel reel;
        private Profile creator;
        private boolean likedByCurrentUser;

        public Builder reel(Reel reel) { this.reel = reel; return this; }
        public Builder creator(Profile creator) { this.creator = creator; return this; }
        public Builder likedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; return this; }

        public ReelDto build() {
            return new ReelDto(reel, creator, likedByCurrentUser);
        }
    }
}
