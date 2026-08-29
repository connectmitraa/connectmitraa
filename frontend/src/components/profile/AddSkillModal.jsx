import React, { useState } from 'react';
import { X } from 'lucide-react';

export function AddSkillModal({ onClose, onSave }) {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('teaching'); // teaching, general, learning

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    onSave(skillName.trim(), category);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add Technical Skill</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Skill Name</label>
            <input type="text" className="input" placeholder="e.g. Java, Spring Boot, Dynamic Programming, React" value={skillName} onChange={e => setSkillName(e.target.value)} required />
          </div>

          <div>
            <label className="label">Category</label>
            <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="teaching">🎓 Mentoring / Teaching Skill (I can teach peers)</option>
              <option value="general">💻 General Technical Skill</option>
              <option value="learning">🚀 Learning & Exploration Goal</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Skill ⭐</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

