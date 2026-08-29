import { useAuth } from '../../context/AuthContext';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Award, BarChart2, Bookmark, CheckCircle, Clock, Copy, Eye, Filter, Heart, MessageCircle, MessageSquare, Music, Pause, Play, Plus, Send, Share2, Sparkles, Trash2, TrendingUp, Upload, Volume2, VolumeX, X } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function ReelsScreen({ token, setActiveTab, setActiveChatId, setChatPeer, socket, setWsMessages }) {
  const { profile, updateProfileState } = useAuth();
  const [reelsViewTab, setReelsViewTab] = useState(() => localStorage.getItem('studyloop_reels_view_tab') || 'player');
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [likesMap, setLikesMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // New Video Upload Form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Java');
  const [uploadTags, setUploadTags] = useState('#Algorithms #StudyTips');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadVideoUrl, setUploadVideoUrl] = useState('');
  const [uploadVisibility, setUploadVisibility] = useState('public');

  useEffect(() => {
    localStorage.setItem('studyloop_reels_view_tab', reelsViewTab);
  }, [reelsViewTab]);

  // Master Reels & Videos Repository
  const [reels, setReels] = useState([
    {
      id: 'r-1',
      title: '3 Tricks to solve Recursion Tree problems fast in Java ⚡ #Algorithms #Java',
      description: 'Break down exponential recursion trees into simple master theorem levels in under 60 seconds.',
      author: 'Aarav Sharma',
      college: 'IIT Madras',
      avatarUrl: MALE_AVATAR_SVG,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      likes: 154,
      shares: 42,
      views: 1420,
      reach: 3850,
      duration: '0:58',
      date: '28 Aug 2026',
      visibility: 'public',
      isMyUpload: true,
      comments: [
        { author: 'Bhavna Patel', text: 'This helper tree recursion trick saved me in midterms! 🔥' },
        { author: 'Chaitanya Reddy', text: 'Clean breakdown. Can you do Dynamic Programming memoization next?' }
      ]
    },
    {
      id: 'r-2',
      title: 'How Spring Boot Inversion of Control & @Autowired work under 60s ☕ #SpringBoot',
      description: 'Visual walkthrough of Bean lifecycle in ApplicationContext with zero boilerplate.',
      author: 'Bhavna Patel',
      college: 'IIT Madras',
      avatarUrl: FEMALE_AVATAR_SVG,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      likes: 218,
      shares: 67,
      views: 2310,
      reach: 5200,
      duration: '0:45',
      date: '26 Aug 2026',
      visibility: 'public',
      isMyUpload: false,
      comments: [
        { author: 'Aarav Sharma', text: 'Best 60-second explanation of ApplicationContext!' }
      ]
    },
    {
      id: 'r-3',
      title: 'Visualizing Gradient Descent & Contour Cost Surfaces in 3D 📐 #MachineLearning',
      description: 'Why momentum helps gradient descent escape saddle points and oscillations.',
      author: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      avatarUrl: MALE_AVATAR_SVG,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4',
      likes: 312,
      shares: 89,
      views: 3490,
      reach: 8100,
      duration: '0:52',
      date: '24 Aug 2026',
      visibility: 'public',
      isMyUpload: false,
      comments: [
        { author: 'Divya Nambiar', text: 'The learning rate oscillation visual was super clear.' }
      ]
    },
    {
      id: 'r-4',
      title: 'SQL Indexing Secrets: B-Trees vs Hash Indexes Explained 🚀 #DBMS #SQL',
      description: 'When does a composite index fail to accelerate range queries in PostgreSQL?',
      author: 'Aarav Sharma',
      college: 'IIT Madras',
      avatarUrl: MALE_AVATAR_SVG,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      likes: 189,
      shares: 51,
      views: 1890,
      reach: 4600,
      duration: '0:50',
      date: '22 Aug 2026',
      visibility: 'public',
      isMyUpload: true,
      comments: [
        { author: 'Kavya Subramanian', text: 'Clear explanation on Leftmost Prefix rule!' }
      ]
    }
  ]);

  const currentReel = reels[currentReelIndex] || reels[0];
  const isLiked = likesMap[currentReel.id] || false;
  const isSaved = savedMap[currentReel.id] || false;

  // Keyboard navigation for smooth up/down reel browsing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showCommentsModal || showUploadModal || showShareModal) return;
      if (reelsViewTab !== 'player') return;
      if (e.key === 'ArrowDown') {
        setCurrentReelIndex(prev => (prev < reels.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        setCurrentReelIndex(prev => (prev > 0 ? prev - 1 : reels.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reels.length, showCommentsModal, showUploadModal, showShareModal, reelsViewTab]);

  const handleToggleLike = () => {
    const nextLiked = !isLiked;
    setLikesMap(prev => ({ ...prev, [currentReel.id]: nextLiked }));
    setReels(prev => prev.map(r => r.id === currentReel.id ? { ...r, likes: nextLiked ? r.likes + 1 : r.likes - 1 } : r));
    if (nextLiked && profile) {
      updateProfileState({ ...profile, xp: (profile.xp || 650) + 2 });
    }
  };

  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setSavedMap(prev => ({ ...prev, [currentReel.id]: nextSaved }));
    alert(nextSaved ? "🔖 Reel saved to your Study Bookmarks!" : "Removed from Bookmarks");
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = { author: 'You (Aarav Sharma)', text: commentInput.trim() };
    setReels(prev => prev.map(r => r.id === currentReel.id ? { ...r, comments: [...r.comments, newComment] } : r));
    setCommentInput('');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const sampleVideos = [
      'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4'
    ];
    const pickedVideo = uploadVideoUrl.trim() || sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

    const newReel = {
      id: `r-${Date.now()}`,
      title: `${uploadTitle.trim()} ${uploadTags.trim()}`,
      description: uploadDesc.trim() || 'Concept breakdown uploaded by campus peer tutor.',
      author: profile?.fullName || 'Aarav Sharma',
      college: profile?.college || 'IIT Madras',
      avatarUrl: profile?.avatarUrl || MALE_AVATAR_SVG,
      videoUrl: pickedVideo,
      likes: 1,
      shares: 0,
      views: 12,
      reach: 85,
      duration: '0:54',
      date: 'Just now',
      visibility: uploadVisibility,
      isMyUpload: true,
      comments: []
    };

    setReels(prev => [newReel, ...prev]);
    if (profile) {
      updateProfileState({ ...profile, xp: (profile.xp || 650) + 25, coins: (profile.coins || 45) + 10 });
    }

    setShowUploadModal(false);
    setUploadTitle('');
    setUploadDesc('');
    setUploadVideoUrl('');
    alert("🎉 Concept Video Short published successfully! +25 XP and +10 Peer Coins awarded.");
  };

  const handleDeleteMyVideo = (videoId) => {
    if (confirm("Are you sure you want to delete this concept video?")) {
      setReels(prev => prev.filter(r => r.id !== videoId));
    }
  };

  // Filter user's uploaded videos
  const myUploadedVideos = reels.filter(r => r.isMyUpload || r.author === 'Aarav Sharma');
  const totalMyViews = myUploadedVideos.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalMyLikes = myUploadedVideos.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalMyReach = myUploadedVideos.reduce((acc, curr) => acc + (curr.reach || 0), 0);

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* TOP NAVIGATION BAR */}
      <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', zIndex: 100 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="btn btn-secondary" 
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 700 }}
          >
            ← Back to Student Profile
          </button>
          
          <h2 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡ Shorts & Video Studio</span>
          </h2>
        </div>

        {/* View Tabs & Upload Button */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setReelsViewTab('player')}
              style={{
                padding: '0.45rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: 700,
                backgroundColor: reelsViewTab === 'player' ? 'var(--bg-secondary)' : 'transparent',
                color: reelsViewTab === 'player' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                boxShadow: reelsViewTab === 'player' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              📱 Shorts Feed (9:16)
            </button>

            <button
              onClick={() => setReelsViewTab('studio')}
              style={{
                padding: '0.45rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: 700,
                backgroundColor: reelsViewTab === 'studio' ? 'var(--bg-secondary)' : 'transparent',
                color: reelsViewTab === 'studio' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                boxShadow: reelsViewTab === 'studio' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              🎬 My Studio & Uploads ({myUploadedVideos.length})
            </button>
          </div>

          <button 
            onClick={() => setShowUploadModal(true)} 
            className="btn btn-accent" 
            style={{ fontWeight: 800, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: 'var(--shadow-glow)' }}
          >
            <Upload size={15} /> Upload Video Short 🚀
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: VERTICAL REELS / SHORTS PLAYER FEED (TIKTOK / INSTA / MOJ STYLE) */}
      {/* ========================================================================= */}
      {reelsViewTab === 'player' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative' }}>
          
          {/* REEL 9:16 VERTICAL CONTAINER */}
          <div className="reel-frame" style={{ width: '100%', maxWidth: '420px', height: '82vh', minHeight: '540px', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)', border: '2px solid var(--border-color)', backgroundColor: '#000000' }}>
            
            <video 
              key={currentReel.id}
              src={currentReel.videoUrl} 
              autoPlay 
              loop 
              muted={isMuted}
              playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000000' }} 
            />

            {/* Top Reel Counter */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 50, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)' }}>
              🔥 Short {currentReelIndex + 1} / {reels.length}
            </div>

            {/* Right Floating Action Stack */}
            <div className="reel-action-stack" style={{ position: 'absolute', right: '0.875rem', bottom: '5.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', alignItems: 'center', zIndex: 50 }}>
              
              {/* Like */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <button 
                  onClick={handleToggleLike} 
                  className="reel-action-btn" 
                  style={{ color: isLiked ? '#f43f5e' : '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                >
                  <Heart size={22} fill={isLiked ? '#f43f5e' : 'none'} />
                </button>
                <span style={{ fontSize: '0.6875rem', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{currentReel.likes}</span>
              </div>

              {/* Comments */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <button 
                  onClick={() => setShowCommentsModal(true)} 
                  className="reel-action-btn"
                  style={{ color: '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                >
                  <MessageCircle size={22} />
                </button>
                <span style={{ fontSize: '0.6875rem', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{currentReel.comments.length}</span>
              </div>

              {/* Save */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <button 
                  onClick={handleToggleSave} 
                  className="reel-action-btn"
                  style={{ color: isSaved ? '#f59e0b' : '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                >
                  <Bookmark size={20} fill={isSaved ? '#f59e0b' : 'none'} />
                </button>
                <span style={{ fontSize: '0.6875rem', color: '#ffffff', fontWeight: 700 }}>Save</span>
              </div>

              {/* Share */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <button 
                  onClick={() => setShowShareModal(true)} 
                  className="reel-action-btn"
                  style={{ color: '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
                >
                  <Share2 size={20} />
                </button>
                <span style={{ fontSize: '0.6875rem', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{currentReel.shares}</span>
              </div>

              {/* Mute / Unmute */}
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="reel-action-btn"
                style={{ color: '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>

            {/* Bottom Overlay Info */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.25rem 1.25rem 1.25rem', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 65%, transparent 100%)', color: '#ffffff', zIndex: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <img src={currentReel.avatarUrl} alt={currentReel.author} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#ffffff' }}>@{currentReel.author}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.8)' }}>{currentReel.college}</div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setChatPeer({ fullName: currentReel.author, college: currentReel.college, avatarUrl: currentReel.avatarUrl });
                    setActiveChatId(`chat-${currentReel.id}`);
                    setActiveTab('chat');
                  }} 
                  className="btn btn-accent" 
                  style={{ fontSize: '0.6875rem', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)' }}
                >
                  Message
                </button>
              </div>

              <p style={{ fontSize: '0.8125rem', lineHeight: 1.4, margin: '0 0 0.5rem 0', color: '#f8fafc', fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                {currentReel.title}
              </p>

              {/* Sound Audio Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.8)' }}>
                <span>🎵 Original Academic Audio • StudyLoop Shorts</span>
              </div>
            </div>

          </div>

          {/* Next / Previous Stepper Floating Buttons */}
          <div style={{ position: 'absolute', right: '3rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 100 }}>
            <button 
              onClick={() => setCurrentReelIndex(prev => (prev > 0 ? prev - 1 : reels.length - 1))}
              className="btn-icon" 
              style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', cursor: 'pointer', fontSize: '1rem' }}
              title="Previous Reel (Arrow Up)"
            >
              ▲
            </button>
            <button 
              onClick={() => setCurrentReelIndex(prev => (prev < reels.length - 1 ? prev + 1 : 0))}
              className="btn-icon" 
              style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', cursor: 'pointer', fontSize: '1rem' }}
              title="Next Reel (Arrow Down)"
            >
              ▼
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: CREATOR VIDEO STUDIO & UPLOADED GALLERY (YOUTUBE STUDIO STYLE)   */}
      {/* ========================================================================= */}
      {reelsViewTab === 'studio' && (
        <div style={{ padding: '2rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* 4 CREATOR REACH & ENGAGEMENT STATS */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="card-premium">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Total Video Views</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{totalMyViews.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', marginTop: '0.25rem', fontWeight: 600 }}>↑ +24% this week</div>
            </div>

            <div className="card-premium">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Estimated Audience Reach</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-color)' }}>{totalMyReach.toLocaleString()}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Across 14 Universities</div>
            </div>

            <div className="card-premium">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Peer Likes & Claps</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f43f5e' }}>{totalMyLikes.toLocaleString()} ❤️</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>98.4% Like Ratio</div>
            </div>

            <div className="card-premium">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Videos Stored & Published</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{myUploadedVideos.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.25rem', fontWeight: 700 }}>⚡ 100% Monetized & Public</div>
            </div>
          </div>

          {/* STORED VIDEOS STEP-BY-STEP GALLERY TABLE */}
          <div className="card-premium" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                  My Uploaded Concept Videos & Shorts
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Manage stored videos, track live student reach analytics, and edit metadata.
                </p>
              </div>

              <button onClick={() => setShowUploadModal(true)} className="btn btn-accent" style={{ fontWeight: 800 }}>
                <Upload size={16} /> Upload New Video 🚀
              </button>
            </div>

            {/* Video List Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Video / Short</th>
                    <th>Visibility</th>
                    <th>Date Published</th>
                    <th>Views</th>
                    <th>Likes</th>
                    <th>Audience Reach</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myUploadedVideos.map(vid => (
                    <tr key={vid.id}>
                      <td style={{ minWidth: '280px' }}>
                        <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                          <div style={{ position: 'relative', width: '80px', height: '48px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#000000', flexShrink: 0 }}>
                            <video src={vid.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                            <span style={{ position: 'absolute', bottom: '2px', right: '3px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '0.5625rem', fontWeight: 800, padding: '0.1rem 0.25rem', borderRadius: '2px' }}>
                              {vid.duration || '0:55'}
                            </span>
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{vid.title}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{vid.description || 'Quick concept walkthrough'}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="tag tag-success" style={{ fontSize: '0.6875rem' }}>
                          🌐 {vid.visibility.toUpperCase()}
                        </span>
                      </td>

                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {vid.date}
                      </td>

                      <td style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.875rem' }}>
                        {vid.views.toLocaleString()}
                      </td>

                      <td style={{ fontWeight: 700, color: '#f43f5e', fontSize: '0.875rem' }}>
                        {vid.likes} ❤️
                      </td>

                      <td style={{ fontWeight: 700, color: 'var(--success-color)', fontSize: '0.875rem' }}>
                        {vid.reach?.toLocaleString() || '1.2K'}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            onClick={() => {
                              const idx = reels.findIndex(r => r.id === vid.id);
                              if (idx !== -1) setCurrentReelIndex(idx);
                              setReelsViewTab('player');
                            }} 
                            className="btn btn-secondary" 
                            style={{ fontSize: '0.6875rem', padding: '0.3rem 0.6rem' }}
                            title="Play in Shorts Feed"
                          >
                            <Play size={12} /> Play
                          </button>
                          <button 
                            onClick={() => handleDeleteMyVideo(vid.id)} 
                            className="btn btn-icon" 
                            style={{ padding: '0.3rem', color: 'var(--danger-color)' }}
                            title="Delete Video"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

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

      {/* SHARE MODAL */}
      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0 }}>Share Concept Reel</h3>
              <button onClick={() => setShowShareModal(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert("🔗 Concept Short link copied to clipboard!");
                  setShowShareModal(false);
                }} 
                className="btn btn-accent" 
                style={{ padding: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Copy size={16} /> Copy Reel Link
              </button>

              <button 
                onClick={() => {
                  setActiveTab('chat');
                  setShowShareModal(false);
                }} 
                className="btn btn-secondary" 
                style={{ padding: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <MessageSquare size={16} /> Send via Direct Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD CONCEPT SHORT / VIDEO MODAL (YOUTUBE STUDIO STYLE) */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '560px', padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span className="tag tag-accent" style={{ fontSize: '0.6875rem', fontWeight: 800 }}>🎬 StudyLoop Creator Studio</span>
                <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>Upload Concept Video Short</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="btn-icon"><X size={20} /></button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label className="label">Video Title (Catchy Academic Hook)</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. 3 Tricks to solve Recursion Tree problems fast in Java" 
                  value={uploadTitle} 
                  onChange={e => setUploadTitle(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Subject Category</label>
                  <select className="input" value={uploadSubject} onChange={e => setUploadSubject(e.target.value)}>
                    <option value="Java">Java & OOP</option>
                    <option value="DSA">Data Structures & Algo</option>
                    <option value="ML">Machine Learning & AI</option>
                    <option value="DBMS">DBMS & SQL</option>
                    <option value="WebDev">React & Web Dev</option>
                    <option value="Math">Calculus & Linear Algebra</option>
                  </select>
                </div>

                <div>
                  <label className="label">Hashtags</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="#Java #Algorithms" 
                    value={uploadTags} 
                    onChange={e => setUploadTags(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="label">Description / Core Concept Takeaway</label>
                <textarea 
                  className="input" 
                  style={{ minHeight: '80px' }} 
                  placeholder="Summarize the concept or solution steps explained in this video..." 
                  value={uploadDesc} 
                  onChange={e => setUploadDesc(e.target.value)} 
                />
              </div>

              <div>
                <label className="label">Video Source / Local File</label>
                <div style={{ border: '2px dashed var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
                  <Upload size={24} style={{ color: 'var(--accent-primary)', margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Select Video File (MP4, WebM up to 100MB)</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Auto-optimizes to 9:16 vertical shorts format</div>
                </div>
              </div>

              <div>
                <label className="label">Visibility & Privacy</label>
                <select className="input" value={uploadVisibility} onChange={e => setUploadVisibility(e.target.value)}>
                  <option value="public">🌐 Public (Visible to all students & Leaderboard)</option>
                  <option value="campus">🏫 Campus Only ({profile?.college || 'IIT Madras'})</option>
                  <option value="private">🔒 Private (Only approved connections)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.875rem', fontWeight: 800 }}>
                  Publish Video Short 🚀 (+25 XP)
                </button>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
