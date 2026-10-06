import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, 
  Check, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Copy, 
  Filter, 
  Globe, 
  HelpCircle, 
  Lock, 
  MessageCircle, 
  MessageSquare, 
  Mic, 
  Phone, 
  PhoneCall, 
  Plus, 
  RotateCcw, 
  Search, 
  Send, 
  Share2, 
  Shield, 
  Sparkles, 
  ThumbsUp, 
  User, 
  Users, 
  Video, 
  Volume2, 
  X, 
  Zap 
} from 'lucide-react';
import { DoubtRoomsAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG } from '../../constants/avatars';

export function DoubtRoomsScreen({ token, activeRoomId, setActiveRoomId, socket, wsMessages, setWsMessages, startWebRtcCall, webrtcCall }) {
  const { profile } = useAuth();
  const toast = useToast();

  const [activeSubject, setActiveSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);

  // New Doubt Form state
  const [newDoubtTitle, setNewDoubtTitle] = useState('');
  const [newDoubtSubject, setNewDoubtSubject] = useState('Java');
  const [newDoubtLanguage, setNewDoubtLanguage] = useState('Telugu / English');
  const [newDoubtCode, setNewDoubtCode] = useState('');
  const [hasCodeSnippet, setHasCodeSnippet] = useState(false);

  // Community Doubts List (Open to everyone to post and resolve)
  const [doubts, setDoubts] = useState([
    {
      id: 'd-1',
      title: 'Java Producer-Consumer deadlock with wait() and notifyAll() synchronized blocks',
      description: 'When running 4 producer threads and 2 consumer threads, queue reaches full capacity but consumer threads remain stuck in WAITING state without waking up. Can someone explain why notifyAll() fails to release lock?',
      subject: 'Java',
      language: 'Telugu / English',
      creator: 'Aarav Sharma',
      creatorCollege: 'IIT Madras',
      creatorAvatar: MALE_AVATAR_SVG,
      createdAt: '10m ago',
      status: 'live_call', // 'live_call', 'open', 'resolved'
      participantsInCall: 4,
      codeSnippet: `synchronized(buffer) {
    while(buffer.isFull()) {
        buffer.wait(); // Producer gets stuck here permanently
    }
    buffer.add(item);
    buffer.notify(); // Should this be notifyAll()?
}`,
      replies: [
        {
          id: 'r-1',
          author: 'Bhavna Patel',
          college: 'IIT Madras',
          avatar: FEMALE_AVATAR_SVG,
          text: 'The issue is notify() only wakes a single arbitrary thread. If a producer wakes another producer instead of consumer, everyone sleeps. Change to buffer.notifyAll()!',
          time: '6m ago',
          upvotes: 8,
          isAnswer: true
        }
      ]
    },
    {
      id: 'd-2',
      title: 'React useEffect infinite re-render loop when updating object state in dependencies',
      description: 'Passed a config object into useEffect dependency array, but because a new object reference is created on every render, useEffect triggers infinitely. How do I fix this using useMemo or primitives?',
      subject: 'React',
      language: 'Telugu / English',
      creator: 'Chaitanya Reddy',
      creatorCollege: 'BITS Pilani',
      creatorAvatar: MALE_AVATAR_SVG,
      createdAt: '25m ago',
      status: 'live_call',
      participantsInCall: 3,
      codeSnippet: `const config = { limit: 10, offset: page * 10 };

useEffect(() => {
    fetchData(config);
}, [config]); // Infinite loop happens here!`,
      replies: [
        {
          id: 'r-2',
          author: 'Kavya Subramanian',
          college: 'IIT Delhi',
          avatar: FEMALE_AVATAR_SVG,
          text: 'Wrap config in useMemo: const config = useMemo(() => ({ limit: 10, offset: page * 10 }), [page]); or pass page directly in dependencies!',
          time: '18m ago',
          upvotes: 12,
          isAnswer: true
        }
      ]
    },
    {
      id: 'd-3',
      title: 'Dynamic Programming 0/1 Knapsack top-down memoization space optimization',
      description: 'Can someone do a quick 10-minute live call walkthrough explaining how to reduce the 2D DP array dp[n][w] to a single 1D array dp[w] by iterating weights backwards?',
      subject: 'Algorithms',
      language: 'Telugu / Hindi',
      creator: 'Rohan Deshmukh',
      creatorCollege: 'IIT Bombay',
      creatorAvatar: MALE_AVATAR_SVG,
      createdAt: '45m ago',
      status: 'open',
      participantsInCall: 0,
      codeSnippet: `// Standard 2D DP
dp[i][w] = Math.max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]);`,
      replies: []
    },
    {
      id: 'd-4',
      title: 'Database Normalization: Proving BCNF vs 3NF lossless join decomposition',
      description: 'Stuck on proving whether decomposing Relation R(A, B, C, D) with FDs {A->B, B->C, C->D} preserves dependency while satisfying BCNF. Mid-sem exam tomorrow!',
      subject: 'Databases',
      language: 'English',
      creator: 'Divya Nambiar',
      creatorCollege: 'NIT Trichy',
      creatorAvatar: FEMALE_AVATAR_SVG,
      createdAt: '1h ago',
      status: 'resolved',
      participantsInCall: 0,
      codeSnippet: null,
      replies: [
        {
          id: 'r-3',
          author: 'Sneha Roy',
          college: 'IIIT Hyderabad',
          avatar: FEMALE_AVATAR_SVG,
          text: 'Decomposing into R1(A,B), R2(B,C), R3(C,D) is in BCNF and is lossless because R1 ∩ R2 = B (which is a candidate key for R2). All dependencies preserved!',
          time: '40m ago',
          upvotes: 15,
          isAnswer: true
        }
      ]
    }
  ]);

  // Reply drawer state
  const [activeReplyDoubtId, setActiveReplyDoubtId] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  const subjects = ['all', 'Java', 'React', 'Algorithms', 'Databases', 'Operating Systems', 'Python & AI'];

  // Handle Ask Doubt
  const handlePostDoubt = (e) => {
    e.preventDefault();
    if (!newDoubtTitle.trim()) return;

    const newDoubt = {
      id: `d-${Date.now()}`,
      title: newDoubtTitle.trim(),
      description: newDoubtTitle.trim(),
      subject: newDoubtSubject,
      language: newDoubtLanguage,
      creator: profile?.fullName || 'You',
      creatorCollege: profile?.college || 'IIT Madras',
      creatorAvatar: getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl),
      createdAt: 'Just now',
      status: 'open',
      participantsInCall: 0,
      codeSnippet: hasCodeSnippet && newDoubtCode.trim() ? newDoubtCode.trim() : null,
      replies: []
    };

    setDoubts([newDoubt, ...doubts]);
    setShowAskModal(false);
    setNewDoubtTitle('');
    setNewDoubtCode('');
    setHasCodeSnippet(false);
    toast.success('🎉 Doubt posted to campus solver forum! Peers can answer or join your call.');
  };

  // Handle Post Reply / Explanation
  const handleAddReply = (doubtId) => {
    if (!replyInput.trim()) return;

    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        const newReply = {
          id: `r-${Date.now()}`,
          author: profile?.fullName || 'You',
          college: profile?.college || 'IIT Madras',
          avatar: getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl),
          text: replyInput.trim(),
          time: 'Just now',
          upvotes: 0,
          isAnswer: false
        };
        return {
          ...d,
          replies: [...d.replies, newReply]
        };
      }
      return d;
    }));

    setReplyInput('');
    toast.success('💬 Explanation posted! Thank you for helping your peer.');
  };

  // Launch or Join Live Call for a Doubt (Like WhatsApp Group Call)
  const handleJoinDoubtCall = (doubt) => {
    setActiveRoomId?.(doubt.id);
    if (startWebRtcCall) {
      startWebRtcCall(null, doubt.id, doubt.title, doubt.subject);
    }
    // Update participant count
    setDoubts(prev => prev.map(d => d.id === doubt.id ? { ...d, status: 'live_call', participantsInCall: Math.max(1, d.participantsInCall + 1) } : d));
    toast.success(`🚀 Connecting to Live Doubt Room: "${doubt.subject}" with WebRTC Audio/Video!`);
  };

  const filteredDoubts = doubts.filter(d => {
    if (activeSubject !== 'all' && d.subject.toLowerCase() !== activeSubject.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.subject.toLowerCase().includes(q) || d.creator.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="studyloop-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>

      {/* ── TOP BANNER & INSTANT CALL LAUNCHER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(0, 102, 255, 0.06) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1.5s infinite' }} />
            24/7 Peer Doubt Solving Community
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Campus Doubt Hub & Live Call Rooms 💡
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '600px' }}>
            Post academic bugs & concepts for community text answers, or jump into dedicated live audio/video discussion rooms like a group call!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAskModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px', border: 'none',
              background: 'var(--accent-primary)', color: '#ffffff',
              fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 102, 255, 0.25)'
            }}
          >
            <Plus size={16} /> Post a Doubt
          </button>

          <button
            onClick={() => {
              const instantId = `room-instant-${Date.now()}`;
              setActiveRoomId?.(instantId);
              if (startWebRtcCall) {
                startWebRtcCall(null, instantId, 'Instant Peer Doubt Solving Call', 'General Engineering');
              }
              toast.success('🚀 Launching Instant Open Doubt Call Room!');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#ffffff',
              fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
            }}
          >
            <PhoneCall size={16} /> Start Instant Live Call
          </button>
        </div>
      </div>

      {/* ── SEARCH & SUBJECT FILTER BAR ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: '14px', marginBottom: '20px', flexWrap: 'wrap'
      }}>
        {/* Subject Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              style={{
                padding: '6px 14px', borderRadius: '999px',
                border: activeSubject === s ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: activeSubject === s ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: activeSubject === s ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                whiteSpace: 'nowrap', textTransform: 'capitalize', transition: 'all 0.15s ease'
              }}
            >
              {s === 'all' ? '🌟 All Doubts' : s}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search doubts, tags, authors..."
            style={{
              width: '100%', padding: '8px 12px 8px 34px', borderRadius: '999px',
              border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* ── DOUBTS FEED STREAM (CHAT & DISCUSSION THREADS) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredDoubts.length > 0 ? (
          filteredDoubts.map(doubt => (
            <div
              key={doubt.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: doubt.status === 'live_call' ? '1.5px solid rgba(239, 68, 68, 0.5)' : '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: doubt.status === 'live_call' ? '0 4px 20px rgba(239, 68, 68, 0.12)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Doubt Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img
                    src={doubt.creatorAvatar}
                    alt={doubt.creator}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-color)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {doubt.creator}
                      </span>
                      <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '1px 6px', borderRadius: '4px' }}>
                        {doubt.creatorCollege}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Posted {doubt.createdAt} • 🗣️ Spoken Language: <strong style={{ color: 'var(--text-secondary)' }}>{doubt.language}</strong>
                    </div>
                  </div>
                </div>

                {/* Status Badge & Call Join Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800, padding: '3px 9px', borderRadius: '999px',
                    backgroundColor: doubt.subject === 'Java' ? 'rgba(239,68,68,0.1)' : 'rgba(0,102,255,0.1)',
                    color: doubt.subject === 'Java' ? '#ef4444' : 'var(--accent-primary)'
                  }}>
                    {doubt.subject}
                  </span>

                  {doubt.status === 'resolved' ? (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '3px 9px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinDoubtCall(doubt)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 14px', borderRadius: '8px', border: 'none',
                        backgroundColor: '#ef4444', color: '#fff', fontSize: '0.76rem',
                        fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      <Video size={13} /> {doubt.participantsInCall > 0 ? `Join Live Call (${doubt.participantsInCall} in call)` : 'Start Live Call Room 🚀'}
                    </button>
                  )}
                </div>
              </div>

              {/* Doubt Title & Description */}
              <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                {doubt.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {doubt.description}
              </p>

              {/* Code Snippet Block */}
              {doubt.codeSnippet && (
                <div style={{ backgroundColor: '#090d16', borderRadius: '10px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                  <div style={{ padding: '6px 12px', backgroundColor: '#111827', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>
                      // Code Snippet ({doubt.subject})
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(doubt.codeSnippet);
                        toast.success('📋 Code copied to clipboard!');
                      }}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Copy size={11} /> Copy Code
                    </button>
                  </div>
                  <pre style={{ margin: 0, padding: '12px 14px', color: '#38bdf8', fontFamily: "'Fira Code', monospace", fontSize: '0.82rem', lineHeight: 1.45, overflowX: 'auto' }}>
                    <code>{doubt.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Discussion / Reply Action Bar */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '8px', borderTop: '1px solid var(--border-color)',
                fontSize: '0.76rem', color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setActiveReplyDoubtId(activeReplyDoubtId === doubt.id ? null : doubt.id)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent-primary)',
                      fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <MessageCircle size={15} /> {doubt.replies.length} Explanations & Answers
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleJoinDoubtCall(doubt)}
                    style={{
                      background: 'none', border: 'none', color: '#ef4444',
                      fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <Phone size={13} /> Voice/Video Discussion
                  </button>
                </div>
              </div>

              {/* Reply Thread / Community Chat Drawer */}
              {activeReplyDoubtId === doubt.id && (
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px',
                  padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px'
                }}>
                  {/* Post an answer box */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={replyInput}
                      onChange={e => setReplyInput(e.target.value)}
                      placeholder="Write your explanation or suggested fix..."
                      style={{
                        flex: 1, padding: '8px 12px', borderRadius: '8px',
                        border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none'
                      }}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddReply(doubt.id); }}
                    />
                    <button
                      onClick={() => handleAddReply(doubt.id)}
                      disabled={!replyInput.trim()}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', border: 'none',
                        backgroundColor: replyInput.trim() ? 'var(--accent-primary)' : 'var(--bg-card)',
                        color: replyInput.trim() ? '#fff' : 'var(--text-muted)',
                        fontSize: '0.78rem', fontWeight: 800, cursor: replyInput.trim() ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <Send size={12} /> Post Answer
                    </button>
                  </div>

                  {/* List of answers */}
                  {doubt.replies.map(r => (
                    <div
                      key={r.id}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: r.isAnswer ? '1.5px solid #10b981' : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '10px 12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img src={r.avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                          <span style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{r.author}</span>
                          <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>({r.college})</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{r.time}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {r.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-secondary)',
            borderRadius: '16px', border: '1px dashed var(--border-color)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💡</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              No doubts found in this subject
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Have a question or stuck on an algorithm? Post it here for the campus community!
            </p>
            <button
              onClick={() => setShowAskModal(true)}
              style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent-primary)', color: '#fff', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Post Doubt Now 🚀
            </button>
          </div>
        )}
      </div>

      {/* ── ASK DOUBT MODAL ── */}
      {showAskModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>❓</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Post Academic Doubt to Campus
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Anyone on campus can explain or join a live call with you!
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAskModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostDoubt}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  What is your doubt or compiler error? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDoubtTitle}
                  onChange={e => setNewDoubtTitle(e.target.value)}
                  placeholder="e.g. Why does my recursive DFS throw StackOverflowError on cyclic graph? Need help with visited array logic..."
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
                    value={newDoubtSubject}
                    onChange={e => setNewDoubtSubject(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '8px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.8rem'
                    }}
                  >
                    <option value="Java">Java</option>
                    <option value="React">React</option>
                    <option value="Algorithms">Algorithms & DSA</option>
                    <option value="Databases">DBMS & SQL</option>
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Python & AI">Python & AI</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Preferred Language
                  </label>
                  <select
                    value={newDoubtLanguage}
                    onChange={e => setNewDoubtLanguage(e.target.value)}
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

              {/* Code Snippet Toggle */}
              <div style={{ marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => setHasCodeSnippet(!hasCodeSnippet)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Code2 size={14} /> {hasCodeSnippet ? 'Remove Code Block' : '+ Attach Code Snippet'}
                </button>
                {hasCodeSnippet && (
                  <textarea
                    rows={4}
                    value={newDoubtCode}
                    onChange={e => setNewDoubtCode(e.target.value)}
                    placeholder="// Paste your code or bug here..."
                    style={{
                      width: '100%', marginTop: '8px', padding: '10px 12px', borderRadius: '8px',
                      border: '1px solid var(--border-color)', backgroundColor: '#0f172a',
                      color: '#f8fafc', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', boxSizing: 'border-box'
                    }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Post Doubt 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
