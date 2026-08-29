import React from 'react';
import { X, FileText, CheckCircle2, Download, ExternalLink } from 'lucide-react';

export function ResumePreviewModal({ profile, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const educations = profile?.educations || [];
  const certifications = profile?.certifications || [];
  const achievements = profile?.achievements || [];
  const projects = profile?.projects || [];
  const socialLinks = profile?.socialLinks || {};

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '820px', padding: '2.5rem', borderRadius: 'var(--radius-xl)', backgroundColor: '#ffffff', color: '#0f172a', maxHeight: '92vh', overflowY: 'auto' }}>
        
        {/* RESUME TOOLBAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 800 }}>
              ATS 100% COMPLIANT
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Standard 1-Page Student Placement Resume</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-accent" style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#0066FF' }}>
              <Download size={14} /> Print / Save as PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: '#0f172a', borderColor: '#cbd5e1' }}>
              Close
            </button>
          </div>
        </div>

        {/* PRINTABLE RESUME BODY */}
        <div id="printable-resume" style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.5, color: '#0f172a' }}>
          
          {/* HEADER */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0066FF', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#0f172a' }}>
              {profile.fullName || 'Aarav Sharma'}
            </h1>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0066FF', marginBottom: '0.25rem' }}>
              {profile.headline || 'B.Tech Computer Science & Engineering • Java & DSA Peer Mentor'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📍 {profile.location || 'Chennai, India'}</span>
              <span>🎓 {profile.college || 'IIT Madras'}</span>
              {socialLinks.github && <span>🐙 {socialLinks.github.replace('https://', '')}</span>}
              {socialLinks.linkedin && <span>💼 {socialLinks.linkedin.replace('https://', '')}</span>}
            </div>
          </div>

          {/* SECTION: EDUCATION */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {educations.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <div>
                    <strong>{edu.school}</strong> — <em>{edu.degree}, {edu.field}</em>
                    {edu.activities && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{edu.activities}</div>}
                  </div>
                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <strong>{edu.grade}</strong> | {edu.startYear} – {edu.endYear}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: CERTIFICATIONS */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Licenses & Verified Certifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {certifications.map(cert => (
                <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <div>
                    <strong>{cert.name}</strong> — {cert.issuer} (Credential ID: <code>{cert.credentialId}</code>)
                  </div>
                  <div style={{ color: '#64748b' }}>{cert.issueDate}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: ACHIEVEMENTS & HACKATHONS */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Honors & Hackathon Achievements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {achievements.map(ach => (
                <div key={ach.id} style={{ fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>🏆 {ach.title}</strong> — <em>{ach.issuer}</em>
                    <span style={{ color: '#64748b' }}>{ach.date}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.125rem' }}>{ach.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: TECHNICAL PROJECTS */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Technical Projects
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {projects.map(proj => (
                <div key={proj.id} style={{ fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{proj.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#0066FF', fontWeight: 600 }}>[{proj.stack.join(', ')}]</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.125rem' }}>{proj.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: SKILLS */}
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0066FF', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Technical Skills & Mentoring
            </h3>
            <div style={{ fontSize: '0.8125rem', color: '#334155' }}>
              <div><strong>Core Languages & Frameworks:</strong> {(profile.skills || []).join(', ')}</div>
              <div style={{ marginTop: '0.25rem' }}><strong>Peer Mentoring Expertises:</strong> {(profile.teachingSkills || []).join(', ')}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

