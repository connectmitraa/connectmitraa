import React, { useState } from 'react';
import { X } from 'lucide-react';

export function AddCertificateModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('Oracle');
  const [issueDate, setIssueDate] = useState('Jan 2026');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('☕');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: `cert-${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim(),
      credentialId: credentialId.trim() || `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
      credentialUrl: credentialUrl.trim() || 'https://verification.studyloop.app',
      badgeIcon
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add License or Certification</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Certification Name</label>
            <input type="text" className="input" placeholder="e.g. Oracle Certified Associate, Java SE 8 Programmer" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Issuing Organization</label>
              <input type="text" className="input" placeholder="e.g. Oracle, AWS, NPTEL, Coursera, Google" value={issuer} onChange={e => setIssuer(e.target.value)} required />
            </div>
            <div>
              <label className="label">Badge Icon</label>
              <select className="input" value={badgeIcon} onChange={e => setBadgeIcon(e.target.value)}>
                <option value="☕">☕ Java / Oracle</option>
                <option value="🐍">🐍 Python / Data</option>
                <option value="☁️">☁️ Cloud / AWS</option>
                <option value="🧠">🧠 AI / Machine Learning</option>
                <option value="⚡">⚡ Electronics / C++</option>
                <option value="📜">📜 Standard Certificate</option>
                <option value="🏆">🏆 Competition Award</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Issue Date</label>
              <input type="text" className="input" placeholder="e.g. Jan 2026" value={issueDate} onChange={e => setIssueDate(e.target.value)} required />
            </div>
            <div>
              <label className="label">Credential ID</label>
              <input type="text" className="input" placeholder="e.g. OCA-JAVA-98742" value={credentialId} onChange={e => setCredentialId(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Credential Verification URL (Optional)</label>
            <input type="url" className="input" placeholder="https://catalog-education.oracle.com/ords/certview" value={credentialUrl} onChange={e => setCredentialUrl(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Certificate 📜</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

