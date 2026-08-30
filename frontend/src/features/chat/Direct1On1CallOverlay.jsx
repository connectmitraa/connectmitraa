import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  MessageSquare, 
  RotateCw,
  Sparkles
} from 'lucide-react';
import { FEMALE_AVATAR_SVG, MALE_AVATAR_SVG } from '../../constants/avatars';

export function Direct1On1CallOverlay({ 
  webrtcCall, 
  onEndCall, 
  localStream, 
  remoteStream, 
  profile 
}) {
  const initialMode = webrtcCall?.callMode || 'video'; // 'audio' | 'video'
  const [callMode, setCallMode] = useState(initialMode);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(initialMode === 'audio');
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [callState, setCallState] = useState('connecting'); // 'connecting' | 'ringing' | 'connected'

  // Contact info fallback
  const peerName = webrtcCall?.peerName || webrtcCall?.roomTitle?.replace('1:1 Direct Audio Call with ', '').replace('1:1 Direct Video Meeting with ', '') || 'Peer Learner';
  const peerAvatar = webrtcCall?.peerAvatar || (peerName.toLowerCase().includes('bhavna') || peerName.toLowerCase().includes('divya') ? FEMALE_AVATAR_SVG : MALE_AVATAR_SVG);

  useEffect(() => {
    const t1 = setTimeout(() => setCallState('ringing'), 1000);
    const t2 = setTimeout(() => setCallState('connected'), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => setSecondsElapsed(s => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => { track.enabled = !track.enabled; });
    }
    setIsMuted(prev => !prev);
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => { track.enabled = !track.enabled; });
    }
    setIsCameraOff(prev => !prev);
  };

  // Switch from audio-only mode to full video call
  const switchToVideo = () => {
    setCallMode('video');
    setIsCameraOff(false);
    if (localStream) {
      localStream.getVideoTracks().forEach(track => { track.enabled = true; });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0b0f19',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      color: '#ffffff',
      overflow: 'hidden'
    }}>
      
      {/* WHATSAPP-STYLE ENCRYPTED TOP HEADER */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 20,
        background: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.9) 0%, rgba(11, 15, 25, 0) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#f8fafc' }}>
              {callMode === 'audio' ? 'WhatsApp Voice Call' : 'WhatsApp HD Video Call'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700 }}>
              🔒 End-to-End Encrypted 1:1 Peer Session
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.875rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 700, backdropFilter: 'blur(10px)', letterSpacing: '0.5px' }}>
          {callState === 'connecting' ? 'Connecting...' : (callState === 'ringing' ? 'Ringing peer...' : formatDuration(secondsElapsed))}
        </div>
      </div>

      {/* CALL BODY CONTENT */}
      {callMode === 'audio' || isCameraOff ? (
        /* 1:1 AUDIO CALL LAYOUT (WHATSAPP VOICE CALL) */
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #1e293b 0%, #0b0f19 100%)',
          position: 'relative'
        }}>
          {/* Pulsing Avatar Rings */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{
              position: 'absolute',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              border: '2px solid rgba(56, 189, 248, 0.25)',
              animation: 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite'
            }}></div>
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              animation: 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite 0.5s'
            }}></div>
            
            <img 
              src={peerAvatar} 
              alt={peerName} 
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--accent-primary)',
                boxShadow: '0 0 40px rgba(56, 189, 248, 0.4)',
                zIndex: 2
              }}
            />
          </div>

          <h2 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            {peerName}
          </h2>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>
            {callState === 'connecting' ? 'Connecting audio stream...' : (callState === 'ringing' ? 'Calling...' : `Voice Call Connected • ${formatDuration(secondsElapsed)}`)}
          </div>
        </div>
      ) : (
        /* 1:1 VIDEO CALL LAYOUT (WHATSAPP VIDEO CALL) */
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Main Remote Video View */}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img 
              src={peerAvatar} 
              alt="Remote Video" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.95)' }} 
            />
            
            {/* Peer Name Overlay Badge */}
            <div style={{ position: 'absolute', bottom: '100px', left: '2rem', backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem', fontWeight: 700 }}>
              👤 {peerName}
            </div>
          </div>

          {/* Local User Self PIP (Picture-in-Picture) */}
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '2rem',
            width: '180px',
            height: '240px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            backgroundColor: '#1e293b',
            zIndex: 10
          }}>
            <img 
              src={profile?.avatarUrl || MALE_AVATAR_SVG} 
              alt="You" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '0.6875rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
              You (Self)
            </div>
          </div>

        </div>
      )}

      {/* BOTTOM FLOATING WHATSAPP CALL CONTROLS */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 'var(--radius-full)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        zIndex: 30
      }}>
        
        {/* Toggle Mic */}
        <button 
          onClick={toggleMic} 
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        {/* Toggle Video/Camera */}
        <button 
          onClick={callMode === 'audio' ? switchToVideo : toggleCamera} 
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isCameraOff ? 'rgba(255, 255, 255, 0.15)' : 'var(--accent-primary)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={callMode === 'audio' ? 'Switch to Video Call' : (isCameraOff ? 'Turn Camera On' : 'Turn Camera Off')}
        >
          {isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
        </button>

        {/* Speaker Mute Toggle */}
        <button 
          onClick={() => setIsSpeakerMuted(!isSpeakerMuted)} 
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isSpeakerMuted ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title={isSpeakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
        >
          {isSpeakerMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>

        {/* RED END CALL BUTTON */}
        <button 
          onClick={onEndCall} 
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
            transition: 'transform 0.2s ease'
          }}
          title="End Call"
        >
          <PhoneOff size={24} />
        </button>

      </div>

    </div>
  );
}
