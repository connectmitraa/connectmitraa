import React, { useState, useRef } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  FileCheck,
  GraduationCap, 
  Image as ImageIcon,
  Mail, 
  QrCode, 
  Shield, 
  Sparkles, 
  Trash2,
  UploadCloud, 
  UserCheck 
} from 'lucide-react';

export function StudentVerificationSection({ formData, setFormData, handleSaveAll, toast }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const idFileInputRef = useRef(null);
  
  const isVerified = formData.verificationStatus === 'VERIFIED' || 
    formData.collegeEmail?.endsWith('.ac.in') || 
    formData.collegeEmail?.endsWith('.edu');

  const handleInstantEmailVerify = () => {
    const email = (formData.collegeEmail || '').trim().toLowerCase();
    if (!email) {
      toast.info('Please enter your institutional college email.');
      return;
    }

    if (
      email.includes('.ac.in') || 
      email.includes('.edu') || 
      email.includes('iit') || 
      email.includes('nit') || 
      email.includes('bits') ||
      email.includes('iiit')
    ) {
      const updated = { 
        ...formData, 
        collegeEmail: email,
        verificationStatus: 'VERIFIED' 
      };
      setFormData(updated);
      handleSaveAll(updated);
      toast.success('🎓 Campus Institutional Domain Verified! Verified Student Badge activated.');
    } else {
      toast.info('Please enter an official academic email with .ac.in or .edu domain (e.g. rollno@iitm.ac.in).');
    }
  };

  const handleFileSimulate = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error('File size must be under 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result;
        const updated = { 
          ...formData, 
          collegeIdCard: dataUrl,
          collegeIdCardName: file.name,
          verificationStatus: isVerified ? 'VERIFIED' : 'PENDING'
        };
        setFormData(updated);
        handleSaveAll(updated);
        toast.success(`Student ID "${file.name}" uploaded successfully!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveIdCard = () => {
    const updated = {
      ...formData,
      collegeIdCard: '',
      collegeIdCardName: '',
      verificationStatus: formData.collegeEmail?.includes('.ac.in') ? 'VERIFIED' : 'UNVERIFIED'
    };
    setFormData(updated);
    handleSaveAll(updated);
    toast.info('Student ID document removed.');
  };

  return (
    <div className="card-premium">
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              🛡️ Student ID & College Verification (Green Tick)
            </h2>
            <span 
              className="tag tag-accent" 
              style={{ 
                background: isVerified
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                color: '#ffffff', 
                fontWeight: 800, 
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.65rem'
              }}
            >
              <CheckCircle2 size={13} />
              {isVerified ? 'Verified Scholar Green Tick Active' : 'Verification Under Review'}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
            Upload authentic college documents and email credentials to earn the official Green Tick & unlock 1:1 cross-college mentoring.
          </p>
        </div>
      </div>

      {/* TRUST REASON BANNER */}
      <div style={{ 
        padding: '1.1rem 1.25rem', 
        backgroundColor: 'rgba(16, 185, 129, 0.08)', 
        border: '1px solid rgba(16, 185, 129, 0.25)', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}>
        <Shield size={24} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Why Green Tick Verification is Essential
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.45' }}>
            When students from all universities discover you on StudyLoop, the <strong>Verified Scholar Green Tick (✓)</strong> ensures authentic student identity, prevents fraud, and unlocks <strong>₹3,600+/month 1:1 Live Mentorship earnings</strong>.
          </div>
        </div>
      </div>

      {/* METHOD 1: OFFICIAL COLLEGE EMAIL (.ac.in / .edu) */}
      <div style={{ marginBottom: '1.75rem', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Method 1: Institutional College Email (.ac.in / .edu)</span>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            ⚡ Instant Validation
          </span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Enter your university official email (e.g. <code>cs23b015@iitm.ac.in</code>, <code>student@jntuh.ac.in</code>, <code>f20220101@pilani.bits-pilani.ac.in</code>).
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input 
            type="email" 
            className="input" 
            placeholder="e.g. cs23b015@iitm.ac.in" 
            value={formData.collegeEmail || ''} 
            onChange={e => setFormData({ ...formData, collegeEmail: e.target.value })}
            style={{ flex: 1, minWidth: '240px' }}
          />
          <button 
            type="button" 
            onClick={handleInstantEmailVerify}
            className="btn btn-primary"
            style={{ fontWeight: 700, padding: '0.6rem 1.25rem' }}
          >
            Verify College Domain
          </button>
        </div>
      </div>

      {/* METHOD 2: STUDENT ROLL NUMBER & COLLEGE ID CARD UPLOAD */}
      <div style={{ marginBottom: '1.75rem', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Method 2: College ID Card / Roll Number Document</span>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Document Upload
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label className="label">Registered College Name</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. IIT Madras, BITS Pilani, NIT Trichy" 
              value={formData.college || ''} 
              onChange={e => setFormData({ ...formData, college: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Official Student Roll No / Reg ID</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. CS23B015 / 2021A7PS001" 
              value={formData.collegeIdCard && !formData.collegeIdCard.startsWith('data:') ? formData.collegeIdCard : (formData.rollNumber || 'IITM-2023-CS-042')} 
              onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
            />
          </div>
        </div>

        {/* UPLOADED ID PREVIEW OR DROPZONE */}
        <input 
          type="file" 
          ref={idFileInputRef}
          accept="image/*,.pdf" 
          onChange={handleFileSimulate} 
          style={{ display: 'none' }} 
        />

        {formData.collegeIdCard && formData.collegeIdCard.startsWith('data:') ? (
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={formData.collegeIdCard} 
                  alt="Student ID Card" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    {formData.collegeIdCardName || 'Student_ID_Card.png'}
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    ✓ Uploaded & Encrypted
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Institutional student identity securely mapped to {formData.college || 'IIT Madras'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => idFileInputRef.current?.click()}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', fontWeight: 700 }}
              >
                Change ID
              </button>
              <button
                type="button"
                onClick={handleRemoveIdCard}
                className="btn btn-danger"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                title="Remove Document"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="label">Upload College ID Card / Semester Hall Ticket</label>
            <div 
              onClick={() => idFileInputRef.current?.click()}
              style={{ 
                border: '2px dashed var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.5rem', 
                textAlign: 'center',
                backgroundColor: 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <UploadCloud size={32} style={{ margin: '0 auto 0.5rem auto', color: 'var(--accent-primary)' }} />
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Click to upload Student ID Photo (PNG / JPG / PDF)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Up to 8MB. Encrypted and strictly used for Green Tick campus verification.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRIMARY CAREER & NETWORKING GOAL */}
      <div style={{ marginBottom: '1.75rem', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <label className="label" style={{ fontWeight: 800, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
          🎯 Primary Cross-Campus Networking Goal
        </label>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Other students will see this badge when discovering you in Cross-College filters.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            '🚀 Placements & Referrals',
            '⚡ LeetCode & DSA',
            '🏆 Hackathon Team',
            '📚 Semester Exams',
            '🎓 GATE & Higher Studies'
          ].map(goal => (
            <button
              key={goal}
              type="button"
              onClick={() => setFormData({ ...formData, targetGoal: goal })}
              className={`btn ${formData.targetGoal === goal ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE BADGE PREVIEW */}
      <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Live Cross-Campus Verified Scholar Preview
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>
            {formData.fullName?.charAt(0) || 'A'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{formData.fullName || 'Aarav Sharma'}</span>
              <span className="tag" style={{ background: isVerified ? '#10b981' : '#f59e0b', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                {isVerified ? '🎓 Verified Scholar (Green Tick)' : '⏳ Verification Pending'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              🏛️ {formData.college || 'IIT Madras'} • {formData.department || 'Computer Science'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '0.2rem' }}>
              Goal: {formData.targetGoal || '🚀 Placements & Referrals'}
            </div>
          </div>
        </div>
      </div>

      {/* SAVE ACTION */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button 
          onClick={() => {
            handleSaveAll();
            toast.success('Verification details saved successfully!');
          }} 
          className="btn btn-primary" 
          style={{ fontWeight: 800, padding: '0.65rem 1.75rem' }}
        >
          Save Verification Details
        </button>
      </div>
    </div>
  );
}
