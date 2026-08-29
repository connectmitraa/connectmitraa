import React, { useState } from 'react';
import { X, Check, Star } from 'lucide-react';

export function ReviewSessionModal({ session, onClose, onSubmitReview }) {
  const [clarityRating, setClarityRating] = useState(5);
  const [patienceRating, setPatienceRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  if (!session) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview({
      sessionId: session.id,
      tutorName: session.tutorName,
      clarityRating,
      patienceRating,
      feedbackText: feedbackText || 'Explained the concept with super clear examples. 100% understood!'
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
            <Award size={28} />
          </div>
          <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: '0 0 0.25rem 0' }}>Rate Your Peer Tutor</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
            Session on <strong>{session.topic}</strong> with <strong>{session.tutorName}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Factor 1: Concept Clarity Rating */}
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>1. Concept Clarity</span>
              <span style={{ fontWeight: 800, color: 'var(--warning-color)' }}>{clarityRating} / 5 ⭐</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setClarityRating(star)} 
                  style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: star <= clarityRating ? '#f59e0b' : '#64748b' }}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.25rem' }}>
              Did the tutor explain the core logic clearly and answer your doubts?
            </div>
          </div>

          {/* Factor 2: Teaching Patience & Approachability */}
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>2. Teaching Patience</span>
              <span style={{ fontWeight: 800, color: 'var(--warning-color)' }}>{patienceRating} / 5 ⭐</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setPatienceRating(star)} 
                  style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: star <= patienceRating ? '#f59e0b' : '#64748b' }}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.25rem' }}>
              Was the student tutor friendly, patient, and comfortable to learn with?
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="label">Written Peer Review</label>
            <textarea 
              className="input" 
              style={{ minHeight: '80px' }} 
              placeholder="What made this explanation easy to understand?" 
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-accent" style={{ padding: '0.875rem', fontWeight: 800 }}>
            Submit Rating & Release Escrow Earnings 🚀
          </button>

        </form>

      </div>
    </div>
  );
}

