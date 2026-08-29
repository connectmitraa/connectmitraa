import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Key, Lock, Mail, Shield } from 'lucide-react';

export function AdminGateScreen({ loginAdmin, onBackToHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.toLowerCase() === 'admin@studyloop.app' && password === 'password123') {
      loginAdmin(email);
    } else {
      setErrorMsg('Invalid administrative credentials. Access restricted to authorized campus operators.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '1.5rem', color: '#f8fafc' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '2.5rem 2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.4)' }}>
            <Shield size={30} color="#ffffff" />
          </div>
        </div>

        <h2 className="font-serif" style={{ textAlign: 'center', fontSize: '1.625rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.375rem' }}>
          StudyLoop Admin Portal
        </h2>
        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
          Restricted access for campus safety officers & platform operators.
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.8125rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Identifier
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="email" 
                value={email} 
                onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
                placeholder="admin@studyloop.app" 
                required 
                style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Master Security Key
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="••••••••••••" 
                required 
                style={{ width: '100%', padding: '0.625rem 2.5rem 0.625rem 2.5rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem', outline: 'none' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)', color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}
          >
            Authenticate & Open Console 🛡️
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.375rem' }}>Demo Admin Access</div>
          <button 
            type="button" 
            onClick={() => {
              loginAdmin('admin@studyloop.app');
            }}
            style={{ background: 'transparent', border: 'none', color: '#f97316', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            ⚡ 1-Click Authorize (admin@studyloop.app)
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            type="button" 
            onClick={onBackToHome}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8125rem', cursor: 'pointer' }}
          >
            ← Return to Student Campus Network
          </button>
        </div>
      </div>
    </div>
  );
}

