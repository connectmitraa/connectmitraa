import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import React, { useState, useEffect, useCallback } from 'react';
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
import { ConnectionsAPI } from '../../lib/api';

export function ConnectionsScreen({ token, setActiveTab, setActiveChatId, setChatPeer, onOpenPublicProfile, startWebRtcCall }) {
  const { profile, updateProfileState } = useAuth();
  const toast = useToast();
  const [activeSubTab, setActiveSubTab] = useState(() => localStorage.getItem('studyloop_conn_subtab') || 'all');
  const [pendingTypeFilter, setPendingTypeFilter] = useState('received');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState('All');
  const [selectedGoalFilter, setSelectedGoalFilter] = useState('All');
  const [connectNoteModalUser, setConnectNoteModalUser] = useState(null);
  const [inviteNoteText, setInviteNoteText] = useState('');
  const [actionToast, setActionToast] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('studyloop_conn_subtab', activeSubTab);
  }, [activeSubTab]);

  // Load all connections data from backend
  const fetchConnections = useCallback(async () => {
    if (!token) return;
    setApiLoading(true);
    try {
      const [connData, pendingData, sentData] = await Promise.all([
        ConnectionsAPI.getAll(token).catch(() => null),
        ConnectionsAPI.getPending(token).catch(() => null),
        ConnectionsAPI.getSent(token).catch(() => null),
      ]);
      if (Array.isArray(connData) && connData.length > 0) {
        setMembers(connData.map(c => ({
          id: c.id || c.userId,
          fullName: c.fullName || c.name,
          username: c.username || c.fullName?.toLowerCase().replace(' ', '_'),
          college: c.college || 'Campus',
          department: c.department || 'Engineering',
          year: c.year || 1,
          avatarUrl: c.avatarUrl || (c.gender === 'female' ? FEMALE_AVATAR_SVG : MALE_AVATAR_SVG),
          skills: c.skills || [],
          mutuals: c.mutualConnections || 0,
          doubtsSolved: c.doubtsSolved || 0,
          rating: c.rating || 4.5,
          xp: c.xp || 0,
          level: c.level || 1,
          isConnected: true,
          isPending: false,
        })));
      }
      if (Array.isArray(pendingData) && pendingData.length > 0) {
        setPendingRequests(pendingData.map(r => ({
          id: r.id || r.requesterId,
          fullName: r.fullName || r.name,
          college: r.college || 'Campus',
          avatarUrl: r.avatarUrl || MALE_AVATAR_SVG,
          skills: r.skills || [],
          note: r.message || '',
          time: r.createdAt ? new Date(r.createdAt).toRelativeString?.() || 'Recently' : 'Recently',
          mutuals: r.mutualConnections || 0,
          xp: r.xp || 0,
          status: 'pending',
        })));
      }
      if (Array.isArray(sentData) && sentData.length > 0) {
        setSentRequests(sentData.map(r => ({
          id: r.id || r.targetId,
          fullName: r.fullName || r.name,
          college: r.college || 'Campus',
          avatarUrl: r.avatarUrl || MALE_AVATAR_SVG,
          time: r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Recently',
        })));
      }
    } catch (e) {
      console.log('Connections: using fallback data', e.message);
    } finally {
      setApiLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  // Real-time master campus members repository (Inter-college network)
  const [members, setMembers] = useState([
    { id: 'm-1', fullName: 'Bhavna Patel', username: 'bhavna_patel', college: 'IIT Madras', department: 'Computer Science', year: 3, avatarUrl: FEMALE_AVATAR_SVG, skills: ['Python', 'Machine Learning', 'Data Structures'], degree: '1st', mutuals: 14, doubtsSolved: 42, rating: 4.95, xp: 820, level: 5, isFollowing: true, isConnected: true, isPending: false, verifiedStudent: true, targetGoal: '🚀 Placements & Referrals' },
    { id: 'm-2', fullName: 'Chaitanya Reddy', username: 'chaitanya_bits', college: 'BITS Pilani', department: 'Electrical Engineering', year: 1, avatarUrl: MALE_AVATAR_SVG, skills: ['Circuits', 'Calculus', 'C++'], degree: '1st', mutuals: 8, doubtsSolved: 18, rating: 4.85, xp: 340, level: 2, isFollowing: false, isConnected: true, isPending: false, verifiedStudent: true, targetGoal: '📚 Semester Exams' },
    { id: 'm-3', fullName: 'Divya Nambiar', username: 'divya_nitt', college: 'NIT Trichy', department: 'Data Science', year: 2, avatarUrl: FEMALE_AVATAR_SVG, skills: ['SQL', 'Tableau', 'Statistics'], degree: '1st', mutuals: 19, doubtsSolved: 31, rating: 4.90, xp: 520, level: 3, isFollowing: true, isConnected: true, isPending: false, verifiedStudent: true, targetGoal: '⚡ LeetCode & DSA' },
    { id: 'm-4', fullName: 'Kavya Subramanian', username: 'kavya_iitd', college: 'IIT Delhi', department: 'Software Engineering', year: 4, avatarUrl: FEMALE_AVATAR_SVG, skills: ['React', 'TypeScript', 'Node.js', 'System Design'], degree: '2nd', mutuals: 11, doubtsSolved: 64, rating: 4.98, xp: 1120, level: 7, isFollowing: false, isConnected: false, isPending: false, verifiedStudent: true, targetGoal: '🚀 Placements & Referrals' },
    { id: 'm-5', fullName: 'Rohan Deshmukh', username: 'rohan_iitb', college: 'IIT Bombay', department: 'Computer Science', year: 2, avatarUrl: MALE_AVATAR_SVG, skills: ['Competitive Programming', 'Algorithms', 'Java'], degree: '2nd', mutuals: 16, doubtsSolved: 27, rating: 4.88, xp: 480, level: 3, isFollowing: false, isConnected: false, isPending: false, verifiedStudent: true, targetGoal: '⚡ LeetCode & DSA' },
    { id: 'm-6', fullName: 'Sneha Roy', username: 'sneha_iiit', college: 'IIIT Hyderabad', department: 'AI & Data Science', year: 3, avatarUrl: FEMALE_AVATAR_SVG, skills: ['PyTorch', 'Computer Vision', 'NLP'], degree: '2nd', mutuals: 9, doubtsSolved: 53, rating: 4.96, xp: 950, level: 6, isFollowing: false, isConnected: false, isPending: false, verifiedStudent: true, targetGoal: '🏆 Hackathon Team' },
    { id: 'm-7', fullName: 'Vikram Joshi', username: 'vikram_mech', college: 'IIT Madras', department: 'Mechanical Engineering', year: 4, avatarUrl: MALE_AVATAR_SVG, skills: ['Thermodynamics', 'MATLAB', 'Python'], degree: '2nd', mutuals: 7, doubtsSolved: 22, rating: 4.80, xp: 390, level: 2, isFollowing: false, isConnected: false, isPending: false, verifiedStudent: true, targetGoal: '🎓 GATE & Higher Studies' },
    { id: 'm-8', fullName: 'Ananya Guha', username: 'ananya_cloud', college: 'BITS Pilani', department: 'Computer Science', year: 3, avatarUrl: FEMALE_AVATAR_SVG, skills: ['Kubernetes', 'Go', 'Cloud Architecture'], degree: '2nd', mutuals: 13, doubtsSolved: 47, rating: 4.92, xp: 780, level: 4, isFollowing: false, isConnected: false, isPending: false, verifiedStudent: true, targetGoal: '🚀 Placements & Referrals' },
    { id: 'm-9', fullName: 'Suresh Varma', username: 'suresh_jntuh', college: 'JNTU Hyderabad', department: 'Computer Science', year: 3, avatarUrl: MALE_AVATAR_SVG, skills: ['Java', 'Spring Boot', 'MySQL'], degree: '2nd', mutuals: 22, doubtsSolved: 38, rating: 4.89, xp: 710, level: 4, isFollowing: false, isConnected: false, isPending: false, verifiedStudent: true, targetGoal: '🚀 Placements & Referrals' },
    { id: 'm-10', fullName: 'Meghana Rao', username: 'meghana_osmania', college: 'Osmania University', department: 'Information Technology', year: 2, avatarUrl: FEMALE_AVATAR_SVG, skills: ['DSA', 'C++', 'Web Development'], degree: '2nd', mutuals: 15, doubtsSolved: 19, rating: 4.84, xp: 420, level: 3, isFollowing: false, isConnected: false, isPending: false, verifiedStudent: true, targetGoal: '⚡ LeetCode & DSA' },
    { id: 'm-11', fullName: 'Kalyan Chakravarthy', username: 'kalyan_au', college: 'Andhra University', department: 'ECE & Embedded', year: 4, avatarUrl: MALE_AVATAR_SVG, skills: ['VLSI', 'Verilog', 'IoT'], degree: '2nd', mutuals: 18, doubtsSolved: 26, rating: 4.91, xp: 630, level: 4, isFollowing: false, isConnected: false, isPending: false, verifiedStudent: true, targetGoal: '🎓 GATE & Higher Studies' }
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

  // Clean, Frictionless Inline Accept (Instagram/LinkedIn style)
  const handleAcceptRequest = (req) => {
    // 1. Remove from pendingRequests so the pending list stays clean
    setPendingRequests(prev => prev.filter(p => p.id !== req.id));

    // 2. Add or update in members list as connected
    setMembers(prev => {
      const exists = prev.some(m => m.id === req.id);
      if (exists) {
        return prev.map(m => m.id === req.id ? { ...m, isConnected: true, isPending: false } : m);
      } else {
        return [
          {
            id: req.id,
            fullName: req.fullName,
            username: req.username || req.fullName?.toLowerCase().replace(/\s+/g, '_') || 'student',
            college: req.college || 'Campus',
            department: req.department || 'Engineering',
            year: req.year || 3,
            avatarUrl: req.avatarUrl || FEMALE_AVATAR_SVG,
            skills: req.skills || ['Peer Learning'],
            degree: '1st',
            mutuals: req.mutuals || 8,
            doubtsSolved: req.doubtsSolved || 20,
            rating: req.rating || 4.9,
            xp: req.xp || 500,
            level: 3,
            isFollowing: true,
            isConnected: true,
            isPending: false,
            verifiedStudent: true,
            targetGoal: '🚀 Placements & Referrals'
          },
          ...prev
        ];
      }
    });

    if (token) {
      ConnectionsAPI.acceptRequest?.(token, req.id).catch(() => {});
    }
    
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
      message: `🎉 Connected with ${req.fullName}! Added to My Connections. +5 Peer Coins & +10 XP awarded.`,
      type: 'success'
    });
  };

  // Clean, Frictionless Inline Reject
  const handleRejectRequest = (reqId, reqName) => {
    setPendingRequests(prev => prev.filter(p => p.id !== reqId));
    if (token) {
      ConnectionsAPI.reject(token, reqId).catch(() => {});
    }
    setActionToast({
      message: `Declined connection invitation from ${reqName}.`,
      type: 'info'
    });
  };

  // Withdraw Outgoing Request
  const handleWithdrawSentRequest = (reqId, reqName) => {
    setSentRequests(prev => prev.filter(p => p.id !== reqId));
    if (token) {
      ConnectionsAPI.withdraw(token, reqId).catch(() => {});
    }
    setActionToast({
      message: `Withdrew connection invitation sent to ${reqName}.`,
      type: 'info'
    });
  };

  const handleOpenConnectModal = (mem) => {
    setConnectNoteModalUser(mem);
    setInviteNoteText(`Hi ${mem.fullName.split(' ')[0]}, I saw your profile on StudyLoop and would love to connect to discuss ${mem.skills?.[0] || 'engineering'} and campus placements.`);
  };

  const handleConfirmSendConnect = (note = '') => {
    if (!connectNoteModalUser) return;
    const memId = connectNoteModalUser.id;
    const memName = connectNoteModalUser.fullName;

    setMembers(prev => prev.map(m => m.id === memId ? { ...m, isPending: true } : m));
    const targetMem = members.find(m => m.id === memId);
    if (targetMem) {
      setSentRequests(prev => [{ ...targetMem, note: note || '', time: 'Sent Just now' }, ...prev]);
    }

    if (token) {
      ConnectionsAPI.sendRequest(token, memId, note).catch(() => {});
    }

    setConnectNoteModalUser(null);
    setInviteNoteText('');
    setActionToast({
      message: `🤝 Connection invite sent to ${memName}${note ? ' with personalized note' : ''}!`,
      type: 'success'
    });
  };

  const handleSendConnect = (memId, memName) => {
    const mem = members.find(m => m.id === memId);
    if (mem) {
      handleOpenConnectModal(mem);
    }
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

  // Filtered members list with Campus + Goal criteria
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.college.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (m.skills || []).some(s => s.toLowerCase().includes(searchFilter.toLowerCase()));
    
    const matchesUni = selectedUniversityFilter === 'All' || m.college.toLowerCase().includes(selectedUniversityFilter.toLowerCase());
    const matchesGoal = selectedGoalFilter === 'All' || m.targetGoal === selectedGoalFilter;
    return matchesSearch && matchesUni && matchesGoal;
  });

  const connectedMembers = members.filter(m => m.isConnected);
  const activeIncomingCount = pendingRequests.filter(r => r.status === 'pending').length;

  const filteredConnected = connectedMembers.filter(c => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return c.fullName.toLowerCase().includes(q) ||
      (c.college && c.college.toLowerCase().includes(q)) ||
      (c.department && c.department.toLowerCase().includes(q)) ||
      (c.skills && c.skills.some(s => s.toLowerCase().includes(q)));
  });

  const suggestedPeers = members
    .filter(m => !m.isConnected && !m.isPending)
    .sort((a, b) => (b.mutuals || 0) - (a.mutuals || 0))
    .slice(0, 5);

  return (
    <div className="studyloop-page-container" style={{ position: 'relative' }}>
      
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
            pendingRequests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem', borderRadius: '16px' }}>
                <CheckCircle size={48} style={{ color: 'var(--success-color)', margin: '0 auto 1rem auto' }} />
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>All Caught Up!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You have reviewed all incoming connection requests.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.25rem' }}>
                  <button onClick={() => setActiveSubTab('connections')} className="btn btn-secondary" style={{ fontWeight: 700 }}>
                    🤝 View My Connections ({connectedMembers.length})
                  </button>
                  <button onClick={() => setActiveSubTab('all')} className="btn btn-accent" style={{ fontWeight: 700 }}>
                    🌐 Explore Campus Directory
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {pendingRequests.filter(r => r.status === 'pending').map(req => (
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
                      borderLeft: '4px solid var(--accent-primary)',
                      padding: '1.15rem 1.4rem',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.15rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                      <img 
                        src={req.avatarUrl} 
                        alt={req.fullName} 
                        style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer', flexShrink: 0 }} 
                        onClick={() => onOpenPublicProfile(req)}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span 
                            style={{ fontWeight: 800, fontSize: '1.0625rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                            onClick={() => onOpenPublicProfile(req)}
                          >
                            {req.fullName}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {req.time}</span>
                          <span className="tag tag-accent" style={{ fontSize: '0.625rem' }}>⭐ {req.rating || 4.9}</span>
                        </div>
                        
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                          {req.college} • {req.department} {req.year ? `(Yr ${req.year})` : ''} • 👥 {req.mutuals || 0} mutual peers
                        </div>

                        {req.note && (
                          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--text-primary)', marginTop: '0.45rem', fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)' }}>
                            "{req.note}"
                          </div>
                        )}

                        {req.skills && req.skills.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                            {req.skills.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="tag" style={{ fontSize: '0.6875rem' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Action Buttons (Instagram / LinkedIn style: Accept & Ignore) */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button 
                        onClick={() => onOpenPublicProfile(req)} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <User size={14} /> Profile
                      </button>

                      <button 
                        onClick={() => handleAcceptRequest(req)} 
                        className="btn btn-accent" 
                        style={{ padding: '0.5rem 1.25rem', fontWeight: 800, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#10b981', borderColor: '#10b981', color: '#ffffff' }}
                      >
                        <CheckCircle2 size={15} /> Accept
                      </button>

                      <button 
                        onClick={() => handleRejectRequest(req.id, req.fullName)} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Decline Connection"
                      >
                        <X size={14} /> Ignore
                      </button>
                    </div>
                  </div>
                ))}
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
          <div className="card-premium" style={{ marginBottom: '1.5rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.55rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                <Search size={16} style={{ color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search peers by name, college, branch, or skills (e.g. Java, LeetCode, VLSI)..." 
                  value={searchFilter} 
                  onChange={e => setSearchFilter(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <Filter size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>Showing <strong>{filteredMembers.length}</strong> campus peers</span>
              </div>
            </div>

            {/* University Filter Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                🏛️ Filter By Campus
              </div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {['All', 'IIT Madras', 'BITS Pilani', 'IIT Bombay', 'NIT Trichy', 'IIIT Hyderabad', 'JNTU Hyderabad', 'Osmania University', 'Andhra University', 'Anna University'].map(uni => (
                  <button
                    key={uni}
                    onClick={() => setSelectedUniversityFilter(uni)}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      border: selectedUniversityFilter === uni ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: selectedUniversityFilter === uni ? 'var(--accent-light)' : 'var(--bg-secondary)',
                      color: selectedUniversityFilter === uni ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {uni}
                  </button>
                ))}
              </div>
            </div>

            {/* Career / Study Goal Filter Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                🎯 Filter By Student Goal
              </div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {['All', '🚀 Placements & Referrals', '⚡ LeetCode & DSA', '🏆 Hackathon Team', '📚 Semester Exams', '🎓 GATE & Higher Studies'].map(goal => (
                  <button
                    key={goal}
                    onClick={() => setSelectedGoalFilter(goal)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '8px',
                      border: selectedGoalFilter === goal ? '1.5px solid #10b981' : '1px solid var(--border-color)',
                      backgroundColor: selectedGoalFilter === goal ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-tertiary)',
                      color: selectedGoalFilter === goal ? '#059669' : 'var(--text-secondary)',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid-3">
            {apiLoading ? (
              Array.from({ length: 6 }).map((_, sIdx) => (
                <div key={sIdx} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className="skeleton-shimmer" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div className="skeleton-shimmer" style={{ width: '60%', height: '14px' }} />
                      <div className="skeleton-shimmer" style={{ width: '80%', height: '12px' }} />
                    </div>
                  </div>
                  <div className="skeleton-shimmer" style={{ width: '100%', height: '36px', borderRadius: '8px' }} />
                  <div className="skeleton-shimmer" style={{ width: '100%', height: '32px', borderRadius: '8px', marginTop: 'auto' }} />
                </div>
              ))
            ) : filteredMembers.length === 0 ? (
              <div className="card-premium" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem 1.5rem', borderRadius: '16px' }}>
                <Search size={42} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto', opacity: 0.6 }} />
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Campus Peers Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
                  No students match the current campus filter ("{selectedUniversityFilter}") or goal filter ("{selectedGoalFilter}").
                </p>
                <button 
                  onClick={() => {
                    setSelectedUniversityFilter('All');
                    setSelectedGoalFilter('All');
                    setSearchFilter('');
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem', fontWeight: 700 }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredMembers.map(mem => (
              <div key={mem.id} className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', borderRadius: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={mem.avatarUrl} 
                        alt={mem.fullName} 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer' }} 
                        onClick={() => onOpenPublicProfile(mem)}
                      />
                      <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid #ffffff' }} />
                    </div>
                    <div>
                      <div 
                        style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => onOpenPublicProfile(mem)}
                      >
                        <span>{mem.fullName}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{mem.college}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{mem.department} (Yr {mem.year})</div>
                    </div>
                  </div>

                  <span className="tag" style={{ fontSize: '0.625rem', fontWeight: 700 }}>{mem.degree || '2nd'}</span>
                </div>

                {/* Verified Student & Target Goal Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '3px', 
                    color: '#059669', 
                    fontSize: '0.6875rem', 
                    fontWeight: 700, 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                    padding: '2px 7px', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(16, 185, 129, 0.25)' 
                  }}>
                    <CheckCircle2 size={11} /> Verified Student
                  </span>

                  {mem.targetGoal && (
                    <span style={{ 
                      fontSize: '0.6875rem', 
                      color: 'var(--accent-primary)', 
                      fontWeight: 700, 
                      backgroundColor: 'var(--accent-light)', 
                      padding: '2px 7px', 
                      borderRadius: '6px' 
                    }}>
                      {mem.targetGoal}
                    </span>
                  )}
                </div>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {mem.skills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Mutual peers info */}
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} style={{ color: 'var(--accent-primary)' }} /> {mem.mutuals} mutual campus peers
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.625rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => onOpenPublicProfile(mem)} 
                    className="btn btn-secondary" 
                    style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem', fontWeight: 600 }}
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
                      style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem', gap: '4px', fontWeight: 700 }}
                    >
                      <MessageSquare size={13} /> Chat
                    </button>
                  ) : mem.isPending ? (
                    <button disabled className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem', opacity: 0.7 }}>
                      Invitation Sent
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleOpenConnectModal(mem)} 
                      className="btn btn-primary" 
                      style={{ flex: 1.2, fontSize: '0.75rem', padding: '0.45rem', gap: '4px', fontWeight: 700 }}
                    >
                      <UserPlus size={13} /> Connect + Note
                    </button>
                  )}
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: MY CONNECTED PEERS                                             */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SUBTAB 3: MY CONNECTED PEERS (2-COLUMN WHATSAPP / LINKEDIN STYLE)         */}
      {/* ========================================================================= */}
      {activeSubTab === 'connections' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '1.75rem', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN: WhatsApp / LinkedIn-style Stacked Connections List */}
          <div>
            {/* Search Input Bar */}
            <div className="card-premium" style={{ marginBottom: '1.25rem', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', borderRadius: '14px' }}>
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search connections by name, college, or skills..." 
                value={searchFilter} 
                onChange={e => setSearchFilter(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--text-primary)' }}
              />
              {searchFilter && (
                <button onClick={() => setSearchFilter('')} className="btn-icon" style={{ padding: '0.2rem', color: 'var(--text-muted)' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem', padding: '0 0.25rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                {filteredConnected.length} {filteredConnected.length === 1 ? 'Connection' : 'Connections'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                Live Peer Network
              </span>
            </div>

            {/* Connection Rows */}
            {connectedMembers.length === 0 ? (
              <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem', borderRadius: '16px' }}>
                <Users size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Connections Yet</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Explore the campus directory to connect with classmates, mentors, and study buddies!
                </p>
                <button onClick={() => setActiveSubTab('all')} className="btn btn-accent" style={{ fontWeight: 700 }}>
                  🌐 Explore Campus Directory
                </button>
              </div>
            ) : filteredConnected.length === 0 ? (
              <div className="card-premium" style={{ textAlign: 'center', padding: '2.5rem', borderRadius: '16px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  No connections matching <strong>"{searchFilter}"</strong>
                </p>
                <button onClick={() => setSearchFilter('')} className="btn btn-secondary" style={{ marginTop: '0.75rem', fontSize: '0.8125rem' }}>
                  Clear Search
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {filteredConnected.map(c => (
                  <div 
                    key={c.id} 
                    className="card-premium interactive-hover" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '0.9rem 1.25rem', 
                      borderRadius: '14px', 
                      gap: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Left: Avatar with Online indicator + Details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0, flex: 1 }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img 
                          src={c.avatarUrl} 
                          alt={c.fullName} 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', cursor: 'pointer' }} 
                          onClick={() => onOpenPublicProfile(c)}
                        />
                        <span 
                          style={{ 
                            position: 'absolute', 
                            bottom: 1, 
                            right: 1, 
                            width: '11px', 
                            height: '11px', 
                            borderRadius: '50%', 
                            backgroundColor: '#10b981', 
                            border: '2px solid var(--bg-card)' 
                          }} 
                          title="Online & Active"
                        />
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                          <span 
                            style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                            onClick={() => onOpenPublicProfile(c)}
                          >
                            {c.fullName}
                          </span>
                          <span className="tag" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem' }}>{c.degree || '1st'}</span>
                          {c.verifiedStudent && (
                            <span style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 700 }}>✓ Verified</span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.125rem' }}>
                          {c.college} • {c.department} {c.year ? `(Yr ${c.year})` : ''}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                            👥 {c.mutuals || 0} mutual peers
                          </span>
                          {(c.skills || []).slice(0, 2).map((s, idx) => (
                            <span key={idx} className="tag tag-accent" style={{ fontSize: '0.65625rem', padding: '0.1rem 0.4rem' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Message & See Profile buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <button 
                        onClick={() => { setChatPeer(c); setActiveChatId(`chat-${c.id}`); setActiveTab('chat'); }} 
                        className="btn btn-accent" 
                        style={{ padding: '0.45rem 0.95rem', fontSize: '0.8125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <MessageSquare size={14} /> Message
                      </button>

                      <button 
                        onClick={() => onOpenPublicProfile(c)} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.45rem 0.8rem', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <User size={14} /> Profile
                      </button>

                      <button 
                        onClick={() => handleRemoveConnection(c.id, c.fullName)} 
                        className="btn-icon" 
                        title="Remove Connection"
                        style={{ color: 'var(--text-muted)', padding: '0.4rem' }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: LinkedIn-style "Mutual Connections & Suggested For You" */}
          <div style={{ position: 'sticky', top: '5.5rem' }}>
            <div className="card-premium" style={{ padding: '1.25rem', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Suggested For You
                  </h3>
                </div>
                <span className="tag tag-accent" style={{ fontSize: '0.625rem' }}>Mutuals</span>
              </div>

              <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                Peers with mutual campus connections and shared study interests:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {suggestedPeers.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                      <img 
                        src={s.avatarUrl} 
                        alt={s.fullName} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', flexShrink: 0 }} 
                        onClick={() => onOpenPublicProfile(s)}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div 
                          style={{ fontWeight: 700, fontSize: '0.84375rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                          onClick={() => onOpenPublicProfile(s)}
                        >
                          {s.fullName}
                        </div>
                        <div style={{ fontSize: '0.71875rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.college}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                          👥 {s.mutuals} mutual connections
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenConnectModal(s)} 
                      className="btn btn-primary" 
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
                    >
                      <UserPlus size={13} /> Connect
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setActiveSubTab('all')} 
                className="btn btn-ghost" 
                style={{ width: '100%', marginTop: '1rem', fontSize: '0.8125rem', fontWeight: 700, justifyContent: 'center' }}
              >
                Explore All Campus Peers →
              </button>
            </div>
          </div>

        </div>
      )}

      {/* LINKEDIN-STYLE PERSONALIZED INVITATION NOTE MODAL */}
      {connectNoteModalUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium animate-slide-up" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', borderRadius: '16px', backgroundColor: 'var(--bg-elevated)', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Invite to Campus Network</h3>
              </div>
              <button onClick={() => setConnectNoteModalUser(null)} className="btn-icon"><X size={18} /></button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              LinkedIn data reveals students are <strong>3x more likely</strong> to accept when accompanied by a personalized greeting!
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <img src={connectNoteModalUser.avatarUrl} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{connectNoteModalUser.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{connectNoteModalUser.college} • {connectNoteModalUser.department}</div>
                {connectNoteModalUser.targetGoal && (
                  <div style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '2px' }}>
                    🎯 {connectNoteModalUser.targetGoal}
                  </div>
                )}
              </div>
            </div>

            <label className="label" style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>Add a Personal Note</label>
            <textarea
              value={inviteNoteText}
              onChange={e => setInviteNoteText(e.target.value.slice(0, 300))}
              placeholder="e.g. Hi, saw your LeetCode profile! Would love to connect and prep for upcoming off-campus placement drives together..."
              className="input"
              style={{ minHeight: '95px', marginBottom: '0.35rem', fontSize: '0.8125rem', padding: '0.65rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              <span>Personalized notes build verified peer trust</span>
              <span>{inviteNoteText.length} / 300</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => handleConfirmSendConnect('')} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
              >
                Send Without Note
              </button>
              <button 
                onClick={() => handleConfirmSendConnect(inviteNoteText)} 
                className="btn btn-accent" 
                style={{ fontSize: '0.8125rem', fontWeight: 800, padding: '0.5rem 1.25rem' }}
              >
                Send Invitation 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast */}
      {actionToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: actionToast.type === 'success' ? '#10b981' : '#3b82f6',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontSize: '0.875rem',
          fontWeight: 700,
          zIndex: 5000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <span>{actionToast.message}</span>
        </div>
      )}

    </div>
  );
}
