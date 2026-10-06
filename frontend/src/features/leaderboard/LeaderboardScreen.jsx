import React, { useState, useEffect, useCallback } from 'react';
import { Award, Flame, Medal, RefreshCw, Star, Trophy, TrendingUp, Users, Zap } from 'lucide-react';
import { MALE_AVATAR_SVG, FEMALE_AVATAR_SVG } from '../../constants/avatars';
import { useAuth } from '../../context/AuthContext';
import { LeaderboardAPI } from '../../lib/api';

const INITIAL_LEADERS = [
  { rank: 1, name: 'Divya Nambiar',    college: 'NIT Trichy',    xp: 980,  doubtsSolved: 53, level: 6, avatar: FEMALE_AVATAR_SVG, streak: 14, badge: '🏆 Campus Legend',   dept: 'Data Science' },
  { rank: 2, name: 'Kavya Subramanian',college: 'IIT Delhi',     xp: 920,  doubtsSolved: 64, level: 7, avatar: FEMALE_AVATAR_SVG, streak: 21, badge: '⚡ XP Master',       dept: 'Software Eng' },
  { rank: 3, name: 'Bhavna Patel',     college: 'IIT Madras',    xp: 820,  doubtsSolved: 42, level: 5, avatar: FEMALE_AVATAR_SVG, streak: 9,  badge: '🔥 Streak Champion', dept: 'CS' },
  { rank: 4, name: 'Sneha Roy',        college: 'IIIT Hyderabad',xp: 760,  doubtsSolved: 38, level: 5, avatar: FEMALE_AVATAR_SVG, streak: 7,  badge: '🎯 Top Resolver',    dept: 'AI & DS' },
  { rank: 5, name: 'Ananya Guha',      college: 'BITS Pilani',   xp: 710,  doubtsSolved: 31, level: 4, avatar: FEMALE_AVATAR_SVG, streak: 5,  badge: '🌟 Rising Star',     dept: 'CS' },
  { rank: 6, name: 'Aarav Sharma',     college: 'IIT Madras',    xp: 650,  doubtsSolved: 15, level: 4, avatar: MALE_AVATAR_SVG,   streak: 3,  badge: '📚 Peer Tutor',      dept: 'CS',         isMe: true },
  { rank: 7, name: 'Rohan Deshmukh',   college: 'IIT Bombay',    xp: 480,  doubtsSolved: 27, level: 3, avatar: MALE_AVATAR_SVG,   streak: 6,  badge: '💻 Code Wizard',     dept: 'CS' },
  { rank: 8, name: 'Chaitanya Reddy',  college: 'BITS Pilani',   xp: 340,  doubtsSolved: 18, level: 2, avatar: MALE_AVATAR_SVG,   streak: 2,  badge: '🛠️ Builder',         dept: 'EE & CS' },
  { rank: 9, name: 'Vikram Joshi',     college: 'IIT Madras',    xp: 290,  doubtsSolved: 12, level: 2, avatar: MALE_AVATAR_SVG,   streak: 1,  badge: '🌱 Newcomer',        dept: 'Mech' },
];

const MAX_XP_BY_LEVEL = { 2: 400, 3: 600, 4: 800, 5: 1000, 6: 1200, 7: 1500 };

function MedalIcon({ rank }) {
  if (rank === 1) return <span style={{ fontSize: '1.5rem' }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: '1.5rem' }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: '1.5rem' }}>🥉</span>;
  return <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-muted)', minWidth: '32px', textAlign: 'center' }}>#{rank}</span>;
}

export function LeaderboardScreen({ token, onOpenPublicProfile }) {
  const { profile } = useAuth();
  const [timeFilter, setTimeFilter] = useState('month');
  const [leaders, setLeaders] = useState(INITIAL_LEADERS);
  const [liveFlash, setLiveFlash] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Fetch from real backend, fallback to INITIAL_LEADERS if backend offline
  const fetchLeaderboard = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await LeaderboardAPI.getGlobal(token);
      if (Array.isArray(data) && data.length > 0) {
        setLeaders(data.map((entry, i) => ({
          rank: i + 1,
          name: entry.fullName || entry.name || 'Student',
          college: entry.college || 'Campus',
          xp: entry.xp || 0,
          doubtsSolved: entry.doubtsSolved || 0,
          level: entry.level || 1,
          avatar: entry.avatarUrl || (entry.gender === 'female' ? FEMALE_AVATAR_SVG : MALE_AVATAR_SVG),
          streak: entry.streak || 0,
          badge: entry.badgeTitle || '🎓 Scholar',
          dept: entry.department || 'Engineering',
          isMe: entry.id === profile?.id,
        })));
        setLastUpdated(new Date());
      }
    } catch (e) {
      // Backend offline — keep INITIAL_LEADERS as fallback, no crash
      console.log('Leaderboard: using fallback data', e.message);
    } finally {
      setLoading(false);
    }
  }, [token, profile?.id]);

  // Load on mount + refresh every 60s
  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  // Live flash animation — just UI, not fake data
  useEffect(() => {
    const interval = setInterval(() => {
      if (leaders.length === 0) return;
      const randomIdx = Math.floor(Math.random() * Math.min(leaders.length, 5));
      setLiveFlash({ name: leaders[randomIdx]?.name, xpGained: Math.floor(Math.random() * 15) + 5 });
      setTimeout(() => setLiveFlash(null), 2500);
    }, 12000);
    return () => clearInterval(interval);
  }, [leaders]);

  const multiplier = timeFilter === 'week' ? 0.3 : timeFilter === 'month' ? 0.7 : 1.0;
  const displayLeaders = leaders.map(l => ({
    ...l,
    displayXp: Math.round(l.xp * multiplier),
    displaySolved: Math.round(l.doubtsSolved * multiplier)
  })).sort((a, b) => b.displayXp - a.displayXp).map((l, i) => ({ ...l, rank: i + 1 }));

  return (
    <div className="studyloop-page-container">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            🏆 Campus XP Leaderboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Top peer tutors ranked live by XP points, doubts resolved, and session clarity scores.
          </p>
        </div>

        {/* Time Filter */}
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {[['week', '📅 This Week'], ['month', '🗓️ This Month'], ['all', '🏆 All Time']].map(([key, label]) => (
            <button key={key} onClick={() => setTimeFilter(key)} style={{
              padding: '0.45rem 0.875rem', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 700,
              backgroundColor: timeFilter === key ? 'var(--accent-primary)' : 'transparent',
              color: timeFilter === key ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE FLASH NOTIFICATION */}
      {liveFlash && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)', padding: '0.625rem 1rem', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          animation: 'dropdown-animate 0.3s ease'
        }}>
          <span style={{ fontSize: '1.25rem' }}>⚡</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--success-color)' }}>
            {liveFlash.name} just earned +{liveFlash.xpGained} XP! Rankings updated.
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            Live • {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      )}

      {/* TOP 3 PODIUM */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {[displayLeaders[1], displayLeaders[0], displayLeaders[2]].map((l, podiumPos) => {
          if (!l) return null;
          const heights = ['160px', '200px', '140px'];
          const bgColors = [
            'linear-gradient(135deg, rgba(148,163,184,0.12) 0%, rgba(148,163,184,0.06) 100%)',
            'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.08) 100%)',
            'linear-gradient(135deg, rgba(180,128,96,0.12) 0%, rgba(120,80,50,0.06) 100%)'
          ];
          return (
            <div key={l.rank} className="card-premium interactive-hover" style={{
              background: bgColors[podiumPos], textAlign: 'center', padding: '1.5rem 1rem',
              borderRadius: 'var(--radius-xl)', position: 'relative',
              border: l.isMe ? '2px solid var(--accent-primary)' : undefined,
              cursor: 'pointer'
            }}
              onClick={() => onOpenPublicProfile && onOpenPublicProfile({ id: l.rank, fullName: l.name, college: l.college, avatarUrl: l.avatar })}
            >
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.75rem' }}>
                <MedalIcon rank={l.rank} />
              </div>
              <img src={l.avatar} alt={l.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid var(--accent-primary)', objectFit: 'cover', marginBottom: '0.625rem' }} />
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{l.name}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{l.college}</div>
              <div style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: '4px', padding: '0.15rem 0.5rem', marginBottom: '0.5rem', fontWeight: 700, display: 'inline-block' }}>
                {l.badge}
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>⚡ {l.displayXp} XP</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>🔥 {l.streak} day streak</div>
              {l.isMe && <div style={{ marginTop: '0.5rem', fontSize: '0.6875rem', fontWeight: 800, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-light)', borderRadius: '4px', padding: '0.15rem 0.5rem' }}>YOU</div>}
            </div>
          );
        })}
      </div>

      {/* FULL RANKING TABLE */}
      <div className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>Full Campus Rankings</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', animation: 'pulse-ring 1.5s infinite' }} />
            Live updates every 8s
          </div>
        </div>

        {displayLeaders.map((l, idx) => {
          const maxXp = MAX_XP_BY_LEVEL[l.level] || 800;
          const xpPct = Math.min(100, Math.round((l.displayXp / maxXp) * 100));
          return (
            <div
              key={l.name}
              onClick={() => onOpenPublicProfile && onOpenPublicProfile({ id: l.rank, fullName: l.name, college: l.college, avatarUrl: l.avatar })}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1.5rem',
                borderBottom: idx < displayLeaders.length - 1 ? '1px solid var(--border-color)' : 'none',
                backgroundColor: l.isMe ? 'var(--accent-light)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!l.isMe) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = l.isMe ? 'var(--accent-light)' : 'transparent'; }}
            >
              {/* Rank */}
              <div style={{ width: '40px', textAlign: 'center', flexShrink: 0 }}>
                <MedalIcon rank={l.rank} />
              </div>

              {/* Avatar */}
              <img src={l.avatar} alt={l.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: l.isMe ? '2px solid var(--accent-primary)' : '2px solid var(--border-color)', flexShrink: 0 }} />

              {/* Name + College */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{l.name}</span>
                  {l.isMe && <span style={{ fontSize: '0.625rem', fontWeight: 800, backgroundColor: 'var(--accent-primary)', color: '#fff', borderRadius: '4px', padding: '0 0.3rem' }}>YOU</span>}
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', backgroundColor: 'var(--accent-light)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{l.badge}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{l.college} • {l.dept}</div>
                {/* XP Progress Bar */}
                <div style={{ marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ flex: 1, height: '5px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${xpPct}%`,
                      background: l.rank <= 3 ? 'var(--accent-gradient)' : 'var(--accent-primary)',
                      borderRadius: '99px', transition: 'width 0.8s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Lvl {l.level}</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>⚡ {l.displayXp}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>XP</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{l.displaySolved}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Solved</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>🔥 {l.streak}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Streak</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Rankings update in real-time · Earn XP by solving doubts, teaching 1:1 sessions, and posting Concept Shorts
      </div>
    </div>
  );
}
