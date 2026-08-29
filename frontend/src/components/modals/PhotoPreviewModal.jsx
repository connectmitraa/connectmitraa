import React from 'react';

export function PhotoPreviewModal({ imageUrl, userName, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 13, 22, 0.9)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} onClick={onClose}>
      <div style={{ position: 'relative', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged" style={{ maxWidth: '320px', maxHeight: '320px', borderRadius: '50%', border: '4px solid var(--accent-primary)', objectFit: 'cover', boxShadow: 'var(--shadow-glow)' }} />
        <h3 className="font-serif" style={{ color: '#ffffff', marginTop: '1rem', fontSize: '1.25rem' }}>{userName}</h3>
        <button onClick={onClose} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Close</button>
      </div>
    </div>
  );
}
