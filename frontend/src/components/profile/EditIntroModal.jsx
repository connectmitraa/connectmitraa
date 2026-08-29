import React, { useState } from 'react';
import { X } from 'lucide-react';

export function EditIntroModal({ profile, onClose, onSave }) {
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [college, setCollege] = useState(profile?.college || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [year, setYear] = useState(profile?.year || 2);
  const [location, setLocation] = useState(profile?.location || 'Chennai, India');
  const [bio, setBio] = useState(profile?.bio || '');
  const [gender, setGender] = useState(profile?.gender || 'male');
  
  const social = profile?.socialLinks || {};
  const [github, setGithub] = useState(social.github || '');
  const [linkedin, setLinkedin] = useState(social.linkedin || '');
  const [leetcode, setLeetcode] = useState(social.leetcode || '');
  const [portfolio, setPortfolio] = useState(social.portfolio || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      fullName,
      headline,
      college,
      department,
      year,
      location,
      bio,
      gender,
      socialLinks: {
        github,
        linkedin,
        leetcode,
        portfolio
      }
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '640px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: 0, fontWeight: 800 }}>Edit Intro & Professional Links</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Configure your LinkedIn / Unstop header details</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>

          <div>
            <label className="label">Professional Headline (Tagline)</label>
            <input type="text" className="input" placeholder="e.g. B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist" value={headline} onChange={e => setHeadline(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">College / University</label>
              <input type="text" className="input" value={college} onChange={e => setCollege(e.target.value)} required />
            </div>
            <div>
              <label className="label">Department / Branch</label>
              <input type="text" className="input" value={department} onChange={e => setDepartment(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Academic Year</label>
              <select className="input" value={year} onChange={e => setYear(e.target.value)}>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year (Senior)</option>
              </select>
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="male">👨 Male</option>
                <option value="female">👩 Female</option>
                <option value="other">👤 Other</option>
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input type="text" className="input" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Student Bio</label>
            <textarea className="input" style={{ minHeight: '75px', resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} />
          </div>

          {/* Social Links */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
              🔗 Coding & Social Handles (GitHub, LinkedIn, LeetCode)
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="label">GitHub Profile URL</label>
                <input type="url" className="input" placeholder="https://github.com/yourhandle" value={github} onChange={e => setGithub(e.target.value)} />
              </div>
              <div>
                <label className="label">LinkedIn Profile URL</label>
                <input type="url" className="input" placeholder="https://linkedin.com/in/yourhandle" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              </div>
              <div>
                <label className="label">LeetCode Profile URL</label>
                <input type="url" className="input" placeholder="https://leetcode.com/yourhandle" value={leetcode} onChange={e => setLeetcode(e.target.value)} />
              </div>
              <div>
                <label className="label">Portfolio Website URL</label>
                <input type="url" className="input" placeholder="https://yourdomain.dev" value={portfolio} onChange={e => setPortfolio(e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Save Intro</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>

        </form>

      </div>
    </div>
  );
}

