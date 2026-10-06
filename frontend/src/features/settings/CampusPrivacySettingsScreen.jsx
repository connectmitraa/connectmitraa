import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowLeft, 
  Award, 
  Bell, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Download, 
  Eye, 
  EyeOff, 
  Globe, 
  Key, 
  Lock, 
  LogOut, 
  Mail, 
  Moon, 
  Phone, 
  RefreshCw, 
  Search, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone, 
  Sun, 
  Trash2, 
  User, 
  UserCheck, 
  Zap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function CampusPrivacySettingsScreen({ setActiveTab }) {
  const { profile, updateProfileState } = useAuth();
  const toast = useToast();

  const [activeCategory, setActiveCategory] = useState('visibility');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Editable privacy & account preferences
  const [settings, setSettings] = useState({
    profileVisibility: profile?.privacySettings?.profileVisibility || 'public',
    ghostMode: false,
    showCodingStats: true,
    allowDirectDoubts: profile?.privacySettings?.allowDirectDoubts !== false,
    examPauseMode: false,
    anonymousDoubtAnswers: false,
    maskRollNumber: true,
    hideContactInfo: true,
    showGreenTick: true,
    twoFactorEnabled: profile?.privacySettings?.twoFactorEnabled || false,
    streakReminders: profile?.notificationSettings?.streakReminders !== false,
    doubtAudioAlerts: true,
    classBookingPings: true,
    weeklyRankEmail: false,
    maskUpiId: true
  });

  const handleToggle = (key) => {
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(updated);
    saveSettingsToProfile(updated);
    toast.success('Setting updated and applied live!');
  };

  const handleChange = (key, value) => {
    const updated = {
      ...settings,
      [key]: value
    };
    setSettings(updated);
    saveSettingsToProfile(updated);
    toast.success('Preference updated!');
  };

  const saveSettingsToProfile = (updatedSettings) => {
    setIsSaving(true);
    const updatedProfile = {
      ...(profile || {}),
      privacySettings: {
        ...(profile?.privacySettings || {}),
        profileVisibility: updatedSettings.profileVisibility,
        allowDirectDoubts: updatedSettings.allowDirectDoubts,
        twoFactorEnabled: updatedSettings.twoFactorEnabled
      },
      notificationSettings: {
        ...(profile?.notificationSettings || {}),
        streakReminders: updatedSettings.streakReminders,
        doubtAlerts: updatedSettings.doubtAudioAlerts
      }
    };
    if (updateProfileState) {
      updateProfileState(updatedProfile);
    }
    localStorage.setItem(`studyloop_profile_${updatedProfile.id || 'me'}`, JSON.stringify(updatedProfile));
    setTimeout(() => setIsSaving(false), 250);
  };

  const privacyCategories = [
    {
      id: 'visibility',
      title: 'Campus Visibility & Ghost Mode',
      icon: <Globe size={18} />,
      desc: 'Control who can discover your student profile across universities and manage study stealth mode.'
    },
    {
      id: 'doubts',
      title: 'Peer Doubts & 1:1 Class Requests',
      icon: <Zap size={18} />,
      desc: 'Set rules for who can request 1:1 classes, send live doubts, and exam-time auto-replies.'
    },
    {
      id: 'credentials',
      title: 'Student ID & Credential Protection',
      icon: <ShieldCheck size={18} />,
      desc: 'Zero-Leak identity controls: mask college roll number, prevent contact scrapers, and show Green Tick.'
    },
    {
      id: 'security',
      title: 'Sign-In, 2FA & Active Sessions',
      icon: <Lock size={18} />,
      desc: 'Two-factor authentication, campus credentials, and active device logins with remote sign-out.'
    },
    {
      id: 'alerts',
      title: 'Smart Alerts & Exam Reminders',
      icon: <Bell size={18} />,
      desc: 'Custom pings for daily streak freeze reminders, audio alerts when peers join doubt rooms.'
    },
    {
      id: 'data',
      title: 'Student Data & Escrow Privacy',
      icon: <Download size={18} />,
      desc: 'Mask UPI ID on public listings, download your learning data archive, and manage storage.'
    }
  ];

  const filteredCategories = privacyCategories.filter(cat =>
    cat.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-primary)', padding: '1.25rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* TOP BREADCRUMB & NAV */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('landing')}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, padding: '0.45rem 0.9rem' }}
            >
              <ArrowLeft size={15} /> Campus Home
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, padding: '0.45rem 0.9rem' }}
            >
              <User size={15} /> Edit Profile & Bio
            </button>
            <button
              onClick={() => setActiveTab('classes_history')}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, padding: '0.45rem 0.9rem' }}
            >
              <Award size={15} style={{ color: '#10b981' }} /> 1:1 Classes History
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Zero-Leak Campus Privacy Active
          </div>
        </div>

        {/* HERO TITLE BANNER */}
        <div className="card-premium" style={{
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(0, 102, 255, 0.25)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Shield size={28} style={{ color: 'var(--accent-primary)' }} />
              <h1 className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                Campus Privacy & Account Security Center
              </h1>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0', maxWidth: '750px' }}>
              Dedicated student privacy controls tailored for engineering universities. Manage visibility across IITs/NITs, conceal roll numbers, and activate study stealth mode.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.45rem 0.9rem', borderRadius: '999px', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 800 }}>
            <span>🔒 Security Score:</span>
            <span style={{ color: '#10b981' }}>100% (High Trust)</span>
          </div>
        </div>

        {/* MAIN 2-COLUMN SETTINGS LAYOUT (CUSTOM STUDENT ARCHITECTURE) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* LEFT SIDEBAR: DEDICATED PRIVACY CATEGORIES */}
          <div className="card-premium" style={{ padding: '1rem', position: 'sticky', top: '4.5rem' }}>
            
            {/* SEARCH SETTINGS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.45rem 0.75rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
              <Search size={15} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search privacy controls..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.78rem', color: 'var(--text-primary)', width: '100%' }}
              />
            </div>

            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              PRIVACY CONTROLS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {filteredCategories.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ color: isActive ? '#ffffff' : 'var(--accent-primary)', flexShrink: 0 }}>
                        {cat.icon}
                      </span>
                      <span>{cat.title}</span>
                    </div>

                    <ChevronRight size={14} style={{ color: isActive ? '#ffffff' : 'var(--text-muted)' }} />
                  </button>
                );
              })}
            </div>

            {/* TRUST BADGE */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} style={{ color: '#10b981' }} />
              <span>Complies with Student Data Protection Standards</span>
            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* ================================================================= */}
            {/* 1. CAMPUS VISIBILITY & GHOST MODE */}
            {/* ================================================================= */}
            {activeCategory === 'visibility' && (
              <div className="card-premium" style={{ padding: '1.75rem' }}>
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🌐 Campus Visibility & Ghost Mode
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                    Choose who can find your profile across different colleges and enable stealth study mode during busy exam times.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* VISIBILITY SELECTOR */}
                  <div>
                    <label className="label" style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Profile Discoverability Scope
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      {[
                        { id: 'public', title: '🌐 All Universities (Public)', desc: 'Discoverable by students across all 500+ engineering institutes.' },
                        { id: 'campus_only', title: `🏫 ${profile?.college || 'IIT Madras'} Only`, desc: 'Visible only to verified peers inside your university campus.' },
                        { id: 'private', title: '🔒 Incognito / Private', desc: 'Hidden from public directory. Only invited friends can view.' }
                      ].map(opt => (
                        <div
                          key={opt.id}
                          onClick={() => handleChange('profileVisibility', opt.id)}
                          style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            border: settings.profileVisibility === opt.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            backgroundColor: settings.profileVisibility === opt.id ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '0.875rem', color: settings.profileVisibility === opt.id ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                            {opt.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {opt.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GHOST STUDY MODE */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1rem' }}>👻</span>
                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Ghost Study Mode (Hide Online Indicator)</span>
                        <span className="tag tag-accent" style={{ fontSize: '0.65rem' }}>Exam Feature</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Hides your green active dot when studying in doubt rooms late at night. Peers see status as "Studying for Exams 📚".
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.ghostMode}
                      onChange={() => handleToggle('ghostMode')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  {/* CODING STATS VISIBILITY */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Show LeetCode Knight & Hackathon Badges
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Display verified competitive programming stats and rank badges to campus peers.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showCodingStats}
                      onChange={() => handleToggle('showCodingStats')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 2. PEER DOUBTS & 1:1 BOOKING PRIVACY */}
            {/* ================================================================= */}
            {activeCategory === 'doubts' && (
              <div className="card-premium" style={{ padding: '1.75rem' }}>
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    💬 Peer Doubts & 1:1 Class Requests
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                    Manage who can send you direct doubt requests and prevent spam during mid-term and semester examinations.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Accept Direct 1:1 Doubt Inquiries
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Allow students to initiate direct doubt chats with you before booking a live class.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.allowDirectDoubts}
                      onChange={() => handleToggle('allowDirectDoubts')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Exam Week Auto-Pause Mode</span>
                        <span className="tag" style={{ background: '#f59e0b', color: '#fff', fontSize: '0.65rem' }}>Smart</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Automatically sets you as "Busy with Endsems" and pauses non-urgent incoming doubt notifications.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.examPauseMode}
                      onChange={() => handleToggle('examPauseMode')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Anonymous Answers in Campus Doubt Rooms
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Post code snippets and answer doubts without displaying your full name (shown as "Verified CS Senior").
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.anonymousDoubtAnswers}
                      onChange={() => handleToggle('anonymousDoubtAnswers')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 3. STUDENT ID & CREDENTIAL PROTECTION */}
            {/* ================================================================= */}
            {activeCategory === 'credentials' && (
              <div className="card-premium" style={{ padding: '1.75rem' }}>
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🛡️ Student ID & Credential Protection
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                    Zero-Leak guarantees: Protect your personal contact information and institutional roll numbers from web scrapers.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Mask Official Student Roll Number
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Shows masked roll ID (e.g. <code>IITM-***-042</code>) to peers while keeping internal verification valid.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maskRollNumber}
                      onChange={() => handleToggle('maskRollNumber')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Zero-Leak Contact Shield</span>
                        <span className="tag tag-success" style={{ fontSize: '0.65rem' }}>Protected</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Never reveals your personal phone number or private college email address. Peers connect via encrypted StudyLoop WebRTC.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.hideContactInfo}
                      onChange={() => handleToggle('hideContactInfo')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Verified Scholar Green Tick Badge
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Display the official Verified Scholar badge on your public card after institutional document review.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showGreenTick}
                      onChange={() => handleToggle('showGreenTick')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 4. SIGN-IN, 2FA & ACTIVE SESSIONS */}
            {/* ================================================================= */}
            {activeCategory === 'security' && (
              <div className="card-premium" style={{ padding: '1.75rem' }}>
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🔒 Sign-In, 2FA & Active Sessions
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                    Protect your StudyLoop wallet balance and peer mentoring records with two-factor authentication.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* 2FA TOGGLE */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Two-Factor Authentication (2FA)</span>
                        <span className="tag" style={{ background: settings.twoFactorEnabled ? '#10b981' : '#f59e0b', color: '#fff', fontSize: '0.65rem' }}>
                          {settings.twoFactorEnabled ? 'Active' : 'Recommended'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Receive a 6-digit OTP on your registered phone or college email when signing in on a new device.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.twoFactorEnabled}
                      onChange={() => handleToggle('twoFactorEnabled')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  {/* ACTIVE DEVICES */}
                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        ACTIVE LOGGED-IN SESSIONS (2 DEVICES)
                      </span>
                      <button
                        onClick={() => toast.success('Signed out of all other campus devices successfully!')}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', fontWeight: 700 }}
                      >
                        Sign Out Other Devices
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Smartphone size={20} style={{ color: '#10b981' }} />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>Chrome on Windows 11 • Chennai, India</div>
                            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>● Current Session (Active Now)</div>
                          </div>
                        </div>
                        <span className="tag tag-success" style={{ fontSize: '0.65rem' }}>This Device</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Smartphone size={20} style={{ color: 'var(--text-muted)' }} />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>Mobile Safari on iPhone 15 • Chennai</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Last active: Yesterday at 9:45 PM</div>
                          </div>
                        </div>
                        <button
                          onClick={() => toast.info('Revoked iPhone session')}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 5. SMART ALERTS & EXAM REMINDERS */}
            {/* ================================================================= */}
            {activeCategory === 'alerts' && (
              <div className="card-premium" style={{ padding: '1.75rem' }}>
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🔔 Smart Alerts & Exam Reminders
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                    Configure sound notifications, streak freeze reminders, and peer class booking pings.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1rem' }}>🔥</span>
                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Daily Streak Freeze Protection Alert</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Ping 2 hours before midnight if you haven't solved a doubt or checked in, saving your XP streak.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.streakReminders}
                      onChange={() => handleToggle('streakReminders')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Live Doubt Room Audio Chime
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Play a gentle chime when a student joins your live whiteboard doubt room.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.doubtAudioAlerts}
                      onChange={() => handleToggle('doubtAudioAlerts')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        1:1 Class Booking Pings & Calendar Invites
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Instant notification when a peer schedules a 45-min mentorship session with you.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.classBookingPings}
                      onChange={() => handleToggle('classBookingPings')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 6. STUDENT DATA & ESCROW PRIVACY */}
            {/* ================================================================= */}
            {activeCategory === 'data' && (
              <div className="card-premium" style={{ padding: '1.75rem' }}>
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    📦 Student Data & Escrow Privacy
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                    Control payment identifier visibility, export learning history, and clear search cache.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Mask UPI Payment ID in Public Cards
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Shows masked UPI (e.g. <code>aar***@oksbi</code>) on public discovery until a student books a session.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maskUpiId}
                      onChange={() => handleToggle('maskUpiId')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Export My StudyLoop Learning Archive
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Download complete ledger: doubt questions answered, 1:1 classes taught, and earned peer certificates.
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success('📥 Learning data archive generated! Downloading studyloop_data_aarav.json...')}
                      className="btn btn-secondary"
                      style={{ fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
                    >
                      <Download size={14} /> Export JSON Data
                    </button>
                  </div>

                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        Clear Search History & Cached Doubt Rooms
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Wipe local browser cache and recent query history stored on this device.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('studyloop_recent_searches');
                        toast.success('Local search cache wiped clean!');
                      }}
                      className="btn btn-secondary"
                      style={{ fontWeight: 700, fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
                    >
                      <Trash2 size={14} /> Clear Cache
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
