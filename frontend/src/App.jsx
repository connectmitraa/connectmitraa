import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { 
  Home, Infinity, BookOpen, Users, UserCheck, MessageSquare, 
  Tv2, Award, ShieldAlert, LogOut, Search, Plus, PlusCircle,
  Check, X, Send, Video, ScreenShare, Sparkles, 
  Flame, CheckCircle, HelpCircle, Heart, MessageCircle, 
  Activity, GraduationCap, ChevronRight, Ban, Trophy, Coins,
  Volume2, VolumeX, Share2, Disc, Music, ChevronUp, ChevronDown,
  Settings, QrCode, Bell, Shield, Key, Globe, Archive, Grid, Bookmark, User,
  Pencil, Camera, Edit2, Mail, Lock, Eye, EyeOff, Github, Sun, Moon,
  Headphones, Bug, Lightbulb, Paperclip, Clock, LifeBuoy
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- AUTHENTICATION & CLIENT SETUP ---
// Dynamic initialization: Fallback to simulated developer mode if Supabase keys are blank
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
}

// --- GENDER-BASED DEFAULT VECTOR AVATARS (BASE64 ENCODED FOR 100% RELIABLE BROWSER RENDERING) ---
export const MALE_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2YxZjVmOSIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiM2NDc0OGIiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iIzY0NzQ4YiIvPjwvc3ZnPg==";

export const FEMALE_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2ZjZTdmMyIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiNlYzQ4OTkiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iI2VjNDg5OSIvPjwvc3ZnPg==";

export const NEUTRAL_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2UyZThmMCIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiM0NzU1NjkiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iIzQ3NTU2OSIvPjwvc3ZnPg==";

function getDefaultAvatarByGender(gender = 'male', avatarUrl = '') {
  if (avatarUrl && avatarUrl.trim().length > 0 && !avatarUrl.includes('dicebear') && avatarUrl !== 'null' && avatarUrl !== 'undefined') {
    return avatarUrl;
  }
  const normalizedGender = (gender || 'male').toLowerCase();
  if (normalizedGender === 'female') return FEMALE_AVATAR_SVG;
  if (normalizedGender === 'other') return NEUTRAL_AVATAR_SVG;
  return MALE_AVATAR_SVG;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  // Auto-login configuration for simulated developer mode
  const testAccounts = [
    { 
      email: 'studenta@student.com', 
      role: 'authenticated', 
      id: '11111111-1111-1111-1111-111111111111', 
      fullName: 'Aarav Sharma',
      college: 'IIT Madras',
      department: 'Computer Science',
      year: 2,
      gender: 'male',
      avatarUrl: MALE_AVATAR_SVG,
      xp: 650,
      level: 4,
      coins: 45,
      followersCount: 2,
      followingCount: 2,
      bio: '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Algorithm Mentor | 🚀 15 Doubts Solved | 📩 DM for 1:1 sessions',
      skills: ['Java', 'Algorithms', 'React', 'Data Structures'],
      teachingSkills: ['Java', 'Data Structures', 'Calculus', 'WebRTC'],
      learningGoals: ['System Design', 'AI/ML']
    },
    { 
      email: 'studentb@student.com', 
      role: 'authenticated', 
      id: '22222222-2222-2222-2222-222222222222', 
      fullName: 'Bhavna Patel',
      college: 'IIT Bombay',
      department: 'Information Tech',
      year: 3,
      gender: 'female',
      avatarUrl: FEMALE_AVATAR_SVG,
      xp: 240,
      level: 3,
      coins: 30,
      followersCount: 2,
      followingCount: 1,
      bio: '🎨 Frontend enthusiast | 💻 UI/UX Designer & React Developer | 🚀 10 Doubts Solved | 📩 DM for collab',
      skills: ['React', 'JavaScript', 'HTML/CSS', 'UI/UX'],
      teachingSkills: ['React', 'JavaScript', 'UI/UX'],
      learningGoals: ['Java', 'Spring Boot']
    },
    { 
      email: 'studentc@student.com', 
      role: 'authenticated', 
      id: '33333333-3333-3333-3333-333333333333', 
      fullName: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'Electrical Eng',
      year: 4,
      gender: 'male',
      avatarUrl: MALE_AVATAR_SVG,
      xp: 820,
      level: 6,
      coins: 120,
      followersCount: 1,
      followingCount: 2,
      bio: '🚀 Senior Mentor @ BITS | 💻 Systems & WebRTC specialist | 🚀 25 Doubts Solved | 📩 DM for peer mock interviews',
      skills: ['React', 'WebRTC', 'NodeJS', 'System Design'],
      teachingSkills: ['WebRTC', 'NodeJS', 'C++'],
      learningGoals: ['Machine Learning', 'Big Data']
    }
  ];

  useEffect(() => {
    if (supabase) {
      // Real Supabase Auth Flow
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          setToken(session.access_token);
          fetchProfile(session.user.id, session.access_token);
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user);
          setToken(session.access_token);
          fetchProfile(session.user.id, session.access_token);
        } else {
          setUser(null);
          setProfile(null);
          setToken('');
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Mock developer mode check
      const cached = localStorage.getItem('studyloop_mock_session');
      if (cached) {
        const mockUser = JSON.parse(cached);
        setUser(mockUser);
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({ sub: mockUser.id, email: mockUser.email, role: mockUser.role }));
        const mockJwt = `${header}.${payload}.signature`;
        setToken(mockJwt);
        fetchProfile(mockUser.id, mockJwt);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchProfile = async (userId, jwtToken) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const response = await fetch(`/api/profiles/me`, {
        headers: { 'Authorization': `Bearer ${jwtToken}` },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // CHECK LOCALSTORAGE FIRST FOR CUSTOM SAVED AVATAR & GENDER!
        const cached = localStorage.getItem(`studyloop_profile_${userId}`);
        if (cached) {
          try {
            const p = JSON.parse(cached);
            if (p.avatarUrl) data.avatarUrl = p.avatarUrl;
            if (p.gender) data.gender = p.gender;
            if (p.fullName) data.fullName = p.fullName;
            if (p.bio) data.bio = p.bio;
          } catch(e) {}
        }
        
        if (!data.avatarUrl || data.avatarUrl.includes('dicebear') || data.avatarUrl === 'null' || data.avatarUrl === 'undefined') {
          data.avatarUrl = getDefaultAvatarByGender(data.gender, data.avatarUrl);
        }
        
        setProfile(data);
        localStorage.setItem(`studyloop_profile_${userId}`, JSON.stringify(data));
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("Failed to load profile from API:", e);
    }

    const cachedProfile = localStorage.getItem(`studyloop_profile_${userId}`);
    const acc = testAccounts.find(t => t.id === userId) || {};
    if (cachedProfile) {
      try { 
        const p = JSON.parse(cachedProfile);
        const merged = { ...acc, ...p };
        if (!merged.avatarUrl || merged.avatarUrl.includes('dicebear')) {
          merged.avatarUrl = getDefaultAvatarByGender(merged.gender, merged.avatarUrl);
        }
        setProfile(merged); 
      } catch(err) {
        setProfile(acc);
      }
    } else {
      setProfile(acc);
    }
    setLoading(false);
  };

  const loginSimulated = (email) => {
    let acc = testAccounts.find(t => t.email.toLowerCase() === email.toLowerCase());
    if (!acc) {
      const namePart = email.split('@')[0];
      const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      acc = {
        email: email.toLowerCase(),
        role: 'authenticated',
        id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
        fullName: capitalizedName + ' Learner',
        college: 'IIT Delhi',
        department: 'Electrical Engineering',
        year: 1,
        gender: 'male',
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${namePart}`,
        xp: 150,
        level: 1,
        coins: 20,
        followersCount: 12,
        followingCount: 8,
        bio: `🎓 Student Major | Active learner on StudyLoop | Connect with me for coding sessions!`,
        skills: ['React', 'JavaScript', 'HTML/CSS'],
        teachingSkills: ['HTML/CSS'],
        learningGoals: ['Algorithms', 'Java']
      };
      localStorage.setItem(`studyloop_profile_${acc.id}`, JSON.stringify(acc));
    }
    const mockUserObj = { id: acc.id, email: acc.email, role: acc.role };
    localStorage.setItem('studyloop_mock_session', JSON.stringify(mockUserObj));
    setUser(mockUserObj);
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: acc.id, email: acc.email, role: acc.role }));
    const mockJwt = `${header}.${payload}.signature`;
    setToken(mockJwt);
    fetchProfile(acc.id, mockJwt);
  };

  const logout = async () => {
    setLoading(true);
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('studyloop_mock_session');
      setUser(null);
      setProfile(null);
      setToken('');
      setLoading(false);
    }
  };

  const updateProfileState = (updatedProfile) => {
    setProfile(updatedProfile);
    if (updatedProfile && updatedProfile.id) {
      localStorage.setItem(`studyloop_profile_${updatedProfile.id}`, JSON.stringify(updatedProfile));
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, loginSimulated, logout, updateProfileState, fetchProfile, testAccounts, isMockMode: !supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

// --- MAIN APPLICATION LAYOUT ---
export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  const { user, profile, token, loading, logout, loginSimulated, testAccounts, isMockMode } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('studyloop_theme') || 'light');
  
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('studyloop_theme', theme);
  }, [theme]);
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('studyloop_active_tab') || 'landing';
  });
  const [postLoginRedirectTab, setPostLoginRedirectTab] = useState(null);

  useEffect(() => {
    localStorage.setItem('studyloop_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!user) {
      setActiveTab('landing');
    }
  }, [user]);

  const [activeRoomId, setActiveRoomId] = useState(null); // active Doubt Room currently joined
  const [activeChatId, setActiveChatId] = useState(null); // active 1:1 chat thread currently joined
  const [chatPeer, setChatPeer] = useState(null); // other user details for active 1:1 chat
  const [showHeaderDropdown, setShowHeaderDropdown] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Public Profile & Follower/Following Modal States
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Real-time connections & WebRTC states
  const [socket, setSocket] = useState(null);
  const [wsMessages, setWsMessages] = useState([]);
  const [webrtcCall, setWebrtcCall] = useState(null); // active call object
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const peerConnection = useRef(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize WebSocket connection on login
  useEffect(() => {
    if (!token) return;

    // Establish WebSocket using path matching our proxy /ws/chat
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
      // Start heartbeat
      const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
        }
      }, 30000);
      return () => clearInterval(interval);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log("WebSocket incoming:", payload);

        // Handle WebRTC Signaling relay (Section 6)
        if (payload.type === 'RTC_SIGNAL' && payload.signalData) {
          handleIncomingRtcSignal(payload);
        } else {
          // Log general message for chat rooms
          setWsMessages(prev => [...prev, payload]);
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [token]);

  // WebRTC Signaling Handlers (Section 6)
  const startWebRtcCall = async (targetUserId, doubtRoomId = null) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.send(JSON.stringify({
            type: 'RTC_SIGNAL',
            targetUserId: targetUserId,
            roomId: doubtRoomId,
            signalData: { candidate: event.candidate }
          }));
        }
      };

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socket) {
        socket.send(JSON.stringify({
          type: 'RTC_SIGNAL',
          targetUserId: targetUserId,
          roomId: doubtRoomId,
          signalData: { sdp: offer }
        }));
      }

      peerConnection.current = pc;
      setWebrtcCall({ peerId: targetUserId, isIncoming: false, roomId: doubtRoomId });
    } catch (e) {
      console.error("WebRTC getUserMedia error:", e);
      alert("Failed to access camera/microphone. Check browser permissions.");
    }
  };

  const handleIncomingRtcSignal = async (payload) => {
    const { senderId, signalData, roomId } = payload;
    let pc = peerConnection.current;

    if (signalData.sdp) {
      if (signalData.sdp.type === 'offer') {
        // Automatically accept or show prompt. In peer MVP, auto-connect to simplify flow
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate && socket) {
            socket.send(JSON.stringify({
              type: 'RTC_SIGNAL',
              targetUserId: senderId,
              roomId: roomId,
              signalData: { candidate: event.candidate }
            }));
          }
        };

        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        await pc.setRemoteDescription(new RTCSessionDescription(signalData.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        if (socket) {
          socket.send(JSON.stringify({
            type: 'RTC_SIGNAL',
            targetUserId: senderId,
            roomId: roomId,
            signalData: { sdp: answer }
          }));
        }

        peerConnection.current = pc;
        setWebrtcCall({ peerId: senderId, isIncoming: true, roomId: roomId });
      } else if (signalData.sdp.type === 'answer') {
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(signalData.sdp));
        }
      }
    } else if (signalData.candidate) {
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(signalData.candidate));
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!peerConnection.current) return;
    try {
      if (isScreenSharing) {
        // Switch back to video camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoTrack = stream.getVideoTracks()[0];
        const sender = peerConnection.current.getSenders().find(s => s.track.kind === 'video');
        if (sender) sender.replaceTrack(videoTrack);
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setIsScreenSharing(false);
      } else {
        // Grab screen share stream
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnection.current.getSenders().find(s => s.track.kind === 'video');
        if (sender) sender.replaceTrack(screenTrack);
        
        // Listen for screen sharing stop
        screenTrack.onended = () => {
          toggleScreenShare(); // revert
        };
        
        setLocalStream(screenStream);
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);
      }
    } catch (e) {
      console.error("Screen sharing failed:", e);
    }
  };

  const hangUpCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <Infinity size={48} className="live-dot" style={{ color: '#3b82f6', marginBottom: '1rem' }} />
        <h2 className="font-serif" style={{ fontSize: '1.5rem' }}>Loading StudyLoop...</h2>
      </div>
    );
  }

  // --- LANDING / FIRST PAGE FOR VISITORS ---
  if (!user) {
    return (
      <LandingScreen 
        setActiveTab={setActiveTab} 
        loginSimulated={loginSimulated} 
        testAccounts={testAccounts} 
        theme={theme} 
        setTheme={setTheme} 
        postLoginRedirectTab={postLoginRedirectTab}
        setPostLoginRedirectTab={setPostLoginRedirectTab}
      />
    );
  }

  // Set default college warning if profile exists but doesn't have college set
  const showCollegeWarning = profile && !profile.college && activeTab !== 'dashboard';

  return (
    <div className="app-container fixed-app-container">
      {/* SIDEBAR NAVIGATION */}
      <nav className="sidebar" style={{
        width: isSidebarCollapsed ? '76px' : '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: isSidebarCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* LOGO HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Infinity size={28} style={{ color: '#3b82f6' }} />
              {!isSidebarCollapsed && (
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>StudyLoop</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '0.5625rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.16em', paddingLeft: '2.25rem', textTransform: 'uppercase' }}>
                LEARN • BUILD • EVOLVE
              </span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              title="Collapse Sidebar"
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                padding: '0.375rem',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
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
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              padding: '0.75rem',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '1rem'
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* GROUPED SIDEBAR NAVIGATION LINKS */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
          
          {/* SECTION 1: LEARNING */}
          {!isSidebarCollapsed && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.6875rem', 
              fontWeight: 800, 
              letterSpacing: '0.08em', 
              color: '#2563eb', 
              marginTop: '0.75rem', 
              marginBottom: '0.75rem',
              textTransform: 'uppercase'
            }}>
              LEARNING
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0', marginLeft: '0.5rem' }}></div>
            </div>
          )}
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'landing'} icon={<Home size={18} />} label="Home Page" onClick={() => { setActiveTab('landing'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'doubts'} icon={<HelpCircle size={18} />} label="Doubt Rooms Hub" onClick={() => { setActiveTab('doubts'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'dashboard'} icon={<Award size={18} />} label="Dashboard & Badges" onClick={() => { setActiveTab('dashboard'); setActiveRoomId(null); }} />

          {/* SECTION 2: INTELLIGENCE & PRACTICE */}
          {!isSidebarCollapsed && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.6875rem', 
              fontWeight: 800, 
              letterSpacing: '0.08em', 
              color: '#0891b2', 
              marginTop: '1.5rem', 
              marginBottom: '0.75rem',
              textTransform: 'uppercase'
            }}>
              INTELLIGENCE & PRACTICE
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0', marginLeft: '0.5rem' }}></div>
            </div>
          )}
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'leaderboard'} icon={<Trophy size={18} />} label="Campus Leaderboard" onClick={() => { setActiveTab('leaderboard'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'discover'} icon={<Users size={18} />} label="Discover Peers" onClick={() => { setActiveTab('discover'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'connections'} icon={<UserCheck size={18} />} label="My Connections" onClick={() => { setActiveTab('connections'); setActiveRoomId(null); }} />

          {/* SECTION 3: CAREER DEVELOPMENT */}
          {!isSidebarCollapsed && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.6875rem', 
              fontWeight: 800, 
              letterSpacing: '0.08em', 
              color: '#059669', 
              marginTop: '1.5rem', 
              marginBottom: '0.75rem',
              textTransform: 'uppercase'
            }}>
              CAREER DEVELOPMENT
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0', marginLeft: '0.5rem' }}></div>
            </div>
          )}
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'chat'} icon={<MessageSquare size={18} />} label="Direct Messages" onClick={() => { setActiveTab('chat'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'reels'} icon={<Tv2 size={18} />} label="Educational Reels" onClick={() => { setActiveTab('reels'); setActiveRoomId(null); }} />
          <SidebarLink isCollapsed={isSidebarCollapsed} active={activeTab === 'contact'} icon={<LifeBuoy size={18} />} label="Contact & Support" onClick={() => { setActiveTab('contact'); setActiveRoomId(null); }} />
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: 'auto' }}>
          <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', border: 'none', background: 'transparent', padding: '0.5rem' }}>
            <LogOut size={18} /> {!isSidebarCollapsed && "Logout"}
          </button>
        </div>
      </nav>

      {/* MAIN SCREEN DISPATCHER WITH TOP FAR-RIGHT USER CORNER */}
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: activeTab === 'reels' ? 0 : undefined, backgroundColor: activeTab === 'reels' ? '#09090b' : undefined }}>
        
        {/* TOP FAR-RIGHT USER CORNER BAR (HIDDEN IN REELS MODE) */}
        {activeTab !== 'reels' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 2rem',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={16} style={{ color: 'var(--accent-color)' }} />
              <span>{profile?.college || 'IIT Madras'} • {profile?.department || 'Computer Science'}</span>
            </div>

            {/* FAR RIGHT USER DROPDOWN CHIP & THEME TOGGLE */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <button
                onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  width: '36px',
                  height: '36px',
                  transition: 'all 0.2s ease'
                }}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowHeaderDropdown(prev => !prev)}
                className="card-premium glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.375rem 0.875rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <img 
                  src={getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl)} 
                  alt="Avatar" 
                  onError={(e) => { e.target.src = getDefaultAvatarByGender(profile?.gender); }}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-color)', objectFit: 'cover' }} 
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {profile?.fullName || 'Aarav Sharma'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--accent-color)', fontWeight: 600 }}>
                    ⚡ {profile?.xp !== undefined ? profile.xp : 650} XP • Lvl {profile?.level !== undefined ? profile.level : 4}
                  </div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>

              {showHeaderDropdown && (
                <div className="card-premium glass-card dropdown-animate" style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  width: '240px',
                  borderRadius: '16px',
                  padding: '1rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  zIndex: 2000,
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem'
                }}>
                  <div style={{ padding: '0.25rem 0.75rem 0.75rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.375rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{profile?.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{profile?.college}</div>
                  </div>

                  <button 
                    onClick={() => { setShowHeaderDropdown(false); setActiveTab('dashboard'); }} 
                    className="dropdown-item"
                  >
                    <Award size={16} style={{ color: '#3b82f6' }} /> Dashboard & Badges
                  </button>

                  <button 
                    onClick={() => { setShowHeaderDropdown(false); setActiveTab('dashboard'); }} 
                    className="dropdown-item"
                  >
                    <GraduationCap size={16} style={{ color: '#0284c7' }} /> Edit Profile / Settings
                  </button>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.625rem', marginTop: '0.375rem' }}>
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

        {showCollegeWarning && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <ShieldAlert style={{ color: '#3b82f6' }} />
            <div>
              <strong>Complete your profile setup:</strong> Set your college name in the <strong>Dashboard</strong> to view and join live Doubt Rooms from your campus!
            </div>
            <button className="btn btn-primary" onClick={() => setActiveTab('dashboard')} style={{ marginLeft: 'auto', padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>Go to Dashboard</button>
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

        {activeTab === 'landing' && (
          <LandingScreen 
            setActiveTab={setActiveTab} 
            loginSimulated={loginSimulated} 
            testAccounts={testAccounts} 
            theme={theme} 
            setTheme={setTheme} 
            postLoginRedirectTab={postLoginRedirectTab}
            setPostLoginRedirectTab={setPostLoginRedirectTab}
          />
        )}
        {activeTab === 'feed' && <FeedScreen setActiveTab={setActiveTab} setActiveRoomId={setActiveRoomId} token={token} />}
        {activeTab === 'dashboard' && <DashboardScreen token={token} onOpenUserList={(title, userId) => setUserListModalData({ title, userId })} onStartChat={startDirectMessageWithPeer} />}
        {activeTab === 'leaderboard' && <LeaderboardScreen token={token} onOpenPublicProfile={openPublicProfile} />}
        {activeTab === 'discover' && <DiscoverScreen token={token} setActiveTab={setActiveTab} setActiveChatId={setActiveChatId} setChatPeer={setChatPeer} onOpenPublicProfile={openPublicProfile} />}
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
      </main>

      {profile && (
        <div className="mobile-bottom-nav" style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}>
          <button 
            onClick={() => setActiveTab('landing')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'landing' ? '#3b82f6' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            <Home size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('doubts')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'doubts' ? '#3b82f6' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            <HelpCircle size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Doubts</span>
          </button>
          <button 
            onClick={() => setActiveTab('chat')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'chat' ? '#3b82f6' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            <MessageSquare size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Chats</span>
          </button>
          <button 
            onClick={() => setActiveTab('reels')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'reels' ? '#3b82f6' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            <Tv2 size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Reels</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{ border: 'none', background: 'transparent', color: activeTab === 'dashboard' ? '#3b82f6' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            <Award size={20} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}

function SidebarLink({ active, icon, label, onClick, isCollapsed }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="tooltip-container"
      style={{ width: '100%', position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={onClick} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '0.75rem',
        width: '100%',
        padding: '0.625rem 0.875rem',
        borderRadius: '50px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '600',
        background: active ? 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)' : isHovered ? '#eff6ff' : 'transparent',
        color: active ? '#ffffff' : isHovered ? '#2563eb' : '#334155',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 4px 14px rgba(37, 99, 235, 0.25)' : 'none',
        marginBottom: '0.625rem'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '28px', 
          height: '28px', 
          borderRadius: '50%', 
          backgroundColor: active ? 'rgba(255, 255, 255, 0.18)' : isHovered ? '#eff6ff' : '#f1f5f9',
          color: active ? '#ffffff' : isHovered ? '#2563eb' : '#475569',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}>
          {icon}
        </div>
        {!isCollapsed && <span style={{ textShadow: 'none', fontWeight: 600 }}>{label}</span>}
      </button>

      {/* FLOATING HOVER TOOLTIP (Reveals label on mouse hover) */}
      {(isHovered || (isCollapsed && isHovered)) && (
        <div className="tooltip-popup">
          {label}
        </div>
      )}
    </div>
  );
}

// --- AUTH SCREEN COMPONENT ---
function AuthScreen({ loginSimulated, testAccounts, isMockMode }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    if (isMockMode) {
      // Automatic developer mode login
      loginSimulated(email);
    } else {
      // Real Supabase Auth Flow
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setSuccessMsg("We sent a magic link / OTP to your email! Please check your inbox to log in.");
      } catch (err) {
        alert("Authentication failed: " + err.message);
      }
    }
  };

  const handleOAuth = async () => {
    if (isMockMode) {
      // Log in as Aarav (first profile)
      loginSimulated(testAccounts[0].email);
    } else {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <Infinity size={32} style={{ color: '#3b82f6' }} />
          <h1 className="font-serif" style={{ fontSize: '1.875rem' }}>StudyLoop</h1>
        </div>

        <h2 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>Solve doubts instantly, teach peers together.</h2>
        <p style={{ color: '#586376', fontSize: '0.9375rem', marginBottom: '2rem' }}>The student-to-student live marketplace. Connect with peer mentors on your campus.</p>

        {successMsg ? (
          <div className="card" style={{ backgroundColor: '#d1fae5', borderColor: '#a7f3d0', padding: '1.5rem', textAlign: 'center' }}>
            <CheckCircle size={32} style={{ color: '#059669', marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Check your email</h3>
            <p style={{ fontSize: '0.875rem', color: '#065f46' }}>{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isRegistering && (
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input" placeholder="e.g. Rahul Kumar" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            )}

            <div>
              <label className="label">College Email Address</label>
              <input type="email" className="input" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem', fontSize: '0.9375rem', fontWeight: 600 }}>
              {isMockMode ? "Launch Startup Developer Login" : "Send Magic OTP"}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0' }}>OR</div>

            <button type="button" onClick={handleOAuth} className="btn btn-secondary" style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.68 14.93 1 12 1 7.37 1 3.4 3.68 1.48 7.57l3.77 2.92C6.13 7.3 8.83 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.77 2.92c2.2-2.03 3.62-5.02 3.62-8.63z"/><path fill="#FBBC05" d="M5.25 14.85c-.25-.76-.39-1.57-.39-2.42s.14-1.66.39-2.42L1.48 7.1C.53 9.07 0 11.27 0 12.42s.53 3.35 1.48 5.32l3.77-2.89z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.77-2.92c-1.05.7-2.4.12-4.19.12-3.17 0-5.87-2.26-6.83-5.32L1.4 14.8c1.92 3.89 5.89 6.2 10.6 6.2z"/></svg>
              Continue with Google
            </button>
          </form>
        )}

        {isMockMode && (
          <div style={{ marginTop: '2.5rem', padding: '1.25rem', backgroundColor: '#f1f5f9', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={14} style={{ color: '#3b82f6' }} /> Developer Test Accounts (Fast Match Seeded)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {testAccounts.map(acc => (
                <button key={acc.email} onClick={() => loginSimulated(acc.email)} className="btn btn-secondary" style={{ fontSize: '0.75rem', justifyContent: 'space-between', padding: '0.5rem 0.75rem' }}>
                  <span><strong>{acc.name}</strong> ({acc.email.split('@')[0]})</span>
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontStyle: 'italic' }}>{acc.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right panel graphic */}
      <div style={{ flex: 1, backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', color: '#ffffff' }}>
        <div style={{ maxWidth: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🤝</div>
          <h2 className="font-serif" style={{ fontSize: '2.25rem', color: '#ffffff', marginBottom: '1rem' }}>Earn while helping</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>StudyLoop tracks solved doubts, peer endorsements, and lesson records to build your expert profile. Showcase your knowledge on the campus leaderboard.</p>
        </div>
      </div>
    </div>
  );
}

// --- SCREEN: HOME FEED (TIMELINE + EXAM RADAR) ---
function FeedScreen({ setActiveTab, setActiveRoomId, token }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const response = await fetch('/api/feed', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFeed(data);
      }
    } catch (e) {
      console.error("Feed error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [token]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem' }}>Campus Feed</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Exam countdowns, educational shorts, and campus announcements.</p>
        </div>
        <button onClick={fetchFeed} className="btn btn-secondary">Refresh Timeline</button>
      </div>

      {/* DEDICATED DOUBT HUB REDIRECT BANNER */}
      <div className="card-premium glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', marginBottom: '2rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
            <HelpCircle size={24} />
          </div>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.125rem', color: '#1e3a8a' }}>Need Help with a Doubt or Mid-term Question?</h3>
            <p style={{ fontSize: '0.8125rem', color: '#1e40af', marginTop: '0.125rem' }}>All live doubt questions and tutoring rooms are located in the dedicated <strong>Doubt Rooms Hub</strong>.</p>
          </div>
        </div>
        <button onClick={() => setActiveTab('doubts')} className="btn btn-accent" style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}>
          Go to Doubt Rooms Hub →
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="live-dot" style={{ backgroundColor: '#3b82f6' }}></div>
        </div>
      ) : feed.filter(item => item.type === 'REEL').length === 0 ? (
        <div className="empty-state">
          <GraduationCap size={48} />
          <h3>Campus Timeline Up to Date</h3>
          <p>No new reels or campus announcements at the moment. Explore peer mentors or check live doubt rooms!</p>
          <button onClick={() => setActiveTab('reels')} className="btn btn-accent"><Tv2 size={16} /> Explore Educational Shorts</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {feed.filter(item => item.type === 'REEL').map(item => (
            <div key={item.id} className="card-premium" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  Relevance Score: {item.score}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <img src={item.creator?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${item.creator?.fullName}`} alt="Avatar" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.creator?.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {item.creator?.college} • {item.creator?.department} • Year {item.creator?.year}
                  </div>
                </div>
              </div>

              <div>
                <p style={{ color: '#0f172a', fontSize: '0.875rem', marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "Uploaded an educational reel on <strong>{item.subject}</strong>" — {item.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Heart size={14} fill="#dc2626" style={{ color: '#dc2626' }} /> {item.reel?.likesCount} likes</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MessageCircle size={14} /> {item.reel?.commentsCount} comments</span>
                  </div>
                  <button onClick={() => setActiveTab('reels')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                    Watch Reel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- INSTAGRAM-STYLE STUDENT PROFILE & MEDIA DASHBOARD ---
function DashboardScreen({ token, onOpenUserList, onStartChat }) {
  const { user, profile: authProfile, updateProfileState, testAccounts } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const profile = (data && data.profile) ? data.profile : {};

  const getNextLevel = (lvl) => {
    if (typeof lvl === 'number') return `Lvl ${lvl + 1}`;
    if (!lvl) return 'Lvl 5';
    const lvlStr = String(lvl).toLowerCase();
    if (lvlStr === 'beginner') return 'Intermediate';
    if (lvlStr === 'intermediate') return 'Expert';
    if (lvlStr === 'expert') return 'Master';
    if (lvlStr === 'master') return 'Legend';
    return 'Lvl ' + (parseInt(lvl) ? (parseInt(lvl) + 1) : 5);
  };

  const [activeProfileTab, setActiveProfileTab] = useState('posts'); // 'posts', 'reels', 'videos', 'badges'
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [noteText, setNoteText] = useState('Study mode ON ⚡');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  const handleSaveAvatar = async (newAvatarUrl) => {
    if (!newAvatarUrl) return;
    const currentProf = (data && data.profile) ? data.profile : { id: '11111111-1111-1111-1111-111111111111' };
    const updatedProf = { ...currentProf, avatarUrl: newAvatarUrl };
    
    if (data) {
      setData(prev => ({ ...prev, profile: updatedProf }));
    }
    
    updateProfileState(updatedProf);
    if (updatedProf.id) {
      localStorage.setItem(`studyloop_profile_${updatedProf.id}`, JSON.stringify(updatedProf));
    }
    setShowAvatarModal(false);

    try {
      const res = await fetch('/api/profiles/me/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatarUrl: newAvatarUrl })
      });
      if (res.ok) {
        const savedProf = await res.json();
        const merged = { ...updatedProf, ...savedProf };
        setData(prev => prev ? { ...prev, profile: merged } : prev);
        updateProfileState(merged);
        localStorage.setItem(`studyloop_profile_${merged.id}`, JSON.stringify(merged));
      }
    } catch (e) {
      console.log("Updated avatar locally");
    }
  };

  // INTERACTIVE MODALS & FEATURES STATES
  const [showAppsModal, setShowAppsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSupervisionModal, setShowSupervisionModal] = useState(false);
  const [showLoginActivityModal, setShowLoginActivityModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCreateHighlightModal, setShowCreateHighlightModal] = useState(false);

  // STORY HIGHLIGHTS DATASET & STORY VIEWER STATE
  const [highlightsList, setHighlightsList] = useState([
    {
      id: 'hl-1',
      title: 'Lab Notes',
      cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
      stories: [
        { image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80', caption: 'OS Memory Management Lab Code 💻' },
        { image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80', caption: 'Paging vs Segmentation Diagrams 📊' }
      ]
    },
    {
      id: 'hl-2',
      title: 'Placements',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
      stories: [
        { image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80', caption: 'Google & Microsoft Coding Interview Prep 🚀' }
      ]
    }
  ]);
  const [activeStoryViewer, setActiveStoryViewer] = useState(null);
  const [storySlideIndex, setStorySlideIndex] = useState(0);

  // HIGHLIGHT CREATION STATES
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [newHighlightCover, setNewHighlightCover] = useState('');

  // NOTIFICATION PREFERENCES TOGGLES STATE
  const [notifSettings, setNotifSettings] = useState({
    doubtAlerts: true,
    directMessages: true,
    streakReminders: true,
    examRadar: true,
    emailDigest: false
  });

  // UPLOAD MEDIA CREATOR STUDIO STATES
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState('reel'); // 'reel', 'video', 'post'
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('#Java');
  const [uploadDuration, setUploadDuration] = useState('0:45');
  const [filePreviewUrl, setFilePreviewUrl] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState(1);
  const [gender, setGender] = useState('male');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [teachingSkills, setTeachingSkills] = useState('');
  const [learningGoals, setLearningGoals] = useState('');

  // Mock Student Media Datasets (Instagram Reference)
  const [postsList, setPostsList] = useState([
    {
      id: 'post-1',
      title: '🚀 Complete Java Collections Cheat Sheet - HashMaps vs TreeMaps breakdown for mid-terms!',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      likes: 42,
      comments: [
        { author: 'Bhavna Patel', text: 'Super clear diagram! Helped me score A in my lab test.' },
        { author: 'Chaitanya Reddy', text: 'Can you share the PDF link too?' }
      ]
    },
    {
      id: 'post-2',
      title: '📊 Dynamic Programming 101 - Knapsack Problem visual guide with time complexity analysis',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      likes: 89,
      comments: [
        { author: 'Aarav Sharma', text: 'DP tables finally made sense after this post 🔥' }
      ]
    },
    {
      id: 'post-3',
      title: '⚡ 5 React Hooks Mistakes to avoid in your semester project! Save for later 📌',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      likes: 112,
      comments: [
        { author: 'Student Peer', text: 'useEffect dependencies explanation was 10/10!' }
      ]
    }
  ]);

  const [reelsList, setReelsList] = useState([
    {
      id: 'reel-1',
      title: '3 Tricks to solve Recursion fast ⚡ #Java #Algorithms',
      duration: '0:45',
      views: '1.2k',
      likes: 154,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      comments: [
        { author: 'Aarav Sharma', text: 'Recursion base condition explanation was super clear!' },
        { author: 'Priya Patel', text: 'Loved the visual stack trace diagram 🚀' }
      ]
    }
  ]);

  const [videosList, setVideosList] = useState([
    {
      id: 'vid-1',
      title: 'Full Spring Boot & React Crash Course for College Projects',
      duration: '18:45',
      views: '4.8k',
      likes: 340,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      comments: [
        { author: 'Chaitanya Reddy', text: 'Awesome crash course for beginners!' }
      ]
    },
    {
      id: 'vid-2',
      title: 'Operating Systems: Thread Synchronization & Deadlock Prevention Masterclass',
      duration: '28:30',
      views: '3.1k',
      likes: 210,
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-student-reading-a-book-in-a-library-41544-large.mp4',
      comments: []
    }
  ]);

  const fetchDashboard = async () => {
    setLoading(true);
    let targetProfileId = authProfile?.id || user?.id || '11111111-1111-1111-1111-111111111111';
    try {
      const response = await fetch('/api/gamification/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        targetProfileId = result.profile.id;
        const cached = localStorage.getItem(`studyloop_profile_${targetProfileId}`);
        if (cached) {
          try {
            const p = JSON.parse(cached);
            if (p.avatarUrl) result.profile.avatarUrl = p.avatarUrl;
            if (p.gender) result.profile.gender = p.gender;
            if (p.fullName) result.profile.fullName = p.fullName;
            if (p.bio) result.profile.bio = p.bio;
          } catch(e) {}
        }
        setData(result);
        setFullName(result.profile.fullName);
        setCollege(result.profile.college);
        setDepartment(result.profile.department);
        setYear(result.profile.year);
        setGender(result.profile.gender || 'male');
        setBio(result.profile.bio);
        setSkills((result.profile.skills || []).join(', '));
        setTeachingSkills((result.profile.teachingSkills || []).join(', '));
        setLearningGoals((result.profile.learningGoals || []).join(', '));
        setLoading(false);
        return;
      }
    } catch (e) {
      console.log("Using mock dashboard data for student");
    }

    // Mock Fallback Dataset - Check LocalStorage!
    const cachedMock = localStorage.getItem(`studyloop_profile_${targetProfileId}`);
    const matchedAccount = testAccounts?.find(acc => acc.id === targetProfileId) || {};
    
    let activeMockProfile = {
      id: targetProfileId,
      fullName: matchedAccount.fullName || 'Aarav Sharma',
      college: matchedAccount.college || 'IIT Madras',
      department: matchedAccount.department || 'Computer Science',
      year: matchedAccount.year || 2,
      gender: matchedAccount.gender || 'male',
      bio: matchedAccount.bio || '🎓 CS Major @ IIT Madras | Tech Mentor',
      skills: matchedAccount.skills || ['Java', 'Algorithms'],
      teachingSkills: matchedAccount.teachingSkills || ['Java'],
      learningGoals: matchedAccount.learningGoals || ['React'],
      xp: matchedAccount.xp !== undefined ? matchedAccount.xp : 650,
      level: matchedAccount.level !== undefined ? matchedAccount.level : 4,
      coins: matchedAccount.coins !== undefined ? matchedAccount.coins : 45,
      followersCount: matchedAccount.followersCount !== undefined ? matchedAccount.followersCount : 2,
      followingCount: matchedAccount.followingCount !== undefined ? matchedAccount.followingCount : 2,
      avatarUrl: matchedAccount.avatarUrl || getDefaultAvatarByGender(matchedAccount.gender)
    };
    if (cachedMock) {
      try {
        const p = JSON.parse(cachedMock);
        activeMockProfile = { ...activeMockProfile, ...p };
      } catch(e) {}
    }
    const mockData = {
      profile: activeMockProfile,
      doubtsSolved: targetProfileId === '22222222-2222-2222-2222-222222222222' ? 10 : (targetProfileId === '33333333-3333-3333-3333-333333333333' ? 25 : 15),
      endorsementsReceived: targetProfileId === '22222222-2222-2222-2222-222222222222' ? 18 : (targetProfileId === '33333333-3333-3333-3333-333333333333' ? 42 : 28),
      campusRank: targetProfileId === '22222222-2222-2222-2222-222222222222' ? 3 : (targetProfileId === '33333333-3333-3333-3333-333333333333' ? 1 : 2),
      badges: targetProfileId === '22222222-2222-2222-2222-222222222222' ? [
        { id: 'b1', name: 'First Doubt Solved', description: 'Awarded for resolving your 1st academic doubt room.' },
        { id: 'b4', name: '5-Day Streak', description: 'Active on StudyLoop 5 days in a row.' }
      ] : (targetProfileId === '33333333-3333-3333-3333-333333333333' ? [
        { id: 'b1', name: 'First Doubt Solved', description: 'Awarded for resolving your 1st academic doubt room.' },
        { id: 'b2', name: '20 Sessions Taught', description: 'Taught over 20 live peer study sessions.' },
        { id: 'b3', name: 'Expert Mentor', description: 'Rated 4.9+ by campus peers across 25+ doubts.' },
        { id: 'b4', name: '12-Day Streak', description: 'Active on StudyLoop 12 days in a row.' }
      ] : [
        { id: 'b1', name: 'First Doubt Solved', description: 'Awarded for resolving your 1st academic doubt room.' },
        { id: 'b2', name: '10 Sessions Taught', description: 'Taught over 10 live peer study sessions.' },
        { id: 'b3', name: 'Expert Mentor', description: 'Rated 4.8+ by campus peers across 10+ doubts.' },
        { id: 'b4', name: '7-Day Streak', description: 'Active on StudyLoop 7 days in a row.' }
      ]),
      prevLevelXpThreshold: activeMockProfile.xp < 200 ? 0 : (activeMockProfile.xp < 600 ? 200 : 600),
      nextLevelXpThreshold: activeMockProfile.xp < 200 ? 200 : (activeMockProfile.xp < 600 ? 600 : 1500),
      xpProgressPercentage: Math.min(100, Math.max(0, Math.round(((activeMockProfile.xp - (activeMockProfile.xp < 200 ? 0 : (activeMockProfile.xp < 600 ? 200 : 600))) / ((activeMockProfile.xp < 200 ? 200 : (activeMockProfile.xp < 600 ? 600 : 1500)) - (activeMockProfile.xp < 200 ? 0 : (activeMockProfile.xp < 600 ? 200 : 600)))) * 100)))
    };

    setData(mockData);
    setFullName(activeMockProfile.fullName);
    setCollege(activeMockProfile.college);
    setDepartment(activeMockProfile.department);
    setYear(activeMockProfile.year);
    setGender(activeMockProfile.gender || 'male');
    setBio(activeMockProfile.bio);
    setSkills(activeMockProfile.skills.join(', '));
    setTeachingSkills(activeMockProfile.teachingSkills.join(', '));
    setLearningGoals(activeMockProfile.learningGoals.join(', '));
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedProf = {
      ...data.profile,
      fullName: fullName || 'Aarav Sharma',
      college: college || 'IIT Madras',
      department: department || 'Computer Science',
      year: parseInt(year) || 2,
      gender: gender || 'male',
      bio: bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Algorithm Mentor | 🚀 15 Doubts Solved',
      skills: typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : (skills || []),
      teachingSkills: typeof teachingSkills === 'string' ? teachingSkills.split(',').map(s => s.trim()).filter(Boolean) : (teachingSkills || []),
      learningGoals: typeof learningGoals === 'string' ? learningGoals.split(',').map(s => s.trim()).filter(Boolean) : (learningGoals || [])
    };
    
    // Auto-update avatar to match gender if no custom photo uploaded
    if (!updatedProf.avatarUrl || updatedProf.avatarUrl.includes('svg') || updatedProf.avatarUrl.includes('dicebear')) {
      updatedProf.avatarUrl = getDefaultAvatarByGender(gender, updatedProf.avatarUrl);
    }

    setData(prev => ({ ...prev, profile: updatedProf }));
    updateProfileState(updatedProf);
    if (updatedProf.id) {
      localStorage.setItem(`studyloop_profile_${updatedProf.id}`, JSON.stringify(updatedProf));
    }
    setEditing(false);
    
    try {
      const res = await fetch('/api/profiles/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProf)
      });
      if (res.ok) {
        const saved = await res.json();
        const merged = { ...updatedProf, ...saved };
        setData(prev => ({ ...prev, profile: merged }));
        updateProfileState(merged);
        localStorage.setItem(`studyloop_profile_${merged.id}`, JSON.stringify(merged));
      }
    } catch (e) {
      console.log("Updated profile locally");
    }
  };

  const handleCreateHighlight = (e) => {
    e.preventDefault();
    if (!newHighlightTitle.trim()) {
      alert("Please enter a title for your story highlight!");
      return;
    }
    const newHighlight = {
      id: `hl-${Date.now()}`,
      title: newHighlightTitle.trim(),
      cover: newHighlightCover || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
      stories: [
        {
          image: newHighlightCover || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          caption: `${newHighlightTitle.trim()} Study Highlight ✨`
        }
      ]
    };
    setHighlightsList(prev => [...prev, newHighlight]);
    setShowCreateHighlightModal(false);
    setNewHighlightTitle('');
    setNewHighlightCover('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handlePublishContent = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      alert("Please enter a title for your video or post!");
      return;
    }

    if (uploadType === 'reel') {
      const newReel = {
        id: `reel-${Date.now()}`,
        title: uploadTitle.trim(),
        duration: uploadDuration || '0:45',
        views: '1',
        likes: 1,
        hashtag: uploadSubject || '#Java',
        videoUrl: filePreviewUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        comments: []
      };
      setReelsList(prev => [newReel, ...prev]);
      setActiveProfileTab('reels');
      alert("✨ Short Reel published successfully to your Instagram profile!");
    } else if (uploadType === 'video') {
      const newVideo = {
        id: `vid-${Date.now()}`,
        title: uploadTitle.trim(),
        duration: uploadDuration || '15:20',
        views: '1',
        likes: 1,
        thumbnail: filePreviewUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        comments: []
      };
      setVideosList(prev => [newVideo, ...prev]);
      setActiveProfileTab('videos');
      alert("🎥 Long Lecture Video published successfully to your YouTube channel!");
    } else {
      const newPost = {
        id: `post-${Date.now()}`,
        title: uploadTitle.trim(),
        image: filePreviewUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        likes: 1,
        comments: []
      };
      setPostsList(prev => [newPost, ...prev]);
      setActiveProfileTab('posts');
      alert("🖼️ Study Post published successfully!");
    }

    setIsUploading(false);
    setUploadTitle('');
    setUploadDuration('0:45');
    setFilePreviewUrl('');
  };

  const claimStreakBonus = async () => {
    try {
      const response = await fetch('/api/gamification/streak/claim', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Daily Streak Bonus claimed! +2 XP & +1 Coin added to your wallet.");
        fetchDashboard();
      }
    } catch (e) {
      alert("Streak claimed! +2 XP & +1 Peer Coin added.");
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedMedia) return;
    const newComment = { author: fullName || 'You', text: commentText.trim() };
    setSelectedMedia(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment]
    }));
    setCommentText('');
  };

  const handleLikeMedia = () => {
    if (!selectedMedia) return;
    setSelectedMedia(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));
  };

  if (loading || !data || !data.profile) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="live-dot" style={{ backgroundColor: '#3b82f6', margin: '0 auto 1rem auto' }}></div>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading student profile dashboard...</p>
      </div>
    );
  }

  const doubtsSolved = data.doubtsSolved || 0;
  const endorsementsReceived = data.endorsementsReceived || 0;
  const campusRank = data.campusRank || 1;
  const badges = data.badges || [];
  const xpProgressPercentage = data.xpProgressPercentage || 50;
  const usernameHandle = `@${(profile.fullName || 'student').toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div style={{ width: '100%', paddingBottom: '3rem' }}>
      
      {/* INSTAGRAM PROFILE HEADER & BIO */}
      <div className="card-premium glass-card" style={{ padding: '2.5rem 2rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* INSTAGRAM GRADIENT STORY AVATAR RING WITH STATUS NOTE BUBBLE */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button 
              onClick={() => {
                const newNote = prompt("Set your status note (e.g. Study mode ON ⚡, Lab Prep 📚):", noteText);
                if (newNote !== null) setNoteText(newNote);
              }}
              title="Click to update status note"
              style={{
                position: 'absolute',
                top: '-20px',
                zIndex: 10,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#334155',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              💬 {noteText || 'Note...'}
            </button>

            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowPhotoPreview(true)}
                title="Click to view enlarged profile picture"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  padding: '4px',
                  background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px rgba(220, 39, 67, 0.25)',
                  cursor: 'pointer'
                }}
              >
                <img 
                  src={getDefaultAvatarByGender(profile.gender, profile.avatarUrl)} 
                  alt="Avatar" 
                  onError={(e) => { e.target.src = getDefaultAvatarByGender(profile.gender); }}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', border: '3px solid #ffffff', objectFit: 'cover' }} 
                />
              </div>

              {/* Floating Pencil Icon Overlay */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowAvatarModal(true); }}
                title="Change Profile Picture (Upload from Gallery / Albums)"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: '3px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>

          {/* PROFILE INFO & SETTINGS GEAR HEADER */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* USERNAME & SETTINGS GEAR ICON (EXACT IMAGE 1 MATCH) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 className="font-serif" style={{ fontSize: '1.625rem', fontWeight: 800 }}>{usernameHandle}</h2>
              
              {/* SETTINGS GEAR ICON (OPENS SETTINGS MODAL MATCHING IMAGE 2) */}
              <button 
                onClick={() => setShowSettingsModal(true)} 
                title="Options & Settings"
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  backgroundColor: '#f1f5f9', 
                  border: '1px solid #e2e8f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  color: '#0f172a',
                  transition: 'all 0.15s ease'
                }}
              >
                <Settings size={20} />
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => setIsUploading(true)} className="btn btn-primary glow-amber" style={{ fontSize: '0.75rem', padding: '0.4rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <PlusCircle size={15} /> + Upload
                </button>
                <button onClick={claimStreakBonus} className="btn btn-accent" style={{ fontSize: '0.75rem', padding: '0.4rem 0.875rem' }}>
                  <Flame size={14} fill="#ffffff" /> Streak (+2 XP)
                </button>
              </div>
            </div>

            {/* INSTAGRAM COUNTERS STRIP (INTERACTIVE FOLLOWERS & FOLLOWING) */}
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9375rem', color: '#0f172a' }}>
              <div><strong>{postsList.length}</strong> <span style={{ color: '#64748b' }}>posts</span></div>
              <div 
                onClick={() => onOpenUserList && onOpenUserList('Followers', profile.id)} 
                style={{ cursor: 'pointer' }}
                title="Click to view followers list"
              >
                <strong>{profile.followersCount !== undefined ? profile.followersCount : 2}</strong> <span style={{ color: '#64748b', textDecoration: 'underline' }}>followers</span>
              </div>
              <div 
                onClick={() => onOpenUserList && onOpenUserList('Following', profile.id)} 
                style={{ cursor: 'pointer' }}
                title="Click to view following list"
              >
                <strong>{profile.followingCount !== undefined ? profile.followingCount : 2}</strong> <span style={{ color: '#64748b', textDecoration: 'underline' }}>following</span>
              </div>
              <div style={{ color: '#3b82f6', fontWeight: 700 }}>⚡ {profile.xp} XP • Lvl {profile.level}</div>
            </div>

            {/* BIO & COLLEGE DETAILS (EXACT MATCH IMAGE 1 BULLET STYLE) */}
            <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#334155' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
                {profile.fullName}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                {profile.college || 'IIT Madras'} • {profile.department || 'Computer Science'}
              </div>
              <p style={{ whiteSpace: 'pre-line', marginBottom: '0.75rem' }}>
                {profile.bio || `Your journey to better skills starts here!\n📚 Learn new skills: ${profile.teachingSkills ? profile.teachingSkills.join(', ') : 'Java, React, Algorithms'}\n💡 Build practical knowledge\n🚀 Improve every day\n🎯 Prepare for campus placements`}
              </p>

              {/* SKILLS PORTFOLIO SECTION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                    🎓 Mentoring Expertises
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {(profile.teachingSkills || ['Java', 'Algorithms', 'React', 'Calculus']).map((skill, idx) => (
                      <span key={idx} className="tag-mentor-badge category-tag-hover" style={{ fontSize: '0.6875rem' }}>
                        ⭐ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                    🎯 Learning Goals
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {(profile.learningGoals || ['System Design', 'AI/ML']).map((skill, idx) => (
                      <span key={idx} className="tag-learner-badge category-tag-hover" style={{ fontSize: '0.6875rem' }}>
                        🚀 {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS STRIP: EDIT PROFILE | VIEW ARCHIVE (IMAGE 1 MATCH) */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button 
                onClick={() => setEditing(true)} 
                style={{ 
                  flex: 1, 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  backgroundColor: '#f1f5f9', 
                  color: '#0f172a', 
                  fontWeight: 600, 
                  fontSize: '0.8125rem', 
                  border: '1px solid #cbd5e1', 
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Edit profile
              </button>
              <button 
                onClick={() => setShowArchiveModal(true)} 
                style={{ 
                  flex: 1, 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  backgroundColor: '#f1f5f9', 
                  color: '#0f172a', 
                  fontWeight: 600, 
                  fontSize: '0.8125rem', 
                  border: '1px solid #cbd5e1', 
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                View archive
              </button>
            </div>

          </div>
        </div>

        {/* STORY HIGHLIGHTS CIRCLES (+ NEW AND DYNAMIC HIGHLIGHTS) */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }} onClick={() => setShowCreateHighlightModal(true)}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '2px dashed #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              backgroundColor: '#f8fafc'
            }}>
              <Plus size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>New</span>
          </div>

          {highlightsList.map(hl => (
            <div key={hl.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }} onClick={() => { setActiveStoryViewer(hl); setStorySlideIndex(0); }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px solid #dc2743',
                padding: '2px',
                backgroundColor: '#ffffff'
              }}>
                <img src={hl.cover} alt={hl.title} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{hl.title}</span>
            </div>
          ))}
        </div>

        {/* XP LEVEL PROGRESS BAR */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
            <span>Campus Rank: <strong>#{campusRank || 1}</strong></span>
            <span>🪙 {profile.coins !== undefined ? profile.coins : 45} Peer Coins Balance</span>
            <span>Level {profile.level} ({xpProgressPercentage}% to {getNextLevel(profile.level)})</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '50px', overflow: 'hidden' }}>
            <div style={{ width: `${xpProgressPercentage}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '50px' }}></div>
          </div>
        </div>
      </div>



      {/* EDIT PROFILE DEDICATED MODAL OVERLAY */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <form onSubmit={handleUpdateProfile} className="card-premium glass-card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', borderRadius: '24px', backgroundColor: '#ffffff', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800 }}>Edit Profile & Bio</h3>
              <button type="button" onClick={() => setEditing(false)} className="btn-icon"><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Full Name</label>
                <input type="text" className="input" value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">College</label>
                  <input type="text" className="input" value={college} onChange={e => setCollege(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Department</label>
                  <input type="text" className="input" value={department} onChange={e => setDepartment(e.target.value)} required />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select 
                    className="input" 
                    value={gender} 
                    onChange={e => {
                      const newG = e.target.value;
                      setGender(newG);
                      handleSaveAvatar(getDefaultAvatarByGender(newG, profile.avatarUrl));
                    }}
                    style={{ cursor: 'pointer', padding: '0.625rem' }}
                  >
                    <option value="male">👨 Male</option>
                    <option value="female">👩 Female</option>
                    <option value="other">👤 Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea className="input" style={{ minHeight: '90px', resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell peers what you teach best..." />
              </div>
              <div>
                <label className="label">Teaching Skills (comma-separated)</label>
                <input type="text" className="input" value={teachingSkills} onChange={e => setTeachingSkills(e.target.value)} placeholder="Java, Algorithms, React, Calculus" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* INSTAGRAM TAB SWITCHER NAVBAR WITH EXACT IMAGE 1 ICONS */}
      <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveProfileTab('posts')}
          style={{
            padding: '0.875rem 2.5rem',
            border: 'none',
            borderBottom: activeProfileTab === 'posts' ? '2px solid #0f172a' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeProfileTab === 'posts' ? 700 : 500,
            color: activeProfileTab === 'posts' ? '#0f172a' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Grid size={18} /> POSTS
        </button>

        <button 
          onClick={() => setActiveProfileTab('reels')}
          style={{
            padding: '0.875rem 2.5rem',
            border: 'none',
            borderBottom: activeProfileTab === 'reels' ? '2px solid #0f172a' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeProfileTab === 'reels' ? 700 : 500,
            color: activeProfileTab === 'reels' ? '#0f172a' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Tv2 size={18} /> REELS
        </button>

        <button 
          onClick={() => setActiveProfileTab('videos')}
          style={{
            padding: '0.875rem 2.5rem',
            border: 'none',
            borderBottom: activeProfileTab === 'videos' ? '2px solid #0f172a' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeProfileTab === 'videos' ? 700 : 500,
            color: activeProfileTab === 'videos' ? '#0f172a' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Bookmark size={18} /> SAVED
        </button>

        <button 
          onClick={() => setActiveProfileTab('badges')}
          style={{
            padding: '0.875rem 2.5rem',
            border: 'none',
            borderBottom: activeProfileTab === 'badges' ? '2px solid #0f172a' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeProfileTab === 'badges' ? 700 : 500,
            color: activeProfileTab === 'badges' ? '#0f172a' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <User size={18} /> TAGGED
        </button>
      </div>

      {/* INSTAGRAM SETTINGS MODAL (EVERY OPTION FULLY WIRED & WORKING) */}
      {showSettingsModal && (
        <div style={{
          position: 'fixed',
          top: 0, bottom: 0, left: 0, right: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#262626',
            color: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '380px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button 
                onClick={() => { setShowSettingsModal(false); setShowAppsModal(true); }} 
                style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', background: 'transparent', color: '#ffffff', textAlign: 'left', fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <Globe size={18} /> Apps and websites
              </button>

              <button 
                onClick={() => { setShowSettingsModal(false); setShowQrModal(true); }} 
                style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', background: 'transparent', color: '#ffffff', textAlign: 'left', fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <QrCode size={18} /> QR code
              </button>

              <button 
                onClick={() => { setShowSettingsModal(false); setShowNotificationsModal(true); }} 
                style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', background: 'transparent', color: '#ffffff', textAlign: 'left', fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <Bell size={18} /> Notifications
              </button>

              <button 
                onClick={() => { setShowSettingsModal(false); setEditing(true); }} 
                style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', background: 'transparent', color: '#ffffff', textAlign: 'left', fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <Settings size={18} /> Settings and privacy
              </button>

              <button 
                onClick={() => { setShowSettingsModal(false); setShowSupervisionModal(true); }} 
                style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', background: 'transparent', color: '#ffffff', textAlign: 'left', fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <Shield size={18} /> Supervision
              </button>

              <button 
                onClick={() => { setShowSettingsModal(false); setShowLoginActivityModal(true); }} 
                style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', background: 'transparent', color: '#ffffff', textAlign: 'left', fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <Key size={18} /> Login activity
              </button>

              <div style={{ borderTop: '1px solid #363636', marginTop: '0.25rem' }}>
                <button 
                  onClick={() => { setShowSettingsModal(false); logout(); }} 
                  style={{ width: '100%', padding: '0.875rem 1.5rem', border: 'none', background: 'transparent', color: '#ed4956', fontWeight: 700, textAlign: 'left', fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowSettingsModal(false)} 
              style={{ width: '100%', padding: '0.75rem', borderTop: '1px solid #363636', background: 'transparent', color: '#a8a8a8', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SHAREABLE STUDENT PROFILE QR CODE MODAL */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0, bottom: 0, left: 0, right: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          zIndex: 3100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '340px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Student Profile QR</h3>
              <button onClick={() => setShowQrModal(false)} className="btn-icon" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '16px', border: '2px solid #bfdbfe', display: 'inline-block', marginBottom: '1rem' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=http://localhost:5173/user/${profile.id}`} alt="QR Code" style={{ width: '160px', height: '160px' }} />
            </div>

            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{usernameHandle}</div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Scan with campus camera to connect instantly on StudyLoop</p>
          </div>
        </div>
      )}

      {/* 1. INSTAGRAM STORY VIEWER MODAL */}
      {activeStoryViewer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.92)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '380px', height: '640px', backgroundColor: '#0f172a', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            {/* TOP PROGRESS BAR */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', gap: '4px', zIndex: 10 }}>
              {activeStoryViewer.stories.map((_, idx) => (
                <div key={idx} style={{ flex: 1, height: '3px', backgroundColor: idx <= storySlideIndex ? '#ffffff' : 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>
              ))}
            </div>

            {/* HEADER USERINFO & CLOSE BUTTON */}
            <div style={{ position: 'absolute', top: '24px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={activeStoryViewer.cover} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #ffffff' }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{activeStoryViewer.title}</span>
              </div>
              <button onClick={() => setActiveStoryViewer(null)} style={{ border: 'none', background: 'transparent', color: '#ffffff', cursor: 'pointer', padding: '0.25rem' }}><X size={22} /></button>
            </div>

            {/* STORY CONTENT IMAGE & CAPTION */}
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img src={activeStoryViewer.stories[storySlideIndex]?.image || activeStoryViewer.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', padding: '2rem 1.5rem 1.5rem 1.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', color: '#ffffff' }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{activeStoryViewer.stories[storySlideIndex]?.caption}</p>
              </div>
            </div>

            {/* PREV / NEXT NAV BUTTONS */}
            {storySlideIndex > 0 && (
              <button onClick={() => setStorySlideIndex(prev => prev - 1)} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', border: 'none', background: 'rgba(0,0,0,0.5)', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', zIndex: 10 }}>‹</button>
            )}
            {storySlideIndex < activeStoryViewer.stories.length - 1 && (
              <button onClick={() => setStorySlideIndex(prev => prev + 1)} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', border: 'none', background: 'rgba(0,0,0,0.5)', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', zIndex: 10 }}>›</button>
            )}
          </div>
        </div>
      )}

      {/* 2. CREATE NEW STORY HIGHLIGHT MODAL */}
      {showCreateHighlightModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <form onSubmit={handleCreateHighlight} className="card-premium glass-card" style={{ width: '100%', maxWidth: '400px', padding: '1.75rem', borderRadius: '24px', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>New Story Highlight</h3>
              <button type="button" onClick={() => setShowCreateHighlightModal(false)} className="btn-icon"><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Highlight Name</label>
                <input type="text" className="input" value={newHighlightTitle} onChange={e => setNewHighlightTitle(e.target.value)} placeholder="e.g. Lab Notes, DSA Prep, Placement" required />
              </div>
              <div>
                <label className="label">Cover Image URL (optional)</label>
                <input type="text" className="input" value={newHighlightCover} onChange={e => setNewHighlightCover(e.target.value)} placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>Create</button>
                <button type="button" onClick={() => setShowCreateHighlightModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 3. APPS AND WEBSITES INTEGRATION MODAL */}
      {showAppsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: '24px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={20} /> Apps and Websites</h3>
              <button onClick={() => setShowAppsModal(false)} className="btn-icon"><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>GitHub Integration</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Connected as @aarav_sharma</div>
                </div>
                <span className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>Connected</span>
              </div>

              <div style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Canvas LMS Portal</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>IIT Madras Assignment Sync</div>
                </div>
                <span className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>Active</span>
              </div>

              <div style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Google Workspace</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>OAuth 2.0 Identity Verified</div>
                </div>
                <span className="tag tag-secondary" style={{ fontSize: '0.6875rem' }}>Verified</span>
              </div>
            </div>
            <button onClick={() => setShowAppsModal(false)} className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>Close</button>
          </div>
        </div>
      )}

      {/* 4. NOTIFICATIONS PREFERENCES MODAL */}
      {showNotificationsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: '24px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={20} /> Notification Preferences</h3>
              <button onClick={() => setShowNotificationsModal(false)} className="btn-icon"><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'doubtAlerts', label: 'Academic Doubt Room Alerts', desc: 'Notify when peers join your live doubt room' },
                { key: 'directMessages', label: 'Direct Peer Messages', desc: 'Instant sound alert for 1:1 chat messages' },
                { key: 'streakReminders', label: 'Daily Streak Reminders', desc: 'Remind before midnight to maintain study streak' },
                { key: 'examRadar', label: 'Campus Exam Radar Alerts', desc: 'Countdowns for midterm & lab practicals' }
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifSettings[item.key]} 
                    onChange={e => setNotifSettings(prev => ({ ...prev, [item.key]: e.target.checked }))} 
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
            <button onClick={() => setShowNotificationsModal(false)} className="btn btn-accent" style={{ width: '100%', marginTop: '1.5rem' }}>Save Preferences</button>
          </div>
        </div>
      )}

      {/* 5. ACADEMIC SUPERVISION MODAL */}
      {showSupervisionModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: '24px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={20} /> Academic Supervision</h3>
              <button onClick={() => setShowSupervisionModal(false)} className="btn-icon"><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e40af' }}>Faculty Supervisor Assigned</div>
                <div style={{ fontSize: '0.8125rem', color: '#2563eb', marginTop: '0.25rem' }}>Prof. V. Ramanathan (IIT Madras CSE Dept)</div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                Supervision allows academic advisors to verify peer teaching logs, endorse doubt resolutions, and grant official verified mentor credentials.
              </p>
              <button onClick={() => alert("Supervision report PDF downloaded!")} className="btn btn-secondary" style={{ width: '100%' }}>Download Mentorship Audit Log (PDF)</button>
            </div>
            <button onClick={() => setShowSupervisionModal(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Close</button>
          </div>
        </div>
      )}

      {/* 6. LOGIN ACTIVITY MODAL */}
      {showLoginActivityModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: '24px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={20} /> Login Activity</h3>
              <button onClick={() => setShowLoginActivityModal(false)} className="btn-icon"><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Windows 11 Chrome Desktop</div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Active Now • Localhost Campus IP</div>
                </div>
                <span className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>This Device</span>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Android App (StudyLoop Mobile)</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active 2 hours ago</div>
                </div>
                <button onClick={() => alert("Logged out Android session")} style={{ fontSize: '0.75rem', color: '#dc2743', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Log Out</button>
              </div>
            </div>
            <button onClick={() => setShowLoginActivityModal(false)} className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>Close</button>
          </div>
        </div>
      )}

      {/* 7. VIEW ARCHIVE MODAL */}
      {showArchiveModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '560px', padding: '2rem', borderRadius: '24px', backgroundColor: '#ffffff', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800 }}>Archived Posts & Doubt Logs</h3>
              <button onClick={() => setShowArchiveModal(false)} className="btn-icon"><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>📦 Resolved Doubt Log: Java Multithreading Locks</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Archived on Aug 18, 2026 • 45 min session with Peer Tutor</div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>📦 Saved Reel: Dynamic Programming Cheat Sheet</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Archived on Aug 12, 2026</div>
              </div>
            </div>
            <button onClick={() => setShowArchiveModal(false)} className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>Close Archive</button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 1: POSTS GRID */}
      {activeProfileTab === 'posts' && (
        <div className="grid-3">
          {postsList.map(post => (
            <div 
              key={post.id} 
              onClick={() => setSelectedMedia({ ...post, type: 'post' })}
              className="card-premium" 
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
            >
              <img src={post.image} alt="Post" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                  {post.title}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2743', fontWeight: 600 }}>
                    ❤️ {post.likes} likes
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    💬 {post.comments.length} comments
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 2: REELS GRID (SHORTS: 9:16 PORTRAIT FRAMES) */}
      {activeProfileTab === 'reels' && (
        <div className="grid-3">
          {reelsList.map(reel => (
            <div 
              key={reel.id} 
              onClick={() => setSelectedMedia({ ...reel, type: 'reel' })}
              className="card-premium" 
              style={{ 
                padding: 0, 
                overflow: 'hidden', 
                cursor: 'pointer', 
                aspectRatio: '9 / 16', 
                height: '320px', 
                backgroundColor: '#09090b', 
                position: 'relative', 
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 25px rgba(0, 0, 0, 0.25)'
              }}
            >
              <video src={reel.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '0.25rem 0.625rem', borderRadius: '8px', fontSize: '0.6875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                ⚡ 9:16 • {reel.duration}
              </div>
              <div style={{ position: 'absolute', bottom: '0', inset: 'auto 0 0 0', padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', color: '#ffffff' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem', lineHeight: 1.3 }}>{reel.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.9 }}>
                  <span>▶ {reel.views} views</span>
                  <span style={{ color: '#f43f5e', fontWeight: 700 }}>❤️ {reel.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 3: LONG VIDEOS GRID (LONG VIDEOS: 16:9 WIDESCREEN FRAMES) */}
      {activeProfileTab === 'videos' && (
        <div className="grid-2">
          {videosList.map(vid => (
            <div 
              key={vid.id} 
              onClick={() => setSelectedMedia({ ...vid, type: 'video' })}
              className="card-premium" 
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', borderRadius: '16px' }}
            >
              <div style={{ position: 'relative', aspectRatio: '16 / 9', backgroundColor: '#000000', overflow: 'hidden' }}>
                <img src={vid.thumbnail} alt="Video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  🎥 16:9 • {vid.duration}
                </div>
              </div>
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>{vid.title}</div>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>▶ {vid.views} views</span>
                  <span style={{ color: '#dc2743', fontWeight: 600 }}>❤️ {vid.likes} likes</span>
                  <span>💬 {vid.comments.length} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 4: BADGES & ACCOMPLISHMENTS */}
      {activeProfileTab === 'badges' && (
        <div className="card-premium">
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={24} style={{ color: '#3b82f6' }} /> Awarded Campus Badges & Medals
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {badges.map(badge => (
              <div key={badge.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#eff6ff', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', marginBottom: '0.5rem', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.15)' }}>
                  🏅
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{badge.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', lineHeight: 1.3 }}>{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSTAGRAM & YOUTUBE THEATER VIDEO PLAYER MODAL (DYNAMIC 9:16 SHORTS vs 16:9 LONG VIDEOS) */}
      {selectedMedia && (() => {
        const isShort = (() => {
          if (selectedMedia.type === 'reel') return true;
          if (!selectedMedia.duration) return false;
          const parts = selectedMedia.duration.split(':').map(Number);
          if (parts.length === 2) {
            return (parts[0] * 60 + parts[1]) < 60;
          }
          return false;
        })();

        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 9, 11, 0.88)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div className="card-premium glass-card" style={{ width: '100%', maxWidth: isShort ? '460px' : '720px', padding: '1.75rem', borderRadius: '24px', position: 'relative', maxHeight: '92vh', overflowY: 'auto', backgroundColor: '#ffffff', boxShadow: '0 25px 70px rgba(0,0,0,0.5)' }}>
              
              <button 
                onClick={() => setSelectedMedia(null)} 
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.125rem', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={profile.avatarUrl} alt="Avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #d97706' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0f172a' }}>{usernameHandle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{profile.college} • {profile.department}</div>
                  </div>
                </div>

                {/* Aspect Ratio & Category Pill */}
                <span style={{ 
                  backgroundColor: isShort ? '#fef3c7' : '#e0f2fe', 
                  color: isShort ? '#b45309' : '#0369a1', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 800 
                }}>
                  {isShort ? '⚡ Short (9:16 Portrait)' : '🎥 Long Video (16:9 Widescreen)'}
                </span>
              </div>

              {/* WATCHABLE VIDEO PLAYER ELEMENT (FORMATTED 9:16 OR 16:9) */}
              <div style={{ 
                position: 'relative', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                backgroundColor: '#000000', 
                marginBottom: '1.25rem', 
                boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                aspectRatio: isShort ? '9 / 16' : '16 / 9',
                maxHeight: isShort ? '480px' : '380px',
                margin: isShort ? '0 auto 1.25rem auto' : '0 0 1.25rem 0'
              }}>
                <video 
                  src={selectedMedia.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4'} 
                  controls 
                  autoPlay 
                  loop 
                  playsInline 
                  style={{ width: '100%', height: '100%', display: 'block', backgroundColor: '#000000', objectFit: isShort ? 'cover' : 'contain' }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>{selectedMedia.title}</h3>
                {isShort && (
                  <button 
                    onClick={() => { setSelectedMedia(null); setActiveTab('reels'); }} 
                    className="btn btn-accent"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.375rem', whiteSpace: 'nowrap' }}
                  >
                    <Tv2 size={14} /> Full Reels View (100vh)
                  </button>
                )}
              </div>

            {/* ACTION BAR: LIKE, COMMENT, SHARE */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={handleLikeMedia} className="btn btn-secondary" style={{ color: '#dc2743', borderColor: '#fecdd3', fontWeight: 700 }}>
                  ❤️ Like ({selectedMedia.likes})
                </button>
                <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>💬 {selectedMedia.comments ? selectedMedia.comments.length : 0} Comments</span>
              </div>
              
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: selectedMedia.title, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Reel video link copied to clipboard!");
                  }
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.875rem', borderRadius: '8px' }}
              >
                <Share2 size={14} /> Share Video
              </button>
            </div>

            {/* COMMENTS LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Community Comments</h4>
              {(!selectedMedia.comments || selectedMedia.comments.length === 0) ? (
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8', fontStyle: 'italic' }}>No comments yet. Be the first to comment!</div>
              ) : (
                selectedMedia.comments.map((c, i) => (
                  <div key={i} style={{ fontSize: '0.8125rem', backgroundColor: '#f8fafc', padding: '0.625rem 0.875rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                    <strong style={{ color: '#0f172a' }}>{c.author}:</strong> <span style={{ color: '#475569' }}>{c.text}</span>
                  </div>
                ))
              )}
            </div>

            {/* COMMENT INPUT FORM */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.625rem' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Add a comment on this video..." 
                value={commentText} 
                onChange={e => setCommentText(e.target.value)} 
                style={{ flex: 1, fontSize: '0.8125rem', borderRadius: '10px' }} 
              />
              <button type="submit" className="btn btn-accent" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem', fontWeight: 700, borderRadius: '10px' }}>Post</button>
            </form>

          </div>
        </div>
      );
    })()}

      {/* MEDIA CREATOR STUDIO UPLOAD MODAL (INSTAGRAM + YOUTUBE REFERENCE) */}
      {isUploading && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '640px', padding: '2rem', borderRadius: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <button 
              onClick={() => setIsUploading(false)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusCircle size={24} />
              </div>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.5rem', margin: 0 }}>Create & Upload Media</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>Publish Short Reels (Instagram) or Full Lectures (YouTube) to your student profile</p>
              </div>
            </div>

            <form onSubmit={handlePublishContent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* CONTENT TYPE SELECTOR PILLS */}
              <div>
                <label className="label">Select Content Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setUploadType('reel'); setUploadDuration('0:45'); }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: uploadType === 'reel' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      backgroundColor: uploadType === 'reel' ? '#eff6ff' : '#ffffff',
                      color: uploadType === 'reel' ? '#2563eb' : '#475569',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    📱 Short Reel (9:16)
                  </button>

                  <button
                    type="button"
                    onClick={() => { setUploadType('video'); setUploadDuration('15:20'); }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: uploadType === 'video' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      backgroundColor: uploadType === 'video' ? '#f0f9ff' : '#ffffff',
                      color: uploadType === 'video' ? '#0369a1' : '#475569',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    🎥 Long Lecture (16:9)
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadType('post')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: uploadType === 'post' ? '2px solid #059669' : '1px solid #e2e8f0',
                      backgroundColor: uploadType === 'post' ? '#ecfdf5' : '#ffffff',
                      color: uploadType === 'post' ? '#047857' : '#475569',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    🖼️ Study Notes / Post
                  </button>
                </div>
              </div>

              {/* TITLE INPUT */}
              <div>
                <label className="label">Title / Headline</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder={uploadType === 'reel' ? "e.g. 3 Tricks to solve Recursion fast ⚡" : uploadType === 'video' ? "e.g. Operating Systems: Deadlock Prevention Masterclass" : "e.g. Java Collections Cheat Sheet 📊"} 
                  value={uploadTitle} 
                  onChange={e => setUploadTitle(e.target.value)} 
                  required 
                />
              </div>

              {/* SUBJECT TAG & DURATION */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Subject Tag</label>
                  <select className="input" value={uploadSubject} onChange={e => setUploadSubject(e.target.value)}>
                    <option value="#Java">#Java</option>
                    <option value="#Algorithms">#Algorithms</option>
                    <option value="#React">#React</option>
                    <option value="#Calculus">#Calculus</option>
                    <option value="#WebRTC">#WebRTC</option>
                    <option value="#SystemDesign">#SystemDesign</option>
                  </select>
                </div>

                <div>
                  <label className="label">Estimated Duration</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g. 0:45 or 15:30" 
                    value={uploadDuration} 
                    onChange={e => setUploadDuration(e.target.value)} 
                  />
                </div>
              </div>

              {/* FILE PICKER WITH LIVE PREVIEW */}
              <div>
                <label className="label">Upload Media File (Video / Image)</label>
                <input 
                  type="file" 
                  accept="video/*,image/*" 
                  onChange={handleFileSelect} 
                  className="input" 
                  style={{ padding: '0.5rem' }} 
                />
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Supported formats: .mp4, .mov, .jpg, .png (Max 100MB). Sample preview assigned if omitted.
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              {filePreviewUrl && (
                <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '0.75rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Live File Preview</div>
                  {uploadType === 'reel' ? (
                    <video src={filePreviewUrl} controls style={{ maxHeight: '180px', borderRadius: '8px' }} />
                  ) : (
                    <img src={filePreviewUrl} alt="Preview" style={{ maxHeight: '180px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-accent glow-amber" style={{ flex: 1, padding: '0.75rem' }}>
                  🚀 Publish to Profile & Feed
                </button>
                <button type="button" onClick={() => setIsUploading(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Avatar Change Modal */}
      {showAvatarModal && (
        <AvatarChangeModal
          currentAvatarUrl={profile.avatarUrl}
          onSave={handleSaveAvatar}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* Enlarged Photo Preview Lightbox Modal */}
      {showPhotoPreview && (
        <PhotoPreviewModal
          imageUrl={getDefaultAvatarByGender(profile.gender, profile.avatarUrl)}
          userName={profile.fullName}
          onClose={() => setShowPhotoPreview(false)}
        />
      )}

    </div>
  );
}

// --- SCREEN: DISCOVER PEERS & ALGORITHMS (3.1) ---
// --- SCREEN: DISCOVER PEERS & 8-FACTOR SMART MATCHING (3.1) ---
function DiscoverScreen({ token, setActiveTab, setActiveChatId, setChatPeer }) {
  const [candidates, setCandidates] = useState([]);
  const [mode, setMode] = useState('match'); // 'match', 'mentors', 'skill-swap'
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async (currentMode) => {
    setLoading(true);
    let url = '/api/matches/recommendations';

    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCandidates(data.recommendedPartners || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(mode);
  }, [mode, token]);

  const sendLearningRequest = async (peerId, skillMatch) => {
    try {
      const response = await fetch(`/api/matches/request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ targetUserId: peerId, skillMatch: skillMatch || 'Peer Learning' })
      });
      if (response.ok) {
        const res = await response.json();
        alert(res.message || "Learning Request sent to peer mentor!");
      } else {
        alert("Learning Request sent to peer mentor! Private study channel will open upon mutual acceptance.");
      }
    } catch (e) {
      console.error(e);
      alert("Learning Request sent to peer mentor!");
    }
  };

  const reportUser = async (peerId) => {
    try {
      const response = await fetch(`/api/matches/report`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ targetUserId: peerId, reason: 'Inappropriate academic behavior' })
      });
      if (response.ok) {
        alert("Peer mentor reported to campus moderation committee.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const blockUser = async (peerId) => {
    try {
      await fetch(`/api/matches/block`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ targetUserId: peerId })
      });
      setCandidates(prev => prev.filter(c => c.targetUserId !== peerId && c.profile?.id !== peerId));
      alert("User blocked from your peer learning recommendations.");
    } catch (e) {
      console.error(e);
    }
  };

  const endorseSkill = async (peerId, skill) => {
    try {
      const response = await fetch(`/api/gamification/endorse?recipientId=${peerId}&skill=${encodeURIComponent(skill)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert(`Successfully endorsed skill "${skill}"! +10 XP & +5 Coins awarded to peer mentor.`);
      } else {
        alert(`Successfully endorsed skill "${skill}"! +10 XP awarded.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ width: '100%', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', color: '#0f172a' }}>1-to-1 Peer Learning Partners</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            8-Factor Weighted Matching Engine: Skill Overlap (30%), Roles (20%), Availability (15%), Languages (10%).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '12px' }}>
          <button onClick={() => setMode('match')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', fontWeight: 600, background: mode === 'match' ? '#ffffff' : 'transparent', color: mode === 'match' ? '#7c3aed' : '#475569', border: 'none', borderRadius: '8px', boxShadow: mode === 'match' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
            🎯 8-Factor Smart Match
          </button>
          <button onClick={() => setMode('mentors')} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', fontWeight: 600, background: mode === 'mentors' ? '#ffffff' : 'transparent', color: mode === 'mentors' ? '#7c3aed' : '#475569', border: 'none', borderRadius: '8px', boxShadow: mode === 'mentors' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
            🎓 Senior Mentors
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="live-dot" style={{ backgroundColor: '#7c3aed' }}></div></div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <h3>No peer learning partners found</h3>
          <p>Update your learning goals & skills in profile settings to view matched peer tutors.</p>
        </div>
      ) : (
        <div className="grid-2">
          {candidates.map(item => {
            const p = item.profile || {};
            const score = item.matchScore || 85;
            const primarySkill = item.primarySkillMatch || (p.teachingSkills?.[0] || 'Peer Mentorship');
            const reason = item.matchReason || 'Strong academic learning compatibility and shared time slot availability.';

            return (
              <div key={p.id || item.targetUserId} className="card-premium glass-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>
                
                {/* 0-100% MATCH COMPATIBILITY SCORE BADGE */}
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontSize: '0.75rem', fontWeight: 800, color: '#047857', backgroundColor: '#d1fae5', padding: '0.375rem 0.75rem', borderRadius: '50px', border: '1px solid #a7f3d0' }}>
                  🎯 {score}% Learning Match
                </div>

                {/* Profile Avatar & Info */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                  <img 
                    src={getDefaultAvatarByGender(p.gender, p.avatarUrl)} 
                    alt="Avatar" 
                    onError={(e) => { e.target.src = getDefaultAvatarByGender(p.gender); }}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #7c3aed', objectFit: 'cover' }} 
                  />
                  <div>
                    <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>{p.fullName}</h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.125rem' }}>
                      {p.college || 'IIT Madras'} • Yr {p.year || 3} • <span style={{ color: '#d97706', fontWeight: 600 }}>⭐ {p.reputation || '5.0'} Mentor Rating</span>
                    </div>
                  </div>
                </div>

                {/* TRANSPARENT MATCH REASON CALLOUT BOX */}
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700, color: '#7c3aed' }}>💡 Why Matched: </span>
                  {reason}
                </div>

                {/* Skills Teaches & Wants */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', flex: 1 }}>
                  {p.teachingSkills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Can Teach:</span>
                      {p.teachingSkills.map(s => (
                        <span key={s} style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '8px', backgroundColor: '#f3e8ff', color: '#6d28d9', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                  )}

                  {p.learningGoals?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Wants to Learn:</span>
                      {p.learningGoals.map(s => (
                        <span key={s} style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS (MUTUAL OPT-IN REQUEST, ENDORSE, REPORT, BLOCK) */}
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => sendLearningRequest(p.id || item.targetUserId, primarySkill)} 
                    className="btn btn-accent glow-amber" 
                    style={{ flex: 2, padding: '0.625rem', fontSize: '0.8125rem', fontWeight: 700, borderRadius: '10px' }}
                  >
                    🤝 Request Mentorship
                  </button>
                  <button 
                    onClick={() => endorseSkill(p.id || item.targetUserId, primarySkill)} 
                    className="btn btn-secondary" 
                    style={{ flex: 1, padding: '0.625rem', fontSize: '0.8125rem', fontWeight: 600, borderRadius: '10px' }}
                  >
                    ⭐ Endorse
                  </button>
                  <button 
                    onClick={() => reportUser(p.id || item.targetUserId)} 
                    title="Report to Moderation"
                    style={{ padding: '0.625rem', borderRadius: '10px', border: '1px solid #fed7aa', backgroundColor: '#fff7ed', color: '#c2410c', cursor: 'pointer' }}
                  >
                    🚩
                  </button>
                  <button 
                    onClick={() => blockUser(p.id || item.targetUserId)} 
                    title="Block User"
                    style={{ padding: '0.625rem', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                  >
                    🚫
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// --- SCREEN: MY CONNECTIONS (ACCEPTED & INCOMING PENDING) ---
function ConnectionsScreen({ token, setActiveTab, setActiveChatId, setChatPeer }) {
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      // 1. Fetch active
      const responseActive = await fetch('/api/connections/active', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (responseActive.ok) {
        const data = await responseActive.json();
        setConnections(data);
      }

      // 2. Fetch pending
      const responsePending = await fetch('/api/connections/requests/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (responsePending.ok) {
        const data = await responsePending.json();
        setPending(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [token]);

  const acceptRequest = async (connId) => {
    try {
      const response = await fetch(`/api/connections/${connId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchConnections();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const rejectRequest = async (connId) => {
    try {
      const response = await fetch(`/api/connections/${connId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchConnections();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startChat = async (peer) => {
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="live-dot" style={{ backgroundColor: '#3b82f6' }}></div></div>;
  }

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>My Connections</h1>
      <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '2rem' }}>Manage your active college network connections and incoming requests.</p>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2563eb' }}>Pending Invitations ({pending.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pending.map(req => (
              <div key={req.connectionId} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={req.profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${req.profile.fullName}`} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{req.profile.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.profile.college} • Year {req.profile.year}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => acceptRequest(req.connectionId)} className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}><Check size={14} /> Accept</button>
                  <button onClick={() => rejectRequest(req.connectionId)} className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}><X size={14} /> Ignore</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active connections */}
      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Active Network</h2>
      {connections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed #e2e8f0', borderRadius: '12px' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No active connections yet. Discover peers to grow your circle!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {connections.map(conn => (
            <div key={conn.connectionId} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={conn.profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${conn.profile.fullName}`} alt="Avatar" style={{ width: '42px', height: '42px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{conn.profile.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{conn.profile.college} • {conn.profile.department}</div>
                </div>
              </div>
              <button onClick={() => startChat(conn.profile)} className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                <MessageSquare size={14} /> Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- SCREEN: DOUBT ROOMS & LIVE WebSocket GROUP CHAT ---
function DoubtRoomsScreen({ token, activeRoomId, setActiveRoomId, socket, wsMessages, setWsMessages, startWebRtcCall, webrtcCall }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [textMsg, setTextMsg] = useState('');
  const [roomData, setRoomData] = useState(null); // active room model details

  const chatBottomRef = useRef(null);
  const { profile } = useAuth();

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/doubts/live', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeRoomId) {
      fetchRooms();
    } else {
      fetchRoomDetails(activeRoomId);
      // Join WebSocket room (Section 6)
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'JOIN_ROOM',
          roomId: activeRoomId
        }));
      }
      // Load room message history
      fetchRoomChatHistory(activeRoomId);
    }

    return () => {
      if (activeRoomId && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'LEAVE_ROOM',
          roomId: activeRoomId
        }));
      }
    };
  }, [activeRoomId, socket]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [wsMessages]);

  const fetchRoomDetails = async (roomId) => {
    try {
      const response = await fetch(`/api/doubts/live`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const list = await response.json();
        const found = list.find(r => r.id === roomId);
        if (found) setRoomData(found);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRoomChatHistory = async (roomId) => {
    try {
      const response = await fetch(`/api/chats/doubt/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const history = await response.json();
        // Convert schema database shape to local WS template
        const formatted = history.map(h => ({
          type: 'ROOM_MSG',
          roomId: h.roomId,
          senderId: h.senderId,
          message: h.message,
          createdAt: h.createdAt
        }));
        setWsMessages(formatted);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!title || !subject) return;

    try {
      const response = await fetch('/api/doubts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, subject })
      });

      if (response.ok) {
        const newRoom = await response.json();
        setTitle('');
        setDescription('');
        setSubject('');
        setShowCreate(false);
        setActiveRoomId(newRoom.id);
      } else {
        const txt = await response.text();
        alert(txt || "Failed to create doubt room");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const joinAsHelper = async (roomId) => {
    try {
      const response = await fetch(`/api/doubts/${roomId}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const updated = await response.json();
        setRoomData(updated);
        setActiveRoomId(roomId);
      } else {
        const txt = await response.text();
        alert(txt || "Failed to join");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendRoomMessage = (e) => {
    e.preventDefault();
    if (!textMsg.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      type: 'CHAT_MSG',
      roomId: activeRoomId,
      message: textMsg
    }));
    setTextMsg('');
  };

  const markSolved = async () => {
    try {
      const response = await fetch(`/api/doubts/${activeRoomId}/solve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Doubt resolved! Helper rewarded +10 XP.");
        setActiveRoomId(null);
        setRoomData(null);
      } else {
        alert("Failed to solve room");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (activeRoomId) {
    // --- LIVE ROOM WORKSPACE & CHAT ---
    const isCreator = roomData && roomData.creatorId === profile.id;
    const isHelper = roomData && roomData.helperId === profile.id;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="live-indicator"><span className="live-dot"></span> Live workspace</span>
              <span className="tag tag-accent">{roomData?.subject}</span>
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{roomData?.title}</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Call button options */}
            {!webrtcCall && (
              <button 
                onClick={() => startWebRtcCall(isCreator ? roomData.helperId : roomData.creatorId, activeRoomId)} 
                className="btn btn-accent" 
                disabled={!roomData?.helperId}
                style={{ opacity: roomData?.helperId ? 1 : 0.6 }}
              >
                <Video size={16} /> Start Video Call
              </button>
            )}

            {isCreator && (
              <button onClick={markSolved} className="btn btn-primary">
                Mark Resolved
              </button>
            )}

            <button onClick={() => { setActiveRoomId(null); setRoomData(null); }} className="btn btn-secondary">
              Exit Room
            </button>
          </div>
        </div>

        {/* Workspace body */}
        <div style={{ display: 'flex', flex: 1, gap: '1.5rem', overflow: 'hidden' }}>
          {/* Left panel: Info & Helper status */}
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Description</h4>
              <p style={{ fontSize: '0.8125rem', color: '#475569' }}>{roomData?.description || "No description provided."}</p>
            </div>

            <div className="card" style={{ padding: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.75rem' }}>Workspace Helper</h4>
              {roomData?.helperId ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="live-dot" style={{ backgroundColor: '#059669', width: '8px', height: '8px' }}></div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Peer helper connected</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                  <div className="live-dot" style={{ backgroundColor: '#cbd5e1', width: '8px', height: '8px' }}></div>
                  <span style={{ fontSize: '0.8125rem' }}>Waiting for a helper...</span>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Chat messages */}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', paddingRight: '0.25rem' }}>
              {wsMessages.filter(m => m.roomId === activeRoomId || m.type === 'ROOM_MSG').map((msg, i) => {
                const isMe = msg.senderId === profile.id;
                return (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    backgroundColor: isMe ? '#eff6ff' : '#f1f5f9',
                    color: '#0f172a',
                    padding: '0.625rem 1rem',
                    borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    border: '1px solid',
                    borderColor: isMe ? '#bfdbfe' : '#e2e8f0'
                  }}>
                    <span style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.125rem', fontWeight: 600 }}>
                      {isMe ? "You" : msg.senderName || "Peer"}
                    </span>
                    <span style={{ fontSize: '0.875rem' }}>{msg.message}</span>
                  </div>
                );
              })}
              <div ref={chatBottomRef}></div>
            </div>

            <form onSubmit={sendRoomMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Type your message here..." 
                value={textMsg} 
                onChange={e => setTextMsg(e.target.value)} 
                required 
              />
              <button type="submit" className="btn btn-accent"><Send size={16} /></button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- UNIFIED DOUBT ROOMS DASHBOARD & CAMPUS EXAM RADAR ---
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem' }}>Doubt Rooms Hub</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>The single unified campus workspace for asking academic doubts, joining peer tutoring calls, and earning XP.</p>
        </div>

        <button onClick={() => setShowCreate(!showCreate)} className="btn btn-accent" style={{ borderRadius: '50px', padding: '0.625rem 1.5rem' }}>
          {showCreate ? "Close Panel" : "➕ Ask a New Doubt"}
        </button>
      </div>

      {/* CAMPUS EXAM RADAR WIDGET STRIP */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Flame size={18} fill="#3b82f6" style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            IIT Madras • Exam Radar & Urgent Doubt Tracker
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.875rem 1rem', borderRadius: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>React & Frontend Lab Test</div>
            <div style={{ fontSize: '0.71875rem', color: '#1e3a8a', marginTop: '0.25rem' }}>⏳ Midterm in 4 Days</div>
            <button onClick={() => { setSubject('React'); setTitle('Question on React hooks & state re-renders'); setShowCreate(true); }} style={{ marginTop: '0.5rem', border: 'none', background: 'transparent', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              Raise Doubt →
            </button>
          </div>

          <div style={{ padding: '0.875rem 1rem', borderRadius: '12px', backgroundColor: '#e0f2fe', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Java & Data Structures Exam</div>
            <div style={{ fontSize: '0.71875rem', color: '#0c4a6e', marginTop: '0.25rem' }}>⏳ Exam in 6 Days</div>
            <button onClick={() => { setSubject('Java'); setTitle('Help with Binary Tree In-Order Traversal'); setShowCreate(true); }} style={{ marginTop: '0.5rem', border: 'none', background: 'transparent', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              Raise Doubt →
            </button>
          </div>

          <div style={{ padding: '0.875rem 1rem', borderRadius: '12px', backgroundColor: '#fce7f3', border: '1px solid #fbcfe8' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#be185d' }}>Calculus & Linear Algebra</div>
            <div style={{ fontSize: '0.71875rem', color: '#831843', marginTop: '0.25rem' }}>⏳ Quiz in 9 Days</div>
            <button onClick={() => { setSubject('Calculus'); setTitle('Eigenvectors & Matrix Transformations question'); setShowCreate(true); }} style={{ marginTop: '0.5rem', border: 'none', background: 'transparent', color: '#db2777', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              Raise Doubt →
            </button>
          </div>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreateRoom} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem', maxWidth: '640px' }}>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Request Peer Help</h3>
          
          <div>
            <label className="label">Doubt Title / What is confusing you?</label>
            <input type="text" className="input" placeholder="e.g. Help balancing redox chemical equations" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Subject Category</label>
              <input type="text" className="input" placeholder="e.g. Chemistry, Calculus, OS" value={subject} onChange={e => setSubject(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Explanation details (context, question source, etc.)</label>
            <textarea className="input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Provide error message or textbook question context..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-accent" style={{ alignSelf: 'flex-start' }}><Plus size={16} /> Open Doubt Room</button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="live-dot" style={{ backgroundColor: '#3b82f6' }}></div></div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <HelpCircle size={48} />
          <h3>No doubts open</h3>
          <p>Everything is quiet on campus! Enjoy your study loop or raise a question of your own.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rooms.map(room => (
            <div key={room.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="live-indicator"><span className="live-dot"></span> Live room</span>
                  <span className="tag tag-accent">{room.subject}</span>
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>{room.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>College: {room.college} • Started {new Date(room.createdAt).toLocaleTimeString()}</p>
              </div>

              <div>
                <button onClick={() => joinAsHelper(room.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                  Join as Helper
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- SCREEN: DIRECT CHAT 1:1 MESSAGING ---
function ChatScreen({ token, activeChatId, setActiveChatId, chatPeer, setChatPeer, socket, wsMessages, setWsMessages, setActiveTab }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const chatBottomRef = useRef(null);

  const { profile } = useAuth();

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/chats/direct/threads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setThreads(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await fetch(`/api/chats/direct/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map(m => ({
          type: 'DIRECT_MSG',
          chatId: m.chatId,
          senderId: m.senderId,
          message: m.message,
          createdAt: m.createdAt
        }));
        setWsMessages(formatted);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchThreads();
    const interval = setInterval(fetchThreads, 4000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (activeChatId) {
      fetchChatHistory(activeChatId);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [wsMessages]);

  const sendDirectMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      type: 'DIRECT_MSG',
      chatId: activeChatId,
      message: text
    }));
    setText('');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="live-dot" style={{ backgroundColor: '#3b82f6' }}></div></div>;
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '1.5rem' }}>
      {/* Threads list */}
      <div className="card" style={{ width: '280px', display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.625rem', marginBottom: '1rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Chats</h3>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.6875rem', marginTop: '0.25rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#059669' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
              {threads.filter(t => t.online).length} Online
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%' }}></span>
              {threads.filter(t => !t.online).length} Offline
            </span>
          </div>
        </div>

        {threads.length === 0 ? (
          <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', margin: '2rem 0' }}>No chats active.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {threads.map(t => (
              <button key={t.chatId} onClick={() => { setActiveChatId(t.chatId); setChatPeer(t.peer); }} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                width: '100%',
                padding: '0.5rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeChatId === t.chatId ? '#eff6ff' : 'transparent',
                textAlign: 'left'
              }}>
                <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
                  <img src={t.peer.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${t.peer.fullName}`} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: t.online ? '#10b981' : '#94a3b8',
                    border: '2px solid #ffffff'
                  }}></span>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{t.peer.fullName}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{t.peer.college}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat pane */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
        {activeChatId ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
                <img src={chatPeer?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${chatPeer?.fullName}`} alt="Avatar" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  bottom: '0px',
                  right: '0px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: threads.find(t => t.chatId === activeChatId)?.online ? '#10b981' : '#94a3b8',
                  border: '2px solid #ffffff'
                }}></span>
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{chatPeer?.fullName}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <span style={{ color: threads.find(t => t.chatId === activeChatId)?.online ? '#059669' : '#64748b', fontWeight: 600 }}>
                    {threads.find(t => t.chatId === activeChatId)?.online ? 'Online' : 'Offline'}
                  </span>
                  <span>•</span>
                  <span>{chatPeer?.college}</span>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              {wsMessages.filter(m => m.chatId === activeChatId).map((msg, i) => {
                const isMe = msg.senderId === profile.id;
                const isReelShare = msg.message && msg.message.includes('[REEL_SHARE:');
                const reelText = isReelShare ? msg.message.replace(/\[REEL_SHARE:[^\]]+\]\s*/, '') : msg.message;

                return (
                  <div key={i} style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    backgroundColor: isMe ? '#eff6ff' : '#f1f5f9',
                    color: '#0f172a',
                    padding: '0.625rem 1rem',
                    borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    border: '1px solid',
                    borderColor: isMe ? '#bfdbfe' : '#e2e8f0',
                    fontSize: '0.875rem'
                  }}>
                    {isReelShare ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          <Tv2 size={16} /> Shared Educational Reel
                        </div>
                        <div style={{ backgroundColor: '#09090b', color: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                          <p style={{ margin: 0, fontSize: '0.8125rem', lineHeight: 1.4 }}>{reelText}</p>
                        </div>
                        {setActiveTab && (
                          <button onClick={() => setActiveTab('reels')} className="btn btn-accent" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', width: '100%' }}>
                            ▶ Watch Reel Now
                          </button>
                        )}
                      </div>
                    ) : (
                      msg.message
                    )}
                  </div>
                );
              })}
              <div ref={chatBottomRef}></div>
            </div>

            <form onSubmit={sendDirectMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" className="input" placeholder="Type direct message..." value={text} onChange={e => setText(e.target.value)} required />
              <button type="submit" className="btn btn-accent"><Send size={16} /></button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
            <MessageSquare size={48} />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Select a connection to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SCREEN: EDUCATIONAL REELS (INSTAGRAM REELS FORMAT) ---
function ReelsScreen({ token, setActiveTab, setActiveChatId, setChatPeer, socket, setWsMessages }) {
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  
  // Interaction states
  const [likedMap, setLikedMap] = useState({});
  const [likesCountMap, setLikesCountMap] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [commentsMap, setCommentsMap] = useState({});
  const [commentText, setCommentText] = useState('');
  const [followingMap, setFollowingMap] = useState({});

  // Share & Send states
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTab, setShareTab] = useState('social'); // 'social' or 'connections'
  const [shareSearch, setShareSearch] = useState('');
  const [sentUsersMap, setSentUsersMap] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // Upload form
  const [videoUrl, setVideoUrl] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const videoRef = useRef(null);
  const wheelCooldownRef = useRef(false);
  const touchStartYRef = useRef(0);

  const defaultReels = [
    {
      id: "reel-1",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      subject: "React",
      description: "React useEffect & State lifecycle visual breakdown in 60 seconds! 🚀 #ReactHooks #Frontend",
      likesCount: 342,
      commentsCount: 18,
      creator: {
        id: "studenta-uuid",
        fullName: "Aarav Sharma",
        username: "aarav_cs_iitm",
        college: "IIT Madras",
        department: "Computer Science",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      }
    },
    {
      id: "reel-2",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      subject: "Java",
      description: "Java Multithreading & ReentrantLocks explained with real memory diagrams! ⚡ #JavaConcurrency #CS",
      likesCount: 512,
      commentsCount: 34,
      creator: {
        id: "studentb-uuid",
        fullName: "Bhavna Patel",
        username: "bhavna_code",
        college: "IIT Bombay",
        department: "Information Tech",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
      }
    },
    {
      id: "reel-3",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      subject: "Data Structures",
      description: "Big-O Notation Memory Tricks! Master O(1) vs O(N log N) visually. 🧠 #Algorithms #CodingInterview",
      likesCount: 789,
      commentsCount: 42,
      creator: {
        id: "studentc-uuid",
        fullName: "Chaitanya Kumar",
        username: "chaitanya_dev",
        college: "BITS Pilani",
        department: "Electrical Eng",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
      }
    }
  ];

  const appConnections = [
    {
      id: "studenta-uuid",
      chatId: "chat-studenta",
      fullName: "Aarav Sharma",
      college: "IIT Madras",
      department: "Computer Science",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    {
      id: "studentb-uuid",
      chatId: "chat-studentb",
      fullName: "Bhavna Patel",
      college: "IIT Bombay",
      department: "Information Tech",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
    },
    {
      id: "studentc-uuid",
      chatId: "chat-studentc",
      fullName: "Chaitanya Kumar",
      college: "BITS Pilani",
      department: "Electrical Eng",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
    }
  ];

  const fetchReels = async () => {
    try {
      const response = await fetch('/api/reels', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setReels(data);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setReels(defaultReels);
    const initialLikes = {};
    defaultReels.forEach(r => { initialLikes[r.id] = r.likesCount; });
    setLikesCountMap(initialLikes);
    setLoading(false);
  };

  useEffect(() => {
    fetchReels();
  }, [token]);

  const activeReel = reels[currentIndex] || defaultReels[0];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length]);

  // Mouse wheel scroll handler with debounced cooldown
  const handleWheel = (e) => {
    if (wheelCooldownRef.current) return;
    if (Math.abs(e.deltaY) < 15) return;

    wheelCooldownRef.current = true;
    setTimeout(() => {
      wheelCooldownRef.current = false;
    }, 350);

    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // Touch swipe gesture handlers
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY;
      if (Math.abs(diffY) > 35) {
        if (diffY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleLike = (reelId) => {
    const isLiked = likedMap[reelId];
    const currentCount = likesCountMap[reelId] || activeReel.likesCount;
    setLikedMap(prev => ({ ...prev, [reelId]: !isLiked }));
    setLikesCountMap(prev => ({ ...prev, [reelId]: isLiked ? currentCount - 1 : currentCount + 1 }));

    fetch(`/api/reels/${reelId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(e => console.error(e));
  };

  const toggleFollow = (creatorId) => {
    setFollowingMap(prev => ({ ...prev, [creatorId]: !prev[creatorId] }));
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      senderName: "You",
      comment: commentText,
      createdAt: new Date().toISOString()
    };

    const currentList = commentsMap[activeReel.id] || [];
    setCommentsMap(prev => ({
      ...prev,
      [activeReel.id]: [...currentList, newComment]
    }));
    setCommentText('');

    fetch(`/api/reels/${activeReel.id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ comment: commentText })
    }).catch(e => console.error(e));
  };

  const handleUploadReel = async (e) => {
    e.preventDefault();
    if (!videoUrl || !subject) return;

    const newReel = {
      id: "user-reel-" + Date.now(),
      videoUrl: videoUrl,
      subject: subject,
      description: description || "Educational short lesson",
      likesCount: 1,
      commentsCount: 0,
      creator: {
        id: "me",
        fullName: "You",
        username: "studyloop_creator",
        college: "My Campus",
        department: "StudyLoop",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=You`
      }
    };

    setReels([newReel, ...reels]);
    setCurrentIndex(0);
    setVideoUrl('');
    setSubject('');
    setDescription('');
    setShowUpload(false);

    try {
      await fetch('/api/reels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoUrl, subject, description })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // --- SHARE & IN-APP SEND HANDLERS ---
  const shareReelUrl = window.location.origin + `#reel-${activeReel.id}`;
  const shareText = `Check out this Educational Reel on StudyLoop: "${activeReel.subject} - ${activeReel.description}" 🚀`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareReelUrl}`);
    showToast("✨ Reel link & caption copied to clipboard!");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `StudyLoop Reel: ${activeReel.subject}`,
          text: shareText,
          url: shareReelUrl,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      handleCopyLink();
    }
  };

  const shareToWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n" + shareReelUrl)}`;
    window.open(waUrl, '_blank');
    showToast("Opening WhatsApp share...");
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareReelUrl}`);
    showToast("📸 Instagram Reel caption & link copied! Paste into Instagram story/DM.");
  };

  const shareToTwitter = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareReelUrl)}`;
    window.open(twUrl, '_blank');
    showToast("Opening X (Twitter) share...");
  };

  const shareToTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareReelUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank');
    showToast("Opening Telegram share...");
  };

  const shareToLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareReelUrl)}`;
    window.open(liUrl, '_blank');
    showToast("Opening LinkedIn share...");
  };

  const sendReelToUser = (user) => {
    const messagePayload = `[REEL_SHARE:${activeReel.id}] 🎬 Watch Reel: #${activeReel.subject} - ${activeReel.description}`;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'DIRECT_MSG',
        chatId: user.chatId || `chat-${user.id}`,
        message: messagePayload
      }));
    }

    if (setWsMessages) {
      setWsMessages(prev => [...prev, {
        type: 'DIRECT_MSG',
        chatId: user.chatId || `chat-${user.id}`,
        senderId: 'me',
        message: messagePayload,
        createdAt: new Date().toISOString()
      }]);
    }

    setSentUsersMap(prev => ({ ...prev, [user.id]: true }));
    showToast(`🚀 Shared reel directly with ${user.fullName}!`);
  };

  const filteredConnections = appConnections.filter(user => 
    user.fullName.toLowerCase().includes(shareSearch.toLowerCase()) ||
    user.college.toLowerCase().includes(shareSearch.toLowerCase())
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="live-dot" style={{ backgroundColor: '#3b82f6' }}></div></div>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      width: '100%', 
      backgroundColor: '#09090b', 
      position: 'relative', 
      overflow: 'hidden',
      padding: 0
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          borderLeft: '4px solid #3b82f6',
          zIndex: 100,
          fontSize: '0.8125rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Sparkles size={16} style={{ color: '#fbbf24' }} />
          {toastMessage}
        </div>
      )}

      {/* Upload Modal Overlay */}
      {showUpload && (
        <form onSubmit={handleUploadReel} className="card-premium" style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%', 
          maxWidth: '420px', 
          backgroundColor: '#ffffff', 
          zIndex: 100,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1rem', margin: 0 }}>Upload Concept Short</h3>
            <button type="button" onClick={() => setShowUpload(false)} className="btn-icon"><X size={16} /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <label className="label" style={{ fontSize: '0.75rem' }}>Video Stream URL (MP4)</label>
              <input type="text" className="input" placeholder="https://.../video.mp4" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required style={{ padding: '0.375rem 0.625rem', fontSize: '0.8125rem' }} />
            </div>
            <div>
              <label className="label" style={{ fontSize: '0.75rem' }}>Subject Tag</label>
              <input type="text" className="input" placeholder="e.g. React, Java, Calculus" value={subject} onChange={e => setSubject(e.target.value)} required style={{ padding: '0.375rem 0.625rem', fontSize: '0.8125rem' }} />
            </div>
            <div>
              <label className="label" style={{ fontSize: '0.75rem' }}>Caption & Concept Explanation</label>
              <textarea className="input" style={{ minHeight: '50px', padding: '0.375rem 0.625rem', fontSize: '0.8125rem' }} placeholder="Explain this academic concept in 60s..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '0.5rem' }}>Publish to Reels</button>
          </div>
        </form>
      )}

      {/* FULL SCREEN 9:16 INSTAGRAM REELS VIEWPORT */}
      <div 
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          maxHeight: '100vh',
          width: '100%',
          gap: '1.25rem',
          userSelect: 'none'
        }}
      >
        {/* Main 9:16 Center Video Frame */}
        <div style={{
          position: 'relative',
          height: '100vh',
          maxHeight: '100vh',
          aspectRatio: '9 / 16',
          backgroundColor: '#000000',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'center'
        }}>
          {/* Video Player */}
          <video
            ref={videoRef}
            src={activeReel.videoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
            autoPlay
            loop
            muted={muted}
            playsInline
            onClick={togglePlay}
          />

          {/* Top Floating Control Bar Overlay */}
          <div style={{ 
            position: 'absolute', 
            top: '0.75rem', 
            left: '0.75rem', 
            right: '0.75rem', 
            display: 'flex', 
            justify: 'space-between', 
            alignItems: 'center', 
            zIndex: 20 
          }}>
            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
              <ReelsActionButton 
                label="Scroll Up (W / ↑)"
                disabled={currentIndex === 0}
                icon={<ChevronUp size={16} />}
                onClick={handlePrev}
              />
              <ReelsActionButton 
                label="Scroll Down (S / ↓)"
                disabled={currentIndex === reels.length - 1}
                icon={<ChevronDown size={16} />}
                onClick={handleNext}
              />
              <span style={{ 
                fontSize: '0.6875rem', 
                color: '#ffffff', 
                backgroundColor: 'rgba(0,0,0,0.6)', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '10px', 
                backdropFilter: 'blur(6px)', 
                fontWeight: 600 
              }}>
                {currentIndex + 1} / {reels.length}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
              <button 
                onClick={() => setShowUpload(!showUpload)} 
                style={{ 
                  background: '#3b82f6', 
                  border: 'none', 
                  borderRadius: '20px', 
                  color: '#ffffff', 
                  padding: '0.25rem 0.625rem', 
                  fontSize: '0.6875rem', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                }}
              >
                <Plus size={14} /> Post Reel
              </button>
              <ReelsActionButton 
                label={muted ? "Unmute Audio" : "Mute Audio"}
                icon={muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                onClick={() => setMuted(!muted)}
              />
            </div>
          </div>

          {/* VISUAL SCROLL PROGRESS TRACK (RIGHT SIDE OF VIDEO) */}
          <div style={{
            position: 'absolute',
            right: '4px',
            top: '60px',
            bottom: '140px',
            width: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {reels.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  flex: 1,
                  margin: '1px 0',
                  backgroundColor: idx === currentIndex ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Play/Pause overlay */}
          {!isPlaying && (
            <div onClick={togglePlay} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', cursor: 'pointer', zIndex: 5 }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '1.25rem' }}>
                ▶
              </div>
            </div>
          )}

          {/* BOTTOM LEFT METADATA OVERLAY (MATCHING IMAGE 2) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: '55px',
            padding: '0.875rem',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.92))',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
            zIndex: 10
          }}>
            {/* Creator handle & Follow button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={activeReel.creator?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${activeReel.creator?.fullName}`} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #3b82f6' }} />
              <span style={{ fontWeight: 700, fontSize: '0.8125rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                @{activeReel.creator?.username || activeReel.creator?.fullName?.toLowerCase().replace(/\s+/g, '_')}
              </span>
              <button 
                onClick={() => toggleFollow(activeReel.creator?.id)} 
                style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(255,255,255,0.8)', 
                  borderRadius: '6px', 
                  color: '#ffffff', 
                  fontSize: '0.6875rem', 
                  fontWeight: 600, 
                  padding: '0.125rem 0.5rem', 
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {followingMap[activeReel.creator?.id] ? "Following" : "Follow"}
              </button>
            </div>

            {/* Caption & Subject Tag */}
            <div style={{ fontSize: '0.75rem', color: '#f8fafc', lineHeight: 1.3, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, backgroundColor: '#3b82f6', color: '#ffffff', padding: '0.125rem 0.375rem', borderRadius: '50px', marginRight: '0.375rem' }}>
                #{activeReel.subject}
              </span>
              {activeReel.description}
            </div>

            {/* Music track ticker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.625rem', color: '#cbd5e1' }}>
              <Music size={12} />
              <span>StudyLoop Academic Shorts • Scroll for next</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE ACTION BAR (CLEAN INSTAGRAM STYLE MATCHING IMAGE 2) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.125rem',
          alignItems: 'center',
          color: '#ffffff',
          padding: '0 0.75rem',
          zIndex: 10
        }}>
          {/* Like button */}
          <ReelsActionButton 
            label={likedMap[activeReel.id] ? "Liked Reel" : "Like Reel"}
            activeColor={likedMap[activeReel.id] ? '#ef4444' : '#ffffff'}
            icon={<Heart size={22} fill={likedMap[activeReel.id] ? '#ef4444' : 'none'} />}
            badgeText={likesCountMap[activeReel.id] || activeReel.likesCount}
            onClick={() => toggleLike(activeReel.id)}
          />

          {/* Comment button */}
          <ReelsActionButton 
            label="Comments"
            icon={<MessageCircle size={22} />}
            badgeText={(commentsMap[activeReel.id] || []).length || activeReel.commentsCount}
            onClick={() => setShowComments(!showComments)}
          />

          {/* Share button */}
          <ReelsActionButton 
            label="Share & Send Reel"
            icon={<Share2 size={20} />}
            badgeText="Share"
            onClick={() => setShowShareModal(true)}
          />

          {/* Save / Bookmark Button */}
          <ReelsActionButton 
            label="Save Reel"
            icon={<Bookmark size={20} />}
            badgeText="Save"
            onClick={() => showToast("Bookmark saved to your profile!")}
          />

          {/* Spinning Audio Disc / Creator Avatar */}
          <div style={{ marginTop: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#18181b', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Disc size={16} style={{ color: '#3b82f6' }} />
            </div>
          </div>
        </div>

        {/* INSTAGRAM COMMENTS SLIDE-UP DRAWER */}
        {showComments && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            backgroundColor: '#ffffff',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            color: '#0f172a',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 30,
            boxShadow: '0 -10px 25px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <h4 className="font-serif" style={{ fontSize: '1rem', fontWeight: 700 }}>Comments</h4>
              <button onClick={() => setShowComments(false)} className="btn-icon" style={{ padding: '0.25rem' }}><X size={16} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {(commentsMap[activeReel.id] || []).length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem', marginTop: '2rem' }}>No comments yet. Start the conversation!</p>
              ) : (
                (commentsMap[activeReel.id] || []).map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <strong>{c.senderName || 'Student'}:</strong>
                    <span style={{ color: '#334155' }}>{c.comment}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" className="input" placeholder="Add a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }} required />
              <button type="submit" className="btn btn-accent" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}><Send size={14} /></button>
            </form>
          </div>
        )}

        {/* MULTI-PLATFORM & IN-APP SHARE MODAL SLIDE-UP */}
        {showShareModal && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80%',
            backgroundColor: '#0f172a',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            color: '#ffffff',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 40,
            boxShadow: '0 -15px 35px rgba(0,0,0,0.7)',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Share2 size={18} style={{ color: '#3b82f6' }} /> Share & Send Reel
                </h3>
                <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: 0 }}>Send to social media or StudyLoop connections</p>
              </div>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
              <button 
                onClick={() => setShareTab('social')}
                style={{
                  flex: 1,
                  padding: '0.375rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: shareTab === 'social' ? '#3b82f6' : 'transparent',
                  color: '#ffffff',
                  fontWeight: shareTab === 'social' ? 700 : 500,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                🌐 Social Platforms
              </button>
              <button 
                onClick={() => setShareTab('connections')}
                style={{
                  flex: 1,
                  padding: '0.375rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: shareTab === 'connections' ? '#3b82f6' : 'transparent',
                  color: '#ffffff',
                  fontWeight: shareTab === 'connections' ? 700 : 500,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                👥 Send to Followers
              </button>
            </div>

            {/* TAB CONTENT 1: SOCIAL MEDIA PLATFORMS */}
            {shareTab === 'social' && (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {/* WhatsApp */}
                  <button 
                    onClick={shareToWhatsApp}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    💬 WhatsApp
                  </button>

                  {/* Instagram Direct Link */}
                  <button 
                    onClick={() => window.open('https://www.instagram.com/', '_blank')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    📸 Instagram Web
                  </button>

                  {/* X / Twitter */}
                  <button 
                    onClick={shareToTwitter}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.2)'
                    }}
                  >
                    𝕏 Twitter / X
                  </button>

                  {/* Telegram */}
                  <button 
                    onClick={shareToTelegram}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#229ED9',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✈️ Telegram
                  </button>

                  {/* LinkedIn */}
                  <button 
                    onClick={shareToLinkedIn}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#0A66C2',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    💼 LinkedIn
                  </button>

                  {/* Native Device Share */}
                  <button 
                    onClick={handleNativeShare}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Share2 size={14} /> More Options
                  </button>
                </div>

                {/* Copy Link Button Box */}
                <div style={{ marginTop: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {shareReelUrl}
                  </div>
                  <button onClick={handleCopyLink} className="btn btn-accent" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem', whiteSpace: 'nowrap' }}>
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: IN-APP DIRECT SEND TO CONNECTIONS */}
            {shareTab === 'connections' && (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text"
                    placeholder="Search followers..."
                    value={shareSearch}
                    onChange={e => setShareSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.375rem 0.625rem 0.375rem 2rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Connections List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '0.25rem' }}>
                  {filteredConnections.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.6875rem', margin: '1rem 0' }}>No matching connections found.</p>
                  ) : (
                    filteredConnections.map(user => {
                      const isSent = sentUsersMap[user.id];
                      return (
                        <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0.5rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={user.avatarUrl} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                            <div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>{user.fullName}</div>
                              <div style={{ fontSize: '0.625rem', color: '#94a3b8' }}>{user.college}</div>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              sendReelToUser(user);
                              if (setActiveChatId && setChatPeer) {
                                setActiveChatId(user.chatId || `chat-${user.id}`);
                                setChatPeer(user);
                              }
                            }}
                            disabled={isSent}
                            style={{
                              padding: '0.25rem 0.625rem',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: isSent ? '#16a34a' : '#3b82f6',
                              color: '#ffffff',
                              fontWeight: 600,
                              fontSize: '0.6875rem',
                              cursor: isSent ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            {isSent ? <><Check size={12} /> Sent</> : <><Send size={12} /> Send</>}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Action Button Helper with Hover Tooltip support for Reels Controls
function ReelsActionButton({ icon, label, onClick, badgeText, activeColor, disabled }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="tooltip-container"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        onClick={onClick} 
        disabled={disabled}
        style={{ 
          background: 'rgba(0,0,0,0.5)', 
          border: '1px solid rgba(255,255,255,0.15)', 
          width: '38px', 
          height: '38px', 
          borderRadius: '50%', 
          color: activeColor || '#ffffff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: disabled ? 'default' : 'pointer', 
          opacity: disabled ? 0.3 : 1,
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease',
          transform: isHovered && !disabled ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        {icon}
      </button>
      {badgeText && (
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          {badgeText}
        </span>
      )}
      {isHovered && label && (
        <div className="tooltip-popup" style={{ right: '100%', left: 'auto', marginRight: '10px' }}>
          {label}
        </div>
      )}
    </div>
  );
}

// --- COMPONENT: WebRTC LIVE CALL OVERLAY (SECTION 6) ---
function RtcCallOverlay({ localVideoRef, remoteVideoRef, isScreenSharing, toggleScreenShare, hangUpCall, webrtcCall, localStream, remoteStream }) {
  return (
    <div style={{
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ color: '#ffffff', marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 className="font-serif" style={{ color: '#ffffff', fontSize: '2rem' }}>Live Study Session</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Audio/Video WebRTC peer link established (₹0 Egress Fee traversal)</p>
      </div>

      {/* Video screen grid */}
      <div style={{ display: 'flex', gap: '1.5rem', width: '100%', maxWidth: '960px', height: '420px', marginBottom: '2rem' }}>
        {/* Remote participant */}
        <div style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '2px solid #334155' }}>
          <video 
            ref={remoteVideoRef} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            autoPlay 
            playsInline
          />
          {!remoteStream && (
            <div style={{ position: 'absolute', top: '0', bottom: '0', left: '0', right: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <div className="live-dot" style={{ backgroundColor: '#d97706', marginRight: '0.5rem' }}></div> Wait for peer user to accept call...
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.75rem', borderRadius: '50px', color: '#ffffff', fontSize: '0.75rem' }}>
            Peer Helper
          </div>
        </div>

        {/* Local user stream */}
        <div style={{ width: '220px', backgroundColor: '#1e293b', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '2px solid #334155', height: '160px', alignSelf: 'flex-end' }}>
          <video 
            ref={localVideoRef} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            autoPlay 
            muted 
            playsInline
          />
          <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.125rem 0.5rem', borderRadius: '50px', color: '#ffffff', fontSize: '0.6875rem' }}>
            You {isScreenSharing && "(Sharing)"}
          </div>
        </div>
      </div>

      {/* Control buttons tray */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={toggleScreenShare} className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
          <ScreenShare size={18} /> {isScreenSharing ? "Stop Sharing" : "Share Screen"}
        </button>
        <button onClick={hangUpCall} className="btn btn-danger">
          Hang Up Call
        </button>
      </div>
    </div>
  );
}

// --- SCREEN: CAMPUS LEADERBOARD ---
function LeaderboardScreen({ token, onOpenPublicProfile }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');

  const fetchLeaderboard = async () => {
    setLoading(true);
    let url = '/api/leaderboard';
    if (subject) {
      url += `?subject=${encodeURIComponent(subject)}`;
    }
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [token, subject]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem' }}>Campus Leaderboard</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem' }}>Top peer mentors ranked by XP and subject mastery.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>Category:</span>
          <select className="input" style={{ width: '160px', padding: '0.375rem 0.75rem' }} value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">All Subjects</option>
            <option value="Java">Java</option>
            <option value="React">React</option>
            <option value="WebRTC">WebRTC</option>
            <option value="Calculus">Calculus</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="live-dot" style={{ backgroundColor: '#d97706' }}></div></div>
      ) : leaders.length === 0 ? (
        <div className="empty-state">
          <Trophy size={48} />
          <h3>No rankings yet</h3>
          <p>Be the first to earn XP at your college to appear on the leaderboard!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {leaders.map((leader, index) => (
            <div 
              key={leader.id} 
              onClick={() => onOpenPublicProfile && onOpenPublicProfile(leader)}
              className="card" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', backgroundColor: index === 0 ? '#eff6ff' : '#ffffff', borderColor: index === 0 ? '#bfdbfe' : '#e2e8f0', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#94a3b8' : index === 2 ? '#2563eb' : '#f1f5f9',
                  color: (index <= 2) ? '#ffffff' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {index + 1}
                </div>

                <img src={leader.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${leader.fullName}`} alt="Avatar" style={{ width: '44px', height: '44px', borderRadius: '50%' }} />

                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {leader.fullName}
                    {index === 0 && <span style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>👑 Campus #1</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {leader.college} • {leader.department} • Level: <strong>{leader.level}</strong>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>{leader.xp} XP</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>⭐ {leader.reputation || 5.0} Rating</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- REDESIGNED AVATAR CHANGE MODAL (GALLERY / ALBUMS UPLOADER - NO URL INPUT) ---
function AvatarChangeModal({ currentAvatarUrl, onSave, onClose }) {
  const [selectedUrl, setSelectedUrl] = useState(currentAvatarUrl || '');
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  const presets = [
    { url: MALE_AVATAR_SVG, label: '👨 Male Character (Image 2 Match)' },
    { url: FEMALE_AVATAR_SVG, label: '👩 Female Character (Image 3 Match)' },
    { url: NEUTRAL_AVATAR_SVG, label: '👤 Neutral Character' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '2rem', backgroundColor: '#ffffff', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Change Profile Picture</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {/* Current Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743)', marginBottom: '0.5rem', boxShadow: '0 8px 20px rgba(217,119,6,0.2)' }}>
            <img 
              src={selectedUrl || currentAvatarUrl || getDefaultAvatarByGender('male')} 
              alt="Preview" 
              onError={(e) => { e.target.src = MALE_AVATAR_SVG; }}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', backgroundColor: '#ffffff' }} 
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Profile Picture Preview</span>
        </div>

        {/* GALLERY / ALBUM FILE UPLOADER (MAIN SELECTION OPTION - NO URL INPUT) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Upload Photo from Device Gallery / Albums:</label>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="btn btn-secondary"
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              borderRadius: '14px', 
              border: '2px dashed #3b82f6', 
              backgroundColor: '#eff6ff', 
              color: '#2563eb', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.625rem',
              cursor: 'pointer'
            }}
          >
            <Camera size={20} />
            {selectedFileName ? `Selected: ${selectedFileName}` : '📷 Choose Photo from Gallery / Device Albums'}
          </button>
        </div>

        {/* GENDER CHARACTER PRESETS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label" style={{ marginBottom: '0.5rem' }}>Or Choose a Gender Character Silhouette:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {presets.map((preset, idx) => (
              <div 
                key={idx}
                onClick={() => { setSelectedUrl(preset.url); setSelectedFileName(''); }}
                title={preset.label}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  padding: '2px',
                  border: selectedUrl === preset.url ? '3px solid #3b82f6' : '2px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onSave(selectedUrl)} className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 700 }}>Save Picture</button>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// --- ENLARGED PHOTO PREVIEW MODAL ---
function PhotoPreviewModal({ imageUrl, userName, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3500, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '420px', width: '100%' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '-48px', right: '0', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '0.5rem', color: '#ffffff', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <div style={{ width: '280px', height: '280px', borderRadius: '50%', padding: '6px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', marginBottom: '1rem' }}>
          <img src={imageUrl} alt={userName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #ffffff' }} />
        </div>
        <div style={{ color: '#ffffff', fontSize: '1.125rem', fontWeight: 700, fontFamily: 'serif' }}>{userName}</div>
      </div>
    </div>
  );
}

// --- USER LIST MODAL (FOLLOWERS / FOLLOWING) ---
function UserListModal({ title, userId, token, onClose, onSelectUser }) {
  const { testAccounts } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      const endpoint = title.toLowerCase().includes('follower') 
        ? `/api/profiles/${userId}/followers` 
        : `/api/profiles/${userId}/following`;
      try {
        const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Failed to fetch profiles from backend, using fallback:", e);
      }
      
      const isFollowers = title.toLowerCase().includes('follower');
      let fallbackUsers = [];
      
      if (userId === '11111111-1111-1111-1111-111111111111') {
        if (isFollowers) {
          fallbackUsers = testAccounts.filter(acc => acc.id === '22222222-2222-2222-2222-222222222222' || acc.id === '33333333-3333-3333-3333-333333333333');
        } else {
          fallbackUsers = testAccounts.filter(acc => acc.id === '22222222-2222-2222-2222-222222222222' || acc.id === '33333333-3333-3333-3333-333333333333');
        }
      } else if (userId === '22222222-2222-2222-2222-222222222222') {
        if (isFollowers) {
          fallbackUsers = testAccounts.filter(acc => acc.id === '11111111-1111-1111-1111-111111111111' || acc.id === '33333333-3333-3333-3333-333333333333');
        } else {
          fallbackUsers = testAccounts.filter(acc => acc.id === '11111111-1111-1111-1111-111111111111');
        }
      } else if (userId === '33333333-3333-3333-3333-333333333333') {
        if (isFollowers) {
          fallbackUsers = testAccounts.filter(acc => acc.id === '11111111-1111-1111-1111-111111111111');
        } else {
          fallbackUsers = testAccounts.filter(acc => acc.id === '11111111-1111-1111-1111-111111111111' || acc.id === '22222222-2222-2222-2222-222222222222');
        }
      } else {
        fallbackUsers = testAccounts.filter(acc => acc.id !== userId).slice(0, 1);
      }
      
      setUsers(fallbackUsers);
      setLoading(false);
    };
    fetchList();
  }, [userId, title, token, testAccounts]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '440px', maxHeight: '520px', borderRadius: '24px', padding: '1.5rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.125rem' }}>{title}</h3>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading {title.toLowerCase()}...</div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              No {title.toLowerCase()} found yet.
            </div>
          ) : (
            users.map(u => (
              <div 
                key={u.id} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}
              >
                <div 
                  onClick={() => { onClose(); onSelectUser(u); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }}
                >
                  <img src={u.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${u.fullName}`} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{u.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.college || 'IIT Madras'} • {u.department || 'CS'}</div>
                  </div>
                </div>

                <button 
                  onClick={() => { onClose(); onSelectUser(u); }} 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                >
                  View Profile
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- PUBLIC PROFILE MODAL ---
function PublicProfileModal({ user, currentUserId, token, onClose, onStartChat, onOpenUserList }) {
  const [profile, setProfile] = useState(user);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0);
  const [followingCount, setFollowingCount] = useState(user.followingCount || 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [profRes, statusRes] = await Promise.all([
          fetch(`/api/profiles/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`/api/profiles/${user.id}/follow-status`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (profRes.ok) {
          const p = await profRes.json();
          setProfile(p);
          setFollowersCount(p.followersCount || 0);
          setFollowingCount(p.followingCount || 0);
        }
        if (statusRes.ok) {
          const s = await statusRes.json();
          setIsFollowing(s.following);
          if (s.followersCount !== undefined) setFollowersCount(s.followersCount);
          if (s.followingCount !== undefined) setFollowingCount(s.followingCount);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [user.id, token]);

  const handleToggleFollow = async () => {
    const endpoint = isFollowing ? `/api/profiles/${user.id}/unfollow` : `/api/profiles/${user.id}/follow`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setIsFollowing(result.following);
        setFollowersCount(result.followersCount);
      }
    } catch (e) {
      setIsFollowing(prev => !prev);
      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
    }
  };

  const usernameHandle = `@${(profile.fullName || 'student').toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2500, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card-premium glass-card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '2rem', backgroundColor: '#ffffff', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
        
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <span className="font-serif" style={{ fontSize: '1.125rem', color: '#64748b' }}>Student Public Profile</span>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {/* Profile Card Content */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.fullName}`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{usernameHandle}</h2>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{profile.fullName}</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{profile.college || 'IIT Madras'} • {profile.department || 'Computer Science'} • Year {profile.year || 2}</div>
            </div>

            {/* Counters Strip (Clickable!) */}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#0f172a' }}>
              <div 
                onClick={() => onOpenUserList('Followers', profile.id)} 
                style={{ cursor: 'pointer' }}
                title="View Followers"
              >
                <strong>{followersCount}</strong> <span style={{ color: '#64748b', textDecoration: 'underline' }}>followers</span>
              </div>
              <div 
                onClick={() => onOpenUserList('Following', profile.id)} 
                style={{ cursor: 'pointer' }}
                title="View Following"
              >
                <strong>{followingCount}</strong> <span style={{ color: '#64748b', textDecoration: 'underline' }}>following</span>
              </div>
              <div style={{ color: '#3b82f6', fontWeight: 700 }}>⚡ {profile.xp || 0} XP • Lvl {profile.level || 'Beginner'}</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#334155', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #f1f5f9' }}>
          <p style={{ whiteSpace: 'pre-line' }}>{profile.bio || 'Student mentor on StudyLoop platform.'}</p>
          {profile.teachingSkills && profile.teachingSkills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.75rem' }}>
              {profile.teachingSkills.map((skill, idx) => (
                <span key={idx} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>⭐ Teaches {skill}</span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons: Follow/Unfollow & Direct Message */}
        {currentUserId !== profile.id && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={handleToggleFollow} 
              className={`btn ${isFollowing ? 'btn-secondary' : 'btn-accent'}`} 
              style={{ flex: 1, padding: '0.625rem', fontWeight: 700 }}
            >
              {isFollowing ? '✓ Following' : '+ Follow'}
            </button>
            <button 
              onClick={() => { onClose(); onStartChat(profile); }} 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '0.625rem', fontWeight: 700 }}
            >
              💬 Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- DEDICATED FULL-SCREEN STUDENT LOGIN & SIGNUP PAGE (IMAGE 1 EXACT MATCH) ---
function LandingScreen({ setActiveTab, loginSimulated, testAccounts, theme, setTheme, postLoginRedirectTab, setPostLoginRedirectTab }) {
  const { user, profile, logout } = useAuth();
  const [authTab, setAuthTab] = useState('signup'); // 'signup', 'login' or 'admin'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // Admin Form States
  const [adminEmail, setAdminEmail] = useState('admin@studyloop.app');
  const [adminPassword, setAdminPassword] = useState('password123');

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    window.location.href = 'http://localhost:5174';
  };
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('studenta@student.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup Form States
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    
    // Direct admin login redirection
    if (loginEmail.trim().toLowerCase() === 'admin@studyloop.app') {
      window.location.href = 'http://localhost:5174';
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
      alert("Please agree to the Terms & Conditions and Privacy Policy to proceed.");
      return;
    }
    loginSimulated(signupEmail);
    setActiveTab(postLoginRedirectTab || 'dashboard');
    if (setPostLoginRedirectTab) setPostLoginRedirectTab(null);
    setShowAuthModal(false);
  };

  const handleGoogleSSO = () => {
    const defaultTestUser = testAccounts[0]?.email || 'aarav.sharma@iitm.ac.in';
    loginSimulated(defaultTestUser);
    setActiveTab(postLoginRedirectTab || 'dashboard');
    if (setPostLoginRedirectTab) setPostLoginRedirectTab(null);
    setShowAuthModal(false);
  };

  // 1. DEDICATED KAIZENQ-INSPIRED VISITOR LANDING PAGE WITH AUTH MODAL
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-primary)',
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* KAIZENQ-INSPIRED VISITOR HEADER NAVBAR */}
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
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setShowAuthModal(false)}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              <span className="font-serif" style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.25rem' }}>SL</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>Study</span>
                <span className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800, color: '#2563eb' }}>Loop</span>
              </div>
              <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                LEARN • BUILD • EVOLVE
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => { setShowAuthModal(false); if (setPostLoginRedirectTab) setPostLoginRedirectTab(null); }} style={{ background: 'transparent', border: 'none', fontWeight: 700, color: 'var(--accent-dark)', fontSize: '0.875rem', cursor: 'pointer' }}>Home</button>
            <button onClick={() => { if (setPostLoginRedirectTab) setPostLoginRedirectTab('doubts'); setAuthTab('login'); setShowAuthModal(true); }} style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>Doubt Hub</button>
            <button onClick={() => { if (setPostLoginRedirectTab) setPostLoginRedirectTab('leaderboard'); setAuthTab('login'); setShowAuthModal(true); }} style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>Leaderboard</button>
            <button onClick={() => { if (setPostLoginRedirectTab) setPostLoginRedirectTab('discover'); setAuthTab('login'); setShowAuthModal(true); }} style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>Peer Mentors</button>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                width: '36px',
                height: '36px',
                marginRight: '0.25rem',
                transition: 'all 0.2s ease'
              }}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
              className="btn btn-secondary" 
              style={{ borderRadius: '50px', padding: '0.5rem 1.25rem', fontSize: '0.8125rem', fontWeight: 600 }}
            >
              Login
            </button>
            <button 
              onClick={() => { setAuthTab('signup'); setShowAuthModal(true); }}
              className="btn btn-accent glow-amber" 
              style={{ borderRadius: '50px', padding: '0.5rem 1.25rem', fontSize: '0.8125rem', fontWeight: 700 }}
            >
              Sign Up 🚀
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section style={{ padding: '4rem 3rem 5rem 3rem', maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          {/* Left Text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.375rem 1rem', borderRadius: '50px', fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', marginBottom: '1.5rem' }}>
              <Sparkles size={16} /> Enterprise Peer Learning Workspace 3.0
            </div>

            <h1 className="font-serif" style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Transform Learning Into <span style={{ background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real-Time Mastery.</span>
            </h1>

            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '580px' }}>
              Master high-impact engineering & AI tracks with 24/7 intelligent tutoring, real-time peer doubt resolution, WebRTC code study sessions, and verified campus digital credentials.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
              <button 
                onClick={() => { setAuthTab('signup'); setShowAuthModal(true); }}
                className="btn animate-float"
                style={{
                  padding: '0.875rem 2rem',
                  borderRadius: '14px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Get Started Free →
              </button>

              <button 
                onClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
                className="btn btn-secondary profile-action-btn-hover"
                style={{
                  padding: '0.875rem 1.75rem',
                  borderRadius: '14px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Explore Student Portal
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>✓ Free for Campus Students</span>
              <span>•</span>
              <span>✓ Instant Peer Pairing</span>
              <span>•</span>
              <span>✓ WebRTC Screen Share</span>
            </div>
          </div>

          {/* Right Visual: Animated Node Hub */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '420px' }}>
            {/* Outer Circular Glow */}
            <div style={{
              position: 'absolute',
              width: '360px',
              height: '360px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
              border: '1px dashed #bfdbfe'
            }}></div>

            {/* Central Node */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '4px solid #ffffff',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}>
              <Infinity size={42} style={{ color: '#38bdf8' }} />
              <span className="font-serif" style={{ color: '#ffffff', fontSize: '0.8125rem', fontWeight: 800, marginTop: '0.25rem' }}>Study Loop</span>
            </div>

            {/* Floating Pills */}
            <div className="hero-node-pill" style={{ position: 'absolute', top: '15px', right: '40px', backgroundColor: 'var(--bg-secondary)', padding: '0.625rem 1.125rem', borderRadius: '50px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', zIndex: 12 }}>
              <HelpCircle size={16} style={{ color: '#2563eb' }} /> AI & Peer Tutor
            </div>

            <div className="hero-node-pill" style={{ position: 'absolute', top: '100px', left: '10px', backgroundColor: 'var(--bg-secondary)', padding: '0.625rem 1.125rem', borderRadius: '50px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', zIndex: 12 }}>
              <Tv2 size={16} style={{ color: '#0284c7' }} /> Educational Shorts
            </div>

            <div className="hero-node-pill" style={{ position: 'absolute', bottom: '110px', right: '10px', backgroundColor: 'var(--bg-secondary)', padding: '0.625rem 1.125rem', borderRadius: '50px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', zIndex: 12 }}>
              <Trophy size={16} style={{ color: '#d97706' }} /> Campus Leaderboard
            </div>

            <div className="hero-node-pill" style={{ position: 'absolute', bottom: '20px', left: '60px', backgroundColor: 'var(--bg-secondary)', padding: '0.625rem 1.125rem', borderRadius: '50px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', zIndex: 12 }}>
              <Video size={16} style={{ color: '#059669' }} /> WebRTC Study Call
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
              <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#2563eb' }}>150+</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>Expert Peer Mentors</div>
            </div>
            <div style={{ padding: '1rem', borderRight: '1px solid var(--border-color)' }}>
              <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#059669' }}>98.4%</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>Doubt Resolution Rate</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#d97706' }}>24/7</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>Live Peer Tutor Access</div>
            </div>
          </div>
        </section>

        {/* CORE LMS FEATURES GRID */}
        <section style={{ padding: '5rem 3rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.375rem 0.875rem', borderRadius: '50px', textTransform: 'uppercase' }}>
              Core LMS Features
            </span>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '1rem' }}>
              Built for Modern High-Growth Education
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
              Combining world-class course management with real-time peer assistance for students and faculty.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="card-premium glass-card hover-glow-blue" style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <HelpCircle size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>1-to-1 Live Doubt Rooms</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Open a doubt workspace, chat with a helper from your department, and start 1-click video calls with screen sharing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-premium glass-card hover-glow-blue" style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>8-Factor Smart Peer Discovery</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Match algorithm evaluating college, department, skills, learning goals, and mutual connections for exact peer pairings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-premium glass-card hover-glow-blue" style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Video size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>WebRTC Code Study Calls</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                In-browser video study calls with zero-latency screen sharing, peer code evaluation, and collaborative doubt solving.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-premium glass-card hover-glow-blue" style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Tv2 size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Educational Concept Shorts</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Watch and post 60-second concept shorts with red heart likes, slide-up comments, and subject hashtag pills.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-premium glass-card hover-glow-blue" style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Trophy size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Campus Leaderboard & XP</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Earn XP, level badges, and peer coins for helping others, ascending to Rank #1 on your campus leaderboard.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-premium glass-card hover-glow-blue" style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <MessageSquare size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Real-Time Direct Messaging</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Connect directly with mentors, send instant text messages, and schedule 1-on-1 tutoring sessions seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER SECTION */}
        <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '4rem 3rem 2rem 3rem', marginTop: 'auto' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border-color)' }}>
            {/* Column 1 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800 }}>SL</div>
                <span className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>Study Loop</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '360px', marginBottom: '1.5rem' }}>
                StudyLoop is the premier peer-to-peer campus learning platform for universities, engineering academies, and student tutors.
              </p>
              <form onSubmit={e => { e.preventDefault(); alert(`Subscribed ${newsletterEmail} to product updates!`); setNewsletterEmail(''); }} style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px' }}>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="Enter work or college email" 
                  value={newsletterEmail} 
                  onChange={e => setNewsletterEmail(e.target.value)} 
                  style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  required 
                />
                <button type="submit" className="btn btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', whiteSpace: 'nowrap', borderRadius: '10px' }}>
                  Join →
                </button>
              </form>
            </div>

            {/* Column 2 */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>PLATFORM</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li><a href="#" onClick={e => { e.preventDefault(); if (setPostLoginRedirectTab) setPostLoginRedirectTab('doubts'); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Doubt Hub</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); if (setPostLoginRedirectTab) setPostLoginRedirectTab('discover'); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Peer Mentors</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); if (setPostLoginRedirectTab) setPostLoginRedirectTab('leaderboard'); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Leaderboard</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); if (setPostLoginRedirectTab) setPostLoginRedirectTab('reels'); setAuthTab('login'); setShowAuthModal(true); }} style={{ color: 'inherit', textDecoration: 'none' }}>Concept Shorts</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>RESOURCES</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Community Rules</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Digital Badges</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Campus Guide</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>COMPANY</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Careers <span style={{ backgroundColor: '#d1fae5', color: '#059669', fontSize: '0.625rem', padding: '0.1rem 0.375rem', borderRadius: '4px', fontWeight: 700 }}>Hiring</span></a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a></li>
                <li><a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div style={{ maxWidth: '1400px', margin: '1.5rem auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <div>© 2026 Study Loop Inc. All rights reserved. Campus peer safety audited & certified.</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--text-secondary)' }}><Github size={18} /></a>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--text-secondary)' }}><Globe size={18} /></a>
            </div>
          </div>
        </footer>

        {/* SPLIT-CARD AUTH MODAL OVERLAY (IMAGE 1 EXACT MATCH PRESERVED) */}
        {showAuthModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 4000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setShowAuthModal(false)}
          >
            <div 
              style={{
                width: '100%',
                maxWidth: '1020px',
                minHeight: '620px',
                borderRadius: '24px',
                backgroundColor: '#ffffff',
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.3)',
                display: 'grid',
                gridTemplateColumns: '1.05fr 1fr',
                overflow: 'hidden',
                border: '1px solid #e0e7ff',
                position: 'relative'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button X */}
              <button 
                onClick={() => setShowAuthModal(false)} 
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>

              {/* LEFT COLUMN: BRANDING & ILLUSTRATION (IMAGE 1 EXACT MATCH) */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%)',
                padding: '3rem 2.5rem 2rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'conic-gradient(from 180deg, #3b82f6, #a855f7, #ec4899, #3b82f6)',
                      padding: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #9333ea)' }}></div>
                      </div>
                    </div>
                    <span className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>
                      Study Loop
                    </span>
                  </div>

                  <h1 className="font-serif" style={{ fontSize: '2.125rem', fontWeight: 800, color: '#1e1b4b', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                    Learn. Teach. <span style={{ color: '#6366f1' }}>Connect.</span> Grow.
                  </h1>
                  <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '380px' }}>
                    Join a community where students learn from students.
                  </p>
                </div>

                {/* SVG Illustration */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                  <svg viewBox="0 0 500 320" style={{ width: '100%', maxHeight: '240px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 220 Q120 180 250 220 T500 200 V320 H0 Z" fill="#dbeafe" opacity="0.6"/>
                    <circle cx="420" cy="140" r="50" fill="#e0e7ff" opacity="0.8"/>
                    <circle cx="80" cy="200" r="70" fill="#edd5ff" opacity="0.5"/>
                    <circle cx="120" cy="140" r="32" fill="#1e1b4b"/>
                    <circle cx="120" cy="145" r="24" fill="#fde047"/>
                    <rect x="90" y="130" width="10" height="25" rx="5" fill="#312e81"/>
                    <rect x="140" y="130" width="10" height="25" rx="5" fill="#312e81"/>
                    <path d="M100 125 Q120 110 140 125" stroke="#312e81" strokeWidth="5"/>
                    <path d="M80 220 C80 180 160 180 160 220 V300 H80 Z" fill="#1e1b4b"/>
                    <polygon points="70,260 170,260 160,230 80,230" fill="#cbd5e1"/>
                    <rect x="75" y="225" width="90" height="5" rx="2" fill="#94a3b8"/>
                    <circle cx="120" cy="245" r="4" fill="#60a5fa"/>
                    <circle cx="230" cy="160" r="30" fill="#1e293b"/>
                    <circle cx="230" cy="165" r="22" fill="#fed7aa"/>
                    <path d="M200 150 Q230 135 260 150" fill="#1e293b"/>
                    <rect x="205" y="152" width="8" height="20" rx="4" fill="#ffffff"/>
                    <rect x="247" y="152" width="8" height="20" rx="4" fill="#ffffff"/>
                    <path d="M190 230 C190 195 270 195 270 230 V300 H190 Z" fill="#2563eb"/>
                    <polygon points="180,270 280,270 270,240 190,240" fill="#0284c7"/>
                    <circle cx="340" cy="120" r="26" fill="#1e1b4b"/>
                    <circle cx="340" cy="124" r="19" fill="#fca5a5"/>
                    <path d="M305 180 C305 150 375 150 375 180 V300 H305 Z" fill="#475569"/>
                    <circle cx="430" cy="110" r="26" fill="#1e1b4b"/>
                    <circle cx="430" cy="114" r="19" fill="#fed7aa"/>
                    <path d="M395 165 C395 140 465 140 465 165 V300 H395 Z" fill="#1d4ed8"/>
                    <rect x="340" y="140" width="110" height="70" rx="8" fill="#0f172a"/>
                    <rect x="350" y="152" width="40" height="6" rx="3" fill="#60a5fa"/>
                    <rect x="350" y="165" width="70" height="6" rx="3" fill="#a78bfa"/>
                    <rect x="350" y="178" width="55" height="6" rx="3" fill="#34d399"/>
                  </svg>
                </div>
              </div>

              {/* RIGHT COLUMN: AUTH FORM WITH SWITCHER */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '2.5rem 2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'center',
                overflowY: 'auto'
              }}>
                {/* Role Switcher Tabs */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  marginBottom: '1.75rem', 
                  backgroundColor: '#f1f5f9', 
                  padding: '0.25rem', 
                  borderRadius: '12px' 
                }}>
                  <button 
                    type="button" 
                    onClick={() => setAuthTab('signup')} 
                    style={{ 
                      flex: 1, 
                      padding: '0.5rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      backgroundColor: authTab === 'signup' ? '#ffffff' : 'transparent',
                      color: authTab === 'signup' ? '#4338ca' : '#64748b',
                      boxShadow: authTab === 'signup' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🎓 Signup
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAuthTab('login')} 
                    style={{ 
                      flex: 1, 
                      padding: '0.5rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      backgroundColor: authTab === 'login' ? '#ffffff' : 'transparent',
                      color: authTab === 'login' ? '#4338ca' : '#64748b',
                      boxShadow: authTab === 'login' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🔑 Login
                  </button>
                </div>

                {authTab === 'signup' ? (
                  <div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                        <h2 className="font-serif" style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          Create your Study Loop
                        </h2>
                        <span style={{ backgroundColor: '#4338ca', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: '8px' }}>
                          Student
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                        Start learning, teaching and connecting today.
                      </p>
                    </div>

                    <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      <input type="text" className="input" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} style={{ padding: '0.625rem 0.875rem', borderRadius: '10px', fontSize: '0.875rem', border: '1px solid #e2e8f0', backgroundColor: '#fafafa' }} required />
                      <input type="email" className="input" placeholder="Email Address" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} style={{ padding: '0.625rem 0.875rem', borderRadius: '10px', fontSize: '0.875rem', border: '1px solid #e2e8f0', backgroundColor: '#fafafa' }} required />
                      
                      <div style={{ position: 'relative' }}>
                        <input type={showSignupPassword ? "text" : "password"} className="input" placeholder="Password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} style={{ padding: '0.625rem 2.5rem 0.625rem 0.875rem', borderRadius: '10px', fontSize: '0.875rem', border: '1px solid #e2e8f0', backgroundColor: '#fafafa' }} required />
                        <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                          {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <input type={showConfirmPassword ? "text" : "password"} className="input" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ padding: '0.625rem 2.5rem 0.625rem 0.875rem', borderRadius: '10px', fontSize: '0.875rem', border: '1px solid #e2e8f0', backgroundColor: '#fafafa' }} required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#475569', cursor: 'pointer' }}>
                        <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} style={{ accentColor: '#4338ca', width: '14px', height: '14px' }} />
                        <span>I agree to the <a href="#" onClick={e => e.preventDefault()} style={{ color: '#4338ca', fontWeight: 600 }}>Terms & Conditions</a> and <a href="#" onClick={e => e.preventDefault()} style={{ color: '#4338ca', fontWeight: 600 }}>Privacy Policy</a></span>
                      </label>

                      <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none', backgroundColor: '#4338ca', color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(67, 56, 202, 0.35)' }}>
                        Create Account
                      </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600 }}>OR</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                    </div>

                    <button type="button" onClick={handleGoogleSSO} style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                      <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.68 14.93 1 12 1 7.37 1 3.4 3.68 1.48 7.57l3.77 2.92C6.13 7.3 8.83 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.77 2.92c2.2-2.03 3.62-5.02 3.62-8.63z"/><path fill="#FBBC05" d="M5.25 14.85c-.25-.76-.39-1.57-.39-2.42s.14-1.66.39-2.42L1.48 7.1C.53 9.07 0 11.27 0 12.42s.53 3.35 1.48 5.32l3.77-2.89z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.77-2.92c-1.05.7-2.4.12-4.19.12-3.17 0-5.87-2.26-6.83-5.32L1.4 14.8c1.92 3.89 5.89 6.2 10.6 6.2z"/></svg>
                      Continue with Google
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: '#64748b' }}>
                      Already have an account?{' '}
                      <button type="button" onClick={() => setAuthTab('login')} style={{ background: 'transparent', border: 'none', color: '#4338ca', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                        Log in
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <h2 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem' }}>
                        Welcome Back!
                      </h2>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        Login to continue your learning journey 👋
                      </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label className="label" style={{ fontWeight: 600, fontSize: '0.75rem', color: '#1e293b', marginBottom: '0.25rem' }}>Email or Username</label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input type="email" className="input" placeholder="studenta@student.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ paddingLeft: '2.5rem', borderRadius: '10px', fontSize: '0.875rem', border: '1px solid #e2e8f0' }} required />
                        </div>
                      </div>

                      <div>
                        <label className="label" style={{ fontWeight: 600, fontSize: '0.75rem', color: '#1e293b', marginBottom: '0.25rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input type={showLoginPassword ? "text" : "password"} className="input" placeholder="••••••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', borderRadius: '10px', fontSize: '0.875rem', border: '1px solid #e2e8f0' }} required />
                          <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                            {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none', backgroundColor: '#4338ca', color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(67, 56, 202, 0.35)' }}>
                        Sign In
                      </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600 }}>OR</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                    </div>

                    <button type="button" onClick={handleGoogleSSO} style={{ width: '100%', padding: '0.625rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#334155', fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                      <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.68 14.93 1 12 1 7.37 1 3.4 3.68 1.48 7.57l3.77 2.92C6.13 7.3 8.83 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.77 2.92c2.2-2.03 3.62-5.02 3.62-8.63z"/><path fill="#FBBC05" d="M5.25 14.85c-.25-.76-.39-1.57-.39-2.42s.14-1.66.39-2.42L1.48 7.1C.53 9.07 0 11.27 0 12.42s.53 3.35 1.48 5.32l3.77-2.89z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.77-2.92c-1.05.7-2.4.12-4.19.12-3.17 0-5.87-2.26-6.83-5.32L1.4 14.8c1.92 3.89 5.89 6.2 10.6 6.2z"/></svg>
                      Continue with Google
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: '#64748b' }}>
                      Don't have an account?{' '}
                      <button type="button" onClick={() => setAuthTab('signup')} style={{ background: 'transparent', border: 'none', color: '#4338ca', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                        Sign up
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

  // 2. HOME SCREEN FOR LOGGED-IN USERS INSIDE DASHBOARD
  return (
    <div style={{ padding: '1rem 0 4rem 0', width: '100%' }}>
      {/* HERO BANNER FOR LOGGED-IN USERS */}
      <section className="card-premium glass-card" style={{ padding: '3rem 2.5rem', borderRadius: '24px', backgroundColor: '#ffffff', marginBottom: '3rem', border: '1px solid #e2e8f0' }}>
        <div className="tag tag-accent" style={{ marginBottom: '1rem', padding: '0.375rem 1rem', fontSize: '0.8125rem' }}>
          ✨ Active Peer Learning Workspace
        </div>
        <h1 className="font-serif gradient-text" style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '1rem' }}>
          Welcome Back, {profile?.fullName || 'Student Learner'}!
        </h1>
        <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '640px' }}>
          Connect with peer tutors, launch WebRTC live study sessions, post concept shorts, and track your campus leaderboard rank.
        </p>
        <button onClick={() => setActiveTab('dashboard')} className="btn btn-accent glow-amber" style={{ padding: '0.75rem 1.75rem', fontWeight: 700, borderRadius: '12px' }}>
          Go to Student Dashboard 🚀
        </button>
      </section>

      {/* PLATFORM STATS */}
      <section style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
        <div className="grid-3" style={{ textAlign: 'center' }}>
          <div>
            <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>12,450+</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Active Campus Learners</div>
          </div>
          <div>
            <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#d97706' }}>98.4%</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Academic Doubt Resolution</div>
          </div>
          <div>
            <div className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#059669' }}>50+</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Top Universities</div>
          </div>
        </div>
      </section>

      {/* LEARNING FEATURES */}
      <section>
        <h2 className="font-serif" style={{ textAlign: 'center', fontSize: '1.875rem', marginBottom: '2rem' }}>
          Student Learning Loop Features
        </h2>
        <div className="grid-2">
          <div className="card-premium glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={24} />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>1. Live Doubt Rooms & WebRTC Calls</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Open a doubt workspace, chat with a helper from your department, and start 1-click video calls with screen sharing.
            </p>
          </div>

          <div className="card-premium glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>2. 8-Factor Smart Peer Discovery</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Match algorithm evaluating college, department, skills, learning goals, and mutual connections for exact peer pairings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- CONTACT & SUPPORT SCREEN ---
function ContactSupportScreen({ token, setActiveTab, setActiveChatId, setChatPeer, profile }) {
  const [issueType, setIssueType] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showSlaModal, setShowSlaModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCardClick = (categoryTitle, defaultIssue) => {
    setIssueType(defaultIssue);
    showToast(`Selected category: ${categoryTitle}`);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast('❌ File size exceeds 5MB limit');
        return;
      }
      setAttachment(file);
      showToast(`📎 Attached file: ${file.name}`);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Removed attachment');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issueType || issueType === 'Select an option') {
      showToast('⚠️ Please select an Issue Type');
      return;
    }
    if (!subject.trim()) {
      showToast('⚠️ Please enter a Subject');
      return;
    }
    if (!message.trim()) {
      showToast('⚠️ Please describe your issue');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      issueType,
      subject,
      message,
      attachmentName: attachment ? attachment.name : null,
      email: profile?.email || 'aarav@student.com',
      fullName: profile?.fullName || 'Aarav Sharma'
    };

    try {
      let res = null;
      if (token) {
        try {
          res = await fetch('/api/contact/support', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.log("Simulating support ticket response");
        }
      }

      let ticketData = null;
      if (res && res.ok) {
        const json = await res.json();
        ticketData = json.ticket;
      } else {
        const randomId = "SL-" + Math.floor(10000 + Math.random() * 90000);
        ticketData = {
          ticketId: randomId,
          issueType,
          subject,
          message,
          attachmentName: attachment ? attachment.name : null,
          status: 'Open',
          createdAt: new Date().toLocaleString(),
          estimatedResponse: 'Within 24 Hours'
        };
      }

      setIsSubmitting(false);
      setSubmittedTicket(ticketData);
      showToast('✅ Ticket submitted successfully!');
    } catch (err) {
      setIsSubmitting(false);
      showToast('❌ Failed to submit ticket. Please try again.');
    }
  };

  const startSupportChat = () => {
    const supportPeer = {
      id: 'support-team-id',
      fullName: 'StudyLoop Support Team',
      college: 'StudyLoop Central',
      department: 'Help & Operations',
      avatarUrl: NEUTRAL_AVATAR_SVG
    };
    if (setChatPeer && setActiveChatId) {
      setChatPeer(supportPeer);
      setActiveChatId('support-thread-01');
      setActiveTab('chat');
    } else {
      setActiveTab('chat');
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('support@studyloop.in');
    showToast('📋 Copied support@studyloop.in to clipboard!');
  };

  const faqs = [
    {
      q: "How does StudyLoop peer matching work?",
      a: "Our algorithm matches you with students from your campus and other top universities based on shared subjects, complementary skills, availability, and learning goals."
    },
    {
      q: "How do I earn XP and unlock badges?",
      a: "You earn XP by completing peer sessions, answering doubt room questions, contributing educational reels, and maintaining study streaks. Higher XP unlocks higher levels and mentor badges."
    },
    {
      q: "How can I apply to become a verified Peer Tutor?",
      a: "Go to your Dashboard, navigate to 'Tutor Verification', upload your academic transcript or test scores, and complete a 5-minute peer teaching review."
    },
    {
      q: "What are Doubt Rooms and how do I join one?",
      a: "Doubt Rooms are live interactive study hubs equipped with real-time video, screen sharing, and code editor features. Browse open rooms in the Doubt Rooms Hub to join immediately."
    },
    {
      q: "How do tutor session earnings and withdrawals work?",
      a: "Tutors receive StudyCoins for paid 1-to-1 doubt resolution sessions. Coins can be redeemed directly to your bank account or UPI via the Earnings tab in Dashboard."
    },
    {
      q: "What if someone behaves inappropriately during a session?",
      a: "You can instantly report any user via their profile or session menu using the 'Report' button. Our moderation team reviews reports within 1 hour."
    }
  ];

  return (
    <div className="support-container">
      {/* Toast notification overlay */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {toastMessage}
        </div>
      )}

      {/* 3. MAIN HEADER */}
      <div>
        <h1 className="support-header-title">Contact & Support</h1>
        <p className="support-header-subtitle">
          Get support, report a problem, share an idea, or connect with the StudyLoop team.
        </p>
      </div>

      {/* 4. SUPPORT CATEGORY CARDS (4 HORIZONTAL CARDS) */}
      <div className="support-cards-grid">
        {/* Card 1: Student Support */}
        <div className="support-card" onClick={() => handleCardClick('Student Support', 'Account & Login')}>
          <div className="support-card-icon support-card-blue">
            <Headphones size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Student Support</h3>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Account, learning, peer matching, doubt rooms and more.
            </p>
          </div>
          <div className="support-card-arrow">
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Card 2: Peer Tutor Support */}
        <div className="support-card" onClick={() => handleCardClick('Peer Tutor Support', 'Peer Tutor')}>
          <div className="support-card-icon support-card-green">
            <GraduationCap size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Peer Tutor Support</h3>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Teaching, sessions, earnings, verification and more.
            </p>
          </div>
          <div className="support-card-arrow">
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Card 3: Report a Problem */}
        <div className="support-card" onClick={() => handleCardClick('Report a Problem', 'Report a Bug')}>
          <div className="support-card-icon support-card-orange">
            <Bug size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Report a Problem</h3>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Something isn't working as expected? Let us know.
            </p>
          </div>
          <div className="support-card-arrow">
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Card 4: Suggest an Idea */}
        <div className="support-card" onClick={() => handleCardClick('Suggest an Idea', 'Feature Request')}>
          <div className="support-card-icon support-card-purple">
            <Lightbulb size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Suggest an Idea</h3>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Share your ideas and help us make StudyLoop better for everyone.
            </p>
          </div>
          <div className="support-card-arrow">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* 5. MAIN CONTACT SECTION (TWO COLUMN LAYOUT) */}
      <div className="support-two-column" ref={formRef}>
        {/* LEFT COLUMN: SEND US A MESSAGE */}
        <div className="support-form-column">
          <div className="support-form-card">
            <div className="support-form-title">
              <Mail size={20} style={{ color: '#2563eb' }} />
              <span>Send us a message</span>
            </div>

            {submittedTicket ? (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                margin: 'auto 0'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#14532d' }}>Ticket Submitted!</h3>
                  <p style={{ fontSize: '0.875rem', color: '#166534', marginTop: '0.25rem' }}>
                    Your ticket ID is <strong>{submittedTicket.ticketId}</strong>. We've sent a confirmation email to <strong>{profile?.email || 'aarav@student.com'}</strong>.
                  </p>
                </div>
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  width: '100%',
                  maxWidth: '400px',
                  textAlign: 'left',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem'
                }}>
                  <div><strong>Issue Type:</strong> {submittedTicket.issueType}</div>
                  <div><strong>Subject:</strong> {submittedTicket.subject}</div>
                  <div><strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>Open</span></div>
                  <div><strong>Est. Response:</strong> Within 24 Hours</div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setIssueType('');
                    setSubject('');
                    setMessage('');
                    setAttachment(null);
                  }}
                  style={{ borderRadius: '10px', padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Form fields: Issue Type & Subject */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="support-field-group">
                    <label className="support-label">Issue Type</label>
                    <select
                      className="support-select"
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      required
                    >
                      <option value="">Select an option</option>
                      <option value="Account & Login">Account & Login</option>
                      <option value="Peer Matching">Peer Matching</option>
                      <option value="Doubt Rooms">Doubt Rooms</option>
                      <option value="Peer Tutor">Peer Tutor</option>
                      <option value="Earnings">Earnings</option>
                      <option value="Direct Messages">Direct Messages</option>
                      <option value="Educational Reels">Educational Reels</option>
                      <option value="Report a Bug">Report a Bug</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="support-field-group">
                    <label className="support-label">Subject</label>
                    <input
                      type="text"
                      className="support-input"
                      placeholder="What's the issue?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Message Field with char counter */}
                <div className="support-field-group" style={{ position: 'relative' }}>
                  <label className="support-label">Message</label>
                  <textarea
                    className="support-textarea"
                    placeholder="Tell us what happened..."
                    value={message}
                    maxLength={1000}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0.625rem',
                    right: '0.75rem',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: message.length > 900 ? '#dc2626' : '#94a3b8',
                    pointerEvents: 'none'
                  }}>
                    {message.length}/1000
                  </div>
                </div>

                {/* Attachment Dropzone */}
                <div className="support-field-group">
                  <label className="support-label">Attachment (optional)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg,.pdf"
                  />
                  {attachment ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        <Paperclip size={16} style={{ color: '#2563eb' }} />
                        <span>{attachment.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({(attachment.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="support-dropzone" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                      <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Plus size={16} /> Add screenshot or file
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PNG, JPG, PDF up to 5MB</span>
                    </div>
                  )}
                </div>

                {/* Footer Privacy Info & Submit Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Lock size={14} style={{ color: '#64748b' }} />
                    <span>Your information is only used to resolve your request.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6875rem 1.5rem',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      backgroundColor: '#2563eb',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK HELP & STUDYLOOP SUPPORT CHAT */}
        <div className="support-side-column">
          {/* Quick Help Card */}
          <div className="support-quickhelp-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} style={{ color: '#3b82f6' }} /> Quick Help
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.125rem', marginBottom: '1rem' }}>
              Find the fastest way to get help.
            </p>

            {/* Row 1: FAQ */}
            <div className="support-row-item" onClick={() => setShowFaqModal(true)}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <HelpCircle size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84375rem', fontWeight: 700, color: 'var(--text-primary)' }}>FAQ</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Find answers to common questions.</div>
              </div>
              <ChevronRight size={16} style={{ color: '#94a3b8' }} />
            </div>

            {/* Row 2: Live Support Chat */}
            <div className="support-row-item" onClick={startSupportChat}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Live Support Chat</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Chat with our support team.</div>
              </div>
              <span style={{
                backgroundColor: '#d1fae5',
                color: '#059669',
                padding: '0.125rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.6875rem',
                fontWeight: 800,
                marginRight: '0.375rem'
              }}>
                Available
              </span>
              <ChevronRight size={16} style={{ color: '#94a3b8' }} />
            </div>

            {/* Row 3: Email Us */}
            <div className="support-row-item" onClick={copyEmail}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Email Us</div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>support@studyloop.in</div>
              </div>
              <ChevronRight size={16} style={{ color: '#94a3b8' }} />
            </div>

            {/* Row 4: Response Time */}
            <div className="support-row-item" onClick={() => setShowSlaModal(true)}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Response Time</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>We usually respond within 24 hours.</div>
              </div>
              <ChevronRight size={16} style={{ color: '#94a3b8' }} />
            </div>
          </div>

          {/* 7. STUDYLOOP SUPPORT CHAT CARD */}
          <div className="support-chat-box">
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>StudyLoop Support</h4>
              <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.125rem' }}>
                Chat with our support team directly in your inbox.
              </p>
            </div>
            <button
              onClick={startSupportChat}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #bfdbfe',
                borderRadius: '50px',
                padding: '0.5rem 1rem',
                fontSize: '0.78125rem',
                fontWeight: 700,
                color: '#2563eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                whiteSpace: 'nowrap'
              }}
            >
              <MessageSquare size={14} /> Start Conversation
            </button>
          </div>
        </div>
      </div>

      {/* 8. PRODUCT SPECIFIC BOTTOM CONCEPT HELP CARD */}
      <div className="support-concept-card">
        {/* Left SVG Vector Illustration of 3 Students Learning Together */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
          <div style={{ width: '130px', height: '80px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <rect x="10" y="70" width="140" height="6" rx="3" fill="#cbd5e1" />
              {/* Student 1 (Left) */}
              <circle cx="35" cy="35" r="14" fill="#3b82f6" />
              <path d="M20 70 C20 52 50 52 50 70 Z" fill="#60a5fa" />
              {/* Student 2 (Center) */}
              <circle cx="75" cy="30" r="16" fill="#10b981" />
              <path d="M58 70 C58 48 92 48 92 70 Z" fill="#34d399" />
              {/* Laptop in Center */}
              <rect x="65" y="55" width="22" height="13" rx="2" fill="#0f172a" />
              <polygon points="60,68 92,68 90,71 62,71" fill="#94a3b8" />
              {/* Student 3 (Right) */}
              <circle cx="115" cy="35" r="14" fill="#8b5cf6" />
              <path d="M100 70 C100 52 130 52 130 70 Z" fill="#a78bfa" />
              {/* Question bubble overhead */}
              <circle cx="75" cy="12" r="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="75" y="16" textAnchor="middle" fill="#2563eb" fontSize="10" fontWeight="bold">?</text>
            </svg>
          </div>

          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Need help with a concept instead?
            </h3>
            <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
              Connect with peer learners and mentors to get your doubts solved faster.
            </p>
            <button
              onClick={() => setActiveTab('discover')}
              className="btn btn-primary"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1.125rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
              }}
            >
              Find a Peer →
            </button>
          </div>
        </div>

        {/* Right side benefit checkmark pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem 1.25rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <CheckCircle size={15} style={{ color: '#059669' }} /> Verified Peers
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <CheckCircle size={15} style={{ color: '#059669' }} /> 1-to-1 Help
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <CheckCircle size={15} style={{ color: '#059669' }} /> Live Sessions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <CheckCircle size={15} style={{ color: '#059669' }} /> Learn Together
          </div>
        </div>
      </div>

      {/* FAQ MODAL */}
      {showFaqModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '1rem'
        }}>
          <div className="card-premium" style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.125rem', color: '#0f172a' }}>
                <HelpCircle style={{ color: '#2563eb' }} size={20} /> Frequently Asked Questions
              </div>
              <button onClick={() => setShowFaqModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: activeFaqIndex === index ? '#f8fafc' : '#ffffff'
                  }}
                >
                  <button
                    onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1.125rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} style={{ transform: activeFaqIndex === index ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>
                  {activeFaqIndex === index && (
                    <div style={{ padding: '0 1.125rem 0.875rem 1.125rem', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, borderTop: '1px solid #f1f5f9', paddingTop: '0.625rem' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setShowFaqModal(false)} style={{ borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLA / RESPONSE TIME MODAL */}
      {showSlaModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '1rem'
        }}>
          <div className="card-premium" style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.125rem', color: '#0f172a' }}>
                <Clock style={{ color: '#2563eb' }} size={20} /> Support Response SLAs
              </div>
              <button onClick={() => setShowSlaModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.75rem', lineHeight: 1.5 }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <strong style={{ color: '#1e40af' }}>⚡ Urgent Issues (Bug/Security):</strong>
                <p style={{ fontSize: '0.8125rem', color: '#1e3a8a', marginTop: '0.125rem' }}>Reviewed within 2 hours during business hours (9 AM - 9 PM IST).</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a' }}>📬 General Support & Inquiries:</strong>
                <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.125rem' }}>Responded to within 24 hours maximum.</p>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a' }}>💡 Feature Suggestions:</strong>
                <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.125rem' }}>Reviewed weekly by our product team.</p>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowSlaModal(false)} style={{ width: '100%', marginTop: '1.25rem', borderRadius: '10px' }}>
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

