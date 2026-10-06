import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Download, 
  ExternalLink, 
  Eye, 
  Filter, 
  GraduationCap, 
  MessageSquare, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  User, 
  Zap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function ClassHistoryScreen({ setActiveTab }) {
  const { profile, updateProfileState } = useAuth();
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'upcoming'
  const [searchQuery, setSearchQuery] = useState('');
  const [hourlyRate, setHourlyRate] = useState(profile?.hourlyRate || 150);
  const [coinRate, setCoinRate] = useState(profile?.coinRate || 45);
  const [isAvailable, setIsAvailable] = useState(profile?.isAvailableForMentoring !== false);
  const [isSavingRates, setIsSavingRates] = useState(false);

  // Full history of conducted peer sessions with verified reviews
  const classHistory = [
    {
      id: 'cls-101',
      topic: 'Dynamic Programming: 0/1 Knapsack & Memoization Patterns',
      subject: 'Data Structures & Algorithms',
      studentName: 'Bhavna Patel',
      studentCollege: 'IIT Madras',
      studentBranch: 'Computer Science (2nd Year)',
      duration: '45 mins',
      date: 'Yesterday at 6:30 PM',
      fee: 150,
      coins: 45,
      rating: 5.0,
      status: 'completed',
      escrowStatus: 'Released via UPI Escrow',
      review: 'Aarav is an exceptional peer mentor! Clear recurrence tree diagrams and intuitive whiteboard explanation for state transitions.',
      tags: ['DP', 'Java', 'Recursion']
    },
    {
      id: 'cls-102',
      topic: 'Spring Boot Microservices & JPA Cascading Deep Dive',
      subject: 'Backend Engineering',
      studentName: 'Chaitanya Reddy',
      studentCollege: 'BITS Pilani',
      studentBranch: 'Information Systems (3rd Year)',
      duration: '60 mins',
      date: 'Sep 24, 2026 at 8:00 PM',
      fee: 200,
      coins: 60,
      rating: 4.9,
      status: 'completed',
      escrowStatus: 'Released via UPI Escrow',
      review: 'Saved me hours of frustrating debugging before my semester mini-project deadline. 100% recommended for Spring Boot!',
      tags: ['Spring Boot', 'REST APIs', 'SQL']
    },
    {
      id: 'cls-103',
      topic: 'React Custom Hooks & Preventing Memory Leaks in useEffect',
      subject: 'Web Development',
      studentName: 'Kavya Subramanian',
      studentCollege: 'IIT Delhi',
      studentBranch: 'Electrical Engg (2nd Year)',
      duration: '45 mins',
      date: 'Sep 21, 2026 at 5:00 PM',
      fee: 150,
      coins: 45,
      rating: 5.0,
      status: 'completed',
      escrowStatus: 'Released via UPI Escrow',
      review: 'Understood cleanup functions and AbortController in 20 minutes. Practical live coding during the session was gold.',
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: 'cls-104',
      topic: 'Binary Trees & Level Order Traversal with Queues in Java',
      subject: 'Data Structures & Algorithms',
      studentName: 'Rohan Deshmukh',
      studentCollege: 'IIT Bombay',
      studentBranch: 'Mechanical Engg (Minor in CS)',
      duration: '60 mins',
      date: 'Sep 18, 2026 at 7:15 PM',
      fee: 200,
      coins: 60,
      rating: 4.8,
      status: 'completed',
      escrowStatus: 'Released via UPI Escrow',
      review: 'Great patience and guided practice problems. Helped me build intuition instead of just memorizing the syntax.',
      tags: ['Trees', 'BFS', 'Java']
    },
    {
      id: 'cls-105',
      topic: 'System Design: Designing Rate Limiters & Token Bucket Algorithm',
      subject: 'Placement Preparation',
      studentName: 'Ananya Verma',
      studentCollege: 'NIT Trichy',
      studentBranch: 'Computer Science (4th Year)',
      duration: '60 mins',
      date: 'Sep 14, 2026 at 9:00 PM',
      fee: 250,
      coins: 75,
      rating: 5.0,
      status: 'completed',
      escrowStatus: 'Released via UPI Escrow',
      review: 'Mock interview format was very realistic. Got pointed feedback on trade-offs and Redis implementation.',
      tags: ['System Design', 'Redis', 'Placements']
    },
    {
      id: 'cls-106',
      topic: 'Graph Algorithms: Dijkstra Shortest Path & Priority Queues',
      subject: 'Data Structures & Algorithms',
      studentName: 'Vikram Joshi',
      studentCollege: 'JNTU Hyderabad',
      studentBranch: 'CSE (3rd Year)',
      duration: '45 mins',
      date: 'Upcoming: Tomorrow at 7:00 PM',
      fee: 150,
      coins: 45,
      rating: null,
      status: 'upcoming',
      escrowStatus: 'Escrow Locked (Held Securely)',
      review: null,
      tags: ['Graphs', 'Dijkstra', 'Heaps']
    }
  ];

  const filteredHistory = classHistory.filter(item => {
    if (activeFilter === 'completed' && item.status !== 'completed') return false;
    if (activeFilter === 'upcoming' && item.status !== 'upcoming') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.topic.toLowerCase().includes(q) ||
        item.studentName.toLowerCase().includes(q) ||
        item.studentCollege.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveRates = () => {
    setIsSavingRates(true);
    const updated = {
      ...(profile || {}),
      hourlyRate: parseInt(hourlyRate) || 150,
      coinRate: parseInt(coinRate) || 45,
      isAvailableForMentoring: isAvailable
    };
    if (updateProfileState) {
      updateProfileState(updated);
    }
    localStorage.setItem(`studyloop_profile_${updated.id || 'me'}`, JSON.stringify(updated));
    setTimeout(() => {
      setIsSavingRates(false);
      toast.success('Live class hourly rates & mentoring availability updated successfully!');
    }, 300);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-primary)', padding: '1.25rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* TOP BREADCRUMB & QUICK NAV */}
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
              onClick={() => setActiveTab('privacy_settings')}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, padding: '0.45rem 0.9rem' }}
            >
              <ShieldCheck size={15} style={{ color: 'var(--accent-primary)' }} /> Privacy Settings
            </button>
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Peer Mentoring Studio • StudyLoop Verified Scholar
          </span>
        </div>

        {/* HERO BANNER */}
        <div className="card-premium" style={{
          padding: '1.75rem 2rem',
          background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid rgba(0, 102, 255, 0.25)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.75rem' }}>🧑‍🏫</span>
              <h1 className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                1:1 Live Classes & Teaching History
              </h1>
              <span className="tag" style={{ background: '#10b981', color: '#ffffff', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.65rem' }}>
                ✓ Verified Mentor
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0', maxWidth: '720px' }}>
              Dedicated ledger of all 1:1 doubt-solving and concept classes taught on StudyLoop, student reviews, rate controls, and UPI escrow settlements.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => toast.info('📥 Downloading consolidated classes ledger statement (PDF)...')}
              className="btn btn-secondary"
              style={{ fontWeight: 700, fontSize: '0.8125rem', padding: '0.55rem 1rem' }}
            >
              <Download size={14} /> Download Ledger
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className="btn btn-primary"
              style={{ fontWeight: 800, fontSize: '0.8125rem', padding: '0.55rem 1.15rem' }}
            >
              <Calendar size={14} /> Live Schedule
            </button>
          </div>
        </div>

        {/* 4 KPI METRIC SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          
          <div className="card-premium" style={{ padding: '1.25rem', border: '1px solid rgba(0, 102, 255, 0.25)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Classes Conducted
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 102, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                <Calendar size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              24 <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>sessions</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> 100% On-time completion record
            </div>
          </div>

          <div className="card-premium" style={{ padding: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.25)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Peer Earnings
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              ₹3,600
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              100% Direct Student UPI (₹0 Commission)
            </div>
          </div>

          <div className="card-premium" style={{ padding: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.25)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Student Rating
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <Star size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              4.92 <span style={{ fontSize: '1rem', color: '#f59e0b' }}>⭐</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              From 38 cross-campus student reviews
            </div>
          </div>

          <div className="card-premium" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Peer Coins Balance
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <Coins size={16} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              45 🪙
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '0.25rem' }}>
              Redeemable for mock interviews & perks
            </div>
          </div>

        </div>

        {/* HOURLY RATE CONTROLS & INSTANT AVAILABILITY */}
        <div className="card-premium" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                ⚙️ Live Class Pricing & Booking Preferences
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                Set what students pay when scheduling a 45-60 min 1:1 concept class with you.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: isAvailable ? '#10b981' : 'var(--text-muted)' }}>
                {isAvailable ? '🟢 Available for Student Bookings' : '⚪ Mentoring Paused'}
              </span>
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={e => setIsAvailable(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label className="label">Hourly Rate in INR (₹)</label>
              <input
                type="number"
                className="input"
                value={hourlyRate}
                onChange={e => setHourlyRate(e.target.value)}
                placeholder="150"
              />
            </div>

            <div>
              <label className="label">Rate in StudyLoop Coins (🪙)</label>
              <input
                type="number"
                className="input"
                value={coinRate}
                onChange={e => setCoinRate(e.target.value)}
                placeholder="45"
              />
            </div>

            <div>
              <button
                onClick={handleSaveRates}
                disabled={isSavingRates}
                className="btn btn-primary"
                style={{ width: '100%', fontWeight: 800, padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {isSavingRates ? <RefreshCw size={14} className="spin" /> : <ShieldCheck size={14} />}
                <span>{isSavingRates ? 'Updating...' : 'Update Class Rates'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CLASS HISTORY LOG & STUDENT FEEDBACK */}
        <div className="card-premium" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
          
          {/* HEADER & FILTERS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                📜 Sessions Log & Verified Student Feedback
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                Showing {filteredHistory.length} of {classHistory.length} recorded peer learning classes
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter student or topic..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.78rem', color: 'var(--text-primary)', width: '160px' }}
                />
              </div>

              <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {[
                  { id: 'all', label: 'All (24)' },
                  { id: 'completed', label: 'Completed (22)' },
                  { id: 'upcoming', label: 'Upcoming (2)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    style={{
                      border: 'none',
                      background: activeFilter === tab.id ? 'var(--bg-card)' : 'transparent',
                      color: activeFilter === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: activeFilter === tab.id ? 800 : 600,
                      fontSize: '0.75rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      boxShadow: activeFilter === tab.id ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SESSIONS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredHistory.map((cls) => {
              const isDone = cls.status === 'completed';
              return (
                <div
                  key={cls.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {cls.topic}
                        </span>
                        <span className="tag" style={{
                          backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 102, 255, 0.12)',
                          color: isDone ? '#10b981' : 'var(--accent-primary)',
                          fontSize: '0.65rem',
                          fontWeight: 800
                        }}>
                          {isDone ? '✓ Completed' : '⚡ Upcoming Session'}
                        </span>
                        <span className="tag tag-secondary" style={{ fontSize: '0.65rem' }}>
                          {cls.subject}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span>Student: <strong>{cls.studentName}</strong></span>
                        <span>•</span>
                        <span>{cls.studentCollege} ({cls.studentBranch})</span>
                        <span>•</span>
                        <span>⏱️ {cls.duration}</span>
                        <span>•</span>
                        <span>📅 {cls.date}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>
                        +₹{cls.fee} <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>({cls.coins} 🪙)</span>
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {cls.escrowStatus}
                      </span>
                      {cls.rating && (
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b' }}>
                          ⭐ {cls.rating} / 5.0
                        </span>
                      )}
                    </div>
                  </div>

                  {cls.review && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-card)',
                      borderLeft: '3px solid #10b981',
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic',
                      lineHeight: 1.45
                    }}>
                      "{cls.review}"
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {cls.tags.map((t, idx) => (
                        <span key={idx} style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => toast.info(`📥 Downloading class session receipt #${cls.id}...`)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem' }}
                      >
                        Receipt
                      </button>
                      <button
                        onClick={() => toast.info(`Viewing class whiteboard & doubt notes for "${cls.topic}"`)}
                        className="btn btn-accent"
                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem' }}
                      >
                        Session Notes ↗
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
