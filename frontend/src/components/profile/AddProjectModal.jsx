import React, { useState } from 'react';
import { X } from 'lucide-react';

export function AddProjectModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [stackStr, setStackStr] = useState('React, Node.js, WebRTC');
  const [desc, setDesc] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: `proj-${Date.now()}`,
      title: title.trim(),
      stack: stackStr.split(',').map(s => s.trim()).filter(Boolean),
      desc: desc.trim() || 'Built full-stack technical project with modern architecture.',
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim()
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add Technical Project</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Project Name</label>
            <input type="text" className="input" placeholder="e.g. PeerCode - Real-Time Collaborative Workspace" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="label">Tech Stack (comma separated tags)</label>
            <input type="text" className="input" placeholder="React, WebRTC, Node.js, Socket.io, Java" value={stackStr} onChange={e => setStackStr(e.target.value)} required />
          </div>

          <div>
            <label className="label">Project Summary & Features</label>
            <textarea className="input" style={{ minHeight: '75px', resize: 'vertical' }} placeholder="Low-latency collaborative coding and live doubt-solving workspace with synchronized editor." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">GitHub Repository URL</label>
              <input type="url" className="input" placeholder="https://github.com/username/repo" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
            </div>
            <div>
              <label className="label">Live Deployed Demo URL</label>
              <input type="url" className="input" placeholder="https://project.studyloop.app" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Project 💻</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

