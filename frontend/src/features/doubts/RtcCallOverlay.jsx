import React from 'react';
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Users, MessageSquare } from 'lucide-react';

export function RtcCallOverlay({ localVideoRef, remoteVideoRef, isScreenSharing, toggleScreenShare, hangUpCall, webrtcCall, localStream, remoteStream }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 13, 22, 0.95)', zIndex: 5000, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="live-dot"></div>
          <h3 className="font-serif" style={{ margin: 0, fontSize: '1.25rem' }}>Live WebRTC Code Study Call</h3>
        </div>
        <span className="tag tag-accent">HD Zero-Latency P2P</span>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 0, marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
            You (Local Feed)
          </div>
        </div>

        <div style={{ position: 'relative', backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
            Peer Tutor (Remote)
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
        <button onClick={toggleScreenShare} className={`btn ${isScreenSharing ? 'btn-accent' : 'btn-secondary'}`} style={{ padding: '0.75rem 1.5rem' }}>
          <ScreenShare size={18} /> {isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
        </button>
        <button onClick={hangUpCall} className="btn btn-danger" style={{ padding: '0.75rem 2rem', fontWeight: 700 }}>
          Hang Up Call
        </button>
      </div>
    </div>
  );
}

