import React, { useState } from 'react';
import { Search, Filter, Star, BookOpen, Users, Calendar, Award, ArrowUpRight } from 'lucide-react';
import { getDefaultAvatarByGender } from '../../constants/avatars';

export function DiscoverScreen({ token, setActiveTab, setActiveChatId, setChatPeer, onOpenPublicProfile, onOpenBookingModal }) {
  const [searchTopic, setSearchTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid

  const tutors = [
    {
      id: 't-1',
      fullName: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'Computer Science',
      year: 3,
      avatarUrl: FEMALE_AVATAR_SVG,
      subject: 'Java',
      topicsMastered: ['OOP Inheritance', 'Polymorphism', 'Multithreading', 'Spring Boot', 'Exception Handling'],
      rating: 4.9,
      classesTaught: 87,
      clarityScore: '96%',
      ratePerSession: 50,
      tier: 'certified',
      bio: 'Solved 87+ Java doubts for juniors. I explain OOP through real-world game character design!'
    },
    {
      id: 't-2',
      fullName: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'Electrical & CS',
      year: 2,
      avatarUrl: MALE_AVATAR_SVG,
      subject: 'C / C++',
      topicsMastered: ['Pointers & Dynamic Memory', 'Structures', 'Recursion', 'Memory Leaks', 'Valgrind'],
      rating: 4.8,
      classesTaught: 32,
      clarityScore: '94%',
      ratePerSession: 40,
      tier: 'certified',
      bio: 'Master C pointers and memory management without getting confused.'
    },
    {
      id: 't-3',
      fullName: 'Divya Nambiar',
      college: 'NIT Trichy',
      department: 'Data Science & AI',
      year: 3,
      avatarUrl: FEMALE_AVATAR_SVG,
      subject: 'Python & AI',
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
      topicsMastered: ['Multivariable Calculus', 'Linear Algebra & Matrices', 'Probability & Statistics'],
      rating: 4.9,
      classesTaught: 24,
      clarityScore: '95%',
      ratePerSession: 50,
      tier: 'certified',
      bio: 'Engineering mathematics simplified with visual intuition and previous year exam questions.'
    }
  ];

  const subjects = ['All', 'Java', 'Data Structures', 'DBMS & SQL', 'Python & AI', 'C / C++', 'Mathematics'];

  const filteredTutors = tutors.filter(t => {
    const matchesSubject = selectedSubject === 'All' || t.subject.toLowerCase().includes(selectedSubject.toLowerCase()) || t.topicsMastered.some(top => top.toLowerCase().includes(selectedSubject.toLowerCase()));
    const matchesSearch = !searchTopic.trim() || 
      t.fullName.toLowerCase().includes(searchTopic.toLowerCase()) || 
      t.subject.toLowerCase().includes(searchTopic.toLowerCase()) || 
      t.topicsMastered.some(top => top.toLowerCase().includes(searchTopic.toLowerCase())) ||
      t.college.toLowerCase().includes(searchTopic.toLowerCase());
    const matchesPrice = priceFilter === 'all' || (priceFilter === 'free' && t.ratePerSession === 0) || (priceFilter === 'paid' && t.ratePerSession > 0);
    return matchesSubject && matchesSearch && matchesPrice;
  });

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
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

          <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
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
              🌱 Free Apprentice Sessions
            </button>
            <button 
              onClick={() => setPriceFilter('paid')} 
              style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, backgroundColor: priceFilter === 'paid' ? 'var(--bg-secondary)' : 'transparent', color: priceFilter === 'paid' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              ⭐ Verified Paid Mentors (₹30-₹100)
            </button>
          </div>

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
              <img 
                src={t.avatarUrl} 
                alt={t.fullName} 
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer' }}
                onClick={() => onOpenPublicProfile(t)}
              />
              <div>
                <div 
                  style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                  onClick={() => onOpenPublicProfile(t)}
                >
                  {t.fullName}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t.college} • {t.department} (Yr {t.year})</div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--warning-color)' }}>⭐ {t.rating}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>• 📚 {t.classesTaught} Classes Taught</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              "{t.bio}"
            </p>

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

    </div>
  );
}

