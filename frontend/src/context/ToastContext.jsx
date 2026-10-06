import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// StudyLoop Global Toast Notification System
// Replaces ALL alert() calls across every module
// ─────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const TOAST_COLORS = {
  success: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', icon: '#10b981', text: '#ecfdf5' },
  error:   { bg: 'rgba(239, 68, 68, 0.12)',  border: 'rgba(239, 68, 68, 0.3)',  icon: '#ef4444', text: '#fef2f2' },
  info:    { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)', icon: '#38bdf8', text: '#f0f9ff' },
  warning: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', icon: '#f59e0b', text: '#fffbeb' },
};

function ToastItem({ id, type = 'info', message, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const colors = TOAST_COLORS[type] || TOAST_COLORS.info;

  useEffect(() => {
    // Animate in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto dismiss after 4s
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(id), 350);
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [id, onDismiss]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1.125rem',
        borderRadius: '14px',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        border: `1px solid ${colors.border}`,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        maxWidth: '360px',
        minWidth: '260px',
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}
    >
      {/* Left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: '12px', bottom: '12px', width: '3px', borderRadius: '0 4px 4px 0', backgroundColor: colors.icon }} />

      {/* Icon */}
      <div style={{ color: colors.icon, flexShrink: 0, marginTop: '1px' }}>
        {TOAST_ICONS[type]}
      </div>

      {/* Message */}
      <div style={{
        flex: 1,
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#f1f5f9',
        lineHeight: 1.4,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {message}
      </div>

      {/* Close button */}
      <button
        onClick={() => { setVisible(false); setTimeout(() => onDismiss(id), 350); }}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '2px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { id, type, message }]); // max 5 visible
  }, []);

  // Convenience aliases
  toast.success = (msg) => toast(msg, 'success');
  toast.error   = (msg) => toast(msg, 'error');
  toast.info    = (msg) => toast(msg, 'info');
  toast.warning = (msg) => toast(msg, 'warning');

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container — fixed bottom-right */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          zIndex: 99999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem
              id={t.id}
              type={t.type}
              message={t.message}
              onDismiss={dismiss}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * useToast hook — call inside any component
 * 
 * Usage:
 *   const toast = useToast();
 *   toast.success('Profile saved!');
 *   toast.error('Something went wrong');
 *   toast.info('Loading your data...');
 *   toast.warning('Session expires in 5 minutes');
 */
export function useToast() {
  return useContext(ToastContext);
}
