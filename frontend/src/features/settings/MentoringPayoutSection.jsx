import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Coins, 
  Copy, 
  CreditCard, 
  Gift, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  X, 
  Zap 
} from 'lucide-react';

export function MentoringPayoutSection({ formData, setFormData, handleSaveAll, toast, newSkillTag, setNewSkillTag, handleAddSkill, handleRemoveSkill }) {
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleCopyUpi = () => {
    if (!formData.upiId) return;
    navigator.clipboard.writeText(formData.upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="card-premium">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              🧑‍🏫 1:1 Peer Mentoring & Direct UPI Payments
            </h2>
            <span className="tag" style={{ background: '#10b981', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.5rem' }}>
              ₹0 Platform Fee
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
            Teach your peers, help with coding doubts or placement preparation, and receive 100% direct payments directly into your bank account.
          </p>
        </div>
      </div>

      {/* ZERO PLATFORM COMMISSIONS & TRUST BANNER */}
      <div style={{ 
        padding: '1.1rem 1.25rem', 
        backgroundColor: 'rgba(59, 130, 246, 0.08)', 
        border: '1px solid rgba(59, 130, 246, 0.25)', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}>
        <ShieldCheck size={24} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            100% Direct Student-to-Student Payments (Zero Middleman Risk)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.45' }}>
            Our platform does <strong>NOT</strong> hold your money or take transaction cuts. Students pay you directly via Google Pay, PhonePe, or Paytm UPI after your 10-Minute Free Demo session. No gateway fees, no GST cuts, no payout delays.
          </div>
        </div>
      </div>

      {/* MENTORING AVAILABILITY TOGGLE */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Open to 1:1 Peer Mentoring</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Allow students from other engineering colleges to discover and book 1:1 sessions with you</div>
        </div>
        <input 
          type="checkbox" 
          checked={formData.isAvailableForMentoring} 
          onChange={e => {
            const next = { ...formData, isAvailableForMentoring: e.target.checked };
            setFormData(next);
            handleSaveAll(next);
          }}
          style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary-color)' }}
        />
      </div>

      {/* 10-MINUTE FREE DEMO POLICY */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>10-Minute Free Demo Guarantee</span>
            <span className="tag" style={{ background: '#f59e0b', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.1rem 0.4rem' }}>
              High-Trust Feature ⭐
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Offer students a free 10-minute trial to discuss their doubt. If they find your teaching helpful, they continue the session and pay your UPI rate.
          </div>
        </div>
        <input 
          type="checkbox" 
          checked={formData.freeDemoAvailable !== false} 
          onChange={e => {
            const next = { ...formData, freeDemoAvailable: e.target.checked };
            setFormData(next);
            handleSaveAll(next);
          }}
          style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary-color)' }}
        />
      </div>

      {/* DIRECT UPI HANDLE / VPA */}
      <div style={{ marginBottom: '1.75rem', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} style={{ color: 'var(--primary-color)' }} />
            <span style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Your Direct UPI ID / VPA Handle</span>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Google Pay / PhonePe / Paytm / BHIM
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          When a student books your session, they will scan or pay directly to this UPI ID. No funds touch StudyLoop servers.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="e.g. yourname@oksbi, 9876543210@paytm, name@okhdfcbank" 
            value={formData.upiId || ''} 
            onChange={e => setFormData({ ...formData, upiId: e.target.value })}
            style={{ flex: 1, minWidth: '240px' }}
          />
          {formData.upiId && (
            <button 
              type="button" 
              onClick={handleCopyUpi}
              className="btn btn-secondary"
              style={{ fontWeight: 700, padding: '0.6rem 1rem' }}
            >
              {copiedUpi ? 'Copied! ✅' : 'Copy UPI'}
            </button>
          )}
        </div>
      </div>

      {/* PRICING RATES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div>
          <label className="label">Hourly Rate in INR (₹)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-color)' }}>₹</span>
            <input 
              type="number" 
              className="input" 
              value={formData.hourlyRate || 0} 
              onChange={e => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })} 
              placeholder="e.g. 150"
            />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Recommended for college peers: ₹100 - ₹300 / hr</span>
        </div>

        <div>
          <label className="label">Rate in StudyLoop Peer Coins (🪙)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f59e0b' }}>🪙</span>
            <input 
              type="number" 
              className="input" 
              value={formData.coinRate || 0} 
              onChange={e => setFormData({ ...formData, coinRate: parseInt(e.target.value) || 0 })} 
              placeholder="e.g. 20"
            />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Free peer learning alternative using app study coins</span>
        </div>
      </div>

      {/* TEACHING SKILLS TAGS */}
      <div style={{ marginBottom: '1.75rem' }}>
        <label className="label" style={{ fontWeight: 800, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
          Subjects & Topics You Teach
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {(formData.teachingSkills || []).map((skill, sIdx) => (
            <span key={sIdx} className="tag tag-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}>
              {skill}
              <button 
                type="button" 
                onClick={() => handleRemoveSkill && handleRemoveSkill(skill)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem', maxWidth: '440px' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Add topic (e.g. DSA, Operating Systems, Java, Gate Prep)" 
            value={newSkillTag} 
            onChange={e => setNewSkillTag(e.target.value)} 
          />
          <button type="submit" className="btn btn-secondary" style={{ flexShrink: 0, fontWeight: 700 }}>
            Add Topic
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => {
            handleSaveAll();
            toast.success('Mentoring and UPI preferences updated successfully!');
          }} 
          className="btn btn-primary" 
          style={{ fontWeight: 800, padding: '0.65rem 1.75rem' }}
        >
          Save Mentoring & UPI Settings
        </button>
      </div>
    </div>
  );
}
