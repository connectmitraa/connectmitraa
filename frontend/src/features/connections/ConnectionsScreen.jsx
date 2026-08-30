import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Check, 
  CheckCircle, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  Filter, 
  MessageSquare, 
  Search, 
  Send,
  Sparkles, 
  Star, 
  Trash2,
  User, 
  UserCheck,
  UserMinus,
  UserPlus, 
  Users, 
  X 
} from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function ConnectionsScreen({ token, setActiveTab, setActiveChatId, setChatPeer, onOpenPublicProfile, startWebRtcCall }) {
  const { profile, updateProfileState } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState(() => localStorage.getItem('studyloop_conn_subtab') || 'pending');
  const [pendingTypeFilter, setPendingTypeFilter] = useState('received'); // 'received' | 'sent'
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState('All');
  const [actionToast, setActionToast] = useState(null); // { message, type: 'success' | 'info' }

  useEffect(() => {
    localStorage.setItem('studyloop_conn_subtab', activeSubTab);
  }, [activeSubTab]);

  useEffect(() => {
    if (actionToast) {
      const t = setTimeout(() => setActionToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [actionToast]);

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

  // Real-time pending requests (Incoming)
  const [pendingRequests, setPendingRequests] = useState([
    { 
      id: 'm-4', 
      fullName: 'Kavya Subramanian', 
      username: 'kavya_iitd', 
      college: 'IIT Delhi', 
      department: 'Software Engineering', 
      year: 4, 
      avatarUrl: FEMALE_AVATAR_SVG, 
      skills: ['React', 'TypeScript', 'System Design'], 
      note: 'Hey Aarav! Saw your solution in the Java OS thread. Would love to connect for peer sessions!', 
      time: '2h ago', 
      mutuals: 11,
      doubtsSolved: 64, 
      rating: 4.98, 
      xp: 1120,
      status: 'pending' // 'pending' | 'accepted' | 'rejected'
    },
    { 
      id: 'm-5', 
      fullName: 'Rohan Deshmukh', 
      username: 'rohan_iitb', 
      college: 'IIT Bombay', 
      department: 'Computer Science', 
      year: 2, 
      avatarUrl: MALE_AVATAR_SVG, 
      skills: ['Algorithms', 'Java', 'Dynamic Programming'], 
      note: 'Let\'s collaborate on algorithmic doubt rooms and coding contests.', 
      time: '4h ago', 
      mutuals: 16,
      doubtsSolved: 27, 
      rating: 4.88, 
      xp: 480,
      status: 'pending'
    },
    { 
      id: 'm-6', 
      fullName: 'Sneha Roy', 
      username: 'sneha_iiit', 
      college: 'IIIT Hyderabad', 
      department: 'AI & Data Science', 
      year: 3, 
      avatarUrl: FEMALE_AVATAR_SVG, 
      skills: ['PyTorch', 'Computer Vision', 'NLP'], 
      note: 'Working on Deep Learning assignments. Connecting to exchange study notes and project ideas.', 
      time: 'Yesterday', 
      mutuals: 9,
      doubtsSolved: 53, 
      rating: 4.96, 
      xp: 950,
      status: 'pending'
    },
    { 
      id: 'm-7', 
      fullName: 'Vikram Joshi', 
      username: 'vikram_mech', 
      college: 'IIT Madras', 
      department: 'Mechanical Engineering', 
      year: 4, 
      avatarUrl: MALE_AVATAR_SVG, 
      skills: ['Thermodynamics', 'MATLAB', 'Calculus'], 
      note: 'Hey! We share the Calculus course group. Connecting to discuss upcoming midterms.', 
      time: '2 days ago', 
      mutuals: 7,
      doubtsSolved: 22, 
      rating: 4.80, 
      xp: 390,
      status: 'pending'
    }
  ]);

  // Outgoing Sent Requests
  const [sentRequests, setSentRequests] = useState([
    {
      id: 'm-8',
      fullName: 'Ananya Guha',
      username: 'ananya_cloud',
      college: 'BITS Pilani',
      department: 'Computer Science',
      year: 3,
      avatarUrl: FEMALE_AVATAR_SVG,
      skills: ['Kubernetes', 'Go', 'Cloud Architecture'],
      time: 'Sent 1 day ago',
      mutuals: 13
    }
  ]);

  // Clean, Frictionless Inline Accept
  const handleAcceptRequest = (req) => {
    // Update request state inline
    setPendingRequests(prev => prev.map(p => p.id === req.id ? { ...p, status: 'accepted' } : p));
    setMembers(prev => prev.map(m => m.id === req.id ? { ...m, isConnected: true, isPending: false } : m));
    
    if (profile) {
      const updated = { 
        ...profile, 
        followersCount: (profile.followersCount || 1200) + 1, 
        coins: (profile.coins || 45) + 5, 
        xp: (profile.xp || 650) + 10 
      };
      updateProfileState(updated);
    }

    // Instant non-intrusive toast feedback
    setActionToast({
      message: `🎉 Connected with ${req.fullName}! +5 Peer Coins & +10 XP awarded.`,
      type: 'success'
    });
  };

  // Clean, Frictionless Inline Reject
  const handleRejectRequest = (reqId, reqName) => {
    setPendingRequests(prev => prev.filter(p => p.id !== reqId));
    setActionToast({
      message: `Declined connection invitation from ${reqName}.`,
      type: 'info'
    });
  };

  // Withdraw Outgoing Request
  const handleWithdrawSentRequest = (reqId, reqName) => {
    setSentRequests(prev => prev.filter(p => p.id !== reqId));
    setActionToast({
      message: `Withdrew connection invitation sent to ${reqName}.`,
      type: 'info'
    });
  };

  const handleSendConnect = (memId, memName) => {
    setMembers(prev => prev.map(m => m.id === memId ? { ...m, isPending: true } : m));
    const targetMem = members.find(m => m.id === memId);
    if (targetMem) {
      setSentRequests(prev => [{ ...targetMem, time: 'Sent Just now' }, ...prev]);
    }
    setActionToast({
      message: `🤝 Connection invite sent to ${memName}!`,
      type: 'success'
    });
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
    setActionToast({
      message: `🌟 Endorsed ${skillName}! +5 Coins & +10 XP awarded.`,
      type: 'success'
    });
  };

  const handleRemoveConnection = (memId, name) => {
    if (confirm(`Are you sure you want to remove ${name} from your connections?`)) {
      setMembers(prev => prev.map(m => m.id === memId ? { ...m, isConnected: false } : m));
      setActionToast({
        message: `Removed ${name} from your connections.`,
        type: 'info'
      });
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
  const activeIncomingCount = pendingRequests.filter(r => r.status === 'pending').length;

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      
      {/* GLOBAL ACTION TOAST */}
      {actionToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: actionToast.type === 'success' ? '#10b981' : '#334155',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          fontSize: '0.875rem',
          fontWeight: 700,
          animation: 'fadeIn 0.3s ease'
        }}>
          {actionToast.type === 'success' ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
          <span>{actionToast.message}</span>
        </div>
      )}

      {/* HEADER & HERO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span>Campus Network & Connections</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', margin: 0 }}>
            Discover campus peers, view academic profiles, accept connection invites, and exchange study notes.
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          
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
            📥 Pending Requests
            {activeIncomingCount > 0 && (
              <span style={{ backgroundColor: '#ef4444', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)' }}>
                {activeIncomingCount}
              </span>
            )}
          </button>

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

      {/* ========================================================================= */}
      {/* SUBTAB 1: PENDING INVITATIONS (RECEIVED & SENT)                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'pending' && (
        <div>
          {/* Sub-filter toggle: Received vs Sent */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.875rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setPendingTypeFilter('received')}
                className={`btn ${pendingTypeFilter === 'received' ? 'btn-accent' : 'btn-ghost'}`}
                style={{ fontSize: '0.8125rem', padding: '0.4rem 0.875rem', fontWeight: 700 }}
              >
                Received Invitations ({pendingRequests.filter(r => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setPendingTypeFilter('sent')}
                className={`btn ${pendingTypeFilter === 'sent' ? 'btn-accent' : 'btn-ghost'}`}
                style={{ fontSize: '0.8125rem', padding: '0.4rem 0.875rem', fontWeight: 700 }}
              >
                Sent Invitations ({sentRequests.length})
              </button>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              ⚡ Instant 1-Click Accept / Reject with Zero Interruption
            </div>
          </div>

          {pendingTypeFilter === 'received' ? (
            /* INCOMING RECEIVED REQUESTS */
            pendingRequests.length === 0 ? (
              <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem' }}>
                <CheckCircle size={48} style={{ color: 'var(--success-color)', margin: '0 auto 1rem auto' }} />
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>All Caught Up!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You have reviewed all incoming connection requests.</p>
                <button onClick={() => setActiveSubTab('all')} className="btn btn-accent" style={{ marginTop: '1rem', fontWeight: 700 }}>
                  Explore Campus Directory
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingRequests.map(req => {
                  const isAccepted = req.status === 'accepted';
                  return (
                    <div 
                      key={req.id} 
                      className="card-premium" 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        flexWrap: 'wrap', 
                        gap: '1.25rem', 
                        borderRadius: '16px',
                        borderLeft: isAccepted ? '4px solid #10b981' : '4px solid var(--accent-primary)',
                        backgroundColor: isAccepted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={req.avatarUrl} 
                            alt={req.fullName} 
                            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer' }} 
                            onClick={() => onOpenPublicProfile(req)}
                          />
                          {isAccepted && (
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                              ✓
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span 
                              style={{ fontWeight: 800, fontSize: '1.0625rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                              onClick={() => onOpenPublicProfile(req)}
                            >
                              {req.fullName}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {req.time}</span>
                            <span className="tag tag-accent" style={{ fontSize: '0.625rem' }}>⭐ {req.rating || 4.9}</span>
                            {isAccepted && (
                              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 800 }}>
                                ✓ Connected
                              </span>
                            )}
                          </div>
                          
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                            {req.college} • {req.department} (Yr {req.year}) • 👥 {req.mutuals} mutual peers
                          </div>

                          {req.note && (
                            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--text-primary)', marginTop: '0.45rem', fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)' }}>
                              "{req.note}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dynamic Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {isAccepted ? (
                          /* Once accepted, provide instant Direct Message & Profile options without reload */
                          <>
                            <button 
                              onClick={() => {
                                setChatPeer(req);
                                setActiveChatId(`chat-${req.id}`);
                                setActiveTab('chat');
                              }}
                              className="btn btn-accent"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', fontWeight: 800, gap: '6px' }}
                            >
                              <MessageSquare size={14} /> Send Message 💬
                            </button>
                            <button 
                              onClick={() => onOpenPublicProfile(req)} 
                              className="btn btn-secondary" 
                              style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}
                            >
                              <User size={14} /> Profile
                            </button>
                          </>
                        ) : (
                          /* Pending Accept & Reject */
                          <>
                            <button 
                              onClick={() => onOpenPublicProfile(req)} 
                              className="btn btn-secondary" 
                              style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600 }}
                            >
                              <User size={14} /> Profile
                            </button>

                            <button 
                              onClick={() => handleAcceptRequest(req)} 
                              className="btn btn-accent" 
                              style={{ padding: '0.5rem 1.25rem', fontWeight: 800, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#10b981', borderColor: '#10b981' }}
                            >
                              <CheckCircle2 size={15} /> Accept ✓
                            </button>

                            <button 
                              onClick={() => handleRejectRequest(req.id, req.fullName)} 
                              className="btn btn-secondary" 
                              style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', color: 'var(--danger-color)' }}
                              title="Decline Connection"
                            >
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* OUTGOING SENT REQUESTS */
            sentRequests.length === 0 ? (
              <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem' }}>
                <Send size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Sent Invitations</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You have not sent any pending connection requests.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sentRequests.map(s => (
                  <div key={s.id} className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={s.avatarUrl} alt={s.fullName} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{s.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.college} • {s.department}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>🕒 {s.time}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleWithdrawSentRequest(s.id, s.fullName)} 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', color: 'var(--danger-color)' }}
                      >
                        <Trash2 size={13} /> Withdraw Invitation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: ALL CAMPUS MEMBERS DIRECTORY                                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'all' && (
        <div>
          {/* SEARCH & COLLEGE FILTER BAR */}
          <div className="card-premium" style={{ marginBottom: '1.5rem', padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search peers by name, college, major, or skill (e.g. Python, SQL)..." 
                value={searchFilter} 
                onChange={e => setSearchFilter(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--text-primary)' }}
              />
            </div>

            {/* University Filter Pills */}
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {['All', 'IIT Madras', 'IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad'].map(uni => (
                <button
                  key={uni}
                  onClick={() => setSelectedUniversityFilter(uni)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedUniversityFilter === uni ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: selectedUniversityFilter === uni ? 'var(--accent-light)' : 'var(--bg-secondary)',
                    color: selectedUniversityFilter === uni ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {uni}
                </button>
              ))}
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid-3">
            {filteredMembers.map(mem => (
              <div key={mem.id} className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={mem.avatarUrl} 
                      alt={mem.fullName} 
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer' }} 
                      onClick={() => onOpenPublicProfile(mem)}
                    />
                    <div>
                      <div 
                        style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                        onClick={() => onOpenPublicProfile(mem)}
                      >
                        {mem.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mem.college}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{mem.department} (Yr {mem.year})</div>
                    </div>
                  </div>

                  <span className="tag" style={{ fontSize: '0.625rem' }}>{mem.degree || '2nd'}</span>
                </div>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {mem.skills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.625rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => onOpenPublicProfile(mem)} 
                    className="btn btn-secondary" 
                    style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem' }}
                  >
                    Profile
                  </button>

                  {mem.isConnected ? (
                    <button 
                      onClick={() => {
                        setChatPeer(mem);
                        setActiveChatId(`chat-${mem.id}`);
                        setActiveTab('chat');
                      }} 
                      className="btn btn-accent" 
                      style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem', gap: '4px' }}
                    >
                      <MessageSquare size={13} /> Chat
                    </button>
                  ) : mem.isPending ? (
                    <button disabled className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem', opacity: 0.6 }}>
                      Pending...
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleSendConnect(mem.id, mem.fullName)} 
                      className="btn btn-primary" 
                      style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem', gap: '4px' }}
                    >
                      <UserPlus size={13} /> Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: MY CONNECTED PEERS                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'connections' && (
        <div>
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
              <div key={c.id} className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '16px' }}>
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {c.skills.map((s, idx) => (
                    <span key={idx} className="tag tag-accent" style={{ fontSize: '0.75rem' }}>
                      {s}
                    </span>
                  ))}
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

    </div>
  );
}
