import React from 'react';
import { LiveMeetingRoom } from './LiveMeetingRoom';
import { Direct1On1CallOverlay } from '../chat/Direct1On1CallOverlay';

export function RtcCallOverlay({ 
  localVideoRef, 
  remoteVideoRef, 
  isScreenSharing, 
  toggleScreenShare, 
  hangUpCall, 
  webrtcCall, 
  localStream, 
  remoteStream,
  user,
  profile,
  socket,
  token
}) {
  const mode = webrtcCall?.callMode || 'meeting';

  // Direct 1:1 Voice or Video Calls (WhatsApp Style)
  if (mode === 'audio' || mode === 'video') {
    return (
      <Direct1On1CallOverlay
        webrtcCall={webrtcCall}
        onEndCall={hangUpCall}
        localStream={localStream}
        remoteStream={remoteStream}
        profile={profile}
      />
    );
  }

  // Multi-Attendee Study Rooms / Group Sessions (Google Meet Style)
  return (
    <LiveMeetingRoom
      roomId={webrtcCall?.roomId || 'doubt-room-live'}
      roomTitle={webrtcCall?.roomTitle || 'Live Academic Doubt Session'}
      subject={webrtcCall?.subject || 'Live Study Room'}
      user={user}
      profile={profile}
      socket={socket}
      onLeaveRoom={hangUpCall}
      token={token}
    />
  );
}
