import React, { useState } from 'react';
import { X, Check, Calendar, Clock, DollarSign, BookOpen, AlertCircle } from 'lucide-react';
import { getDefaultAvatarByGender } from '../../constants/avatars';

export function BookingModal({ tutor, onClose, onConfirmBooking }) {
  const [selectedTopic, setSelectedTopic] = useState(tutor?.topicsMastered[0] || 'Core Subject Walkthrough');
  const [duration, setDuration] = useState('30'); // 15, 30, 60
  const [doubtNotes, setDoubtNotes] = useState('');

  if (!tutor) return null;

  const baseRate = tutor.ratePerSession || 0;
  const multiplier = duration === '15' ? 0.6 : duration === '60' ? 1.8 : 1.0;
  const calculatedFee = Math.round(baseRate * multiplier);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newSession = {
      id: `session-${Date.now()}`,
      tutorName: tutor.fullName,
      tutorAvatar: tutor.avatarUrl,
      tutorCollege: tutor.college,
      topic: selectedTopic,
      doubtNotes: doubtNotes || 'Peer walkthrough on fundamental concepts.',
      duration: `${duration} Mins`,
      fee: calculatedFee,
      status: 'confirmed',
      time: 'Today • 10 mins from now',
      rated: false
    };
    onConfirmBooking(newSession);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: 0 }}>Book 1:1 Peer Study Session</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Learn directly from verified campus peer tutor</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {/* Tutor Mini Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <img src={tutor.avatarUrl} alt={tutor.fullName} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{tutor.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tutor.college} • {tutor.subject} Specialist</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-color)', fontWeight: 700, marginTop: '0.125rem' }}>⭐ {tutor.rating} ({tutor.classesTaught} Classes Taught)</div>
          </div>
        </div>

        <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Select Specific Topic */}
          <div>
            <label className="label">Select Concept / Topic You Need Help With</label>
            <select className="input" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
              {tutor.topicsMastered.map((top, idx) => (
                <option key={idx} value={top}>🎯 {top}</option>
              ))}
            </select>
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
                  border: duration === '15' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '15' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  color: duration === '15' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                ⚡ 15 Mins Quick
                <div style={{ fontSize: '0.6875rem', opacity: 0.8, marginTop: '0.25rem' }}>₹{Math.round(baseRate * 0.6)}</div>
              </button>

              <button
                type="button"
                onClick={() => setDuration('30')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: duration === '30' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '30' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  color: duration === '30' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                📖 30 Mins Standard
                <div style={{ fontSize: '0.6875rem', opacity: 0.8, marginTop: '0.25rem' }}>₹{baseRate}</div>
              </button>

              <button
                type="button"
                onClick={() => setDuration('60')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: duration === '60' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '60' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  color: duration === '60' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                🚀 60 Mins Deep Dive
                <div style={{ fontSize: '0.6875rem', opacity: 0.8, marginTop: '0.25rem' }}>₹{Math.round(baseRate * 1.8)}</div>
              </button>
            </div>
          </div>

          {/* Doubt Notes */}
          <div>
            <label className="label">Describe Where You Are Stuck (Optional)</label>
            <textarea 
              className="input" 
              style={{ minHeight: '70px' }} 
              placeholder="e.g. I am confused between method overriding and overloading in inheritance..."
              value={doubtNotes}
              onChange={e => setDoubtNotes(e.target.value)}
            />
          </div>

          {/* Escrow Guarantee Banner */}
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.875rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Shield size={20} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--success-color)' }}>Student Escrow Protection:</strong> Your payment of <strong>₹{calculatedFee}</strong> is safely held in platform escrow and only released to {tutor.fullName} after you confirm concept clarity post-session.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.875rem', fontWeight: 800, fontSize: '0.9375rem' }}>
              Confirm & Book Session (₹{calculatedFee}) 🚀
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

