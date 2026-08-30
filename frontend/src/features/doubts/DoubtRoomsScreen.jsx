import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Globe,
  Lock,
  MessageSquare, 
  Mic, 
  Plus, 
  RotateCcw, 
  Search, 
  Shield,
  Sparkles, 
  Users, 
  Video, 
  Zap 
} from 'lucide-react';

export function DoubtRoomsScreen({ token, activeRoomId, setActiveRoomId, socket, wsMessages, setWsMessages, startWebRtcCall, webrtcCall }) {
  const [rooms, setRooms] = useState([
    { 
      id: 'room-1', 
      title: 'Java Multithreading Synchronized Locks issue in Producer-Consumer', 
      subject: 'Java', 
      college: 'IIT Madras', 
      participants: 3, 
      creator: 'Aarav Sharma', 
      status: 'live',
      visibility: 'public',
      startedAt: '12m ago' 
    },
    { 
      id: 'room-2', 
      title: 'React useEffect Infinite re-render cycle with state objects', 
      subject: 'React', 
      college: 'IIT Madras', 
      participants: 5, 
      creator: 'Bhavna Patel', 
      status: 'live',
      visibility: 'public',
      startedAt: '24m ago' 
    },
    { 
      id: 'room-3', 
      title: 'Dynamic Programming 0/1 Knapsack memoization table walkthrough', 
      subject: 'Algorithms', 
      college: 'BITS Pilani', 
      participants: 2, 
      creator: 'Chaitanya Reddy', 
      status: 'completed',
      visibility: 'public',
      startedAt: '1h ago',
      duration: '45m' 
    },
    { 
      id: 'room-4', 
      title: 'Database Normalization BCNF vs 3NF Decomposition proof', 
      subject: 'Databases', 
      college: 'IIT Bombay', 
      participants: 4, 
      creator: 'Divya Nair', 
      status: 'completed',
      visibility: 'public',
      startedAt: '2h ago',
      duration: '38m' 
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'live' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newSubject, setNewSubject] = useState('Java');
  const [newVisibility, setNewVisibility] = useState('public'); // 'public' | 'private'
  const [newMaxParticipants, setNewMaxParticipants] = useState('10');
  const [newRoomFlash, setNewRoomFlash] = useState(null); // { title } flash badge

  // ── Live participant count ticker for LIVE rooms (simulates WebSocket presence) ──
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms(prev => prev.map(r => {
        if (r.status !== 'live') return r;
        const delta = Math.random() > 0.45 ? 1 : -1;
        const next = Math.max(1, r.participants + delta);
        return { ...r, participants: next };
      }));
    }, Math.random() * 4000 + 5000); // 5–9s random interval
    return () => clearInterval(interval);
  }, []);

  // ── Simulated new room arriving from network every ~25s ──
  const newRoomTopics = [
    { title: 'OS Scheduling: FCFS vs Round Robin deadlock analysis', subject: 'Operating Systems', college: 'IIT Delhi' },
    { title: 'Calculus: Lagrange multipliers and constrained optimization', subject: 'Calculus', college: 'IIT Bombay' },
    { title: 'Python asyncio event loop with FastAPI concurrency patterns', subject: 'Python', college: 'IIIT Hyderabad' },
  ];
  const newRoomIdx = useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const tpl = newRoomTopics[newRoomIdx.current % newRoomTopics.length];
      newRoomIdx.current++;
      const r = {
        id: `room-auto-${Date.now()}`,
        title: tpl.title, subject: tpl.subject, college: tpl.college,
        participants: Math.floor(Math.random() * 3) + 1,
        creator: ['Priya M.', 'Arjun K.', 'Nandini R.'][newRoomIdx.current % 3],
        status: 'live', visibility: 'public', startedAt: 'Just now'
      };
      setRooms(prev => [r, ...prev]);
      setNewRoomFlash(r.title.slice(0, 50) + '…');
      setTimeout(() => setNewRoomFlash(null), 4000);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    const newR = {
      id: `room-${Date.now()}`,
      title: newTopic.trim(),
      subject: newSubject,
      college: 'IIT Madras',
      participants: 1,
      creator: 'You',
      status: 'live',
      visibility: newVisibility,
      startedAt: 'Just now'
    };
    
    if (newVisibility === 'public') {
      setRooms(prev => [newR, ...prev]);
    }
    setActiveRoomId(newR.id);
    setNewTopic('');
    if (startWebRtcCall) {
      startWebRtcCall(null, newR.id, newR.title, newR.subject);
    }
  };

  const handleEnterRoom = (room) => {
    setActiveRoomId(room.id);
    if (startWebRtcCall) {
      startWebRtcCall(null, room.id, room.title, room.subject);
    }
  };

  const filteredRooms = rooms.filter(r => {
    if (activeFilter === 'live' && r.status !== 'live') return false;
    if (activeFilter === 'completed' && r.status !== 'completed') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.creator.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Live Academic Doubt Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Join real-time peer doubt rooms, launch Google Meet-style study sessions, or review completed discussions.
          </p>
        </div>
        <button onClick={() => startWebRtcCall(null, 'room-instant', 'Instant Peer Study Session', 'General Engineering')} className="btn btn-accent">
          <Video size={16} /> Start 1-Click Instant Meeting
        </button>
      </div>

      {/* Live new-room notification banner */}
      {newRoomFlash && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)', padding: '0.625rem 1rem', marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'dropdown-animate 0.3s ease'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', flexShrink: 0, animation: 'pulse-ring 1s infinite' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ef4444' }}>New Live Room:</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', flex: 1 }}>{newRoomFlash}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveFilter('all')} 
            className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.35rem 0.875rem', fontSize: '0.8125rem' }}
          >
            All Sessions ({rooms.length})
          </button>
          <button 
            onClick={() => setActiveFilter('live')} 
            className={`btn ${activeFilter === 'live' ? 'btn-accent' : 'btn-ghost'}`}
            style={{ padding: '0.35rem 0.875rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse-hand 1.5s infinite' }} />
            Live Now ({rooms.filter(r => r.status === 'live').length})
          </button>
          <button 
            onClick={() => setActiveFilter('completed')} 
            className={`btn ${activeFilter === 'completed' ? 'btn-secondary' : 'btn-ghost'}`}
            style={{ padding: '0.35rem 0.875rem', fontSize: '0.8125rem' }}
          >
            <CheckCircle2 size={13} style={{ color: '#10b981' }} /> Completed ({rooms.filter(r => r.status === 'completed').length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search topic, subject or host..."
            className="input"
            style={{ paddingLeft: '2.25rem', height: '38px', fontSize: '0.8125rem' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        
        {/* Rooms Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredRooms.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <Users size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>No study sessions found matching your filter.</p>
            </div>
          ) : (
            filteredRooms.map(r => {
              const isLive = r.status === 'live';
              return (
                <div key={r.id} className="card-premium interactive-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: isLive ? '4px solid #ef4444' : '4px solid #10b981' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                      {isLive ? (
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '5px', 
                          backgroundColor: 'rgba(239, 68, 68, 0.15)', 
                          color: '#ef4444', 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: 'var(--radius-full)', 
                          fontSize: '0.6875rem', 
                          fontWeight: 700 
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse-hand 1.5s infinite' }} />
                          LIVE NOW
                        </span>
                      ) : (
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                          color: '#10b981', 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: 'var(--radius-full)', 
                          fontSize: '0.6875rem', 
                          fontWeight: 700 
                        }}>
                          <CheckCircle2 size={12} /> COMPLETED
                        </span>
                      )}
                      <span className="tag tag-accent">{r.subject}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.college}</span>
                    </div>

                    <h3 className="font-serif" style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      {r.title}
                    </h3>
                    
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span>Host: <strong style={{ color: 'var(--text-primary)' }}>{r.creator}</strong></span>
                      {isLive ? (
                        <span>👥 {r.participants} active peers</span>
                      ) : (
                        <span>⏱ Duration: {r.duration || '35m'}</span>
                      )}
                      <span>• {r.startedAt}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isLive ? (
                      <button onClick={() => handleEnterRoom(r)} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem', gap: '6px' }}>
                        <Video size={14} /> Join Meeting 🚀
                      </button>
                    ) : (
                      <button onClick={() => handleEnterRoom(r)} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem', gap: '6px' }}>
                        <RotateCcw size={14} /> Reopen / Rejoin 🔄
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Sidebar: Launch Room Form */}
        <div className="card-premium" style={{ height: 'fit-content' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Open Live Study Room
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Configure visibility and subject topic for your study session.
          </p>

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
                <option value="Databases">Databases</option>
                <option value="Calculus">Calculus</option>
                <option value="AI / ML">AI / ML</option>
              </select>
            </div>

            {/* Visibility / Privacy Selection */}
            <div>
              <label className="label">Room Visibility</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setNewVisibility('public')}
                  className={`btn ${newVisibility === 'public' ? 'btn-accent' : 'btn-secondary'}`}
                  style={{ padding: '0.5rem 0.35rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Globe size={13} /> 🌐 Public Hub
                </button>
                <button
                  type="button"
                  onClick={() => setNewVisibility('private')}
                  className={`btn ${newVisibility === 'private' ? 'btn-accent' : 'btn-secondary'}`}
                  style={{ padding: '0.5rem 0.35rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Lock size={13} /> 🔒 Link Only
                </button>
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {newVisibility === 'public' 
                  ? '• Listed on campus Doubt Hub for all students to discover.' 
                  : '• Unlisted private room — only attendees with the link can join.'}
              </div>
            </div>

            <button type="submit" className="btn btn-accent" style={{ width: '100%', gap: '6px', fontWeight: 700 }}>
              <Sparkles size={16} /> Launch Live Room 🚀
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
