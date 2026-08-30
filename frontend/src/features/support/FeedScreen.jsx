import React, { useState, useEffect, useRef } from 'react';
import { Award, BookOpen, Heart, MessageCircle, Share2, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { MALE_AVATAR_SVG, FEMALE_AVATAR_SVG } from '../../constants/avatars';
import { useAuth } from '../../context/AuthContext';

const ACTIVITY_TYPES = {
  doubt:       { icon: '❓', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Doubt Solved' },
  session:     { icon: '🎓', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  label: 'Session Completed' },
  achievement: { icon: '🏆', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', label: 'Achievement Unlocked' },
  connection:  { icon: '🤝', color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'New Connection' },
  reel:        { icon: '🎞️', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'New Concept Short' },
};

const SEED_FEED = [
  { id: 'f-1', type: 'doubt',       user: 'Bhavna Patel',     avatar: FEMALE_AVATAR_SVG, college: 'IIT Madras',    text: 'Just solved a doubt on Java Multithreading synchronized blocks for Aarav! 🔥',          xp: 25, time: '2m ago',  likes: 14, liked: false },
  { id: 'f-2', type: 'session',     user: 'Chaitanya Reddy',  avatar: MALE_AVATAR_SVG,   college: 'BITS Pilani',   text: 'Completed a 30-min 1:1 session on Pointers & Memory management. Student clarity: ⭐⭐⭐⭐⭐', xp: 50, time: '8m ago',  likes: 9,  liked: false },
  { id: 'f-3', type: 'achievement', user: 'Divya Nambiar',    avatar: FEMALE_AVATAR_SVG, college: 'NIT Trichy',    text: 'Unlocked "Campus Legend" badge — 50 doubts solved this month! 🎉',                       xp: 100, time: '14m ago', likes: 32, liked: false },
  { id: 'f-4', type: 'reel',        user: 'Kavya Subramanian', avatar: FEMALE_AVATAR_SVG, college: 'IIT Delhi',   text: 'Posted a new Concept Short: "React useEffect cleanup explained in 60s" — 1.2K views!',    xp: 30, time: '22m ago', likes: 47, liked: false },
  { id: 'f-5', type: 'connection',  user: 'Rohan Deshmukh',   avatar: MALE_AVATAR_SVG,   college: 'IIT Bombay',   text: 'Connected with Sneha Roy from IIIT Hyderabad — study partner for AI/ML projects.',          xp: 10, time: '31m ago', likes: 6,  liked: false },
  { id: 'f-6', type: 'doubt',       user: 'Sneha Roy',        avatar: FEMALE_AVATAR_SVG, college: 'IIIT Hyderabad', text: 'Helped with: "How does Gradient Descent converge on convex loss surfaces?" 📐',         xp: 25, time: '45m ago', likes: 21, liked: false },
  { id: 'f-7', type: 'session',     user: 'Ananya Guha',      avatar: FEMALE_AVATAR_SVG, college: 'BITS Pilani',   text: 'Taught a 60-min deep dive on Kubernetes pod scheduling & resource limits. 🚀',              xp: 90, time: '1h ago',  likes: 18, liked: false },
  { id: 'f-8', type: 'achievement', user: 'Vikram Joshi',     avatar: MALE_AVATAR_SVG,   college: 'IIT Madras',    text: 'Reached Level 2! Earned 50 XP this week by solving 5 Thermodynamics doubts.',               xp: 50, time: '2h ago',  likes: 8,  liked: false },
];

const LIVE_FEED_TEMPLATES = [
  { type: 'doubt',       user: 'Priya Menon',   avatar: FEMALE_AVATAR_SVG, college: 'NIT Warangal',   texts: ['Just explained OS Virtual Memory paging to a junior — 25 XP earned! 🎯', 'Solved: "Why does Quicksort have O(n²) worst case?" in 15 mins flat!', 'Cleared confusion on SQL JOIN vs UNION — session rated ⭐⭐⭐⭐⭐'] },
  { type: 'session',     user: 'Arjun Kumar',   avatar: MALE_AVATAR_SVG,   college: 'IIT Kharagpur',  texts: ['Finished a Spring Boot REST API design session — escrow released ✅', 'Completed a DSA session on Segment Trees — student finally got it! 🌳', '30-min Python pandas session done — data cleaning mastered 📊'] },
  { type: 'achievement', user: 'Nandini Rao',   avatar: FEMALE_AVATAR_SVG, college: 'VIT Vellore',    texts: ['Unlocked "Streak Champion" — 7-day continuous teaching streak! 🔥', 'Reached Level 4! 500 XP milestone achieved today 🏆', 'Earned "Top Resolver" badge for solving 10 doubts this week!'] },
  { type: 'reel',        user: 'Siddharth N.',  avatar: MALE_AVATAR_SVG,   college: 'IIIT Bangalore', texts: ['New Concept Short: "Binary Search in 45 seconds" — already 800+ views!', 'Posted "Graph BFS vs DFS — visual comparison" Reel — trending 🔥', 'New upload: "HashMap collision handling explained visually" — 1.1K views'] },
  { type: 'connection',  user: 'Meera S.',      avatar: FEMALE_AVATAR_SVG, college: 'BITS Goa',       texts: ['Connected with Arjun for collaborative ML project sessions 🤝', 'New study partner found in Connections — starting DSA prep together!', 'Accepted connection from top-rated Java tutor at IIT Bombay'] },
];

export function FeedScreen({ setActiveTab, setActiveRoomId, token }) {
  const { profile } = useAuth();
  const [feedItems, setFeedItems] = useState(SEED_FEED);
  const [filterType, setFilterType] = useState('all');
  const [newItemFlash, setNewItemFlash] = useState(false);
  const liveIdx = useRef(0);

  // ── Real-time new activity every 12s ──
  useEffect(() => {
    const interval = setInterval(() => {
      const tpl = LIVE_FEED_TEMPLATES[liveIdx.current % LIVE_FEED_TEMPLATES.length];
      const text = tpl.texts[Math.floor(Math.random() * tpl.texts.length)];
      liveIdx.current++;

      const newItem = {
        id: `f-live-${Date.now()}`,
        type: tpl.type,
        user: tpl.user,
        avatar: tpl.avatar,
        college: tpl.college,
        text,
        xp: Math.floor(Math.random() * 80) + 10,
        time: 'Just now',
        likes: 0,
        liked: false,
      };

      setFeedItems(prev => [newItem, ...prev.slice(0, 29)]); // keep max 30
      setNewItemFlash(true);
      setTimeout(() => setNewItemFlash(false), 2500);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleLike = (id) => {
    setFeedItems(prev => prev.map(f =>
      f.id === id ? { ...f, liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1 } : f
    ));
  };

  const filtered = filterType === 'all' ? feedItems : feedItems.filter(f => f.type === filterType);

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '760px', margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            📡 Campus Activity Feed
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Live updates from your campus peer network — doubts solved, sessions completed, achievements earned.
          </p>
        </div>

        {/* Live Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: newItemFlash ? 'var(--success-color)' : 'var(--text-muted)', transition: 'color 0.5s' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: newItemFlash ? 'var(--success-color)' : '#ef4444', display: 'inline-block', animation: 'pulse-ring 1.5s infinite' }} />
          {newItemFlash ? 'New activity!' : 'Live Feed'}
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterType('all')}
          style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
            backgroundColor: filterType === 'all' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
            color: filterType === 'all' ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}
        >All</button>
        {Object.entries(ACTIVITY_TYPES).map(([key, val]) => (
          <button key={key} onClick={() => setFilterType(key)} style={{
            padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
            backgroundColor: filterType === key ? val.color : 'var(--bg-tertiary)',
            color: filterType === key ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s'
          }}>
            {val.icon} {val.label}
          </button>
        ))}
      </div>

      {/* FEED CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((item, idx) => {
          const atype = ACTIVITY_TYPES[item.type];
          const isNew = item.id.startsWith('f-live-') && idx === 0;
          return (
            <div
              key={item.id}
              className="card-premium"
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${atype.color}`,
                animation: isNew ? 'dropdown-animate 0.4s ease' : undefined,
                position: 'relative'
              }}
            >
              {isNew && (
                <span style={{
                  position: 'absolute', top: '0.75rem', right: '0.875rem',
                  fontSize: '0.625rem', fontWeight: 800, backgroundColor: atype.color, color: '#fff',
                  borderRadius: '4px', padding: '0.15rem 0.4rem'
                }}>NEW</span>
              )}

              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                {/* Activity Type Icon */}
                <div style={{
                  width: '42px', height: '42px', borderRadius: 'var(--radius-md)', flexShrink: 0,
                  backgroundColor: atype.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  {atype.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* User info row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <img src={item.avatar} alt={item.user} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{item.user}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{item.college}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{item.time}</span>
                  </div>

                  {/* Activity text */}
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.text}</p>

                  {/* XP badge + actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent-primary)', borderRadius: '4px', padding: '0.2rem 0.5rem'
                    }}>
                      ⚡ +{item.xp} XP
                    </span>

                    {/* Like */}
                    <button
                      onClick={() => handleLike(item.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.8125rem', fontWeight: 700,
                        color: item.liked ? '#ef4444' : 'var(--text-muted)', transition: 'color 0.2s' }}
                    >
                      <Heart size={15} fill={item.liked ? '#ef4444' : 'none'} />
                      {item.likes}
                    </button>

                    {/* Type label */}
                    <span style={{ fontSize: '0.6875rem', color: atype.color, fontWeight: 700, marginLeft: 'auto', backgroundColor: atype.bg, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      {atype.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Showing {filtered.length} activities · New posts appear automatically
      </div>
    </div>
  );
}
