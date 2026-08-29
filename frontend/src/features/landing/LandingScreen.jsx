import React, { useState } from 'react';
import { ArrowRight, Award, BookOpen, CheckCircle, ChevronRight, Eye, EyeOff, Github, Globe, HelpCircle, Laptop, Lock, LogIn, Mail, MessageSquare, Moon, Shield, ShieldAlert, Sparkles, Star, Sun, Trophy, Tv2, UserPlus, Users, Video, X, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function LandingScreen({ setActiveTab, loginSimulated, loginAdmin, testAccounts, theme, setTheme, postLoginRedirectTab, setPostLoginRedirectTab }) {
  const { user, profile } = useAuth();
  const [authTab, setAuthTab] = useState('signup'); // 'signup', 'login', 'admin'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // Student Login States
  const [loginEmail, setLoginEmail] = useState('studenta@student.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Student Signup States
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState('admin@studyloop.app');
  const [adminPassword, setAdminPassword] = useState('password123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    
    // Direct admin login routing
    if (loginEmail.trim().toLowerCase() === 'admin@studyloop.app') {
      loginAdmin(loginEmail.trim());
      setShowAuthModal(false);
      setActiveTab('admin');
      return;
    }
    
    loginSimulated(loginEmail);
    setActiveTab(postLoginRedirectTab || 'dashboard');
    if (setPostLoginRedirectTab) setPostLoginRedirectTab(null);
    setShowAuthModal(false);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupEmail) return;
    if (signupPassword && confirmPassword && signupPassword !== confirmPassword) {
      alert("Passwords do not match! Please check your password input.");
      return;
    }
    if (!agreeTerms) {
      alert("Please agree to the Terms & Conditions to proceed.");
      return;
    }
    loginSimulated(signupEmail);
    setActiveTab(postLoginRedirectTab || 'dashboard');
    if (setPostLoginRedirectTab) setPostLoginRedirectTab(null);
    setShowAuthModal(false);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!adminEmail) return;
    loginAdmin(adminEmail);
    setShowAuthModal(false);
    setActiveTab('admin');
  };

  const handleGoogleSSO = () => {
    const defaultTestUser = testAccounts[0]?.email || 'studenta@student.com';
    loginSimulated(defaultTestUser);
    setActiveTab(postLoginRedirectTab || 'dashboard');
    if (setPostLoginRedirectTab) setPostLoginRedirectTab(null);
    setShowAuthModal(false);
  };

  // 1. VISITOR LANDING SCREEN
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* HEADER NAVBAR */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 3rem',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setShowAuthModal(false)}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <span className="font-serif" style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.25rem' }}>SL</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>Study</span>
                <span className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Loop</span>
              </div>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                LEARN • BUILD • EVOLVE
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
            <button onClick={() => { setShowAuthModal(false); }} style={{ background: 'transparent', border: 'none', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.875rem', cursor: 'pointer' }}>Home</button>
            <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>Doubt Hub</button>
            <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>Peer Mentors</button>
            <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>Leaderboard</button>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="btn-icon"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)'
              }}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button 
              onClick={() => { setLoginEmail('studenta@student.com'); setLoginPassword('password123'); setAuthTab('login'); setShowAuthModal(true); }}
              className="btn btn-secondary" 
              style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
            >
              Login
            </button>
            <button 
              onClick={() => { setAuthTab('signup'); setShowAuthModal(true); }}
              className="btn btn-accent glow-amber" 
              style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700 }}
            >
              Get Started 🚀
            </button>
          </div>
        </header>

        {/* HERO SECTION (UNSTOP + CHEGG + LINKEDIN HYBRID) */}
        <section style={{ padding: '4.5rem 3rem 5rem 3rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div className="unstop-hero-grid">
            {/* Left Hero Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-light)', border: '1px solid var(--border-color)', padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Sparkles size={16} /> Peer Learning & Doubt Resolution Platform
              </div>

              <h1 className="font-serif" style={{ fontSize: '3.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                Accelerate Academic Growth With <span className="gradient-text">Live Peer Learning.</span>
              </h1>

              <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '580px' }}>
                Connect with verified peer tutors, resolve complex doubts 24/7 in live Doubt Rooms, launch zero-latency WebRTC code sessions with screen sharing, and build campus rank.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
                <button 
                  onClick={() => { setAuthTab('signup'); setShowAuthModal(true); }}
                  className="btn btn-accent"
                  style={{
                    padding: '0.875rem 2rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  Find Peer Mentors →
                </button>

                <button 
                  onClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.875rem 1.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9375rem',
                    fontWeight: 600
                  }}
                >
                  Ask a Doubt Now
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="badge-unstop-pill"><CheckCircle size={14} style={{ color: 'var(--success-color)' }} /> Verified Campus Tutors</span>
                <span className="badge-unstop-pill badge-unstop-purple"><Video size={14} /> WebRTC Screen Sharing</span>
                <span className="badge-unstop-pill badge-unstop-green"><ShieldAlert size={14} /> Instant Doubt Match</span>
              </div>
            </div>

            {/* Right Interactive Quick Action Widget */}
            <div className="unstop-quick-widget card-premium">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="live-dot" style={{ backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instant Doubt Workspace</span>
                </div>
                <span className="tag tag-accent" style={{ fontWeight: 700 }}>⚡ 48 Tutors Online</span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 500 }}>
                Select a subject to instantly pair with an available campus tutor or enter a live study room:
              </p>

              {/* Subject Filter Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} className="tag tag-accent" style={{ padding: '0.375rem 0.875rem', cursor: 'pointer', fontWeight: 700 }}>💻 Data Structures</button>
                <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} className="tag" style={{ padding: '0.375rem 0.875rem', cursor: 'pointer', fontWeight: 600 }}>☕ Java / Spring</button>
                <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} className="tag" style={{ padding: '0.375rem 0.875rem', cursor: 'pointer', fontWeight: 600 }}>⚛️ React & Frontend</button>
                <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} className="tag" style={{ padding: '0.375rem 0.875rem', cursor: 'pointer', fontWeight: 600 }}>🤖 AI / ML Systems</button>
              </div>

              {/* Live Room Ticker Preview */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem' }}>
                    CS
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Algorithm Doubt Room #04</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IIT Madras • 6 Active Learners</div>
                  </div>
                </div>
                <button onClick={() => { setAuthTab('login'); setShowAuthModal(true); }} className="btn btn-primary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  Join Live →
                </button>
              </div>

              <button 
                onClick={() => { setAuthTab('signup'); setShowAuthModal(true); }} 
                className="btn btn-accent" 
                style={{ width: '100%', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontWeight: 700, fontSize: '0.875rem' }}
              >
                Launch Live Doubt Session 🚀
              </button>
            </div>
          </div>
        </section>

        {/* PLATFORM STATS STRIP */}
        <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '2.5rem 3rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', borderRight: '1px solid var(--border-color)' }}>
              <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>25,000+</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>Active Campus Learners</div>
            </div>
            <div style={{ padding: '1rem', borderRight: '1px solid var(--border-color)' }}>
              <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>150+</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>Expert Peer Mentors</div>
            </div>
            <div style={{ padding: '1rem', borderRight: '1px solid var(--border-color)' }}>
              <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success-color)' }}>98.4%</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>Doubt Resolution Rate</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--warning-color)' }}>24/7</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>Live Peer Tutor Access</div>
            </div>
          </div>
        </section>

        {/* CORE PLATFORM FEATURES GRID */}
        <section style={{ padding: '5rem 3rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--accent-primary)', backgroundColor: 'var(--accent-light)', padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase' }}>
              Core Learning Modules
            </span>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '1rem' }}>
              Built for Modern High-Growth Education
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
              Combining interactive live study rooms with peer mentoring, concept shorts, and gamified campus leaderboards.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpCircle size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>1-to-1 Live Doubt Rooms</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Open a dedicated doubt workspace, collaborate with a peer from your department, and start 1-click video calls with screen share.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>8-Factor Smart Peer Discovery</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Intelligent matching evaluating university, department, skills, learning goals, and mutual connections for exact tutor pairings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>WebRTC Code Study Calls</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                In-browser video study calls with zero-latency screen sharing, peer code evaluation, and collaborative doubt solving.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tv2 size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Educational Concept Shorts</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Watch and publish 60-second vertical concept shorts with interactive likes, slide-up community comments, and topic pills.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Campus Leaderboard & XP</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Earn XP points, unlock level badges, and accumulate peer coins for solving doubts, climbing to Rank #1 on your campus.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Real-Time Direct Messaging</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Connect directly with campus tutors, exchange instant messages, and schedule 1-on-1 study sessions seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* 3-STEP "HOW IT WORKS" JOURNEY */}
        <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '5rem 3rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Simple 3-Step Process
            </span>
            <h2 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.75rem', marginBottom: '3rem' }}>
              How StudyLoop Transforms Campus Learning
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  1
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Post Your Academic Doubt</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Choose your topic, add code snippets or questions, and open a live workspace.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  2
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Match With a Campus Mentor</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Our 8-factor algorithm instantly pairs you with top-rated peer tutors from your university.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  3
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Solve Live & Earn XP</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Collaborate in real-time with WebRTC video, screen sharing, and earn leaderboard XP.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CLEAN, PROFESSIONAL 4-COLUMN FOOTER (NO DUPLICATES) */}
        <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '4rem 3rem 2rem 3rem', marginTop: 'auto' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border-color)' }}>
            
            {/* Column 1: Identity & Newsletter */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800 }}>SL</div>
                <span className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>StudyLoop</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '360px', marginBottom: '1.5rem' }}>
                StudyLoop is the premier peer-to-peer campus learning network for universities, student tutors, and engineering academies.
              </p>
              <form onSubmit={e => { e.preventDefault(); alert(`Subscribed ${newsletterEmail} to StudyLoop updates!`); setNewsletterEmail(''); }} style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px' }}>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="Enter college email" 
                  value={newsletterEmail} 
                  onChange={e => setNewsletterEmail(e.target.value)} 
                  style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}
                  required 
                />
                <button type="submit" className="btn btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                  Join →
                </button>
              </form>
            </div>

            {/* Column 2: Platform Features */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>PLATFORM</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Doubt Hub</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Peer Mentors</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Campus Leaderboard</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Educational Shorts</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Live Study Rooms</a></li>
              </ul>
            </div>

            {/* Column 3: Resources & Guides */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>RESOURCES</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Exam Radar</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Digital Badges</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Campus Guide</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Community Guidelines</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</a></li>
              </ul>
            </div>

            {/* Column 4: Company & Legal */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>COMPANY</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Contact Support</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div style={{ maxWidth: '1400px', margin: '1.5rem auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <div>© 2026 StudyLoop Inc. All rights reserved. Peer safety audited & verified.</div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--text-secondary)' }}><Github size={18} /></a>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--text-secondary)' }}><Globe size={18} /></a>
            </div>
          </div>
        </footer>

        {/* AUTH MODAL OVERLAY (UNIFIED SIGNUP & LOGIN) */}
        {showAuthModal && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 4000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setShowAuthModal(false)}
          >
            <div 
              className="card-premium"
              style={{
                width: '100%',
                maxWidth: '920px',
                minHeight: '540px',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--bg-elevated)',
                display: 'grid',
                gridTemplateColumns: '1fr 1.15fr',
                overflow: 'hidden',
                padding: 0,
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button X */}
              <button 
                onClick={() => setShowAuthModal(false)} 
                className="btn-icon"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  zIndex: 10
                }}
              >
                <X size={20} />
              </button>

              {/* LEFT COLUMN: BRANDING & ART */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(99, 102, 241, 0.12) 100%)',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRight: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'var(--accent-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      <span className="font-serif" style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.125rem' }}>SL</span>
                    </div>
                    <span className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      StudyLoop
                    </span>
                  </div>

                  <h2 className="font-serif" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                    Learn. Teach. <span className="gradient-text">Connect.</span> Evolve.
                  </h2>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Join a campus community where students master technical skills, resolve academic doubts, and grow together.
                  </p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> 100% Peer Verified Network
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> Instant WebRTC Code Study Rooms
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> Campus Leaderboard & Medals
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: AUTH TABS & FORMS */}
              <div style={{
                padding: '2.5rem 2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflowY: 'auto'
              }}>
                {/* Switcher Tabs (Sign Up / Sign In) */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.375rem', 
                  marginBottom: '1.75rem', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  padding: '0.25rem', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <button 
                    type="button" 
                    onClick={() => setAuthTab('signup')} 
                    style={{ 
                      flex: 1, 
                      padding: '0.5rem', 
                      fontSize: '0.8125rem', 
                      fontWeight: 700, 
                      border: 'none', 
                      borderRadius: 'var(--radius-sm)', 
                      cursor: 'pointer',
                      backgroundColor: authTab === 'signup' ? 'var(--bg-secondary)' : 'transparent',
                      color: authTab === 'signup' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      boxShadow: authTab === 'signup' ? 'var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    🎓 Sign Up
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAuthTab('login')} 
                    style={{ 
                      flex: 1, 
                      padding: '0.5rem', 
                      fontSize: '0.8125rem', 
                      fontWeight: 700, 
                      border: 'none', 
                      borderRadius: 'var(--radius-sm)', 
                      cursor: 'pointer',
                      backgroundColor: authTab === 'login' ? 'var(--bg-secondary)' : 'transparent',
                      color: authTab === 'login' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      boxShadow: authTab === 'login' ? 'var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    🔑 Sign In
                  </button>
                </div>

                {/* TAB 1: SIGNUP FORM */}
                {authTab === 'signup' && (
                  <div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Create Student Account
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Join thousands of students learning and solving doubts together.
                      </p>
                    </div>

                    <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      <div>
                        <label className="label">Full Name</label>
                        <input type="text" className="input" placeholder="e.g. Aarav Sharma" value={fullName} onChange={e => setFullName(e.target.value)} required />
                      </div>

                      <div>
                        <label className="label">College Email</label>
                        <input type="email" className="input" placeholder="student@university.edu" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label className="label">Password</label>
                          <input type={showSignupPassword ? "text" : "password"} className="input" placeholder="••••••••" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required />
                        </div>
                        <div>
                          <label className="label">Confirm Password</label>
                          <input type={showSignupPassword ? "text" : "password"} className="input" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <input type="checkbox" id="agreeTerms" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} style={{ cursor: 'pointer' }} />
                        <label htmlFor="agreeTerms" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          I agree to the Community Guidelines & Terms of Service
                        </label>
                      </div>

                      <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
                        Create Account 🚀
                      </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Already have an account?{' '}
                      <button type="button" onClick={() => setAuthTab('login')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}>
                        Sign In
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: SIGN IN FORM */}
                {authTab === 'login' && (
                  <div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Welcome Back!
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Sign in to access your study rooms and mentor network 👋
                      </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label className="label">Email or Student ID</label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input type="email" className="input" placeholder="student@university.edu" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ paddingLeft: '2.5rem' }} required />
                        </div>
                      </div>

                      <div>
                        <label className="label">Password</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input type={showLoginPassword ? "text" : "password"} className="input" placeholder="••••••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} required />
                          <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}>
                        Sign In 🚀
                      </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700 }}>QUICK 1-CLICK DEMO</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => {
                        loginSimulated('studenta@student.com');
                        setShowAuthModal(false);
                        setActiveTab('dashboard');
                      }} 
                      className="btn btn-secondary" 
                      style={{ width: '100%', padding: '0.625rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      ⚡ 1-Click Demo Login (Aarav Sharma - Student)
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Don't have an account?{' '}
                      <button type="button" onClick={() => setAuthTab('signup')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}>
                        Sign Up
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // 2. LOGGED-IN HOME HUB SCREEN
  return (
    <div style={{ padding: '1.5rem 2.5rem 4rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* HERO BANNER */}
      <section className="card-premium" style={{ padding: '3rem 2.5rem', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="tag tag-accent" style={{ marginBottom: '1rem', padding: '0.375rem 1rem' }}>
          ✨ Active Peer Learning Workspace
        </div>
        <h1 className="font-serif gradient-text" style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '1rem' }}>
          Welcome Back, {profile?.fullName || 'Student Learner'}!
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '640px' }}>
          Connect with verified peer tutors, launch interactive live study sessions, post concept shorts, and track your campus leaderboard rank.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('dashboard')} className="btn btn-accent" style={{ padding: '0.75rem 1.75rem', fontWeight: 700 }}>
            Go to Student Profile 🚀
          </button>
          <button onClick={() => setActiveTab('doubts')} className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem', fontWeight: 600 }}>
            Join Live Doubt Rooms
          </button>
        </div>
      </section>

      {/* PLATFORM STATS */}
      <section className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
        <div className="grid-3" style={{ textAlign: 'center' }}>
          <div>
            <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>12,450+</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Campus Learners</div>
          </div>
          <div>
            <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--warning-color)' }}>98.4%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Academic Doubt Resolution</div>
          </div>
          <div>
            <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success-color)' }}>50+</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Top Universities</div>
          </div>
        </div>
      </section>

      {/* QUICK LAUNCH GRID */}
      <section>
        <h2 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          Student Quick Navigation
        </h2>
        <div className="grid-3">
          <div className="card-premium interactive-hover" onClick={() => setActiveTab('doubts')}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <HelpCircle size={24} />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>Doubt Hub</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Open a live workspace, pair with a department peer, and start video calls.
            </p>
          </div>

          <div className="card-premium interactive-hover" onClick={() => setActiveTab('discover')}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users size={24} />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>Peer Mentors</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Explore peer tutors with matching course skills, year, and ratings.
            </p>
          </div>

          <div className="card-premium interactive-hover" onClick={() => setActiveTab('reels')}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Tv2 size={24} />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>Concept Shorts</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Watch 60-second micro lectures and learn concepts on the go.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

