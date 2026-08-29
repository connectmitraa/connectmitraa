import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function AvatarChangeModal({ currentAvatarUrl, onSave, onClose }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarUrl);
  const [customUrl, setCustomUrl] = useState('');

  const avatarPresets = [
    MALE_AVATAR_SVG,
    FEMALE_AVATAR_SVG,
    NEUTRAL_AVATAR_SVG,
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '440px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Select Avatar / Profile Picture</h3>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {avatarPresets.map((av, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedAvatar(av)}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                padding: '3px',
                border: selectedAvatar === av ? '3px solid var(--accent-primary)' : '2px solid var(--border-color)',
                cursor: 'pointer',
                margin: '0 auto'
              }}
            >
              <img src={av} alt="Preset" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label">Or Custom Image URL</label>
          <input 
            type="text" 
            className="input" 
            placeholder="https://example.com/photo.jpg" 
            value={customUrl} 
            onChange={e => { setCustomUrl(e.target.value); setSelectedAvatar(e.target.value); }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onSave(selectedAvatar)} className="btn btn-accent" style={{ flex: 1 }}>
            Save Avatar
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
