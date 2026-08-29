import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowUpRight, BookOpen, Clock, Filter, MessageSquare, Mic, Plus, Search, Sparkles, Users, Video, Zap } from 'lucide-react';

export function DoubtRoomsScreen({ token, activeRoomId, setActiveRoomId, socket, wsMessages, setWsMessages, startWebRtcCall, webrtcCall }) {
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

