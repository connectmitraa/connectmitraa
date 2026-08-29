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
  Headphones, Bug, Lightbulb, Paperclip, Clock, LifeBuoy,
  BarChart3, History, ArrowUpRight, RefreshCw, AlertTriangle, Play, Pause,
  Compass, ArrowRight, ThumbsUp, Building2, Megaphone, CheckCircle2, Filter, UserPlus,
  Wallet, CreditCard, DollarSign, Calendar, Code, PlayCircle, Star, TrendingUp, IndianRupee,
  Briefcase, FileText, Download, ExternalLink, Trash2, MapPin, UploadCloud, Link, ArrowLeft,
  CheckSquare, Layers, Sliders, PieChart, LineChart
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- AUTHENTICATION & CLIENT SETUP ---
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

// --- GENDER-BASED DEFAULT VECTOR AVATARS ---
export const MALE_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2YxZjVmOSIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiM2NDc0OGIiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iIzY0NzQ4YiIvPjwvc3ZnPg==";
export const FEMALE_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2ZjZTdmMyIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiNlYzQ4OTkiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iI2VjNDg5OSIvPjwvc3ZnPg==";
export const NEUTRAL_AVATAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2UyZThmMCIvPjxwYXRoIGQ9Ik01MCAyMiBhIDE2IDE2IDAgMSAwIDAuMSAwIFoiIGZpbGw9IiM0NzU1NjkiLz48cGF0aCBkPSJNMjAgODQgYyAwIC0yNCAxNSAtMzQgMzAgLTM0IHMgMzAgMTAgMzAgMzQgWiIgZmlsbD0iIzQ3NTU2OSIvPjwvc3ZnPg==";

export function getDefaultAvatarByGender(gender = 'male', avatarUrl = '') {
  if (avatarUrl && avatarUrl.trim().length > 0 && !avatarUrl.includes('dicebear') && avatarUrl !== 'null' && avatarUrl !== 'undefined') {
    return avatarUrl;
  }
  const normalizedGender = (gender || 'male').toLowerCase();
  if (normalizedGender === 'female') return FEMALE_AVATAR_SVG;
  if (normalizedGender === 'other') return NEUTRAL_AVATAR_SVG;
  return MALE_AVATAR_SVG;
}

const AuthContext = createContext(null);

// Pre-configured test accounts
export const TEST_ACCOUNTS = [
    { 
      email: 'studenta@student.com', 
      role: 'authenticated', 
      id: '11111111-1111-1111-1111-111111111111', 
      fullName: 'Aarav Sharma',
      college: 'IIT Madras',
      department: 'Computer Science',
      year: 2,
      gender: 'male',
      bio: '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught',
      headline: 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist',
      location: 'Chennai, Tamil Nadu, India',
      resumeFileName: 'Aarav_Sharma_BTech_CS_Resume.pdf',
      resumeUploadDate: 'Aug 2026',
      socialLinks: {
        github: 'https://github.com/aaravsharma',
        linkedin: 'https://linkedin.com/in/aarav-sharma-cs',
        leetcode: 'https://leetcode.com/aarav_codes',
        portfolio: 'https://aaravsharma.dev'
      },
      educations: [
        {
          id: 'edu-1',
          school: 'Indian Institute of Technology (IIT) Madras',
          degree: 'Bachelor of Technology - B.Tech',
          field: 'Computer Science & Engineering',
          startYear: '2023',
          endYear: '2027',
          grade: '8.95 / 10.0 CGPA',
          activities: 'Lead at Google Developer Student Club (GDSC), Campus Doubt Mentor'
        },
        {
          id: 'edu-2',
          school: 'Delhi Public School (DPS), R.K. Puram',
          degree: 'Higher Secondary School Certificate (Class XII)',
          field: 'Physics, Chemistry, Mathematics & Computer Science',
          startYear: '2021',
          endYear: '2023',
          grade: '96.4% Aggregate',
          activities: 'National Cyber Olympiad Gold Medalist'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'Oracle Certified Associate, Java SE 8 Programmer (1Z0-808)',
          issuer: 'Oracle',
          issueDate: 'Jan 2026',
          credentialId: 'OCA-JAVA-98742',
          credentialUrl: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=demo',
          badgeIcon: '☕'
        },
        {
          id: 'cert-2',
          name: 'NPTEL Elite Gold: Programming, Data Structures And Algorithms In Python',
          issuer: 'IIT Madras & NPTEL',
          issueDate: 'Oct 2025',
          credentialId: 'NPTEL25CS89104',
          credentialUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS89104',
          badgeIcon: '🐍'
        },
        {
          id: 'cert-3',
          name: 'AWS Certified Cloud Practitioner (CLF-C02)',
          issuer: 'Amazon Web Services (AWS)',
          issueDate: 'May 2025',
          credentialId: 'AWS-CCP-76291',
          credentialUrl: 'https://aws.amazon.com/verification',
          badgeIcon: '☁️'
        }
      ],
      achievements: [
        {
          id: 'ach-1',
          title: 'Smart India Hackathon (SIH 2025) - National Finalist',
          issuer: 'Ministry of Education & Unstop',
          date: 'Dec 2025',
          desc: 'Selected in Top 5 teams out of 12,000+ national submissions for building AI peer doubt router.'
        },
        {
          id: 'ach-2',
          title: 'LeetCode Knight Badge (Top 2.5% Globally • Rating: 1985)',
          issuer: 'LeetCode',
          date: '2026',
          desc: 'Solved 450+ data structures & algorithms questions with 85% dynamic programming accuracy.'
        },
        {
          id: 'ach-3',
          title: 'Flipkart GRiD 6.0 Software Development Semi-Finalist',
          issuer: 'Flipkart & Unstop',
          date: 'Aug 2025',
          desc: 'Built high-throughput inventory allocation service handling 10k QPS simulation.'
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'PeerCode - WebRTC Real-Time Collaborative Workspace',
          stack: ['React', 'WebRTC', 'Node.js', 'Socket.io', 'Java'],
          desc: 'Low-latency collaborative coding and live doubt-solving workspace with synchronized editor and audio/video.',
          githubUrl: 'https://github.com/aaravsharma/peercode-workspace',
          liveUrl: 'https://peercode.studyloop.app'
        },
        {
          id: 'proj-2',
          title: 'AlgoVisualizer - Interactive Graph & DP Algorithm Visualizer',
          stack: ['JavaScript', 'Canvas API', 'Algorithms', 'CSS3'],
          desc: 'Step-by-step interactive animations for Dijkstra, BFS/DFS, 0/1 Knapsack, and Tree traversals used by 500+ students.',
          githubUrl: 'https://github.com/aaravsharma/algo-visualizer',
          liveUrl: 'https://algovis.studyloop.app'
        }
      ],
      skills: ['Java', 'Algorithms', 'React', 'Calculus', 'WebRTC', 'Spring Boot'],
      teachingSkills: ['Java', 'Algorithms', 'Data Structures'],
      learningGoals: ['System Design', 'AI/ML', 'Microservices'],
      xp: 650,
      level: 4,
      coins: 45,
      followersCount: 148,
      followingCount: 92,
      walletBalance: 450,
      lifetimeEarnings: 1850,
      classesTaught: 24,
      customSessionRate: 50,
      conceptClarityRating: 4.9,
      tutorTier: 'certified',
      avatarUrl: MALE_AVATAR_SVG
    },
    { 
      email: 'studentb@student.com', 
      role: 'authenticated', 
      id: '22222222-2222-2222-2222-222222222222', 
      fullName: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'Computer Science',
      year: 3,
      gender: 'female',
      bio: '👩‍💻 AI Researcher & Peer Tutor | ⭐ 4.9 Rating | 🏆 87 Classes Taught • 96% Concept Clarity',
      headline: '3rd Year CS @ IIT Madras • AI Researcher • Master Peer Tutor (87+ Sessions)',
      location: 'Chennai, India',
      resumeFileName: 'Bhavna_Patel_AI_Tutor_Resume.pdf',
      resumeUploadDate: 'Aug 2026',
      socialLinks: {
        github: 'https://github.com/bhavnapatel',
        linkedin: 'https://linkedin.com/in/bhavna-patel',
        leetcode: 'https://leetcode.com/bhavna_ai',
        portfolio: 'https://bhavnapatel.ai'
      },
      educations: [
        {
          id: 'edu-b1',
          school: 'Indian Institute of Technology (IIT) Madras',
          degree: 'Bachelor of Technology - B.Tech',
          field: 'Computer Science',
          startYear: '2022',
          endYear: '2026',
          grade: '9.4 / 10.0 CGPA',
          activities: 'President at Women in Tech IITM, Senior Peer Tutor'
        }
      ],
      certifications: [
        {
          id: 'cert-b1',
          name: 'TensorFlow Developer Certificate',
          issuer: 'Google',
          issueDate: 'Mar 2025',
          credentialId: 'TF-DEV-19283',
          credentialUrl: 'https://google.com',
          badgeIcon: '🧠'
        },
        {
          id: 'cert-b2',
          name: 'Oracle Certified Professional: Java SE 11 Developer',
          issuer: 'Oracle',
          issueDate: 'Jan 2025',
          credentialId: 'OCP-JAVA-54892',
          credentialUrl: 'https://oracle.com',
          badgeIcon: '☕'
        }
      ],
      achievements: [
        {
          id: 'ach-b1',
          title: 'Google Solution Challenge Global Top 100',
          issuer: 'Google Developers',
          date: '2025',
          desc: 'Built assistive communication tool for students with hearing impairment.'
        }
      ],
      projects: [
        {
          id: 'proj-b1',
          title: 'NeuralVision - Edge AI Real-Time Object Recognition',
          stack: ['Python', 'PyTorch', 'FastAPI', 'React'],
          desc: 'Lightweight YOLOv8 object detector for low-power mobile devices.',
          githubUrl: 'https://github.com/bhavnapatel/neural-vision',
          liveUrl: 'https://neuralvision.dev'
        }
      ],
      skills: ['Python', 'Machine Learning', 'Data Structures', 'DBMS', 'PyTorch'],
      teachingSkills: ['Python', 'Machine Learning', 'DBMS', 'Java'],
      learningGoals: ['Cloud Computing', 'WebRTC'],
      xp: 820,
      level: 5,
      coins: 60,
      followersCount: 230,
      followingCount: 110,
      walletBalance: 890,
      lifetimeEarnings: 4350,
      classesTaught: 87,
      customSessionRate: 75,
      conceptClarityRating: 4.9,
      tutorTier: 'master',
      avatarUrl: FEMALE_AVATAR_SVG
    },
    { 
      email: 'studentc@student.com', 
      role: 'authenticated', 
      id: '33333333-3333-3333-3333-333333333333', 
      fullName: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'Electrical Engineering',
      year: 1,
      gender: 'male',
      bio: '⚡ Electronics Enthusiast & C++ Learner | 🌱 Apprentice Tutor (7/10 Free Sessions Done)',
      headline: '1st Year EEE @ BITS Pilani • Embedded C++ & Circuits Hobbyist',
      location: 'Hyderabad, India',
      resumeFileName: 'Chaitanya_Reddy_EEE_Resume.pdf',
      resumeUploadDate: 'Jul 2026',
      socialLinks: {
        github: 'https://github.com/chaitanyareddy',
        linkedin: 'https://linkedin.com/in/chaitanya-reddy-eee',
        leetcode: 'https://leetcode.com/chaitanya_eee',
        portfolio: 'https://chaitanya.dev'
      },
      educations: [
        {
          id: 'edu-c1',
          school: 'BITS Pilani, Hyderabad Campus',
          degree: 'Bachelor of Engineering - B.E.',
          field: 'Electrical & Electronics Engineering',
          startYear: '2024',
          endYear: '2028',
          grade: '8.4 / 10.0 CGPA',
          activities: 'Robotics Club Member'
        }
      ],
      certifications: [
        {
          id: 'cert-c1',
          name: 'NPTEL: Basic Electrical Circuits',
          issuer: 'IIT Madras',
          issueDate: 'Apr 2025',
          credentialId: 'NPTEL25EE12',
          credentialUrl: 'https://nptel.ac.in',
          badgeIcon: '⚡'
        }
      ],
      achievements: [
        {
          id: 'ach-c1',
          title: 'State Level Science Exhibition 1st Place',
          issuer: 'Dept of Science & Tech',
          date: '2024',
          desc: 'Built smart micro-grid simulation circuit with renewable energy switching.'
        }
      ],
      projects: [
        {
          id: 'proj-c1',
          title: 'SmartCircuit - Arduino Based Energy Logger',
          stack: ['C++', 'Arduino', 'IoT', 'Embedded Systems'],
          desc: 'Real-time voltage and current telemetry sent to cloud dashboard.',
          githubUrl: 'https://github.com/chaitanya/smart-circuit',
          liveUrl: 'https://chaitanya.dev/smart-circuit'
        }
      ],
      skills: ['C++', 'Circuits', 'Calculus', 'Arduino'],
      teachingSkills: ['Circuits', 'C++'],
      learningGoals: ['Python', 'Web Development'],
      xp: 340,
      level: 2,
      coins: 20,
      followersCount: 85,
      followingCount: 75,
      walletBalance: 0,
      lifetimeEarnings: 0,
      classesTaught: 7,
      customSessionRate: 30,
      conceptClarityRating: 4.7,
      tutorTier: 'apprentice',
      avatarUrl: MALE_AVATAR_SVG
    },
    {
      email: 'admin@studyloop.app',
      role: 'super_admin',
      id: '00000000-0000-0000-0000-000000000000',
      fullName: 'Platform Administrator',
      college: 'StudyLoop Central HQ',
      department: 'Academic Safety & Moderation',
      year: 4,
      gender: 'other',
      bio: '🛡️ StudyLoop Safety & Platform Operations Lead',
      skills: ['Platform Operations', 'User Safety', 'Academic Auditing'],
      teachingSkills: ['All Subjects'],
      learningGoals: ['Community Scaling'],
      xp: 9999,
      level: 99,
      coins: 5000,
      followersCount: 1200,
      followingCount: 5,
      avatarUrl: NEUTRAL_AVATAR_SVG
    }
  ];

export function AuthProvider({ children }) {
  const testAccounts = TEST_ACCOUNTS;
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('studyloop_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch(e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('studyloop_token') || '');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('studyloop_admin_token') || '');
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      const savedUser = localStorage.getItem('studyloop_user');
      if (savedUser) {
        return JSON.parse(savedUser).role === 'super_admin';
      }
    } catch(e) {}
    return false;
  });
  const [profile, setProfile] = useState(() => {
    try {
      const savedUser = localStorage.getItem('studyloop_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const cached = localStorage.getItem(`studyloop_profile_${u.id}`);
        if (cached) return JSON.parse(cached);
        return TEST_ACCOUNTS.find(acc => acc.id === u.id) || TEST_ACCOUNTS[0];
      }
    } catch(e) {}
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('studyloop_user');
    const savedToken = localStorage.getItem('studyloop_token');
    const savedAdminToken = localStorage.getItem('studyloop_admin_token');

    if (savedAdminToken) {
      setAdminToken(savedAdminToken);
    }

    if (savedUser && savedToken) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setToken(savedToken);
        const cachedProfile = localStorage.getItem(`studyloop_profile_${u.id}`);
        if (cachedProfile) {
          try {
            setProfile(JSON.parse(cachedProfile));
          } catch(e) {
            setProfile(testAccounts.find(acc => acc.id === u.id) || testAccounts[0]);
          }
        } else {
          setProfile(testAccounts.find(acc => acc.id === u.id) || testAccounts[0]);
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    setLoading(false);
  }, []);

  const loginSimulated = (email) => {
    const matched = testAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase()) || {
      id: `user-${Date.now()}`,
      email: email,
      role: 'authenticated',
      fullName: email.split('@')[0].replace('.', ' '),
      college: 'IIT Madras',
      department: 'Engineering',
      year: 1,
      gender: 'male',
      bio: '🎓 Campus Learner | 🚀 Exploring peer learning on StudyLoop',
      skills: ['General Academics'],
      teachingSkills: ['General Academics'],
      learningGoals: ['Programming'],
      xp: 100,
      level: 1,
      coins: 10,
      followersCount: 0,
      followingCount: 0,
      avatarUrl: MALE_AVATAR_SVG
    };

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: matched.id, email: matched.email, role: matched.role }));
    const mockJwt = `${header}.${payload}.signature`;

    setUser(matched);
    setProfile(matched);
    setToken(mockJwt);
    localStorage.setItem('studyloop_user', JSON.stringify(matched));
    localStorage.setItem('studyloop_token', mockJwt);
    localStorage.setItem(`studyloop_profile_${matched.id}`, JSON.stringify(matched));

    if (matched.role === 'super_admin' || email.toLowerCase() === 'admin@studyloop.app') {
      localStorage.setItem('studyloop_admin_token', mockJwt);
      setAdminToken(mockJwt);
      setIsAdminMode(true);
    }
  };

  const loginAdmin = (email = 'admin@studyloop.app') => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: "00000000-0000-0000-0000-000000000000", email: email, role: "super_admin" }));
    const mockJwt = `${header}.${payload}.signature`;

    const adminAcc = testAccounts.find(acc => acc.role === 'super_admin') || testAccounts[3];
    setUser(adminAcc);
    setProfile(adminAcc);
    setToken(mockJwt);
    setAdminToken(mockJwt);
    setIsAdminMode(true);
    localStorage.setItem('studyloop_user', JSON.stringify(adminAcc));
    localStorage.setItem('studyloop_token', mockJwt);
    localStorage.setItem('studyloop_admin_token', mockJwt);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken('');
    setIsAdminMode(false);
    localStorage.removeItem('studyloop_user');
    localStorage.removeItem('studyloop_token');
    localStorage.removeItem('studyloop_active_tab');
  };

  const updateProfileState = (newProf) => {
    setProfile(newProf);
    if (newProf.id) {
      localStorage.setItem(`studyloop_profile_${newProf.id}`, JSON.stringify(newProf));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      token, 
      loading, 
      loginSimulated, 
      loginAdmin,
      logout, 
      updateProfileState, 
      testAccounts, 
      isMockMode: true,
      isAdminMode,
      setIsAdminMode,
      adminToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// --- ROOT APP ENTRY COMPONENT ---
export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

// --- MAIN APPLICATION LAYOUT & ROUTER ---
function MainLayout() {
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
        <AdminConsoleScreen 
          onBackToStudent={() => {
            setIsAdminMode(false);
            setActiveTab('landing');
            if (window.history.pushState) {
              window.history.pushState(null, '', '/');
            }
          }} 
        />
      );
    }
    return (
      <AdminGateScreen 
        loginAdmin={loginAdmin}
        onBackToHome={() => {
          setActiveTab('landing');
          if (window.history.pushState) {
            window.history.pushState(null, '', '/');
          }
        }}
      />
    );
  }

  // --- VISITOR LANDING SCREEN ---
  if (!user) {
    return (
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
    );
  }

  // --- DEDICATED SEPARATE FULL-PAGE STUDENT PROFILE & SETTINGS (LINKEDIN / NAUKRI SEPARATE PAGE STYLE) ---
  if (activeTab === 'dashboard' || activeTab === 'settings') {
    return (
      <SettingsScreen 
        token={token} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        setTheme={setTheme} 
      />
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

          {/* PLATFORM OPERATIONS & ADMIN (ONLY VISIBLE TO SUPER ADMINS) */}
          {isSuperAdmin && (
            <>
              {!isSidebarCollapsed && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontSize: '0.6875rem', 
                  fontWeight: 800, 
                  letterSpacing: '0.08em', 
                  color: '#ea580c', 
                  marginTop: '1.25rem', 
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  PLATFORM OPERATIONS
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)', marginLeft: '0.5rem' }}></div>
                </div>
              )}
              <SidebarLink 
                isCollapsed={isSidebarCollapsed} 
                active={activeTab === 'admin'} 
                icon={<Shield size={18} style={{ color: '#ea580c' }} />} 
                label="Admin Portal" 
                onClick={() => {
                  setIsAdminMode(true);
                  setActiveTab('admin');
                }} 
              />
            </>
          )}
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
              
              {/* ADMIN CONSOLE SWITCHER PILL (ONLY VISIBLE TO SUPER ADMINS) */}
              {isSuperAdmin && (
                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setActiveTab('admin');
                  }}
                  className="btn btn-primary"
                  style={{
                    padding: '0.375rem 0.875rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}
                  title="Switch to Administrator Console"
                >
                  <Shield size={14} /> Admin Portal
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)', fontSize: '0.625rem', fontWeight: 800 }}>⚡ 48 Live</span>
                </button>
              )}

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

                    {isSuperAdmin && (
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                        <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem 0.25rem 0.5rem' }}>
                          SUPER ADMIN
                        </div>
                        <button 
                          onClick={() => {
                            setShowHeaderDropdown(false);
                            setIsAdminMode(true);
                            setActiveTab('admin');
                          }} 
                          className="dropdown-item"
                          style={{ color: '#ea580c' }}
                        >
                          <Shield size={16} style={{ color: '#ea580c' }} /> Admin Portal
                        </button>
                      </div>
                    )}

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

// --- SIDEBAR LINK HELPER ---
function SidebarLink({ active, icon, label, onClick, isCollapsed }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '0.75rem',
        width: '100%',
        padding: isCollapsed ? '0.625rem 0' : '0.625rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.8125rem',
        fontWeight: active ? '700' : '600',
        backgroundColor: active ? 'var(--accent-light)' : 'transparent',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        textAlign: 'left',
        transition: 'all var(--transition-fast)',
        marginBottom: '0.25rem'
      }}
      title={isCollapsed ? label : ''}
    >
      <span style={{ display: 'flex', alignItems: 'center', color: active ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
        {icon}
      </span>
      {!isCollapsed && label}
    </button>
  );
}

// --- SCREEN 1: LANDING & VISITOR HOME PAGE (CHEGG + UNSTOP + LINKEDIN HYBRID) ---
function LandingScreen({ setActiveTab, loginSimulated, loginAdmin, testAccounts, theme, setTheme, postLoginRedirectTab, setPostLoginRedirectTab }) {
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

// --- SCREEN 2: STUDENT DASHBOARD (WITH REELS, PROFILE EDIT & REAL-TIME CONNECTIONS) ---
function DashboardScreen({ token, setActiveTab, onOpenUserList, onStartChat }) {
  const { user, profile: authProfile, updateProfileState, testAccounts } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [showCreateHighlightModal, setShowCreateHighlightModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Tabs: 'posts', 'reels', 'videos', 'connections', 'badges'
  const [activeTabName, setActiveTabName] = useState('posts');
  
  // Theater Player Modal state
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const profile = { ...(data?.profile || {}), ...(authProfile || {}) };

  // Profile Edit Form States
  const [editFullName, setEditFullName] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editYear, setEditYear] = useState(1);
  const [editGender, setEditGender] = useState('male');
  const [editBio, setEditBio] = useState('');
  const [editTeachingSkills, setEditTeachingSkills] = useState('');
  const [editLearningGoals, setEditLearningGoals] = useState('');

  // Upload Modal States
  const [uploadType, setUploadType] = useState('reel'); // 'reel', 'video', 'post'
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('#Java');
  const [uploadDuration, setUploadDuration] = useState('0:45');
  const [filePreviewUrl, setFilePreviewUrl] = useState('');

  // Story Highlights
  const [highlightsList, setHighlightsList] = useState([
    {
      id: 'hl-1',
      title: 'Lab Notes',
      cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'hl-2',
      title: 'Placements',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80'
    }
  ]);
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [newHighlightCover, setNewHighlightCover] = useState('');

  // Posts Dataset
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
      likes: 89,
      comments: [
        { author: 'Aarav Sharma', text: 'DP tables finally made sense after this post 🔥' }
      ]
    },
    {
      id: 'post-3',
      title: '⚡ 5 React Hooks Mistakes to avoid in your semester project! Save for later 📌',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      likes: 112,
      comments: [
        { author: 'Student Peer', text: 'useEffect dependencies explanation was 10/10!' }
      ]
    }
  ]);

  // Reels Dataset (9:16 Shorts)
  const [reelsList, setReelsList] = useState([
    {
      id: 'reel-1',
      title: '3 Tricks to solve Recursion fast ⚡ #Java #Algorithms',
      duration: '0:45',
      views: '1.4k',
      likes: 154,
      hashtag: '#Algorithms',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      comments: [
        { author: 'Aarav Sharma', text: 'Recursion base condition explanation was super clear!' },
        { author: 'Bhavna Patel', text: 'Loved the visual stack trace diagram 🚀' }
      ]
    },
    {
      id: 'reel-2',
      title: 'How Spring Boot Inversion of Control works in 60s ☕ #SpringBoot',
      duration: '0:58',
      views: '2.1k',
      likes: 218,
      hashtag: '#Java',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      comments: [
        { author: 'Chaitanya Reddy', text: 'Dependency injection explained visually is so helpful!' }
      ]
    }
  ]);

  // Videos Dataset (16:9 Lectures)
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

  // Real-Time Connections Dataset
  const [connectionsList, setConnectionsList] = useState([
    {
      id: 'conn-1',
      fullName: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'Computer Science',
      year: 3,
      isOnline: true,
      avatarUrl: FEMALE_AVATAR_SVG,
      teachingSkills: ['Python', 'Machine Learning'],
      rating: 4.9
    },
    {
      id: 'conn-2',
      fullName: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'Electrical Engineering',
      year: 1,
      isOnline: true,
      avatarUrl: MALE_AVATAR_SVG,
      teachingSkills: ['Circuits', 'Calculus'],
      rating: 4.7
    }
  ]);

  // Pending Requests Dataset
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req-1',
      fullName: 'Divya Nambiar',
      college: 'NIT Trichy',
      department: 'Data Science',
      year: 2,
      avatarUrl: FEMALE_AVATAR_SVG,
      skills: ['SQL', 'Tableau', 'Statistics']
    }
  ]);

  const fetchDashboardData = async () => {
    setLoading(true);
    let targetProfileId = authProfile?.id || user?.id || '11111111-1111-1111-1111-111111111111';
    
    // Check cached profile in localStorage
    const cachedMock = localStorage.getItem(`studyloop_profile_${targetProfileId}`);
    const matchedAccount = testAccounts?.find(acc => acc.id === targetProfileId) || {};
    
    let activeMockProfile = {
      id: targetProfileId,
      fullName: matchedAccount.fullName || 'Aarav Sharma',
      college: matchedAccount.college || 'IIT Madras',
      department: matchedAccount.department || 'Computer Science',
      year: matchedAccount.year || 2,
      gender: matchedAccount.gender || 'male',
      bio: matchedAccount.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught',
      headline: matchedAccount.headline || 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist',
      location: matchedAccount.location || 'Chennai, Tamil Nadu, India',
      resumeFileName: matchedAccount.resumeFileName || 'Aarav_Sharma_BTech_CS_Resume.pdf',
      resumeUploadDate: matchedAccount.resumeUploadDate || 'Aug 2026',
      socialLinks: matchedAccount.socialLinks || {
        github: 'https://github.com/aaravsharma',
        linkedin: 'https://linkedin.com/in/aarav-sharma-cs',
        leetcode: 'https://leetcode.com/aarav_codes',
        portfolio: 'https://aaravsharma.dev'
      },
      educations: matchedAccount.educations || [
        {
          id: 'edu-1',
          school: 'Indian Institute of Technology (IIT) Madras',
          degree: 'Bachelor of Technology - B.Tech',
          field: 'Computer Science & Engineering',
          startYear: '2023',
          endYear: '2027',
          grade: '8.95 / 10.0 CGPA',
          activities: 'Lead at Google Developer Student Club (GDSC), Campus Doubt Mentor'
        },
        {
          id: 'edu-2',
          school: 'Delhi Public School (DPS), R.K. Puram',
          degree: 'Higher Secondary School Certificate (Class XII)',
          field: 'Physics, Chemistry, Mathematics & Computer Science',
          startYear: '2021',
          endYear: '2023',
          grade: '96.4% Aggregate',
          activities: 'National Cyber Olympiad Gold Medalist'
        }
      ],
      certifications: matchedAccount.certifications || [
        {
          id: 'cert-1',
          name: 'Oracle Certified Associate, Java SE 8 Programmer (1Z0-808)',
          issuer: 'Oracle',
          issueDate: 'Jan 2026',
          credentialId: 'OCA-JAVA-98742',
          credentialUrl: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=demo',
          badgeIcon: '☕'
        },
        {
          id: 'cert-2',
          name: 'NPTEL Elite Gold: Programming, Data Structures And Algorithms In Python',
          issuer: 'IIT Madras & NPTEL',
          issueDate: 'Oct 2025',
          credentialId: 'NPTEL25CS89104',
          credentialUrl: 'https://nptel.ac.in',
          badgeIcon: '🐍'
        },
        {
          id: 'cert-3',
          name: 'AWS Certified Cloud Practitioner (CLF-C02)',
          issuer: 'Amazon Web Services (AWS)',
          issueDate: 'May 2025',
          credentialId: 'AWS-CCP-76291',
          credentialUrl: 'https://aws.amazon.com/verification',
          badgeIcon: '☁️'
        }
      ],
      achievements: matchedAccount.achievements || [
        {
          id: 'ach-1',
          title: 'Smart India Hackathon (SIH 2025) - National Finalist',
          issuer: 'Ministry of Education & Unstop',
          date: 'Dec 2025',
          desc: 'Selected in Top 5 teams out of 12,000+ national submissions for building AI peer doubt router.'
        },
        {
          id: 'ach-2',
          title: 'LeetCode Knight Badge (Top 2.5% Globally • Rating: 1985)',
          issuer: 'LeetCode',
          date: '2026',
          desc: 'Solved 450+ data structures & algorithms questions with 85% dynamic programming accuracy.'
        },
        {
          id: 'ach-3',
          title: 'Flipkart GRiD 6.0 Software Development Semi-Finalist',
          issuer: 'Flipkart & Unstop',
          date: 'Aug 2025',
          desc: 'Built high-throughput inventory allocation service handling 10k QPS simulation.'
        }
      ],
      projects: matchedAccount.projects || [
        {
          id: 'proj-1',
          title: 'PeerCode - WebRTC Real-Time Collaborative Workspace',
          stack: ['React', 'WebRTC', 'Node.js', 'Socket.io', 'Java'],
          desc: 'Low-latency collaborative coding and live doubt-solving workspace with synchronized editor and audio/video.',
          githubUrl: 'https://github.com/aaravsharma/peercode-workspace',
          liveUrl: 'https://peercode.studyloop.app'
        },
        {
          id: 'proj-2',
          title: 'AlgoVisualizer - Interactive Graph & DP Algorithm Visualizer',
          stack: ['JavaScript', 'Canvas API', 'Algorithms', 'CSS3'],
          desc: 'Step-by-step interactive animations for Dijkstra, BFS/DFS, 0/1 Knapsack, and Tree traversals used by 500+ students.',
          githubUrl: 'https://github.com/aaravsharma/algo-visualizer',
          liveUrl: 'https://algovis.studyloop.app'
        }
      ],
      skills: matchedAccount.skills || ['Java', 'Algorithms', 'React', 'Calculus', 'WebRTC', 'Spring Boot'],
      teachingSkills: matchedAccount.teachingSkills || ['Java', 'Algorithms', 'Data Structures'],
      learningGoals: matchedAccount.learningGoals || ['System Design', 'AI/ML', 'Microservices'],
      xp: matchedAccount.xp !== undefined ? matchedAccount.xp : 650,
      level: matchedAccount.level !== undefined ? matchedAccount.level : 4,
      coins: matchedAccount.coins !== undefined ? matchedAccount.coins : 45,
      followersCount: matchedAccount.followersCount !== undefined ? matchedAccount.followersCount : 148,
      followingCount: matchedAccount.followingCount !== undefined ? matchedAccount.followingCount : 92,
      avatarUrl: matchedAccount.avatarUrl || getDefaultAvatarByGender(matchedAccount.gender)
    };

    if (cachedMock) {
      try {
        const parsed = JSON.parse(cachedMock);
        activeMockProfile = { ...activeMockProfile, ...parsed };
      } catch (e) {}
    }

    setData({ profile: activeMockProfile });
    setEditFullName(activeMockProfile.fullName);
    setEditCollege(activeMockProfile.college);
    setEditDepartment(activeMockProfile.department);
    setEditYear(activeMockProfile.year);
    setEditGender(activeMockProfile.gender || 'male');
    setEditBio(activeMockProfile.bio);
    setEditTeachingSkills((activeMockProfile.teachingSkills || []).join(', '));
    setEditLearningGoals((activeMockProfile.learningGoals || []).join(', '));
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, authProfile]);

  // Calculate LinkedIn / Naukri Profile Completeness in Percentage
  const calculateDashboardProfileStrength = () => {
    let score = 0;
    const items = [];

    const hasBasic = !!(profile.fullName && profile.headline && profile.bio && profile.college);
    if (hasBasic) score += 20;
    items.push({ label: 'Basic Info & Bio', weight: 20, done: hasBasic });

    const hasAvatar = !!(profile.avatarUrl || profile.gender);
    if (hasAvatar) score += 15;
    items.push({ label: 'Avatar & Identity', weight: 15, done: hasAvatar });

    const hasEdu = (profile.educations || []).length > 0;
    if (hasEdu) score += 15;
    items.push({ label: 'Education History', weight: 15, done: hasEdu });

    const hasCerts = (profile.certifications || []).length > 0;
    if (hasCerts) score += 15;
    items.push({ label: 'Verified Certifications', weight: 15, done: hasCerts });

    const hasProjects = (profile.projects || []).length > 0;
    if (hasProjects) score += 15;
    items.push({ label: 'Software Projects', weight: 15, done: hasProjects });

    const hasResume = !!(profile.resumeFileName);
    if (hasResume) score += 10;
    items.push({ label: 'Resume Upload', weight: 10, done: hasResume });

    const hasSkills = (profile.teachingSkills || profile.skills || []).length > 0;
    if (hasSkills) score += 10;
    items.push({ label: 'Skills & Mentoring', weight: 10, done: hasSkills });

    let levelLabel = 'Beginner (30%)';
    let levelBadge = 'tag-secondary';
    if (score >= 100) {
      levelLabel = 'All-Star 🌟 (100%)';
      levelBadge = 'tag-success';
    } else if (score >= 70) {
      levelLabel = `Advanced 🔥 (${score}%)`;
      levelBadge = 'tag-accent';
    } else if (score >= 40) {
      levelLabel = `Intermediate ⚡ (${score}%)`;
      levelBadge = 'tag-warning';
    } else {
      levelLabel = `Beginner (${score}%)`;
      levelBadge = 'tag-secondary';
    }

    return { score, levelLabel, levelBadge, items };
  };

  const dashboardProfileStrength = calculateDashboardProfileStrength();

  // MODULAR MODAL STATES
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showResumeUploadModal, setShowResumeUploadModal] = useState(false);
  const [showResumePreviewModal, setShowResumePreviewModal] = useState(false);

  // SECTION MUTATION HELPERS
  const saveUpdatedProfile = (updatedProf) => {
    setData(prev => ({ ...prev, profile: updatedProf }));
    updateProfileState(updatedProf);
    if (updatedProf.id) {
      localStorage.setItem(`studyloop_profile_${updatedProf.id}`, JSON.stringify(updatedProf));
    }
  };

  // Education Handlers
  const handleAddEducation = (newEdu) => {
    const updated = {
      ...profile,
      educations: [newEdu, ...(profile.educations || [])]
    };
    saveUpdatedProfile(updated);
    setShowAddEducationModal(false);
    alert("🎓 Education entry added to profile!");
  };

  const handleDeleteEducation = (eduId) => {
    const updated = {
      ...profile,
      educations: (profile.educations || []).filter(e => e.id !== eduId)
    };
    saveUpdatedProfile(updated);
  };

  // Certification Handlers
  const handleAddCertificate = (newCert) => {
    const updated = {
      ...profile,
      certifications: [newCert, ...(profile.certifications || [])]
    };
    saveUpdatedProfile(updated);
    setShowAddCertificateModal(false);
    alert("📜 License & Certificate added to profile!");
  };

  const handleDeleteCertificate = (certId) => {
    const updated = {
      ...profile,
      certifications: (profile.certifications || []).filter(c => c.id !== certId)
    };
    saveUpdatedProfile(updated);
  };

  // Achievement Handlers
  const handleAddAchievement = (newAch) => {
    const updated = {
      ...profile,
      achievements: [newAch, ...(profile.achievements || [])]
    };
    saveUpdatedProfile(updated);
    setShowAddAchievementModal(false);
    alert("🏆 Honor & Achievement added to profile!");
  };

  const handleDeleteAchievement = (achId) => {
    const updated = {
      ...profile,
      achievements: (profile.achievements || []).filter(a => a.id !== achId)
    };
    saveUpdatedProfile(updated);
  };

  // Project Handlers
  const handleAddProject = (newProj) => {
    const updated = {
      ...profile,
      projects: [newProj, ...(profile.projects || [])]
    };
    saveUpdatedProfile(updated);
    setShowAddProjectModal(false);
    alert("💻 Technical Project added to portfolio!");
  };

  const handleDeleteProject = (projId) => {
    const updated = {
      ...profile,
      projects: (profile.projects || []).filter(p => p.id !== projId)
    };
    saveUpdatedProfile(updated);
  };

  // Skill Handlers
  const handleAddSkill = (skillName, category) => {
    if (!skillName.trim()) return;
    let updated = { ...profile };
    if (category === 'teaching') {
      updated.teachingSkills = [...(profile.teachingSkills || []), skillName.trim()];
    } else if (category === 'learning') {
      updated.learningGoals = [...(profile.learningGoals || []), skillName.trim()];
    } else {
      updated.skills = [...(profile.skills || []), skillName.trim()];
    }
    saveUpdatedProfile(updated);
    setShowAddSkillModal(false);
    alert("⭐ Skill added successfully!");
  };

  const handleEndorseSkill = (skill) => {
    alert(`👍 You endorsed ${profile.fullName} for ${skill}! (+1 Skill Trust Point)`);
  };

  // Resume Upload Handler
  const handleUploadResume = (fileName) => {
    const updated = {
      ...profile,
      resumeFileName: fileName,
      resumeUploadDate: 'Aug 2026'
    };
    saveUpdatedProfile(updated);
    setShowResumeUploadModal(false);
    alert(`📄 Resume updated to "${fileName}"!`);
  };



  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedProf = {
      ...profile,
      fullName: editFullName || profile.fullName,
      college: editCollege || profile.college,
      department: editDepartment || profile.department,
      year: parseInt(editYear) || profile.year,
      gender: editGender || profile.gender,
      bio: editBio || profile.bio,
      teachingSkills: typeof editTeachingSkills === 'string' ? editTeachingSkills.split(',').map(s => s.trim()).filter(Boolean) : (profile.teachingSkills || []),
      learningGoals: typeof editLearningGoals === 'string' ? editLearningGoals.split(',').map(s => s.trim()).filter(Boolean) : (profile.learningGoals || [])
    };

    if (!updatedProf.avatarUrl || updatedProf.avatarUrl.includes('svg')) {
      updatedProf.avatarUrl = getDefaultAvatarByGender(editGender, updatedProf.avatarUrl);
    }

    setData(prev => ({ ...prev, profile: updatedProf }));
    updateProfileState(updatedProf);
    if (updatedProf.id) {
      localStorage.setItem(`studyloop_profile_${updatedProf.id}`, JSON.stringify(updatedProf));
    }
    setShowEditModal(false);
    alert("✨ Profile updated successfully!");
  };

  const handleSaveAvatar = (newAvatarUrl) => {
    if (!newAvatarUrl) return;
    const updatedProf = { ...profile, avatarUrl: newAvatarUrl };
    saveUpdatedProfile(updatedProf);
    setShowAvatarModal(false);
  };

  const claimStreakBonus = () => {
    const updatedProf = {
      ...profile,
      xp: (profile.xp || 650) + 2,
      coins: (profile.coins || 45) + 1
    };
    saveUpdatedProfile(updatedProf);
    alert("🔥 Daily Streak claimed! +2 XP & +1 Peer Coin added to your wallet.");
  };

  const handleAcceptRequest = (req) => {
    setPendingRequests(prev => prev.filter(r => r.id !== req.id));
    setConnectionsList(prev => [
      ...prev,
      {
        id: req.id,
        fullName: req.fullName,
        college: req.college,
        department: req.department,
        year: req.year,
        isOnline: true,
        avatarUrl: req.avatarUrl,
        teachingSkills: req.skills || ['General Academics'],
        rating: 5.0
      }
    ]);
    alert(`🎉 Connected with ${req.fullName}!`);
  };

  const handleIgnoreRequest = (reqId) => {
    setPendingRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleLikeMedia = () => {
    if (!selectedMedia) return;
    setSelectedMedia(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    if (selectedMedia.type === 'reel') {
      setReelsList(prev => prev.map(r => r.id === selectedMedia.id ? { ...r, likes: r.likes + 1 } : r));
    } else if (selectedMedia.type === 'post') {
      setPostsList(prev => prev.map(p => p.id === selectedMedia.id ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedMedia) return;
    const newC = { author: profile.fullName || 'You', text: commentInput.trim() };
    setSelectedMedia(prev => ({ ...prev, comments: [...(prev.comments || []), newC] }));
    if (selectedMedia.type === 'reel') {
      setReelsList(prev => prev.map(r => r.id === selectedMedia.id ? { ...r, comments: [...(r.comments || []), newC] } : r));
    } else if (selectedMedia.type === 'post') {
      setPostsList(prev => prev.map(p => p.id === selectedMedia.id ? { ...p, comments: [...(p.comments || []), newC] } : p));
    }
    setCommentInput('');
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
      alert("Please enter a title for your content!");
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
        videoUrl: filePreviewUrl || 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        comments: []
      };
      setReelsList(prev => [newReel, ...prev]);
      setActiveTabName('reels');
      alert("📱 Educational Reel published successfully!");
    } else if (uploadType === 'video') {
      const newVid = {
        id: `vid-${Date.now()}`,
        title: uploadTitle.trim(),
        duration: uploadDuration || '15:20',
        views: '1',
        likes: 1,
        thumbnail: filePreviewUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
        comments: []
      };
      setVideosList(prev => [newVid, ...prev]);
      setActiveTabName('videos');
      alert("🎥 Long Lecture Video published!");
    } else {
      const newPost = {
        id: `post-${Date.now()}`,
        title: uploadTitle.trim(),
        image: filePreviewUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        likes: 1,
        comments: []
      };
      setPostsList(prev => [newPost, ...prev]);
      setActiveTabName('posts');
      alert("🖼️ Study Post published!");
    }

    setShowUploadModal(false);
    setUploadTitle('');
    setFilePreviewUrl('');
  };

  const xpProgress = Math.min(100, Math.round(((profile.xp || 650) % 200) / 2));
  const educations = profile.educations || [];
  const certifications = profile.certifications || [];
  const achievements = profile.achievements || [];
  const projects = profile.projects || [];
  const socialLinks = profile.socialLinks || {};

  return (
    <div style={{ padding: '1.5rem 2.5rem 4rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 1. LINKEDIN-STYLE PROFILE COVER & HEADER CARD */}
      <div className="card-premium" style={{ marginBottom: '2rem', padding: 0, overflow: 'hidden', position: 'relative' }}>
        
        {/* COVER BANNER */}
        <div style={{ height: '180px', width: '100%', background: 'linear-gradient(135deg, #0066FF 0%, #00C6FF 50%, #4F46E5 100%)', position: 'relative' }}>
          <button 
            onClick={() => alert("📸 Cover photo upload: Select custom background banner")}
            style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-full)', padding: '0.4rem 0.875rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}
          >
            <Camera size={14} /> Edit Cover
          </button>
        </div>

        {/* PROFILE INTRO BODY */}
        <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginTop: '-60px', marginBottom: '1.25rem' }}>
            
            {/* AVATAR + 100% COMPLETION GREEN MARK + FLOATING EDIT PENCIL */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowPhotoPreview(true)}
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  padding: '4px',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: dashboardProfileStrength.score === 100 
                    ? '0 0 0 3px #10b981, 0 0 20px rgba(16, 185, 129, 0.4)' 
                    : 'var(--shadow-lg)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                title={dashboardProfileStrength.score === 100 ? "100% Profile Completed (All-Star) - Click to preview" : "Click to preview avatar"}
              >
                <img 
                  src={getDefaultAvatarByGender(profile.gender, profile.avatarUrl)} 
                  alt="Avatar" 
                  onError={(e) => { e.target.src = getDefaultAvatarByGender(profile.gender); }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    border: '3.5px solid #10b981', 
                    objectFit: 'cover' 
                  }} 
                />

                {/* TOP-RIGHT BADGE: 100% TICK MARK OR EXACT PERCENTAGE */}
                <div
                  title={dashboardProfileStrength.score === 100 ? "100% Profile Completed" : `${dashboardProfileStrength.score}% Profile Completed`}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: '3px solid var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    zIndex: 5
                  }}
                >
                  {dashboardProfileStrength.score === 100 ? (
                    <Check size={18} style={{ strokeWidth: 3.5 }} />
                  ) : (
                    <span>{dashboardProfileStrength.score}%</span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('settings'); }}
                title="Edit Profile & Settings"
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: '3px solid var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)',
                  zIndex: 6
                }}
              >
                <Pencil size={16} style={{ strokeWidth: 2.5 }} />
              </button>
            </div>

            {/* QUICK ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
              
              <button 
                onClick={() => setActiveTab('settings')} 
                className="btn btn-primary"
                style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 700 }}
              >
                <Settings size={14} /> Edit Profile & Settings
              </button>

              <button 
                onClick={claimStreakBonus} 
                className="btn btn-accent"
                style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 800 }}
              >
                <Flame size={15} /> Streak (+2 XP)
              </button>

            </div>

          </div>

          {/* NAME, HEADLINE & METADATA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 className="font-serif" style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>
                {profile.fullName || 'Aarav Sharma'}
              </h1>
              <span className="tag tag-accent" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                ✓ Verified Student
              </span>
              <span className="tag tag-success" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                🎓 Open to 1:1 Peer Mentoring
              </span>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {profile.headline || 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <GraduationCap size={15} style={{ color: 'var(--accent-primary)' }} />
                {profile.college || 'IIT Madras'} • {profile.department || 'Computer Science'} (Year {profile.year || 2})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                {profile.location || 'Chennai, Tamil Nadu, India'}
              </span>
              <span style={{ color: 'var(--warning-color)', fontWeight: 700 }}>
                ⭐ {profile.conceptClarityRating || 4.9} Tutor Rating ({profile.classesTaught || 24} Classes Taught)
              </span>
            </div>

            {/* SOCIAL / CODING HANDLES STRIP */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="tag tag-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Github size={13} /> GitHub Profile ↗
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="tag tag-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Briefcase size={13} /> LinkedIn ↗
                </a>
              )}
              {socialLinks.leetcode && (
                <a href={socialLinks.leetcode} target="_blank" rel="noreferrer" className="tag tag-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Code size={13} /> LeetCode (Knight) ↗
                </a>
              )}
              {socialLinks.portfolio && (
                <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" className="tag tag-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Globe size={13} /> Portfolio Website ↗
                </a>
              )}
            </div>

            {/* COUNTERS STRIP */}
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem' }}>
              <div><strong>{postsList.length}</strong> <span style={{ color: 'var(--text-secondary)' }}>posts</span></div>
              <div><strong>{reelsList.length}</strong> <span style={{ color: 'var(--text-secondary)' }}>shorts</span></div>
              <div 
                onClick={() => onOpenUserList && onOpenUserList('Followers', profile.id)} 
                style={{ cursor: 'pointer' }}
              >
                <strong>{profile.followersCount !== undefined ? profile.followersCount : 148}</strong> <span style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>followers</span>
              </div>
              <div 
                onClick={() => onOpenUserList && onOpenUserList('Following', profile.id)} 
                style={{ cursor: 'pointer' }}
              >
                <strong>{profile.followingCount !== undefined ? profile.followingCount : 92}</strong> <span style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>following</span>
              </div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                ⚡ {profile.xp || 650} XP • Lvl {profile.level || 4}
              </div>
            </div>

            {/* ABOUT / BIO */}
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {profile.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught'}
              </p>
            </div>

          </div>

          {/* XP PROGRESS BAR */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
              <span>Campus Rank: <strong>#1 In Computer Science</strong></span>
              <span>🪙 {profile.coins !== undefined ? profile.coins : 45} Peer Coins Balance</span>
              <span>Level {profile.level || 4} ({xpProgress}% to Level { (profile.level || 4) + 1 })</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${xpProgress}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-full)' }}></div>
            </div>
          </div>

        </div>
      </div>



      {/* 3. CAREER & RESUME HUB CARD (LINKEDIN / NAUKRI STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', backgroundColor: 'rgba(0, 102, 255, 0.03)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {profile.resumeFileName || 'Aarav_Sharma_BTech_CS_Resume.pdf'}
              </div>
              <span className="tag tag-success" style={{ fontSize: '0.6875rem' }}>✓ Active ATS Resume</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
              Uploaded {profile.resumeUploadDate || 'Aug 2026'} • Visible to peer mentors, hackathon recruiters & campus organizers
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button 
            onClick={() => setShowResumeUploadModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 700 }}
          >
            <UploadCloud size={15} /> Upload / Replace PDF
          </button>
          <button 
            onClick={() => setShowResumePreviewModal(true)} 
            className="btn btn-accent" 
            style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 800 }}
          >
            <Download size={15} /> 1-Click ATS Resume
          </button>
        </div>
      </div>

      {/* 3. EDUCATION SECTION CARD (LINKEDIN STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <GraduationCap size={22} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Education & Academics</h3>
          </div>
          <button 
            onClick={() => setShowAddEducationModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Education
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {educations.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  🎓
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{edu.school}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{edu.degree} • {edu.field}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {edu.startYear} – {edu.endYear} • <strong style={{ color: 'var(--accent-primary)' }}>Grade: {edu.grade}</strong>
                  </div>
                  {edu.activities && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                      <em>Activities: {edu.activities}</em>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleDeleteEducation(edu.id)} 
                className="btn-icon" 
                title="Delete Education"
                style={{ color: 'var(--danger-color)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LICENSES & CERTIFICATIONS SECTION CARD (LINKEDIN STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Award size={22} style={{ color: 'var(--warning-color)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Licenses & Verified Certifications</h3>
          </div>
          <button 
            onClick={() => setShowAddCertificateModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Certification
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  {cert.badgeIcon || '📜'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{cert.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Issuing Organization: <strong>{cert.issuer}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Issued {cert.issueDate} • Credential ID: <code style={{ backgroundColor: 'var(--bg-card)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{cert.credentialId}</code>
                  </div>
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '0.375rem', textDecoration: 'none' }}
                    >
                      Show credential <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleDeleteCertificate(cert.id)} 
                className="btn-icon" 
                title="Delete Certification"
                style={{ color: 'var(--danger-color)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HONORS & ACHIEVEMENTS SECTION CARD (UNSTOP STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Trophy size={22} style={{ color: '#ea580c' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Honors & Hackathon Achievements (Unstop Style)</h3>
          </div>
          <button 
            onClick={() => setShowAddAchievementModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Achievement
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {achievements.map(ach => (
            <div key={ach.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  🏆
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{ach.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Issuer: <strong>{ach.issuer}</strong> • {ach.date}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem', lineHeight: 1.4 }}>
                    {ach.desc}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleDeleteAchievement(ach.id)} 
                className="btn-icon" 
                title="Delete Achievement"
                style={{ color: 'var(--danger-color)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PROJECTS PORTFOLIO SECTION CARD (GITHUB STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Code size={22} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Technical Projects & Repositories</h3>
          </div>
          <button 
            onClick={() => setShowAddProjectModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Project
          </button>
        </div>

        <div className="grid-2">
          {projects.map(proj => (
            <div key={proj.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{proj.title}</div>
                  <button 
                    onClick={() => handleDeleteProject(proj.id)} 
                    className="btn-icon" 
                    title="Delete Project"
                    style={{ color: 'var(--danger-color)' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 0.75rem 0' }}>
                  {proj.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                  {proj.stack.map((st, i) => (
                    <span key={i} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>
                      #{st}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.6rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <Github size={14} /> Code Repo ↗
                  </a>
                )}
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="btn btn-accent" style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.6rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <Globe size={14} /> Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. SKILLS & PEER ENDORSEMENTS SECTION CARD */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Star size={22} style={{ color: 'var(--warning-color)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Technical Skills & Peer Endorsements</h3>
          </div>
          <button 
            onClick={() => setShowAddSkillModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Skill
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              🎓 1:1 Mentoring Expertises
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.teachingSkills || ['Java', 'Algorithms', 'Data Structures']).map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--accent-primary)' }}>⭐ {skill}</span>
                  <button onClick={() => handleEndorseSkill(skill)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }} title="Endorse this skill">
                    +1 👍
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              🎯 Learning & Exploration Goals
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.learningGoals || ['System Design', 'AI/ML', 'Microservices']).map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--success-color)' }}>🚀 {skill}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 8. DASHBOARD MEDIA TABS NAVBAR (POSTS / SHORTS / LECTURES / CONNECTIONS) */}
      <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', gap: '0.5rem' }}>
        <button 
          onClick={() => setActiveTabName('posts')}
          style={{
            padding: '0.875rem 2rem',
            border: 'none',
            borderBottom: activeTabName === 'posts' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeTabName === 'posts' ? 700 : 500,
            color: activeTabName === 'posts' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Grid size={18} /> POSTS ({postsList.length})
        </button>

        <button 
          onClick={() => setActiveTabName('reels')}
          style={{
            padding: '0.875rem 2rem',
            border: 'none',
            borderBottom: activeTabName === 'reels' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeTabName === 'reels' ? 700 : 500,
            color: activeTabName === 'reels' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Tv2 size={18} /> SHORTS ({reelsList.length})
        </button>

        <button 
          onClick={() => setActiveTabName('videos')}
          style={{
            padding: '0.875rem 2rem',
            border: 'none',
            borderBottom: activeTabName === 'videos' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeTabName === 'videos' ? 700 : 500,
            color: activeTabName === 'videos' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Bookmark size={18} /> LECTURES ({videosList.length})
        </button>

        <button 
          onClick={() => setActiveTabName('connections')}
          style={{
            padding: '0.875rem 2rem',
            border: 'none',
            borderBottom: activeTabName === 'connections' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeTabName === 'connections' ? 700 : 500,
            color: activeTabName === 'connections' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <UserCheck size={18} /> CONNECTIONS ({connectionsList.length})
        </button>
      </div>

      {/* TAB CONTENT 1: POSTS GRID */}
      {activeTabName === 'posts' && (
        <div className="grid-3">
          {postsList.map(post => (
            <div 
              key={post.id} 
              onClick={() => setSelectedMedia({ ...post, type: 'post' })}
              className="card-premium interactive-hover" 
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <img src={post.image} alt="Post" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                  {post.title}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>❤️ {post.likes} likes</span>
                  <span>💬 {post.comments.length} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 2: REELS GRID (9:16 VERTICAL SHORTS) */}
      {activeTabName === 'reels' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>My Published Concept Shorts (9:16)</h3>
            <button onClick={() => { setUploadType('reel'); setShowUploadModal(true); }} className="btn btn-accent" style={{ fontSize: '0.8125rem' }}>
              <PlusCircle size={15} /> Upload Short Reel
            </button>
          </div>

          <div className="grid-3">
            {reelsList.map(reel => (
              <div 
                key={reel.id} 
                onClick={() => setSelectedMedia({ ...reel, type: 'reel' })}
                className="card-premium interactive-hover" 
                style={{ 
                  padding: 0, 
                  overflow: 'hidden', 
                  aspectRatio: '9 / 16', 
                  maxHeight: '380px', 
                  backgroundColor: '#09090b', 
                  position: 'relative'
                }}
              >
                <video src={reel.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#ffffff', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700 }}>
                  ⚡ 9:16 • {reel.duration}
                </div>

                <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', color: '#ffffff' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem', lineHeight: 1.3 }}>{reel.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.9 }}>
                    <span>▶ {reel.views} views</span>
                    <span style={{ color: '#f43f5e', fontWeight: 700 }}>❤️ {reel.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: LONG LECTURES (16:9) */}
      {activeTabName === 'videos' && (
        <div className="grid-2">
          {videosList.map(vid => (
            <div 
              key={vid.id} 
              onClick={() => setSelectedMedia({ ...vid, type: 'video' })}
              className="card-premium interactive-hover" 
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', aspectRatio: '16 / 9', backgroundColor: '#000000', overflow: 'hidden' }}>
                <img src={vid.thumbnail} alt="Video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', color: '#ffffff', padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  🎥 16:9 • {vid.duration}
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{vid.title}</div>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>▶ {vid.views} views</span>
                  <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>❤️ {vid.likes} likes</span>
                  <span>💬 {vid.comments.length} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 4: REAL-TIME CONNECTIONS */}
      {activeTabName === 'connections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* PENDING INCOMING REQUESTS */}
          {pendingRequests.length > 0 && (
            <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
              <h3 className="font-serif" style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} style={{ color: 'var(--accent-primary)' }} /> Pending Connection Requests ({pendingRequests.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingRequests.map(req => (
                  <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <img src={req.avatarUrl} alt="Req" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{req.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{req.college} • {req.department} (Year {req.year})</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleAcceptRequest(req)} className="btn btn-primary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}>
                        Accept Request
                      </button>
                      <button onClick={() => handleIgnoreRequest(req.id)} className="btn btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}>
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE CONNECTIONS LIST */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Your Connected Campus Mentors & Peers</h3>
              <button onClick={() => setActiveTab('discover')} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
                + Find More Peers
              </button>
            </div>

            <div className="grid-2">
              {connectionsList.map(conn => (
                <div key={conn.id} className="card-premium" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={conn.avatarUrl} alt="Conn" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      {conn.isOnline && (
                        <div className="live-dot" style={{ position: 'absolute', bottom: '2px', right: '2px', backgroundColor: '#22c55e', width: '10px', height: '10px' }} title="Online Now"></div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{conn.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{conn.college} • {conn.department}</div>
                      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                        {(conn.teachingSkills || []).map((s, i) => (
                          <span key={i} className="tag tag-accent" style={{ fontSize: '0.625rem', padding: '0.1rem 0.375rem' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onStartChat && onStartChat(conn)}
                    className="btn btn-primary"
                    style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}
                  >
                    <MessageSquare size={13} /> Chat
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}



      {/* --- MODAL 2: ADD EDUCATION MODAL --- */}
      {showAddEducationModal && (
        <AddEducationModal
          onClose={() => setShowAddEducationModal(false)}
          onSave={handleAddEducation}
        />
      )}

      {/* --- MODAL 3: ADD CERTIFICATE MODAL --- */}
      {showAddCertificateModal && (
        <AddCertificateModal
          onClose={() => setShowAddCertificateModal(false)}
          onSave={handleAddCertificate}
        />
      )}

      {/* --- MODAL 4: ADD ACHIEVEMENT MODAL --- */}
      {showAddAchievementModal && (
        <AddAchievementModal
          onClose={() => setShowAddAchievementModal(false)}
          onSave={handleAddAchievement}
        />
      )}

      {/* --- MODAL 5: ADD PROJECT MODAL --- */}
      {showAddProjectModal && (
        <AddProjectModal
          onClose={() => setShowAddProjectModal(false)}
          onSave={handleAddProject}
        />
      )}

      {/* --- MODAL 6: ADD SKILL MODAL --- */}
      {showAddSkillModal && (
        <AddSkillModal
          onClose={() => setShowAddSkillModal(false)}
          onSave={handleAddSkill}
        />
      )}

      {/* --- MODAL 7: RESUME UPLOAD MODAL --- */}
      {showResumeUploadModal && (
        <ResumeUploadModal
          currentFileName={profile.resumeFileName}
          onClose={() => setShowResumeUploadModal(false)}
          onUpload={handleUploadResume}
        />
      )}

      {/* --- MODAL 8: ATS RESUME PREVIEW & PRINT MODAL --- */}
      {showResumePreviewModal && (
        <ResumePreviewModal
          profile={profile}
          onClose={() => setShowResumePreviewModal(false)}
        />
      )}

      {/* THEATER VIDEO PLAYER MODAL */}
      {selectedMedia && (() => {
        const isShort = selectedMedia.type === 'reel';

        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 13, 22, 0.92)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div className="card-premium" style={{ width: '100%', maxWidth: isShort ? '460px' : '720px', padding: '1.75rem', borderRadius: 'var(--radius-xl)', position: 'relative', maxHeight: '92vh', overflowY: 'auto', backgroundColor: 'var(--bg-elevated)' }}>
              
              <button 
                onClick={() => setSelectedMedia(null)} 
                className="btn-icon"
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <img src={profile.avatarUrl} alt="Avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{profile.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{profile.college} • {profile.department}</div>
                </div>
              </div>

              {/* VIDEO PLAYER */}
              <div style={{ 
                position: 'relative', 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden', 
                backgroundColor: '#000000', 
                marginBottom: '1.25rem', 
                aspectRatio: isShort ? '9 / 16' : '16 / 9',
                maxHeight: isShort ? '440px' : '360px',
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

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{selectedMedia.title}</h3>
              </div>

              {/* ACTION BAR */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button onClick={handleLikeMedia} className="btn btn-secondary" style={{ color: 'var(--danger-color)', fontWeight: 700 }}>
                    ❤️ Like ({selectedMedia.likes})
                  </button>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    💬 {selectedMedia.comments ? selectedMedia.comments.length : 0} Comments
                  </span>
                </div>
              </div>

              {/* COMMENTS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {(selectedMedia.comments || []).map((c, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{c.author}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{c.text}</span>
                  </div>
                ))}
              </div>

              {/* ADD COMMENT FORM */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Add a peer comment..." 
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                />
                <button type="submit" className="btn btn-accent"><Send size={15} /></button>
              </form>

            </div>
          </div>
        );
      })()}

      {/* MEDIA CREATOR STUDIO MODAL */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusCircle size={22} />
                </div>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: 0 }}>Create & Upload Media</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Publish Short Reels (9:16) or Long Lecture Videos to your student profile</p>
                </div>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="btn-icon"><X size={20} /></button>
            </div>

            <form onSubmit={handlePublishContent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Select Content Format</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setUploadType('reel'); setUploadDuration('0:45'); }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: uploadType === 'reel' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: uploadType === 'reel' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      color: uploadType === 'reel' ? 'var(--accent-primary)' : 'var(--text-secondary)',
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
                      borderRadius: 'var(--radius-md)',
                      border: uploadType === 'video' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: uploadType === 'video' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      color: uploadType === 'video' ? 'var(--accent-primary)' : 'var(--text-secondary)',
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
                      borderRadius: 'var(--radius-md)',
                      border: uploadType === 'post' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: uploadType === 'post' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      color: uploadType === 'post' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    🖼️ Study Notes Post
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Title / Headline</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder={uploadType === 'reel' ? "e.g. 3 Tricks to solve Recursion fast ⚡" : "e.g. Operating Systems: Deadlock Prevention"} 
                  value={uploadTitle} 
                  onChange={e => setUploadTitle(e.target.value)} 
                  required 
                />
              </div>

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
                    placeholder="e.g. 0:45" 
                    value={uploadDuration} 
                    onChange={e => setUploadDuration(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="label">Upload Media File</label>
                <input 
                  type="file" 
                  accept="video/*,image/*" 
                  onChange={handleFileSelect} 
                  className="input" 
                  style={{ padding: '0.5rem' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem' }}>
                  🚀 Publish to Profile & Feed
                </button>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* AVATAR CHANGE MODAL */}
      {showAvatarModal && (
        <AvatarChangeModal
          currentAvatarUrl={profile.avatarUrl}
          onSave={handleSaveAvatar}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* PHOTO PREVIEW LIGHTBOX */}
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

// --- MODAL COMPONENT 1: EDIT INTRO MODAL ---
function EditIntroModal({ profile, onClose, onSave }) {
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [college, setCollege] = useState(profile?.college || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [year, setYear] = useState(profile?.year || 2);
  const [location, setLocation] = useState(profile?.location || 'Chennai, India');
  const [bio, setBio] = useState(profile?.bio || '');
  const [gender, setGender] = useState(profile?.gender || 'male');
  
  const social = profile?.socialLinks || {};
  const [github, setGithub] = useState(social.github || '');
  const [linkedin, setLinkedin] = useState(social.linkedin || '');
  const [leetcode, setLeetcode] = useState(social.leetcode || '');
  const [portfolio, setPortfolio] = useState(social.portfolio || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      fullName,
      headline,
      college,
      department,
      year,
      location,
      bio,
      gender,
      socialLinks: {
        github,
        linkedin,
        leetcode,
        portfolio
      }
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '640px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: 0, fontWeight: 800 }}>Edit Intro & Professional Links</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Configure your LinkedIn / Unstop header details</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>

          <div>
            <label className="label">Professional Headline (Tagline)</label>
            <input type="text" className="input" placeholder="e.g. B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist" value={headline} onChange={e => setHeadline(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">College / University</label>
              <input type="text" className="input" value={college} onChange={e => setCollege(e.target.value)} required />
            </div>
            <div>
              <label className="label">Department / Branch</label>
              <input type="text" className="input" value={department} onChange={e => setDepartment(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Academic Year</label>
              <select className="input" value={year} onChange={e => setYear(e.target.value)}>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year (Senior)</option>
              </select>
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="male">👨 Male</option>
                <option value="female">👩 Female</option>
                <option value="other">👤 Other</option>
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input type="text" className="input" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Student Bio</label>
            <textarea className="input" style={{ minHeight: '75px', resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} />
          </div>

          {/* Social Links */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
              🔗 Coding & Social Handles (GitHub, LinkedIn, LeetCode)
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="label">GitHub Profile URL</label>
                <input type="url" className="input" placeholder="https://github.com/yourhandle" value={github} onChange={e => setGithub(e.target.value)} />
              </div>
              <div>
                <label className="label">LinkedIn Profile URL</label>
                <input type="url" className="input" placeholder="https://linkedin.com/in/yourhandle" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              </div>
              <div>
                <label className="label">LeetCode Profile URL</label>
                <input type="url" className="input" placeholder="https://leetcode.com/yourhandle" value={leetcode} onChange={e => setLeetcode(e.target.value)} />
              </div>
              <div>
                <label className="label">Portfolio Website URL</label>
                <input type="url" className="input" placeholder="https://yourdomain.dev" value={portfolio} onChange={e => setPortfolio(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Save Intro</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>

        </form>

      </div>
    </div>
  );
}

// --- MODAL COMPONENT 2: ADD EDUCATION MODAL ---
function AddEducationModal({ onClose, onSave }) {
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('Bachelor of Technology - B.Tech');
  const [field, setField] = useState('Computer Science & Engineering');
  const [startYear, setStartYear] = useState('2023');
  const [endYear, setEndYear] = useState('2027');
  const [grade, setGrade] = useState('8.95 / 10.0 CGPA');
  const [activities, setActivities] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!school.trim()) return;
    onSave({
      id: `edu-${Date.now()}`,
      school: school.trim(),
      degree,
      field: field.trim(),
      startYear,
      endYear,
      grade: grade.trim(),
      activities: activities.trim()
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add Education & Degree</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">School / College / University Name</label>
            <input type="text" className="input" placeholder="e.g. Indian Institute of Technology (IIT) Madras" value={school} onChange={e => setSchool(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Degree</label>
              <select className="input" value={degree} onChange={e => setDegree(e.target.value)}>
                <option value="Bachelor of Technology - B.Tech">B.Tech</option>
                <option value="Diploma in Engineering">Diploma</option>
                <option value="Bachelor of Engineering - B.E.">B.E.</option>
                <option value="Bachelor of Computer Applications - BCA">BCA</option>
                <option value="Master of Technology - M.Tech">M.Tech</option>
                <option value="Master of Computer Applications - MCA">MCA</option>
                <option value="Higher Secondary School Certificate (Class XII)">Class XII</option>
              </select>
            </div>
            <div>
              <label className="label">Field of Study / Branch</label>
              <input type="text" className="input" placeholder="e.g. Computer Science" value={field} onChange={e => setField(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Start Year</label>
              <input type="text" className="input" placeholder="2023" value={startYear} onChange={e => setStartYear(e.target.value)} required />
            </div>
            <div>
              <label className="label">End Year (or Expected)</label>
              <input type="text" className="input" placeholder="2027" value={endYear} onChange={e => setEndYear(e.target.value)} required />
            </div>
            <div>
              <label className="label">Grade / CGPA</label>
              <input type="text" className="input" placeholder="8.95 CGPA" value={grade} onChange={e => setGrade(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Activities & Societies (Optional)</label>
            <input type="text" className="input" placeholder="e.g. Lead at GDSC, Campus Doubt Peer Mentor" value={activities} onChange={e => setActivities(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Education 🎓</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

// --- MODAL COMPONENT 3: ADD CERTIFICATE MODAL ---
function AddCertificateModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('Oracle');
  const [issueDate, setIssueDate] = useState('Jan 2026');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('☕');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: `cert-${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim(),
      credentialId: credentialId.trim() || `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
      credentialUrl: credentialUrl.trim() || 'https://verification.studyloop.app',
      badgeIcon
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add License or Certification</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Certification Name</label>
            <input type="text" className="input" placeholder="e.g. Oracle Certified Associate, Java SE 8 Programmer" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Issuing Organization</label>
              <input type="text" className="input" placeholder="e.g. Oracle, AWS, NPTEL, Coursera, Google" value={issuer} onChange={e => setIssuer(e.target.value)} required />
            </div>
            <div>
              <label className="label">Badge Icon</label>
              <select className="input" value={badgeIcon} onChange={e => setBadgeIcon(e.target.value)}>
                <option value="☕">☕ Java / Oracle</option>
                <option value="🐍">🐍 Python / Data</option>
                <option value="☁️">☁️ Cloud / AWS</option>
                <option value="🧠">🧠 AI / Machine Learning</option>
                <option value="⚡">⚡ Electronics / C++</option>
                <option value="📜">📜 Standard Certificate</option>
                <option value="🏆">🏆 Competition Award</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Issue Date</label>
              <input type="text" className="input" placeholder="e.g. Jan 2026" value={issueDate} onChange={e => setIssueDate(e.target.value)} required />
            </div>
            <div>
              <label className="label">Credential ID</label>
              <input type="text" className="input" placeholder="e.g. OCA-JAVA-98742" value={credentialId} onChange={e => setCredentialId(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Credential Verification URL (Optional)</label>
            <input type="url" className="input" placeholder="https://catalog-education.oracle.com/ords/certview" value={credentialUrl} onChange={e => setCredentialUrl(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Certificate 📜</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

// --- MODAL COMPONENT 4: ADD ACHIEVEMENT MODAL (UNSTOP STYLE) ---
function AddAchievementModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('Ministry of Education & Unstop');
  const [date, setDate] = useState('Dec 2025');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: `ach-${Date.now()}`,
      title: title.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
      desc: desc.trim() || 'Recognized for outstanding technical performance and problem solving.'
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add Honor & Hackathon Achievement</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Achievement / Award Title</label>
            <input type="text" className="input" placeholder="e.g. Smart India Hackathon (SIH 2025) - National Finalist" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Issuer / Competition Platform</label>
              <input type="text" className="input" placeholder="e.g. Unstop, LeetCode, Flipkart, ICPC" value={issuer} onChange={e => setIssuer(e.target.value)} required />
            </div>
            <div>
              <label className="label">Date / Year</label>
              <input type="text" className="input" placeholder="e.g. Dec 2025" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Description / Summary of Impact</label>
            <textarea className="input" style={{ minHeight: '75px', resize: 'vertical' }} placeholder="Selected in Top 5 teams out of 12,000+ national submissions for building AI doubt router." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Achievement 🏆</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

// --- MODAL COMPONENT 5: ADD PROJECT MODAL (GITHUB STYLE) ---
function AddProjectModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [stackStr, setStackStr] = useState('React, Node.js, WebRTC');
  const [desc, setDesc] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: `proj-${Date.now()}`,
      title: title.trim(),
      stack: stackStr.split(',').map(s => s.trim()).filter(Boolean),
      desc: desc.trim() || 'Built full-stack technical project with modern architecture.',
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim()
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add Technical Project</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Project Name</label>
            <input type="text" className="input" placeholder="e.g. PeerCode - Real-Time Collaborative Workspace" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="label">Tech Stack (comma separated tags)</label>
            <input type="text" className="input" placeholder="React, WebRTC, Node.js, Socket.io, Java" value={stackStr} onChange={e => setStackStr(e.target.value)} required />
          </div>

          <div>
            <label className="label">Project Summary & Features</label>
            <textarea className="input" style={{ minHeight: '75px', resize: 'vertical' }} placeholder="Low-latency collaborative coding and live doubt-solving workspace with synchronized editor." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">GitHub Repository URL</label>
              <input type="url" className="input" placeholder="https://github.com/username/repo" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
            </div>
            <div>
              <label className="label">Live Deployed Demo URL</label>
              <input type="url" className="input" placeholder="https://project.studyloop.app" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Project 💻</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

// --- MODAL COMPONENT 6: ADD SKILL MODAL ---
function AddSkillModal({ onClose, onSave }) {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('teaching'); // teaching, general, learning

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    onSave(skillName.trim(), category);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add Technical Skill</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Skill Name</label>
            <input type="text" className="input" placeholder="e.g. Java, Spring Boot, Dynamic Programming, React" value={skillName} onChange={e => setSkillName(e.target.value)} required />
          </div>

          <div>
            <label className="label">Category</label>
            <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="teaching">🎓 Mentoring / Teaching Skill (I can teach peers)</option>
              <option value="general">💻 General Technical Skill</option>
              <option value="learning">🚀 Learning & Exploration Goal</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Skill ⭐</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

// --- MODAL COMPONENT 7: RESUME UPLOAD MODAL ---
function ResumeUploadModal({ currentFileName, onClose, onUpload }) {
  const [fileName, setFileName] = useState(currentFileName || 'Aarav_Sharma_BTech_CS_Resume.pdf');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(fileName);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Upload Student Resume (PDF / DOCX)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Attached to your public peer tutor card & hackathon profiles</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ border: '2px dashed var(--accent-primary)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', backgroundColor: 'rgba(0, 102, 255, 0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={36} style={{ color: 'var(--accent-primary)' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              {fileName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Supports PDF, DOCX (Max file size 15 MB)
            </div>
            <input 
              type="file" 
              accept=".pdf,.docx,.doc" 
              onChange={handleFileChange}
              style={{ marginTop: '0.75rem', fontSize: '0.8125rem' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Save & Attach Resume 📄</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>

        </form>

      </div>
    </div>
  );
}

// --- MODAL COMPONENT 8: 1-CLICK ATS RESUME PREVIEW & PRINT ---
function ResumePreviewModal({ profile, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const educations = profile?.educations || [];
  const certifications = profile?.certifications || [];
  const achievements = profile?.achievements || [];
  const projects = profile?.projects || [];
  const socialLinks = profile?.socialLinks || {};

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '820px', padding: '2.5rem', borderRadius: 'var(--radius-xl)', backgroundColor: '#ffffff', color: '#0f172a', maxHeight: '92vh', overflowY: 'auto' }}>
        
        {/* RESUME TOOLBAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 800 }}>
              ATS 100% COMPLIANT
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Standard 1-Page Student Placement Resume</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-accent" style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#0066FF' }}>
              <Download size={14} /> Print / Save as PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: '#0f172a', borderColor: '#cbd5e1' }}>
              Close
            </button>
          </div>
        </div>

        {/* PRINTABLE RESUME BODY */}
        <div id="printable-resume" style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.5, color: '#0f172a' }}>
          
          {/* HEADER */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0066FF', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#0f172a' }}>
              {profile.fullName || 'Aarav Sharma'}
            </h1>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0066FF', marginBottom: '0.25rem' }}>
              {profile.headline || 'B.Tech Computer Science & Engineering • Java & DSA Peer Mentor'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📍 {profile.location || 'Chennai, India'}</span>
              <span>🎓 {profile.college || 'IIT Madras'}</span>
              {socialLinks.github && <span>🐙 {socialLinks.github.replace('https://', '')}</span>}
              {socialLinks.linkedin && <span>💼 {socialLinks.linkedin.replace('https://', '')}</span>}
            </div>
          </div>

          {/* SECTION: EDUCATION */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {educations.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <div>
                    <strong>{edu.school}</strong> — <em>{edu.degree}, {edu.field}</em>
                    {edu.activities && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{edu.activities}</div>}
                  </div>
                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <strong>{edu.grade}</strong> | {edu.startYear} – {edu.endYear}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: CERTIFICATIONS */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Licenses & Verified Certifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {certifications.map(cert => (
                <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <div>
                    <strong>{cert.name}</strong> — {cert.issuer} (Credential ID: <code>{cert.credentialId}</code>)
                  </div>
                  <div style={{ color: '#64748b' }}>{cert.issueDate}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: ACHIEVEMENTS & HACKATHONS */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Honors & Hackathon Achievements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {achievements.map(ach => (
                <div key={ach.id} style={{ fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>🏆 {ach.title}</strong> — <em>{ach.issuer}</em>
                    <span style={{ color: '#64748b' }}>{ach.date}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.125rem' }}>{ach.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: TECHNICAL PROJECTS */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Technical Projects
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{proj.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#0066FF', fontWeight: 600 }}>[{proj.stack.join(', ')}]</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.125rem' }}>{proj.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: SKILLS */}
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Technical Skills & Mentoring
            </h3>
            <div style={{ fontSize: '0.8125rem', color: '#334155' }}>
              <div><strong>Core Languages & Frameworks:</strong> {(profile.skills || []).join(', ')}</div>
              <div style={{ marginTop: '0.25rem' }}><strong>Peer Mentoring Expertises:</strong> {(profile.teachingSkills || []).join(', ')}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- SCREEN 3: IN-APP COMPLETE ADMIN CONSOLE (LINKEDIN & UNSTOP ORGANIZER SUITE) ---
function AdminConsoleScreen({ onBackToStudent }) {
  const { adminToken, logout } = useAuth();
  const [adminActiveTab, setAdminActiveTab] = useState('doubts'); // default to doubts for instant problem solving

  return (
    <div className="admin-container">
      {/* ADMIN SIDEBAR */}
      <nav className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
            <Building2 size={20} />
          </div>
          <div>
            <span className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin & Organizer</span>
            <div style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Super Admin Suite</div>
          </div>
        </div>

        {/* SWITCH BACK TO STUDENT VIEW BUTTON (LINKEDIN / UNSTOP STYLE) */}
        <button
          onClick={onBackToStudent}
          className="btn btn-secondary"
          style={{
            marginBottom: '1.5rem',
            padding: '0.625rem 1rem',
            fontSize: '0.8125rem',
            fontWeight: 700,
            justifyContent: 'flex-start',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            borderColor: 'var(--accent-primary)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} /> Back to Student View
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1, overflowY: 'auto' }}>
          <AdminSidebarLink active={adminActiveTab === 'doubts'} icon={<HelpCircle size={16} />} label="Live Problem & Doubt Manager" count="3" onClick={() => setAdminActiveTab('doubts')} />
          <AdminSidebarLink active={adminActiveTab === 'users'} icon={<Users size={16} />} label="Student & Tutor Moderation" onClick={() => setAdminActiveTab('users')} />
          <AdminSidebarLink active={adminActiveTab === 'reels'} icon={<Tv2 size={16} />} label="Reels & Content Moderation" onClick={() => setAdminActiveTab('reels')} />
          <AdminSidebarLink active={adminActiveTab === 'overview'} icon={<BarChart3 size={16} />} label="Platform Analytics & Health" onClick={() => setAdminActiveTab('overview')} />
          <AdminSidebarLink active={adminActiveTab === 'badges'} icon={<Award size={16} />} label="Campus Badge Configurator" onClick={() => setAdminActiveTab('badges')} />
          <AdminSidebarLink active={adminActiveTab === 'coins'} icon={<ShieldAlert size={16} />} label="Coins Ledger & Anti-Spam" onClick={() => setAdminActiveTab('coins')} />
          <AdminSidebarLink active={adminActiveTab === 'audit'} icon={<History size={16} />} label="System Audit Logs" onClick={() => setAdminActiveTab('audit')} />
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
          <button onClick={logout} className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger-color)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}>
            <LogOut size={16} /> Log Out Admin Session
          </button>
        </div>
      </nav>

      {/* ADMIN MAIN CONTENT */}
      <main className="admin-main">
        {adminActiveTab === 'doubts' && <AdminDoubtOversightTab token={adminToken} />}
        {adminActiveTab === 'users' && <AdminUserModerationTab token={adminToken} />}
        {adminActiveTab === 'reels' && <AdminReelsModerationTab token={adminToken} />}
        {adminActiveTab === 'overview' && <AdminOverviewTab token={adminToken} />}
        {adminActiveTab === 'badges' && <AdminBadgeConfiguratorTab token={adminToken} />}
        {adminActiveTab === 'coins' && <AdminCoinsLedgerTab token={adminToken} />}
        {adminActiveTab === 'audit' && <AdminAuditLogsTab token={adminToken} />}
      </main>
    </div>
  );
}

function AdminSidebarLink({ active, icon, label, count, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.625rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.8125rem',
        fontWeight: active ? '700' : '600',
        background: active ? 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)' : 'transparent',
        color: active ? '#ffffff' : 'var(--text-secondary)',
        textAlign: 'left',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', color: active ? '#ffffff' : 'var(--text-muted)' }}>
          {icon}
        </span>
        {label}
      </div>
      {count && (
        <span style={{ 
          backgroundColor: active ? 'rgba(255,255,255,0.3)' : 'var(--accent-light)', 
          color: active ? '#ffffff' : 'var(--accent-primary)', 
          fontSize: '0.6875rem', 
          fontWeight: 800, 
          padding: '0.125rem 0.4rem', 
          borderRadius: 'var(--radius-full)' 
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

// --- ADMIN TAB 1: REAL-TIME LIVE PROBLEM & DOUBT MANAGER ---
function AdminDoubtOversightTab({ token }) {
  const [rooms, setRooms] = useState([
    { id: 'room-101', title: 'Java Multithreading Synchronized Locks issue in Producer-Consumer', subject: 'Java', college: 'IIT Madras', creator: 'Aarav Sharma', helper: 'Bhavna Patel', status: 'SOLVED', createdAt: '10m ago' },
    { id: 'room-102', title: 'React useEffect Infinite Re-render Cycle with Object Dependencies', subject: 'React', college: 'IIT Madras', creator: 'Chaitanya Reddy', helper: 'Aarav Sharma', status: 'SOLVED', createdAt: '25m ago' },
    { id: 'room-103', title: '0/1 Knapsack Dynamic Programming Memoization Table Walkthrough', subject: 'Algorithms', college: 'BITS Pilani', creator: 'Divya Nambiar', helper: 'Waiting for Peer Tutor', status: 'OPEN', createdAt: '2m ago' },
    { id: 'room-104', title: 'Calculus Triple Integrals & Polar Coordinate Volume Transformation', subject: 'Calculus', college: 'NIT Trichy', creator: 'Student Peer', helper: 'Waiting for Peer Tutor', status: 'OPEN', createdAt: 'Just now' }
  ]);

  const [filterSubject, setFilterSubject] = useState('ALL');
  const [filterCollege, setFilterCollege] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [announcementText, setAnnouncementText] = useState('');
  const [activeAnnouncement, setActiveAnnouncement] = useState('⚡ Live Exam Sprint: All verified tutors earn 2x bonus peer coins for solving doubts this week!');

  const handleResolveDoubt = (roomId) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'SOLVED', helper: r.helper.includes('Waiting') ? 'Admin Moderator' : r.helper } : r));
    alert("✅ Doubt marked as SOLVED! Tutor awarded +10 XP and +5 Peer Coins in real-time.");
  };

  const handleDeleteDoubt = (roomId) => {
    if (confirm("Are you sure you want to remove this doubt question from the live platform?")) {
      setRooms(prev => prev.filter(r => r.id !== roomId));
      alert("🗑️ Question removed from live doubt feed.");
    }
  };

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setActiveAnnouncement(announcementText.trim());
    setAnnouncementText('');
    alert("📢 Campus Announcement broadcasted live to all students!");
  };

  const filteredRooms = rooms.filter(r => {
    if (filterSubject !== 'ALL' && r.subject !== filterSubject) return false;
    if (filterCollege !== 'ALL' && r.college !== filterCollege) return false;
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Real-Time Live Problem & Doubt Manager</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Supervise live student doubt rooms, resolve pending queries, and broadcast announcements.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="tag tag-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem' }}>
            <div className="live-dot" style={{ backgroundColor: '#22c55e' }}></div>
            {rooms.filter(r => r.status === 'OPEN').length} Active Live Doubts
          </span>
        </div>
      </div>

      {/* LIVE CAMPUS ANNOUNCEMENT BANNER */}
      {activeAnnouncement && (
        <div style={{ backgroundColor: 'rgba(234, 88, 12, 0.1)', border: '1px solid rgba(234, 88, 12, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Megaphone size={18} style={{ color: '#ea580c' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeAnnouncement}</span>
          </div>
          <button onClick={() => setActiveAnnouncement('')} className="btn-icon" style={{ padding: '0.25rem' }}><X size={16} /></button>
        </div>
      )}

      {/* FILTER CONTROLS BAR */}
      <div className="card-premium" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Filter size={15} /> Filters:
          </div>

          <select className="input" style={{ width: '150px', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="ALL">All Subjects</option>
            <option value="Java">Java</option>
            <option value="React">React</option>
            <option value="Algorithms">Algorithms</option>
            <option value="Calculus">Calculus</option>
          </select>

          <select className="input" style={{ width: '160px', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} value={filterCollege} onChange={e => setFilterCollege(e.target.value)}>
            <option value="ALL">All Universities</option>
            <option value="IIT Madras">IIT Madras</option>
            <option value="BITS Pilani">BITS Pilani</option>
            <option value="NIT Trichy">NIT Trichy</option>
          </select>

          <select className="input" style={{ width: '140px', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Live OPEN</option>
            <option value="SOLVED">SOLVED</option>
          </select>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Showing {filteredRooms.length} of {rooms.length} doubt workspaces
        </div>
      </div>

      {/* DOUBTS REAL-TIME TABLE */}
      <table className="admin-table" style={{ marginBottom: '2.5rem' }}>
        <thead>
          <tr>
            <th>Workspace Topic & ID</th>
            <th>Subject</th>
            <th>University</th>
            <th>Student</th>
            <th>Assigned Helper</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Admin Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map(r => (
            <tr key={r.id}>
              <td>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', maxWidth: '280px' }}>{r.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.id} • {r.createdAt}</div>
              </td>
              <td><span className="tag tag-accent">{r.subject}</span></td>
              <td>{r.college}</td>
              <td><strong>{r.creator}</strong></td>
              <td>{r.helper}</td>
              <td>
                <span className={`tag ${r.status === 'SOLVED' ? 'tag-success' : 'tag-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  {r.status === 'OPEN' && <div className="live-dot" style={{ width: '8px', height: '8px' }}></div>}
                  {r.status}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                  {r.status === 'OPEN' && (
                    <button 
                      onClick={() => handleResolveDoubt(r.id)} 
                      className="btn btn-success" 
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      title="Force Resolve & Credit Tutor"
                    >
                      <CheckCircle size={13} /> Resolve
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteDoubt(r.id)} 
                    className="btn btn-danger" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    title="Remove Question"
                  >
                    <Ban size={13} /> Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EMERGENCY BROADCAST COMPOSER */}
      <div className="card-premium" style={{ maxWidth: '680px' }}>
        <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={18} style={{ color: '#ea580c' }} /> Broadcast Campus Announcement
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Send a priority banner alert across all active student doubt hubs and dashboards.
        </p>
        <form onSubmit={handlePublishAnnouncement} style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="e.g. Midterm Algorithms Study Jam tonight at 8 PM in Room #04..." 
            value={announcementText} 
            onChange={e => setAnnouncementText(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-accent" style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.25rem' }}>
            Broadcast 📢
          </button>
        </form>
      </div>
    </div>
  );
}

// --- ADMIN TAB 2: STUDENT & TUTOR MODERATION ---
function AdminUserModerationTab({ token }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    { id: '11111111-1111-1111-1111-111111111111', fullName: 'Aarav Sharma', email: 'studenta@student.com', college: 'IIT Madras', department: 'Computer Science', xp: 650, coins: 45, reputation: 4.8, isVerifiedTutor: true, role: 'student', status: 'Active' },
    { id: '22222222-2222-2222-2222-222222222222', fullName: 'Bhavna Patel', email: 'studentb@student.com', college: 'IIT Madras', department: 'Computer Science', xp: 820, coins: 60, reputation: 4.9, isVerifiedTutor: true, role: 'student', status: 'Active' },
    { id: '33333333-3333-3333-3333-333333333333', fullName: 'Chaitanya Reddy', email: 'studentc@student.com', college: 'BITS Pilani', department: 'Electrical Engineering', xp: 340, coins: 20, reputation: 4.6, isVerifiedTutor: false, role: 'student', status: 'Active' },
    { id: '44444444-4444-4444-4444-444444444444', fullName: 'Divya Nambiar', email: 'studentd@student.com', college: 'NIT Trichy', department: 'Data Science', xp: 480, coins: 35, reputation: 4.7, isVerifiedTutor: false, role: 'student', status: 'Active' }
  ]);

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const handleToggleTutor = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerifiedTutor: !u.isVerifiedTutor } : u));
    alert("⭐ Verified Campus Tutor status updated!");
  };

  const handleGiftBonus = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, xp: u.xp + 50, coins: u.coins + 10 } : u));
    alert("🪙 Gifted +50 XP and +10 Peer Coins to student!");
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Student & Tutor Moderation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Verify campus tutor badges, manage roles, adjust ratings, and grant reward bonuses.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '0.375rem 1rem', width: '280px' }}>
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search students, emails..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8125rem', width: '100%', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Student / Email</th>
            <th>University & Dept</th>
            <th>XP & Balance</th>
            <th>Tutor Badge</th>
            <th>Rating</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Moderation Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
              </td>
              <td>
                <div>{u.college}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.department}</div>
              </td>
              <td>
                <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>⚡ {u.xp} XP</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🪙 {u.coins} Coins</div>
              </td>
              <td>
                <button 
                  onClick={() => handleToggleTutor(u.id)}
                  style={{
                    border: 'none',
                    background: u.isVerifiedTutor ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                    color: u.isVerifiedTutor ? 'var(--success-color)' : 'var(--text-muted)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <CheckCircle2 size={13} /> {u.isVerifiedTutor ? 'Verified Tutor' : 'Standard Peer'}
                </button>
              </td>
              <td>⭐ {u.reputation} / 5.0</td>
              <td>
                <span className={`tag ${u.status === 'Active' ? 'tag-success' : 'tag-danger'}`}>
                  {u.status}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleGiftBonus(u.id)} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--warning-color)' }}
                    title="Gift +50 XP & +10 Coins"
                  >
                    🪙 +Bonus
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(u.id)} 
                    className={`btn ${u.status === 'Active' ? 'btn-danger' : 'btn-success'}`}
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <Ban size={12} /> {u.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- ADMIN TAB 3: REELS & MEDIA CONTENT MODERATION ---
function AdminReelsModerationTab({ token }) {
  const [reels, setReels] = useState([
    { id: 'reel-1', title: '3 Tricks to solve Recursion fast ⚡ #Java #Algorithms', author: 'Aarav Sharma', college: 'IIT Madras', views: '1.4k', likes: 154, isFeatured: true },
    { id: 'reel-2', title: 'How Spring Boot Inversion of Control works in 60s ☕ #SpringBoot', author: 'Bhavna Patel', college: 'IIT Madras', views: '2.1k', likes: 218, isFeatured: false },
    { id: 'reel-3', title: 'Calculus Gradient Descent Visualized with 3D Contours 📐', author: 'Chaitanya Reddy', college: 'BITS Pilani', views: '890', likes: 94, isFeatured: false }
  ]);

  const handleToggleFeature = (id) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r));
    alert("📌 Reel featured status updated for campus feed!");
  };

  const handleDeleteReel = (id) => {
    if (confirm("Delete this educational reel from the community library?")) {
      setReels(prev => prev.filter(r => r.id !== id));
      alert("🗑️ Reel deleted.");
    }
  };

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Educational Reels & Content Moderation</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Review student-created concept shorts, pin featured lectures, and filter inappropriate media.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Reel Title & Concept</th>
            <th>Creator & Campus</th>
            <th>Engagement</th>
            <th>Featured Status</th>
            <th style={{ textAlign: 'right' }}>Moderation Action</th>
          </tr>
        </thead>
        <tbody>
          {reels.map(r => (
            <tr key={r.id}>
              <td>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {r.id}</div>
              </td>
              <td>
                <div>{r.author}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.college}</div>
              </td>
              <td>👁️ {r.views} • ❤️ {r.likes}</td>
              <td>
                <span className={`tag ${r.isFeatured ? 'tag-accent' : ''}`}>
                  {r.isFeatured ? '⭐ Campus Featured' : 'Standard'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleToggleFeature(r.id)} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    {r.isFeatured ? 'Unpin' : '📌 Feature'}
                  </button>
                  <button 
                    onClick={() => handleDeleteReel(r.id)} 
                    className="btn btn-danger" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <Ban size={12} /> Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- ADMIN TAB 4: PLATFORM ANALYTICS & HEALTH ---
function AdminOverviewTab({ token }) {
  const [xpPerSolved, setXpPerSolved] = useState(10);
  const [commissionPercent, setCommissionPercent] = useState(5);
  const [examBoostActive, setExamBoostActive] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);

  const stats = {
    totalUsers: 14250,
    totalDoubts: 8940,
    solvedDoubts: 8798,
    liveDoubts: 48
  };

  const saveSettings = (e) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Platform Analytics & Control Center</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: '10px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalUsers.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Registered Students</div>
          </div>
        </div>

        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-purple)', borderRadius: '10px' }}>
            <HelpCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalDoubts.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Doubts Raised</div>
          </div>
        </div>

        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '10px' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.solvedDoubts.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Resolved Workspaces (98.4%)</div>
          </div>
        </div>

        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '10px' }}>
            <div className="live-dot" style={{ width: '12px', height: '12px' }}></div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.liveDoubts}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active LIVE Rooms</div>
          </div>
        </div>
      </div>

      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gamification & Economy Parameters</h2>
      <form onSubmit={saveSettings} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '640px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label className="label">XP Awarded per Doubt Solved</label>
            <input type="number" className="input" value={xpPerSolved} onChange={e => setXpPerSolved(e.target.value)} />
          </div>
          <div>
            <label className="label">Peer Mentor Coins Commission (%)</label>
            <input type="number" className="input" value={commissionPercent} onChange={e => setCommissionPercent(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>🔥 2x Exam Week Multiplier</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Doubles all student tutor XP gains for active campus exam weeks</div>
          </div>
          <input type="checkbox" checked={examBoostActive} onChange={e => setExamBoostActive(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary">Save Platform Settings</button>
          {savedSettings && <span style={{ color: 'var(--success-color)', fontSize: '0.8125rem', fontWeight: 700 }}>✓ Settings updated successfully!</span>}
        </div>
      </form>
    </div>
  );
}

// --- ADMIN TAB 5: BADGE CONFIGURATOR ---
function AdminBadgeConfiguratorTab({ token }) {
  const [badges, setBadges] = useState([
    { id: 'b-1', name: 'Top Mentor', desc: '10+ Doubts Resolved with 5-star rating', criteria: 'DOUBTS_SOLVED', val: 10 },
    { id: 'b-2', name: 'Streak Master', desc: 'Maintained 7-day study streak', criteria: 'STREAK_DAYS', val: 7 },
    { id: 'b-3', name: 'Code Wizard', desc: 'Solved 25+ Algorithm problems', criteria: 'XP_EARNED', val: 500 }
  ]);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [criteria, setCriteria] = useState('DOUBTS_SOLVED');
  const [val, setVal] = useState(5);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !desc) return;
    setBadges(prev => [...prev, { id: `b-${Date.now()}`, name, desc, criteria, val: parseInt(val) }]);
    setName('');
    setDesc('');
    alert("New Campus Badge rule created!");
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
      <div>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Badge Configurator</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>Define dynamic campus badge rules and unlock conditions.</p>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Badge Name</th>
              <th>Achievement Text</th>
              <th>Criteria Type</th>
              <th>Required Threshold</th>
            </tr>
          </thead>
          <tbody>
            {badges.map(b => (
              <tr key={b.id}>
                <td><strong>{b.name}</strong></td>
                <td>{b.desc}</td>
                <td><code>{b.criteria}</code></td>
                <td>⚡ {b.val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-premium" style={{ height: 'fit-content' }}>
        <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Create New Badge Rule
        </h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Badge Name</label>
            <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Achievement Description</label>
            <textarea className="input" style={{ minHeight: '60px' }} value={desc} onChange={e => setDesc(e.target.value)} required />
          </div>
          <div>
            <label className="label">Criteria Metric</label>
            <select className="input" value={criteria} onChange={e => setCriteria(e.target.value)}>
              <option value="DOUBTS_SOLVED">Doubts Solved</option>
              <option value="STREAK_DAYS">Streak Days</option>
              <option value="XP_EARNED">Experience Points</option>
            </select>
          </div>
          <div>
            <label className="label">Threshold Value</label>
            <input type="number" className="input" value={val} onChange={e => setVal(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Create Badge Rule</button>
        </form>
      </div>
    </div>
  );
}

// --- ADMIN TAB 6: COINS LEDGER ---
function AdminCoinsLedgerTab({ token }) {
  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Coins Ledger & Endorsements</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>Audit peer coin distribution, reward parameters, and anti-collusion safety constraints.</p>

      <div className="grid-2">
        <div className="card-premium">
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Reward Token Allocations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span>Doubt Room Solved Reward:</span>
              <strong>+5 Coins + 10 XP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span>Peer Skill Endorsement:</span>
              <strong>+5 Coins + 10 XP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span>Daily Streak Login Claim:</span>
              <strong>+1 Coin + 2 XP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Skill Swap Completed:</span>
              <strong>+15 XP to both students</strong>
            </div>
          </div>
        </div>

        <div className="card-premium">
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Anti-Spam Collusion Rules</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The platform automatically enforces unique constraint rules per `(endorser_id, recipient_id, skill)` pair. 
            Self-endorsements are prohibited by PostgreSQL check constraints (`endorser_id &lt;&gt; recipient_id`).
          </p>
        </div>
      </div>
    </div>
  );
}

// --- ADMIN TAB 7: AUDIT LOGS ---
function AdminAuditLogsTab({ token }) {
  const logs = [
    { id: 'log-1', time: 'Aug 28, 2026 23:05', admin: 'super_admin', action: 'DOUBT_FORCE_RESOLVE', desc: 'Resolved Producer-Consumer lock issue and awarded +10 XP to Bhavna Patel' },
    { id: 'log-2', time: 'Aug 28, 2026 22:45', admin: 'super_admin', action: 'SETTINGS_UPDATE', desc: 'Enabled 2x Exam Sprint Multiplier for campus' },
    { id: 'log-3', time: 'Aug 28, 2026 21:10', admin: 'super_admin', action: 'USER_VERIFY', desc: 'Verified tutor credentials for Bhavna Patel (IIT Madras)' },
    { id: 'log-4', time: 'Aug 28, 2026 19:30', admin: 'system', action: 'AUTO_BADGE_AWARD', desc: 'Awarded Top Mentor badge to Aarav Sharma' }
  ];

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>System Audit Logs</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>Immutable logs tracking administrator actions, security triggers, and configuration changes.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Admin ID</th>
            <th>Action Code</th>
            <th>Detailed Description</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.time}</td>
              <td><code>{l.admin}</code></td>
              <td><span className="tag tag-accent">{l.action}</span></td>
              <td>{l.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- SCREEN 4: SECURE /admin ACCESS GATE (RESTRICTED TO ADMINS) ---
function AdminGateScreen({ loginAdmin, onBackToHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.toLowerCase() === 'admin@studyloop.app' && password === 'password123') {
      loginAdmin(email);
    } else {
      setErrorMsg('Invalid administrative credentials. Access restricted to authorized campus operators.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '1.5rem', color: '#f8fafc' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '2.5rem 2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.4)' }}>
            <Shield size={30} color="#ffffff" />
          </div>
        </div>

        <h2 className="font-serif" style={{ textAlign: 'center', fontSize: '1.625rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.375rem' }}>
          StudyLoop Admin Portal
        </h2>
        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
          Restricted access for campus safety officers & platform operators.
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.8125rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Identifier
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="email" 
                value={email} 
                onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
                placeholder="admin@studyloop.app" 
                required 
                style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Master Security Key
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="••••••••••••" 
                required 
                style={{ width: '100%', padding: '0.625rem 2.5rem 0.625rem 2.5rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem', outline: 'none' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)', color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}
          >
            Authenticate & Open Console 🛡️
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.375rem' }}>Demo Admin Access</div>
          <button 
            type="button" 
            onClick={() => {
              loginAdmin('admin@studyloop.app');
            }}
            style={{ background: 'transparent', border: 'none', color: '#f97316', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            ⚡ 1-Click Authorize (admin@studyloop.app)
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            type="button" 
            onClick={onBackToHome}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8125rem', cursor: 'pointer' }}
          >
            ← Return to Student Campus Network
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SUPPORTING MODALS & SCREENS ---
function AvatarChangeModal({ currentAvatarUrl, onSave, onClose }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarUrl);
  const [customUrl, setCustomUrl] = useState('');

  const avatarPresets = [
    MALE_AVATAR_SVG,
    FEMALE_AVATAR_SVG,
    NEUTRAL_AVATAR_SVG,
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Select Avatar / Profile Picture</h3>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {avatarPresets.map((av, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedAvatar(av)}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                padding: '3px',
                border: selectedAvatar === av ? '3px solid var(--accent-primary)' : '2px solid var(--border-color)',
                cursor: 'pointer',
                margin: '0 auto'
              }}
            >
              <img src={av} alt="Preset" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label">Or Custom Image URL</label>
          <input 
            type="text" 
            className="input" 
            placeholder="https://example.com/photo.jpg" 
            value={customUrl} 
            onChange={e => { setCustomUrl(e.target.value); setSelectedAvatar(e.target.value); }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onSave(selectedAvatar)} className="btn btn-accent" style={{ flex: 1 }}>
            Save Avatar
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoPreviewModal({ imageUrl, userName, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 13, 22, 0.9)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} onClick={onClose}>
      <div style={{ position: 'relative', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged" style={{ maxWidth: '320px', maxHeight: '320px', borderRadius: '50%', border: '4px solid var(--accent-primary)', objectFit: 'cover', boxShadow: 'var(--shadow-glow)' }} />
        <h3 className="font-serif" style={{ color: '#ffffff', marginTop: '1rem', fontSize: '1.25rem' }}>{userName}</h3>
        <button onClick={onClose} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Close</button>
      </div>
    </div>
  );
}

function UserListModal({ title, userId, token, onClose, onSelectUser }) {
  const sampleUsers = [
    { id: '22222222-2222-2222-2222-222222222222', fullName: 'Bhavna Patel', college: 'IIT Madras', department: 'Computer Science', avatarUrl: FEMALE_AVATAR_SVG },
    { id: '33333333-3333-3333-3333-333333333333', fullName: 'Chaitanya Reddy', college: 'BITS Pilani', department: 'Electrical Engineering', avatarUrl: MALE_AVATAR_SVG }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '420px', padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>{title}</h3>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sampleUsers.map(u => (
            <div 
              key={u.id}
              onClick={() => onSelectUser(u)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: 'var(--bg-tertiary)' }}
            >
              <img src={u.avatarUrl} alt="User" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{u.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.college} • {u.department}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicProfileModal({ user, currentUserId, token, onClose, onStartChat, onOpenUserList }) {
  if (!user) return null;

  const [activeProfileTab, setActiveProfileTab] = useState('overview'); // 'overview', 'certifications', 'education', 'projects', 'achievements'
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followersCount !== undefined ? user.followersCount : 124);
  const [copyToast, setCopyToast] = useState(false);

  const toggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#profile-${user.id || 'peer'}`);
    }
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  const educations = user.educations || [
    {
      id: 'edu-p1',
      school: user.college || 'Indian Institute of Technology (IIT) Madras',
      degree: 'Bachelor of Technology - B.Tech',
      field: user.department || 'Computer Science & Engineering',
      startYear: '2023',
      endYear: '2027',
      grade: '8.8 / 10.0 CGPA',
      activities: 'Peer Code & Academic Study Club'
    }
  ];

  const certifications = user.certifications || [
    {
      id: 'cert-p1',
      name: 'Oracle Certified Associate, Java SE 8 Programmer',
      issuer: 'Oracle',
      issueDate: '2025',
      credentialId: 'OCA-JAVA-VERIFIED',
      credentialUrl: 'https://catalog-education.oracle.com',
      badgeIcon: '☕'
    },
    {
      id: 'cert-p2',
      name: 'NPTEL: Programming, Data Structures And Algorithms',
      issuer: 'NPTEL & IIT Madras',
      issueDate: '2025',
      credentialId: 'NPTEL25CS89',
      credentialUrl: 'https://nptel.ac.in',
      badgeIcon: '🐍'
    }
  ];

  const achievements = user.achievements || [
    {
      id: 'ach-p1',
      title: 'Smart India Hackathon Finalist',
      issuer: 'Ministry of Education',
      date: '2025',
      desc: 'Selected in Top 10 national teams for peer education routing algorithm.'
    },
    {
      id: 'ach-p2',
      title: 'LeetCode Knight (Top 3% Globally)',
      issuer: 'LeetCode',
      date: '2026',
      desc: 'Solved 400+ algorithmic challenges with dynamic programming mastery.'
    }
  ];

  const projects = user.projects || [
    {
      id: 'proj-p1',
      title: 'PeerCode - WebRTC Real-Time Collaborative Workspace',
      stack: ['React', 'WebRTC', 'Node.js', 'Socket.io', 'Java'],
      desc: 'Low-latency collaborative coding and live doubt-solving workspace with synchronized editor and audio/video.',
      githubUrl: 'https://github.com',
      liveUrl: 'https://studyloop.app'
    }
  ];

  const socialLinks = user.socialLinks || {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    leetcode: 'https://leetcode.com',
    portfolio: 'https://studyloop.app'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div 
        className="card-premium" 
        style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: 0, borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* TOAST COPY NOTIFICATION */}
        {copyToast && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4000,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={15} /> Profile link copied to clipboard!
          </div>
        )}

        {/* COVER PHOTO BANNER */}
        <div style={{ height: '140px', width: '100%', background: 'linear-gradient(135deg, #0066FF 0%, #00C6FF 50%, #4F46E5 100%)', position: 'relative' }}>
          <button 
            onClick={onClose}
            className="btn-icon" 
            style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
          <span style={{ position: 'absolute', bottom: '0.75rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
            🏫 {user.college || 'IIT Madras'}
          </span>
        </div>

        {/* PROFILE HEADER & AVATAR */}
        <div style={{ padding: '0 1.75rem 1.75rem 1.75rem', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginTop: '-48px', marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={getDefaultAvatarByGender(user.gender, user.avatarUrl)} 
                alt="Profile" 
                style={{ width: '96px', height: '96px', borderRadius: '50%', border: '4px solid var(--bg-card)', objectFit: 'cover', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--bg-card)' }} 
              />
              <span style={{ position: 'absolute', bottom: '4px', right: '4px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--bg-card)' }} title="Online on StudyLoop"></span>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={toggleFollow} 
                className={`btn ${isFollowing ? 'btn-secondary' : 'btn-accent'}`} 
                style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem', fontWeight: 700 }}
              >
                {isFollowing ? <Check size={14} /> : <UserPlus size={14} />}
                {isFollowing ? 'Following' : 'Connect / Follow'}
              </button>

              <button 
                onClick={() => { onClose(); onStartChat(user); }} 
                className="btn btn-primary" 
                style={{ fontSize: '0.8125rem', padding: '0.45rem 1rem', fontWeight: 700 }}
              >
                <MessageSquare size={14} /> Send Message
              </button>

              <button 
                onClick={handleCopyLink} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }} 
                title="Share Profile"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>

          {/* NAME, HEADLINE & METADATA */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {user.fullName || 'Student Learner'}
              </h2>
              <span className="tag tag-accent" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                ✓ Verified Student
              </span>
              <span className="tag tag-success" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                ⚡ {user.xp || 650} XP • Lvl {user.level || 4}
              </span>
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {user.headline || `${user.department || 'Computer Science'} Student @ ${user.college || 'IIT Madras'}`}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', flexWrap: 'wrap' }}>
              <span>🎓 {user.college || 'IIT Madras'} (Year {user.year || 2})</span>
              <span>📍 {user.location || 'India'}</span>
              <span>⭐ {user.conceptClarityRating || 4.9} Mentor Rating ({user.classesTaught || 18} Classes Taught)</span>
            </div>

            {/* COUNTERS */}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-primary)', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div><strong>{followersCount}</strong> <span style={{ color: 'var(--text-secondary)' }}>followers</span></div>
              <div><strong>{user.followingCount !== undefined ? user.followingCount : 85}</strong> <span style={{ color: 'var(--text-secondary)' }}>following</span></div>
              <div><strong>₹{user.hourlyRate || user.customSessionRate || 450}</strong> <span style={{ color: 'var(--text-secondary)' }}>/ 30m peer class</span></div>
            </div>

            {/* SOCIAL LINKS */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.625rem' }}>
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="tag tag-secondary" style={{ textDecoration: 'none', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <Github size={12} /> GitHub ↗
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="tag tag-accent" style={{ textDecoration: 'none', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <Briefcase size={12} /> LinkedIn ↗
                </a>
              )}
              {socialLinks.leetcode && (
                <a href={socialLinks.leetcode} target="_blank" rel="noreferrer" className="tag tag-warning" style={{ textDecoration: 'none', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <Code size={12} /> LeetCode ↗
                </a>
              )}
              {socialLinks.portfolio && (
                <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" className="tag tag-success" style={{ textDecoration: 'none', fontSize: '0.6875rem', fontWeight: 700 }}>
                  <Globe size={12} /> Portfolio ↗
                </a>
              )}
            </div>
          </div>

          {/* TAB STRIP */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            <button 
              onClick={() => setActiveProfileTab('overview')}
              style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer', color: activeProfileTab === 'overview' ? 'var(--accent-primary)' : 'var(--text-secondary)', borderBottom: activeProfileTab === 'overview' ? '2px solid var(--accent-primary)' : '2px solid transparent' }}
            >
              📋 Overview & Bio
            </button>
            <button 
              onClick={() => setActiveProfileTab('certifications')}
              style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer', color: activeProfileTab === 'certifications' ? 'var(--accent-primary)' : 'var(--text-secondary)', borderBottom: activeProfileTab === 'certifications' ? '2px solid var(--accent-primary)' : '2px solid transparent' }}
            >
              📜 Verified Certs ({certifications.length})
            </button>
            <button 
              onClick={() => setActiveProfileTab('education')}
              style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer', color: activeProfileTab === 'education' ? 'var(--accent-primary)' : 'var(--text-secondary)', borderBottom: activeProfileTab === 'education' ? '2px solid var(--accent-primary)' : '2px solid transparent' }}
            >
              🎓 Education ({educations.length})
            </button>
            <button 
              onClick={() => setActiveProfileTab('projects')}
              style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer', color: activeProfileTab === 'projects' ? 'var(--accent-primary)' : 'var(--text-secondary)', borderBottom: activeProfileTab === 'projects' ? '2px solid var(--accent-primary)' : '2px solid transparent' }}
            >
              💼 Projects ({projects.length})
            </button>
            <button 
              onClick={() => setActiveProfileTab('achievements')}
              style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer', color: activeProfileTab === 'achievements' ? 'var(--accent-primary)' : 'var(--text-secondary)', borderBottom: activeProfileTab === 'achievements' ? '2px solid var(--accent-primary)' : '2px solid transparent' }}
            >
              🏆 Honors ({achievements.length})
            </button>
          </div>

          {/* TAB CONTENTS */}
          {activeProfileTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>About</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {user.bio || '🎓 Student mentor active on StudyLoop peer network.'}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Teaching & Mentoring Topics</div>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {(user.teachingSkills || user.skills || ['Java', 'Algorithms', 'React']).map((s, i) => (
                    <span key={i} className="tag tag-accent" style={{ fontSize: '0.75rem' }}>{s}</span>
                  ))}
                </div>
              </div>

              {user.learningGoals && user.learningGoals.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Currently Learning</div>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {user.learningGoals.map((g, i) => (
                      <span key={i} className="tag tag-secondary" style={{ fontSize: '0.75rem' }}>🎯 {g}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeProfileTab === 'certifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {certifications.map(c => (
                <div key={c.id} style={{ padding: '0.875rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                      {c.badgeIcon || '📜'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.issuer} • Issued {c.issueDate}</div>
                      {c.credentialId && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>ID: {c.credentialId}</div>
                      )}
                    </div>
                  </div>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', textDecoration: 'none' }}>
                      Verify ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeProfileTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {educations.map(edu => (
                <div key={edu.id} style={{ padding: '0.875rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{edu.school}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{edu.degree} • {edu.field}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '0.2rem' }}>
                    {edu.startYear} – {edu.endYear} • Grade: {edu.grade}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeProfileTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ padding: '0.875rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{proj.title}</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0.5rem 0', lineHeight: 1.5 }}>
                    {proj.desc}
                  </p>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {(proj.stack || []).map((tech, idx) => (
                      <span key={idx} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>{tech}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.625rem', textDecoration: 'none' }}>
                        <Github size={12} /> Source Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: '0.6875rem', padding: '0.25rem 0.625rem', textDecoration: 'none' }}>
                        <ExternalLink size={12} /> Live App ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeProfileTab === 'achievements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {achievements.map(ach => (
                <div key={ach.id} style={{ padding: '0.875rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{ach.title}</div>
                    <span className="tag tag-warning" style={{ fontSize: '0.6875rem' }}>{ach.date}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Issued by: {ach.issuer}</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0', lineHeight: 1.5 }}>
                    {ach.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

function RtcCallOverlay({ localVideoRef, remoteVideoRef, isScreenSharing, toggleScreenShare, hangUpCall, webrtcCall, localStream, remoteStream }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 13, 22, 0.95)', zIndex: 5000, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="live-dot"></div>
          <h3 className="font-serif" style={{ margin: 0, fontSize: '1.25rem' }}>Live WebRTC Code Study Call</h3>
        </div>
        <span className="tag tag-accent">HD Zero-Latency P2P</span>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 0, marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
            You (Local Feed)
          </div>
        </div>

        <div style={{ position: 'relative', backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
            Peer Tutor (Remote)
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
        <button onClick={toggleScreenShare} className={`btn ${isScreenSharing ? 'btn-accent' : 'btn-secondary'}`} style={{ padding: '0.75rem 1.5rem' }}>
          <ScreenShare size={18} /> {isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
        </button>
        <button onClick={hangUpCall} className="btn btn-danger" style={{ padding: '0.75rem 2rem', fontWeight: 700 }}>
          Hang Up Call
        </button>
      </div>
    </div>
  );
}

// --- SCREENS: DOUBT ROOMS, CHAT, DISCOVER, CONNECTIONS, LEADERBOARD, SETTINGS, REELS, CONTACT ---
function DoubtRoomsScreen({ token, activeRoomId, setActiveRoomId, socket, wsMessages, setWsMessages, startWebRtcCall, webrtcCall }) {
  const [rooms, setRooms] = useState([
    { id: 'room-1', title: 'Java Multithreading Synchronized Locks issue in Producer-Consumer', subject: 'Java', college: 'IIT Madras', participants: 3, creator: 'Aarav Sharma' },
    { id: 'room-2', title: 'React useEffect Infinite re-render cycle with state objects', subject: 'React', college: 'IIT Madras', participants: 5, creator: 'Bhavna Patel' },
    { id: 'room-3', title: 'Dynamic Programming 0/1 Knapsack memoization table walkthrough', subject: 'Algorithms', college: 'BITS Pilani', participants: 2, creator: 'Chaitanya Reddy' }
  ]);

  const [newTopic, setNewTopic] = useState('');
  const [newSubject, setNewSubject] = useState('Java');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    const newR = {
      id: `room-${Date.now()}`,
      title: newTopic.trim(),
      subject: newSubject,
      college: 'IIT Madras',
      participants: 1,
      creator: 'You'
    };
    setRooms(prev => [newR, ...prev]);
    setActiveRoomId(newR.id);
    setNewTopic('');
  };

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Live Academic Doubt Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Join real-time peer doubt rooms or launch your own video study session.</p>
        </div>
        <button onClick={() => startWebRtcCall('peer-1', activeRoomId)} className="btn btn-accent">
          <Video size={16} /> Start 1-Click Video Call
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rooms.map(r => (
            <div key={r.id} className="card-premium interactive-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <span className="tag tag-accent">{r.subject}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.college}</span>
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{r.title}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Host: {r.creator} • 👥 {r.participants} active peers</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setActiveRoomId(r.id)} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}>
                  Enter Room →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card-premium" style={{ height: 'fit-content' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Open Live Doubt Room
          </h3>
          <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Topic / Question</label>
              <textarea className="input" style={{ minHeight: '80px' }} placeholder="What academic concept are you stuck on?" value={newTopic} onChange={e => setNewTopic(e.target.value)} required />
            </div>
            <div>
              <label className="label">Subject Tag</label>
              <select className="input" value={newSubject} onChange={e => setNewSubject(e.target.value)}>
                <option value="Java">Java</option>
                <option value="React">React</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Calculus">Calculus</option>
                <option value="AI / ML">AI / ML</option>
              </select>
            </div>
            <button type="submit" className="btn btn-accent" style={{ width: '100%' }}>Launch Live Room 🚀</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ token, activeChatId, setActiveChatId, chatPeer, setChatPeer, socket, wsMessages, setWsMessages, setActiveTab }) {
  const [messages, setMessages] = useState([
    { sender: 'Bhavna Patel', text: 'Hey Aarav! Did you get a chance to check that OS memory paging question?' },
    { sender: 'Aarav Sharma', text: 'Yes! Virtual to physical address translation table is ready. Want to jump on a quick call?' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { sender: 'You', text: inputText.trim() }]);
    setInputText('');
  };

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div className="card-premium" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={chatPeer?.avatarUrl || FEMALE_AVATAR_SVG} alt="Peer" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{chatPeer?.fullName || 'Bhavna Patel'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success-color)' }}>● Online • IIT Madras CSE</div>
            </div>
          </div>
          <button onClick={() => setActiveTab('doubts')} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
            <Video size={14} /> Video Call
          </button>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.sender === 'You' || m.sender === 'Aarav Sharma' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: m.sender === 'You' || m.sender === 'Aarav Sharma' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: m.sender === 'You' || m.sender === 'Aarav Sharma' ? '#ffffff' : 'var(--text-primary)',
                fontSize: '0.875rem'
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', backgroundColor: 'var(--bg-secondary)' }}>
          <input type="text" className="input" placeholder="Type a message..." value={inputText} onChange={e => setInputText(e.target.value)} />
          <button type="submit" className="btn btn-accent"><Send size={16} /></button>
        </form>

      </div>
    </div>
  );
}

// --- MODULE 1 & 2: GRANULAR TOPIC DISCOVERY & TUTOR MATCHMAKER ---
function DiscoverScreen({ token, setActiveTab, setActiveChatId, setChatPeer, onOpenPublicProfile, onOpenBookingModal }) {
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

// --- BOOKING & ESCROW PAYMENT MODAL ---
function BookingModal({ tutor, onClose, onConfirmBooking }) {
  const [selectedTopic, setSelectedTopic] = useState(tutor?.topicsMastered[0] || 'Core Subject Walkthrough');
  const [duration, setDuration] = useState('30'); // 15, 30, 60
  const [doubtNotes, setDoubtNotes] = useState('');

  if (!tutor) return null;

  const baseRate = tutor.ratePerSession || 0;
  const multiplier = duration === '15' ? 0.6 : duration === '60' ? 1.8 : 1.0;
  const calculatedFee = Math.round(baseRate * multiplier);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newSession = {
      id: `session-${Date.now()}`,
      tutorName: tutor.fullName,
      tutorAvatar: tutor.avatarUrl,
      tutorCollege: tutor.college,
      topic: selectedTopic,
      doubtNotes: doubtNotes || 'Peer walkthrough on fundamental concepts.',
      duration: `${duration} Mins`,
      fee: calculatedFee,
      status: 'confirmed',
      time: 'Today • 10 mins from now',
      rated: false
    };
    onConfirmBooking(newSession);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: 0 }}>Book 1:1 Peer Study Session</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Learn directly from verified campus peer tutor</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {/* Tutor Mini Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <img src={tutor.avatarUrl} alt={tutor.fullName} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{tutor.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tutor.college} • {tutor.subject} Specialist</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-color)', fontWeight: 700, marginTop: '0.125rem' }}>⭐ {tutor.rating} ({tutor.classesTaught} Classes Taught)</div>
          </div>
        </div>

        <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Select Specific Topic */}
          <div>
            <label className="label">Select Concept / Topic You Need Help With</label>
            <select className="input" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
              {tutor.topicsMastered.map((top, idx) => (
                <option key={idx} value={top}>🎯 {top}</option>
              ))}
            </select>
          </div>

          {/* Session Duration Selector */}
          <div>
            <label className="label">Session Duration</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setDuration('15')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: duration === '15' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '15' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  color: duration === '15' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                ⚡ 15 Mins Quick
                <div style={{ fontSize: '0.6875rem', opacity: 0.8, marginTop: '0.25rem' }}>₹{Math.round(baseRate * 0.6)}</div>
              </button>

              <button
                type="button"
                onClick={() => setDuration('30')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: duration === '30' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '30' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  color: duration === '30' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                📖 30 Mins Standard
                <div style={{ fontSize: '0.6875rem', opacity: 0.8, marginTop: '0.25rem' }}>₹{baseRate}</div>
              </button>

              <button
                type="button"
                onClick={() => setDuration('60')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: duration === '60' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: duration === '60' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  color: duration === '60' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                🚀 60 Mins Deep Dive
                <div style={{ fontSize: '0.6875rem', opacity: 0.8, marginTop: '0.25rem' }}>₹{Math.round(baseRate * 1.8)}</div>
              </button>
            </div>
          </div>

          {/* Doubt Notes */}
          <div>
            <label className="label">Describe Where You Are Stuck (Optional)</label>
            <textarea 
              className="input" 
              style={{ minHeight: '70px' }} 
              placeholder="e.g. I am confused between method overriding and overloading in inheritance..."
              value={doubtNotes}
              onChange={e => setDoubtNotes(e.target.value)}
            />
          </div>

          {/* Escrow Guarantee Banner */}
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.875rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Shield size={20} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--success-color)' }}>Student Escrow Protection:</strong> Your payment of <strong>₹{calculatedFee}</strong> is safely held in platform escrow and only released to {tutor.fullName} after you confirm concept clarity post-session.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.875rem', fontWeight: 800, fontSize: '0.9375rem' }}>
              Confirm & Book Session (₹{calculatedFee}) 🚀
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

// --- MY 1:1 SESSIONS & CLASSES SCREEN ---
function MySessionsScreen({ bookedSessions, onLaunchClassroom, onOpenReviewModal, setActiveTab }) {
  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            My 1:1 Study Classes
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Launch live WebRTC video classrooms with peer tutors, review notes, and rate completed sessions.
          </p>
        </div>

        <button onClick={() => setActiveTab('discover')} className="btn btn-accent">
          <Search size={16} /> Find More Tutors
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {bookedSessions.map(session => (
          <div key={session.id} className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1, minWidth: '300px' }}>
              <img src={session.tutorAvatar} alt={session.tutorName} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="tag tag-accent">{session.duration}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.time}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: session.fee === 0 ? 'var(--success-color)' : 'var(--accent-primary)' }}>
                    {session.fee === 0 ? 'FREE Session' : `₹${session.fee} Paid (Escrow Active)`}
                  </span>
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>
                  {session.topic}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Tutor: <strong>{session.tutorName}</strong> ({session.tutorCollege}) • Notes: <em>"{session.doubtNotes}"</em>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {session.status === 'confirmed' ? (
                <button 
                  onClick={() => onLaunchClassroom(session)} 
                  className="btn btn-accent" 
                  style={{ padding: '0.75rem 1.5rem', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-glow)' }}
                >
                  <Video size={18} /> Enter Live Classroom 🚀
                </button>
              ) : session.rated ? (
                <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--success-color)', fontWeight: 700 }}>
                  ✓ Completed & Rated 5.0 ⭐
                </div>
              ) : (
                <button 
                  onClick={() => onOpenReviewModal(session)} 
                  className="btn btn-primary" 
                  style={{ padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Star size={16} /> Rate Concept Clarity ⭐
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

// --- LIVE 1:1 INTERACTIVE PEER CLASSROOM ---
function LiveClassroomScreen({ session, onEndClassroom, localVideoRef, remoteVideoRef, toggleScreenShare, isScreenSharing }) {
  const [codeLanguage, setCodeLanguage] = useState('java');
  const [codeContent, setCodeContent] = useState(`// 🎓 StudyLoop Live 1:1 Collaborative Workspace\n// Topic: Java OOP Inheritance & Polymorphism\n\nclass Animal {\n    void speak() {\n        System.out.println("Animal makes a sound");\n    }\n}\n\nclass Dog extends Animal {\n    @Override\n    void speak() {\n        System.out.println("Dog barks 🐶");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal myDog = new Dog(); // Dynamic Method Dispatch\n        myDog.speak();\n    }\n}`);
  const [consoleOutput, setConsoleOutput] = useState('Dog barks 🐶\n[Process completed in 0.04s - Concept Verified ✓]');
  const [sessionNotes, setSessionNotes] = useState('Key Takeaway: Child class overrides parent method. Reference type of parent holding child object enables Runtime Polymorphism.');

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#090d16', color: '#ffffff' }}>
      
      {/* CLASSROOM HEADER */}
      <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="live-dot"></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }}>
              Live 1:1 Class: {session?.topic || 'Java OOP Inheritance'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Tutor: {session?.tutorName || 'Bhavna Patel'} • Learner: Aarav Sharma (Escrow Protected)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            ⏱️ 24:18 / 30:00 Mins
          </span>

          <button onClick={toggleScreenShare} className={`btn ${isScreenSharing ? 'btn-accent' : 'btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
            <ScreenShare size={14} /> {isScreenSharing ? 'Stop Share' : 'Share Screen'}
          </button>

          <button onClick={() => onEndClassroom(session)} className="btn btn-danger" style={{ fontSize: '0.8125rem', padding: '0.375rem 1rem', fontWeight: 800 }}>
            Finish Class & Review ⭐
          </button>
        </div>
      </div>

      {/* DUAL WORKSPACE: LEFT (CODE & NOTES) | RIGHT (WEBRTC VIDEO & CHAT) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', padding: '1rem', minHeight: 0 }}>
        
        {/* LEFT WORKSPACE: CODE EDITOR */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid #1e293b', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#182234' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={16} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Live Shared Code Editor</span>
            </div>
            <select 
              value={codeLanguage} 
              onChange={e => setCodeLanguage(e.target.value)}
              style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              <option value="java">Java 17</option>
              <option value="cpp">C++ 20</option>
              <option value="python">Python 3.11</option>
              <option value="sql">PostgreSQL</option>
            </select>
          </div>

          <textarea 
            value={codeContent}
            onChange={e => setCodeContent(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: '#090d16',
              color: '#38bdf8',
              fontFamily: "'Fira Code', monospace",
              fontSize: '0.875rem',
              padding: '1rem',
              border: 'none',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.6
            }}
          />

          {/* Console output bar */}
          <div style={{ height: '80px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', padding: '0.5rem 1rem', fontFamily: "'Fira Code', monospace", fontSize: '0.75rem', color: '#4ade80' }}>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Console Output</div>
            <pre style={{ margin: 0 }}>{consoleOutput}</pre>
          </div>
        </div>

        {/* RIGHT WORKSPACE: WEBRTC VIDEO FEEDS & NOTES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
          
          {/* Peer Video Grids */}
          <div style={{ flex: 1.2, display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.75rem', minHeight: 0 }}>
            <div style={{ position: 'relative', backgroundColor: '#162032', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                👨‍🏫 Tutor: {session?.tutorName || 'Bhavna Patel'} (Live)
              </div>
            </div>

            <div style={{ position: 'relative', backgroundColor: '#162032', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                You (Learner)
              </div>
            </div>
          </div>

          {/* Quick Scratchpad Notes */}
          <div style={{ flex: 0.8, backgroundColor: '#111827', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.375rem' }}>
              📝 Shared Concept Summary Notes
            </div>
            <textarea 
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              placeholder="Take notes during the explanation..."
              style={{ flex: 1, backgroundColor: '#182234', color: '#ffffff', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.5rem', fontSize: '0.8125rem', resize: 'none' }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}

// --- DUAL-FACTOR RATING & QUALITY REVIEW MODAL ---
function ReviewSessionModal({ session, onClose, onSubmitReview }) {
  const [clarityRating, setClarityRating] = useState(5);
  const [patienceRating, setPatienceRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  if (!session) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview({
      sessionId: session.id,
      tutorName: session.tutorName,
      clarityRating,
      patienceRating,
      feedbackText: feedbackText || 'Explained the concept with super clear examples. 100% understood!'
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
            <Award size={28} />
          </div>
          <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: '0 0 0.25rem 0' }}>Rate Your Peer Tutor</h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
            Session on <strong>{session.topic}</strong> with <strong>{session.tutorName}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Factor 1: Concept Clarity Rating */}
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>1. Concept Clarity</span>
              <span style={{ fontWeight: 800, color: 'var(--warning-color)' }}>{clarityRating} / 5 ⭐</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setClarityRating(star)} 
                  style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: star <= clarityRating ? '#f59e0b' : '#64748b' }}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.25rem' }}>
              Did the tutor explain the core logic clearly and answer your doubts?
            </div>
          </div>

          {/* Factor 2: Teaching Patience & Approachability */}
          <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>2. Teaching Patience</span>
              <span style={{ fontWeight: 800, color: 'var(--warning-color)' }}>{patienceRating} / 5 ⭐</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setPatienceRating(star)} 
                  style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: star <= patienceRating ? '#f59e0b' : '#64748b' }}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.25rem' }}>
              Was the student tutor friendly, patient, and comfortable to learn with?
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="label">Written Peer Review</label>
            <textarea 
              className="input" 
              style={{ minHeight: '80px' }} 
              placeholder="What made this explanation easy to understand?" 
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-accent" style={{ padding: '0.875rem', fontWeight: 800 }}>
            Submit Rating & Release Escrow Earnings 🚀
          </button>

        </form>

      </div>
    </div>
  );
}

// --- MODULE 5: STUDENT EARNINGS WALLET & MONETIZATION HUB SCREEN ---
function WalletScreen({ token }) {
  const { profile, updateProfileState } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('450');
  const [upiId, setUpiId] = useState('');
  const [customRate, setCustomRate] = useState(profile?.customSessionRate || 50);

  const walletBalance = profile?.walletBalance !== undefined ? profile.walletBalance : 450;
  const lifetimeEarnings = profile?.lifetimeEarnings !== undefined ? profile.lifetimeEarnings : 1850;
  const classesTaught = profile?.classesTaught !== undefined ? profile.classesTaught : 24;
  const tutorTier = profile?.tutorTier || 'certified';

  const transactions = [
    { id: 'tx-1', desc: '1:1 Session: Java OOP Inheritance (Rahul S.)', date: 'Today, 4:30 PM', amount: '+₹45.00', status: 'Completed (10% Fee)', isCredit: true },
    { id: 'tx-2', desc: '1:1 Session: Dynamic Programming State Transition (Sneha R.)', date: 'Yesterday', amount: '+₹54.00', status: 'Completed (10% Fee)', isCredit: true },
    { id: 'tx-3', desc: 'UPI Bank Withdrawal to aarav@okaxis', date: '26 Aug 2026', amount: '-₹500.00', status: 'Settled to Bank Account', isCredit: false },
    { id: 'tx-4', desc: '1:1 Session: Recursion & Binary Trees (Vikram J.)', date: '24 Aug 2026', amount: '+₹45.00', status: 'Completed', isCredit: true }
  ];

  const handleSaveRate = (e) => {
    e.preventDefault();
    if (profile) {
      updateProfileState({ ...profile, customSessionRate: parseInt(customRate) });
    }
    alert(`🎉 Your session rate updated to ₹${customRate} / 30 mins!`);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!upiId.trim()) {
      alert("Please enter a valid UPI ID (e.g. yourname@oksbi or phonepe)");
      return;
    }
    const amountNum = parseInt(withdrawAmount);
    if (amountNum > walletBalance) {
      alert("Withdrawal amount cannot exceed available balance.");
      return;
    }
    if (profile) {
      updateProfileState({ ...profile, walletBalance: walletBalance - amountNum });
    }
    alert(`💸 Payout of ₹${amountNum} initiated successfully to ${upiId}! Funds will reflect in your bank in 1-2 hours.`);
    setShowWithdrawModal(false);
  };

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Student Earning Wallet & Monetization Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Earn money by teaching concepts you excel at. Track completed sessions, adjust rates, and withdraw to UPI.
          </p>
        </div>

        <button 
          onClick={() => setShowWithdrawModal(true)} 
          className="btn btn-accent"
          style={{ padding: '0.75rem 1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--success-color)' }}
        >
          <CreditCard size={18} /> Withdraw to UPI (₹{walletBalance})
        </button>
      </div>

      {/* 4 STATS CARDS */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            Available Earning Balance
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-color)' }}>
            ₹{walletBalance}.00
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Ready for instant bank transfer
          </div>
        </div>

        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            Lifetime Earnings
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{lifetimeEarnings}.00
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600, marginTop: '0.25rem' }}>
            ↑ 100% Student Self-Funded
          </div>
        </div>

        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            1:1 Classes Taught
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {classesTaught} Classes
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Verified campus doubt sessions
          </div>
        </div>

        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            Concept Clarity Rating
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning-color)' }}>
            4.9 ⭐
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            96.4% positive student feedback
          </div>
        </div>
      </div>

      {/* TWO COLUMN: MONETIZATION PROGRESSION & PRICING SETTINGS + TRANSACTION HISTORY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* COLUMN 1: MONETIZATION TIER & RATE CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card-premium">
            <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: 'var(--accent-primary)' }} /> Tutor Qualification & Monetization Tier
            </h3>

            {/* 10-Class Rule Progress */}
            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <span>Tier Status: <strong>Certified Peer Tutor</strong></span>
                <span style={{ color: 'var(--success-color)' }}>10/10 Milestone Passed ✓</span>
              </div>
              
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #0066FF 100%)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', margin: '0.75rem 0 0 0' }}>
                🎓 <strong>Rule:</strong> Every student must first complete 10 verified practice/free doubt sessions before unlocking paid classes. You have unlocked paid mentoring!
              </p>
            </div>

            {/* Custom Session Rate Setting */}
            <form onSubmit={handleSaveRate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Set Your Custom Rate Per 30-Minute Session (₹30 – ₹500)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="number" 
                    min="30" 
                    max="500" 
                    className="input" 
                    value={customRate} 
                    onChange={e => setCustomRate(e.target.value)} 
                    style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', maxWidth: '140px' }} 
                  />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>₹ / 30-minute 1:1 class</span>
                </div>
              </div>

              <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem' }}>
                Save Session Rate 💾
              </button>
            </form>

          </div>

          {/* Student Earning Model Info */}
          <div className="card-premium" style={{ backgroundColor: 'rgba(0, 102, 255, 0.04)', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              💡 How Student Earning Works:
            </h4>
            <ul style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.6, margin: 0 }}>
              <li>10 Classes × ₹50 = <strong>₹500</strong></li>
              <li>20 Classes × ₹50 = <strong>₹1,000</strong></li>
              <li>Platform keeps a 10% safety & server infrastructure fee; <strong>90% goes directly to you</strong>.</li>
            </ul>
          </div>

        </div>

        {/* COLUMN 2: TRANSACTION HISTORY & ESCROW LEDGER */}
        <div className="card-premium">
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} style={{ color: 'var(--accent-primary)' }} /> Earnings Ledger & Escrow Releases
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{tx.desc}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date} • {tx.status}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: tx.isCredit ? 'var(--success-color)' : 'var(--danger-color)' }}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* WITHDRAWAL TO UPI MODAL */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '460px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0 }}>Instant UPI Bank Payout</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Withdrawal Amount (₹)</label>
                <input 
                  type="number" 
                  max={walletBalance} 
                  min="50" 
                  className="input" 
                  value={withdrawAmount} 
                  onChange={e => setWithdrawAmount(e.target.value)} 
                  required 
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Available: ₹{walletBalance}.00
                </div>
              </div>

              <div>
                <label className="label">Enter UPI ID (GooglePay / PhonePe / Paytm)</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. aarav@okhdfcbank or 9876543210@paytm" 
                  value={upiId} 
                  onChange={e => setUpiId(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem', fontWeight: 800, backgroundColor: 'var(--success-color)' }}>
                Transfer ₹{withdrawAmount} to UPI Now 💸
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

// --- REAL-TIME LINKEDIN & INSTAGRAM STYLE CONNECTIONS & NETWORK SCREEN ---
function ConnectionsScreen({ token, setActiveTab, setActiveChatId, setChatPeer, onOpenPublicProfile }) {
  const { profile, updateProfileState } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('connections');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Real-time connections list
  const [connections, setConnections] = useState([
    { id: 'c-1', fullName: 'Bhavna Patel', college: 'IIT Madras', department: 'Computer Science', year: 3, avatarUrl: FEMALE_AVATAR_SVG, skills: ['Python', 'Machine Learning', 'Data Structures'], degree: '1st', mutuals: 14, endorsed: false },
    { id: 'c-2', fullName: 'Chaitanya Reddy', college: 'BITS Pilani', department: 'Electrical Engineering', year: 1, avatarUrl: MALE_AVATAR_SVG, skills: ['Circuits', 'Calculus', 'C++'], degree: '1st', mutuals: 8, endorsed: false },
    { id: 'c-3', fullName: 'Divya Nambiar', college: 'NIT Trichy', department: 'Data Science', year: 2, avatarUrl: FEMALE_AVATAR_SVG, skills: ['SQL', 'Tableau', 'Statistics'], degree: '1st', mutuals: 19, endorsed: true }
  ]);

  // Real-time pending requests
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'p-1', fullName: 'Kavya Subramanian', college: 'IIT Delhi', department: 'Software Engineering', year: 4, avatarUrl: FEMALE_AVATAR_SVG, skills: ['React', 'TypeScript', 'Node.js'], note: 'Hey Aarav, saw your solution in the Java thread! Would love to connect for system design prep.', time: '2h ago' },
    { id: 'p-2', fullName: 'Rohan Deshmukh', college: 'IIT Bombay', department: 'Computer Science', year: 2, avatarUrl: MALE_AVATAR_SVG, skills: ['Competitive Programming', 'Algorithms'], note: 'Let\'s collaborate on algorithmic doubt rooms.', time: '5h ago' }
  ]);

  // Real-time suggested peers
  const [suggestions, setSuggestions] = useState([
    { id: 's-1', fullName: 'Sneha Roy', college: 'IIIT Hyderabad', department: 'AI & Data Science', avatarUrl: FEMALE_AVATAR_SVG, skills: ['PyTorch', 'Computer Vision'], isPending: false, isFollowing: false },
    { id: 's-2', fullName: 'Vikram Joshi', college: 'IIT Madras', department: 'Mechanical Engineering', avatarUrl: MALE_AVATAR_SVG, skills: ['Thermodynamics', 'MATLAB', 'Python'], isPending: false, isFollowing: false },
    { id: 's-3', fullName: 'Ananya Guha', college: 'BITS Pilani', department: 'Computer Science', avatarUrl: FEMALE_AVATAR_SVG, skills: ['Kubernetes', 'Go', 'Cloud'], isPending: false, isFollowing: false }
  ]);

  const handleAcceptRequest = (req) => {
    setPendingRequests(prev => prev.filter(p => p.id !== req.id));
    const newConn = {
      id: req.id,
      fullName: req.fullName,
      college: req.college,
      department: req.department,
      year: req.year,
      avatarUrl: req.avatarUrl,
      skills: req.skills,
      degree: '1st',
      mutuals: 12,
      endorsed: false
    };
    setConnections(prev => [newConn, ...prev]);
    if (profile) {
      const updated = { ...profile, followersCount: (profile.followersCount || 1200) + 1, coins: (profile.coins || 45) + 5, xp: (profile.xp || 650) + 10 };
      updateProfileState(updated);
    }
    alert(`🎉 Connected with ${req.fullName}! +10 XP and +5 Peer Coins awarded.`);
  };

  const handleIgnoreRequest = (reqId) => {
    setPendingRequests(prev => prev.filter(p => p.id !== reqId));
  };

  const handleSendConnect = (sugId) => {
    setSuggestions(prev => prev.map(s => s.id === sugId ? { ...s, isPending: true } : s));
    alert("✉️ Connection request sent in real time!");
  };

  const handleToggleFollow = (sugId) => {
    setSuggestions(prev => prev.map(s => {
      if (s.id === sugId) {
        const nextState = !s.isFollowing;
        if (profile) {
          const updated = { 
            ...profile, 
            followingCount: nextState ? (profile.followingCount || 5) + 1 : Math.max(0, (profile.followingCount || 5) - 1) 
          };
          updateProfileState(updated);
        }
        return { ...s, isFollowing: nextState };
      }
      return s;
    }));
  };

  const handleEndorseSkill = (connId, skillName) => {
    setConnections(prev => prev.map(c => c.id === connId ? { ...c, endorsed: true } : c));
    if (profile) {
      const updated = { ...profile, coins: (profile.coins || 45) + 5, xp: (profile.xp || 650) + 10 };
      updateProfileState(updated);
    }
    alert(`🌟 You endorsed ${skillName}! +5 Peer Coins and +10 XP awarded.`);
  };

  const handleRemoveConnection = (connId, name) => {
    if (confirm(`Are you sure you want to remove ${name} from your connections?`)) {
      setConnections(prev => prev.filter(c => c.id !== connId));
    }
  };

  const filteredConnections = connections.filter(c => 
    c.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.college.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Campus Peer Network & Mentorship
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Send connection requests, endorse peer skills, accept study invites, and message tutors in real time.
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveSubTab('connections')} 
            style={{ 
              padding: '0.5rem 1.25rem', 
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
            My Connections ({connections.length})
          </button>
          
          <button 
            onClick={() => setActiveSubTab('pending')} 
            style={{ 
              padding: '0.5rem 1.25rem', 
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
            Pending Requests
            {pendingRequests.length > 0 && (
              <span style={{ backgroundColor: 'var(--danger-color)', color: '#ffffff', fontSize: '0.625rem', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)' }}>
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveSubTab('discover')} 
            style={{ 
              padding: '0.5rem 1.25rem', 
              borderRadius: 'var(--radius-sm)', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '0.8125rem', 
              fontWeight: 700,
              backgroundColor: activeSubTab === 'discover' ? 'var(--bg-secondary)' : 'transparent',
              color: activeSubTab === 'discover' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              boxShadow: activeSubTab === 'discover' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Suggested Mentors ({suggestions.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: MY CONNECTIONS */}
      {activeSubTab === 'connections' && (
        <div>
          {/* Search Filter Bar */}
          <div className="card-premium" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Filter connections by name, university, department, or skill (e.g. Java, Python)..." 
              value={searchFilter} 
              onChange={e => setSearchFilter(e.target.value)} 
              style={{ border: 'none', background: 'transparent', padding: '0.25rem 0' }}
            />
          </div>

          <div className="grid-2">
            {filteredConnections.map(c => (
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
                        <span className="tag" style={{ fontSize: '0.625rem' }}>{c.degree}</span>
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

                {/* Skills & Endorsements */}
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                    {c.skills.map((s, idx) => (
                      <span key={idx} className="tag tag-accent" style={{ fontSize: '0.75rem' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{ display: 'flex', gap: '0.625rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => { setChatPeer(c); setActiveChatId(`chat-${c.id}`); setActiveTab('chat'); }} 
                    className="btn btn-primary" 
                    style={{ flex: 1, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
                  >
                    <MessageSquare size={14} /> Direct Message
                  </button>
                  <button 
                    onClick={() => handleEndorseSkill(c.id, c.skills[0])} 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8125rem', color: c.endorsed ? 'var(--success-color)' : 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                    disabled={c.endorsed}
                  >
                    <Award size={14} /> {c.endorsed ? 'Endorsed ✓' : 'Endorse (+5🪙)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PENDING INVITATIONS */}
      {activeSubTab === 'pending' && (
        <div>
          {pendingRequests.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <CheckCircle size={48} style={{ color: 'var(--success-color)', margin: '0 auto 1rem auto' }} />
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>All Caught Up!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You have no pending connection requests at this time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pendingRequests.map(req => (
                <div key={req.id} className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                    <img src={req.avatarUrl} alt={req.fullName} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>{req.fullName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {req.time}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{req.college} • {req.department} (Yr {req.year})</div>
                      {req.note && (
                        <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--text-primary)', marginTop: '0.5rem', fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)' }}>
                          "{req.note}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => handleAcceptRequest(req)} 
                      className="btn btn-accent" 
                      style={{ padding: '0.625rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                    >
                      <CheckCircle2 size={16} /> Accept ✓
                    </button>
                    <button 
                      onClick={() => handleIgnoreRequest(req.id)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
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

      {/* SUBTAB 3: SUGGESTED PEERS & MENTORS */}
      {activeSubTab === 'discover' && (
        <div className="grid-3">
          {suggestions.map(s => (
            <div key={s.id} className="card-premium interactive-hover" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={s.avatarUrl} alt={s.fullName} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)', marginBottom: '1rem' }} />
              <h3 className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.25rem' }}>{s.fullName}</h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{s.college} • {s.department}</div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
                {s.skills.map((sk, i) => (
                  <span key={i} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>{sk}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
                <button 
                  onClick={() => handleSendConnect(s.id)} 
                  className={`btn ${s.isPending ? 'btn-secondary' : 'btn-accent'}`} 
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}
                  disabled={s.isPending}
                >
                  <UserPlus size={13} /> {s.isPending ? 'Pending ⏳' : 'Connect'}
                </button>
                <button 
                  onClick={() => handleToggleFollow(s.id)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem', color: s.isFollowing ? 'var(--accent-primary)' : 'inherit' }}
                >
                  {s.isFollowing ? 'Following ✓' : '+ Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

function LeaderboardScreen({ token, onOpenPublicProfile }) {
  const leaders = [
    { rank: 1, name: 'Aarav Sharma', college: 'IIT Madras', xp: 650, doubtsSolved: 15, level: 4, avatar: MALE_AVATAR_SVG },
    { rank: 2, name: 'Bhavna Patel', college: 'IIT Madras', xp: 820, doubtsSolved: 18, level: 5, avatar: FEMALE_AVATAR_SVG },
    { rank: 3, name: 'Chaitanya Reddy', college: 'BITS Pilani', xp: 340, doubtsSolved: 8, level: 2, avatar: MALE_AVATAR_SVG }
  ];

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Campus Leaderboard</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Top peer tutors and students ranked by academic doubt resolution and XP points.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th>University</th>
            <th>Doubts Solved</th>
            <th>Level</th>
            <th>XP Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map(l => (
            <tr key={l.rank}>
              <td><strong>#{l.rank}</strong></td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={l.avatar} alt="Av" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontWeight: 700 }}>{l.name}</span>
                </div>
              </td>
              <td>{l.college}</td>
              <td>{l.doubtsSolved} Solved</td>
              <td><span className="tag tag-accent">Lvl {l.level}</span></td>
              <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>⚡ {l.xp} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- REAL-TIME VERTICAL TIKTOK / INSTAGRAM STYLE REELS SCREEN ---
function ReelsScreen({ token, setActiveTab, setActiveChatId, setChatPeer, socket, setWsMessages }) {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [likesMap, setLikesMap] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const [reels, setReels] = useState([
    {
      id: 'r-1',
      title: '3 Tricks to solve Recursion Tree problems fast in Java ⚡ #Algorithms #Java',
      author: 'Aarav Sharma',
      college: 'IIT Madras',
      avatarUrl: MALE_AVATAR_SVG,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      likes: 154,
      shares: 42,
      comments: [
        { author: 'Bhavna Patel', text: 'This helper tree recursion trick saved me in midterms! 🔥' },
        { author: 'Chaitanya Reddy', text: 'Clean breakdown. Can you do Dynamic Programming memoization next?' }
      ]
    },
    {
      id: 'r-2',
      title: 'How Spring Boot Inversion of Control & @Autowired work under 60s ☕ #SpringBoot',
      author: 'Bhavna Patel',
      college: 'IIT Madras',
      avatarUrl: FEMALE_AVATAR_SVG,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      likes: 218,
      shares: 67,
      comments: [
        { author: 'Aarav Sharma', text: 'Best 60-second explanation of ApplicationContext!' }
      ]
    },
    {
      id: 'r-3',
      title: 'Visualizing Gradient Descent & Contour Cost Surfaces in 3D 📐 #MachineLearning',
      author: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      avatarUrl: MALE_AVATAR_SVG,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4',
      likes: 312,
      shares: 89,
      comments: [
        { author: 'Divya Nambiar', text: 'The learning rate oscillation visual was super clear.' }
      ]
    }
  ]);

  const currentReel = reels[currentReelIndex] || reels[0];
  const isLiked = likesMap[currentReel.id] || false;

  // Keyboard navigation for smooth up/down reel browsing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showCommentsModal) return;
      if (e.key === 'ArrowDown') {
        setCurrentReelIndex(prev => (prev < reels.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        setCurrentReelIndex(prev => (prev > 0 ? prev - 1 : reels.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reels.length, showCommentsModal]);

  const handleToggleLike = () => {
    const nextLiked = !isLiked;
    setLikesMap(prev => ({ ...prev, [currentReel.id]: nextLiked }));
    setReels(prev => prev.map(r => r.id === currentReel.id ? { ...r, likes: nextLiked ? r.likes + 1 : r.likes - 1 } : r));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = { author: 'You (Aarav)', text: commentInput.trim() };
    setReels(prev => prev.map(r => r.id === currentReel.id ? { ...r, comments: [...r.comments, newComment] } : r));
    setCommentInput('');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden', padding: '1.5rem 1rem' }}>
      
      {/* Top Left Back Navigation */}
      <button 
        onClick={() => setActiveTab('dashboard')} 
        className="btn btn-secondary" 
        style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 100, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', fontWeight: 700 }}
      >
        ← Back to Student Profile
      </button>

      {/* Top Right Counter Pill */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', padding: '0.45rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 700, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          📱 Concept Short {currentReelIndex + 1} of {reels.length}
        </span>
      </div>

      {/* REEL 9:16 VERTICAL CONTAINER */}
      <div className="reel-frame" style={{ width: '100%', maxWidth: '430px', height: '88vh', minHeight: '560px', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '2px solid var(--border-color)', backgroundColor: '#000000' }}>
        
        <video 
          key={currentReel.id}
          src={currentReel.videoUrl} 
          autoPlay 
          loop 
          muted={isMuted}
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000000' }} 
        />

        {/* Right Floating Action Stack */}
        <div className="reel-action-stack" style={{ position: 'absolute', right: '1rem', bottom: '6rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', zIndex: 50 }}>
          
          {/* Like */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <button 
              onClick={handleToggleLike} 
              className="reel-action-btn" 
              style={{ color: isLiked ? '#f43f5e' : '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
            >
              <Heart size={24} fill={isLiked ? '#f43f5e' : 'none'} />
            </button>
            <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{currentReel.likes}</span>
          </div>

          {/* Comments */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <button 
              onClick={() => setShowCommentsModal(true)} 
              className="reel-action-btn"
              style={{ color: '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
            >
              <MessageCircle size={24} />
            </button>
            <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{currentReel.comments.length}</span>
          </div>

          {/* Share */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <button 
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
                alert("🔗 Concept Reel link copied to clipboard!");
              }} 
              className="reel-action-btn"
              style={{ color: '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
            >
              <Share2 size={22} />
            </button>
            <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{currentReel.shares}</span>
          </div>

          {/* Mute / Unmute */}
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="reel-action-btn"
            style={{ color: '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>

        {/* Bottom Overlay Info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.25rem 1.25rem 1.25rem', background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 65%, transparent 100%)', color: '#ffffff', zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <img src={currentReel.avatarUrl} alt={currentReel.author} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#ffffff' }}>@{currentReel.author}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>{currentReel.college} • Senior Tutor</div>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', lineHeight: 1.4, margin: 0, color: '#f8fafc', fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {currentReel.title}
          </p>
        </div>
      </div>

      {/* Next / Previous Vertical Stepper Buttons */}
      <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 100 }}>
        <button 
          onClick={() => setCurrentReelIndex(prev => (prev > 0 ? prev - 1 : reels.length - 1))}
          className="btn-icon" 
          style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', cursor: 'pointer', fontSize: '1rem' }}
          title="Previous Reel (Arrow Up)"
        >
          ▲
        </button>
        <button 
          onClick={() => setCurrentReelIndex(prev => (prev < reels.length - 1 ? prev + 1 : 0))}
          className="btn-icon" 
          style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', cursor: 'pointer', fontSize: '1rem' }}
          title="Next Reel (Arrow Down)"
        >
          ▼
        </button>
      </div>

      {/* COMMENTS MODAL DRAWER */}
      {showCommentsModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 3000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowCommentsModal(false)}>
          <div 
            style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-elevated)', borderRadius: '24px 24px 0 0', padding: '1.75rem', maxHeight: '75vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                💬 Reel Comments ({currentReel.comments.length})
              </h3>
              <button onClick={() => setShowCommentsModal(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {currentReel.comments.map((c, i) => (
                <div key={i} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                    {c.author}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {c.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.625rem' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Share your thought or question on this concept..." 
                value={commentInput} 
                onChange={e => setCommentInput(e.target.value)} 
                required 
              />
              <button type="submit" className="btn btn-accent" style={{ padding: '0.625rem 1.25rem', fontWeight: 700 }}>
                Post
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function SettingsScreen({ token, setActiveTab, theme, setTheme }) {
  const { user, profile: authProfile, updateProfileState, testAccounts } = useAuth();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // CLEAN VECTOR PRESETS ONLY (NO STRANGER PHOTOS)
  const AVATAR_PRESETS = [
    { id: 'vector_m', label: '👨 Male Vector', isVector: true, gender: 'male' },
    { id: 'vector_f', label: '👩 Female Vector', isVector: true, gender: 'female' },
    { id: 'vector_n', label: '🧑 Neutral Vector', isVector: true, gender: 'other' }
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          const updated = { ...formData, avatarUrl: dataUrl };
          setFormData(updated);
          handleSaveAll(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Cover image must be smaller than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          const updated = { ...formData, coverUrl: dataUrl };
          setFormData(updated);
          handleSaveAll(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Categorized navigation (Naukri & Professional Platform style with Persistence)
  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem('studyloop_settings_category') || 'basic';
  });

  useEffect(() => {
    if (activeCategory) {
      localStorage.setItem('studyloop_settings_category', activeCategory);
    }
  }, [activeCategory]);

  const [searchFilter, setSearchFilter] = useState('');
  const [saveToast, setSaveToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [reachTimeframe, setReachTimeframe] = useState('30d'); // '7d', '30d', 'all'

  // Initialize editable state
  const currentProfile = authProfile || {};
  
  const [formData, setFormData] = useState({
    fullName: currentProfile.fullName || 'Aarav Sharma',
    headline: currentProfile.headline || 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist',
    bio: currentProfile.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught',
    college: currentProfile.college || 'IIT Madras',
    department: currentProfile.department || 'Computer Science',
    year: currentProfile.year || 2,
    gender: currentProfile.gender || 'male',
    location: currentProfile.location || 'Chennai, Tamil Nadu, India',
    pronouns: currentProfile.pronouns || 'He/Him',
    avatarUrl: currentProfile.avatarUrl || '',
    bannerTheme: currentProfile.bannerTheme || 'royal-blue',
    walletBalance: currentProfile.walletBalance !== undefined ? currentProfile.walletBalance : 450,
    hourlyRate: currentProfile.hourlyRate || 450,
    coinRate: currentProfile.coinRate || 45,
    isAvailableForMentoring: currentProfile.isAvailableForMentoring !== undefined ? currentProfile.isAvailableForMentoring : true,
    teachingSkills: currentProfile.teachingSkills || ['Java', 'Algorithms', 'Data Structures', 'React', 'Spring Boot'],
    learningGoals: currentProfile.learningGoals || ['System Design', 'AI/ML', 'Microservices'],
    socialLinks: currentProfile.socialLinks || {
      github: 'https://github.com/aaravsharma',
      linkedin: 'https://linkedin.com/in/aarav-sharma-cs',
      leetcode: 'https://leetcode.com/aarav_codes',
      portfolio: 'https://aaravsharma.dev',
      codeforces: 'https://codeforces.com/profile/aarav_codes',
      twitter: 'https://twitter.com/aarav_codes'
    },
    educations: currentProfile.educations || [
      {
        id: 'edu-1',
        school: 'Indian Institute of Technology (IIT) Madras',
        degree: 'Bachelor of Technology - B.Tech',
        field: 'Computer Science & Engineering',
        startYear: '2023',
        endYear: '2027',
        grade: '8.95 / 10.0 CGPA',
        activities: 'Lead at Google Developer Student Club (GDSC), Campus Doubt Mentor'
      },
      {
        id: 'edu-2',
        school: 'Delhi Public School (DPS), R.K. Puram',
        degree: 'Higher Secondary School Certificate (Class XII)',
        field: 'Physics, Chemistry, Mathematics & Computer Science',
        startYear: '2021',
        endYear: '2023',
        grade: '96.4% Aggregate',
        activities: 'National Cyber Olympiad Gold Medalist'
      }
    ],
    certifications: currentProfile.certifications || [
      {
        id: 'cert-1',
        name: 'Oracle Certified Associate, Java SE 8 Programmer (1Z0-808)',
        issuer: 'Oracle',
        issueDate: 'Jan 2026',
        credentialId: 'OCA-JAVA-98742',
        credentialUrl: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=demo',
        badgeIcon: '☕'
      },
      {
        id: 'cert-2',
        name: 'NPTEL Elite Gold: Programming, Data Structures And Algorithms In Python',
        issuer: 'IIT Madras & NPTEL',
        issueDate: 'Oct 2025',
        credentialId: 'NPTEL25CS89104',
        credentialUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS89104',
        badgeIcon: '🐍'
      },
      {
        id: 'cert-3',
        name: 'AWS Certified Cloud Practitioner (CLF-C02)',
        issuer: 'Amazon Web Services (AWS)',
        issueDate: 'May 2025',
        credentialId: 'AWS-CCP-76291',
        credentialUrl: 'https://aws.amazon.com/verification',
        badgeIcon: '☁️'
      }
    ],
    achievements: currentProfile.achievements || [
      {
        id: 'ach-1',
        title: 'Smart India Hackathon (SIH 2025) - National Finalist',
        issuer: 'Ministry of Education & Unstop',
        date: 'Dec 2025',
        desc: 'Selected in Top 5 teams out of 12,000+ national submissions for building AI peer doubt router.'
      },
      {
        id: 'ach-2',
        title: 'LeetCode Knight Badge (Top 2.5% Globally • Rating: 1985)',
        issuer: 'LeetCode',
        date: '2026',
        desc: 'Solved 450+ data structures & algorithms questions with 85% dynamic programming accuracy.'
      },
      {
        id: 'ach-3',
        title: 'Flipkart GRiD 6.0 Software Development Semi-Finalist',
        issuer: 'Flipkart & Unstop',
        date: 'Aug 2025',
        desc: 'Built high-throughput inventory allocation service handling 10k QPS simulation.'
      }
    ],
    projects: currentProfile.projects || [
      {
        id: 'proj-1',
        title: 'PeerCode - WebRTC Real-Time Collaborative Workspace',
        stack: ['React', 'WebRTC', 'Node.js', 'Socket.io', 'Java'],
        desc: 'Low-latency collaborative coding and live doubt-solving workspace with synchronized editor and audio/video.',
        githubUrl: 'https://github.com/aaravsharma/peercode-workspace',
        liveUrl: 'https://peercode.studyloop.app'
      },
      {
        id: 'proj-2',
        title: 'AlgoVisualizer - Interactive Graph & DP Algorithm Visualizer',
        stack: ['JavaScript', 'Canvas API', 'Algorithms', 'CSS3'],
        desc: 'Step-by-step interactive animations for Dijkstra, BFS/DFS, 0/1 Knapsack, and Tree traversals used by 500+ students.',
        githubUrl: 'https://github.com/aaravsharma/algo-visualizer',
        liveUrl: 'https://algovis.studyloop.app'
      }
    ],
    resumeFileName: currentProfile.resumeFileName || 'Aarav_Sharma_BTech_CS_Resume.pdf',
    resumeUploadDate: currentProfile.resumeUploadDate || 'Aug 2026',
    notificationSettings: {
      doubtAlerts: true,
      directMessages: true,
      streakReminders: true,
      leaderboardUpdates: true,
      emailDigest: false
    },
    privacySettings: {
      profileVisibility: 'public',
      allowDirectDoubts: true,
      showActivityStatus: true,
      twoFactorEnabled: false
    }
  });

  // Modals for adding items
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', field: '', startYear: '2023', endYear: '2027', grade: '', activities: '' });
  
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', issuer: 'Oracle', issueDate: 'Aug 2026', credentialId: '', credentialUrl: '', badgeIcon: '☕' });

  const [showAddAch, setShowAddAch] = useState(false);
  const [newAch, setNewAch] = useState({ title: '', issuer: '', date: '2026', desc: '' });

  const [showAddProj, setShowAddProj] = useState(false);
  const [newProj, setNewProj] = useState({ title: '', stack: '', desc: '', githubUrl: '', liveUrl: '' });

  const [newSkillTag, setNewSkillTag] = useState('');

  // Save & Real-Time Reflection Handler
  const handleSaveAll = (customUpdates = {}) => {
    setIsSaving(true);
    const updated = {
      ...currentProfile,
      ...formData,
      ...customUpdates
    };
    if (updateProfileState) {
      updateProfileState(updated);
    }
    if (updated.id) {
      localStorage.setItem(`studyloop_profile_${updated.id}`, JSON.stringify(updated));
    }
    setTimeout(() => {
      setIsSaving(false);
      setSaveToast("✅ All profile & settings changes updated and reflected live!");
      setTimeout(() => setSaveToast(null), 3500);
    }, 250);
  };

  // Education Helpers
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.school.trim() || !newEdu.degree.trim()) return;
    const entry = { ...newEdu, id: `edu-${Date.now()}` };
    const nextEducations = [entry, ...(formData.educations || [])];
    const nextForm = { ...formData, educations: nextEducations };
    setFormData(nextForm);
    handleSaveAll(nextForm);
    setShowAddEdu(false);
    setNewEdu({ school: '', degree: '', field: '', startYear: '2023', endYear: '2027', grade: '', activities: '' });
  };

  const handleDeleteEducation = (id) => {
    const nextEducations = (formData.educations || []).filter(e => e.id !== id);
    const nextForm = { ...formData, educations: nextEducations };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Certificate Helpers
  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!newCert.name.trim() || !newCert.issuer.trim()) return;
    const entry = { ...newCert, id: `cert-${Date.now()}` };
    const nextCerts = [entry, ...(formData.certifications || [])];
    const nextForm = { ...formData, certifications: nextCerts };
    setFormData(nextForm);
    handleSaveAll(nextForm);
    setShowAddCert(false);
    setNewCert({ name: '', issuer: 'Oracle', issueDate: 'Aug 2026', credentialId: '', credentialUrl: '', badgeIcon: '☕' });
  };

  const handleDeleteCertificate = (id) => {
    const nextCerts = (formData.certifications || []).filter(c => c.id !== id);
    const nextForm = { ...formData, certifications: nextCerts };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Achievement Helpers
  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!newAch.title.trim()) return;
    const entry = { ...newAch, id: `ach-${Date.now()}` };
    const nextAch = [entry, ...(formData.achievements || [])];
    const nextForm = { ...formData, achievements: nextAch };
    setFormData(nextForm);
    handleSaveAll(nextForm);
    setShowAddAch(false);
    setNewAch({ title: '', issuer: '', date: '2026', desc: '' });
  };

  const handleDeleteAchievement = (id) => {
    const nextAch = (formData.achievements || []).filter(a => a.id !== id);
    const nextForm = { ...formData, achievements: nextAch };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Project Helpers
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProj.title.trim()) return;
    const stackArr = newProj.stack ? newProj.stack.split(',').map(s => s.trim()).filter(Boolean) : ['React', 'JavaScript'];
    const entry = { ...newProj, stack: stackArr, id: `proj-${Date.now()}` };
    const nextProj = [entry, ...(formData.projects || [])];
    const nextForm = { ...formData, projects: nextProj };
    setFormData(nextForm);
    handleSaveAll(nextForm);
    setShowAddProj(false);
    setNewProj({ title: '', stack: '', desc: '', githubUrl: '', liveUrl: '' });
  };

  const handleDeleteProject = (id) => {
    const nextProj = (formData.projects || []).filter(p => p.id !== id);
    const nextForm = { ...formData, projects: nextProj };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Skills Tag Helpers
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillTag.trim()) return;
    if (!(formData.teachingSkills || []).includes(newSkillTag.trim())) {
      const nextSkills = [...(formData.teachingSkills || []), newSkillTag.trim()];
      const nextForm = { ...formData, teachingSkills: nextSkills };
      setFormData(nextForm);
      handleSaveAll(nextForm);
    }
    setNewSkillTag('');
  };

  const handleRemoveSkill = (skill) => {
    const nextSkills = (formData.teachingSkills || []).filter(s => s !== skill);
    const nextForm = { ...formData, teachingSkills: nextSkills };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Calculate LinkedIn / Naukri Profile Completeness in Percentage
  const calculateProfileStrength = () => {
    let score = 0;
    const items = [];

    const hasBasic = !!(formData.fullName && formData.headline && formData.bio && formData.college);
    if (hasBasic) score += 20;
    items.push({ label: 'Basic Info & Bio', weight: 20, done: hasBasic, categoryId: 'basic' });

    const hasAvatar = !!(formData.avatarUrl || currentProfile.avatarUrl || formData.gender);
    if (hasAvatar) score += 15;
    items.push({ label: 'Avatar & Identity', weight: 15, done: hasAvatar, categoryId: 'basic' });

    const hasEdu = (formData.educations || []).length > 0;
    if (hasEdu) score += 15;
    items.push({ label: 'Education History', weight: 15, done: hasEdu, categoryId: 'education' });

    const hasCerts = (formData.certifications || []).length > 0;
    if (hasCerts) score += 15;
    items.push({ label: 'Verified Certifications', weight: 15, done: hasCerts, categoryId: 'certifications' });

    const hasProjects = (formData.projects || []).length > 0;
    if (hasProjects) score += 15;
    items.push({ label: 'Software Projects', weight: 15, done: hasProjects, categoryId: 'projects' });

    const hasResume = !!(formData.resumeFileName);
    if (hasResume) score += 10;
    items.push({ label: 'Resume Upload', weight: 10, done: hasResume, categoryId: 'resume' });

    const hasSkills = (formData.teachingSkills || []).length > 0;
    if (hasSkills) score += 10;
    items.push({ label: 'Skills & Mentoring', weight: 10, done: hasSkills, categoryId: 'tutoring' });

    let levelLabel = 'Beginner';
    let levelBadge = 'tag-secondary';
    if (score >= 100) {
      levelLabel = 'All-Star 🌟 (100%)';
      levelBadge = 'tag-success';
    } else if (score >= 70) {
      levelLabel = `Advanced 🔥 (${score}%)`;
      levelBadge = 'tag-accent';
    } else if (score >= 40) {
      levelLabel = `Intermediate ⚡ (${score}%)`;
      levelBadge = 'tag-warning';
    } else {
      levelLabel = `Beginner (${score}%)`;
      levelBadge = 'tag-secondary';
    }

    return { score, levelLabel, levelBadge, items };
  };

  const profileStrength = calculateProfileStrength();

  // Categories definition (Naukri style)
  const categories = [
    { id: 'basic', label: 'Personal & Identity', icon: <User size={16} />, badge: 'Core' },
    { id: 'education', label: 'Education & Academics', icon: <GraduationCap size={16} />, count: (formData.educations || []).length },
    { id: 'certifications', label: 'Certificates & Licenses', icon: <Award size={16} />, count: (formData.certifications || []).length, highlight: true },
    { id: 'achievements', label: 'Honors & Hackathons', icon: <Trophy size={16} />, count: (formData.achievements || []).length },
    { id: 'projects', label: 'Projects & Code Repos', icon: <Code size={16} />, count: (formData.projects || []).length },
    { id: 'social', label: 'Social & Coding Links', icon: <Globe size={16} /> },
    { id: 'resume', label: 'Resume & ATS Parser', icon: <FileText size={16} />, badge: '94% Match' },
    { id: 'reach', label: 'Shorts Studio & Insights', icon: <BarChart3 size={16} />, badge: '14.8k Reach', isInsta: true },
    { id: 'tutoring', label: '1:1 Mentoring & Rates', icon: <Coins size={16} /> },
    { id: 'notifications', label: 'Alerts & Reminders', icon: <Bell size={16} /> },
    { id: 'security', label: 'Privacy & Security', icon: <Shield size={16} /> },
  ];

  // Instagram-style Creator & Reels Reach Analytics Data with Privacy Controls
  const [reelAnalyticsData, setReelAnalyticsData] = useState([
    {
      id: 'reel-1',
      title: '3 Tricks to solve Recursion fast ⚡ #Java #Algorithms',
      views: 12450,
      reachMembers: 8420,
      watchTimeHours: 105.4,
      avgWatchPct: 88.5,
      likes: 654,
      comments: 89,
      saves: 210,
      shares: 142,
      nonFollowerReachPct: 68,
      postedDate: 'Aug 24, 2026',
      visibility: 'public',
      allowComments: true,
      allowTips: true,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'reel-2',
      title: 'Spring Boot @Transactional vs Manual Rollback in 60s 🚀 #SpringBoot',
      views: 5820,
      reachMembers: 4190,
      watchTimeHours: 58.2,
      avgWatchPct: 82.0,
      likes: 342,
      comments: 45,
      saves: 130,
      shares: 68,
      nonFollowerReachPct: 54,
      postedDate: 'Aug 20, 2026',
      visibility: 'campus',
      allowComments: true,
      allowTips: true,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'reel-3',
      title: 'Dynamic Programming: 0/1 Knapsack Memory Trick 💡 #DSA',
      views: 3410,
      reachMembers: 2210,
      watchTimeHours: 31.0,
      avgWatchPct: 79.4,
      likes: 184,
      comments: 28,
      saves: 94,
      shares: 41,
      nonFollowerReachPct: 45,
      postedDate: 'Aug 14, 2026',
      visibility: 'public',
      allowComments: true,
      allowTips: true,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  const [showUploadShortModal, setShowUploadShortModal] = useState(false);
  const [newShortForm, setNewShortForm] = useState({
    title: '',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
    visibility: 'public',
    category: 'Algorithms',
    allowComments: true,
    allowTips: true,
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'
  });

  const handleCreateShort = (e) => {
    e.preventDefault();
    if (!newShortForm.title.trim()) return;
    const newEntry = {
      id: `reel-${Date.now()}`,
      title: newShortForm.title.trim(),
      views: 1,
      reachMembers: 1,
      watchTimeHours: 0.1,
      avgWatchPct: 100,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      nonFollowerReachPct: 0,
      postedDate: 'Just now',
      visibility: newShortForm.visibility,
      allowComments: newShortForm.allowComments,
      allowTips: newShortForm.allowTips,
      thumbnail: newShortForm.thumbnail
    };
    setReelAnalyticsData(prev => [newEntry, ...prev]);
    setShowUploadShortModal(false);
    setNewShortForm({
      title: '',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      visibility: 'public',
      category: 'Algorithms',
      allowComments: true,
      allowTips: true,
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'
    });
    setSaveToast("🎬 Concept Short published successfully with your custom privacy settings!");
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleUpdateReelVisibility = (reelId, nextVis) => {
    setReelAnalyticsData(prev => prev.map(r => r.id === reelId ? { ...r, visibility: nextVis } : r));
    setSaveToast(`🔒 Visibility updated to "${nextVis.toUpperCase()}"!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleDeleteReel = (reelId) => {
    setReelAnalyticsData(prev => prev.filter(r => r.id !== reelId));
    setSaveToast("🗑️ Concept Short deleted from creator studio.");
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* TOAST FEEDBACK NOTIFICATION */}
      {saveToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '0.875rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px -3px rgba(16, 185, 129, 0.4)',
          fontWeight: 700,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle size={18} />
          {saveToast}
        </div>
      )}

      {/* 1. DEDICATED SEPARATE PAGE TOP NAVIGATION HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* BRAND LOGO + DEDICATED STUDENT PROFILE BADGE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div 
            onClick={() => setActiveTab('landing')} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
            title="Return to Home Hub"
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="font-serif" style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>SL</span>
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                StudyLoop
              </div>
              <div style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                STUDENT PROFILE
              </div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>

          <button 
            onClick={() => setActiveTab('landing')} 
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.8125rem',
              padding: '0.45rem 1rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <ArrowLeft size={15} /> Back to Home Hub
          </button>
        </div>

        {/* RIGHT: CAMPUS BADGE + THEME TOGGLE + USER CHIP + PRIMARY SAVE BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <span className="tag tag-accent" style={{ fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <GraduationCap size={13} /> {formData.college || 'IIT Madras'}
          </span>

          {setTheme && (
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
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          )}

          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)'
            }}
          >
            <img 
              src={getDefaultAvatarByGender(formData.gender, formData.avatarUrl)} 
              alt="Avatar" 
              style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #10b981', objectFit: 'cover' }} 
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formData.fullName || 'Aarav Sharma'}
              </div>
              <div style={{ fontSize: '0.625rem', color: '#10b981', fontWeight: 700 }}>
                {profileStrength.score === 100 ? '✓ 100% Completed' : `${profileStrength.score}% Completed`}
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleSaveAll()} 
            disabled={isSaving}
            className="btn btn-accent"
            style={{
              fontWeight: 800,
              fontSize: '0.8125rem',
              padding: '0.5rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isSaving ? <RefreshCw size={14} className="spin" /> : <Check size={15} />}
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </header>

      {/* 2. SUBHEADER: STREAMLINED PROFILE STRENGTH PROGRESS BAR */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.625rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            🎯 Profile Strength: <strong style={{ color: profileStrength.score === 100 ? '#10b981' : 'var(--accent-primary)' }}>{profileStrength.score}%</strong>
          </span>
          <span className={`tag ${profileStrength.levelBadge}`} style={{ fontSize: '0.6875rem', fontWeight: 800 }}>
            {profileStrength.levelLabel}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, maxWidth: '420px' }}>
          <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ 
              width: `${profileStrength.score}%`, 
              height: '100%', 
              backgroundColor: profileStrength.score === 100 ? '#10b981' : 'var(--accent-primary)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease' 
            }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: profileStrength.score === 100 ? '#10b981' : 'var(--accent-primary)' }}>
            {profileStrength.score}%
          </span>
        </div>
      </div>

      {/* 3. MAIN 2-COLUMN CATEGORIZED LAYOUT (FULL-WIDTH SCROLLABLE STANDALONE PAGE) */}
      <main style={{ flex: 1, padding: '2rem 2.5rem 4rem 2.5rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* 1. MASTER STUDENT PROFILE HERO CARD */}
        <div className="card-premium" style={{ marginBottom: '2rem', overflow: 'hidden', padding: 0, border: '1px solid var(--border-color)' }}>
          {/* COVER BANNER */}
          <div style={{
            height: '180px',
            background: formData.coverUrl ? `url(${formData.coverUrl}) center/cover no-repeat` : (formData.bannerTheme === 'gradient-emerald' ? 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' : (formData.bannerTheme === 'gradient-sunset' ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' : 'var(--accent-gradient)')),
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '1rem 1.5rem'
          }}>
            <input 
              type="file" 
              ref={coverInputRef} 
              accept="image/*" 
              onChange={handleCoverUpload} 
              style={{ display: 'none' }} 
            />
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="btn btn-secondary" 
              style={{
                fontSize: '0.75rem', 
                padding: '0.375rem 0.875rem', 
                backgroundColor: 'rgba(0,0,0,0.65)', 
                color: '#ffffff', 
                border: '1px solid rgba(255,255,255,0.3)', 
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Camera size={13} /> Edit Cover
            </button>
          </div>

          {/* HERO IDENTITY & ACTIONS ROW */}
          <div style={{ padding: '0 2rem 1.75rem 2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-65px', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1.25rem' }}>
              
              {/* AVATAR WITH GREEN RING, 100% TICK / PERCENTAGE & EDIT BADGE */}
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to choose a photo from your computer or phone"
                  style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    padding: '4px',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: profileStrength.score === 100 
                      ? '0 0 0 3.5px #10b981, 0 0 20px rgba(16, 185, 129, 0.4)' 
                      : 'var(--shadow-lg)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={getDefaultAvatarByGender(formData.gender, formData.avatarUrl)} 
                    alt="Avatar" 
                    onError={(e) => { e.target.src = getDefaultAvatarByGender(formData.gender); }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%', 
                      border: '3.5px solid #10b981', 
                      objectFit: 'cover' 
                    }} 
                  />

                  {/* TOP-RIGHT BADGE: 100% TICK MARK OR PERCENTAGE */}
                  <div
                    title={profileStrength.score === 100 ? "100% Profile Completed" : `${profileStrength.score}% Profile Completed`}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: '3px solid var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      zIndex: 5
                    }}
                  >
                    {profileStrength.score === 100 ? (
                      <Check size={18} style={{ strokeWidth: 3.5 }} />
                    ) : (
                      <span>{profileStrength.score}%</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Photo from Device"
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: '3px solid var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)',
                    zIndex: 6
                  }}
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* QUICK ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleSaveAll()} 
                  disabled={isSaving}
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {isSaving ? <RefreshCw size={14} className="spin" /> : <Check size={15} />}
                  {isSaving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>

            </div>

            {/* NAME, HEADLINE & METADATA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 className="font-serif" style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>
                  {formData.fullName || 'Aarav Sharma'}
                </h1>
                <span className="tag tag-accent" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  ✓ Verified Student
                </span>
                <span className="tag tag-success" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  🎓 Open to 1:1 Peer Mentoring
                </span>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formData.headline || 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <GraduationCap size={15} style={{ color: 'var(--accent-primary)' }} />
                  {formData.college || 'IIT Madras'} • {formData.department || 'Computer Science'} (Year {formData.year || 2})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                  {formData.location || 'Chennai, Tamil Nadu, India'}
                </span>
                <span style={{ color: 'var(--warning-color)', fontWeight: 700 }}>
                  ⭐ 4.9 Tutor Rating (24 Classes Taught)
                </span>
              </div>

              {/* SOCIAL / CODING HANDLES STRIP */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {formData.socialLinks?.github && (
                  <a href={formData.socialLinks.github} target="_blank" rel="noreferrer" className="tag tag-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Github size={13} /> GitHub Profile ↗
                  </a>
                )}
                {formData.socialLinks?.linkedin && (
                  <a href={formData.socialLinks.linkedin} target="_blank" rel="noreferrer" className="tag tag-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Briefcase size={13} /> LinkedIn ↗
                  </a>
                )}
                {formData.socialLinks?.leetcode && (
                  <a href={formData.socialLinks.leetcode} target="_blank" rel="noreferrer" className="tag tag-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Code size={13} /> LeetCode (Knight) ↗
                  </a>
                )}
                {formData.socialLinks?.portfolio && (
                  <a href={formData.socialLinks.portfolio} target="_blank" rel="noreferrer" className="tag tag-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Globe size={13} /> Portfolio Website ↗
                  </a>
                )}
              </div>

              {/* COUNTERS STRIP */}
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem', flexWrap: 'wrap' }}>
                <div><strong>3</strong> <span style={{ color: 'var(--text-secondary)' }}>posts</span></div>
                <div><strong>2</strong> <span style={{ color: 'var(--text-secondary)' }}>shorts</span></div>
                <div><strong>148</strong> <span style={{ color: 'var(--text-secondary)' }}>followers</span></div>
                <div><strong>92</strong> <span style={{ color: 'var(--text-secondary)' }}>following</span></div>
                <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                  ⚡ 680 XP • Lvl 4
                </div>
              </div>

              {/* ABOUT / BIO */}
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {formData.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught'}
                </p>
              </div>

            </div>

            {/* XP PROGRESS BAR */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>Campus Rank: <strong>#1 In Computer Science</strong></span>
                <span>🪙 45 Peer Coins Balance</span>
                <span>Level 4 (40% to Level 5)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. MAIN 2-COLUMN CATEGORIZED LAYOUT (NAUKRI & ENTERPRISE PORTAL STYLE) */}
        <div className="settings-responsive-layout">
        
        {/* LEFT COLUMN: CATEGORIES SIDEBAR */}
        <div className="card-premium" style={{ padding: '1rem', position: 'sticky', top: '1.5rem' }}>
          
          <div style={{ padding: '0.5rem 0.75rem 0.75rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              SETTINGS CATEGORIES
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search settings..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.75rem', color: 'var(--text-primary)', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {categories
              .filter(cat => cat.label.toLowerCase().includes(searchFilter.toLowerCase()))
              .map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.65rem 0.875rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <span style={{ color: isActive ? '#ffffff' : 'var(--accent-primary)' }}>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>

                    {cat.badge && (
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : (cat.isInsta ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-tertiary)'),
                        color: isActive ? '#ffffff' : (cat.isInsta ? '#ec4899' : 'var(--accent-primary)')
                      }}>
                        {cat.badge}
                      </span>
                    )}

                    {cat.count !== undefined && (
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)'
                      }}>
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>



        </div>

        {/* RIGHT COLUMN: ACTIVE CATEGORY CONTENT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ========================================================================= */}
          {/* CATEGORY 1: PERSONAL & BASIC IDENTITY */}
          {/* ========================================================================= */}
          {activeCategory === 'basic' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    👤 Personal Identity & Avatar
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Your primary student identity shown on Campus Leaderboards, Doubt Rooms, and 1:1 Classes.
                  </p>
                </div>
              </div>

              {/* AVATAR & PHOTO MANAGEMENT SUITE */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem', 
                padding: '1.5rem', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.75rem',
                border: '1px solid var(--border-color)'
              }}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }} 
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {/* AVATAR PREVIEW (CLICK TO UPLOAD) */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to choose a photo from your computer or phone"
                    style={{ 
                      position: 'relative', 
                      cursor: 'pointer',
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      padding: '3px',
                      backgroundColor: 'var(--bg-card)',
                      boxShadow: formData.avatarUrl ? '0 0 0 3px #10b981, 0 4px 12px rgba(16, 185, 129, 0.25)' : '0 0 0 2px var(--border-color)'
                    }}
                  >
                    <img 
                      src={getDefaultAvatarByGender(formData.gender, formData.avatarUrl)} 
                      alt="Avatar" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '0', 
                      right: '0', 
                      background: '#10b981', 
                      color: '#fff', 
                      borderRadius: '50%', 
                      padding: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Camera size={15} />
                    </div>
                  </div>

                  {/* UPLOAD ACTIONS & STATUS */}
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Profile Photo & Avatar
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Upload a picture from your computer/phone or choose an official avatar preset.
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.45rem 0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <UploadCloud size={14} /> Upload from Device
                      </button>

                      {formData.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...formData, avatarUrl: '' };
                            setFormData(updated);
                            handleSaveAll(updated);
                          }}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.45rem 0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Trash2 size={13} /> Reset Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRESET AVATARS SELECTOR */}
                <div>
                  <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Choose Avatar Presets (Click to apply)
                  </label>
                  <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                    {AVATAR_PRESETS.map(preset => {
                      const isSelected = preset.isVector 
                        ? (formData.gender === preset.gender && !formData.avatarUrl)
                        : (formData.avatarUrl === preset.url);

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            let updated;
                            if (preset.isVector) {
                              updated = { ...formData, gender: preset.gender, avatarUrl: '' };
                            } else {
                              updated = { ...formData, avatarUrl: preset.url };
                            }
                            setFormData(updated);
                            handleSaveAll(updated);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: isSelected ? '2px solid #10b981' : '1px solid var(--border-color)',
                            background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                            color: isSelected ? '#10b981' : 'var(--text-primary)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {!preset.isVector && (
                            <img 
                              src={preset.url} 
                              alt={preset.label} 
                              style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                          )}
                          <span>{preset.label}</span>
                          {isSelected && <Check size={12} style={{ strokeWidth: 3 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CUSTOM IMAGE URL INPUT */}
                <div>
                  <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', fontWeight: 700 }}>
                    Or Paste Custom Image URL
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="url"
                      placeholder="https://images.unsplash.com/... or public image URL"
                      className="input"
                      style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem', flex: 1 }}
                      value={formData.avatarUrl && !formData.avatarUrl.startsWith('data:') ? formData.avatarUrl : customUrlInput}
                      onChange={e => setCustomUrlInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          const updated = { ...formData, avatarUrl: customUrlInput.trim() };
                          setFormData(updated);
                          handleSaveAll(updated);
                          setCustomUrlInput('');
                        }
                      }}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.45rem 1rem', fontWeight: 700 }}
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              </div>

              {/* FORM FIELDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="label">Full Legal / Display Name *</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.fullName} 
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                    placeholder="e.g. Aarav Sharma" 
                    required 
                  />
                </div>

                <div>
                  <label className="label">Pronouns</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.pronouns} 
                    onChange={e => setFormData({ ...formData, pronouns: e.target.value })} 
                    placeholder="e.g. He/Him, She/Her, They/Them" 
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">Professional Student Headline *</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.headline} 
                    onChange={e => setFormData({ ...formData, headline: e.target.value })} 
                    placeholder="e.g. B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist" 
                    required 
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Tip: Mention your major, university, and core strengths like peer mentoring or hackathon awards.
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">About / Student Bio</label>
                  <textarea 
                    className="input" 
                    style={{ minHeight: '90px' }} 
                    value={formData.bio} 
                    onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                    placeholder="Brief description about your studies, passions, and mentoring background..." 
                  />
                </div>

                <div>
                  <label className="label">College / Institute *</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.college} 
                    onChange={e => setFormData({ ...formData, college: e.target.value })} 
                    placeholder="e.g. IIT Madras, BITS Pilani" 
                    required 
                  />
                </div>

                <div>
                  <label className="label">Department / Branch *</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.department} 
                    onChange={e => setFormData({ ...formData, department: e.target.value })} 
                    placeholder="e.g. Computer Science & Engineering" 
                    required 
                  />
                </div>

                <div>
                  <label className="label">Academic Year</label>
                  <select 
                    className="input" 
                    value={formData.year} 
                    onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
                  >
                    <option value={1}>1st Year (Freshman)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Junior)</option>
                    <option value={4}>4th Year (Senior / Finalist)</option>
                    <option value={5}>Postgraduate / Master's / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="label">City & Country</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })} 
                    placeholder="e.g. Chennai, Tamil Nadu, India" 
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleSaveAll()} 
                  className="btn btn-primary"
                  style={{ fontWeight: 700, padding: '0.6rem 1.5rem' }}
                >
                  Save Personal Details
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 2: EDUCATION & ACADEMICS */}
          {/* ========================================================================= */}
          {activeCategory === 'education' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🎓 Education & Academic Qualifications
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Add college degrees, schools, grade point averages, and extracurricular campus societies.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddEdu(true)} 
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={15} /> Add Education
                </button>
              </div>

              {/* ADD EDUCATION FORM DRAWER */}
              {showAddEdu && (
                <form onSubmit={handleAddEducation} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ➕ Add Degree / School Record
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="label">Institution / School Name *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Indian Institute of Technology (IIT) Madras" 
                        value={newEdu.school} 
                        onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Degree *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Bachelor of Technology - B.Tech" 
                        value={newEdu.degree} 
                        onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Field of Study / Branch</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Computer Science & Engineering" 
                        value={newEdu.field} 
                        onChange={e => setNewEdu({ ...newEdu, field: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Grade / CGPA</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 8.95 / 10.0 CGPA" 
                        value={newEdu.grade} 
                        onChange={e => setNewEdu({ ...newEdu, grade: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Start Year</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 2023" 
                        value={newEdu.startYear} 
                        onChange={e => setNewEdu({ ...newEdu, startYear: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">End Year (or Expected)</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 2027" 
                        value={newEdu.endYear} 
                        onChange={e => setNewEdu({ ...newEdu, endYear: e.target.value })} 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Activities, Clubs & Societies</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Lead at Google Developer Student Club (GDSC), Doubt Mentor" 
                        value={newEdu.activities} 
                        onChange={e => setNewEdu({ ...newEdu, activities: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowAddEdu(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Save Education</button>
                  </div>
                </form>
              )}

              {/* LIST OF CURRENT EDUCATIONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(formData.educations || []).map((edu, idx) => (
                  <div key={edu.id || idx} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                        <GraduationCap size={22} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{edu.school}</h4>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                          {edu.degree} {edu.field ? `• ${edu.field}` : ''}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          📅 {edu.startYear} - {edu.endYear} {edu.grade ? `| Grade: ${edu.grade}` : ''}
                        </div>
                        {edu.activities && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                            🏅 {edu.activities}
                          </div>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteEducation(edu.id)} 
                      className="btn btn-danger" 
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      title="Remove Education"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 3: CERTIFICATIONS & LICENSES */}
          {/* ========================================================================= */}
          {activeCategory === 'certifications' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    📜 Certifications & Verified Credentials
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Showcase credentials from Oracle, AWS, Google, NPTEL, Coursera, HackerRank, and University Honors.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddCert(true)} 
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={15} /> Add Certificate
                </button>
              </div>

              {/* ADD CERTIFICATE DRAWER */}
              {showAddCert && (
                <form onSubmit={handleAddCertificate} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ➕ Add Professional or Academic Certificate
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Certificate / Course Title *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Oracle Certified Associate, Java SE 8 Programmer" 
                        value={newCert.name} 
                        onChange={e => setNewCert({ ...newCert, name: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Issuing Organization *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Oracle, AWS, NPTEL, Google, Coursera" 
                        value={newCert.issuer} 
                        onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Issue Date</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Jan 2026" 
                        value={newCert.issueDate} 
                        onChange={e => setNewCert({ ...newCert, issueDate: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Credential / License ID</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. OCA-JAVA-98742" 
                        value={newCert.credentialId} 
                        onChange={e => setNewCert({ ...newCert, credentialId: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Badge Icon / Emoji</label>
                      <select 
                        className="input" 
                        value={newCert.badgeIcon} 
                        onChange={e => setNewCert({ ...newCert, badgeIcon: e.target.value })}
                      >
                        <option value="☕">☕ Java / Oracle</option>
                        <option value="☁️">☁️ AWS / Cloud</option>
                        <option value="🐍">🐍 Python / NPTEL</option>
                        <option value="⚛️">⚛️ React / Frontend</option>
                        <option value="🛡️">🛡️ Cybersecurity / CompTIA</option>
                        <option value="🤖">🤖 AI / Machine Learning</option>
                        <option value="🏆">🏆 University Gold Medal</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Credential Verification URL</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="https://nptel.ac.in/noc/Ecertificate/... or verification link" 
                        value={newCert.credentialUrl} 
                        onChange={e => setNewCert({ ...newCert, credentialUrl: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowAddCert(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Save Certificate</button>
                  </div>
                </form>
              )}

              {/* LIST OF CERTIFICATES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {(formData.certifications || []).map((cert, idx) => (
                  <div key={cert.id || idx} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '1.75rem', lineHeight: 1, padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                        {cert.badgeIcon || '📜'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cert.name}</h4>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                          {cert.issuer}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          📅 Issued: {cert.issueDate}
                        </div>
                        {cert.credentialId && (
                          <div style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            ID: {cert.credentialId}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      <span className="tag tag-success" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                        ✓ Verified Credential
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>
                            <ExternalLink size={12} /> Verify ↗
                          </a>
                        )}
                        <button onClick={() => handleDeleteCertificate(cert.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 4: HONORS & HACKATHONS */}
          {/* ========================================================================= */}
          {activeCategory === 'achievements' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🏆 Honors, Hackathons & Coding Ranks
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Competitive programming ranks, Smart India Hackathon awards, and college medals.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddAch(true)} 
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={15} /> Add Honor
                </button>
              </div>

              {/* ADD ACHIEVEMENT DRAWER */}
              {showAddAch && (
                <form onSubmit={handleAddAchievement} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ➕ Add Honor or Hackathon Rank
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Award / Honor Title *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Smart India Hackathon (SIH 2025) - National Finalist" 
                        value={newAch.title} 
                        onChange={e => setNewAch({ ...newAch, title: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Organizer / Issuer</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Ministry of Education & Unstop, LeetCode" 
                        value={newAch.issuer} 
                        onChange={e => setNewAch({ ...newAch, issuer: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Year / Date</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Dec 2025" 
                        value={newAch.date} 
                        onChange={e => setNewAch({ ...newAch, date: e.target.value })} 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Brief Description of Achievement</label>
                      <textarea 
                        className="input" 
                        style={{ minHeight: '70px' }} 
                        placeholder="Details about your rank, project impact, or score..." 
                        value={newAch.desc} 
                        onChange={e => setNewAch({ ...newAch, desc: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowAddAch(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Save Honor</button>
                  </div>
                </form>
              )}

              {/* LIST OF ACHIEVEMENTS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(formData.achievements || []).map((ach, idx) => (
                  <div key={ach.id || idx} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning-color)', flexShrink: 0 }}>
                        <Trophy size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{ach.title}</h4>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '0.15rem' }}>
                          {ach.issuer} {ach.date ? `• ${ach.date}` : ''}
                        </div>
                        {ach.desc && (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                            {ach.desc}
                          </div>
                        )}
                      </div>
                    </div>

                    <button onClick={() => handleDeleteAchievement(ach.id)} className="btn btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 5: PROJECTS & CODE REPOSITORIES */}
          {/* ========================================================================= */}
          {activeCategory === 'projects' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    💼 Software Projects & Workspaces
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Showcase real-world full-stack apps, WebRTC workspaces, and GitHub open-source work.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddProj(true)} 
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={15} /> Add Project
                </button>
              </div>

              {/* ADD PROJECT FORM */}
              {showAddProj && (
                <form onSubmit={handleAddProject} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ➕ Add Project Showcase
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Project Title *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. PeerCode - Real-Time Collaborative Workspace" 
                        value={newProj.title} 
                        onChange={e => setNewProj({ ...newProj, title: e.target.value })} 
                        required 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Tech Stack (comma separated)</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. React, WebRTC, Node.js, Spring Boot, Socket.io" 
                        value={newProj.stack} 
                        onChange={e => setNewProj({ ...newProj, stack: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">GitHub Repository URL</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="https://github.com/username/project" 
                        value={newProj.githubUrl} 
                        onChange={e => setNewProj({ ...newProj, githubUrl: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Live Demo URL</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="https://myproject.studyloop.app" 
                        value={newProj.liveUrl} 
                        onChange={e => setNewProj({ ...newProj, liveUrl: e.target.value })} 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Project Description</label>
                      <textarea 
                        className="input" 
                        style={{ minHeight: '70px' }} 
                        placeholder="What problem does this solve? Mention key technical feats..." 
                        value={newProj.desc} 
                        onChange={e => setNewProj({ ...newProj, desc: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowAddProj(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Save Project</button>
                  </div>
                </form>
              )}

              {/* LIST OF PROJECTS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(formData.projects || []).map((p, idx) => (
                  <div key={p.id || idx} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{p.title}</h4>
                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', margin: '0.4rem 0' }}>
                          {(p.stack || []).map((tech, sIdx) => (
                            <span key={sIdx} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                          {p.desc}
                        </p>
                      </div>

                      <button onClick={() => handleDeleteProject(p.id)} className="btn btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
                          <Github size={13} /> Source Code
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-accent" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
                          <ExternalLink size={13} /> Live Application ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 6: SOCIAL & CODING LINKS */}
          {/* ========================================================================= */}
          {activeCategory === 'social' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🔗 Social Handles & Developer Profiles
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Connect your GitHub, LinkedIn, LeetCode Knight, and portfolio for campus peers.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="label">GitHub Profile URL</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.github || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })} 
                    placeholder="https://github.com/aaravsharma" 
                  />
                </div>

                <div>
                  <label className="label">LinkedIn URL</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.linkedin || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })} 
                    placeholder="https://linkedin.com/in/aarav-sharma-cs" 
                  />
                </div>

                <div>
                  <label className="label">LeetCode Profile / Rating</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.leetcode || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, leetcode: e.target.value } })} 
                    placeholder="https://leetcode.com/aarav_codes" 
                  />
                </div>

                <div>
                  <label className="label">Personal Portfolio Website</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.portfolio || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, portfolio: e.target.value } })} 
                    placeholder="https://aaravsharma.dev" 
                  />
                </div>

                <div>
                  <label className="label">Codeforces Handle</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.codeforces || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, codeforces: e.target.value } })} 
                    placeholder="https://codeforces.com/profile/aarav_codes" 
                  />
                </div>

                <div>
                  <label className="label">Twitter / X Handle</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.twitter || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })} 
                    placeholder="https://twitter.com/aarav_codes" 
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleSaveAll()} className="btn btn-primary" style={{ fontWeight: 700, padding: '0.6rem 1.5rem' }}>
                  Save Social Profiles
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 7: RESUME & ATS OPTIMIZER */}
          {/* ========================================================================= */}
          {activeCategory === 'resume' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                📄 PDF Resume & ATS Score Analyzer
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Current uploaded resume and AI-powered ATS scoring for campus placements.
              </p>

              {/* CURRENT RESUME BANNER */}
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={26} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formData.resumeFileName}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Uploaded: {formData.resumeUploadDate} • 2.4 MB PDF Document
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => alert("📥 Downloading verified resume PDF...")} className="btn btn-secondary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    <Download size={14} /> Download
                  </button>
                  <button onClick={() => alert("📤 Resume file upload: Select new PDF file from device")} className="btn btn-accent" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    <UploadCloud size={14} /> Upload New PDF
                  </button>
                </div>
              </div>

              {/* ATS SCORE CARD */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>ATS Placements Match Score</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Analyzed against 5,000+ Software Engineering campus hiring benchmarks</div>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--success-color)' }}>
                    94 / 100
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Keywords & Tech Stack</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>96% Match</div>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Standard Chronological Layout</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success-color)', marginTop: '0.2rem' }}>98% Clean</div>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Action Verbs & Impact Quantification</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--warning-color)', marginTop: '0.2rem' }}>88% Strong</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 8: CREATOR & REELS REACH ANALYTICS (INSTAGRAM & YOUTUBE SHORTS STUDIO) */}
          {/* ========================================================================= */}
          {activeCategory === 'reach' && (
            <div className="card-premium">
              
              {/* INSTAGRAM CREATOR STUDIO STYLE HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                      📊 Creator & Concept Shorts Studio
                    </h2>
                    <span className="tag tag-accent" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#ffffff', fontWeight: 800, fontSize: '0.75rem' }}>
                      ⚡ Studio & Privacy Mode
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                    Publish educational shorts, configure Public / Campus / Private visibility, and inspect live reach analytics.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* UPLOAD NEW SHORT ACTION */}
                  <button 
                    onClick={() => setShowUploadShortModal(true)} 
                    className="btn btn-accent"
                    style={{ fontSize: '0.8125rem', fontWeight: 800, padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <Plus size={15} /> Publish Concept Short (9:16)
                  </button>

                  {/* TIMEFRAME SWITCHER */}
                  <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                    {[
                      { id: '7d', label: 'Last 7 Days' },
                      { id: '30d', label: 'Last 30 Days' },
                      { id: 'all', label: 'All Time' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setReachTimeframe(t.id)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-xs)',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: reachTimeframe === t.id ? 'var(--bg-card)' : 'transparent',
                          color: reachTimeframe === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          boxShadow: reachTimeframe === t.id ? 'var(--shadow-sm)' : 'none'
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* UPLOAD SHORT MODAL DRAWER */}
              {showUploadShortModal && (
                <form onSubmit={handleCreateShort} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🎬 Publish New Concept Short (9:16 Format)
                    </h4>
                    <button type="button" onClick={() => setShowUploadShortModal(false)} className="btn-icon"><X size={16} /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Short Video Title & Tags *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 3 Tricks to solve Recursion Tree problems fast in Java ⚡ #Algorithms #Java"
                        value={newShortForm.title} 
                        onChange={e => setNewShortForm({ ...newShortForm, title: e.target.value })} 
                        required 
                      />
                    </div>

                    <div>
                      <label className="label">Academic Subject / Domain</label>
                      <select 
                        className="input"
                        value={newShortForm.category}
                        onChange={e => setNewShortForm({ ...newShortForm, category: e.target.value })}
                      >
                        <option value="Algorithms">Algorithms & Data Structures</option>
                        <option value="Java">Java & Object Oriented</option>
                        <option value="React">React & Frontend Architecture</option>
                        <option value="System Design">System Design & Backend</option>
                        <option value="AI / ML">AI / Machine Learning</option>
                        <option value="Gate Exam">GATE Exam Tricks</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">🔒 Audience & Privacy Level</label>
                      <select 
                        className="input"
                        value={newShortForm.visibility}
                        onChange={e => setNewShortForm({ ...newShortForm, visibility: e.target.value })}
                      >
                        <option value="public">🌐 Public (All Campus Students & Network)</option>
                        <option value="campus">🏫 Campus Only (Verified IIT Madras peers)</option>
                        <option value="private">🔒 Private / Unlisted Draft</option>
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Video Source URL (MP4 / WebM / CDN)</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="https://assets.mixkit.co/videos/... or media link"
                        value={newShortForm.videoUrl} 
                        onChange={e => setNewShortForm({ ...newShortForm, videoUrl: e.target.value })} 
                        required 
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={newShortForm.allowComments} 
                          onChange={e => setNewShortForm({ ...newShortForm, allowComments: e.target.checked })} 
                        />
                        💬 Allow Peer Comments & Discussion
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={newShortForm.allowTips} 
                          onChange={e => setNewShortForm({ ...newShortForm, allowTips: e.target.checked })} 
                        />
                        🪙 Allow Peer Coin Tips (1 to 50 Coins)
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => setShowUploadShortModal(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-accent" style={{ fontSize: '0.75rem', fontWeight: 800 }}>Publish Short 🚀</button>
                  </div>
                </form>
              )}

              {/* TOP KPI CARDS STRIP */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(0, 198, 255, 0.08) 100%)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL ACCOUNTS REACHED</span>
                    <Eye size={16} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                    14,820
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 700, marginTop: '0.2rem' }}>
                    ↑ +34.2% vs previous period
                  </div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL REEL PLAYS & VIEWS</span>
                    <Play size={16} style={{ color: '#ec4899' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                    38,450
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 700, marginTop: '0.2rem' }}>
                    ↑ +28.6% engagement
                  </div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL WATCH TIME</span>
                    <Clock size={16} style={{ color: 'var(--success-color)' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                    194.6 Hrs
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Avg 83.3% completion rate
                  </div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>CREATOR ENGAGEMENT</span>
                    <Flame size={16} style={{ color: 'var(--warning-color)' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                    12.8%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '0.2rem' }}>
                    ⭐ Top 5% Peer Creator
                  </div>
                </div>
              </div>

              {/* INDIVIDUAL REEL REACH PERFORMANCE (DETAILED BREAKDOWN WITH VISIBILITY TOGGLES) */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tv2 size={18} style={{ color: 'var(--accent-primary)' }} />
                  Your Published Concept Shorts & Privacy Controls
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reelAnalyticsData.map((reel) => (
                    <div key={reel.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                      
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: '280px', flex: 1 }}>
                        <img 
                          src={reel.thumbnail} 
                          alt="Thumbnail" 
                          style={{ width: '60px', height: '90px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)' }} 
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{reel.title}</h4>
                          </div>
                          
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Published {reel.postedDate} • Educational Concept Short (9:16)
                          </div>

                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <span>❤️ {reel.likes} Likes</span>
                            <span>💬 {reel.comments} Comments</span>
                            <span>🔖 {reel.saves} Saves</span>
                            <span>↗️ {reel.shares} Shares</span>
                          </div>
                        </div>
                      </div>

                      {/* STATS MATRIX FOR REEL */}
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MEMBERS SEEN</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
                            {reel.reachMembers.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--success-color)', fontWeight: 700 }}>
                            {reel.nonFollowerReachPct}% Non-Followers
                          </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL PLAYS</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                            {reel.views.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            {reel.watchTimeHours} Hours Total
                          </div>
                        </div>

                        {/* PRIVACY CONTROLS DROPDOWN & DELETE */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: '150px' }}>
                          <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Audience Visibility</label>
                          <select 
                            value={reel.visibility || 'public'} 
                            onChange={e => handleUpdateReelVisibility(reel.id, e.target.value)}
                            className="input"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                          >
                            <option value="public">🌐 Public (All)</option>
                            <option value="campus">🏫 Campus Only</option>
                            <option value="private">🔒 Private Draft</option>
                          </select>

                          <button 
                            onClick={() => handleDeleteReel(reel.id)} 
                            className="btn btn-secondary" 
                            style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: 'var(--danger-color)', border: '1px solid var(--border-color)' }}
                          >
                            <Trash2 size={12} /> Delete Short
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* AUDIENCE DEMOGRAPHICS & REACH DISTRIBUTION */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                
                <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={16} style={{ color: 'var(--accent-primary)' }} />
                    Top Reached Campuses
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { college: 'IIT Madras', pct: 42, count: '6,224 students' },
                      { college: 'IIT Bombay', pct: 24, count: '3,556 students' },
                      { college: 'BITS Pilani', pct: 18, count: '2,667 students' },
                      { college: 'NIT Trichy', pct: 10, count: '1,482 students' },
                      { college: 'Other Universities', pct: 6, count: '891 students' }
                    ].map((c, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.college}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{c.count} ({c.pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${c.pct}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={16} style={{ color: '#ec4899' }} />
                    Discovery & Traffic Sources
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { source: 'Campus Concept Shorts Feed', pct: 62, icon: '📱' },
                      { source: 'Topic & Doubt Room Searches', pct: 23, icon: '🔍' },
                      { source: 'Direct Chat & Peer Shares', pct: 15, icon: '💬' }
                    ].map((s, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.icon} {s.source}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{s.pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${s.pct}%`, height: '100%', backgroundColor: '#ec4899' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 9: PEER TUTORING & PRICING */}
          {/* ========================================================================= */}
          {activeCategory === 'tutoring' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🧑‍🏫 1:1 Peer Mentoring & Pricing Preferences
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Set your availability for live 1:1 video classes, hourly rate, and subjects you teach.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Open to 1:1 Peer Mentoring</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow fellow campus students to book 1:1 study sessions with you</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.isAvailableForMentoring} 
                  onChange={e => {
                    const next = { ...formData, isAvailableForMentoring: e.target.checked };
                    setFormData(next);
                    handleSaveAll(next);
                  }}
                  style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="label">Hourly Rate in Rupee (₹)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>₹</span>
                    <input 
                      type="number" 
                      className="input" 
                      value={formData.hourlyRate} 
                      onChange={e => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Rate in Peer Coins (🪙)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>🪙</span>
                    <input 
                      type="number" 
                      className="input" 
                      value={formData.coinRate} 
                      onChange={e => setFormData({ ...formData, coinRate: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>
              </div>

              {/* TEACHING SKILLS TAGS */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label">Subjects & Skills You Teach</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {(formData.teachingSkills || []).map((skill, sIdx) => (
                    <span key={sIdx} className="tag tag-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}>
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Add subject (e.g. Dynamic Programming, Java, Calculus)" 
                    value={newSkillTag} 
                    onChange={e => setNewSkillTag(e.target.value)} 
                  />
                  <button type="submit" className="btn btn-secondary" style={{ flexShrink: 0 }}>Add Tag</button>
                </form>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleSaveAll()} className="btn btn-primary" style={{ fontWeight: 700, padding: '0.6rem 1.5rem' }}>
                  Save Mentoring Preferences
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 10: NOTIFICATIONS & REMINDERS */}
          {/* ========================================================================= */}
          {activeCategory === 'notifications' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🔔 Notifications & Daily Study Reminders
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Configure real-time sound alerts, peer messages, and streak protection notifications.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'doubtAlerts', title: 'Academic Doubt Room Alerts', desc: 'Instant audio ping when peers join your live doubt room' },
                  { key: 'directMessages', title: 'Direct Peer Messages (DMs)', desc: 'Instant notification on receiving 1:1 chat messages' },
                  { key: 'streakReminders', title: 'Daily Streak Protection Reminders', desc: 'Alert before midnight so you never lose your XP streak' },
                  { key: 'leaderboardUpdates', title: 'Weekly Leaderboard & Medal Recaps', desc: 'Notify when you rank up or receive top mentor badges' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{item.desc}</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.notificationSettings?.[item.key] !== false} 
                      onChange={e => {
                        const next = {
                          ...formData,
                          notificationSettings: {
                            ...formData.notificationSettings,
                            [item.key]: e.target.checked
                          }
                        };
                        setFormData(next);
                        handleSaveAll(next);
                      }}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 11: PRIVACY & ACCOUNT SECURITY */}
          {/* ========================================================================= */}
          {activeCategory === 'security' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🔒 Privacy & Account Security
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Control your profile visibility, two-factor authentication, and connected devices.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div>
                  <label className="label">Profile Visibility</label>
                  <select 
                    className="input"
                    value={formData.privacySettings?.profileVisibility || 'public'}
                    onChange={e => {
                      const next = {
                        ...formData,
                        privacySettings: {
                          ...formData.privacySettings,
                          profileVisibility: e.target.value
                        }
                      };
                      setFormData(next);
                      handleSaveAll(next);
                    }}
                  >
                    <option value="public">🌐 Public (Visible to all students across all universities)</option>
                    <option value="campus_only">🏫 Campus Only (Only verified {formData.college || 'IIT Madras'} students)</option>
                    <option value="private">🔒 Private (Only approved connections)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Require OTP code when signing in on a new device</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.privacySettings?.twoFactorEnabled || false} 
                    onChange={e => {
                      const next = {
                        ...formData,
                        privacySettings: {
                          ...formData.privacySettings,
                          twoFactorEnabled: e.target.checked
                        }
                      };
                      setFormData(next);
                      handleSaveAll(next);
                    }}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                  />
                </div>

                {/* ACTIVE LOGGED-IN SESSION */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    ACTIVE SESSIONS & DEVICES
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                        <Globe size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Chrome on Windows 11 • Chennai, India</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--success-color)', fontWeight: 700 }}>● Active Now (Current Session)</div>
                      </div>
                    </div>
                    <span className="tag tag-success" style={{ fontSize: '0.6875rem' }}>Secured</span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      </main>
    </div>
  );
}

function FeedScreen({ setActiveTab, setActiveRoomId, token }) {
  return <div style={{ padding: '2rem' }}>Feed Screen</div>;
}

function ContactSupportScreen({ token, setActiveTab, setActiveChatId, setChatPeer, profile }) {
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Support ticket submitted to academic safety team!");
    setSubject('');
    setDesc('');
  };

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Contact & Help Desk</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Submit a question or reach out to the campus operations safety team.</p>

      <form onSubmit={handleSubmit} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label className="label">Subject / Issue Category</label>
          <input type="text" className="input" placeholder="e.g. Question about Doubt Room credits" value={subject} onChange={e => setSubject(e.target.value)} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" style={{ minHeight: '120px' }} placeholder="Please provide details..." value={desc} onChange={e => setDesc(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem' }}>
          Submit Ticket 🚀
        </button>
      </form>
    </div>
  );
}
