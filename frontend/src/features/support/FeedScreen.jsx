import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FeedAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen, Heart, MessageCircle, Send, Share2, TrendingUp, Users, Zap,
  Image, Video, FileText, Bookmark, MoreHorizontal, Globe, ThumbsUp,
  Award, Flame, CheckCircle, ChevronDown, Bell, RefreshCw, Code, X,
  Sparkles, Check, Paperclip, Terminal
} from 'lucide-react';
import { MALE_AVATAR_SVG, FEMALE_AVATAR_SVG } from '../../constants/avatars';
import { useAuth } from '../../context/AuthContext';

const STUDENT_PROBLEM_CATEGORIES = [
  { id: 'doubt', label: '🐛 Code Bug & Doubt', icon: '🐛', tag: '#Debugging', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', placeholder: 'Explain your bug, stack trace, or compiler error so peers can help debug...' },
  { id: 'exam', label: '📚 Exam Prep & Notes', icon: '📚', tag: '#ExamPrep', color: '#0066FF', bg: 'rgba(0,102,255,0.1)', placeholder: 'Share formula cheat sheets, semester notes, or high-yield topic summaries...' },
  { id: 'interview', label: '💼 Placement & Interview', icon: '💼', tag: '#Placements', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', placeholder: 'Share OA coding patterns, interview rounds, or campus hiring experiences...' },
  { id: 'project', label: '🚀 Project & SIH Collab', icon: '🚀', tag: '#Collab', color: '#10b981', bg: 'rgba(16,185,129,0.1)', placeholder: 'Pitch your project, required tech stack (React, Spring, ML), and seek teammates...' },
  { id: 'campus', label: '📢 Campus Advice & Tips', icon: '📢', tag: '#CampusLife', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', placeholder: 'Share elective reviews, hostel hacks, lab viva tips, or campus survival advice...' }
];

const ACTIVITY_TYPES = {
  doubt:       { icon: '❓', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  label: 'Doubt Solved' },
  session:     { icon: '🎓', color: '#0066FF', bg: 'rgba(0,102,255,0.1)',   label: 'Session' },
  achievement: { icon: '🏆', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', label: 'Achievement' },
  connection:  { icon: '🤝', color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Connection' },
  mentoring:   { icon: '🧑‍🏫', color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Peer Mentoring' },
  post:        { icon: '📝', color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  label: 'Post' },
};

const POST_IMAGES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&auto=format&fit=crop&q=80',
];

const SEED_FEED = [
  {
    id: 'f-1', type: 'post', user: 'Bhavna Patel', avatar: FEMALE_AVATAR_SVG,
    college: 'IIT Madras', headline: 'CS Final Year • Java & ML Mentor',
    text: '🚀 Just completed my 50th 1:1 peer mentoring session on StudyLoop! The journey from explaining basics to watching students crack DSA interviews is incredibly rewarding.\n\nTop 3 things I learned:\n✅ Start with WHY before HOW\n✅ Visual aids > verbal explanations for 90% of students\n✅ Patience compounds like interest 💡\n\nAny CS student struggling with Data Structures — DM me, first session free!',
    image: POST_IMAGES[0],
    xp: 50, time: '2m ago', likes: 142, liked: false, comments: 18, shares: 7, saved: false, tags: ['#JavaDSA', '#PeerMentoring']
  },
  {
    id: 'f-2', type: 'achievement', user: 'Chaitanya Reddy', avatar: MALE_AVATAR_SVG,
    college: 'BITS Pilani', headline: 'EEE 3rd Year • Circuit & ML Tutor',
    text: '🏆 Unlocked "Campus Legend" badge — 50 doubts solved this month!\n\nStarted as a confused 1st year who couldn\'t debug a simple for-loop. Now solving recursive tree traversals live in 15 minutes.\n\nStudyLoop changed my perspective — teaching is the best way to learn. Every doubt I solve makes my own concepts 10x stronger.\n\n#Grateful #StudyLoop #CampusLegend',
    image: null,
    xp: 100, time: '8m ago', likes: 89, liked: false, comments: 24, shares: 12, saved: false, tags: ['#Achievement', '#Growth']
  },
  {
    id: 'f-3', type: 'session', user: 'Kavya Subramanian', avatar: FEMALE_AVATAR_SVG,
    college: 'IIT Delhi', headline: 'B.Tech CSE • React & WebRTC Expert',
    text: 'Just uploaded my concept cheat sheet: "React Hooks — useEffect cleanup explained with real examples" 🔥\n\nCovers:\n📌 Why cleanup functions matter\n📌 Memory leak prevention\n📌 API call cancellation pattern\n📌 Event listener cleanup\n\nAlready at 1.4K views! Drop a ❤️ if it helped your project. Available for 1:1 React sessions on StudyLoop.',
    image: POST_IMAGES[1],
    xp: 30, time: '22m ago', likes: 234, liked: true, comments: 41, shares: 28, saved: true, tags: ['#React', '#WebDev']
  },
  {
    id: 'f-4', type: 'doubt', user: 'Rohan Deshmukh', avatar: MALE_AVATAR_SVG,
    college: 'IIT Bombay', headline: 'Systems & DSA • CP Mentor',
    text: 'Answered a brilliant question today: "Why does std::vector amortize to O(1) push_back but individual inserts can be O(n)?"\n\nThe key insight — doubling capacity each time (1 → 2 → 4 → 8...) means total work is always 2n across n insertions. Amortized magic! 📊\n\nVisually explained this with a capacity graph in our session. Student went from confused to writing their own custom allocator in 45 minutes! 🚀',
    image: null,
    xp: 35, time: '45m ago', likes: 67, liked: false, comments: 9, shares: 15, saved: false, tags: ['#CPP', '#DSA', '#SystemsDesign']
  },
  {
    id: 'f-5', type: 'post', user: 'Divya Nambiar', avatar: FEMALE_AVATAR_SVG,
    college: 'NIT Trichy', headline: 'Data Science • ML & SQL Expert',
    text: 'My journey from 0 to 100+ students on StudyLoop in 3 months 📈\n\nMonth 1: 0 sessions, felt like no one would trust a 2nd year student to teach\nMonth 2: First 10 sessions — Probability & Statistics for engineering students\nMonth 3: Crossed 100 sessions, ₹18,000 in peer earnings, 4.9⭐ rating\n\nWhat changed? Consistency. Showing up every day. One session at a time.\n\nIf you\'re waiting for the "right moment" to start teaching — this is it.',
    image: POST_IMAGES[4],
    xp: 80, time: '1h ago', likes: 312, liked: false, comments: 56, shares: 43, saved: false, tags: ['#Motivation', '#StudyLoop', '#ML']
  },
  {
    id: 'f-6', type: 'reel', user: 'Ananya Guha', avatar: FEMALE_AVATAR_SVG,
    college: 'BITS Pilani', headline: 'DevOps & Cloud • Kubernetes Mentor',
    text: 'New 60-second Concept Short is LIVE: "Kubernetes Pod Scheduling in 60 Seconds" ☸️\n\nExplains:\n🔷 Node affinity vs taints/tolerations\n🔷 Resource requests vs limits\n🔷 Priority classes\n\nThis took me 3 hours to compress into 60 seconds but it was worth it — 2.8K views in 24 hours! 🔥',
    image: POST_IMAGES[2],
    xp: 45, time: '2h ago', likes: 198, liked: false, comments: 33, shares: 21, saved: true, tags: ['#Kubernetes', '#DevOps', '#CloudNative']
  },
];

const LIVE_FEED_TEMPLATES = [
  { type: 'doubt', user: 'Priya Menon', avatar: FEMALE_AVATAR_SVG, college: 'NIT Warangal', headline: 'OS & Networks Tutor', texts: ['Just explained OS Virtual Memory paging — earned 25 XP! 🎯', 'Solved "Why does Quicksort have O(n²) worst case?" in 15 mins!'] },
  { type: 'session', user: 'Arjun Kumar', avatar: MALE_AVATAR_SVG, college: 'IIT Kharagpur', headline: 'Backend & DSA Mentor', texts: ['Finished a Spring Boot REST API design session — escrow released ✅', 'Completed a DSA session on Segment Trees — student finally understood! 🌳'] },
  { type: 'achievement', user: 'Nandini Rao', avatar: FEMALE_AVATAR_SVG, college: 'VIT Vellore', headline: 'Math & Stats Tutor', texts: ['Unlocked "Streak Champion" — 7-day continuous teaching streak! 🔥', 'Reached Level 4! 500 XP milestone achieved today 🏆'] },
  { type: 'reel', user: 'Siddharth N.', avatar: MALE_AVATAR_SVG, college: 'IIIT Bangalore', headline: 'Algorithms Expert', texts: ['New Concept Short: "Binary Search in 45 seconds" — already 800+ views!', 'Posted "Graph BFS vs DFS — visual comparison" — trending 🔥'] },
  { type: 'connection', user: 'Meera S.', avatar: FEMALE_AVATAR_SVG, college: 'BITS Goa', headline: 'AI/ML Researcher', texts: ['Connected with Arjun for collaborative ML project sessions 🤝', 'New study partner found in Connections — starting DSA prep together!'] },
];

const TRENDING = [
  { tag: '#JavaDSA', posts: '1.2k posts', hot: true },
  { tag: '#ReactHooks', posts: '890 posts', hot: true },
  { tag: '#SpringBoot', posts: '741 posts', hot: false },
  { tag: '#MLBeginner', posts: '634 posts', hot: false },
  { tag: '#DBMS', posts: '512 posts', hot: false },
  { tag: '#PlacementPrep', posts: '2.4k posts', hot: true },
];

const SUGGESTED_PEERS = [
  { name: 'Sneha Roy', college: 'IIIT Hyderabad', skill: 'AI/ML', avatar: FEMALE_AVATAR_SVG, rating: 4.8 },
  { name: 'Vikram Joshi', college: 'IIT Madras', skill: 'DSA', avatar: MALE_AVATAR_SVG, rating: 4.9 },
  { name: 'Pooja Iyer', college: 'NIT Trichy', skill: 'Web Dev', avatar: FEMALE_AVATAR_SVG, rating: 4.7 },
];

// Animated FeedCard component
function FeedCard({ item, index, onLike, onSave, toast }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState([]);
  const atype = ACTIVITY_TYPES[item.type] || ACTIVITY_TYPES.post;
  const isNew = item.id.startsWith('f-live-') && index === 0;

  const handleComment = () => {
    if (!commentText.trim()) return;
    setLocalComments(prev => [...prev, { author: 'You', text: commentText.trim(), time: 'Just now' }]);
    setCommentText('');
    toast.success('💬 Comment posted!');
  };

  return (
    <div
      className="feed-card-enter"
      style={{
        animationDelay: `${index * 0.06}s`,
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        border: isNew ? `1.5px solid ${atype.color}` : '1px solid var(--border-color)',
        boxShadow: isNew ? `0 4px 24px ${atype.bg}` : 'var(--shadow-sm)',
        overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.2s',
        cursor: 'default'
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = isNew ? `0 4px 24px ${atype.bg}` : 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* CARD HEADER */}
      <div style={{ padding: '1rem 1.25rem 0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={item.avatar}
            alt={item.user}
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
          />
          <div style={{
            position: 'absolute', bottom: '-2px', right: '-2px',
            width: '20px', height: '20px', borderRadius: '50%',
            backgroundColor: atype.color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.6rem',
            border: '2px solid var(--bg-card)'
          }}>
            {atype.icon}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                >
                  {item.user}
                </span>
                {isNew && (
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 800, backgroundColor: atype.color,
                    color: '#fff', borderRadius: '4px', padding: '0.1rem 0.4rem'
                  }}>NEW</span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.05rem' }}>
                {item.headline || item.college}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>{item.college}</span>
                <span style={{ color: 'var(--border-color)' }}>·</span>
                <Globe size={11} />
                <span>{item.time}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
              {item.problemCategory && (
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '99px'
                }}>
                  {item.problemCategory}
                </span>
              )}
              <span style={{
                fontSize: '0.6875rem', color: atype.color, fontWeight: 700,
                backgroundColor: atype.bg, padding: '0.2rem 0.6rem',
                borderRadius: '99px'
              }}>
                {atype.label}
              </span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', borderRadius: '6px' }}
                onClick={() => toast.info('🔧 More options')}>
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '0 1.25rem 0.875rem' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
          {item.text}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
            {item.tags.map(tag => (
              <span key={tag} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', cursor: 'pointer' }}
                onClick={() => toast.info(`🔍 Searching ${tag}`)}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CODE SNIPPET IF ATTACHED */}
      {item.codeSnippet && (
        <div style={{ margin: '0.25rem 1.25rem 0.875rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1e1e2e',
            color: '#cdd6f4',
            padding: '0.4rem 0.85rem',
            borderRadius: '10px 10px 0 0',
            fontSize: '0.725rem',
            fontFamily: 'monospace',
            fontWeight: 700
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Terminal size={13} style={{ color: '#a6e3a1' }} /> {item.codeLanguage || 'Code'}
            </span>
            <span style={{ color: '#6c7086', fontSize: '0.65rem' }}>StudyLoop Snippet</span>
          </div>
          <pre style={{
            backgroundColor: '#181825',
            color: '#cdd6f4',
            padding: '0.875rem 1rem',
            margin: 0,
            borderRadius: '0 0 10px 10px',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            overflowX: 'auto',
            maxHeight: '240px',
            border: '1px solid #313244',
            borderTop: 'none'
          }}>
            <code>{item.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* IMAGE */}
      {item.image && (
        <div style={{ margin: '0 0 0 0' }}>
          <img
            src={item.image}
            alt="Post"
            style={{ width: '100%', maxHeight: '340px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
            onClick={() => toast.info('🖼️ Full image view')}
            onError={e => e.target.style.display = 'none'}
          />
        </div>
      )}

      {/* REACTION COUNTS */}
      <div style={{ padding: '0.5rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ display: 'flex', gap: '-4px' }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', border: '1.5px solid var(--bg-card)' }}>❤️</span>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', border: '1.5px solid var(--bg-card)', marginLeft: '-4px' }}>👍</span>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', border: '1.5px solid var(--bg-card)', marginLeft: '-4px' }}>⚡</span>
          </span>
          <span style={{ marginLeft: '0.25rem' }}>{item.likes} reactions</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {item.comments > 0 && <span>{item.comments + localComments.length} comments</span>}
          {item.shares > 0 && <span>{item.shares} reposts</span>}
        </div>
      </div>

      {/* ACTION ROW */}
      <div style={{ padding: '0.25rem 0.75rem', display: 'flex', gap: '0.25rem' }}>
        {[
          { icon: <Heart size={17} fill={item.liked ? '#ef4444' : 'none'} />, label: item.liked ? 'Liked' : 'Like', color: item.liked ? '#ef4444' : 'var(--text-secondary)', onClick: () => onLike(item.id) },
          { icon: <MessageCircle size={17} />, label: 'Comment', color: 'var(--text-secondary)', onClick: () => setShowComments(p => !p) },
          { icon: <Share2 size={17} />, label: 'Repost', color: 'var(--text-secondary)', onClick: () => toast.info('🔁 Reposted to your campus network!') },
          { icon: <Bookmark size={17} fill={item.saved ? 'var(--accent-primary)' : 'none'} />, label: 'Save', color: item.saved ? 'var(--accent-primary)' : 'var(--text-secondary)', onClick: () => onSave(item.id) },
        ].map(action => (
          <button key={action.label} onClick={action.onClick} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.8rem', fontWeight: 600, color: action.color,
            padding: '0.5rem 0.25rem', borderRadius: '8px',
            transition: 'background 0.15s, color 0.15s'
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            {action.icon}
            <span style={{ fontSize: '0.75rem' }}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* XP BADGE */}
      <div style={{ padding: '0.25rem 1.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          fontSize: '0.7rem', fontWeight: 800,
          backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)',
          borderRadius: '6px', padding: '0.15rem 0.5rem'
        }}>
          ⚡ +{item.xp} XP
        </span>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div style={{ borderTop: '1px solid var(--border-color)', padding: '0.875rem 1.25rem', backgroundColor: 'var(--bg-tertiary)' }}>
          {localComments.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <img src={MALE_AVATAR_SVG} alt="You" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '0.5rem 0.875rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>You</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{c.text}</div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
              placeholder="Add a comment..."
              style={{
                flex: 1, border: '1.5px solid var(--border-color)', borderRadius: '99px',
                padding: '0.45rem 1rem', fontSize: '0.8rem', backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
            <button onClick={handleComment} disabled={!commentText.trim()} style={{
              backgroundColor: commentText.trim() ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: commentText.trim() ? '#fff' : 'var(--text-muted)',
              border: 'none', borderRadius: '50%', width: '34px', height: '34px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FeedScreen({ setActiveTab, setActiveRoomId, token }) {
  const { profile } = useAuth();
  const toast = useToast();
  const [feedItems, setFeedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('studyloop_custom_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...SEED_FEED];
        }
      }
    } catch(e) {}
    return SEED_FEED;
  });
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [newItemFlash, setNewItemFlash] = useState(false);
  const [postDraft, setPostDraft] = useState('');
  const [postExpanded, setPostExpanded] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('doubt');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('Java');
  const [attachedImage, setAttachedImage] = useState(null);
  const postImageInputRef = useRef(null);
  const liveIdx = useRef(0);
  const topRef = useRef(null);

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAttachedImage(ev.target?.result);
        toast.info("📷 Image attached to post");
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchBackendFeed = useCallback(async () => {
    try {
      setLoading(true);
      const res = await FeedAPI.getFeed(token);
      if (res && Array.isArray(res) && res.length > 0) {
        const mapped = res.map((dto, idx) => {
          const isDoubt = dto.type === 'DOUBT_ROOM';
          const c = dto.creator || {};
          return {
            id: dto.id || `f-api-${idx}`,
            type: isDoubt ? 'doubt' : 'reel',
            user: c.fullName || (isDoubt ? 'Campus Student' : 'Peer Tutor'),
            headline: c.college || 'StudyLoop Network',
            avatar: c.avatarUrl || (c.gender === 'female' ? FEMALE_AVATAR_SVG : MALE_AVATAR_SVG),
            college: c.college || dto.college || 'StudyLoop Network',
            text: dto.description || dto.title || 'Shared a new learning update.',
            image: null,
            xp: dto.score || 25,
            time: dto.createdAt ? new Date(dto.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
            likes: dto.score || 5,
            liked: false,
            comments: 0,
            shares: 0,
            saved: false,
            tags: [],
          };
        });
        setFeedItems(prev => [...mapped, ...prev]);
      }
    } catch (err) {
      console.warn('Backend feed offline, using local seed feed', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchBackendFeed(); }, [fetchBackendFeed]);

  // Live feed ticker every 14s
  useEffect(() => {
    const interval = setInterval(() => {
      const tpl = LIVE_FEED_TEMPLATES[liveIdx.current % LIVE_FEED_TEMPLATES.length];
      const text = tpl.texts[Math.floor(Math.random() * tpl.texts.length)];
      liveIdx.current++;
      const newItem = {
        id: `f-live-${Date.now()}`,
        type: tpl.type,
        user: tpl.user,
        headline: tpl.headline,
        avatar: tpl.avatar,
        college: tpl.college,
        text,
        image: Math.random() > 0.7 ? POST_IMAGES[Math.floor(Math.random() * POST_IMAGES.length)] : null,
        xp: Math.floor(Math.random() * 80) + 10,
        time: 'Just now',
        likes: Math.floor(Math.random() * 20),
        liked: false,
        comments: Math.floor(Math.random() * 5),
        shares: Math.floor(Math.random() * 3),
        saved: false,
        tags: [],
      };
      setFeedItems(prev => [newItem, ...prev.slice(0, 29)]);
      setNewItemFlash(true);
      setTimeout(() => setNewItemFlash(false), 2500);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = (id) => {
    setFeedItems(prev => prev.map(f =>
      f.id === id ? { ...f, liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1 } : f
    ));
  };

  const handleSave = (id) => {
    setFeedItems(prev => prev.map(f =>
      f.id === id ? { ...f, saved: !f.saved } : f
    ));
    const item = feedItems.find(f => f.id === id);
    if (item) {
      toast.success(item.saved ? '🔖 Removed from saved' : '🔖 Saved to your collection!');
    }
  };

  const handleQuickPost = () => {
    if (!postDraft.trim() && !codeSnippet.trim()) {
      toast.error("Please enter your question, notes, or code to post!");
      return;
    }
    const catObj = STUDENT_PROBLEM_CATEGORIES.find(c => c.id === selectedCategory) || STUDENT_PROBLEM_CATEGORIES[0];
    const newPost = {
      id: `f-post-${Date.now()}`,
      type: selectedCategory === 'doubt' ? 'doubt' : 'post',
      problemCategory: catObj.label,
      user: profile?.fullName || 'Aarav Sharma',
      headline: profile?.headline || `${profile?.college || 'IIT Madras'} • Student`,
      avatar: profile?.avatarUrl || (profile?.gender === 'female' ? FEMALE_AVATAR_SVG : MALE_AVATAR_SVG),
      college: profile?.college || 'IIT Madras',
      text: postDraft.trim(),
      codeSnippet: showCodeEditor && codeSnippet.trim() ? codeSnippet.trim() : null,
      codeLanguage: showCodeEditor && codeSnippet.trim() ? codeLanguage : null,
      image: attachedImage || null,
      xp: 25,
      time: 'Just now',
      likes: 1,
      liked: false,
      comments: 0,
      shares: 0,
      saved: false,
      tags: selectedTag ? [selectedTag, catObj.tag] : [catObj.tag],
    };

    // Persistent storage for custom posts
    try {
      const existing = localStorage.getItem('studyloop_custom_posts');
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [newPost, ...parsed];
      localStorage.setItem('studyloop_custom_posts', JSON.stringify(updated.slice(0, 50)));
    } catch (e) {}

    setFeedItems(prev => [newPost, ...prev]);
    setPostDraft('');
    setCodeSnippet('');
    setShowCodeEditor(false);
    setAttachedImage(null);
    setPostExpanded(false);
    setSelectedTag(null);
    toast.success('🚀 Published to Campus Stream! Peers notified.');
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filtered = feedItems.filter(f => {
    if (filterType !== 'all' && f.type !== filterType) return false;
    return true;
  });

  return (
    <div className="studyloop-page-container" ref={topRef}>

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={22} style={{ color: 'var(--accent-primary)' }} />
            Campus Stream
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem', margin: '0.2rem 0 0' }}>
            Live updates from your peer network • doubts, sessions, achievements
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 700,
            color: newItemFlash ? 'var(--success-color)' : 'var(--text-muted)', transition: 'color 0.5s' }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: newItemFlash ? 'var(--success-color)' : '#ef4444',
              display: 'inline-block', animation: 'pulse-dot 1.5s infinite'
            }} />
            {newItemFlash ? 'New post!' : 'Live'}
          </div>
          <button onClick={() => { fetchBackendFeed(); toast.info('🔄 Feed refreshed!'); }}
            style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.375rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* MAIN 2-COLUMN GRID */}
      <div className="studyloop-feed-grid">

        {/* LEFT: FEED COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* CREATE POST WIDGET */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: postExpanded ? '1.25rem' : '1rem 1.25rem',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: postExpanded ? 'flex-start' : 'center' }}>
              <input 
                type="file" 
                ref={postImageInputRef} 
                accept="image/*" 
                onChange={handleImagePick} 
                style={{ display: 'none' }} 
              />
              <img
                src={profile?.avatarUrl || (profile?.gender === 'female' ? FEMALE_AVATAR_SVG : MALE_AVATAR_SVG)}
                alt="You"
                style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--border-color)', flexShrink: 0 }}
              />
              {!postExpanded ? (
                <button
                  onClick={() => setPostExpanded(true)}
                  style={{
                    flex: 1, textAlign: 'left', border: '1.5px solid var(--border-color)', borderRadius: '99px',
                    padding: '0.65rem 1.15rem', fontSize: '0.875rem', color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-tertiary)', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'border-color 0.2s, background 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
                >
                  Ask a doubt, share exam notes, or post a code snippet...
                </button>
              ) : (
                <div style={{ flex: 1 }}>
                  {/* REAL-LIFE STUDENT PROBLEM CATEGORY CHIPS */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                      Select Post Category
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {STUDENT_PROBLEM_CATEGORIES.map(cat => {
                        const isSel = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '99px',
                              border: isSel ? `1.5px solid ${cat.color}` : '1px solid var(--border-color)',
                              backgroundColor: isSel ? cat.bg : 'var(--bg-tertiary)',
                              color: isSel ? cat.color : 'var(--text-secondary)',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* POST CONTENT TEXTAREA */}
                  <textarea
                    value={postDraft}
                    onChange={e => setPostDraft(e.target.value)}
                    placeholder={(STUDENT_PROBLEM_CATEGORIES.find(c => c.id === selectedCategory) || STUDENT_PROBLEM_CATEGORIES[0]).placeholder}
                    autoFocus
                    rows={4}
                    style={{
                      width: '100%', border: '1.5px solid var(--border-color)', borderRadius: '12px',
                      padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-tertiary)', resize: 'none', outline: 'none',
                      fontFamily: 'inherit', lineHeight: 1.6, transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                  />

                  {/* ATTACHED IMAGE PREVIEW */}
                  {attachedImage && (
                    <div style={{ position: 'relative', marginTop: '0.5rem', display: 'inline-block' }}>
                      <img 
                        src={attachedImage} 
                        alt="Attached preview" 
                        style={{ maxHeight: '180px', borderRadius: '10px', border: '1px solid var(--border-color)' }} 
                      />
                      <button
                        type="button"
                        onClick={() => setAttachedImage(null)}
                        style={{
                          position: 'absolute', top: '6px', right: '6px',
                          backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff',
                          border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* CODE SNIPPET ATTACHMENT ACCORDION */}
                  {showCodeEditor && (
                    <div style={{ marginTop: '0.65rem', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#1e1e2e',
                        color: '#cdd6f4',
                        padding: '0.4rem 0.75rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          <Terminal size={14} style={{ color: '#a6e3a1' }} /> Code Snippet
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            value={codeLanguage}
                            onChange={e => setCodeLanguage(e.target.value)}
                            style={{
                              backgroundColor: '#313244',
                              color: '#cdd6f4',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              outline: 'none'
                            }}
                          >
                            <option value="Java">Java</option>
                            <option value="Python">Python</option>
                            <option value="C++">C++</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="SQL">SQL</option>
                            <option value="HTML/CSS">HTML/CSS</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => { setShowCodeEditor(false); setCodeSnippet(''); }}
                            style={{ background: 'none', border: 'none', color: '#6c7086', cursor: 'pointer' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={codeSnippet}
                        onChange={e => setCodeSnippet(e.target.value)}
                        placeholder="// Paste your buggy method, class, or SQL query here..."
                        rows={5}
                        style={{
                          width: '100%',
                          backgroundColor: '#181825',
                          color: '#a6e3a1',
                          border: 'none',
                          padding: '0.75rem 1rem',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          lineHeight: 1.5,
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  )}

                  {/* Tag chips */}
                  <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.625rem', flexWrap: 'wrap' }}>
                    {['#JavaDSA', '#ReactHooks', '#SpringBoot', '#MLBeginner', '#DBMS', '#PlacementPrep'].map(tag => (
                      <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)} style={{
                        padding: '0.2rem 0.625rem', borderRadius: '99px', border: '1.5px solid',
                        borderColor: selectedTag === tag ? 'var(--accent-primary)' : 'var(--border-color)',
                        backgroundColor: selectedTag === tag ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                        color: selectedTag === tag ? 'var(--accent-primary)' : 'var(--text-muted)',
                        fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
                      }}>
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* ACTION BUTTONS & SUBMIT */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button 
                        type="button" 
                        onClick={() => postImageInputRef.current?.click()} 
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          background: attachedImage ? 'var(--accent-light)' : 'none', 
                          border: 'none', cursor: 'pointer',
                          fontSize: '0.75rem', fontWeight: 700, 
                          color: attachedImage ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          padding: '0.35rem 0.6rem', borderRadius: '8px', transition: 'all 0.15s'
                        }}
                      >
                        <Image size={16} style={{ color: '#10b981' }} /> {attachedImage ? 'Photo Attached' : 'Photo'}
                      </button>

                      <button 
                        type="button" 
                        onClick={() => setShowCodeEditor(prev => !prev)} 
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          background: showCodeEditor ? 'var(--accent-light)' : 'none', 
                          border: 'none', cursor: 'pointer',
                          fontSize: '0.75rem', fontWeight: 700, 
                          color: showCodeEditor ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          padding: '0.35rem 0.6rem', borderRadius: '8px', transition: 'all 0.15s'
                        }}
                      >
                        <Code size={16} style={{ color: '#6366f1' }} /> Code Snippet
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        type="button"
                        onClick={() => { 
                          setPostExpanded(false); 
                          setPostDraft(''); 
                          setCodeSnippet('');
                          setShowCodeEditor(false);
                          setAttachedImage(null);
                          setSelectedTag(null); 
                        }} 
                        style={{
                          padding: '0.45rem 0.875rem', borderRadius: '99px', border: '1px solid var(--border-color)',
                          background: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button"
                        onClick={handleQuickPost} 
                        disabled={!postDraft.trim() && !codeSnippet.trim()} 
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.375rem',
                          backgroundColor: (postDraft.trim() || codeSnippet.trim()) ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                          color: (postDraft.trim() || codeSnippet.trim()) ? '#fff' : 'var(--text-muted)',
                          border: 'none', borderRadius: '99px',
                          padding: '0.45rem 1.25rem', fontSize: '0.8rem', fontWeight: 700,
                          cursor: (postDraft.trim() || codeSnippet.trim()) ? 'pointer' : 'default', transition: 'all 0.2s'
                        }}
                      >
                        <Send size={14} /> Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions (only when collapsed) */}
            {!postExpanded && (
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                {[
                  { icon: <Image size={17} style={{ color: '#10b981' }} />, label: 'Photo', onClick: () => setPostExpanded(true) },
                  { icon: <Users size={17} style={{ color: '#3b82f6' }} />, label: 'Network', onClick: () => setActiveTab('connections') },
                  { icon: <FileText size={17} style={{ color: '#6366f1' }} />, label: 'Article', onClick: () => setPostExpanded(true) },
                  { icon: <Award size={17} style={{ color: '#f59e0b' }} />, label: 'Milestone', onClick: () => setPostExpanded(true) },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.onClick} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-secondary)',
                    padding: '0.375rem 0.25rem', borderRadius: '8px', transition: 'all 0.15s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    {btn.icon}
                    <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>{btn.label}</span>
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FILTER CHIPS */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setFilterType('all')} style={{
              padding: '0.35rem 0.875rem', borderRadius: '99px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem',
              backgroundColor: filterType === 'all' ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: filterType === 'all' ? '#fff' : 'var(--text-secondary)',
              border: filterType === 'all' ? 'none' : '1px solid var(--border-color)', transition: 'all 0.2s'
            }}>All</button>
            {Object.entries(ACTIVITY_TYPES).map(([key, val]) => (
              <button key={key} onClick={() => setFilterType(filterType === key ? 'all' : key)} style={{
                padding: '0.35rem 0.875rem', borderRadius: '99px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem',
                backgroundColor: filterType === key ? val.color : 'var(--bg-card)',
                color: filterType === key ? '#fff' : 'var(--text-secondary)',
                border: filterType === key ? 'none' : '1px solid var(--border-color)', transition: 'all 0.2s'
              }}>
                {val.icon} {val.label}
              </button>
            ))}
          </div>

          {/* FEED CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {filtered.map((item, idx) => (
              <FeedCard
                key={item.id}
                item={item}
                index={idx}
                onLike={handleLike}
                onSave={handleSave}
                toast={toast}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Showing {filtered.length} posts · Updates every 14 seconds
          </div>
        </div>

        {/* RIGHT: SIDEBAR WIDGETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1rem' }}>

          {/* NETWORK SNAPSHOT */}
          <div style={{
            backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={15} style={{ color: 'var(--accent-primary)' }} /> Your Network
            </div>
            {[
              { label: 'Connections', value: 148, change: '+3 this week' },
              { label: 'Profile Views', value: 241, change: '+18 this week' },
              { label: 'Post Reach', value: '1.4k', change: '+210 this week' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--success-color)', fontWeight: 600 }}>{row.change}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{row.value}</div>
              </div>
            ))}
          </div>

          {/* SUGGESTED PEERS */}
          <div style={{
            backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={15} style={{ color: '#f59e0b' }} /> Top Mentors
            </div>
            {SUGGESTED_PEERS.map((peer, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.625rem 0', borderBottom: i < SUGGESTED_PEERS.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <img src={peer.avatar} alt={peer.name} style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid var(--border-color)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{peer.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{peer.skill} · ⭐{peer.rating}</div>
                </div>
                <button onClick={() => toast.success(`📤 Connection request sent to ${peer.name}!`)} style={{
                  fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-primary)',
                  border: '1.5px solid var(--accent-primary)', borderRadius: '99px',
                  padding: '0.2rem 0.625rem', background: 'none', cursor: 'pointer',
                  transition: 'all 0.15s', flexShrink: 0
                }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent-primary)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--accent-primary)'; }}>
                  Connect
                </button>
              </div>
            ))}
            <button onClick={() => setActiveTab('discover')} style={{
              width: '100%', marginTop: '0.75rem', padding: '0.45rem', border: '1px solid var(--border-color)',
              borderRadius: '8px', background: 'none', fontSize: '0.775rem', fontWeight: 700,
              color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              View all in Discover →
            </button>
          </div>

          {/* TRENDING TOPICS */}
          <div style={{
            backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={15} style={{ color: '#ef4444' }} /> Trending
            </div>
            {TRENDING.map((t, i) => (
              <div key={i}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: i < TRENDING.length - 1 ? '1px solid var(--border-color)' : 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                onClick={() => { setFilterType('all'); toast.info(`🔍 Searching ${t.tag}...`); }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {t.hot && <Flame size={11} style={{ color: '#ef4444' }} />}
                    {t.tag}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{t.posts}</div>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700 }}>#{i + 1}</div>
              </div>
            ))}
          </div>

          {/* DAILY XP GOAL CARD */}
          <div style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0066FF 0%, #6366f1 100%)',
            padding: '1.25rem',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(0,102,255,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
              <Zap size={16} fill="#fff" />
              <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>Daily XP Goal</span>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.75rem' }}>
              Solve 3 doubts today to earn your <strong>+75 XP</strong> daily bonus!
            </div>
            <div style={{ height: '6px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden', marginBottom: '0.5rem' }}>
              <div style={{ width: '42%', height: '100%', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '99px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', justifyContent: 'space-between' }}>
              <span>1 of 3 doubts solved</span>
              <span style={{ fontWeight: 700 }}>42%</span>
            </div>
            <button onClick={() => setActiveTab('doubts')} style={{
              marginTop: '0.875rem', width: '100%', padding: '0.5rem',
              border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: '8px',
              backgroundColor: 'transparent', color: '#fff', fontSize: '0.775rem',
              fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              Solve a Doubt Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
