import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { 
  AlertCircle, 
  ArrowRight, 
  ArrowUpRight, 
  BookOpen, 
  Calendar, 
  Check, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Download, 
  FileText, 
  Globe, 
  Link2, 
  Lock, 
  MessageSquare, 
  Plus, 
  Search, 
  Share2, 
  Shield, 
  Star, 
  Users, 
  Video, 
  X, 
  XCircle, 
  Zap 
} from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG } from '../../constants/avatars';

export function MySessionsScreen({ bookedSessions = [], onLaunchClassroom, onOpenReviewModal, setActiveTab }) {
  const { profile } = useAuth();
  const toast = useToast();

  const [activeTabMode, setActiveTabMode] = useState('upcoming'); // 'upcoming', 'public_classes', 'notes'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(null); // class object when sharing

  // Create class form state
  const [classTitle, setClassTitle] = useState('');
  const [classSubject, setClassSubject] = useState('Java & Data Structures');
  const [classDate, setClassDate] = useState('Today');
  const [classTime, setClassTime] = useState('6:00 PM');
  const [classType, setClassType] = useState('public'); // 'public' | 'private'
  const [classLanguage, setClassLanguage] = useState('Telugu / English');
  const [classPasscode, setClassPasscode] = useState('1337');

  // List of website peers for direct chat sharing
  const campusPeers = [
    { id: 'c-1', fullName: 'Bhavna Patel', college: 'IIT Madras', avatarUrl: FEMALE_AVATAR_SVG },
    { id: 'c-2', fullName: 'Chaitanya Reddy', college: 'BITS Pilani', avatarUrl: MALE_AVATAR_SVG },
    { id: 'c-3', fullName: 'Rohan Deshmukh', college: 'IIT Bombay', avatarUrl: MALE_AVATAR_SVG },
    { id: 'c-4', fullName: 'Divya Nambiar', college: 'NIT Trichy', avatarUrl: FEMALE_AVATAR_SVG }
  ];

  // Scheduled & Created classes list
  const [classList, setClassList] = useState([
    {
      id: 'class-101',
      title: 'Java Multithreading & Producer-Consumer Locks Masterclass',
      subject: 'Java & Concurrency',
      mentorName: 'Aarav Sharma',
      mentorCollege: 'IIT Madras',
      mentorAvatar: MALE_AVATAR_SVG,
      date: 'Today',
      time: '6:30 PM',
      type: 'public',
      language: 'Telugu / English',
      meetLink: 'https://studyloop.app/class?room=class-101',
      attendees: 8
    },
    {
      id: 'class-102',
      title: 'Google & Microsoft SDE-1 OA Graph DP Cheatsheet & Live Coding',
      subject: 'Algorithms & DSA',
      mentorName: 'Bhavna Patel',
      mentorCollege: 'IIT Madras',
      mentorAvatar: FEMALE_AVATAR_SVG,
      date: 'Tomorrow',
      time: '8:00 PM',
      type: 'public',
      language: 'English',
      meetLink: 'https://studyloop.app/class?room=class-102',
      attendees: 15
    },
    {
      id: 'class-103',
      title: '1:1 Private Mentoring: Spring Boot JWT & Microservices',
      subject: 'Backend Architecture',
      mentorName: 'Rohan Deshmukh',
      mentorCollege: 'IIT Bombay',
      mentorAvatar: MALE_AVATAR_SVG,
      date: 'Thursday',
      time: '7:00 PM',
      type: 'private',
      language: 'Telugu / English',
      meetLink: 'https://studyloop.app/class?room=class-103',
      passcode: '9082',
      attendees: 2
    }
  ]);

  // Handle Create Class
  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!classTitle.trim()) return;

    const newClassId = `class-${Date.now().toString().slice(-4)}`;
    const newClass = {
      id: newClassId,
      title: classTitle.trim(),
      subject: classSubject,
      mentorName: profile?.fullName || 'Aarav Sharma',
      mentorCollege: profile?.college || 'IIT Madras',
      mentorAvatar: getDefaultAvatarByGender(profile?.gender, profile?.avatarUrl),
      date: classDate,
      time: classTime,
      type: classType,
      language: classLanguage,
      meetLink: `https://studyloop.app/class?room=${newClassId}`,
      passcode: classType === 'private' ? classPasscode : null,
      attendees: 1
    };

    setClassList([newClass, ...classList]);
    setShowCreateModal(false);
    setClassTitle('');
    toast.success(`🎉 ${classType === 'public' ? 'Public' : 'Private'} Class Created! Meeting link is ready.`);
  };

  // Share to Chat
  const handleShareToPeerChat = (peer, targetClass) => {
    toast.success(`💬 Meet link sent to ${peer.fullName}'s chat!`);
    navigator.clipboard.writeText(targetClass.meetLink);
    setShowShareModal(null);
    if (setActiveTab) {
      setActiveTab('chat');
    }
  };

  return (
    <div className="studyloop-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>

      {/* ── TOP HEADER ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px', marginBottom: '22px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '6px' }}>
            🎓 Live Study Sessions & Peer Classrooms
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Classes & Video Mentoring
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.86rem' }}>
            Create public or private study classes, share meeting links with website friends, or learn from mentors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('discover')} 
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
              fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            <Search size={15} /> Find Campus Mentors
          </button>

          <button 
            onClick={() => setShowCreateModal(true)} 
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px', border: 'none',
              backgroundColor: 'var(--accent-primary)', color: '#ffffff',
              fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 102, 255, 0.25)'
            }}
          >
            <Plus size={16} /> Create New Class 🚀
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '20px' }}>
        {[
          { id: 'upcoming', label: `📅 All Scheduled Classes (${classList.length})` },
          { id: 'public_classes', label: `🌐 Campus Public Classes (${classList.filter(c => c.type === 'public').length})` },
          { id: 'notes', label: '📜 Completed Notes & Archive' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTabMode(t.id)}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none',
              backgroundColor: activeTabMode === t.id ? 'var(--accent-primary)' : 'transparent',
              color: activeTabMode === t.id ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CLASSES GRID ── */}
      {activeTabMode !== 'notes' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {classList
            .filter(c => activeTabMode === 'upcoming' || c.type === 'public')
            .map(cls => (
              <div
                key={cls.id}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div>
                  {/* Card Header: Type Badge & Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px',
                      backgroundColor: cls.type === 'public' ? 'rgba(0,102,255,0.1)' : 'rgba(245,158,11,0.1)',
                      color: cls.type === 'public' ? 'var(--accent-primary)' : '#d97706',
                      display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                      {cls.type === 'public' ? <Globe size={12} /> : <Lock size={12} />}
                      {cls.type === 'public' ? 'Public Class (Campus)' : 'Private Class (Passcode)'}
                    </span>

                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {cls.date} • {cls.time}
                    </span>
                  </div>

                  {/* Title & Subject */}
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                    {cls.title}
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Subject: <strong style={{ color: 'var(--text-primary)' }}>{cls.subject}</strong> • 🗣️ Spoken: <strong style={{ color: 'var(--text-primary)' }}>{cls.language}</strong>
                  </div>

                  {/* Mentor Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: '10px' }}>
                    <img src={cls.mentorAvatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cls.mentorName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cls.mentorCollege}</div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      👥 {cls.attendees} Attending
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Enter Classroom + Share Meet Link */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => {
                      if (onLaunchClassroom) {
                        onLaunchClassroom(cls);
                      } else {
                        toast.success(`Launching Classroom for ${cls.title}! 🚀`);
                      }
                    }}
                    style={{
                      flex: 1, padding: '9px 14px', borderRadius: '8px', border: 'none',
                      backgroundColor: 'var(--accent-primary)', color: '#ffffff',
                      fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <Video size={14} /> Enter Class 🚀
                  </button>

                  <button
                    onClick={() => setShowShareModal(cls)}
                    style={{
                      padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
                      fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                    title="Share Meet Link with website friends"
                  >
                    <Share2 size={14} /> Share Link
                  </button>
                </div>

              </div>
            ))}
        </div>
      ) : (
        /* Completed Notes Archive */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { title: 'Java OOP: Polymorphism & Dynamic Dispatch', tutor: 'Bhavna Patel', college: 'IIT Madras', rating: 5.0, date: '2 days ago' },
            { title: 'Dynamic Programming 0/1 Knapsack Space Reduction', tutor: 'Rohan Deshmukh', college: 'IIT Bombay', rating: 4.9, date: '4 days ago' }
          ].map((note, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' }}>{note.title}</h4>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Taught by {note.tutor} ({note.college}) • ⭐ {note.rating} • {note.date}</div>
              </div>
              <button
                onClick={() => toast.success('📥 Downloading session notes PDF!')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <Download size={13} /> Notes PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE CLASS MODAL (PUBLIC / PRIVATE WITH MEET LINK) ── */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🎓</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Create Class & Meeting Link
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Host a live audio/video class with whiteboard & compiler
                  </div>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateClass}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Class Title / Topic *
                </label>
                <input
                  type="text"
                  required
                  value={classTitle}
                  onChange={e => setClassTitle(e.target.value)}
                  placeholder="e.g. React Hooks Deep Dive, Java Memory Model, DSA Graphs"
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', fontSize: '0.82rem', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={classSubject}
                    onChange={e => setClassSubject(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '8px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.8rem', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Spoken Language
                  </label>
                  <select
                    value={classLanguage}
                    onChange={e => setClassLanguage(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '8px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.8rem'
                    }}
                  >
                    <option value="Telugu / English">🗣️ Telugu / English</option>
                    <option value="English">🗣️ English Only</option>
                    <option value="Telugu">🗣️ Telugu (తెలుగు)</option>
                    <option value="Hindi">🗣️ Hindi (हिंदी)</option>
                  </select>
                </div>
              </div>

              {/* Public vs Private Class Selector */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Class Privacy Mode
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div
                    onClick={() => setClassType('public')}
                    style={{
                      padding: '10px', borderRadius: '8px', cursor: 'pointer',
                      border: classType === 'public' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: classType === 'public' ? 'var(--accent-light)' : 'var(--bg-tertiary)'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: classType === 'public' ? 'var(--accent-primary)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={13} /> Public Class
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Broadcast to all campus students
                    </div>
                  </div>

                  <div
                    onClick={() => setClassType('private')}
                    style={{
                      padding: '10px', borderRadius: '8px', cursor: 'pointer',
                      border: classType === 'private' ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: classType === 'private' ? 'var(--accent-light)' : 'var(--bg-tertiary)'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: classType === 'private' ? 'var(--accent-primary)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={13} /> Private Class
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Only people with link / passcode
                    </div>
                  </div>
                </div>
              </div>

              {classType === 'private' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Private Passcode
                  </label>
                  <input
                    type="text"
                    value={classPasscode}
                    onChange={e => setClassPasscode(e.target.value)}
                    placeholder="e.g. 1337"
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '8px',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.8rem', boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Create Class & Get Link 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SHARE TO CHAT MODAL ── */}
      {showShareModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '20px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Share2 size={16} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Share Meet Link to Peer Chat
                </h3>
              </div>
              <button onClick={() => setShowShareModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            {/* Meet link copy box */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: '8px', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
              <input
                readOnly
                value={showShareModal.meetLink}
                style={{ flex: 1, background: 'none', border: 'none', fontSize: '0.76rem', color: 'var(--accent-primary)', fontWeight: 700, outline: 'none' }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showShareModal.meetLink);
                  toast.success('🔗 Meet link copied to clipboard!');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Copy
              </button>
            </div>

            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
              SEND DIRECTLY TO CAMPUS FRIENDS:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {campusPeers.map(peer => (
                <div
                  key={peer.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={peer.avatarUrl} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{peer.fullName}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{peer.college}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleShareToPeerChat(peer, showShareModal)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '5px 10px', borderRadius: '6px', border: 'none',
                      backgroundColor: 'var(--accent-primary)', color: '#fff',
                      fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    <Send size={11} /> Send in Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
