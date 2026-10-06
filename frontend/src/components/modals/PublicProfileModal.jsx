import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';
import { Award, BookOpen, Briefcase, Building2, Calendar, Check, CheckCircle, Code, ExternalLink, Eye, FileText, Github, Globe, GraduationCap, Heart, MessageCircle, MessageSquare, Play, PlayCircle, Send, Share2, Star, ThumbsUp, Tv2, UserPlus, X } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function PublicProfileModal({ user, currentUserId, token, onClose, onStartChat, onOpenUserList, onOpenBookingModal }) {
  const { profile, updateProfileState } = useAuth();
  const [profileTab, setProfileTab] = useState('overview'); // 'overview', 'shorts', 'reviews'
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('not_connected'); // 'not_connected', 'pending', 'connected'
  const [endorsedSkillsMap, setEndorsedSkillsMap] = useState({});

  if (!user) return null;

  const isOwnProfile = user.id === currentUserId || user.id === profile?.id;
  const fullName = user.fullName || 'Student Peer';
  const username = user.username || user.fullName?.toLowerCase().replace(/\s+/g, '_') || 'student_peer';
  const college = user.college || 'IIT Madras';
  const department = user.department || 'Computer Science & Engineering';
  const year = user.year || 3;
  const avatarUrl = user.avatarUrl || (user.gender === 'female' ? FEMALE_AVATAR_SVG : MALE_AVATAR_SVG);
  const headline = user.headline || `Undergrad Student @ ${college} • Peer Mentor`;
  const bio = user.bio || `Passionate about ${department} and helping fellow students grasp tough academic concepts. Active in campus doubt solving and 1:1 peer sessions.`;
  const mutuals = user.mutuals || 14;
  const followersCount = user.followersCount || 1420;
  const followingCount = user.followingCount || 240;
  const doubtsSolved = user.doubtsSolved || 38;
  const rating = user.rating || 4.92;
  const xp = user.xp || 820;
  const level = user.level || 5;

  const skillsList = user.skills && user.skills.length > 0 
    ? user.skills 
    : ['Python', 'Data Structures & Algorithms', 'Machine Learning', 'Java & OOP', 'Database Systems'];

  const sampleShorts = [
    { id: 's-1', title: 'Recursion Trees in 60s', views: '2.4K', likes: 182, thumb: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4' },
    { id: 's-2', title: 'Spring Boot IoC Explained', views: '3.8K', likes: 295, thumb: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4' },
    { id: 's-3', title: 'Gradient Descent in 3D', views: '4.1K', likes: 410, thumb: 'https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4' }
  ];

  const sampleReviews = [
    { author: 'Chaitanya Reddy', college: 'BITS Pilani', rating: 5, date: '2 days ago', text: 'Super clear explanations on Dynamic Programming memoization. Solved my doubts in under 20 mins!' },
    { author: 'Divya Nambiar', college: 'NIT Trichy', rating: 5, date: '1 week ago', text: 'Patient tutor with great real-world examples in SQL indexing and PostgreSQL query plans.' }
  ];

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    if (profile) {
      updateProfileState({ 
        ...profile, 
        followingCount: nextState ? (profile.followingCount || 5) + 1 : Math.max(0, (profile.followingCount || 5) - 1) 
      });
    }
  };

  const handleToggleConnect = () => {
    if (connectionStatus === 'not_connected') {
      setConnectionStatus('pending');
      toast.success(`🤝 Connection request sent to ${fullName}!`);
    } else if (connectionStatus === 'pending') {
      setConnectionStatus('not_connected');
    }
  };

  const handleEndorse = (skill) => {
    if (endorsedSkillsMap[skill]) return;
    setEndorsedSkillsMap(prev => ({ ...prev, [skill]: true }));
    if (profile) {
      updateProfileState({ ...profile, coins: (profile.coins || 45) + 5, xp: (profile.xp || 650) + 10 });
    }
    toast.success(`🌟 You endorsed ${fullName} for ${skill}! +5 Peer Coins and +10 XP awarded.`);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div 
        className="card-premium" 
        style={{ width: '100%', maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '24px', backgroundColor: 'var(--bg-elevated)', padding: 0, position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)', border: '1px solid var(--border-color)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* TOP COVER BANNER */}
        <div style={{ height: '150px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)', position: 'relative', borderRadius: '24px 24px 0 0' }}>
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="btn-icon" 
            style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.5)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>

          <span style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)' }}>
            🎓 Verified Campus Student Profile
          </span>
        </div>

        {/* PROFILE HEADER & AVATAR INFO */}
        <div style={{ padding: '0 2rem 1.5rem 2rem', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Avatar with Online Dot */}
            <div style={{ position: 'relative' }}>
              <img 
                src={avatarUrl} 
                alt={fullName} 
                style={{ width: '104px', height: '104px', borderRadius: '50%', border: '4px solid var(--bg-elevated)', objectFit: 'cover', backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-md)' }} 
              />
              <span style={{ position: 'absolute', bottom: '6px', right: '6px', width: '18px', height: '18px', backgroundColor: '#10b981', border: '3px solid var(--bg-elevated)', borderRadius: '50%' }} title="Online now" />
            </div>

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleToggleConnect} 
                  className={`btn ${connectionStatus === 'connected' ? 'btn-secondary' : 'btn-accent'}`}
                  style={{ fontSize: '0.8125rem', padding: '0.55rem 1.1rem', fontWeight: 800 }}
                >
                  <UserPlus size={14} /> {connectionStatus === 'pending' ? 'Pending ⏳' : connectionStatus === 'connected' ? 'Connected ✓' : 'Connect'}
                </button>

                <button 
                  onClick={handleToggleFollow} 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8125rem', padding: '0.55rem 1rem', fontWeight: 700, color: isFollowing ? 'var(--accent-primary)' : 'inherit' }}
                >
                  {isFollowing ? 'Following ✓' : '+ Follow'}
                </button>

                <button 
                  onClick={() => {
                    onClose();
                    if (onStartChat) {
                      onStartChat(user);
                    }
                  }} 
                  className="btn btn-primary" 
                  style={{ fontSize: '0.8125rem', padding: '0.55rem 1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <MessageSquare size={14} /> Direct Message
                </button>
              </div>
            )}
          </div>

          {/* Identity & Badges */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {fullName}
              </h2>
              <span className="tag tag-accent" style={{ fontSize: '0.6875rem', fontWeight: 800 }}>
                🛡️ Verified
              </span>
              <span className="tag tag-success" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                ⚡ Level {level}
              </span>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              @{username} • 📍 Chennai, India
            </div>

            <div style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.5rem' }}>
              {headline}
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>{college} • {department} (Year {year})</span>
            </div>
          </div>

          {/* STUDYLOOP PROFILE METRIC COUNTERS BAR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            
            <div 
              style={{ textAlign: 'center', cursor: onOpenUserList ? 'pointer' : 'default' }}
              onClick={() => onOpenUserList && onOpenUserList(`${fullName}'s Followers`, user.id)}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>{followersCount.toLocaleString()}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Followers</div>
            </div>

            <div 
              style={{ textAlign: 'center', cursor: onOpenUserList ? 'pointer' : 'default' }}
              onClick={() => onOpenUserList && onOpenUserList(`${fullName}'s Following`, user.id)}
            >
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>{followingCount.toLocaleString()}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Following</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{mutuals}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Mutuals</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success-color)' }}>{doubtsSolved}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Doubts Solved</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--warning-color)' }}>⭐ {rating}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Clarity Score</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-primary)' }}>⚡ {xp}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>XP Points</div>
            </div>

          </div>

          {/* SUBTAB SELECTOR — STUDYLOOP PROFILE TABS */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem', gap: '1.5rem' }}>
            <button
              onClick={() => setProfileTab('overview')}
              style={{
                padding: '0.625rem 0.25rem',
                border: 'none',
                borderBottom: profileTab === 'overview' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: profileTab === 'overview' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <FileText size={15} /> Overview & Skills
            </button>

            <button
              onClick={() => setProfileTab('shorts')}
              style={{
                padding: '0.625rem 0.25rem',
                border: 'none',
                borderBottom: profileTab === 'shorts' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: profileTab === 'shorts' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <Tv2 size={15} /> Concept Shorts ({sampleShorts.length})
            </button>

            <button
              onClick={() => setProfileTab('reviews')}
              style={{
                padding: '0.625rem 0.25rem',
                border: 'none',
                borderBottom: profileTab === 'reviews' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: profileTab === 'reviews' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <Star size={15} /> Reviews ({sampleReviews.length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW, BIO & SKILLS */}
          {profileTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* About Summary */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 className="font-serif" style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  About & Academic Focus
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {bio}
                </p>
              </div>

              {/* Education Credentials */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 className="font-serif" style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <GraduationCap size={16} style={{ color: 'var(--accent-primary)' }} /> Education & University
                </h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', border: '1px solid var(--border-color)' }}>
                    🏛️
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{college}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Bachelor of Technology (B.Tech) • {department}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '0.2rem' }}>CGPA: 9.35 / 10.0 • Dean's List Awardee</div>
                  </div>
                </div>
              </div>

              {/* Skills & Endorsements */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 className="font-serif" style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Award size={16} style={{ color: 'var(--warning-color)' }} /> Verified Skills & Endorsements
                  </h4>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Click to endorse (+5🪙)</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {skillsList.map((skill, idx) => {
                    const isEndorsed = endorsedSkillsMap[skill];
                    return (
                      <button
                        key={idx}
                        onClick={() => handleEndorse(skill)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.45rem 0.875rem',
                          borderRadius: 'var(--radius-full)',
                          border: isEndorsed ? '1px solid var(--success-color)' : '1px solid var(--border-color)',
                          backgroundColor: isEndorsed ? 'var(--accent-light)' : 'var(--bg-secondary)',
                          color: isEndorsed ? 'var(--success-color)' : 'var(--text-primary)',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <span>{skill}</span>
                        <span style={{ fontSize: '0.6875rem', opacity: 0.8, backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.1rem 0.35rem', borderRadius: 'var(--radius-full)' }}>
                          {isEndorsed ? '✓ Endorsed' : `⭐ ${18 + idx * 7}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CONCEPT SHORTS GRID */}
          {profileTab === 'shorts' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {sampleShorts.map(s => (
                <div key={s.id} className="card-premium interactive-hover" style={{ padding: 0, overflow: 'hidden', borderRadius: '16px', position: 'relative' }}>
                  <div style={{ height: '220px', backgroundColor: '#000000', position: 'relative' }}>
                    <video src={s.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlayCircle size={36} style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
                    </div>
                    <span style={{ position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      👁️ {s.views}
                    </span>
                    <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#f43f5e', fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      ❤️ {s.likes}
                    </span>
                  </div>
                  <div style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REVIEWS & RECOMMENDATIONS */}
          {profileTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sampleReviews.map((rev, i) => (
                <div key={i} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{rev.author}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> • {rev.college}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--warning-color)', fontWeight: 800 }}>
                      {'⭐'.repeat(rev.rating)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', lineHeight: 1.4 }}>
                    "{rev.text}"
                  </p>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

