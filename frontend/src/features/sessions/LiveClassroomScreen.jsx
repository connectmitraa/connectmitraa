import React, { useState, useEffect, useRef } from 'react';
import { Code, ScreenShare, Play } from 'lucide-react';

export function LiveClassroomScreen({ session, onEndClassroom, localVideoRef, remoteVideoRef, toggleScreenShare, isScreenSharing }) {
  const [codeLanguage, setCodeLanguage] = useState('java');
  const [codeContent, setCodeContent] = useState(
    `// 🎓 StudyLoop Live 1:1 Collaborative Workspace\n// Topic: Java OOP Inheritance & Polymorphism\n\nclass Animal {\n    void speak() {\n        System.out.println("Animal makes a sound");\n    }\n}\n\nclass Dog extends Animal {\n    @Override\n    void speak() {\n        System.out.println("Dog barks 🐶");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal myDog = new Dog(); // Dynamic Method Dispatch\n        myDog.speak();\n    }\n}`
  );
  const [consoleOutput, setConsoleOutput] = useState('Dog barks 🐶\n[Process completed in 0.04s - Concept Verified ✓]');
  const [sessionNotes, setSessionNotes] = useState('Key Takeaway: Child class overrides parent method. Reference type of parent holding child object enables Runtime Polymorphism.');

  // ── Live elapsed timer ──
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const sessionDurationMins = parseInt(session?.duration || '30', 10);
  const totalSecs = sessionDurationMins * 60;
  const isOvertime = secondsElapsed >= totalSecs;

  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalLabel = `${sessionDurationMins.toString().padStart(2, '0')}:00`;

  // ── Start local camera stream when classroom mounts ──
  useEffect(() => {
    let stream;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(s => {
        stream = s;
        if (localVideoRef?.current) {
          localVideoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        // Camera/mic permission denied — silently fail, rest of UI still works
      });
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#090d16', color: '#ffffff' }}>

      {/* CLASSROOM HEADER */}
      <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="live-dot"></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }}>
              Live 1:1 Class: {session?.topic || 'Java OOP Inheritance'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Tutor: {session?.tutorName || 'Bhavna Patel'} • You (Learner) — Escrow Protected
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Live Countdown Timer */}
          <span style={{
            backgroundColor: isOvertime ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            color: isOvertime ? '#f87171' : '#60a5fa',
            padding: '0.25rem 0.875rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: `1px solid ${isOvertime ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)'}`,
            fontVariantNumeric: 'tabular-nums',
            minWidth: '130px',
            textAlign: 'center'
          }}>
            ⏱️ {formatTime(secondsElapsed)} / {totalLabel} Mins{isOvertime ? ' ⚠️' : ''}
          </span>

          <button onClick={toggleScreenShare} className={`btn ${isScreenSharing ? 'btn-accent' : 'btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
            <ScreenShare size={14} /> {isScreenSharing ? 'Stop Share' : 'Share Screen'}
          </button>

          <button onClick={() => onEndClassroom(session)} className="btn btn-danger" style={{ fontSize: '0.8125rem', padding: '0.375rem 1rem', fontWeight: 800 }}>
            Finish Class &amp; Review ⭐
          </button>
        </div>
      </div>

      {/* DUAL WORKSPACE: LEFT (CODE & NOTES) | RIGHT (WEBRTC VIDEO & NOTES) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', padding: '1rem', minHeight: 0 }}>

        {/* LEFT WORKSPACE: LIVE CODE EDITOR */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid #1e293b', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#182234' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={16} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Live Shared Code Editor</span>
            </div>
            <select
              value={codeLanguage}
              onChange={e => setCodeLanguage(e.target.value)}
              style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <option value="java">Java 17</option>
              <option value="cpp">C++ 20</option>
              <option value="python">Python 3.11</option>
              <option value="sql">PostgreSQL</option>
            </select>
          </div>

          <textarea
            value={codeContent}
            onChange={e => setCodeContent(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: '#090d16',
              color: '#38bdf8',
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.875rem',
              padding: '1rem',
              border: 'none',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.6
            }}
          />

          {/* Console output bar */}
          <div style={{ height: '80px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', padding: '0.5rem 1rem', fontFamily: "'Fira Code', monospace", fontSize: '0.75rem', color: '#4ade80' }}>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Console Output</div>
            <pre style={{ margin: 0 }}>{consoleOutput}</pre>
          </div>
        </div>

        {/* RIGHT WORKSPACE: WEBRTC VIDEO FEEDS & NOTES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>

          {/* Peer Video Grids */}
          <div style={{ flex: 1.2, display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.75rem', minHeight: 0 }}>
            {/* Remote (Tutor) video */}
            <div style={{ position: 'relative', backgroundColor: '#162032', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Fallback placeholder when no remote stream */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '2rem', opacity: 0.3 }}>👨‍🏫</span>
              </div>
              <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                👨‍🏫 Tutor: {session?.tutorName || 'Bhavna Patel'} (Live)
              </div>
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(239,68,68,0.85)', borderRadius: '4px', padding: '0.15rem 0.4rem', fontSize: '0.625rem', fontWeight: 800 }}>
                LIVE
              </div>
            </div>

            {/* Local (You) video — srcObject set by useEffect above */}
            <div style={{ position: 'relative', backgroundColor: '#162032', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Fallback placeholder */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '2rem', opacity: 0.3 }}>🎓</span>
              </div>
              <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                You (Learner)
              </div>
            </div>
          </div>

          {/* Quick Scratchpad Notes */}
          <div style={{ flex: 0.8, backgroundColor: '#111827', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.375rem' }}>
              📝 Shared Concept Summary Notes
            </div>
            <textarea
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              placeholder="Take notes during the explanation..."
              style={{ flex: 1, backgroundColor: '#182234', color: '#ffffff', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.5rem', fontSize: '0.8125rem', resize: 'none' }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
