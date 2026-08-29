import React from 'react';

export function SidebarLink({ active, icon, label, onClick, isCollapsed }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '0.75rem',
        width: '100%',
        padding: isCollapsed ? '0.625rem 0' : '0.625rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.8125rem',
        fontWeight: active ? '700' : '600',
        backgroundColor: active ? 'var(--accent-light)' : 'transparent',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        textAlign: 'left',
        transition: 'all var(--transition-fast)',
        marginBottom: '0.25rem'
      }}
      title={isCollapsed ? label : ''}
    >
      <span style={{ display: 'flex', alignItems: 'center', color: active ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
        {icon}
      </span>
      {!isCollapsed && label}
    </button>
  );
}
