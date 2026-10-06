import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  Bookmark,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Film,
  Filter,
  Flame,
  Globe,
  GraduationCap,
  Heart,
  HelpCircle,
  Image,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Pin,
  Play,
  Plus,
  PlusCircle,
  Radio,
  Repeat2,
  RotateCw,
  Search,
  Send,
  Share2,
  Shield,
  Sparkles,
  Star,
  Sun,
  ThumbsUp,
  TrendingUp,
  Trophy,
  User,
  UserCheck,
  UserPlus,
  Users,
  Video,
  Wallet,
  X,
  Zap
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
          <div key={i} title={`${v} study sessions`} style={{ height: '9px', width: '9px', borderRadius: '2px', backgroundColor: colors[v], transition: 'transform 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.4)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Trust Score Ring ─────────────────────────────────────────────────────────
function TrustRing({ score = 82 }) {
  const r = 26, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width="60" height="60" viewBox="0 0 62 62">
        <circle cx="31" cy="31" r={r} fill="none" stroke="var(--bg-tertiary)" strokeWidth="5" />
        <circle cx="31" cy="31" r={r} fill="none" stroke="var(--accent-primary)" strokeWidth="5"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          transform="rotate(-90 31 31)" style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="31" y="36" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--text-primary)">{score}</text>
      </svg>
      <div>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-primary)' }}>Scholar Trust</div>
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
          {score >= 90 ? 'Scholar Verified' : score >= 70 ? 'Campus Verified' : 'Building...'}
        </div>
      </div>
    </div>
  );
}

// ─── LinkedIn / X Style Post Composer Modal ──────────────────────────────────
function PostComposerModal({ profile, onClose, onPost, initialCategory = 'doubt', initialCodeMode = false }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [codeMode, setCodeMode] = useState(initialCodeMode);
  const [codeText, setCodeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [pollMode, setPollMode] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [audience, setAudience] = useState('campus');

  const categories = [
    { id: 'doubt', label: '❓ Code Doubt', color: '#ef4444' },
    { id: 'placement', label: '💼 Placement & OA', color: '#8b5cf6' },
    { id: 'exam', label: '📚 Exam Notes', color: '#0066FF' },
    { id: 'project', label: '🚀 Project Collab', color: '#10b981' },
    { id: 'general', label: '📢 Campus Life', color: '#f59e0b' }
  ];

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollChange = (idx, val) => {
    const next = [...pollOptions];
    next[idx] = val;
    setPollOptions(next);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    let pollData = null;
    if (pollMode && pollOptions.filter(o => o.trim()).length >= 2) {
      pollData = {
        question: text,
        options: pollOptions.filter(o => o.trim()).map(opt => ({ text: opt, votes: 0 })),
        totalVotes: 0,
        userVoted: null
      };
    }

    onPost({
      text,
      category,
      codeText: codeMode ? codeText : null,
      imageUrl: showImageInput && imageUrl.trim() ? imageUrl.trim() : null,
      poll: pollData,
      audience
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px'
    }} onClick={onClose}>
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '16px',
          width: '100%', maxWidth: '600px',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Create Post for Campus Feed
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '18px 20px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Author info */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
            <img
              src={getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl)}
              alt=""
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {profile?.fullName || 'Aarav Sharma'}
                <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                  {profile?.college || 'IIT Madras'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Globe size={11} /> Visible to Campus & Network
                </span>
              </div>
            </div>
          </div>

          {/* Text input */}
          <textarea
            autoFocus
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's happening? Share a coding doubt, placement experience, formula notes, or campus announcement..."
            style={{
              width: '100%', border: 'none', outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)', fontSize: '0.95rem',
              lineHeight: 1.6, resize: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />

          {/* Image Input Bar */}
          {showImageInput && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>🖼️ Image / Screenshot URL</span>
                <button onClick={() => setShowImageInput(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem' }}>Remove ×</button>
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or image link"
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: '6px',
                  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)', fontSize: '0.8rem', boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Code snippet toggle */}
          {codeMode && (
            <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ padding: '6px 12px', backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'monospace' }}>// Code Snippet (Java / C++ / Python / JS)</span>
                <button onClick={() => setCodeMode(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.7rem' }}>Remove ×</button>
              </div>
              <textarea
                rows={4}
                value={codeText}
                onChange={e => setCodeText(e.target.value)}
                placeholder="// paste code or bug stack trace here..."
                style={{
                  width: '100%', border: 'none', outline: 'none', padding: '10px 12px',
                  backgroundColor: '#0f172a', color: '#f8fafc',
                  fontFamily: "'Fira Code', monospace", fontSize: '0.82rem', resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Poll mode */}
          {pollMode && (
            <div style={{ marginTop: '10px', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                <span>📊 Campus Poll Options</span>
                <button onClick={() => setPollMode(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem' }}>Remove ×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={e => handlePollChange(i, e.target.value)}
                    placeholder={`Option ${i + 1} (e.g. ${i === 0 ? 'Dynamic Programming' : i === 1 ? 'Graph Theory' : 'System Design'})`}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '6px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)', fontSize: '0.8rem', boxSizing: 'border-box'
                    }}
                  />
                ))}
                {pollOptions.length < 4 && (
                  <button
                    onClick={handleAddPollOption}
                    style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={13} /> Add Option
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Selector Chips */}
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>
              SELECT TOPIC TAG
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '4px 12px', borderRadius: '999px',
                    border: category === cat.id ? `1.5px solid ${cat.color}` : '1px solid var(--border-color)',
                    backgroundColor: category === cat.id ? `${cat.color}18` : 'var(--bg-tertiary)',
                    color: category === cat.id ? cat.color : 'var(--text-secondary)',
                    fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setShowImageInput(!showImageInput)}
              title="Add Image / Screenshot"
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: showImageInput ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: showImageInput ? 'var(--accent-light)' : 'transparent',
                color: showImageInput ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Image size={17} />
            </button>
            <button
              onClick={() => setCodeMode(!codeMode)}
              title="Add Code Snippet"
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: codeMode ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: codeMode ? 'var(--accent-light)' : 'transparent',
                color: codeMode ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Code2 size={17} />
            </button>
            <button
              onClick={() => setPollMode(!pollMode)}
              title="Add Campus Poll"
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: pollMode ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: pollMode ? 'var(--accent-light)' : 'transparent',
                color: pollMode ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Radio size={17} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: text.length > 800 ? '#ef4444' : 'var(--text-muted)' }}>
              {text.length}/1000
            </span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: text.trim() ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: text.trim() ? '#fff' : 'var(--text-muted)',
                fontSize: '0.84rem', fontWeight: 800, cursor: text.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s'
              }}
            >
              <Send size={14} /> Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LinkedIn / X Style Feed Card Component ──────────────────────────────────
function SocialFeedCard({
  post,
  onLike,
  onBookmark,
  onVotePoll,
  onComment,
  onOpenProfile,
  onJoinRoom,
  toast
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const categoryColors = {
    doubt: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: '❓ Code Doubt' },
    placement: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', label: '💼 Placements & OA' },
    exam: { color: '#0066FF', bg: 'rgba(0,102,255,0.1)', label: '📚 Exam Notes' },
    project: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: '🚀 Project & Collab' },
    reels: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: '🎬 Concept Short' },
    general: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', label: '📢 Campus Life' }
  };

  const cat = categoryColors[post.category] || categoryColors.general;

  const handleCopyCode = () => {
    if (!post.codeSnippet) return;
    navigator.clipboard.writeText(post.codeSnippet);
    setCopiedCode(true);
    toast?.success('📋 Code snippet copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
    toast?.success('💬 Comment posted to thread!');
  };

  const isLongText = post.content && post.content.length > 280;
  const displayText = isLongText && !expanded ? post.content.slice(0, 280) + '...' : post.content;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative'
      }}
      className="social-feed-card interactive-hover"
    >
      {/* 1. Header: Author info & 3-dot menu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => onOpenProfile?.(post)}
        >
          <div style={{ position: 'relative' }}>
            <img
              src={post.avatar || MALE_AVATAR_SVG}
              alt={post.author}
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-color)' }}
            />
            {post.verified && (
              <span
                title="Verified Student"
                style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: '16px', height: '16px', borderRadius: '50%',
                  backgroundColor: '#0066FF', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--bg-secondary)'
                }}
              >
                <Check size={9} strokeWidth={4} />
              </span>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                {post.author}
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}>
                🏛️ {post.college}
              </span>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{post.department || 'Computer Science'}</span>
              <span>•</span>
              <span>{post.timeAgo || '10m ago'}</span>
              <span>•</span>
              <Globe size={11} />
            </div>
          </div>
        </div>

        {/* Category Pill & 3-Dot Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: cat.bg,
            color: cat.color
          }}>
            {cat.label}
          </span>

          <button
            onClick={() => setShowOptions(!showOptions)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              padding: '6px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <MoreHorizontal size={18} />
          </button>

          {showOptions && (
            <div
              style={{
                position: 'absolute', right: 0, top: '34px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                zIndex: 20,
                width: '170px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <button
                onClick={() => {
                  onBookmark?.(post.id);
                  setShowOptions(false);
                  toast?.success(post.isBookmarked ? 'Removed from saved' : 'Post saved to your profile! 🔖');
                }}
                style={{
                  padding: '8px 10px', borderRadius: '6px', border: 'none',
                  background: 'none', color: 'var(--text-primary)',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Bookmark size={14} /> {post.isBookmarked ? 'Saved Post' : 'Save Post'}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowOptions(false);
                  toast?.success('🔗 Post link copied to clipboard!');
                }}
                style={{
                  padding: '8px 10px', borderRadius: '6px', border: 'none',
                  background: 'none', color: 'var(--text-primary)',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Share2 size={14} /> Copy Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Post Title (if doubt or article) */}
      {post.title && (
        <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35 }}>
          {post.title}
        </h4>
      )}

      {/* 3. Post Content (Text with #hashtags) */}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
        {displayText}
        {isLongText && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', padding: '0 0 0 4px', fontSize: '0.84rem' }}
          >
            {expanded ? 'Show less' : '...see more'}
          </button>
        )}
      </div>

      {/* 4. Code Snippet Block (High-Contrast with Copy button) */}
      {post.codeSnippet && (
        <div style={{
          backgroundColor: '#090d16',
          borderRadius: '10px',
          border: '1px solid #1e293b',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 14px', backgroundColor: '#111827',
            borderBottom: '1px solid #1e293b'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>
              ⌨️ Code Snippet
            </span>
            <button
              onClick={handleCopyCode}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 8px', borderRadius: '6px', border: '1px solid #334155',
                backgroundColor: 'transparent', color: copiedCode ? '#10b981' : '#cbd5e1',
                fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              {copiedCode ? <Check size={12} /> : <Copy size={12} />}
              {copiedCode ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{
            margin: 0, padding: '14px',
            color: '#38bdf8', fontFamily: "'Fira Code', monospace",
            fontSize: '0.82rem', lineHeight: 1.5, overflowX: 'auto'
          }}>
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* 5. Image Attachment (if any) */}
      {post.imageUrl && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '380px' }}>
          <img
            src={post.imageUrl}
            alt="Post media"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* 6. Interactive Poll (if any) */}
      {post.poll && (
        <div style={{
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            📊 Campus Poll · {post.poll.totalVotes || 0} votes
          </div>
          {post.poll.options.map((option, idx) => {
            const hasVoted = post.poll.userVoted !== null;
            const percentage = post.poll.totalVotes > 0
              ? Math.round((option.votes / post.poll.totalVotes) * 100)
              : 0;
            const isUserPick = post.poll.userVoted === idx;

            return (
              <button
                key={idx}
                onClick={() => onVotePoll?.(post.id, idx)}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: isUserPick ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  cursor: hasVoted ? 'default' : 'pointer',
                  overflow: 'hidden',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {/* Percentage progress bar fill */}
                {hasVoted && (
                  <div
                    style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${percentage}%`,
                      backgroundColor: isUserPick ? 'rgba(0, 102, 255, 0.18)' : 'rgba(148, 163, 184, 0.15)',
                      transition: 'width 0.5s ease',
                      zIndex: 1
                    }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2, fontSize: '0.82rem', fontWeight: isUserPick ? 800 : 600, color: 'var(--text-primary)' }}>
                  {isUserPick && '✓ '} {option.text}
                </span>
                {hasVoted && (
                  <span style={{ position: 'relative', zIndex: 2, fontSize: '0.8rem', fontWeight: 800, color: isUserPick ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    {percentage}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 7. Live Room Callout (if active) */}
      {post.hasLiveRoom && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444' }}>
              Active Doubt Room is Live Now!
            </span>
          </div>
          <button
            onClick={() => onJoinRoom?.(post)}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              background: '#ef4444', color: '#fff', fontSize: '0.74rem',
              fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
            }}
          >
            <Video size={13} /> Join Live Room 🚀
          </button>
        </div>
      )}

      {/* 8. Hashtags & Tags */}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                backgroundColor: 'var(--accent-light)',
                padding: '2px 8px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 9. Reaction Stats Bar (Likes, Comments count) */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '8px', borderTop: '1px solid var(--border-color)',
        fontSize: '0.74rem', color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#ef4444', fontWeight: 700 }}>
            <Heart size={13} fill="#ef4444" /> {post.likes || 0}
          </span>
          <span>•</span>
          <span>{post.comments?.length || post.answers || 0} comments</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>{post.shares || 4} reposts</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Eye size={12} /> {post.views || '1.2k'} views
          </span>
        </div>
      </div>

      {/* 10. Social Action Bar (Like, Comment, Repost, Save, Share) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '4px', paddingTop: '4px'
      }}>
        <button
          onClick={() => onLike?.(post.id)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '8px 6px', borderRadius: '8px', border: 'none',
            background: 'none', color: post.isLiked ? '#ef4444' : 'var(--text-secondary)',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Heart size={16} fill={post.isLiked ? '#ef4444' : 'none'} />
          {post.isLiked ? 'Liked' : 'Like'}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '8px 6px', borderRadius: '8px', border: 'none',
            background: 'none', color: showComments ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <MessageCircle size={16} />
          Comment
        </button>

        <button
          onClick={() => {
            toast?.success('🔁 Reposted to your campus peers!');
          }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '8px 6px', borderRadius: '8px', border: 'none',
            background: 'none', color: 'var(--text-secondary)',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Repeat2 size={16} />
          Repost
        </button>

        <button
          onClick={() => {
            onBookmark?.(post.id);
            toast?.success(post.isBookmarked ? 'Bookmark removed' : 'Saved to Bookmarks 🔖');
          }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '8px 6px', borderRadius: '8px', border: 'none',
            background: 'none', color: post.isBookmarked ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Bookmark size={16} fill={post.isBookmarked ? 'var(--accent-primary)' : 'none'} />
          Save
        </button>
      </div>

      {/* 11. Comments Thread & Input Drawer */}
      {showComments && (
        <div style={{
          marginTop: '4px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeIn 0.2s ease'
        }}>
          {/* Add comment input */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add your peer explanation or answer..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '999px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem', outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              style={{
                padding: '8px 14px', borderRadius: '999px', border: 'none',
                backgroundColor: commentText.trim() ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: commentText.trim() ? '#fff' : 'var(--text-muted)',
                fontSize: '0.78rem', fontWeight: 800, cursor: commentText.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <Send size={12} /> Send
            </button>
          </form>

          {/* Existing comments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {(post.commentsList || [
              { author: 'Chaitanya Reddy', text: 'Great explanation! This helped me understand the edge cases.', time: '12m ago', avatar: MALE_AVATAR_SVG },
              { author: 'Bhavna Patel', text: 'You can also optimize space by keeping only 2 rows in DP array.', time: '5m ago', avatar: FEMALE_AVATAR_SVG }
            ]).map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '10px' }}>
                <img src={c.avatar || MALE_AVATAR_SVG} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{c.author}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main HomeHubScreen with LinkedIn / X Feed ─────────────────────────────────
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

  const [activeFilter, setActiveFilter] = useState('for_you'); // 'for_you', 'campus', 'following', 'doubt', 'placement', 'exam', 'project'
  const [showPostModal, setShowPostModal] = useState(false);
  const [composerCategory, setComposerCategory] = useState('doubt');
  const [composerCodeMode, setComposerCodeMode] = useState(false);

  // Quick doubt / skill swap modal states
  const [showQuickDoubtModal, setShowQuickDoubtModal] = useState(false);
  const [quickDoubtQuestion, setQuickDoubtQuestion] = useState('');
  const [quickDoubtSubject, setQuickDoubtSubject] = useState('Java');
  const [quickDoubtLanguage, setQuickDoubtLanguage] = useState('Telugu / English');

  const [showSkillSwapModal, setShowSkillSwapModal] = useState(false);
  const [swapLearn, setSwapLearn] = useState('');
  const [swapTeach, setSwapTeach] = useState('');

  // Feed Posts List
  const [posts, setPosts] = useState([
    {
      id: 'p-1',
      author: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'CS 4th Year • Java & ML Mentor',
      avatar: FEMALE_AVATAR_SVG,
      verified: true,
      category: 'placement',
      title: '🚀 Top 15 Graph BFS/DFS Patterns from Google & Microsoft SDE OA Rounds',
      content: 'Just finished documenting the most frequent Graph problems asked in this semester\'s campus placement coding assessments.\n\nKey takeaways:\n1. Cycle detection in Directed Graph (Kahn\'s algorithm vs 3-color DFS)\n2. Shortest path in unweighted DAG (0-1 BFS with Deque)\n3. Disjoint Set Union (DSU) with Path Compression & Rank\n\nFull cheat sheet attached below for campus juniors! Drop your questions in comments.',
      codeSnippet: `// 0-1 BFS for Shortest Path with 0/1 weights
Deque<Integer> dq = new ArrayDeque<>();
dq.addFirst(startNode);
dist[startNode] = 0;
while(!dq.isEmpty()) {
    int u = dq.pollFirst();
    for (Edge e : adj.get(u)) {
        if (dist[u] + e.weight < dist[e.v]) {
            dist[e.v] = dist[u] + e.weight;
            if (e.weight == 0) dq.addFirst(e.v);
            else dq.addLast(e.v);
        }
    }
}`,
      imageUrl: null,
      tags: ['#JavaDSA', '#Placements2026', '#GraphTheory', '#IITMadras'],
      likes: 184,
      isLiked: false,
      answers: 28,
      shares: 19,
      views: '2.4k',
      timeAgo: '12m ago',
      isBookmarked: false,
      hasLiveRoom: false
    },
    {
      id: 'p-2',
      author: 'Rohan Deshmukh',
      college: 'IIT Bombay',
      department: 'Competitive Programming Lead',
      avatar: MALE_AVATAR_SVG,
      verified: true,
      category: 'doubt',
      title: '❓ 0/1 Knapsack 2D DP Memoization — ArrayIndexOutOfBounds on state table',
      content: 'Getting an index out of bounds error during recursive top-down memoization when capacity W exceeds the pre-allocated array bounds. Can someone jump into the Live Room and explain 1D space optimization in Telugu / English?',
      codeSnippet: `int solve(int i, int w, int[] val, int[] wt, int[][] dp) {
    if (i == 0 || w == 0) return 0;
    if (dp[i][w] != -1) return dp[i][w];
    if (wt[i-1] <= w) {
        return dp[i][w] = Math.max(val[i-1] + solve(i-1, w-wt[i-1], val, wt, dp), solve(i-1, w, val, wt, dp));
    }
    return dp[i][w] = solve(i-1, w, val, wt, dp);
}`,
      imageUrl: null,
      tags: ['#DynamicProgramming', '#DSA', '#CodeBug'],
      likes: 56,
      isLiked: true,
      answers: 12,
      shares: 6,
      views: '1.1k',
      timeAgo: '28m ago',
      isBookmarked: true,
      hasLiveRoom: true
    },
    {
      id: 'p-3',
      author: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'EEE & Algorithms Tutor',
      avatar: MALE_AVATAR_SVG,
      verified: true,
      category: 'general',
      title: '📊 Campus Poll: Which Semester 4 Subject is Most Challenging?',
      content: 'Hey everyone! Setting up peer study groups for the upcoming mid-semester exams. Which domain do you think requires the most peer doubt-solving sessions this month?',
      poll: {
        question: 'Which subject requires the most doubt sessions?',
        options: [
          { text: 'Dynamic Programming & Graphs (DSA)', votes: 142 },
          { text: 'Operating Systems (Paging & Locks)', votes: 98 },
          { text: 'Database Management Systems (SQL & ACID)', votes: 45 },
          { text: 'Computer Networks (TCP/IP & Sockets)', votes: 61 }
        ],
        totalVotes: 346,
        userVoted: null
      },
      tags: ['#CampusPoll', '#ExamPrep', '#StudyGroups'],
      likes: 92,
      isLiked: false,
      answers: 34,
      shares: 14,
      views: '1.8k',
      timeAgo: '1h ago',
      isBookmarked: false,
      hasLiveRoom: false
    },
    {
      id: 'p-4',
      author: 'Kavya Subramanian',
      college: 'IIT Delhi',
      department: 'React & WebRTC Senior Mentor',
      avatar: FEMALE_AVATAR_SVG,
      verified: true,
      category: 'exam',
      title: '📚 React useEffect Cleanup & WebRTC ICE Candidate Memory Leak Prevention',
      content: 'Here is a quick concept sheet explaining why cleaning up EventListeners and RTCPeerConnection instances in useEffect prevents infinite re-render loops and zombie sockets!\n\nKey Rule:\nAlways return a teardown callback in useEffect when creating peer connections.',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&auto=format&fit=crop&q=80',
      tags: ['#React', '#WebRTC', '#JavaScript', '#Frontend'],
      likes: 210,
      isLiked: false,
      answers: 41,
      shares: 32,
      views: '3.1k',
      timeAgo: '2h ago',
      isBookmarked: true,
      hasLiveRoom: false
    },
    {
      id: 'p-5',
      author: 'Divya Nambiar',
      college: 'NIT Trichy',
      department: 'Data Science & SQL Expert',
      avatar: FEMALE_AVATAR_SVG,
      verified: true,
      category: 'project',
      title: '🚀 Looking for 2 React/Spring Boot developers for SIH Smart Campus Project',
      content: 'We are building an AI-powered Campus Mentoring & Question Paper archive for SIH 2026. Tech stack: React + Spring Boot + PostgreSQL. If you want to collaborate and earn project badges, comment below or send a connection request!',
      tags: ['#SIH2026', '#OpenSource', '#Hackathon', '#SpringBoot'],
      likes: 124,
      isLiked: false,
      answers: 19,
      shares: 11,
      views: '1.5k',
      timeAgo: '3h ago',
      isBookmarked: false,
      hasLiveRoom: false
    }
  ]);

  // Live Doubt Rooms
  const liveDoubtRooms = [
    {
      id: 'room-1',
      title: 'Java Multithreading Synchronized Locks issue in Producer-Consumer',
      subject: 'Java',
      language: 'Telugu / English',
      creator: 'Aarav Sharma',
      college: 'IIT Madras',
      participants: 3
    },
    {
      id: 'room-2',
      title: 'React useEffect Infinite re-render cycle with state objects',
      subject: 'React',
      language: 'Telugu / English',
      creator: 'Bhavna Patel',
      college: 'IIT Madras',
      participants: 5
    },
    {
      id: 'room-3',
      title: 'Dynamic Programming 0/1 Knapsack memoization table walkthrough',
      subject: 'Algorithms',
      language: 'English / Hindi',
      creator: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      participants: 4
    }
  ];

  // Top Mentors
  const topMentors = [
    { id: 'm1', fullName: 'Bhavna Patel', college: 'IIT Madras', subject: 'DSA & Algorithms', specialty: 'DP, Graphs', rating: 4.98, sessions: 42, avatar: FEMALE_AVATAR_SVG, available: true, rate: '₹50/session' },
    { id: 'm2', fullName: 'Rohan Deshmukh', college: 'IIT Bombay', subject: 'Competitive Prog.', specialty: 'Segment Trees, CP', rating: 4.92, sessions: 38, avatar: MALE_AVATAR_SVG, available: false, rate: '₹60/session' },
    { id: 'm3', fullName: 'Divya Nambiar', college: 'NIT Trichy', subject: 'DBMS & OS', specialty: 'Indexing, Scheduling', rating: 4.95, sessions: 29, avatar: FEMALE_AVATAR_SVG, available: true, rate: '₹40/session' }
  ];

  // Trending Topics
  const trendingTopics = [
    { tag: '#JavaDSA', count: '1.4k posts', hot: true },
    { tag: '#Placements2026', count: '2.8k posts', hot: true },
    { tag: '#TeluguTutors', count: '920 posts', hot: true },
    { tag: '#ReactHooks', count: '850 posts', hot: false },
    { tag: '#OperatingSystems', count: '640 posts', hot: false },
    { tag: '#SIH2026', count: '510 posts', hot: false }
  ];

  // Handlers
  const handleLike = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const handleBookmark = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isBookmarked: !p.isBookmarked };
      }
      return p;
    }));
  };

  const handleVotePoll = (postId, optionIdx) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.poll) {
        if (p.poll.userVoted !== null) return p; // already voted
        const newOptions = [...p.poll.options];
        newOptions[optionIdx].votes += 1;
        return {
          ...p,
          poll: {
            ...p.poll,
            options: newOptions,
            totalVotes: p.poll.totalVotes + 1,
            userVoted: optionIdx
          }
        };
      }
      return p;
    }));
    toast.success('📊 Vote registered!');
  };

  const handleAddComment = (postId, commentText) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment = {
          author: profile?.fullName || 'Aarav Sharma',
          avatar: getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl),
          text: commentText,
          time: 'Just now'
        };
        const currentList = p.commentsList || [];
        return {
          ...p,
          answers: (p.answers || 0) + 1,
          commentsList: [newComment, ...currentList]
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (newPostData) => {
    const newPost = {
      id: `p-${Date.now()}`,
      author: profile?.fullName || 'Aarav Sharma',
      college: profile?.college || 'IIT Madras',
      department: profile?.department || 'Computer Science 3rd Year',
      avatar: getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl),
      verified: true,
      category: newPostData.category || 'general',
      title: newPostData.text.slice(0, 60) + (newPostData.text.length > 60 ? '...' : ''),
      content: newPostData.text,
      codeSnippet: newPostData.codeText || null,
      imageUrl: newPostData.imageUrl || null,
      poll: newPostData.poll || null,
      tags: ['#CampusPost', `#${profile?.college?.replace(/\s+/g, '') || 'IITMadras'}`],
      likes: 1,
      isLiked: true,
      answers: 0,
      shares: 0,
      views: '1',
      timeAgo: 'Just now',
      isBookmarked: false,
      hasLiveRoom: newPostData.category === 'doubt'
    };
    setPosts([newPost, ...posts]);
    toast.success('🎉 Post published to Campus Feed!');
  };

  const handleCreateQuickDoubt = (e) => {
    e.preventDefault();
    if (!quickDoubtQuestion.trim()) return;
    const newRoomId = `room-${Date.now()}`;
    setShowQuickDoubtModal(false);
    toast.success(`Launching Live Doubt Room: "${quickDoubtQuestion.slice(0, 30)}..." 🚀`);
    setActiveRoomId?.(newRoomId);
    setActiveTab('doubts');
    startWebRtcCall?.(null, newRoomId, quickDoubtQuestion, quickDoubtSubject);
  };

  const handleProposeSkillSwap = (e) => {
    e.preventDefault();
    if (!swapLearn.trim() || !swapTeach.trim()) return;
    setShowSkillSwapModal(false);
    toast.success(`Skill Swap Proposal Posted! Learn: "${swapLearn}" ⮀ Teach: "${swapTeach}" 🤝`);
  };

  // Filtered feed
  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'for_you') return true;
    if (activeFilter === 'campus') return p.college?.toLowerCase().includes(profile?.college?.toLowerCase() || 'iit');
    if (activeFilter === 'following') return p.verified;
    return p.category === activeFilter;
  });

  return (
    <div className="studyloop-page-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px' }}>

      {/* ── 1. HERO COMMAND HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(124, 58, 237, 0.06) 100%)',
        border: '1px solid rgba(0, 102, 255, 0.18)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '6px' }}>
            🎓 {profile?.college || 'IIT Madras'} Campus Hub
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Welcome back, {profile?.fullName?.split(' ')[0] || 'Aarav'}! 👋
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '580px' }}>
            Explore what's happening across campus, solve live doubts, and scroll through peer discussions.
          </p>
        </div>

        {/* Quick Scholar Metrics */}
        <div style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <TrustRing score={profile?.trustScore || 82} />
          <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
          <ActivityHeatmap />
        </div>
      </div>

      {/* ── 2. FOUR PRIMARY ACTION TILES ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '22px' }}>
        <div
          onClick={() => setShowQuickDoubtModal(true)}
          className="studyloop-card interactive-hover"
          style={{ padding: '16px 18px', cursor: 'pointer', margin: 0, borderLeft: '4px solid #ef4444' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={18} />
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '999px' }}>Instant</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Ask Academic Doubt</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>Open live room with code editor & whiteboard.</div>
        </div>

        <div
          onClick={() => setActiveTab('discover')}
          className="studyloop-card interactive-hover"
          style={{ padding: '16px 18px', cursor: 'pointer', margin: 0, borderLeft: '4px solid #0066FF' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} />
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-light)', padding: '2px 6px', borderRadius: '999px' }}>Telugu & More</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Find Campus Mentors</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>Verified seniors by subject, rating & language.</div>
        </div>

        <div
          onClick={() => setShowSkillSwapModal(true)}
          className="studyloop-card interactive-hover"
          style={{ padding: '16px 18px', cursor: 'pointer', margin: 0, borderLeft: '4px solid #10b981' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={18} />
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '999px' }}>100% Free</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Peer Skill Swap</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>"You teach me X, I teach you Y" barter.</div>
        </div>

        <div
          onClick={() => setActiveTab('discover')}
          className="studyloop-card interactive-hover"
          style={{ padding: '16px 18px', cursor: 'pointer', margin: 0, borderLeft: '4px solid #7C3AED' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.1)', padding: '2px 6px', borderRadius: '999px' }}>Earn / Badges</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '2px' }}>Become a Mentor</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>Teach juniors, earn ₹30-₹100 or badge honors.</div>
        </div>
      </div>

      {/* ── 3. MAIN 2-COLUMN FEED GRID (LINKEDIN & X STYLE) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '22px',
        alignItems: 'start'
      }} className="studyloop-hub-grid">

        {/* ── LEFT COLUMN: THE LINKEDIN / X STYLE FEED STREAM ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 1. Start a Post Box (LinkedIn Style Composer Bar) */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '16px 20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <img
                src={getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl)}
                alt=""
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-color)' }}
              />
              <button
                onClick={() => setShowPostModal(true)}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '999px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                Start a post, ask a code doubt, share placement notes...
              </button>
            </div>

            {/* Quick action buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '6px' }}>
              <button
                onClick={() => {
                  setComposerCategory('doubt');
                  setComposerCodeMode(true);
                  setShowPostModal(true);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', color: '#ef4444',
                  fontSize: '0.78rem', fontWeight: 700, padding: '6px 10px',
                  borderRadius: '8px', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Code2 size={16} /> Code Doubt
              </button>

              <button
                onClick={() => {
                  setComposerCategory('placement');
                  setShowPostModal(true);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', color: '#8b5cf6',
                  fontSize: '0.78rem', fontWeight: 700, padding: '6px 10px',
                  borderRadius: '8px', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Briefcase size={16} /> Placement OA
              </button>

              <button
                onClick={() => {
                  setComposerCategory('exam');
                  setShowPostModal(true);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', color: '#0066FF',
                  fontSize: '0.78rem', fontWeight: 700, padding: '6px 10px',
                  borderRadius: '8px', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255, 0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <BookOpen size={16} /> Exam Notes
              </button>

              <button
                onClick={() => {
                  setShowPostModal(true);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', color: '#10b981',
                  fontSize: '0.78rem', fontWeight: 700, padding: '6px 10px',
                  borderRadius: '8px', cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.08)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Radio size={16} /> Campus Poll
              </button>
            </div>
          </div>

          {/* 2. Active Live Doubt Rooms Carousel Ribbon */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444',
                  padding: '3px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                  LIVE NOW
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Active Doubt Rooms
                </span>
              </div>
              <button
                onClick={() => setActiveTab('doubts')}
                style={{
                  background: 'none', border: 'none', color: 'var(--accent-primary)',
                  fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '3px'
                }}
              >
                All Rooms <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {liveDoubtRooms.map(room => (
                <div
                  key={room.id}
                  style={{
                    minWidth: '240px',
                    maxWidth: '280px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    flexShrink: 0
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-light)', padding: '2px 6px', borderRadius: '4px' }}>
                        {room.subject}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        👥 {room.participants} in room
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '4px' }}>
                      {room.title.slice(0, 50)}...
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Started by {room.creator} · {room.language}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveRoomId?.(room.id);
                      setActiveTab('doubts');
                      startWebRtcCall?.(null, room.id, room.title, room.subject);
                    }}
                    style={{
                      padding: '6px 12px', borderRadius: '6px', border: 'none',
                      backgroundColor: '#ef4444', color: '#fff', fontSize: '0.74rem',
                      fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    <Video size={12} /> Join Room
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. LinkedIn & X Filter Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              padding: '6px 0',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            {[
              { id: 'for_you', label: '🌟 For You' },
              { id: 'campus', label: `🏛️ My Campus (${profile?.college?.split(' ')[0] || 'IIT'})` },
              { id: 'following', label: '👥 Following' },
              { id: 'doubt', label: '❓ Code Doubts' },
              { id: 'placement', label: '💼 Placements & OA' },
              { id: 'exam', label: '📚 Exam Notes' },
              { id: 'project', label: '🚀 Projects' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: activeFilter === tab.id ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: activeFilter === tab.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: activeFilter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 4. The Scrollable Feed Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <SocialFeedCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onVotePoll={handleVotePoll}
                  onComment={handleAddComment}
                  onOpenProfile={(p) => {
                    const fn = openPublicProfile || onOpenPublicProfile;
                    if (fn) fn(p);
                  }}
                  onJoinRoom={(p) => {
                    setActiveRoomId?.(p.id);
                    setActiveTab('doubts');
                    startWebRtcCall?.(null, p.id, p.title || 'Live Doubt', p.category);
                  }}
                  toast={toast}
                />
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                border: '1px dashed var(--border-color)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  No posts in this category yet
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Be the first one from {profile?.college || 'campus'} to post!
                </div>
                <button
                  onClick={() => setShowPostModal(true)}
                  style={{
                    padding: '8px 18px', borderRadius: '8px', border: 'none',
                    backgroundColor: 'var(--accent-primary)', color: '#fff',
                    fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  Create First Post 🚀
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ── RIGHT COLUMN: CAMPUS SPOTLIGHT & TRENDING WIDGETS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Trending Topics Widget (Like X / Twitter) */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '18px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={16} style={{ color: '#ef4444' }} /> Trending on Campus
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}>
                Refresh
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {trendingTopics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    toast.success(`Filtering feed by ${topic.tag}! 🔍`);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '4px 0',
                    transition: 'transform 0.1s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {topic.tag}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {topic.count}
                    </div>
                  </div>
                  {topic.hot && (
                    <span style={{ fontSize: '0.64rem', fontWeight: 800, backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px' }}>
                      🔥 HOT
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Campus Spotlight & Contests */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '18px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={16} style={{ color: '#f59e0b' }} /> Campus Spotlight
              </div>
              <span
                style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => setActiveTab('leaderboard')}
              >
                View Ranks
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Inter-IIT AlgoFest 2026', action: 'Join Contest', subtitle: '₹25K Pool · DSA & CP', icon: '⚡' },
                { title: 'Google & Microsoft OA Sim', action: 'Register', subtitle: 'This Saturday, 8:00 PM', icon: '🎯' },
                { title: 'OS & Distributed Systems', action: 'Campus Room', subtitle: 'Peer Workshop · 4 Days', icon: '💻' },
                { title: 'Semester Exam Question Bank', action: 'Access PDF', subtitle: 'Verified Branch Rankers', icon: '📚' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    toast.success(`Accessing ${item.title}! 🚀`);
                  }}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '4px 0',
                    borderBottom: idx < 3 ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    backgroundColor: 'var(--bg-tertiary)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{item.action}</span> · {item.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Campus Mentors (with 1-click booking) */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '18px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} style={{ color: 'var(--accent-primary)' }} /> Top Campus Mentors
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '999px' }}>
                Free Demo
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topMentors.map(m => (
                <div key={m.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={m.avatar} alt="" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: m.available ? '#10b981' : '#94a3b8', border: '1px solid #fff' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.fullName}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {m.college} · ⭐ {m.rating}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <strong>{m.subject}</strong> — {m.specialty}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        if (onOpenBookingModal) {
                          onOpenBookingModal(m);
                        } else {
                          setActiveTab('sessions');
                        }
                        toast.success(`Opening 1:1 demo booking with ${m.fullName}!`);
                      }}
                      style={{
                        flex: 1, padding: '5px 8px', borderRadius: '6px', border: 'none',
                        backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '0.72rem',
                        fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Book Demo
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('connections');
                        toast.success(`Connecting with ${m.fullName}!`);
                      }}
                      style={{
                        padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border-color)',
                        backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '0.72rem',
                        fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── MODALS ── */}
      {/* 1. Post Composer Modal */}
      {showPostModal && (
        <PostComposerModal
          profile={profile}
          onClose={() => setShowPostModal(false)}
          onPost={handleCreatePost}
          initialCategory={composerCategory}
          initialCodeMode={composerCodeMode}
        />
      )}

      {/* 2. Quick Doubt Modal */}
      {showQuickDoubtModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px',
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
                    Creates a live WebRTC audio/video space with shared compiler
                  </div>
                </div>
              </div>
              <button onClick={() => setShowQuickDoubtModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
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
                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', fontSize: '0.82rem', boxSizing: 'border-box', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <select
                    value={quickDoubtSubject}
                    onChange={e => setQuickDoubtSubject(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '8px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.8rem'
                    }}
                  >
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="DSA & Algorithms">DSA & Algorithms</option>
                    <option value="DBMS">DBMS & SQL</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Web Development">React & Web</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Language
                  </label>
                  <select
                    value={quickDoubtLanguage}
                    onChange={e => setQuickDoubtLanguage(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '8px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.8rem'
                    }}
                  >
                    <option value="Telugu">🗣️ Telugu (తెలుగు)</option>
                    <option value="English">🗣️ English</option>
                    <option value="Telugu / English">🗣️ Telugu / English</option>
                    <option value="Hindi">🗣️ Hindi (हिंदी)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowQuickDoubtModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  🚀 Launch Live Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Skill Swap Modal */}
      {showSkillSwapModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🔄</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Peer Skill Swap (100% Free)
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                    ₹0 Cost — Learn & teach barter exchange
                  </div>
                </div>
              </div>
              <button onClick={() => setShowSkillSwapModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProposeSkillSwap}>
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
                    width: '100%', padding: '8px 12px', borderRadius: '8px',
                    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', fontSize: '0.82rem', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  What can you teach in return? *
                </label>
                <input
                  type="text"
                  required
                  value={swapTeach}
                  onChange={e => setSwapTeach(e.target.value)}
                  placeholder="e.g. React & Next.js, SQL, Physics"
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: '8px',
                    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', fontSize: '0.82rem', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowSkillSwapModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  🤝 Post Skill Swap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
