import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { Activity, AlertCircle, ArrowRight, ArrowUpRight, Award, Ban, BarChart2, BarChart3, Building2, Check, CheckCheck, CheckCircle, CheckCircle2, DollarSign, Eye, FileText, Filter, HelpCircle, History, LogOut, Megaphone, MessageSquare, RefreshCw, Search, Settings, Shield, ShieldAlert, Trash2, TrendingUp, Tv2, Users, X, XCircle } from 'lucide-react';
import { getDefaultAvatarByGender } from '../../constants/avatars';

export function AdminConsoleScreen({ onBackToStudent }) {
  const { adminToken, logout } = useAuth();
  const [adminActiveTab, setAdminActiveTab] = useState('doubts'); // default to doubts for instant problem solving

  return (
    <div className="admin-container">
      {/* ADMIN SIDEBAR */}
      <nav className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
            <Building2 size={20} />
          </div>
          <div>
            <span className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>Admin & Organizer</span>
            <div style={{ fontSize: '0.625rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Super Admin Suite</div>
          </div>
        </div>

        {/* SWITCH BACK TO STUDENT VIEW BUTTON */}
        <button
          onClick={onBackToStudent}
          className="btn btn-secondary"
          style={{
            marginBottom: '1.5rem',
            padding: '0.625rem 1rem',
            fontSize: '0.8125rem',
            fontWeight: 700,
            justifyContent: 'flex-start',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            borderColor: 'var(--accent-primary)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} /> Back to Student View
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1, overflowY: 'auto' }}>
          <AdminSidebarLink active={adminActiveTab === 'doubts'} icon={<HelpCircle size={16} />} label="Live Problem & Doubt Manager" count="3" onClick={() => setAdminActiveTab('doubts')} />
          <AdminSidebarLink active={adminActiveTab === 'users'} icon={<Users size={16} />} label="Student & Tutor Moderation" onClick={() => setAdminActiveTab('users')} />
          <AdminSidebarLink active={adminActiveTab === 'reels'} icon={<Tv2 size={16} />} label="Reels & Content Moderation" onClick={() => setAdminActiveTab('reels')} />
          <AdminSidebarLink active={adminActiveTab === 'overview'} icon={<BarChart3 size={16} />} label="Platform Analytics & Health" onClick={() => setAdminActiveTab('overview')} />
          <AdminSidebarLink active={adminActiveTab === 'badges'} icon={<Award size={16} />} label="Campus Badge Configurator" onClick={() => setAdminActiveTab('badges')} />
          <AdminSidebarLink active={adminActiveTab === 'coins'} icon={<ShieldAlert size={16} />} label="Coins Ledger & Anti-Spam" onClick={() => setAdminActiveTab('coins')} />
          <AdminSidebarLink active={adminActiveTab === 'audit'} icon={<History size={16} />} label="System Audit Logs" onClick={() => setAdminActiveTab('audit')} />
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
          <button onClick={logout} className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger-color)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem' }}>
            <LogOut size={16} /> Log Out Admin Session
          </button>
        </div>
      </nav>

      {/* ADMIN MAIN CONTENT */}
      <main className="admin-main">
        {adminActiveTab === 'doubts' && <AdminDoubtOversightTab token={adminToken} />}
        {adminActiveTab === 'users' && <AdminUserModerationTab token={adminToken} />}
        {adminActiveTab === 'reels' && <AdminReelsModerationTab token={adminToken} />}
        {adminActiveTab === 'overview' && <AdminOverviewTab token={adminToken} />}
        {adminActiveTab === 'badges' && <AdminBadgeConfiguratorTab token={adminToken} />}
        {adminActiveTab === 'coins' && <AdminCoinsLedgerTab token={adminToken} />}
        {adminActiveTab === 'audit' && <AdminAuditLogsTab token={adminToken} />}
      </main>
    </div>
  );
}

function AdminSidebarLink({ active, icon, label, count, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.625rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.8125rem',
        fontWeight: active ? '700' : '600',
        background: active ? 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)' : 'transparent',
        color: active ? '#ffffff' : 'var(--text-secondary)',
        textAlign: 'left',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', color: active ? '#ffffff' : 'var(--text-muted)' }}>
          {icon}
        </span>
        {label}
      </div>
      {count && (
        <span style={{ 
          backgroundColor: active ? 'rgba(255,255,255,0.3)' : 'var(--accent-light)', 
          color: active ? '#ffffff' : 'var(--accent-primary)', 
          fontSize: '0.6875rem', 
          fontWeight: 800, 
          padding: '0.125rem 0.4rem', 
          borderRadius: 'var(--radius-full)' 
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

// --- ADMIN TAB 1: REAL-TIME LIVE PROBLEM & DOUBT MANAGER ---
function AdminDoubtOversightTab({ token }) {
  const toast = useToast();
  const [rooms, setRooms] = useState([
    { id: 'room-101', title: 'Java Multithreading Synchronized Locks issue in Producer-Consumer', subject: 'Java', college: 'IIT Madras', creator: 'Aarav Sharma', helper: 'Bhavna Patel', status: 'SOLVED', createdAt: '10m ago' },
    { id: 'room-102', title: 'React useEffect Infinite Re-render Cycle with Object Dependencies', subject: 'React', college: 'IIT Madras', creator: 'Chaitanya Reddy', helper: 'Aarav Sharma', status: 'SOLVED', createdAt: '25m ago' },
    { id: 'room-103', title: '0/1 Knapsack Dynamic Programming Memoization Table Walkthrough', subject: 'Algorithms', college: 'BITS Pilani', creator: 'Divya Nambiar', helper: 'Waiting for Peer Tutor', status: 'OPEN', createdAt: '2m ago' },
    { id: 'room-104', title: 'Calculus Triple Integrals & Polar Coordinate Volume Transformation', subject: 'Calculus', college: 'NIT Trichy', creator: 'Student Peer', helper: 'Waiting for Peer Tutor', status: 'OPEN', createdAt: 'Just now' }
  ]);

  const [filterSubject, setFilterSubject] = useState('ALL');
  const [filterCollege, setFilterCollege] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [announcementText, setAnnouncementText] = useState('');
  const [activeAnnouncement, setActiveAnnouncement] = useState('⚡ Live Exam Sprint: All verified tutors earn 2x bonus peer coins for solving doubts this week!');

  const handleResolveDoubt = (roomId) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'SOLVED', helper: r.helper.includes('Waiting') ? 'Admin Moderator' : r.helper } : r));
    toast.success("✅ Doubt marked as SOLVED! Tutor awarded +10 XP and +5 Peer Coins in real-time.");
  };

  const handleDeleteDoubt = (roomId) => {
    if (confirm("Are you sure you want to remove this doubt question from the live platform?")) {
      setRooms(prev => prev.filter(r => r.id !== roomId));
      toast.info("🗑️ Question removed from live doubt feed.");
    }
  };

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setActiveAnnouncement(announcementText.trim());
    setAnnouncementText('');
    toast.success("📢 Campus Announcement broadcasted live to all students!");
  };

  const filteredRooms = rooms.filter(r => {
    if (filterSubject !== 'ALL' && r.subject !== filterSubject) return false;
    if (filterCollege !== 'ALL' && r.college !== filterCollege) return false;
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Real-Time Live Problem & Doubt Manager</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Supervise live student doubt rooms, resolve pending queries, and broadcast announcements.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="tag tag-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.875rem' }}>
            <div className="live-dot" style={{ backgroundColor: '#22c55e' }}></div>
            {rooms.filter(r => r.status === 'OPEN').length} Active Live Doubts
          </span>
        </div>
      </div>

      {/* LIVE CAMPUS ANNOUNCEMENT BANNER */}
      {activeAnnouncement && (
        <div style={{ backgroundColor: 'rgba(234, 88, 12, 0.1)', border: '1px solid rgba(234, 88, 12, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Megaphone size={18} style={{ color: '#ea580c' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeAnnouncement}</span>
          </div>
          <button onClick={() => setActiveAnnouncement('')} className="btn-icon" style={{ padding: '0.25rem' }}><X size={16} /></button>
        </div>
      )}

      {/* FILTER CONTROLS BAR */}
      <div className="card-premium" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Filter size={15} /> Filters:
          </div>

          <select className="input" style={{ width: '150px', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="ALL">All Subjects</option>
            <option value="Java">Java</option>
            <option value="React">React</option>
            <option value="Algorithms">Algorithms</option>
            <option value="Calculus">Calculus</option>
          </select>

          <select className="input" style={{ width: '160px', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} value={filterCollege} onChange={e => setFilterCollege(e.target.value)}>
            <option value="ALL">All Universities</option>
            <option value="IIT Madras">IIT Madras</option>
            <option value="BITS Pilani">BITS Pilani</option>
            <option value="NIT Trichy">NIT Trichy</option>
          </select>

          <select className="input" style={{ width: '140px', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Live OPEN</option>
            <option value="SOLVED">SOLVED</option>
          </select>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Showing {filteredRooms.length} of {rooms.length} doubt workspaces
        </div>
      </div>

      {/* DOUBTS REAL-TIME TABLE */}
      <table className="admin-table" style={{ marginBottom: '2.5rem' }}>
        <thead>
          <tr>
            <th>Workspace Topic & ID</th>
            <th>Subject</th>
            <th>University</th>
            <th>Student</th>
            <th>Assigned Helper</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Admin Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map(r => (
            <tr key={r.id}>
              <td>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', maxWidth: '280px' }}>{r.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.id} • {r.createdAt}</div>
              </td>
              <td><span className="tag tag-accent">{r.subject}</span></td>
              <td>{r.college}</td>
              <td><strong>{r.creator}</strong></td>
              <td>{r.helper}</td>
              <td>
                <span className={`tag ${r.status === 'SOLVED' ? 'tag-success' : 'tag-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  {r.status === 'OPEN' && <div className="live-dot" style={{ width: '8px', height: '8px' }}></div>}
                  {r.status}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                  {r.status === 'OPEN' && (
                    <button 
                      onClick={() => handleResolveDoubt(r.id)} 
                      className="btn btn-success" 
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      title="Force Resolve & Credit Tutor"
                    >
                      <CheckCircle size={13} /> Resolve
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteDoubt(r.id)} 
                    className="btn btn-danger" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    title="Remove Question"
                  >
                    <Ban size={13} /> Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EMERGENCY BROADCAST COMPOSER */}
      <div className="card-premium" style={{ maxWidth: '680px' }}>
        <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={18} style={{ color: '#ea580c' }} /> Broadcast Campus Announcement
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Send a priority banner alert across all active student doubt hubs and dashboards.
        </p>
        <form onSubmit={handlePublishAnnouncement} style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="e.g. Midterm Algorithms Study Jam tonight at 8 PM in Room #04..." 
            value={announcementText} 
            onChange={e => setAnnouncementText(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-accent" style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.25rem' }}>
            Broadcast 📢
          </button>
        </form>
      </div>
    </div>
  );
}

// --- ADMIN TAB 2: STUDENT & TUTOR MODERATION ---
function AdminUserModerationTab({ token }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    { id: '11111111-1111-1111-1111-111111111111', fullName: 'Aarav Sharma', email: 'studenta@student.com', college: 'IIT Madras', department: 'Computer Science', xp: 650, coins: 45, reputation: 4.8, isVerifiedTutor: true, role: 'student', status: 'Active' },
    { id: '22222222-2222-2222-2222-222222222222', fullName: 'Bhavna Patel', email: 'studentb@student.com', college: 'IIT Madras', department: 'Computer Science', xp: 820, coins: 60, reputation: 4.9, isVerifiedTutor: true, role: 'student', status: 'Active' },
    { id: '33333333-3333-3333-3333-333333333333', fullName: 'Chaitanya Reddy', email: 'studentc@student.com', college: 'BITS Pilani', department: 'Electrical Engineering', xp: 340, coins: 20, reputation: 4.6, isVerifiedTutor: false, role: 'student', status: 'Active' },
    { id: '44444444-4444-4444-4444-444444444444', fullName: 'Divya Nambiar', email: 'studentd@student.com', college: 'NIT Trichy', department: 'Data Science', xp: 480, coins: 35, reputation: 4.7, isVerifiedTutor: false, role: 'student', status: 'Active' }
  ]);

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const handleToggleTutor = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerifiedTutor: !u.isVerifiedTutor } : u));
    toast.success("⭐ Verified Campus Tutor status updated!");
  };

  const handleGiftBonus = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, xp: u.xp + 50, coins: u.coins + 10 } : u));
    toast.success("🪙 Gifted +50 XP and +10 Peer Coins to student!");
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Student & Tutor Moderation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Verify campus tutor badges, manage roles, adjust ratings, and grant reward bonuses.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '0.375rem 1rem', width: '280px' }}>
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search students, emails..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8125rem', width: '100%', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Student / Email</th>
            <th>University & Dept</th>
            <th>XP & Balance</th>
            <th>Tutor Badge</th>
            <th>Rating</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Moderation Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
              </td>
              <td>
                <div>{u.college}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.department}</div>
              </td>
              <td>
                <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>⚡ {u.xp} XP</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🪙 {u.coins} Coins</div>
              </td>
              <td>
                <button 
                  onClick={() => handleToggleTutor(u.id)}
                  style={{
                    border: 'none',
                    background: u.isVerifiedTutor ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                    color: u.isVerifiedTutor ? 'var(--success-color)' : 'var(--text-muted)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <CheckCircle2 size={13} /> {u.isVerifiedTutor ? 'Verified Tutor' : 'Standard Peer'}
                </button>
              </td>
              <td>⭐ {u.reputation} / 5.0</td>
              <td>
                <span className={`tag ${u.status === 'Active' ? 'tag-success' : 'tag-danger'}`}>
                  {u.status}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleGiftBonus(u.id)} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--warning-color)' }}
                    title="Gift +50 XP & +10 Coins"
                  >
                    🪙 +Bonus
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(u.id)} 
                    className={`btn ${u.status === 'Active' ? 'btn-danger' : 'btn-success'}`}
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <Ban size={12} /> {u.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- ADMIN TAB 3: REELS & MEDIA CONTENT MODERATION ---
function AdminReelsModerationTab({ token }) {
  const [reels, setReels] = useState([
    { id: 'reel-1', title: '3 Tricks to solve Recursion fast ⚡ #Java #Algorithms', author: 'Aarav Sharma', college: 'IIT Madras', views: '1.4k', likes: 154, isFeatured: true },
    { id: 'reel-2', title: 'How Spring Boot Inversion of Control works in 60s ☕ #SpringBoot', author: 'Bhavna Patel', college: 'IIT Madras', views: '2.1k', likes: 218, isFeatured: false },
    { id: 'reel-3', title: 'Calculus Gradient Descent Visualized with 3D Contours 📐', author: 'Chaitanya Reddy', college: 'BITS Pilani', views: '890', likes: 94, isFeatured: false }
  ]);

  const handleToggleFeature = (id) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r));
    toast.success("📌 Reel featured status updated for campus feed!");
  };

  const handleDeleteReel = (id) => {
    if (confirm("Delete this educational reel from the community library?")) {
      setReels(prev => prev.filter(r => r.id !== id));
      toast.info("🗑️ Reel deleted.");
    }
  };

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Educational Reels & Content Moderation</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Review student-created concept shorts, pin featured lectures, and filter inappropriate media.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Reel Title & Concept</th>
            <th>Creator & Campus</th>
            <th>Engagement</th>
            <th>Featured Status</th>
            <th style={{ textAlign: 'right' }}>Moderation Action</th>
          </tr>
        </thead>
        <tbody>
          {reels.map(r => (
            <tr key={r.id}>
              <td>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {r.id}</div>
              </td>
              <td>
                <div>{r.author}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.college}</div>
              </td>
              <td>👁️ {r.views} • ❤️ {r.likes}</td>
              <td>
                <span className={`tag ${r.isFeatured ? 'tag-accent' : ''}`}>
                  {r.isFeatured ? '⭐ Campus Featured' : 'Standard'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleToggleFeature(r.id)} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    {r.isFeatured ? 'Unpin' : '📌 Feature'}
                  </button>
                  <button 
                    onClick={() => handleDeleteReel(r.id)} 
                    className="btn btn-danger" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <Ban size={12} /> Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- ADMIN TAB 4: PLATFORM ANALYTICS & HEALTH ---
function AdminOverviewTab({ token }) {
  const [xpPerSolved, setXpPerSolved] = useState(10);
  const [commissionPercent, setCommissionPercent] = useState(5);
  const [examBoostActive, setExamBoostActive] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);

  const stats = {
    totalUsers: 14250,
    totalDoubts: 8940,
    solvedDoubts: 8798,
    liveDoubts: 48
  };

  const saveSettings = (e) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Platform Analytics & Control Center</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: '10px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalUsers.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Registered Students</div>
          </div>
        </div>

        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-purple)', borderRadius: '10px' }}>
            <HelpCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalDoubts.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Doubts Raised</div>
          </div>
        </div>

        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '10px' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.solvedDoubts.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Resolved Workspaces (98.4%)</div>
          </div>
        </div>

        <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '10px' }}>
            <div className="live-dot" style={{ width: '12px', height: '12px' }}></div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.liveDoubts}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active LIVE Rooms</div>
          </div>
        </div>
      </div>

      <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gamification & Economy Parameters</h2>
      <form onSubmit={saveSettings} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '640px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label className="label">XP Awarded per Doubt Solved</label>
            <input type="number" className="input" value={xpPerSolved} onChange={e => setXpPerSolved(e.target.value)} />
          </div>
          <div>
            <label className="label">Peer Mentor Coins Commission (%)</label>
            <input type="number" className="input" value={commissionPercent} onChange={e => setCommissionPercent(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>🔥 2x Exam Week Multiplier</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Doubles all student tutor XP gains for active campus exam weeks</div>
          </div>
          <input type="checkbox" checked={examBoostActive} onChange={e => setExamBoostActive(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary">Save Platform Settings</button>
          {savedSettings && <span style={{ color: 'var(--success-color)', fontSize: '0.8125rem', fontWeight: 700 }}>✓ Settings updated successfully!</span>}
        </div>
      </form>
    </div>
  );
}

// --- ADMIN TAB 5: BADGE CONFIGURATOR ---
function AdminBadgeConfiguratorTab({ token }) {
  const [badges, setBadges] = useState([
    { id: 'b-1', name: 'Top Mentor', desc: '10+ Doubts Resolved with 5-star rating', criteria: 'DOUBTS_SOLVED', val: 10 },
    { id: 'b-2', name: 'Streak Master', desc: 'Maintained 7-day study streak', criteria: 'STREAK_DAYS', val: 7 },
    { id: 'b-3', name: 'Code Wizard', desc: 'Solved 25+ Algorithm problems', criteria: 'XP_EARNED', val: 500 }
  ]);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [criteria, setCriteria] = useState('DOUBTS_SOLVED');
  const [val, setVal] = useState(5);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !desc) return;
    setBadges(prev => [...prev, { id: `b-${Date.now()}`, name, desc, criteria, val: parseInt(val) }]);
    setName('');
    setDesc('');
    toast.success("New Campus Badge rule created!");
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
      <div>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Badge Configurator</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>Define dynamic campus badge rules and unlock conditions.</p>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Badge Name</th>
              <th>Achievement Text</th>
              <th>Criteria Type</th>
              <th>Required Threshold</th>
            </tr>
          </thead>
          <tbody>
            {badges.map(b => (
              <tr key={b.id}>
                <td><strong>{b.name}</strong></td>
                <td>{b.desc}</td>
                <td><code>{b.criteria}</code></td>
                <td>⚡ {b.val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-premium" style={{ height: 'fit-content' }}>
        <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Create New Badge Rule
        </h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Badge Name</label>
            <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Achievement Description</label>
            <textarea className="input" style={{ minHeight: '60px' }} value={desc} onChange={e => setDesc(e.target.value)} required />
          </div>
          <div>
            <label className="label">Criteria Metric</label>
            <select className="input" value={criteria} onChange={e => setCriteria(e.target.value)}>
              <option value="DOUBTS_SOLVED">Doubts Solved</option>
              <option value="STREAK_DAYS">Streak Days</option>
              <option value="XP_EARNED">Experience Points</option>
            </select>
          </div>
          <div>
            <label className="label">Threshold Value</label>
            <input type="number" className="input" value={val} onChange={e => setVal(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Create Badge Rule</button>
        </form>
      </div>
    </div>
  );
}

// --- ADMIN TAB 6: COINS LEDGER ---
function AdminCoinsLedgerTab({ token }) {
  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Coins Ledger & Endorsements</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>Audit peer coin distribution, reward parameters, and anti-collusion safety constraints.</p>

      <div className="grid-2">
        <div className="card-premium">
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Reward Token Allocations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span>Doubt Room Solved Reward:</span>
              <strong>+5 Coins + 10 XP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span>Peer Skill Endorsement:</span>
              <strong>+5 Coins + 10 XP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <span>Daily Streak Login Claim:</span>
              <strong>+1 Coin + 2 XP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Skill Swap Completed:</span>
              <strong>+15 XP to both students</strong>
            </div>
          </div>
        </div>

        <div className="card-premium">
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Anti-Spam Collusion Rules</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The platform automatically enforces unique constraint rules per `(endorser_id, recipient_id, skill)` pair. 
            Self-endorsements are prohibited by PostgreSQL check constraints (`endorser_id &lt;&gt; recipient_id`).
          </p>
        </div>
      </div>
    </div>
  );
}

// --- ADMIN TAB 7: AUDIT LOGS ---
function AdminAuditLogsTab({ token }) {
  const logs = [
    { id: 'log-1', time: 'Aug 28, 2026 23:05', admin: 'super_admin', action: 'DOUBT_FORCE_RESOLVE', desc: 'Resolved Producer-Consumer lock issue and awarded +10 XP to Bhavna Patel' },
    { id: 'log-2', time: 'Aug 28, 2026 22:45', admin: 'super_admin', action: 'SETTINGS_UPDATE', desc: 'Enabled 2x Exam Sprint Multiplier for campus' },
    { id: 'log-3', time: 'Aug 28, 2026 21:10', admin: 'super_admin', action: 'USER_VERIFY', desc: 'Verified tutor credentials for Bhavna Patel (IIT Madras)' },
    { id: 'log-4', time: 'Aug 28, 2026 19:30', admin: 'system', action: 'AUTO_BADGE_AWARD', desc: 'Awarded Top Mentor badge to Aarav Sharma' }
  ];

  return (
    <div>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>System Audit Logs</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>Immutable logs tracking administrator actions, security triggers, and configuration changes.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Admin ID</th>
            <th>Action Code</th>
            <th>Detailed Description</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{l.time}</td>
              <td><code>{l.admin}</code></td>
              <td><span className="tag tag-accent">{l.action}</span></td>
              <td>{l.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

