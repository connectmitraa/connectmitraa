import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Clock, HelpCircle, MessageSquare, Send, Shield, Star, Zap } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does the escrow payment system work?',
    a: 'When you book a 1:1 session, your payment is held securely in escrow. It is only released to the tutor after you confirm the session was helpful. If not satisfied, you can raise a dispute within 24 hours.'
  },
  {
    q: 'My video/audio call isn\'t connecting — what do I do?',
    a: 'First, allow browser camera and microphone permissions. Then try refreshing the page. If it still fails, check your internet connection and ensure you\'re using Chrome or Edge (latest version). Contact support if the issue persists.'
  },
  {
    q: 'How do I withdraw my tutor earnings?',
    a: 'Go to Wallet → click "Withdraw to UPI". Enter your UPI ID (e.g. name@oksbi) and the amount. Withdrawals process within 1–2 hours on business days. Minimum withdrawal amount is ₹50.'
  },
  {
    q: 'Can I cancel a booked session?',
    a: 'Yes. Sessions can be cancelled up to 30 minutes before the start time for a full refund. For cancellations inside 30 minutes, 50% of the fee is refunded. Contact support for exceptions.'
  },
  {
    q: 'How are tutors verified on StudyLoop?',
    a: 'All tutors undergo a 3-step verification: college email verification, a 10-question subject test, and a mandatory 1 demo session reviewed by our academic team. Only those with 80%+ clarity score are listed.'
  },
  {
    q: 'What if I face harassment or inappropriate behavior?',
    a: 'Report immediately using the flag icon in any chat or session. Our safety team responds within 2 hours. For urgent concerns, use this form with the "Academic Safety" category — we treat these with highest priority.'
  }
];

const TICKET_CATEGORIES = ['Payment Issue', 'Technical Bug', 'Academic Dispute', 'Account Access', 'Academic Safety', 'Other'];

const TICKET_STATUSES = {
  open:       { label: 'Open',       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  reviewing:  { label: 'In Review',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  resolved:   { label: 'Resolved',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

export function ContactSupportScreen({ token, setActiveTab, setActiveChatId, setChatPeer, profile }) {
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState(TICKET_CATEGORIES[0]);
  const [priority, setPriority] = useState('normal'); // 'normal' | 'high' | 'urgent'

  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [tickets, setTickets] = useState([
    { id: 'TKT-1001', category: 'Payment Issue', subject: 'Session fee not returned after dispute', time: '2 days ago', status: 'resolved' },
    { id: 'TKT-1002', category: 'Technical Bug', subject: 'Video call disconnects after 2 minutes', time: '1 day ago',  status: 'reviewing' },
  ]);
  const [autoReplyFlash, setAutoReplyFlash] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !desc.trim()) return;
    setSubmitting(true);

    setTimeout(() => {
      const newTicket = {
        id: `TKT-${1000 + tickets.length + 1}`,
        category,
        subject: subject.trim(),
        time: 'Just now',
        status: 'open'
      };
      setTickets(prev => [newTicket, ...prev]);
      setSubject('');
      setDesc('');
      setSubmitting(false);

      // Auto-reply simulation after 3s
      setTimeout(() => {
        setAutoReplyFlash(`✅ Auto-reply: Your ticket ${newTicket.id} has been received. Our team will respond within 2 hours.`);
        setTimeout(() => setAutoReplyFlash(null), 5000);
        // Mark as "reviewing" after 6s
        setTickets(prev => prev.map(t => t.id === newTicket.id ? { ...t, status: 'reviewing' } : t));
      }, 3000);
    }, 1000);
  };

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '960px', margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Help Center & Support Desk
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Browse our FAQ, track your tickets, or submit a new support request. We respond within 2 hours.
        </p>
      </div>

      {/* AUTO-REPLY FLASH */}
      {autoReplyFlash && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'dropdown-animate 0.3s ease'
        }}>
          <CheckCircle size={20} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{autoReplyFlash}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* FAQ ACCORDION */}
          <div className="card-premium" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.125rem' }}>
              <HelpCircle size={20} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>Frequently Asked Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.75rem 1rem', backgroundColor: openFaqIdx === idx ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      border: 'none', cursor: 'pointer', textAlign: 'left', gap: '0.75rem',
                      color: openFaqIdx === idx ? 'var(--accent-primary)' : 'var(--text-primary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, flex: 1 }}>{item.q}</span>
                    {openFaqIdx === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openFaqIdx === idx && (
                    <div style={{ padding: '0.875rem 1rem', backgroundColor: 'var(--bg-secondary)', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MY TICKETS */}
          <div className="card-premium" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <MessageSquare size={20} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>My Support Tickets</h2>
            </div>
            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No tickets submitted yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {tickets.map(t => {
                  const st = TICKET_STATUSES[t.status];
                  return (
                    <div key={t.id} style={{
                      padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{t.id}</span>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{t.category}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                          <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />{t.time}
                        </div>
                      </div>
                      <div style={{
                        padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                        backgroundColor: st.bg, color: st.color,
                        fontSize: '0.6875rem', fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0
                      }}>
                        {st.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN — SUBMIT TICKET FORM */}
        <div className="card-premium" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <Send size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>Submit a Ticket</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

            {/* Category */}
            <div>
              <label className="label">Issue Category</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                {TICKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="label">Priority</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[['normal', '📋 Normal', '#64748b'], ['high', '⚠️ High', '#f59e0b'], ['urgent', '🚨 Urgent', '#ef4444']].map(([val, label, col]) => (
                  <button
                    key={val} type="button" onClick={() => setPriority(val)}
                    style={{
                      padding: '0.5rem 0.25rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      border: priority === val ? `2px solid ${col}` : '1px solid var(--border-color)',
                      backgroundColor: priority === val ? `${col}18` : 'var(--bg-tertiary)',
                      color: priority === val ? col : 'var(--text-secondary)',
                      fontWeight: 700, fontSize: '0.75rem', textAlign: 'center'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="label">Subject</label>
              <input
                type="text" className="input"
                placeholder="Brief description of the issue"
                value={subject} onChange={e => setSubject(e.target.value)} required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">Full Description</label>
              <textarea
                className="input" style={{ minHeight: '120px' }}
                placeholder="Please describe the issue in detail. Include any error messages, session IDs, or tutor names involved..."
                value={desc} onChange={e => setDesc(e.target.value)} required
              />
            </div>

            {/* SLA Notice */}
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)', padding: '0.75rem', display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
              <Shield size={16} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: '#60a5fa' }}>Response SLA:</strong> Normal 12h • High 4h • Urgent 2h. Academic Safety tickets are always treated as Urgent.
              </div>
            </div>

            <button
              type="submit" disabled={submitting}
              className="btn btn-accent"
              style={{ padding: '0.875rem', fontWeight: 800, fontSize: '0.9375rem', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? '⏳ Submitting...' : 'Submit Support Ticket 🚀'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
