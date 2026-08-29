import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, FileText } from 'lucide-react';

export function ResumeUploadModal({ currentFileName, onClose, onUpload }) {
  const [fileName, setFileName] = useState(currentFileName || 'Aarav_Sharma_BTech_CS_Resume.pdf');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(fileName);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Upload Student Resume (PDF / DOCX)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Attached to your public peer tutor card & hackathon profiles</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ border: '2px dashed var(--accent-primary)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', backgroundColor: 'rgba(0, 102, 255, 0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={36} style={{ color: 'var(--accent-primary)' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
              {fileName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Supports PDF, DOCX (Max file size 15 MB)
            </div>
            <input 
              type="file" 
              accept=".pdf,.docx,.doc" 
              onChange={handleFileChange}
              style={{ marginTop: '0.75rem', fontSize: '0.8125rem' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Save & Attach Resume 📄</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>

        </form>

      </div>
    </div>
  );
}

