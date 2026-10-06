import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Activity, ArrowRight, Award, Bell, BookOpen, Building2, Calendar, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Compass, DollarSign, ExternalLink, Film, GraduationCap, Grid, HelpCircle, Home, Infinity, Laptop, LifeBuoy, LogIn, LogOut, Menu, MessageSquare, Moon, PanelLeftClose, PanelLeftOpen, Radio, Search, Settings, Shield, Sparkles, Star, Sun, Trophy, Tv2, User, UserCheck, UserPlus, Users, Video, Wallet, X, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../constants/avatars';
import { SidebarLink, SidebarCategoryLabel } from '../components/common/SidebarLink';
import { LoadingFallback } from '../components/common/LoadingFallback';
import { useToast } from '../context/ToastContext';
import { getWsUrl } from '../lib/api';

// Modals (Synchronous for instant popup interaction)
import { PublicProfileModal } from '../components/modals/PublicProfileModal';
import { UserListModal } from '../components/modals/UserListModal';
import { AvatarChangeModal } from '../components/modals/AvatarChangeModal';
import { PhotoPreviewModal } from '../components/modals/PhotoPreviewModal';
import { BookingModal } from '../components/modals/BookingModal';
import { ReviewSessionModal } from '../components/modals/ReviewSessionModal';

// Features (Lazy Loaded for High-Performance Code Splitting)
const LandingScreen = lazy(() => import('../features/landing/LandingScreen').then(m => ({ default: m.LandingScreen })));
const HomeHubScreen = lazy(() => import('../features/dashboard/HomeHubScreen').then(m => ({ default: m.HomeHubScreen })));
const ConnectionsScreen = lazy(() => import('../features/connections/ConnectionsScreen').then(m => ({ default: m.ConnectionsScreen })));
const ChatScreen = lazy(() => import('../features/chat/ChatScreen').then(m => ({ default: m.ChatScreen })));
const DoubtRoomsScreen = lazy(() => import('../features/doubts/DoubtRoomsScreen').then(m => ({ default: m.DoubtRoomsScreen })));
const RtcCallOverlay = lazy(() => import('../features/doubts/RtcCallOverlay').then(m => ({ default: m.RtcCallOverlay })));
const MySessionsScreen = lazy(() => import('../features/sessions/MySessionsScreen').then(m => ({ default: m.MySessionsScreen })));
const LiveClassroomScreen = lazy(() => import('../features/sessions/LiveClassroomScreen').then(m => ({ default: m.LiveClassroomScreen })));
const DiscoverScreen = lazy(() => import('../features/discover/DiscoverScreen').then(m => ({ default: m.DiscoverScreen })));
const WalletScreen = lazy(() => import('../features/wallet/WalletScreen').then(m => ({ default: m.WalletScreen })));
const LeaderboardScreen = lazy(() => import('../features/leaderboard/LeaderboardScreen').then(m => ({ default: m.LeaderboardScreen })));
const SettingsScreen = lazy(() => import('../features/settings/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const ClassHistoryScreen = lazy(() => import('../features/settings/ClassHistoryScreen').then(m => ({ default: m.ClassHistoryScreen })));
const CampusPrivacySettingsScreen = lazy(() => import('../features/settings/CampusPrivacySettingsScreen').then(m => ({ default: m.CampusPrivacySettingsScreen })));
const AdminConsoleScreen = lazy(() => import('../features/admin/AdminConsoleScreen').then(m => ({ default: m.AdminConsoleScreen })));
const AdminGateScreen = lazy(() => import('../features/admin/AdminGateScreen').then(m => ({ default: m.AdminGateScreen })));
const ContactSupportScreen = lazy(() => import('../features/support/ContactSupportScreen').then(m => ({ default: m.ContactSupportScreen })));
const FeedScreen = lazy(() => import('../features/support/FeedScreen').then(m => ({ default: m.FeedScreen })));

export function MainLayout() {
  const { user, profile, updateProfileState, token, loading, logout, loginSimulated, loginAdmin, testAccounts, isAdminMode, setIsAdminMode } = useAuth();
  const toast = useToast();
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
    if (saved && saved !== 'landing' && saved !== 'dashboard' && saved !== 'settings' && saved !== 'profile') {
      return saved;
    }
    const savedUser = localStorage.getItem('studyloop_user');
    return savedUser ? 'landing' : 'landing';
  });
  const [postLoginRedirectTab, setPostLoginRedirectTab] = useState(null);

  // URL LISTENER FOR /admin or hash routes (PROFESSIONAL ROUTE GUARD & RELOAD PERSISTENCE)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const rawHash = window.location.hash.toLowerCase().replace('#', '');
      const hash = rawHash.includes('?') ? rawHash.split('?')[0] : rawHash;
      if (path.includes('/admin') || hash === 'admin') {
        setActiveTab('admin');
      } else if (hash && hash.length > 0) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Auto-Join Shared Meeting Link on load
    const urlParams = new URLSearchParams(window.location.search);
    const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const hashParams = new URLSearchParams(hashQuery);
    const targetRoomId = urlParams.get('room') || urlParams.get('meetingId') || hashParams.get('room') || hashParams.get('meetingId');
    if (targetRoomId) {
      setActiveTab('doubts');
      setActiveRoomId(targetRoomId);
      startWebRtcCall(null, targetRoomId, 'Live Academic Study Session', 'Peer Learning');
    }

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
  const headerDropdownRef = useRef(null);
  const [sidebarMode, setSidebarMode] = useState(() => {
    return localStorage.getItem('studyloop_sidebar_mode') || 'rail';
  });

  useEffect(() => {
    localStorage.setItem('studyloop_sidebar_mode', sidebarMode);
  }, [sidebarMode]);
  
  const [viewingPublicProfile, setViewingPublicProfile] = useState(null);
  const [userListModalData, setUserListModalData] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close header dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerDropdownRef.current && !headerDropdownRef.current.contains(event.target)) {
        setShowHeaderDropdown(false);
      }
    };
    if (showHeaderDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHeaderDropdown]);

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
      const ws = new WebSocket(getWsUrl(token));

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

  const startWebRtcCall = async (targetUserId, doubtRoomId = 'doubt-room-live', roomTitle = 'Live Academic Doubt Session', subject = 'Engineering & CS', callMode = 'meeting', peerName = '', peerAvatar = '') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: callMode !== 'audio', audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setWebrtcCall({ peerId: targetUserId, isIncoming: false, roomId: doubtRoomId, roomTitle, subject, callMode, peerName, peerAvatar });
    } catch (e) {
      setWebrtcCall({ peerId: targetUserId, isIncoming: false, roomId: doubtRoomId, roomTitle, subject, callMode, peerName, peerAvatar, isSimulated: true });
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

  // --- DEDICATED SEPARATE FULL-PAGE SCREENS ---
  // 1. Student Scholar Profile (Original Grand Profile Screen — NO shorts/posts)
  if (activeTab === 'profile' || activeTab === 'dashboard' || activeTab === 'edit_profile') {
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

  // 2. 1:1 Live Classes & Teaching Studio (Dedicated Separate Page)
  if (activeTab === 'classes_history') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
          <ClassHistoryScreen setActiveTab={setActiveTab} />
        </div>
      </Suspense>
    );
  }

  // 3. Campus Privacy & Account Security Center (Dedicated Separate Page like LinkedIn)
  if (activeTab === 'privacy_settings' || activeTab === 'settings') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
          <CampusPrivacySettingsScreen setActiveTab={setActiveTab} />
        </div>
      </Suspense>
    );
  }

  return (
    <div className="studyloop-app-container">
      {/* ── 1. STUDYLOOP DUAL-MODE SIDEBAR (Rail View vs Expanded Categories View) ── */}
      {sidebarMode === 'rail' ? (
        /* MODE 1: SLEEK COMPACT RAIL (Exact User Image, Unstop Style) */
        <aside className="studyloop-rail-sidebar">
          {/* Brand Logo (Top Blue Button with SL) */}
          <div 
            className="studyloop-rail-logo"
            onClick={() => { setActiveTab('landing'); setActiveRoomId(null); }}
            title="StudyLoop Campus Home"
          >
            <span className="font-serif" style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.15rem' }}>SL</span>
          </div>

          {/* Expand Switch Button (Mode Toggle) */}
          <button
            className="studyloop-rail-mode-switch"
            onClick={() => setSidebarMode('expanded')}
            title="Expand Sidebar (Names & Categories)"
          >
            <PanelLeftOpen size={16} />
          </button>

          {/* 10 Vertical Navigation Rail Items (Exact Names & Icons from Image) */}
          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '3px' }}>
            {/* 1. Home */}
            <button
              className={`studyloop-rail-item ${(activeTab === 'landing' || activeTab === 'home') ? 'active' : ''}`}
              onClick={() => { setActiveTab('landing'); setActiveRoomId(null); }}
              title="Home"
            >
              <div className="rail-icon">
                <Home size={20} strokeWidth={(activeTab === 'landing' || activeTab === 'home') ? 2.3 : 1.9} />
              </div>
              <span className="rail-label">Home</span>
            </button>

            {/* 2. Network */}
            <button
              className={`studyloop-rail-item ${activeTab === 'connections' ? 'active' : ''}`}
              onClick={() => { setActiveTab('connections'); setActiveRoomId(null); }}
              title="Network"
            >
              <div className="rail-icon">
                <Users size={20} strokeWidth={activeTab === 'connections' ? 2.3 : 1.9} />
              </div>
              <span className="rail-label">Network</span>
            </button>

            {/* 3. Mentors */}
            <button
              className={`studyloop-rail-item ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => { setActiveTab('discover'); setActiveRoomId(null); }}
              title="Mentors"
            >
              <div className="rail-icon">
                <Search size={20} strokeWidth={activeTab === 'discover' ? 2.3 : 1.9} />
              </div>
              <span className="rail-label">Mentors</span>
            </button>

            {/* 4. Doubts */}
            <button
              className={`studyloop-rail-item ${activeTab === 'doubts' ? 'active' : ''}`}
              onClick={() => { setActiveTab('doubts'); setActiveRoomId(null); }}
              title="Live Doubt Rooms"
            >
              <div className="rail-icon" style={{ position: 'relative' }}>
                <HelpCircle size={20} strokeWidth={activeTab === 'doubts' ? 2.3 : 1.9} />
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-3px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 5px rgba(16, 185, 129, 0.9)'
                }} />
              </div>
              <span className="rail-label">Doubts</span>
            </button>

            {/* 5. Classes */}
            <button
              className={`studyloop-rail-item ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => { setActiveTab('sessions'); setActiveRoomId(null); }}
              title="Classes"
            >
              <div className="rail-icon">
                <Calendar size={20} strokeWidth={activeTab === 'sessions' ? 2.3 : 1.9} />
              </div>
              <span className="rail-label">Classes</span>
            </button>

            {/* 6. Chat */}
            <button
              className={`studyloop-rail-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chat'); setActiveRoomId(null); }}
              title="Chat"
            >
              <div className="rail-icon">
                <MessageSquare size={20} strokeWidth={activeTab === 'chat' ? 2.3 : 1.9} />
              </div>
              <span className="rail-label">Chat</span>
            </button>

            {/* 7. Ranks */}
            <button
              className={`studyloop-rail-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('leaderboard'); setActiveRoomId(null); }}
              title="Ranks"
            >
              <div className="rail-icon">
                <Trophy size={20} strokeWidth={activeTab === 'leaderboard' ? 2.3 : 1.9} />
              </div>
              <span className="rail-label">Ranks</span>
            </button>

            {/* 9. Wallet */}
            <button
              className={`studyloop-rail-item ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => { setActiveTab('wallet'); setActiveRoomId(null); }}
              title="Wallet"
            >
              <div className="rail-icon">
                <Wallet size={20} strokeWidth={activeTab === 'wallet' ? 2.3 : 1.9} />
              </div>
              <span className="rail-label">Wallet</span>
            </button>

            {/* 10. Support */}
            <button
              className={`studyloop-rail-item ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => { setActiveTab('contact'); }}
              title="Support"
            >
              <div className="rail-icon">
                <LifeBuoy size={20} strokeWidth={activeTab === 'contact' ? 2.3 : 1.9} />
              </div>
              <span className="rail-label">Support</span>
            </button>
          </nav>
        </aside>
      ) : (
        /* MODE 2: EXPANDED FULL SIDEBAR (Names beside icons + Categories) */
        <aside className="studyloop-expanded-sidebar">
          {/* Header with Brand & Collapse Button */}
          <div className="studyloop-expanded-header">
            <div 
              onClick={() => { setActiveTab('landing'); setActiveRoomId(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              title="StudyLoop Campus Home"
            >
              <div className="studyloop-expanded-logo">
                SL
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.15 }}>
                  Study<span style={{ color: 'var(--accent-primary)' }}>Loop</span>
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '1px' }}>
                  Campus Network
                </div>
              </div>
            </div>

            {/* Collapse button back to Unstop-style compact rail */}
            <button
              className="studyloop-expanded-close-btn"
              onClick={() => setSidebarMode('rail')}
              title="Collapse to compact rail (Unstop style)"
            >
              <PanelLeftClose size={17} />
            </button>
          </div>

          {/* Nav Links (Names next to Icons - no category headers) */}
          <div className="studyloop-expanded-nav">
            <button
              className={`studyloop-nav-row ${(activeTab === 'landing' || activeTab === 'home' || activeTab === 'feed') ? 'active' : ''}`}
              onClick={() => { setActiveTab('landing'); setActiveRoomId(null); }}
            >
              <div className="row-icon">
                <Home size={19} strokeWidth={(activeTab === 'landing' || activeTab === 'home' || activeTab === 'feed') ? 2.3 : 1.8} />
              </div>
              <span className="row-label">Home</span>
            </button>
            <button
              className={`studyloop-nav-row ${activeTab === 'connections' ? 'active' : ''}`}
              onClick={() => { setActiveTab('connections'); setActiveRoomId(null); }}
            >
              <div className="row-icon">
                <Users size={19} strokeWidth={activeTab === 'connections' ? 2.3 : 1.8} />
              </div>
              <span className="row-label">Network</span>
            </button>
            <button
              className={`studyloop-nav-row ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => { setActiveTab('discover'); setActiveRoomId(null); }}
            >
              <div className="row-icon">
                <Search size={19} strokeWidth={activeTab === 'discover' ? 2.3 : 1.8} />
              </div>
              <span className="row-label">Mentors</span>
            </button>
            <button
              className={`studyloop-nav-row ${activeTab === 'doubts' ? 'active' : ''}`}
              onClick={() => { setActiveTab('doubts'); setActiveRoomId(null); }}
            >
              <div className="row-icon" style={{ position: 'relative' }}>
                <HelpCircle size={19} strokeWidth={activeTab === 'doubts' ? 2.3 : 1.8} />
                <span style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 5px rgba(16, 185, 129, 0.9)'
                }} />
              </div>
              <span className="row-label">Doubts</span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '1px 6px',
                borderRadius: '999px',
                marginLeft: 'auto'
              }}>Live</span>
            </button>
            <button
              className={`studyloop-nav-row ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => { setActiveTab('sessions'); setActiveRoomId(null); }}
            >
              <div className="row-icon">
                <Calendar size={19} strokeWidth={activeTab === 'sessions' ? 2.3 : 1.8} />
              </div>
              <span className="row-label">Classes</span>
            </button>
            <button
              className={`studyloop-nav-row ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chat'); setActiveRoomId(null); }}
            >
              <div className="row-icon">
                <MessageSquare size={19} strokeWidth={activeTab === 'chat' ? 2.3 : 1.8} />
              </div>
              <span className="row-label">Chat</span>
            </button>
            <button
              className={`studyloop-nav-row ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('leaderboard'); setActiveRoomId(null); }}
            >
              <div className="row-icon">
                <Trophy size={19} strokeWidth={activeTab === 'leaderboard' ? 2.3 : 1.8} />
              </div>
              <span className="row-label">Ranks</span>
            </button>
            <button
              className={`studyloop-nav-row ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => { setActiveTab('wallet'); setActiveRoomId(null); }}
            >
              <div className="row-icon">
                <Wallet size={19} strokeWidth={activeTab === 'wallet' ? 2.3 : 1.8} />
              </div>
              <span className="row-label">Wallet</span>
            </button>
            <button
              className={`studyloop-nav-row ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => { setActiveTab('contact'); }}
            >
              <div className="row-icon">
                <LifeBuoy size={19} strokeWidth={activeTab === 'contact' ? 2.3 : 1.8} />
              </div>
              <span className="row-label">Support</span>
            </button>
          </div>
        </aside>
      )}

      {/* ── 2. STUDYLOOP MAIN CONTENT CANVAS WITH STICKY TOP BAR ── */}
      <div className="studyloop-main-area">
        {/* StudyLoop Top Bar (Breadcrumb, Search Box, Campus Tag, Notifications, Me Profile) */}
        <header className="studyloop-top-bar">
          {/* Breadcrumb path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span 
              onClick={() => { setActiveTab('landing'); setActiveRoomId(null); }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
              title="Home"
            >
              <Home size={15} />
            </span>
            <span style={{ color: 'var(--border-color)' }}>/</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
              {activeTab === 'landing' || activeTab === 'home' ? 'Campus Feed' : activeTab}
            </span>
          </div>

          {/* Centered Search Box */}
          <div className="studyloop-search-box">
            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Search doubts, notes, mentors, OA problems..." 
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.84rem',
                color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Right Top Bar Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Campus Badge (Like Unstop "For Business" badge) */}
            <div 
              title={`Verified ${profile?.college || 'IIT Madras'} Campus Hub`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: '1px solid rgba(0, 102, 255, 0.18)',
                cursor: 'pointer'
              }}
            >
              <GraduationCap size={13} />
              <span>{profile?.college ? (profile.college.length > 14 ? profile.college.substring(0, 14) + '..' : profile.college) : 'IIT Madras'}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* Chat Direct Shortcut */}
            <button
              onClick={() => { setActiveTab('chat'); setActiveRoomId(null); }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Messaging & Chats"
            >
              <MessageSquare size={17} />
            </button>

            {/* User Profile Avatar Drawer */}
            {profile && (
              <div style={{ position: 'relative' }} ref={headerDropdownRef}>
                <button 
                  onClick={() => setShowHeaderDropdown(prev => !prev)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 4px',
                    borderRadius: '999px'
                  }}
                  title="My Profile & Settings"
                >
                  <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                    <img 
                      src={getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl)} 
                      alt="Avatar" 
                      onError={(e) => { e.target.src = getDefaultAvatarByGender(profile?.gender); }}
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        border: '1.5px solid var(--accent-primary)', 
                        objectFit: 'cover',
                        backgroundColor: 'var(--bg-tertiary)'
                      }} 
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      border: '1.5px solid var(--bg-secondary)'
                    }} />
                  </div>
                  <ChevronDown size={13} style={{ color: 'var(--text-muted)', transform: showHeaderDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>

                {/* Profile Drawer */}
                {showHeaderDropdown && (
                  <div className="header-profile-dropdown" style={{ top: '48px', right: 0 }}>
                    {/* ── Profile Header Card ── */}
                    <div
                      style={{
                        padding: '14px 14px 12px 14px',
                        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                      onClick={() => { setShowHeaderDropdown(false); setActiveTab('profile'); }}
                      title="Click to open your Full Student Profile"
                    >
                      {/* Avatar row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Avatar with square-rounded squircle styling & online dot */}
                        <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
                          <img
                            src={getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl)}
                            alt="Avatar"
                            style={{
                              display: 'block',
                              width: '50px',
                              height: '50px',
                              borderRadius: '14px',
                              border: '2px solid var(--accent-primary)',
                              objectFit: 'cover'
                            }}
                          />
                          <span style={{
                            position: 'absolute',
                            bottom: '-2px',
                            right: '-2px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#10b981',
                            border: '2px solid var(--bg-secondary)',
                            display: 'block',
                            boxShadow: '0 0 4px rgba(16, 185, 129, 0.6)'
                          }} />
                        </div>

                        {/* Name + college + connections */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {profile?.fullName || 'Student Learner'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {profile?.college || 'IIT Madras'}
                          </div>
                          {/* Connections chip on the square photo profile */}
                          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              color: 'var(--accent-primary)',
                              backgroundColor: 'var(--accent-light)',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              border: '1px solid rgba(0,102,255,0.18)'
                            }}>
                              <Users size={10} /> {profile?.connections || profile?.followersCount || 148} Connections
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Streak + XP row */}
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1, padding: '6px 8px', borderRadius: '10px', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '0.95rem' }}>🔥</span>
                          <div>
                            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{profile?.streak || 7} Day</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Streak</div>
                          </div>
                        </div>
                        <div style={{ flex: 2, padding: '6px 10px', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.62rem', fontWeight: 700, marginBottom: '4px' }}>
                            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Zap size={10} style={{ color: 'var(--accent-primary)' }} /> Lvl {profile?.level || 4}
                            </span>
                            <span style={{ color: 'var(--accent-primary)' }}>{profile?.xp || 662} XP</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(100, ((profile?.xp || 662) % 1000) / 10)}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '999px' }} />
                          </div>
                        </div>
                      </div>

                      {/* View Full Profile button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowHeaderDropdown(false); setActiveTab('profile'); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          width: '100%',
                          marginTop: '10px',
                          padding: '9px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'var(--accent-gradient)',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 10px rgba(0,102,255,0.3)',
                          transition: 'opacity 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        View Full Profile <ChevronRight size={14} />
                      </button>
                    </div>

                    {/* Dedicated Navigation: Only Profile, Classes History & Settings (Unrelated Wallet/Leaderboard removed) */}
                    <div style={{ padding: '0.5rem' }}>
                      <button 
                        onClick={() => { setShowHeaderDropdown(false); setActiveTab('profile'); }} 
                        className="dropdown-nav-item"
                      >
                        <User size={16} style={{ color: 'var(--accent-primary)' }} /> 
                        <span>Profile & Portfolio</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, color: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)', padding: '1px 6px', borderRadius: '4px' }}>
                          Verified
                        </span>
                      </button>

                      <button 
                        onClick={() => { setShowHeaderDropdown(false); setActiveTab('classes_history'); }} 
                        className="dropdown-nav-item"
                      >
                        <Calendar size={16} style={{ color: '#10b981' }} /> 
                        <span>1:1 Classes & Teaching History</span>
                      </button>

                      <button 
                        onClick={() => { setShowHeaderDropdown(false); setActiveTab('privacy_settings'); }} 
                        className="dropdown-nav-item"
                      >
                        <Shield size={16} style={{ color: 'var(--accent-primary)' }} /> 
                        <span>Campus Privacy & Security</span>
                      </button>

                      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.35rem 0.5rem' }} />

                      <button 
                        onClick={() => { setShowHeaderDropdown(false); setShowLogoutConfirm(true); }} 
                        className="dropdown-nav-item logout"
                      >
                        <LogOut size={16} /> Sign Out of Campus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* ── 3. SCROLLABLE CONTENT BODY (Spacious Canvas) ── */}
        <main className="studyloop-content-body">

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
            user={user}
            profile={profile}
            socket={socket}
            token={token}
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
              toast.success(`🎉 1:1 Session Booked on ${newS.topic}! Payment of ₹${newS.fee} is safely held in Escrow.`);
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
              toast.success(`🌟 Review submitted! Concept clarity rated ${revData.clarityRating}/5 ⭐ and +₹45 Escrow funds released to tutor's wallet!`);
            }} 
          />
        )}

        {/* LOGOUT CONFIRMATION MODAL */}
        {showLogoutConfirm && (
          <div className="modal-confirm-overlay" onClick={() => setShowLogoutConfirm(false)}>
            <div className="modal-confirm-card" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <LogOut size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Confirm Sign Out?
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Are you sure you want to sign out of StudyLoop?
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid var(--border-color)'
              }}>
                <Shield size={16} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
                <span>Your active sessions, earned balance, and doubt history remain safely saved.</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    logout();
                  }}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB ROUTING */}
        <Suspense fallback={<LoadingFallback />}>
          {(activeTab === 'landing' || activeTab === 'home' || activeTab === 'feed') && (
            <HomeHubScreen 
              setActiveTab={setActiveTab}
              setActiveRoomId={setActiveRoomId}
              openPublicProfile={openPublicProfile}
              onOpenPublicProfile={openPublicProfile}
              startWebRtcCall={startWebRtcCall}
              onOpenBookingModal={(tutor) => setBookingModalTutor(tutor)}
              bookedSessions={bookedSessions}
              onLaunchClassroom={(s) => {
                setActiveClassroomSession(s);
                setActiveTab('classroom');
              }}
              theme={theme}
              setTheme={setTheme}
            />
          )}
          {activeTab === 'leaderboard' && <LeaderboardScreen token={token} onOpenPublicProfile={openPublicProfile} />}
          {(activeTab === 'dashboard' || activeTab === 'profile') && <SettingsScreen token={token} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} />}
          {activeTab === 'classes_history' && <ClassHistoryScreen setActiveTab={setActiveTab} />}
          {(activeTab === 'privacy_settings' || activeTab === 'settings') && <CampusPrivacySettingsScreen setActiveTab={setActiveTab} />}
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
          {activeTab === 'connections' && <ConnectionsScreen token={token} setActiveTab={setActiveTab} setActiveChatId={setActiveChatId} setChatPeer={setChatPeer} onOpenPublicProfile={openPublicProfile} startWebRtcCall={startWebRtcCall} />}
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
            <div key="chat-screen" className="screen-slide-in" style={{ display: 'contents' }}>
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
                startWebRtcCall={startWebRtcCall}
              />
            </div>
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
      </div>

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
            onClick={() => setActiveTab('connections')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'connections' ? 'var(--primary-color)' : 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
          >
            <Users size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Network</span>
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
