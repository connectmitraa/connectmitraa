import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, Award, BookOpen, Calendar, Filter, Loader2, MessageSquare, Search, Star, Users } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';
import { DiscoverAPI } from '../../lib/api';

export function DiscoverScreen({ token, setActiveTab, setActiveChatId, setChatPeer, onOpenPublicProfile, onOpenBookingModal }) {
  const [searchTopic, setSearchTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedComfortMode, setSelectedComfortMode] = useState('all');
  const [showBecomeMentorModal, setShowBecomeMentorModal] = useState(false);
  const [mentorApplication, setMentorApplication] = useState({
    subjects: 'Java, Spring Boot',
    languages: ['Telugu', 'English'],
    comfortModes: ['video', 'audio', 'chat'],
    rate: '50',
    bio: ''
  });

  // Real-time online status from WebSocket presence (fallback to static)
  const [onlineStatus, setOnlineStatus] = useState({ 't-1': true, 't-2': false, 't-3': true, 't-4': true, 't-5': false, 't-6': true });

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineStatus(prev => {
        const keys = Object.keys(prev);
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        return { ...prev, [randKey]: !prev[randKey] };
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const [tutors, setTutors] = useState([
    {
      id: 't-1',
      fullName: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'Computer Science',
      year: 3,
      avatarUrl: FEMALE_AVATAR_SVG,
      subject: 'Java',
      languages: ['Telugu', 'English', 'Hindi'],
      comfortModes: ['video', 'audio', 'chat'],
      topicsMastered: ['OOP Inheritance', 'Polymorphism', 'Multithreading', 'Spring Boot', 'Exception Handling'],
      rating: 4.9,
      classesTaught: 87,
      clarityScore: '96%',
      ratePerSession: 50,
      tier: 'certified',
      bio: 'Solved 87+ Java doubts for juniors. I explain OOP through real-world game character design in Telugu & English!'
    },
    {
      id: 't-2',
      fullName: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'Electrical & CS',
      year: 2,
      avatarUrl: MALE_AVATAR_SVG,
      subject: 'C / C++',
      languages: ['Telugu', 'English'],
      comfortModes: ['video', 'audio'],
      topicsMastered: ['Pointers & Dynamic Memory', 'Structures', 'Recursion', 'Memory Leaks', 'Valgrind'],
      rating: 4.8,
      classesTaught: 32,
      clarityScore: '94%',
      ratePerSession: 40,
      tier: 'certified',
      bio: 'Master C pointers and memory management without confusion. Fluent in Telugu explanation.'
    },
    {
      id: 't-3',
      fullName: 'Divya Nambiar',
      college: 'NIT Trichy',
      department: 'Data Science & AI',
      year: 3,
      avatarUrl: FEMALE_AVATAR_SVG,
      subject: 'Python & AI',
      languages: ['English', 'Tamil', 'Hindi'],
      comfortModes: ['video', 'chat'],
      topicsMastered: ['NumPy / Pandas', 'Gradient Descent', 'Data Structures in Python', 'FastAPI'],
      rating: 4.95,
      classesTaught: 104,
      clarityScore: '98%',
      ratePerSession: 75,
      tier: 'master',
      bio: 'Top 1% campus tutor. I break down machine learning math into simple Python lines.'
    },
    {
      id: 't-4',
      fullName: 'Rohan Deshmukh',
      college: 'IIT Bombay',
      department: 'Computer Science',
      year: 2,
      avatarUrl: MALE_AVATAR_SVG,
      subject: 'Data Structures',
      languages: ['English', 'Hindi'],
      comfortModes: ['video', 'audio', 'chat'],
      topicsMastered: ['Dynamic Programming (0/1 Knapsack)', 'Binary Search Trees', 'Graph BFS/DFS', 'Tries'],
      rating: 4.85,
      classesTaught: 45,
      clarityScore: '95%',
      ratePerSession: 60,
      tier: 'certified',
      bio: 'Stuck on DP state transitions or tree traversals? Let us code it out step-by-step.'
    },
    {
      id: 't-5',
      fullName: 'Kavya Subramanian',
      college: 'IIT Delhi',
      department: 'Software Engineering',
      year: 1,
      avatarUrl: FEMALE_AVATAR_SVG,
      subject: 'DBMS & SQL',
      languages: ['Telugu', 'English', 'Tamil'],
      comfortModes: ['video', 'audio', 'chat'],
      topicsMastered: ['Normalization (1NF-BCNF)', 'Complex Joins', 'Indexing & B-Trees', 'Transactions & ACID'],
      rating: 4.7,
      classesTaught: 8,
      clarityScore: '92%',
      ratePerSession: 0,
      tier: 'apprentice',
      bio: 'Apprentice Mentor (8/10 verified sessions). Offering 100% FREE doubt sessions to build ratings!'
    },
    {
      id: 't-6',
      fullName: 'Aarav Sharma',
      college: 'IIT Madras',
      department: 'Computer Science',
      year: 2,
      avatarUrl: MALE_AVATAR_SVG,
      subject: 'Mathematics',
      languages: ['Telugu', 'English', 'Hindi'],
      comfortModes: ['video', 'audio'],
      topicsMastered: ['Multivariable Calculus', 'Linear Algebra & Matrices', 'Probability & Statistics'],
      rating: 4.9,
      classesTaught: 24,
      clarityScore: '95%',
      ratePerSession: 50,
      tier: 'certified',
      bio: 'Engineering mathematics simplified with visual intuition in Telugu & English.'
    }
  ]);

  const languagesList = ['All', 'Telugu', 'English', 'Hindi', 'Tamil'];
  const subjects = ['All', 'Java', 'Data Structures', 'DBMS & SQL', 'Python & AI', 'C / C++', 'Mathematics'];

  const filteredTutors = tutors.filter(t => {
    const matchesSubject = selectedSubject === 'All' || t.subject.toLowerCase().includes(selectedSubject.toLowerCase()) || t.topicsMastered.some(top => top.toLowerCase().includes(selectedSubject.toLowerCase()));
    const matchesLanguage = selectedLanguage === 'All' || (t.languages && t.languages.includes(selectedLanguage));
    const matchesComfort = selectedComfortMode === 'all' || (t.comfortModes && t.comfortModes.includes(selectedComfortMode));
    const matchesSearch = !searchTopic.trim() || 
      t.fullName.toLowerCase().includes(searchTopic.toLowerCase()) || 
      t.subject.toLowerCase().includes(searchTopic.toLowerCase()) || 
      t.topicsMastered.some(top => top.toLowerCase().includes(searchTopic.toLowerCase())) ||
      t.college.toLowerCase().includes(searchTopic.toLowerCase());
    const matchesPrice = priceFilter === 'all' || (priceFilter === 'free' && t.ratePerSession === 0) || (priceFilter === 'paid' && t.ratePerSession > 0);
    return matchesSubject && matchesLanguage && matchesComfort && matchesSearch && matchesPrice;
  });

  return (
    <div className="studyloop-page-container">
      
      {/* HERO BANNER */}
      <div className="card-premium" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(0, 198, 255, 0.05) 100%)', border: '1px solid rgba(0, 102, 255, 0.2)', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              ⚡ 1:1 Peer Mentoring • Diploma & B.Tech Focused
            </div>
            <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Find a Peer Who Understands Your Exact Doubt
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '680px' }}>
              Struggling with a Java concept, C++ pointers, or DP state equations? Connect 1:1 with verified student tutors who explain it simply, in your language.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: 'var(--bg-card)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>100%</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Peer Driven</div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-color)' }}>₹30 – ₹100</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Student Pricing</div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning-color)' }}>4.9 ⭐</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Concept Clarity</div>
              </div>
            </div>

            {/* 🎓 Become a Campus Mentor Action Button */}
            <button
              onClick={() => setShowBecomeMentorModal(true)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.6rem 1.2rem',
                fontSize: '0.84rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 102, 255, 0.25)',
                background: 'linear-gradient(135deg, #0066FF 0%, #7C3AED 100%)'
              }}
            >
              🎓 Become a Campus Mentor
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="card-premium" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          
          {/* Topic Search Input */}
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Search size={18} style={{ color: 'var(--accent-primary)' }} />
            <input 
              type="text" 
              placeholder="Search specific topic e.g. 'Java Inheritance', 'DP Knapsack', 'SQL Joins', 'Pointers'..." 
              value={searchTopic}
              onChange={e => setSearchTopic(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Pricing Model Filter */}
          <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setPriceFilter('all')} 
              style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, backgroundColor: priceFilter === 'all' ? 'var(--bg-secondary)' : 'transparent', color: priceFilter === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              All Tutors
            </button>
            <button 
              onClick={() => setPriceFilter('free')} 
              style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, backgroundColor: priceFilter === 'free' ? 'var(--bg-secondary)' : 'transparent', color: priceFilter === 'free' ? 'var(--success-color)' : 'var(--text-secondary)' }}
            >
              🌱 Free Apprentice
            </button>
            <button 
              onClick={() => setPriceFilter('paid')} 
              style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, backgroundColor: priceFilter === 'paid' ? 'var(--bg-secondary)' : 'transparent', color: priceFilter === 'paid' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              ⭐ Verified Paid (₹30-₹100)
            </button>
          </div>

        </div>

        {/* 🗣️ Language Filter Pills Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🗣️ Language:
          </span>
          {languagesList.map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                border: selectedLanguage === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: selectedLanguage === lang ? 'var(--accent-light)' : 'var(--bg-secondary)',
                color: selectedLanguage === lang ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {lang === 'All' ? '🌐 All Languages' : lang === 'Telugu' ? '🗣️ తెలుగు (Telugu)' : lang === 'Hindi' ? '🗣️ हिंदी (Hindi)' : lang === 'Tamil' ? '🗣️ தமிழ் (Tamil)' : `🗣️ ${lang}`}
            </button>
          ))}
        </div>

        {/* 🎥 Comfort Modes Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚙️ Preferred Mode:
          </span>
          {[
            { id: 'all', label: 'All Modes' },
            { id: 'video', label: '🎥 1:1 Video' },
            { id: 'audio', label: '🎙️ Audio Call' },
            { id: 'chat', label: '💬 Async Chat' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedComfortMode(m.id)}
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                border: selectedComfortMode === m.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: selectedComfortMode === m.id ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
                color: selectedComfortMode === m.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Subject Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                border: selectedSubject === s ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: selectedSubject === s ? 'var(--accent-light)' : 'var(--bg-card)',
                color: selectedSubject === s ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* TUTORS GRID */}
      <div className="grid-3">
        {filteredTutors.map(t => (
          <div key={t.id} className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            
            {/* Top Tier Badge & Pricing Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {t.tier === 'apprentice' ? (
                <span className="tag tag-success" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                  🌱 Apprentice Mentor (Free Trial)
                </span>
              ) : t.tier === 'master' ? (
                <span className="tag" style={{ fontSize: '0.6875rem', fontWeight: 800, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning-color)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  👑 Master Campus Mentor
                </span>
              ) : (
                <span className="tag tag-accent" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                  ✓ Verified Peer Tutor
                </span>
              )}

              <span style={{ 
                fontWeight: 800, 
                fontSize: '0.875rem', 
                color: t.ratePerSession === 0 ? 'var(--success-color)' : 'var(--accent-primary)',
                backgroundColor: t.ratePerSession === 0 ? 'var(--success-light)' : 'var(--accent-light)',
                padding: '0.25rem 0.625rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                {t.ratePerSession === 0 ? '100% FREE' : `₹${t.ratePerSession} / 30m`}
              </span>
            </div>

            {/* Profile Info */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Avatar with online status dot */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={t.avatarUrl}
                  alt={t.fullName}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer', display: 'block' }}
                  onClick={() => onOpenPublicProfile(t)}
                />
                {/* Online presence dot */}
                <span style={{
                  position: 'absolute', bottom: '2px', right: '2px',
                  width: '12px', height: '12px', borderRadius: '50%',
                  backgroundColor: onlineStatus[t.id] ? '#10b981' : '#64748b',
                  border: '2px solid var(--bg-elevated)',
                  display: 'block',
                  boxShadow: onlineStatus[t.id] ? '0 0 0 2px rgba(16,185,129,0.3)' : 'none',
                  transition: 'background-color 0.5s ease'
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                  onClick={() => onOpenPublicProfile(t)}
                >
                  {t.fullName}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t.college} • {t.department} (Yr {t.year})</div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--warning-color)' }}>⭐ {t.rating}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>• 📚 {t.classesTaught} Classes</span>
                  {onlineStatus[t.id] ? (
                    <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.6875rem', backgroundColor: 'rgba(16,185,129,0.12)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      ● Accepting Bookings Now
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>● Offline</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              "{t.bio}"
            </p>

            {/* Languages Spoken & Comfort Modes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: 'var(--bg-tertiary)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-primary)' }}>🗣️ Teaches in:</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(t.languages || ['English']).map((lang, lIdx) => (
                      <span key={lIdx} style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        {lang === 'Telugu' ? 'తెలుగు' : lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comfort modes badges */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {t.comfortModes?.includes('video') && <span title="Comfortable with 1:1 Video Call" style={{ fontSize: '0.72rem' }}>🎥</span>}
                  {t.comfortModes?.includes('audio') && <span title="Comfortable with Audio Only Call" style={{ fontSize: '0.72rem' }}>🎙️</span>}
                  {t.comfortModes?.includes('chat') && <span title="Comfortable with Async Direct Chat" style={{ fontSize: '0.72rem' }}>💬</span>}
                </div>
              </div>
            </div>

            {/* Topics Mastered */}
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                🎯 Core Topics Mastered
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {t.topicsMastered.map((topic, i) => (
                  <span key={i} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => onOpenBookingModal(t)}
                className="btn btn-accent" 
                style={{ flex: 1.3, fontSize: '0.8125rem', padding: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontWeight: 700 }}
              >
                <Calendar size={14} /> Book 1:1 Live Session
              </button>
              
              <button 
                onClick={() => { setChatPeer(t); setActiveChatId(`chat-${t.id}`); setActiveTab('chat'); }} 
                className="btn btn-secondary" 
                style={{ flex: 0.7, fontSize: '0.8125rem', padding: '0.625rem' }}
                title="Direct Message"
              >
                <MessageSquare size={14} />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── BECOME A CAMPUS MENTOR MODAL ── */}
      {showBecomeMentorModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '560px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  🎓 Become a Campus Peer Mentor
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                  Teach juniors, earn ₹30-₹100/session or offer free skill swaps, and unlock the Scholar Mentor Badge.
                </p>
              </div>
              <button onClick={() => setShowBecomeMentorModal(false)} className="btn-icon" style={{ cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newMentor = {
                id: `t-me-${Date.now()}`,
                fullName: 'You (Verified Mentor)',
                college: 'IIT Madras',
                department: 'Computer Science',
                year: 3,
                avatarUrl: MALE_AVATAR_SVG,
                subject: mentorApplication.subjects.split(',')[0]?.trim() || 'Java',
                languages: mentorApplication.languages,
                comfortModes: mentorApplication.comfortModes,
                topicsMastered: mentorApplication.subjects.split(',').map(s => s.trim()),
                rating: 5.0,
                classesTaught: 0,
                clarityScore: '100%',
                ratePerSession: parseInt(mentorApplication.rate) || 0,
                tier: 'certified',
                bio: mentorApplication.bio || `Passionate student mentor teaching ${mentorApplication.subjects} in ${mentorApplication.languages.join(' & ')}.`
              };
              setTutors(prev => [newMentor, ...prev]);
              setShowBecomeMentorModal(false);
              alert('🎉 Congratulations! You are now a Verified Campus Peer Mentor. Your profile is live for junior students to book sessions.');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* 1. Subjects you excel at */}
              <div>
                <label className="label">1. Subjects You Excel at (Comma separated)</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. Java, Data Structures, Operating Systems, React" 
                  value={mentorApplication.subjects}
                  onChange={e => setMentorApplication({ ...mentorApplication, subjects: e.target.value })}
                  required
                />
              </div>

              {/* 2. Languages spoken */}
              <div>
                <label className="label">2. Languages You Can Teach In</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Telugu', 'English', 'Hindi', 'Tamil'].map(lang => {
                    const isSelected = mentorApplication.languages.includes(lang);
                    return (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => {
                          if (isSelected) {
                            if (mentorApplication.languages.length > 1) {
                              setMentorApplication({ ...mentorApplication, languages: mentorApplication.languages.filter(l => l !== lang) });
                            }
                          } else {
                            setMentorApplication({ ...mentorApplication, languages: [...mentorApplication.languages, lang] });
                          }
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '999px',
                          border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-secondary)',
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '} {lang === 'Telugu' ? 'తెలుగు (Telugu)' : lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Communication comfort modes */}
              <div>
                <label className="label">3. Communication Comfort Modes</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'video', label: '🎥 1:1 Video' },
                    { id: 'audio', label: '🎙️ Audio Call' },
                    { id: 'chat', label: '💬 Async Chat' }
                  ].map(m => {
                    const isSelected = mentorApplication.comfortModes.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                          if (isSelected) {
                            if (mentorApplication.comfortModes.length > 1) {
                              setMentorApplication({ ...mentorApplication, comfortModes: mentorApplication.comfortModes.filter(c => c !== m.id) });
                            }
                          } else {
                            setMentorApplication({ ...mentorApplication, comfortModes: [...mentorApplication.comfortModes, m.id] });
                          }
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-secondary)',
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Session Rate / Free */}
              <div>
                <label className="label">4. Your 30-Minute Rate (Or 0 for Free / Skill Swap)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    className="input" 
                    min="0" 
                    max="200" 
                    value={mentorApplication.rate}
                    onChange={e => setMentorApplication({ ...mentorApplication, rate: e.target.value })}
                    style={{ maxWidth: '120px' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {mentorApplication.rate === '0' || mentorApplication.rate === '' ? '🌱 Free / Skill Swap Only' : `₹${mentorApplication.rate} per 30-min session (Paid directly via UPI)`}
                  </span>
                </div>
              </div>

              {/* 5. Short Bio */}
              <div>
                <label className="label">5. Short Intro for Juniors (Optional)</label>
                <textarea 
                  className="input" 
                  rows={2} 
                  placeholder="e.g. Scored 95+ in Java OOP, helped 15+ juniors debug pointers and recursion."
                  value={mentorApplication.bio}
                  onChange={e => setMentorApplication({ ...mentorApplication, bio: e.target.value })}
                />
              </div>

              {/* Submit CTA */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>
                  Submit & Get Mentor Badge 🚀
                </button>
                <button type="button" onClick={() => setShowBecomeMentorModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

