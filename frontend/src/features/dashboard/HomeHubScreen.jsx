import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code,
  Code2,
  Copy,
  Check,
  HelpCircle,
  Image,
  MessageSquare,
  Plus,
  Search,
  Send,
  Share2,
  Shield,
  ThumbsUp,
  Trophy,
  Users,
  Video,
  X,
  Zap,
  Flame,
  Globe,
  MapPin,
  ChevronDown,
  Lock,
  Briefcase,
  Bell,
  Sun,
  Moon,
  Bookmark,
  Play,
  Film,
  Filter,
  Heart,
  GraduationCap,
  ArrowRight,
  Clock,
  Star,
  Award,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG } from '../../constants/avatars';

// ─── Study Activity Heatmap ───────────────────────────────────────────────────
function ActivityHeatmap() {
  const cells = [4,2,0,3,1,0,0,2,4,3,0,2,1,0,0,3,4,2,1,0,2,3,1,0,4,2,3,1,0,2,3,1,0,4,2];
  const colors = ['var(--bg-tertiary)', '#bfdbfe', '#93c5fd', '#3b82f6', '#1d4ed8'];
  return (
    <div>
      <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>35-Day Study Log</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {cells.map((v, i) => (
          <div key={i} title={`${v} sessions`} style={{ height: '9px', borderRadius: '2px', backgroundColor: colors[v], transition: 'transform 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.4)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Trust Score Ring ─────────────────────────────────────────────────────────
function TrustRing({ score = 72 }) {
  const r = 26, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width="62" height="62" viewBox="0 0 62 62">
        <circle cx="31" cy="31" r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth="5" />
        <circle cx="31" cy="31" r={r} fill="none" stroke="var(--accent-primary)" strokeWidth="5"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          transform="rotate(-90 31 31)" style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="31" y="36" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--text-primary)">{score}</text>
      </svg>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)' }}>Scholar Trust</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {score >= 90 ? '✅ Scholar Verified' : score >= 70 ? '🔵 Campus Verified' : '⚪ Building...'}
        </div>
      </div>
    </div>
  );
}

// ─── LinkedIn-style Post Composer Modal ────────────────────────────────────────
function PostModal({ profile, onClose, onPost, initialCategory = 'doubt', initialCodeMode = false }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [codeMode, setCodeMode] = useState(initialCodeMode);
  const [codeText, setCodeText] = useState('');
  const [audience, setAudience] = useState('campus');

  const categories = [
    { id: 'doubt', label: '❓ Code Doubt', color: '#7C3AED' },
    { id: 'exam', label: '📚 Exam Notes', color: '#D97706' },
    { id: 'placement', label: '💼 Placement OA', color: '#059669' },
    { id: 'project', label: '🚀 Project Share', color: '#0066FF' }
  ];

  const audiences = [
    { id: 'campus', label: '🏛️ My Campus', icon: <MapPin size={12} /> },
    { id: 'all', label: '🌐 All Students', icon: <Globe size={12} /> },
    { id: 'mentors', label: '🎓 Mentors Only', icon: <Lock size={12} /> }
  ];

  const handlePost = () => {
    if (!text.trim()) return;
    onPost({ text, category, codeText: codeMode ? codeText : null, audience });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '16px',
          width: '100%', maxWidth: '580px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Post to Campus Network
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '16px 20px' }}>
          {/* Author row */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
            <img
              src={getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl)}
              alt=""
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {profile?.fullName || 'Student'}
              </div>
              {/* Audience dropdown */}
              <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
                {audiences.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAudience(a.id)}
                    style={{
                      padding: '2px 8px', borderRadius: '4px',
                      border: audience === a.id ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: audience === a.id ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      color: audience === a.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                      fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '3px'
                    }}
                  >
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main text area */}
          <textarea
            autoFocus
            rows={5}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share a technical doubt, post exam notes, or describe a placement experience that could help your campus peers..."
            style={{
              width: '100%', border: 'none', outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)', fontSize: '0.925rem',
              lineHeight: 1.6, resize: 'none',
              fontFamily: 'inherit'
            }}
          />

          {/* Code snippet toggle */}
          {codeMode && (
            <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ padding: '6px 12px', backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'monospace' }}>// Code Snippet</span>
                <button onClick={() => setCodeMode(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.7rem' }}>Remove ×</button>
              </div>
              <textarea
                rows={4}
                value={codeText}
                onChange={e => setCodeText(e.target.value)}
                placeholder="// paste your code here..."
                style={{
                  width: '100%', border: 'none', outline: 'none', padding: '10px 12px',
                  backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                  fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', resize: 'none'
                }}
              />
            </div>
          )}

          {/* Category chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '4px 11px', borderRadius: '999px',
                  border: category === cat.id ? `1.5px solid ${cat.color}` : '1px solid var(--border-color)',
                  backgroundColor: category === cat.id ? `${cat.color}14` : 'var(--bg-tertiary)',
                  color: category === cat.id ? cat.color : 'var(--text-muted)',
                  fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setCodeMode(!codeMode)}
              title="Add code snippet"
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: codeMode ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: codeMode ? 'var(--accent-light)' : 'transparent',
                color: codeMode ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Code2 size={16} />
            </button>
            <button
              title="Add image (coming soon)"
              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}
            >
              <Image size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: text.length > 800 ? '#ef4444' : 'var(--text-muted)' }}>
              {text.length}/1000
            </span>
            <button
              onClick={handlePost}
              disabled={!text.trim()}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: text.trim() ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: text.trim() ? '#fff' : 'var(--text-muted)',
                fontSize: '0.845rem', fontWeight: 800, cursor: text.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (text.trim()) e.currentTarget.style.background = 'var(--accent-dark)'; }}
              onMouseLeave={e => { if (text.trim()) e.currentTarget.style.background = 'var(--accent-primary)'; }}
            >
              <Send size={14} /> Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main HomeHubScreen ───────────────────────────────────────────────────────
export function HomeHubScreen({ 
  setActiveTab, 
  setActiveRoomId, 
  onOpenBookingModal, 
  openPublicProfile,
  onOpenPublicProfile,
  startWebRtcCall,
  bookedSessions,
  onLaunchClassroom,
  theme, 
  setTheme 
}) {
  const { profile } = useAuth();
  const toast = useToast();

  const rightSidebarRef = useRef(null);
  const feedColumnRef = useRef(null);

  useEffect(() => {
    if (rightSidebarRef.current) {
      rightSidebarRef.current.scrollTop = 0;
    }
    if (feedColumnRef.current) {
      feedColumnRef.current.scrollTop = 0;
    }

    const handleOpenModal = () => setShowPostModal(true);
    window.addEventListener('studyloop-open-post-modal', handleOpenModal);
    return () => window.removeEventListener('studyloop-open-post-modal', handleOpenModal);
  }, []);

  const [activeFeedFilter, setActiveFeedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [composerCategory, setComposerCategory] = useState('doubt');
  const [composerCodeMode, setComposerCodeMode] = useState(false);

  // Filters & Sorting state
  const [campusFilter, setCampusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'upvotes', 'answers'
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [academicPosts, setAcademicPosts] = useState([
    {
      id: 'reel-1',
      author: 'Ananya Guha',
      college: 'BITS Pilani',
      department: 'Cloud & Systems',
      avatar: FEMALE_AVATAR_SVG,
      verified: true,
      category: 'reels',
      title: '🎬 60-Sec Concept Short: Kubernetes Pod Lifecycle & Eviction Explained',
      content: 'Quick 60-second animated concept short on Kubernetes Pod Scheduling, Resource limits vs requests, and node pressure eviction. Watch full concept explanation below! 👇',
      videoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&auto=format&fit=crop&q=80',
      isReel: true,
      reelDuration: '0:58',
      codeSnippet: 'kubectl describe pod <pod-name> | grep -E "State|Node"',
      tags: ['#ConceptShorts', '#Kubernetes', '#DevOps60s'],
      upvotes: 142, isUpvoted: true, answers: 28, timeAgo: '22m', hasLiveRoom: false
    },
    {
      id: 'reel-2',
      author: 'Vikram Joshi',
      college: 'IIT Madras',
      department: 'Computer Science',
      avatar: MALE_AVATAR_SVG,
      verified: true,
      category: 'reels',
      title: '🎬 45-Sec Short: Dijkstra vs Bellman-Ford in 45 Seconds',
      content: 'Why Dijkstra fails with negative weight cycles and why Bellman-Ford relaxes edges V-1 times. Visual animated walkthrough in 45s.',
      videoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&auto=format&fit=crop&q=80',
      isReel: true,
      reelDuration: '0:45',
      codeSnippet: null,
      tags: ['#AlgorithmsShort', '#GraphTheory', '#Placements'],
      upvotes: 98, isUpvoted: false, answers: 14, timeAgo: '1h', hasLiveRoom: true
    },
    {
      id: 'p1',
      author: 'Rohan Deshmukh',
      college: 'IIT Bombay',
      department: 'Computer Science',
      avatar: MALE_AVATAR_SVG,
      verified: true,
      category: 'doubt',
      title: '0/1 Knapsack 2D DP Memoization — State Transition Bug',
      content: 'Getting an out-of-bounds error on recursive top-down memoization when capacity W exceeds array limits. Has anyone refactored this to a 1D space-optimized table?',
      codeSnippet: 'dp[i][w] = Math.max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]);',
      tags: ['#DynamicProgramming', '#DSA', '#LeetCodeMedium'],
      upvotes: 34, isUpvoted: false, answers: 8, timeAgo: '15m', hasLiveRoom: true
    },
    {
      id: 'p2',
      author: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'Data Science & AI',
      avatar: FEMALE_AVATAR_SVG,
      verified: true,
      category: 'placement',
      title: 'Google & Microsoft SDE-1 OA Graph Traversal Cheatsheet',
      content: "Compiled top 15 Graph BFS/DFS patterns from recent campus placement rounds. Includes cycle detection in directed graphs and Kahn's algorithm for topological sort.",
      codeSnippet: null,
      tags: ['#Placements', '#GraphAlgorithms', '#InterviewOA'],
      upvotes: 89, isUpvoted: true, answers: 24, timeAgo: '1h', hasLiveRoom: false
    },
    {
      id: 'p3',
      author: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'Electrical & CS',
      avatar: MALE_AVATAR_SVG,
      verified: true,
      category: 'exam',
      title: 'K-Map Prime Implicants — 4-variable Grouping Mid-sem Prep',
      content: "Stuck on 4-variable K-Map with essential prime implicants and don't-care conditions. Looking for a 10-minute peer walkthrough before tomorrow's exam.",
      codeSnippet: null,
      tags: ['#DigitalLogic', '#SemesterExam', '#Hardware'],
      upvotes: 19, isUpvoted: false, answers: 5, timeAgo: '3h', hasLiveRoom: true
    }
  ]);

  const topMentors = [
    { id: 'm1', fullName: 'Bhavna Patel', college: 'IIT Madras', subject: 'DSA & Algorithms', specialty: 'DP, Graphs', rating: 4.98, sessions: 42, avatar: FEMALE_AVATAR_SVG, available: true },
    { id: 'm2', fullName: 'Rohan Deshmukh', college: 'IIT Bombay', subject: 'Competitive Prog.', specialty: 'Segment Trees, CP', rating: 4.92, sessions: 38, avatar: MALE_AVATAR_SVG, available: false },
    { id: 'm3', fullName: 'Divya Nambiar', college: 'NIT Trichy', subject: 'DBMS & OS', specialty: 'Indexing, Scheduling', rating: 4.95, sessions: 29, avatar: FEMALE_AVATAR_SVG, available: true }
  ];

  const handleUpvote = (id) => {
    setAcademicPosts(p => p.map(post => post.id === id
      ? { ...post, isUpvoted: !post.isUpvoted, upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1 }
      : post
    ));
  };

  const handlePost = ({ text, category, codeText }) => {
    const np = {
      id: `p-${Date.now()}`,
      author: profile?.fullName || 'You',
      college: profile?.college || 'IIT Madras',
      department: profile?.department || 'Computer Science',
      avatar: getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl),
      verified: true,
      category,
      title: text.slice(0, 65) + (text.length > 65 ? '...' : ''),
      content: text,
      codeSnippet: codeText || null,
      tags: ['#CampusPost'],
      upvotes: 1, isUpvoted: true, answers: 0,
      timeAgo: 'Just now', hasLiveRoom: true
    };
    setAcademicPosts(prev => [np, ...prev]);
    toast.success('Posted to campus network! 🎉');
  };

  const filteredPosts = academicPosts.filter(p => {
    const matchCategory = activeFeedFilter === 'all' || p.category === activeFeedFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      p.author.toLowerCase().includes(q);
    const matchCampus = campusFilter === 'all' || (p.college && p.college.toLowerCase().includes(campusFilter.toLowerCase()));
    const matchBranch = branchFilter === 'all' || (p.department && p.department.toLowerCase().includes('computer'));
    return matchCategory && matchSearch && matchCampus && matchBranch;
  }).sort((a, b) => {
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
    if (sortBy === 'answers') return b.answers - a.answers;
    return 0; // default order in array is recent
  });

  // Quick Doubt Modal State
  const [showQuickDoubtModal, setShowQuickDoubtModal] = useState(false);
  const [quickDoubtQuestion, setQuickDoubtQuestion] = useState('');
  const [quickDoubtSubject, setQuickDoubtSubject] = useState('Java');
  const [quickDoubtLanguage, setQuickDoubtLanguage] = useState('Telugu');

  // Quick Skill Swap Modal State
  const [showSkillSwapModal, setShowSkillSwapModal] = useState(false);
  const [swapLearn, setSwapLearn] = useState('Java & Spring Boot');
  const [swapTeach, setSwapTeach] = useState('React & Frontend');

  const handleCreateQuickDoubt = (e) => {
    e.preventDefault();
    if (!quickDoubtQuestion.trim()) return;
    const roomId = `doubt-${quickDoubtSubject.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    setShowQuickDoubtModal(false);
    toast.success(`🚀 Live Doubt Room "${quickDoubtQuestion.slice(0, 30)}..." launched!`);
    setActiveRoomId?.(roomId);
    setActiveTab('doubts');
    if (startWebRtcCall) {
      startWebRtcCall(null, roomId, quickDoubtQuestion, quickDoubtSubject);
    }
  };

  const handleProposeSkillSwap = (e) => {
    e.preventDefault();
    setShowSkillSwapModal(false);
    toast.success(`🔄 Skill Swap proposal posted to campus: You teach ${swapTeach} ⮀ Learn ${swapLearn}!`);
    setActiveTab('sessions');
  };

  const liveDoubtRooms = [
    {
      id: 'room-1',
      title: 'Java Multithreading Synchronized Locks issue in Producer-Consumer',
      subject: 'Java',
      language: 'Telugu / English',
      creator: 'Aarav Sharma',
      college: 'IIT Madras',
      participants: 3,
      time: 'Live Now'
    },
    {
      id: 'room-2',
      title: 'React useEffect Infinite re-render cycle with state objects',
      subject: 'React',
      language: 'Telugu / English',
      creator: 'Bhavna Patel',
      college: 'IIT Madras',
      participants: 5,
      time: 'Live Now'
    },
    {
      id: 'room-3',
      title: 'Dynamic Programming 0/1 Knapsack memoization table walkthrough',
      subject: 'Algorithms',
      language: 'English / Hindi',
      creator: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      participants: 4,
      time: 'Live Now'
    }
  ];

  return (
    <div className="studyloop-page-container">

      {/* ── QUICK DOUBT MODAL ── */}
      {showQuickDoubtModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '520px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.3rem', margin: 0 }}>❓ Ask Academic Doubt</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  Instantly creates a dedicated live room with audio/video, code editor & chat.
                </p>
              </div>
              <button onClick={() => setShowQuickDoubtModal(false)} className="btn-icon">✕</button>
            </div>
            <form onSubmit={handleCreateQuickDoubt} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Your Question / Concept</label>
                <textarea 
                  className="input" 
                  rows={3} 
                  placeholder="e.g. Why does my recursive DFS throw StackOverflowError on cyclic graph?" 
                  value={quickDoubtQuestion} 
                  onChange={e => setQuickDoubtQuestion(e.target.value)} 
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Subject Tag</label>
                  <select className="input" value={quickDoubtSubject} onChange={e => setQuickDoubtSubject(e.target.value)}>
                    <option value="Java">Java</option>
                    <option value="React">React</option>
                    <option value="Algorithms">Algorithms & DSA</option>
                    <option value="Databases">DBMS & SQL</option>
                    <option value="Calculus">Mathematics</option>
                    <option value="AI / ML">Python & AI</option>
                  </select>
                </div>
                <div>
                  <label className="label">Preferred Language</label>
                  <select className="input" value={quickDoubtLanguage} onChange={e => setQuickDoubtLanguage(e.target.value)}>
                    <option value="Telugu">🗣️ తెలుగు (Telugu)</option>
                    <option value="English">🗣️ English</option>
                    <option value="Hindi">🗣️ हिंदी (Hindi)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontWeight: 800 }}>
                Launch Live Doubt Room 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── QUICK SKILL SWAP MODAL ── */}
      {showSkillSwapModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '520px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.3rem', margin: 0 }}>🔄 Peer Skill Barter / Swap</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
                  100% Free peer knowledge exchange — zero money.
                </p>
              </div>
              <button onClick={() => setShowSkillSwapModal(false)} className="btn-icon">✕</button>
            </div>
            <form onSubmit={handleProposeSkillSwap} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">1. What Subject Do You Want to Learn?</label>
                <input 
                  type="text" 
                  className="input" 
                  value={swapLearn} 
                  onChange={e => setSwapLearn(e.target.value)} 
                  placeholder="e.g. Java OOP, Dynamic Programming, SQL Normalization" 
                  required 
                />
              </div>
              <div>
                <label className="label">2. What Subject Can You Teach in Exchange?</label>
                <input 
                  type="text" 
                  className="input" 
                  value={swapTeach} 
                  onChange={e => setSwapTeach(e.target.value)} 
                  placeholder="e.g. React & Redux, Python Fast-API, Engineering Physics" 
                  required 
                />
              </div>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#059669', lineHeight: 1.4 }}>
                💡 <strong>Mutual Learning:</strong> Once a campus peer accepts your swap, a free 1:1 Live Classroom will be scheduled for both of you!
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontWeight: 800, background: '#10b981', borderColor: '#10b981' }}>
                Post Skill Swap Proposal 🤝
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── 1. HERO COMMAND CENTER HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(124, 58, 237, 0.06) 100%)',
        border: '1px solid rgba(0, 102, 255, 0.18)',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '8px' }}>
            🎓 {profile?.college || 'IIT Madras'} Campus Hub
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Welcome back, {profile?.fullName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '580px' }}>
            Get instant academic clarity in your language. Solve doubts in dedicated live rooms, connect with verified peer mentors, or swap skills for free.
          </p>
        </div>

        {/* Quick Scholar Metrics */}
        <div style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--bg-secondary)', padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <TrustRing score={profile?.trustScore || 82} />
          <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
          <ActivityHeatmap />
        </div>
      </div>

      {/* ── 2. FOUR PRIMARY ACTION TILES (LinkedIn / Unstop Command Grid) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        
        {/* Action 1: Ask a Doubt */}
        <div 
          onClick={() => setShowQuickDoubtModal(true)}
          className="studyloop-card interactive-hover"
          style={{ padding: '18px 20px', cursor: 'pointer', margin: 0, borderLeft: '4px solid #ef4444' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={20} />
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '2px 7px', borderRadius: '999px' }}>Instant</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Ask Academic Doubt
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Open dedicated live meeting room with code editor & whiteboard.
          </div>
        </div>

        {/* Action 2: Find a Mentor */}
        <div 
          onClick={() => setActiveTab('discover')}
          className="studyloop-card interactive-hover"
          style={{ padding: '18px 20px', cursor: 'pointer', margin: 0, borderLeft: '4px solid #0066FF' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={20} />
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-light)', padding: '2px 7px', borderRadius: '999px' }}>Telugu & More</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Find Campus Mentors
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Browse verified seniors by subject, rating, and spoken languages.
          </div>
        </div>

        {/* Action 3: Peer Skill Swap */}
        <div 
          onClick={() => setShowSkillSwapModal(true)}
          className="studyloop-card interactive-hover"
          style={{ padding: '18px 20px', cursor: 'pointer', margin: 0, borderLeft: '4px solid #10b981' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={20} />
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 7px', borderRadius: '999px' }}>100% Free</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Peer Skill Swap
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            "You teach me X, I teach you Y" — zero money barter exchange.
          </div>
        </div>

        {/* Action 4: Become a Mentor */}
        <div 
          onClick={() => setActiveTab('discover')}
          className="studyloop-card interactive-hover"
          style={{ padding: '18px 20px', cursor: 'pointer', margin: 0, borderLeft: '4px solid #7C3AED' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.1)', padding: '2px 7px', borderRadius: '999px' }}>Earn / Badges</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Become a Mentor
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Teach juniors, earn ₹30-₹100/session or mentor for badge honors.
          </div>
        </div>

      </div>

      {/* ── 3. BALANCED 2-COLUMN GRID (Flush Top Baseline) ── */}
      <div className="studyloop-hub-grid">

        {/* ── LEFT / MAIN DASHBOARD COLUMN: ZERO DUPLICATE FEED ── */}
        <div ref={feedColumnRef} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {/* ── SECTION 1: 🔴 LIVE ACADEMIC DOUBT ROOMS (RIGHT NOW) ── */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    display: 'inline-block',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  LIVE NOW
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Active Doubt Rooms
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600
                }}>
                  ({liveDoubtRooms.length} rooms solving right now)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowQuickDoubtModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <PlusCircle size={14} /> Ask Doubt
                </button>
                <button
                  onClick={() => setActiveTab('doubts')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  All Rooms <ArrowRight size={13} />
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.45 }}>
              Dedicated spaces with voice, video, shared code runner, and Telugu/English peer explanations. Jump in to get unblocked or help a peer!
            </p>

            {/* Live Doubt Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {liveDoubtRooms.map(room => (
                <div
                  key={room.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    flexWrap: 'wrap',
                    transition: 'border-color 0.2s ease, transform 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent-primary)',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {room.subject}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        color: '#10b981',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        🗣️ {room.language}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Users size={12} /> {room.participants} peers in room
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                      marginBottom: '4px'
                    }}>
                      {room.title}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Started by <strong style={{ color: 'var(--text-secondary)' }}>{room.creator}</strong> • {room.college}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setActiveRoomId?.(room.id);
                        setActiveTab('doubts');
                        if (startWebRtcCall) {
                          startWebRtcCall(null, room.id, room.title, room.subject);
                        }
                        toast.success(`Joining Live Doubt Room: ${room.subject}`);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '999px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                      <Video size={14} /> Join Meeting 🚀
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 2: 📅 MY SCHEDULED CLASSES & PEER SKILL SWAPS ── */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 102, 255, 0.1)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    My Scheduled Classes & Skill Swaps
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Upcoming 1:1 sessions, barter swaps, and demo calls
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('sessions')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Manage Classes <ArrowRight size={13} />
              </button>
            </div>

            {bookedSessions && bookedSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {bookedSessions.map((session, idx) => (
                  <div
                    key={session.id || idx}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: session.sessionType === 'swap' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 102, 255, 0.15)',
                          color: session.sessionType === 'swap' ? '#10b981' : 'var(--accent-primary)',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {session.sessionType === 'swap' ? '🔄 Peer Skill Swap (Free)' : `💳 Paid 1:1 (₹${session.price || '50'})`}
                        </span>
                        <span style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Clock size={12} /> {session.date || 'Today'} • {session.time || '6:00 PM'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {session.subject || 'Java & Data Structures'} with {session.mentorName || 'Campus Peer Mentor'}
                      </div>

                      {session.sessionType === 'swap' && (
                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                          🔄 Barter: You teach {session.swapTeachSubject || 'React'} ⮀ Peer teaches {session.subject}
                        </div>
                      )}

                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        🗣️ Languages: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{session.languages || 'Telugu, English'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onLaunchClassroom) {
                          onLaunchClassroom(session);
                        } else {
                          setActiveRoomId?.(session.id || 'session-room-1');
                          setActiveTab('sessions');
                        }
                        toast.success(`Entering Classroom for ${session.subject || 'Class'}`);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--accent-primary)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Video size={14} /> Enter Classroom 🚀
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '24px 16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px dashed var(--border-color)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🎓</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  No Upcoming Classes Right Now
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px auto', lineHeight: 1.45 }}>
                  Book a 1:1 paid class with a 10-minute demo, or propose a 100% free Peer Skill Swap to learn together!
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveTab('discover')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--accent-primary)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🔍 Find Mentors
                  </button>
                  <button
                    onClick={() => setShowSkillSwapModal(true)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Propose Skill Swap
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION 3: 🌟 TOP CAMPUS PEER MENTORS (WITH LANGUAGE PILLS) ── */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Award size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Featured Campus Peer Mentors
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Top rated scholars available in Telugu, English & regional languages
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('discover')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                All Mentors <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {[
                {
                  id: 'm1',
                  fullName: 'Bhavna Patel',
                  college: 'IIT Madras',
                  subject: 'DSA & Dynamic Programming',
                  rating: 4.98,
                  sessions: 42,
                  languages: ['తెలుగు (Telugu)', 'English'],
                  rate: '₹50/session',
                  comfort: ['🎥 Video', '🎙️ Audio'],
                  avatar: FEMALE_AVATAR_SVG
                },
                {
                  id: 'm2',
                  fullName: 'Rohan Deshmukh',
                  college: 'IIT Bombay',
                  subject: 'Java, Spring Boot & CP',
                  rating: 4.92,
                  sessions: 38,
                  languages: ['English', 'हिंदी (Hindi)'],
                  rate: '₹40/session (or Swap)',
                  comfort: ['🎥 Video', '💬 Chat'],
                  avatar: MALE_AVATAR_SVG
                },
                {
                  id: 'm3',
                  fullName: 'Chaitanya Reddy',
                  college: 'BITS Pilani',
                  subject: 'React, Node.js & DBMS',
                  rating: 4.95,
                  sessions: 31,
                  languages: ['తెలుగు (Telugu)', 'English'],
                  rate: '₹50/session',
                  comfort: ['🎥 Video', '🎙️ Audio'],
                  avatar: MALE_AVATAR_SVG
                }
              ].map(mentor => (
                <div
                  key={mentor.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <img
                        src={mentor.avatar}
                        alt={mentor.fullName}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {mentor.fullName}
                          </span>
                          <CheckCircle2 size={13} style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {mentor.college}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        color: '#d97706',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        <Star size={11} fill="#d97706" /> {mentor.rating}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {mentor.subject}
                    </div>

                    {/* Language badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                      {mentor.languages.map((l, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '999px',
                            backgroundColor: l.includes('Telugu') ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                            color: l.includes('Telugu') ? '#10b981' : 'var(--text-secondary)'
                          }}
                        >
                          🗣️ {l}
                        </span>
                      ))}
                    </div>

                    {/* Comfort mode badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {mentor.comfort.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {mentor.rate}
                    </span>
                    <button
                      onClick={() => {
                        if (onOpenBookingModal) {
                          onOpenBookingModal(mentor);
                        } else {
                          setActiveTab('discover');
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'var(--accent-primary)',
                        color: '#ffffff',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Book / Swap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: STUDYLOOP CAMPUS SPOTLIGHT PANEL ── */}
        <div className="studyloop-right-column" ref={rightSidebarRef}>

          {/* StudyLoop Campus Challenges & Events */}
          <div className="studyloop-featured-panel">
            <div style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={16} style={{ color: '#f59e0b' }} /> Campus Spotlight
              </span>
              <span 
                style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 700 }}
                onClick={() => setActiveTab('leaderboard')}
              >
                View Ranks
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { 
                  title: 'Inter-IIT AlgoFest 2026', 
                  action: 'Join Contest', 
                  subtitle: '₹25K Pool · DSA & CP', 
                  icon: '⚡',
                  onClick: () => {
                    setActiveTab('leaderboard');
                    toast.success('Joining Inter-IIT AlgoFest 2026 Contest Arena! ⚡');
                  }
                },
                { 
                  title: 'Google & Microsoft OA Simulation', 
                  action: 'Register', 
                  subtitle: 'This Saturday, 8:00 PM', 
                  icon: '🎯',
                  onClick: () => {
                    setActiveFeedFilter('placement');
                    toast.success('Viewing Google & Microsoft OA placement simulations & sheets 🎯');
                  }
                },
                { 
                  title: 'OS & Distributed Systems Sprint', 
                  action: 'Campus Room', 
                  subtitle: 'Peer Workshop · 4 Days', 
                  icon: '💻',
                  onClick: () => {
                    setActiveRoomId?.('room-os-sprint');
                    setActiveTab('doubts');
                    toast.success('Entering OS & Distributed Systems live Campus Room 💻');
                  }
                },
                { 
                  title: 'Semester Exam Question Bank', 
                  action: 'Access PDF', 
                  subtitle: 'Verified Branch Rankers', 
                  icon: '📚',
                  onClick: () => {
                    setActiveFeedFilter('exam');
                    toast.success('Accessing verified Semester Exam Question Bank PDFs 📚');
                  }
                },
                { 
                  title: 'Campus Open Source Hack', 
                  action: 'Find Team', 
                  subtitle: 'Build with Seniors', 
                  icon: '🚀',
                  onClick: () => {
                    setActiveTab('connections');
                    toast.success('Exploring campus open source project teams & seniors 🚀');
                  }
                }
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  padding: '6px 0',
                  borderBottom: idx < 4 ? '1px solid var(--border-color)' : 'none',
                  transition: 'transform 0.12s'
                }}
                onClick={item.onClick}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  {/* Event Icon Box */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}>
                    {item.icon}
                  </div>

                  {/* Event Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                      marginBottom: '2px'
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{item.action}</span> · {item.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Campus Mentors Card */}
          <div className="studyloop-featured-panel">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={15} style={{ color: 'var(--accent-primary)' }} /> Top Campus Mentors
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 7px', borderRadius: '999px' }}>
                Free Trial
              </span>
            </div>

            {topMentors.map(m => (
              <div 
                key={m.id} 
                style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                onClick={() => {
                  const handleProfile = openPublicProfile || onOpenPublicProfile;
                  if (handleProfile) handleProfile(m);
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={m.avatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', borderRadius: '50%', backgroundColor: m.available ? '#10b981' : '#94a3b8', border: '1.5px solid var(--bg-secondary)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.fullName}</span>
                      <span title="Scholar Verified" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0066FF', flexShrink: 0 }}>
                        <CheckCircle2 size={8} color="#fff" fill="#fff" />
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.college} · ⭐ {m.rating}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <strong>{m.subject}</strong> — {m.specialty}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenBookingModal) {
                        onOpenBookingModal(m);
                      } else {
                        setActiveTab('sessions');
                      }
                      toast.success(`Opening 1:1 demo session booking with ${m.fullName}!`);
                    }}
                    style={{ flex: 1, padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--accent-dark)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor='var(--accent-primary)'}
                  >
                    Book Demo
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('connections');
                      toast.success(`Connecting with ${m.fullName}!`);
                    }}
                    style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
        {/* end right column */}

      </div>
      {/* end hub grid */}

      {/* ── MODAL 1: QUICK DOUBT & INSTANT LIVE ROOM ── */}
      {showQuickDoubtModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>❓</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Ask Academic Doubt & Launch Room
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Instantly creates a dedicated space with code runner & WebRTC
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowQuickDoubtModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateQuickDoubt}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  What is your question or coding bug? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={quickDoubtQuestion}
                  onChange={e => setQuickDoubtQuestion(e.target.value)}
                  placeholder="e.g. In Java 0/1 knapsack, my memoization table gives index out of bounds error during recursion..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Subject / Domain
                  </label>
                  <select
                    value={quickDoubtSubject}
                    onChange={e => setQuickDoubtSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="DSA & Algorithms">DSA & Algorithms</option>
                    <option value="DBMS">DBMS & SQL</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Web Development">Web Development (React)</option>
                    <option value="Aptitude & Core">Aptitude & Core</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Preferred Language
                  </label>
                  <select
                    value={quickDoubtLanguage}
                    onChange={e => setQuickDoubtLanguage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="Telugu">🗣️ Telugu (తెలుగు)</option>
                    <option value="English">🗣️ English</option>
                    <option value="Telugu / English">🗣️ Telugu / English</option>
                    <option value="Hindi">🗣️ Hindi (हिंदी)</option>
                    <option value="Tamil">🗣️ Tamil (தமிழ்)</option>
                  </select>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(0, 102, 255, 0.08)',
                border: '1px solid rgba(0, 102, 255, 0.2)',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.45
              }}>
                🔴 <strong>Dedicated Space:</strong> Submitting will instantly open a live WebRTC audio/video call room with a shared live compiler so you and peers can fix bugs together.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowQuickDoubtModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  🚀 Launch Live Doubt Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: PEER SKILL SWAP (100% FREE BARTER) ── */}
      {showSkillSwapModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🔄</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Peer Skill Swap (100% Free Barter)
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                    ₹0 Cost — Exchange skills peer-to-peer!
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSkillSwapModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProposeSkillSwap}>
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.45
              }}>
                <strong>How Skill Swap Works:</strong> "You teach me Java, I teach you React". Once a peer accepts, a 1:1 video session is placed on both your schedules with zero fees!
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  What do you want to learn? *
                </label>
                <input
                  type="text"
                  required
                  value={swapLearn}
                  onChange={e => setSwapLearn(e.target.value)}
                  placeholder="e.g. Java, Spring Boot, DSA"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  What can you teach in return? *
                </label>
                <input
                  type="text"
                  required
                  value={swapTeach}
                  onChange={e => setSwapTeach(e.target.value)}
                  placeholder="e.g. React & Next.js, SQL, Machine Learning"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={() => setShowSkillSwapModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  🔄 Propose Skill Swap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
