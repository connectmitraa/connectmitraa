import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, Phone, Clock } from 'lucide-react';

export function ContactSupportScreen({ token, setActiveTab, setActiveChatId, setChatPeer, profile }) {
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Support ticket submitted to academic safety team!");
    setSubject('');
    setDesc('');
  };

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Contact & Help Desk</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Submit a question or reach out to the campus operations safety team.</p>

      <form onSubmit={handleSubmit} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label className="label">Subject / Issue Category</label>
          <input type="text" className="input" placeholder="e.g. Question about Doubt Room credits" value={subject} onChange={e => setSubject(e.target.value)} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" style={{ minHeight: '120px' }} placeholder="Please provide details..." value={desc} onChange={e => setDesc(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem' }}>
          Submit Ticket 🚀
        </button>
      </form>
    </div>
  );
}

