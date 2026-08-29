import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Activity, ArrowRight, Award, Bell, BookOpen, Building2, Calendar, Check, CheckCircle, ChevronDown, ChevronRight, Compass, DollarSign, ExternalLink, Film, Grid, HelpCircle, Home, Infinity, Laptop, LifeBuoy, LogIn, LogOut, Menu, MessageSquare, Moon, Radio, Search, Settings, Shield, Sparkles, Star, Sun, Trophy, Tv2, UserCheck, UserPlus, Users, Video, Wallet, X, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../constants/avatars';
import { SidebarLink } from '../components/common/SidebarLink';
import { LoadingFallback } from '../components/common/LoadingFallback';

// Modals (Synchronous for instant popup interaction)
import { PublicProfileModal } from '../components/modals/PublicProfileModal';
import { UserListModal } from '../components/modals/UserListModal';
import { AvatarChangeModal } from '../components/modals/AvatarChangeModal';
import { PhotoPreviewModal } from '../components/modals/PhotoPreviewModal';
import { BookingModal } from '../components/modals/BookingModal';
import { ReviewSessionModal } from '../components/modals/ReviewSessionModal';

// Features (Lazy Loaded for High-Performance Code Splitting)
const LandingScreen = lazy(() => import('../features/landing/LandingScreen').then(m => ({ default: m.LandingScreen })));
const DashboardScreen = lazy(() => import('../features/dashboard/DashboardScreen').then(m => ({ default: m.DashboardScreen })));
const ConnectionsScreen = lazy(() => import('../features/connections/ConnectionsScreen').then(m => ({ default: m.ConnectionsScreen })));
const ChatScreen = lazy(() => import('../features/chat/ChatScreen').then(m => ({ default: m.ChatScreen })));
const DoubtRoomsScreen = lazy(() => import('../features/doubts/DoubtRoomsScreen').then(m => ({ default: m.DoubtRoomsScreen })));
const RtcCallOverlay = lazy(() => import('../features/doubts/RtcCallOverlay').then(m => ({ default: m.RtcCallOverlay })));
const ReelsScreen = lazy(() => import('../features/reels/ReelsScreen').then(m => ({ default: m.ReelsScreen })));
const MySessionsScreen = lazy(() => import('../features/sessions/MySessionsScreen').then(m => ({ default: m.MySessionsScreen })));
const LiveClassroomScreen = lazy(() => import('../features/sessions/LiveClassroomScreen').then(m => ({ default: m.LiveClassroomScreen })));
const DiscoverScreen = lazy(() => import('../features/discover/DiscoverScreen').then(m => ({ default: m.DiscoverScreen })));
const WalletScreen = lazy(() => import('../features/wallet/WalletScreen').then(m => ({ default: m.WalletScreen })));
const LeaderboardScreen = lazy(() => import('../features/leaderboard/LeaderboardScreen').then(m => ({ default: m.LeaderboardScreen })));
const SettingsScreen = lazy(() => import('../features/settings/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const AdminConsoleScreen = lazy(() => import('../features/admin/AdminConsoleScreen').then(m => ({ default: m.AdminConsoleScreen })));
const AdminGateScreen = lazy(() => import('../features/admin/AdminGateScreen').then(m => ({ default: m.AdminGateScreen })));
const ContactSupportScreen = lazy(() => import('../features/support/ContactSupportScreen').then(m => ({ default: m.ContactSupportScreen })));
const FeedScreen = lazy(() => import('../features/support/FeedScreen').then(m => ({ default: m.FeedScreen })));

export function MainLayout() {
  const { user, profile, updateProfileState, token, loading, logout, loginSimulated, loginAdmin, testAccounts, isAdminMode, setIsAdminMode } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('studyloop_theme') || 'light');
  
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('studyloop_theme', theme);
  }, [theme]);
  
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (path.includes('/admin') || hash === 'admin') {
      return 'admin';
    }
    if (hash && hash.length > 0 && hash !== 'admin') {
      return hash;
    }
    const saved = localStorage.getItem('studyloop_active_tab');
    if (saved && saved !== 'landing') {
      return saved;
    }
    const savedUser = localStorage.getItem('studyloop_user');
    return savedUser ? 'dashboard' : 'landing';
  });
  const [postLoginRedirectTab, setPostLoginRedirectTab] = useState(null);

  // URL LISTENER FOR /admin or hash routes (PROFESSIONAL ROUTE GUARD & RELOAD PERSISTENCE)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (path.includes('/admin') || hash === 'admin') {
        setActiveTab('admin');
      } else if (hash && hash.length > 0) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('studyloop_active_tab', activeTab);
      if (activeTab === 'landing') {
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        if (window.location.hash.replace('#', '') !== activeTab) {
          window.history.replaceState(null, '', '#' + activeTab);
        }
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const savedUser = localStorage.getItem('studyloop_user');
    if (!user && !savedUser && activeTab !== 'admin' && activeTab !== 'landing') {
      setPostLoginRedirectTab(activeTab);
      setActiveTab('landing');
    }
  }, [user]);

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatPeer, setChatPeer] = useState(null);
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [viewingPublicProfile, setViewingPublicProfile] = useState(null);
  const [userListModalData, setUserListModalData] = useState(null);

  const openPublicProfile = (userObj) => {
    if (!userObj) return;
    if (userObj.id === profile?.id) {
      setActiveTab('dashboard');
    } else {
      setViewingPublicProfile(userObj);
    }
  };

  const startDirectMessageWithPeer = async (peer) => {
    if (!peer || !peer.id) return;
    try {
      const response = await fetch(`/api/chats/direct/init?peerId=${peer.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const chat = await response.json();
        setActiveChatId(chat.id);
        setChatPeer(peer);
        setActiveTab('chat');
        return;
      }
    } catch (e) {
      console.log("Starting DM locally with", peer.fullName);
    }
    setActiveChatId(`chat-${peer.id}`);
    setChatPeer(peer);
    setActiveTab('chat');
  };

  // Real-time connections & WebRTC states
  const [socket, setSocket] = useState(null);
  const [wsMessages, setWsMessages] = useState([]);
  const [webrtcCall, setWebrtcCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // 1:1 Peer Study Sessions & Monetization State
  const [bookedSessions, setBookedSessions] = useState([
    {
      id: 'session-init-1',
      tutorName: 'Bhavna Patel',
      tutorAvatar: FEMALE_AVATAR_SVG,
      tutorCollege: 'IIT Madras',
      topic: 'Java OOP: Inheritance & Runtime Polymorphism',
      doubtNotes: 'Understand dynamic method dispatch and super() constructor calls.',
      duration: '30 Mins',
      fee: 50,
      status: 'confirmed',
      time: 'Ready to Join Now ⚡',
      rated: false
    },
    {
      id: 'session-init-2',
      tutorName: 'Rohan Deshmukh',
      tutorAvatar: MALE_AVATAR_SVG,
      tutorCollege: 'IIT Bombay',
      topic: 'Dynamic Programming: 0/1 Knapsack Walkthrough',
      doubtNotes: 'Tabulation table indexing and memoization state transitions.',
      duration: '60 Mins',
      fee: 60,
      status: 'completed',
      time: 'Yesterday',
      rated: true
    }
  ]);

  const [bookingModalTutor, setBookingModalTutor] = useState(null);
  const [activeClassroomSession, setActiveClassroomSession] = useState(null);
  const [reviewModalSession, setReviewModalSession] = useState(null);

  useEffect(() => {
    if (!token) return;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/chat?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          setWsMessages(prev => [...prev, payload]);
        } catch (e) {}
      };

      ws.onclose = () => {
        setSocket(null);
      };

      return () => {
        ws.close();
      };
    } catch(e) {}
  }, [token]);

  const startWebRtcCall = async (targetUserId, doubtRoomId = null) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setWebrtcCall({ peerId: targetUserId, isIncoming: false, roomId: doubtRoomId });
    } catch (e) {
      alert("Camera / Mic simulation active. Connecting study room video call...");
      setWebrtcCall({ peerId: targetUserId, isIncoming: false, roomId: doubtRoomId, isSimulated: true });
    }
  };

  const toggleScreenShare = async () => {
    setIsScreenSharing(prev => !prev);
  };

  const hangUpCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setWebrtcCall(null);
    setIsScreenSharing(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <Infinity size={48} className="live-dot" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
        <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Loading StudyLoop...</h2>
      </div>
    );
  }

  const isSuperAdmin = user?.email?.toLowerCase() === 'admin@studyloop.app' || profile?.role === 'super_admin' || user?.role === 'super_admin';

  // --- DEDICATED /admin ROUTE (PROFESSIONAL HIDDEN ADMIN PORTAL) ---
  if (activeTab === 'admin') {
    if (isSuperAdmin) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <AdminConsoleScreen 
            onBackToStudent={() => {
              setIsAdminMode(false);
              setActiveTab('landing');
              if (window.history.pushState) {
                window.history.pushState(null, '', '/');
              }
            }} 
          />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AdminGateScreen 
          loginAdmin={loginAdmin}
          onBackToHome={() => {
            setActiveTab('landing');
            if (window.history.pushState) {
              window.history.pushState(null, '', '/');
            }
          }}
        />
      </Suspense>
    );
  }

  // --- VISITOR LANDING SCREEN ---
  if (!user) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LandingScreen 
          setActiveTab={setActiveTab} 
          loginSimulated={loginSimulated} 
          loginAdmin={loginAdmin}
          testAccounts={testAccounts} 
          theme={theme} 
          setTheme={setTheme} 
          postLoginRedirectTab={postLoginRedirectTab}
          setPostLoginRedirectTab={setPostLoginRedirectTab}
        />
      </Suspense>
    );
  }

  // --- DEDICATED SEPARATE FULL-PAGE STUDENT PROFILE & SETTINGS (LINKEDIN / NAUKRI SEPARATE PAGE STYLE) ---
  if (activeTab === 'dashboard' || activeTab === 'settings' || activeTab === 'profile') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <SettingsScreen 
          token={token} 
          setActiveTab={setActiveTab} 
          theme={theme} 
          setTheme={setTheme} 
        />
      </Suspense>
    );
  }

  return (
    <div className="app-container fixed-app-container">
      {/* SIDEBAR NAVIGATION */}
      <nav className="sidebar" style={{
        width: isSidebarCollapsed ? '76px' : '260px',
        padding: isSidebarCollapsed ? '1rem 0.5rem' : '1.25rem 1rem'
      }}>
        {/* LOGO HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', cursor: 'pointer' }} onClick={() => { setActiveTab('landing'); setActiveRoomId(null); }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <span className="font-serif" style={{ color: '#ffffff', fontWeight: 800, fontSize: '1rem' }}>SL</span>
              </div>
              {!isSidebarCollapsed && (
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>StudyLoop</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.16em', paddingLeft: '2.5rem', textTransform: 'uppercase' }}>
                LEARN • BUILD • EVOLVE
              </span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              title="Collapse Sidebar"
              className="btn-icon"
              style={{ padding: '0.375rem' }}
            >
              <Grid size={16} />
            </button>
          )}
        </div>

        {/* COLLAPSED EXPAND BUTTON */}
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)} 
            title="Expand Sidebar"
            className="btn-icon"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* GROUPED SIDEBAR NAVIGATION LINKS */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
          
          {/* SECTION 1: ACADEMICS & PEER LEARNING */}
          {!isSidebarCollapsed && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.6875rem', 
              fontWeight: 800, 
              letterSpacing: '0.08em', 
              color: 'var(--accent-primary)', 
              marginTop: '0.75rem', 
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}>
              PEER LEARNING & DOUBTS
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)', marginLeft: '0.5rem' }}></div>
            </div>
          )}
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'landing'} icon={<Home size={18} />} label="Home Hub" onClick={() => { setActiveTab('landing'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'discover'} icon={<Search size={18} />} label="Find Peer Tutors (Topics)" onClick={() => { setActiveTab('discover'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'doubts'} icon={<HelpCircle size={18} />} label="Live Doubt Rooms" onClick={() => { setActiveTab('doubts'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'sessions'} icon={<Calendar size={18} />} label="My 1:1 Study Classes" onClick={() => { setActiveTab('sessions'); setActiveRoomId(null); }} />

          {/* SECTION 2: STUDENT EARNINGS & COMMUNITY */}
          {!isSidebarCollapsed && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.6875rem', 
              fontWeight: 800, 
              letterSpacing: '0.08em', 
              color: 'var(--accent-primary)', 
              marginTop: '1.25rem', 
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}>
              EARNINGS & NETWORK
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)', marginLeft: '0.5rem' }}></div>
            </div>
          )}
          <SidebarLink 
            isCollapsed={isSidebarCollapsed} 
            active={activeTab === 'wallet'} 
            icon={<Wallet size={18} style={{ color: 'var(--success-color)' }} />} 
            label={`Earnings Wallet (₹${profile?.walletBalance !== undefined ? profile.walletBalance : 450})`} 
            onClick={() => { setActiveTab('wallet'); setActiveRoomId(null); }} 
          />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'connections'} icon={<UserCheck size={18} />} label="Campus Connections" onClick={() => { setActiveTab('connections'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'leaderboard'} icon={<Trophy size={18} />} label="Campus Leaderboard" onClick={() => { setActiveTab('leaderboard'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'reels'} icon={<Tv2 size={18} />} label="Concept Shorts (9:16)" onClick={() => { setActiveTab('reels'); setActiveRoomId(null); }} />

          {/* SECTION 3: DASHBOARD & MESSAGING */}
          {!isSidebarCollapsed && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.6875rem', 
              fontWeight: 800, 
              letterSpacing: '0.08em', 
              color: 'var(--accent-primary)', 
              marginTop: '1.25rem', 
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}>
              MESSAGES & SUPPORT
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)', marginLeft: '0.5rem' }}></div>
            </div>
          )}
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'chat'} icon={<MessageSquare size={18} />} label="Direct Messages" onClick={() => { setActiveTab('chat'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'contact'} icon={<LifeBuoy size={18} />} label="Help Desk" onClick={() => { setActiveTab('contact'); setActiveRoomId(null); }} />
        </div>

        {/* LOGOUT BUTTON */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
          <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', border: 'none', background: 'transparent', padding: '0.5rem' }}>
            <LogOut size={18} /> {!isSidebarCollapsed && "Logout"}
          </button>
        </div>
      </nav>

      {/* MAIN SCREEN DISPATCHER */}
      <main className="main-content" style={{ padding: activeTab === 'reels' ? 0 : undefined, backgroundColor: activeTab === 'reels' ? '#09090b' : 'var(--bg-primary)' }}>
        
        {/* TOP FAR-RIGHT USER CORNER BAR */}
        {activeTab !== 'reels' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Campus & Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '0.375rem 0.875rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                <Building2 size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>{profile?.college || 'IIT Madras'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '0.375rem 1rem', flex: 1 }}>
                <Search size={15} style={{ color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search questions, peers, topics, code concepts..." 
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8125rem', width: '100%', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* FAR RIGHT USER DROPDOWN CHIP & THEME TOGGLE */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              
              {/* THEME TOGGLE (LIGHT / DARK) */}
              <button
                onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                className="btn-icon"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)'
                }}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* USER PROFILE CHIP */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowHeaderDropdown(prev => !prev)}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.375rem 0.875rem',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                >
                  <img 
                    src={getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl)} 
                    alt="Avatar" 
                    onError={(e) => { e.target.src = getDefaultAvatarByGender(profile?.gender); }}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover' }} 
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {profile?.fullName || 'Student Learner'}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      ⚡ {profile?.xp !== undefined ? profile.xp : 650} XP • Lvl {profile?.level !== undefined ? profile.level : 4}
                    </div>
                  </div>
                  <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
                </button>

                {/* USER DROPDOWN MENU */}
                {showHeaderDropdown && (
                  <div className="card dropdown-animate" style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    width: '260px',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 2000,
                    backgroundColor: 'var(--bg-elevated)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem'
                  }}>
                    <div style={{ padding: '0.25rem 0.5rem 0.625rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{profile?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{profile?.college}</div>
                    </div>

                    <button 
                      onClick={() => { setShowHeaderDropdown(false); setActiveTab('dashboard'); }} 
                      className="dropdown-item"
                    >
                      <Award size={16} style={{ color: 'var(--accent-primary)' }} /> Student Profile
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <button 
                        onClick={() => { logout(); setShowHeaderDropdown(false); }} 
                        className="dropdown-item-logout"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic call UI overlay */}
        {webrtcCall && (
          <RtcCallOverlay 
            localVideoRef={localVideoRef} 
            remoteVideoRef={remoteVideoRef} 
            isScreenSharing={isScreenSharing} 
            toggleScreenShare={toggleScreenShare} 
            hangUpCall={hangUpCall} 
            webrtcCall={webrtcCall} 
            localStream={localStream}
            remoteStream={remoteStream}
          />
        )}

        {/* Dynamic Public Profile Modal */}
        {viewingPublicProfile && (
          <PublicProfileModal
            user={viewingPublicProfile}
            currentUserId={profile?.id}
            token={token}
            onClose={() => setViewingPublicProfile(null)}
            onStartChat={startDirectMessageWithPeer}
            onOpenUserList={(title, userId) => setUserListModalData({ title, userId })}
          />
        )}

        {/* Dynamic User List Modal (Followers & Following) */}
        {userListModalData && (
          <UserListModal
            title={userListModalData.title}
            userId={userListModalData.userId}
            token={token}
            onClose={() => setUserListModalData(null)}
            onSelectUser={(u) => { setUserListModalData(null); openPublicProfile(u); }}
          />
        )}

        {/* Dynamic Booking & Escrow Modal */}
        {bookingModalTutor && (
          <BookingModal 
            tutor={bookingModalTutor} 
            onClose={() => setBookingModalTutor(null)} 
            onConfirmBooking={(newS) => {
              setBookedSessions(prev => [newS, ...prev]);
              setBookingModalTutor(null);
              setActiveTab('sessions');
              alert(`🎉 1:1 Session Booked on ${newS.topic}! Payment of ₹${newS.fee} is safely held in Escrow.`);
            }} 
          />
        )}

        {/* Dynamic Review & Escrow Release Modal */}
        {reviewModalSession && (
          <ReviewSessionModal 
            session={reviewModalSession} 
            onClose={() => setReviewModalSession(null)} 
            onSubmitReview={(revData) => {
              setBookedSessions(prev => prev.map(s => s.id === revData.sessionId ? { ...s, status: 'completed', rated: true } : s));
              if (profile) {
                updateProfileState({
                  ...profile,
                  xp: (profile.xp || 650) + 10,
                  walletBalance: (profile.walletBalance || 450) + 45,
                  lifetimeEarnings: (profile.lifetimeEarnings || 1850) + 45,
                  classesTaught: (profile.classesTaught || 24) + 1
                });
              }
              setReviewModalSession(null);
              alert(`🌟 Review submitted! Concept clarity rated ${revData.clarityRating}/5 ⭐ and +₹45 Escrow funds released to tutor's wallet!`);
            }} 
          />
        )}

        {/* TAB ROUTING */}
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'landing' && (
            <LandingScreen 
              setActiveTab={setActiveTab} 
              loginSimulated={loginSimulated} 
              loginAdmin={loginAdmin}
              testAccounts={testAccounts} 
              theme={theme} 
              setTheme={setTheme} 
              postLoginRedirectTab={postLoginRedirectTab}
              setPostLoginRedirectTab={setPostLoginRedirectTab}
            />
          )}
          {activeTab === 'feed' && <FeedScreen setActiveTab={setActiveTab} setActiveRoomId={setActiveRoomId} token={token} />}
          {(activeTab === 'dashboard' || activeTab === 'settings') && <SettingsScreen token={token} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} />}
          {activeTab === 'leaderboard' && <LeaderboardScreen token={token} onOpenPublicProfile={openPublicProfile} />}
          {activeTab === 'discover' && (
            <DiscoverScreen 
              token={token} 
              setActiveTab={setActiveTab} 
              setActiveChatId={setActiveChatId} 
              setChatPeer={setChatPeer} 
              onOpenPublicProfile={openPublicProfile} 
              onOpenBookingModal={(tutor) => setBookingModalTutor(tutor)}
            />
          )}
          {activeTab === 'sessions' && (
            <MySessionsScreen 
              bookedSessions={bookedSessions} 
              onLaunchClassroom={(s) => {
                setActiveClassroomSession(s);
                setActiveTab('classroom');
              }} 
              onOpenReviewModal={(s) => setReviewModalSession(s)} 
              setActiveTab={setActiveTab} 
            />
          )}
          {activeTab === 'classroom' && (
            <LiveClassroomScreen 
              session={activeClassroomSession} 
              onEndClassroom={(s) => {
                setActiveTab('sessions');
                setReviewModalSession(s);
              }} 
              localVideoRef={localVideoRef} 
              remoteVideoRef={remoteVideoRef} 
              toggleScreenShare={toggleScreenShare} 
              isScreenSharing={isScreenSharing} 
            />
          )}
          {activeTab === 'wallet' && <WalletScreen token={token} />}
          {activeTab === 'connections' && <ConnectionsScreen token={token} setActiveTab={setActiveTab} setActiveChatId={setActiveChatId} setChatPeer={setChatPeer} onOpenPublicProfile={openPublicProfile} />}
          {activeTab === 'doubts' && (
            <DoubtRoomsScreen 
              token={token} 
              activeRoomId={activeRoomId} 
              setActiveRoomId={setActiveRoomId} 
              socket={socket} 
              wsMessages={wsMessages} 
              setWsMessages={setWsMessages}
              startWebRtcCall={startWebRtcCall}
              webrtcCall={webrtcCall}
            />
          )}
          {activeTab === 'chat' && (
            <ChatScreen 
              token={token} 
              activeChatId={activeChatId} 
              setActiveChatId={setActiveChatId} 
              chatPeer={chatPeer} 
              setChatPeer={setChatPeer}
              socket={socket}
              wsMessages={wsMessages}
              setWsMessages={setWsMessages}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'reels' && (
            <ReelsScreen 
              token={token} 
              setActiveTab={setActiveTab}
              setActiveChatId={setActiveChatId}
              setChatPeer={setChatPeer}
              socket={socket}
              setWsMessages={setWsMessages}
            />
          )}
          {activeTab === 'contact' && (
            <ContactSupportScreen 
              token={token} 
              setActiveTab={setActiveTab}
              setActiveChatId={setActiveChatId}
              setChatPeer={setChatPeer}
              profile={profile}
            />
          )}
        </Suspense>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {profile && (
        <div className="mobile-bottom-nav" style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button 
            onClick={() => setActiveTab('landing')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'landing' ? 'var(--accent-primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
          >
            <Home size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('doubts')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'doubts' ? 'var(--accent-primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
          >
            <HelpCircle size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Doubts</span>
          </button>
          <button 
            onClick={() => setActiveTab('chat')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'chat' ? 'var(--accent-primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
          >
            <MessageSquare size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Chats</span>
          </button>
          <button 
            onClick={() => setActiveTab('reels')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'reels' ? 'var(--accent-primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
          >
            <Tv2 size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Reels</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
          >
            <Award size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}
