import React, { useState } from 'react';
import { X } from 'lucide-react';

export function AddAchievementModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('Ministry of Education & Unstop');
  const [date, setDate] = useState('Dec 2025');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: `ach-${Date.now()}`,
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      desc: desc.trim() || 'Recognized for outstanding technical performance and problem solving.'
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add Honor & Hackathon Achievement</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Achievement / Award Title</label>
            <input type="text" className="input" placeholder="e.g. Smart India Hackathon (SIH 2025) - National Finalist" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Issuer / Competition Platform</label>
              <input type="text" className="input" placeholder="e.g. Unstop, LeetCode, Flipkart, ICPC" value={issuer} onChange={e => setIssuer(e.target.value)} required />
            </div>
            <div>
              <label className="label">Date / Year</label>
              <input type="text" className="input" placeholder="e.g. Dec 2025" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Description / Summary of Impact</label>
            <textarea className="input" style={{ minHeight: '75px', resize: 'vertical' }} placeholder="Selected in Top 5 teams out of 12,000+ national submissions for building AI doubt router." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Achievement 🏆</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

