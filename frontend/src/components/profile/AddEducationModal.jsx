import React, { useState } from 'react';
import { X } from 'lucide-react';

export function AddEducationModal({ onClose, onSave }) {
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('Bachelor of Technology - B.Tech');
  const [field, setField] = useState('Computer Science & Engineering');
  const [startYear, setStartYear] = useState('2023');
  const [endYear, setEndYear] = useState('2027');
  const [grade, setGrade] = useState('8.95 / 10.0 CGPA');
  const [activities, setActivities] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!school.trim()) return;
    onSave({
      id: `edu-${Date.now()}`,
      school: school.trim(),
      degree,
      field: field.trim(),
      startYear,
      endYear,
      grade: grade.trim(),
      activities: activities.trim()
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 3800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
      <div className="card-premium" style={{ width: '100%', maxWidth: '540px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Add Education & Degree</h3>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">School / College / University Name</label>
            <input type="text" className="input" placeholder="e.g. Indian Institute of Technology (IIT) Madras" value={school} onChange={e => setSchool(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Degree</label>
              <select className="input" value={degree} onChange={e => setDegree(e.target.value)}>
                <option value="Bachelor of Technology - B.Tech">B.Tech</option>
                <option value="Diploma in Engineering">Diploma</option>
                <option value="Bachelor of Engineering - B.E.">B.E.</option>
                <option value="Bachelor of Computer Applications - BCA">BCA</option>
                <option value="Master of Technology - M.Tech">M.Tech</option>
                <option value="Master of Computer Applications - MCA">MCA</option>
                <option value="Higher Secondary School Certificate (Class XII)">Class XII</option>
              </select>
            </div>
            <div>
              <label className="label">Field of Study / Branch</label>
              <input type="text" className="input" placeholder="e.g. Computer Science" value={field} onChange={e => setField(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="label">Start Year</label>
              <input type="text" className="input" placeholder="2023" value={startYear} onChange={e => setStartYear(e.target.value)} required />
            </div>
            <div>
              <label className="label">End Year (or Expected)</label>
              <input type="text" className="input" placeholder="2027" value={endYear} onChange={e => setEndYear(e.target.value)} required />
            </div>
            <div>
              <label className="label">Grade / CGPA</label>
              <input type="text" className="input" placeholder="8.95 CGPA" value={grade} onChange={e => setGrade(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Activities & Societies (Optional)</label>
            <input type="text" className="input" placeholder="e.g. Lead at GDSC, Campus Doubt Peer Mentor" value={activities} onChange={e => setActivities(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontWeight: 800 }}>Add Education 🎓</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}

