import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Calendar, Check, CheckCircle, CheckCircle2, ChevronRight, ExternalLink, Filter, MessageSquare, Search, Sparkles, Star, User, UserPlus, Users, X } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function ConnectionsScreen({ token, setActiveTab, setActiveChatId, setChatPeer, onOpenPublicProfile }) {
  const { profile, updateProfileState } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState(() => localStorage.getItem('studyloop_conn_subtab') || 'all');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState('All');
  const [justConnectedModalPeer, setJustConnectedModalPeer] = useState(null); // Instagram style rectangle modal on accept
  
  useEffect(() => {
    localStorage.setItem('studyloop_conn_subtab', activeSubTab);
  }, [activeSubTab]);

  // Real-time master campus members repository
  const [members, setMembers] = useState([
    { id: 'm-1', fullName: 'Bhavna Patel', username: 'bhavna_patel', college: 'IIT Madras', department: 'Computer Science', year: 3, avatarUrl: FEMALE_AVATAR_SVG, skills: ['Python', 'Machine Learning', 'Data Structures'], degree: '1st', mutuals: 14, doubtsSolved: 42, rating: 4.95, xp: 820, level: 5, isFollowing: true, isConnected: true, isPending: false },
    { id: 'm-2', fullName: 'Chaitanya Reddy', username: 'chaitanya_bits', college: 'BITS Pilani', department: 'Electrical Engineering', year: 1, avatarUrl: MALE_AVATAR_SVG, skills: ['Circuits', 'Calculus', 'C++'], degree: '1st', mutuals: 8, doubtsSolved: 18, rating: 4.85, xp: 340, level: 2, isFollowing: false, isConnected: true, isPending: false },
    { id: 'm-3', fullName: 'Divya Nambiar', username: 'divya_nitt', college: 'NIT Trichy', department: 'Data Science', year: 2, avatarUrl: FEMALE_AVATAR_SVG, skills: ['SQL', 'Tableau', 'Statistics'], degree: '1st', mutuals: 19, doubtsSolved: 31, rating: 4.90, xp: 520, level: 3, isFollowing: true, isConnected: true, isPending: false },
    { id: 'm-4', fullName: 'Kavya Subramanian', username: 'kavya_iitd', college: 'IIT Delhi', department: 'Software Engineering', year: 4, avatarUrl: FEMALE_AVATAR_SVG, skills: ['React', 'TypeScript', 'Node.js', 'System Design'], degree: '2nd', mutuals: 11, doubtsSolved: 64, rating: 4.98, xp: 1120, level: 7, isFollowing: false, isConnected: false, isPending: false },
    { id: 'm-5', fullName: 'Rohan Deshmukh', username: 'rohan_iitb', college: 'IIT Bombay', department: 'Computer Science', year: 2, avatarUrl: MALE_AVATAR_SVG, skills: ['Competitive Programming', 'Algorithms', 'Java'], degree: '2nd', mutuals: 16, doubtsSolved: 27, rating: 4.88, xp: 480, level: 3, isFollowing: false, isConnected: false, isPending: false },
    { id: 'm-6', fullName: 'Sneha Roy', username: 'sneha_iiit', college: 'IIIT Hyderabad', department: 'AI & Data Science', year: 3, avatarUrl: FEMALE_AVATAR_SVG, skills: ['PyTorch', 'Computer Vision', 'NLP'], degree: '2nd', mutuals: 9, doubtsSolved: 53, rating: 4.96, xp: 950, level: 6, isFollowing: false, isConnected: false, isPending: false },
    { id: 'm-7', fullName: 'Vikram Joshi', username: 'vikram_mech', college: 'IIT Madras', department: 'Mechanical Engineering', year: 4, avatarUrl: MALE_AVATAR_SVG, skills: ['Thermodynamics', 'MATLAB', 'Python'], degree: '2nd', mutuals: 7, doubtsSolved: 22, rating: 4.80, xp: 390, level: 2, isFollowing: false, isConnected: false, isPending: false },
    { id: 'm-8', fullName: 'Ananya Guha', username: 'ananya_cloud', college: 'BITS Pilani', department: 'Computer Science', year: 3, avatarUrl: FEMALE_AVATAR_SVG, skills: ['Kubernetes', 'Go', 'Cloud Architecture'], degree: '2nd', mutuals: 13, doubtsSolved: 47, rating: 4.92, xp: 780, level: 4, isFollowing: false, isConnected: false, isPending: false }
  ]);

  // Real-time pending requests
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'm-4', fullName: 'Kavya Subramanian', username: 'kavya_iitd', college: 'IIT Delhi', department: 'Software Engineering', year: 4, avatarUrl: FEMALE_AVATAR_SVG, skills: ['React', 'TypeScript', 'Node.js'], note: 'Hey Aarav, saw your solution in the Java thread! Would love to connect for system design prep.', time: '2h ago', doubtsSolved: 64, rating: 4.98, xp: 1120 },
    { id: 'm-5', fullName: 'Rohan Deshmukh', username: 'rohan_iitb', college: 'IIT Bombay', department: 'Computer Science', year: 2, avatarUrl: MALE_AVATAR_SVG, skills: ['Competitive Programming', 'Algorithms'], note: 'Let\'s collaborate on algorithmic doubt rooms and coding contests.', time: '5h ago', doubtsSolved: 27, rating: 4.88, xp: 480 }
  ]);

  const handleAcceptRequest = (req) => {
    setPendingRequests(prev => prev.filter(p => p.id !== req.id));
    setMembers(prev => prev.map(m => m.id === req.id ? { ...m, isConnected: true, isPending: false } : m));
    
    if (profile) {
      const updated = { ...profile, followersCount: (profile.followersCount || 1200) + 1, coins: (profile.coins || 45) + 5, xp: (profile.xp || 650) + 10 };
      updateProfileState(updated);
    }
    // Open Instagram-style rectangle modal
    setJustConnectedModalPeer(req);
  };

  const handleIgnoreRequest = (reqId) => {
    setPendingRequests(prev => prev.filter(p => p.id !== reqId));
  };

  const handleSendConnect = (memId) => {
    setMembers(prev => prev.map(m => m.id === memId ? { ...m, isPending: true } : m));
    alert("🤝 Connection request sent!");
  };

  const handleToggleFollow = (memId) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memId) {
        const nextState = !m.isFollowing;
        if (profile) {
          const updated = { 
            ...profile, 
            followingCount: nextState ? (profile.followingCount || 5) + 1 : Math.max(0, (profile.followingCount || 5) - 1) 
          };
          updateProfileState(updated);
        }
        return { ...m, isFollowing: nextState };
      }
      return m;
    }));
  };

  const handleEndorseSkill = (memId, skillName) => {
    if (profile) {
      const updated = { ...profile, coins: (profile.coins || 45) + 5, xp: (profile.xp || 650) + 10 };
      updateProfileState(updated);
    }
    alert(`🌟 You endorsed ${skillName}! +5 Peer Coins and +10 XP awarded.`);
  };

  const handleRemoveConnection = (memId, name) => {
    if (confirm(`Are you sure you want to remove ${name} from your connections?`)) {
      setMembers(prev => prev.map(m => m.id === memId ? { ...m, isConnected: false } : m));
    }
  };

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.college.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.skills.some(s => s.toLowerCase().includes(searchFilter.toLowerCase()));
    
    const matchesUni = selectedUniversityFilter === 'All' || m.college.toLowerCase().includes(selectedUniversityFilter.toLowerCase());
    return matchesSearch && matchesUni;
  });

  const connectedMembers = members.filter(m => m.isConnected);

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER & HERO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span>Campus Network & Connections</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
            Discover campus peers, view detailed LinkedIn/Instagram profiles, accept connection invites, and exchange study notes.
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          
          <button 
            onClick={() => setActiveSubTab('all')} 
            style={{ 
              padding: '0.5rem 1.1rem', 
              borderRadius: 'var(--radius-sm)', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '0.8125rem', 
              fontWeight: 700,
              backgroundColor: activeSubTab === 'all' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSubTab === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              boxShadow: activeSubTab === 'all' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🌐 All Campus Members ({members.length})
          </button>

          <button 
            onClick={() => setActiveSubTab('pending')} 
            style={{ 
              padding: '0.5rem 1.1rem', 
              borderRadius: 'var(--radius-sm)', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '0.8125rem', 
              fontWeight: 700,
              backgroundColor: activeSubTab === 'pending' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSubTab === 'pending' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              boxShadow: activeSubTab === 'pending' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            📩 Pending Requests
            {pendingRequests.length > 0 && (
              <span style={{ backgroundColor: 'var(--danger-color)', color: '#ffffff', fontSize: '0.625rem', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveSubTab('connections')} 
            style={{ 
              padding: '0.5rem 1.1rem', 
              borderRadius: 'var(--radius-sm)', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '0.8125rem', 
              fontWeight: 700,
              backgroundColor: activeSubTab === 'connections' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSubTab === 'connections' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              boxShadow: activeSubTab === 'connections' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            🤝 My Connections ({connectedMembers.length})
          </button>
        </div>
      </div>

      {/* PENDING REQUESTS TOP NOTIFICATION BANNER (IF ON ALL TAB & PENDING EXISTS) */}
      {activeSubTab === 'all' && pendingRequests.length > 0 && (
        <div style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {pendingRequests.length}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                You have {pendingRequests.length} pending connection invitation{pendingRequests.length > 1 ? 's' : ''}!
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {pendingRequests.map(p => p.fullName).join(', ')} wants to connect with you.
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveSubTab('pending')} 
            className="btn btn-accent" 
            style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem', fontWeight: 800 }}
          >
            Review Requests →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 1: ALL CAMPUS MEMBERS DIRECTORY (INSTAGRAM / LINKEDIN STYLE GRID) */}
      {/* ========================================================================= */}
      {activeSubTab === 'all' && (
        <div>
          {/* Search & Filter Bar */}
          <div className="card-premium" style={{ marginBottom: '1.5rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Search campus members by student name, college, department, or skill (e.g. Machine Learning, Java, SQL)..." 
                value={searchFilter} 
                onChange={e => setSearchFilter(e.target.value)} 
                style={{ border: 'none', background: 'transparent', padding: '0.25rem 0', width: '100%' }}
              />
            </div>

            {/* University Filter Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {['All', 'IIT Madras', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad', 'IIT Delhi', 'IIT Bombay'].map(uni => (
                <button
                  key={uni}
                  onClick={() => setSelectedUniversityFilter(uni)}
                  style={{
                    padding: '0.35rem 0.875rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedUniversityFilter === uni ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: selectedUniversityFilter === uni ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                    color: selectedUniversityFilter === uni ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {uni === 'All' ? '🏛️ All Universities' : uni}
                </button>
              ))}
            </div>

          </div>

          {/* Members Grid (Instagram / LinkedIn Cards) */}
          <div className="grid-3">
            {filteredMembers.map(mem => (
              <div 
                key={mem.id} 
                className="card-premium interactive-hover" 
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '20px' }}
              >
                {/* Card Gradient Banner */}
                <div style={{ height: '72px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '8px', right: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', fontSize: '0.625rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    ⚡ {mem.xp} XP
                  </span>
                </div>

                {/* Profile Avatar & Details */}
                <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-36px', marginBottom: '0.75rem' }}>
                    <img 
                      src={mem.avatarUrl} 
                      alt={mem.fullName} 
                      style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--bg-card)', cursor: 'pointer', backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-sm)' }}
                      onClick={() => onOpenPublicProfile(mem)}
                      title="Click to view full Instagram/LinkedIn profile"
                    />

                    <span className="tag tag-accent" style={{ fontSize: '0.625rem', fontWeight: 800 }}>
                      ⭐ {mem.rating} Rating
                    </span>
                  </div>

                  {/* Name & Handle */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div 
                      style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      onClick={() => onOpenPublicProfile(mem)}
                    >
                      {mem.fullName}
                      <CheckCircle size={14} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      @{mem.username} • Yr {mem.year}
                    </div>
                  </div>

                  {/* College & Department */}
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    🏛️ {mem.college} • {mem.department}
                  </div>

                  {/* Skills Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {mem.skills.slice(0, 3).map((sk, i) => (
                      <span key={i} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>
                        {sk}
                      </span>
                    ))}
                    {mem.skills.length > 3 && (
                      <span className="tag" style={{ fontSize: '0.6875rem' }}>+{mem.skills.length - 3}</span>
                    )}
                  </div>

                  {/* Mutuals & Doubts Stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span>👥 {mem.mutuals} mutuals</span>
                    <span>🎯 {mem.doubtsSolved} solved</span>
                  </div>

                  {/* Primary Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                    
                    {/* View Profile Button (Prominent) */}
                    <button 
                      onClick={() => onOpenPublicProfile(mem)}
                      className="btn btn-secondary" 
                      style={{ width: '100%', fontSize: '0.8125rem', padding: '0.55rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                    >
                      <User size={14} /> View Full Profile 👤
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.375rem' }}>
                      
                      {/* Connect */}
                      <button 
                        onClick={() => handleSendConnect(mem.id)} 
                        className={`btn ${mem.isConnected ? 'btn-secondary' : 'btn-accent'}`} 
                        style={{ fontSize: '0.6875rem', padding: '0.45rem 0.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}
                        disabled={mem.isConnected || mem.isPending}
                      >
                        {mem.isConnected ? 'Connected' : mem.isPending ? 'Pending' : 'Connect'}
                      </button>

                      {/* Follow */}
                      <button 
                        onClick={() => handleToggleFollow(mem.id)} 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.6875rem', padding: '0.45rem 0.25rem', fontWeight: 700, color: mem.isFollowing ? 'var(--accent-primary)' : 'inherit' }}
                      >
                        {mem.isFollowing ? 'Following' : '+ Follow'}
                      </button>

                      {/* Message */}
                      <button 
                        onClick={() => {
                          setChatPeer(mem);
                          setActiveChatId(`chat-${mem.id}`);
                          setActiveTab('chat');
                        }} 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.6875rem', padding: '0.45rem 0.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}
                        title="Direct Message"
                      >
                        <MessageSquare size={12} /> Chat
                      </button>

                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: PENDING INVITATIONS & REQUESTS                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'pending' && (
        <div>
          {pendingRequests.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <CheckCircle size={48} style={{ color: 'var(--success-color)', margin: '0 auto 1rem auto' }} />
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>All Caught Up!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You have no pending connection requests at this time.</p>
              <button onClick={() => setActiveSubTab('all')} className="btn btn-accent" style={{ marginTop: '1rem', fontWeight: 700 }}>
                Explore Campus Directory
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pendingRequests.map(req => (
                <div key={req.id} className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                    <img 
                      src={req.avatarUrl} 
                      alt={req.fullName} 
                      style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer' }} 
                      onClick={() => onOpenPublicProfile(req)}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span 
                          style={{ fontWeight: 800, fontSize: '1.125rem', cursor: 'pointer' }}
                          onClick={() => onOpenPublicProfile(req)}
                        >
                          {req.fullName}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {req.time}</span>
                        <span className="tag tag-accent" style={{ fontSize: '0.625rem' }}>⭐ {req.rating || 4.9}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{req.college} • {req.department} (Yr {req.year})</div>
                      {req.note && (
                        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--text-primary)', marginTop: '0.5rem', fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)' }}>
                          "{req.note}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                    <button 
                      onClick={() => onOpenPublicProfile(req)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem', fontWeight: 700 }}
                    >
                      <User size={14} /> View Profile
                    </button>

                    <button 
                      onClick={() => handleAcceptRequest(req)} 
                      className="btn btn-accent" 
                      style={{ padding: '0.625rem 1.25rem', fontWeight: 800, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                    >
                      <CheckCircle2 size={16} /> Accept ✓
                    </button>

                    <button 
                      onClick={() => handleIgnoreRequest(req.id)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem' }}
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: MY CONNECTED PEERS                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'connections' && (
        <div>
          {/* Search Filter Bar */}
          <div className="card-premium" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Filter your connections by name, university, or skill..." 
              value={searchFilter} 
              onChange={e => setSearchFilter(e.target.value)} 
              style={{ border: 'none', background: 'transparent', padding: '0.25rem 0', width: '100%' }}
            />
          </div>

          <div className="grid-2">
            {connectedMembers.map(c => (
              <div key={c.id} className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={c.avatarUrl} 
                      alt={c.fullName} 
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer' }} 
                      onClick={() => onOpenPublicProfile(c)}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span 
                          style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                          onClick={() => onOpenPublicProfile(c)}
                        >
                          {c.fullName}
                        </span>
                        <span className="tag" style={{ fontSize: '0.625rem' }}>{c.degree || '1st'}</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{c.college} • {c.department} (Yr {c.year})</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>👥 {c.mutuals} mutual connections</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemoveConnection(c.id, c.fullName)} 
                    className="btn-icon" 
                    title="Remove connection"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Skills Chips */}
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {c.skills.map((s, idx) => (
                      <span key={idx} className="tag tag-accent" style={{ fontSize: '0.75rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => onOpenPublicProfile(c)} 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8125rem', padding: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <User size={14} /> Profile
                  </button>

                  <button 
                    onClick={() => { setChatPeer(c); setActiveChatId(`chat-${c.id}`); setActiveTab('chat'); }} 
                    className="btn btn-primary" 
                    style={{ flex: 1, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontWeight: 700 }}
                  >
                    <MessageSquare size={14} /> Direct Message
                  </button>

                  <button 
                    onClick={() => handleEndorseSkill(c.id, c.skills[0])} 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8125rem', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Award size={14} /> Endorse (+5🪙)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSTAGRAM-STYLE RECTANGLE OPENING DIALOG UPON ACCEPTING CONNECTION */}
      {justConnectedModalPeer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem 2rem', textAlign: 'center', borderRadius: '24px', backgroundColor: 'var(--bg-elevated)', border: '2px solid var(--accent-primary)', boxShadow: '0 25px 50px -12px rgba(0, 102, 255, 0.4)' }}>
            
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.25rem auto' }}>
              <img src={justConnectedModalPeer.avatarUrl} alt="Peer" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--accent-primary)', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#10b981', color: '#ffffff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                ✓
              </div>
            </div>

            <div className="tag tag-accent" style={{ marginBottom: '0.75rem', fontSize: '0.75rem', fontWeight: 800 }}>
              🎉 Connection Request Accepted!
            </div>

            <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              You are now connected with {justConnectedModalPeer.fullName}
            </h3>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              You can now exchange direct WhatsApp-style study messages, share code snippets, and view their full academic profile!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  setChatPeer(justConnectedModalPeer);
                  setActiveChatId(`chat-${justConnectedModalPeer.id}`);
                  setActiveTab('chat');
                  setJustConnectedModalPeer(null);
                }} 
                className="btn btn-accent" 
                style={{ padding: '0.875rem', fontWeight: 800, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <MessageSquare size={18} /> Say Hi (Direct Message) 💬
              </button>
              
              <button 
                onClick={() => {
                  const p = justConnectedModalPeer;
                  setJustConnectedModalPeer(null);
                  onOpenPublicProfile(p);
                }}
                className="btn btn-secondary" 
                style={{ padding: '0.625rem', fontWeight: 700 }}
              >
                👤 View {justConnectedModalPeer.fullName}'s Profile
              </button>

              <button 
                onClick={() => setJustConnectedModalPeer(null)} 
                className="btn-icon" 
                style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}
              >
                Close & Stay on Network
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
