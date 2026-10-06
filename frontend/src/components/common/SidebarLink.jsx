import React, { useState } from 'react';

// ─── StudyLoop "Navigation Rail" Sidebar Link ─────────────────────────────────
// Compact vertical layout: Icon on top + Label below (YouTube / Jira / Teams style)
// 100% Zero-Scroll ergonomic fit with balanced inset padding & breathing room
// ─────────────────────────────────────────────────────────────────────────────

export function SidebarCategoryLabel({ label, isFirst = false }) {
  return (
    <div className="sidebar-category-heading" style={{
      fontSize: '0.65rem',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--text-muted)',
      padding: isFirst ? '6px 14px 4px 14px' : '14px 14px 4px 14px',
      userSelect: 'none'
    }}>
      {label}
    </div>
  );
}

export function SidebarLink({ active, icon, label, onClick, badge, badgeType = 'accent' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={label}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '8.5px 14px',
        borderRadius: '999px',
        border: active ? '1px solid rgba(0, 102, 255, 0.16)' : '1px solid transparent',
        cursor: 'pointer',
        backgroundColor: active
          ? 'var(--accent-light)'
          : isHovered
            ? 'var(--bg-tertiary)'
            : 'transparent',
        textAlign: 'left',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        marginBottom: '2px',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      {/* Icon (21px size) */}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        flexShrink: 0,
        color: active
          ? 'var(--accent-primary)'
          : isHovered
            ? 'var(--text-primary)'
            : 'var(--text-secondary)',
        transition: 'all 0.15s ease',
        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
      }}>
        {React.cloneElement(icon, { size: 21, strokeWidth: active ? 2.3 : 1.9 })}
      </span>

      {/* Label (Twitter-style crisp text) */}
      <span className="sidebar-link-label" style={{
        fontSize: '0.9rem',
        fontWeight: active ? 800 : 600,
        color: active
          ? 'var(--accent-primary)'
          : isHovered
            ? 'var(--text-primary)'
            : 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        letterSpacing: '-0.01em',
        transition: 'color 0.15s ease',
        flex: 1
      }}>
        {label}
      </span>

      {/* Optional badge */}
      {badge && (
        <span style={{
          marginLeft: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '16px',
          height: '16px',
          padding: '0 5px',
          borderRadius: '999px',
          fontSize: '0.62rem',
          fontWeight: 800,
          backgroundColor: badgeType === 'live'
            ? '#ef4444'
            : badgeType === 'success'
              ? 'var(--success-light)'
              : 'var(--accent-light)',
          color: badgeType === 'live'
            ? '#ffffff'
            : badgeType === 'success'
              ? 'var(--success-color)'
              : 'var(--accent-primary)',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}
