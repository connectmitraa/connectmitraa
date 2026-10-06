import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { AlertCircle, BookOpen, Calendar, Check, CheckCircle2, Clock, Copy, CreditCard, Shield, Sparkles, X } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function BookingModal({ tutor, onClose, onConfirmBooking }) {
  const toast = useToast();
  const [selectedTopic, setSelectedTopic] = useState(tutor?.topicsMastered?.[0] || 'Core Subject Walkthrough');
  const [sessionType, setSessionType] = useState('paid'); // 'paid' | 'swap'
  const [swapOfferSubject, setSwapOfferSubject] = useState('React & Frontend');
  const [preferredMode, setPreferredMode] = useState(tutor?.comfortModes?.[0] || 'video');
  const [duration, setDuration] = useState('30'); // 15, 30, 60
  const [doubtNotes, setDoubtNotes] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!tutor) return null;

  const baseRate = tutor.ratePerSession || 100;
  const multiplier = duration === '15' ? 0.6 : duration === '60' ? 1.8 : 1.0;
  const calculatedFee = sessionType === 'swap' ? 0 : Math.round(baseRate * multiplier);
  const upiHandle = tutor.upiId || `${tutor.fullName?.toLowerCase().replace(/\s+/g, '')}@upi`;
  const tutorLanguages = tutor.languages || ['Telugu', 'English'];

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiHandle);
    setCopiedUpi(true);
    toast.success('Tutor UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newSession = {
      id: `session-${Date.now()}`,
      tutorName: tutor.fullName,
      tutorAvatar: tutor.avatarUrl,
      tutorCollege: tutor.college,
      tutorUpi: upiHandle,
      topic: selectedTopic,
      sessionType: sessionType,
      swapOfferSubject: sessionType === 'swap' ? swapOfferSubject : null,
      preferredMode: preferredMode,
      languages: tutorLanguages,
      doubtNotes: doubtNotes || (sessionType === 'swap' ? `Skill Swap: Learn ${selectedTopic} in exchange for ${swapOfferSubject}` : '1:1 Peer walkthrough and doubt clearance.'),
      duration: `${duration} Mins`,
      fee: calculatedFee,
      freeDemo: sessionType === 'paid',
      status: 'confirmed',
      time: 'Today • 10 mins from now',
      rated: false
    };
    onConfirmBooking(newSession);
    if (sessionType === 'swap') {
      toast.success(`🔄 Skill Swap Session Confirmed! You teach ${swapOfferSubject} ⮀ ${tutor.fullName} teaches ${selectedTopic} (₹0 Free).`);
    } else {
      toast.success(`Booked with 10-Min Free Demo! Pay ₹${calculatedFee} directly via UPI after trial.`);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '560px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: 0 }}>Book 1:1 Peer Study Session</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Learn directly from verified campus peer mentor • 10-Minute Free Trial
            </p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {/* 🗣️ PROMINENT LANGUAGE & TUTOR CARD (User Requested: Large attractive language badges at top) */}
        <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '1.1rem', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem' }}>
            <img src={tutor.avatarUrl} alt={tutor.fullName} style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2.5px solid var(--accent-primary)', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{tutor.fullName}</span>
                <span className="tag" style={{ background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem' }}>
                  🎓 Verified Peer Mentor
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{tutor.college} • {tutor.subject || 'CS'} Mentor</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--warning-color)', fontWeight: 700, marginTop: '0.125rem' }}>
                ⭐ {tutor.rating || '4.9'} ({tutor.classesTaught || 24} Sessions Taught)
              </div>
            </div>
          </div>

          {/* 🗣️ PROMINENT SESSIONS LANGUAGES BANNER */}
          <div style={{ 
            backgroundColor: 'rgba(0, 102, 255, 0.08)', 
            border: '1.5px solid rgba(0, 102, 255, 0.25)', 
            borderRadius: '8px', 
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-primary)' }}>🗣️ Session Languages:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {tutorLanguages.map((l, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      fontSize: '0.78rem', 
                      fontWeight: 800, 
                      backgroundColor: 'var(--bg-secondary)', 
                      color: 'var(--text-primary)', 
                      padding: '3px 8px', 
                      borderRadius: '6px', 
                      border: '1px solid rgba(0, 102, 255, 0.3)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    {l === 'Telugu' ? '🗣️ తెలుగు (Telugu) - Fluent' : l === 'Hindi' ? '🗣️ हिंदी (Hindi)' : `🗣️ ${l}`}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred mode indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Available via:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🎥 Video & 🎙️ Audio</span>
            </div>
          </div>
        </div>

        {/* ── 2-MODE SWITCHER: Paid Class vs Peer Skill Swap ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="label">Choose Session Type / రకం ఎంచుకోండి</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setSessionType('paid')}
              style={{
                padding: '0.85rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: sessionType === 'paid' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: sessionType === 'paid' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: sessionType === 'paid' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                  💳 Mode 1: Paid Class
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)', backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                  ₹{calculatedFee}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                • 10-Min Free Demo Trial<br/>
                • Pay via UPI after trial
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSessionType('swap')}
              style={{
                padding: '0.85rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: sessionType === 'swap' ? '2px solid #10b981' : '1px solid var(--border-color)',
                backgroundColor: sessionType === 'swap' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: sessionType === 'swap' ? '#10b981' : 'var(--text-primary)' }}>
                  🔄 Mode 2: Skill Swap
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                  100% FREE
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                • "You teach me X, I teach you Y"<br/>
                • Zero ₹ Money Exchange
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Select Specific Topic */}
          <div>
            <label className="label">1. Concept You Want to Learn from {tutor.fullName}</label>
            <select className="input" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
              {(tutor.topicsMastered || ['Data Structures & Algorithms', 'System Design & OS', 'Java & Spring Boot', 'Semester Exam Prep']).map((top, idx) => (
                <option key={idx} value={top}>🎯 {top}</option>
              ))}
            </select>
          </div>

          {/* If Skill Swap Mode is Selected: Ask What You Will Teach in Return */}
          {sessionType === 'swap' && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1.5px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.9rem' }}>
              <label className="label" style={{ color: '#059669', fontWeight: 800 }}>
                🔄 2. What Subject/Concept Will You Teach in Return? (Barter Exchange)
              </label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. React & Redux, Python Fast-API, Database Normalization, Engineering Maths..." 
                value={swapOfferSubject} 
                onChange={e => setSwapOfferSubject(e.target.value)} 
                required 
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                🤝 <em>"{tutor.fullName} will teach you {selectedTopic}, and in return you will teach {tutor.fullName} {swapOfferSubject || 'your subject'}."</em>
              </div>
            </div>
          )}

          {/* Preferred Communication Mode */}
          <div>
            <label className="label">Meeting Communication Format</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'video', label: '🎥 1:1 Live Video' },
                { id: 'audio', label: '🎙️ Audio + Screen' },
                { id: 'chat', label: '💬 Code Walkthrough' }
              ].map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPreferredMode(m.id)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: preferredMode === m.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: preferredMode === m.id ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                    color: preferredMode === m.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session Duration Selector */}
          <div>
            <label className="label">Session Duration</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setDuration('15')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: duration === '15' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '15' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-tertiary)',
                  color: duration === '15' ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                ⚡ 15 Mins
                <div style={{ fontSize: '0.6875rem', opacity: 0.85, marginTop: '0.25rem' }}>₹{Math.round(baseRate * 0.6)}</div>
              </button>

              <button
                type="button"
                onClick={() => setDuration('30')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: duration === '30' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '30' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-tertiary)',
                  color: duration === '30' ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                📖 30 Mins Standard
                <div style={{ fontSize: '0.6875rem', opacity: 0.85, marginTop: '0.25rem' }}>₹{baseRate}</div>
              </button>

              <button
                type="button"
                onClick={() => setDuration('60')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: duration === '60' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '60' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-tertiary)',
                  color: duration === '60' ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                🚀 60 Mins Deep Dive
                <div style={{ fontSize: '0.6875rem', opacity: 0.85, marginTop: '0.25rem' }}>₹{Math.round(baseRate * 1.8)}</div>
              </button>
            </div>
          </div>

          {/* Doubt Notes */}
          <div>
            <label className="label">Describe What You Want to Learn (Optional)</label>
            <textarea
              className="input"
              style={{ minHeight: '65px' }}
              placeholder="e.g. Need help with dynamic programming memoization or mock interview prep..."
              value={doubtNotes}
              onChange={e => setDoubtNotes(e.target.value)}
            />
          </div>

          {/* 10-Minute Free Demo Policy & Direct UPI Trust Banner */}
          <div style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.08)', 
            border: '1px solid rgba(16, 185, 129, 0.25)', 
            padding: '0.9rem', 
            borderRadius: 'var(--radius-md)', 
            display: 'flex', 
            gap: '0.75rem', 
            alignItems: 'flex-start' 
          }}>
            <Shield size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                🛡️ 10-Minute Free Demo Policy (Zero Risk)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                First 10 minutes are 100% free. If satisfied, pay <strong>₹{calculatedFee}</strong> directly to {tutor.fullName} via UPI (GPay/PhonePe). StudyLoop charges ₹0 commission.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 700 }}>Mentor UPI:</span>
                <code style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                  {upiHandle}
                </code>
                <button 
                  type="button" 
                  onClick={handleCopyUpi} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', fontSize: '0.72rem', fontWeight: 700, padding: 0 }}
                >
                  {copiedUpi ? 'Copied! ✅' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.85rem', fontWeight: 800, fontSize: '0.9375rem' }}>
              Book Session with 10-Min Free Trial 🚀
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
