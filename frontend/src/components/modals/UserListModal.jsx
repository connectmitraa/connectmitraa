import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function UserListModal({ title, userId, token, onClose, onSelectUser }) {
  const [search, setSearch] = useState('');
  
  const sampleUsers = [
    { id: 'u-1', fullName: 'Bhavna Patel', college: 'IIT Madras', department: 'Computer Science', year: 3, avatarUrl: FEMALE_AVATAR_SVG, isFollowing: true },
    { id: 'u-2', fullName: 'Chaitanya Reddy', college: 'BITS Pilani', department: 'Electrical Engg', year: 1, avatarUrl: MALE_AVATAR_SVG, isFollowing: false },
    { id: 'u-3', fullName: 'Divya Nambiar', college: 'NIT Trichy', department: 'Data Science', year: 2, avatarUrl: FEMALE_AVATAR_SVG, isFollowing: true },
    { id: 'u-4', fullName: 'Kavya Subramanian', college: 'IIT Delhi', department: 'Software Engg', year: 4, avatarUrl: FEMALE_AVATAR_SVG, isFollowing: false }
  ];

  const filtered = sampleUsers.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.college.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div 
        className="card-premium" 
        style={{ width: '100%', maxWidth: '460px', padding: '1.75rem', borderRadius: '24px', backgroundColor: 'var(--bg-elevated)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0 }}>{title}</h3>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>

        <input 
          type="text" 
          className="input" 
          placeholder="Search members..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ marginBottom: '1rem' }}
        />

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(u => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0.875rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                onClick={() => onSelectUser(u)}
              >
                <img src={u.avatarUrl} alt={u.fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{u.fullName}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{u.college} • {u.department}</div>
                </div>
              </div>

              <button 
                onClick={() => onSelectUser(u)}
                className="btn btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontWeight: 700 }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

