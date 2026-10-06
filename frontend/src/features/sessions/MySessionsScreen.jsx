import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';
import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { 
  AlertCircle, 
  ArrowUpRight, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Download, 
  FileText, 
  MessageSquare, 
  Plus, 
  Search, 
  Shield, 
  Star, 
  Video, 
  X, 
  XCircle 
} from 'lucide-react';

export function MySessionsScreen({ bookedSessions, onLaunchClassroom, onOpenReviewModal, setActiveTab }) {
  const [sessionsTab, setSessionsTab] = useState(() => localStorage.getItem('studyloop_sessions_tab') || 'upcoming');
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem('studyloop_sessions_tab', sessionsTab);
  }, [sessionsTab]);

  // Completed sessions history with peer notes and key takeaways (zero video storage overhead)
  const completedSessionsNotes = [
    {
      id: 'notes-1',
      title: 'Java OOP: Inheritance, Dynamic Dispatch & @Override Deep Dive',
      tutorName: 'Bhavna Patel',
      tutorCollege: 'IIT Madras',
      tutorAvatar: FEMALE_AVATAR_SVG,
      department: 'Computer Science',
      duration: '30 Mins',
      completedDate: '28 Aug 2026',
      rating: 5.0,
      subject: 'Java & OOP',
      tags: ['#Inheritance', '#DynamicMethodDispatch', '#SuperKeyword', '#Polymorphism'],
      doubtNotes: 'Clarified runtime method dispatch in bytecode and super() initialization sequence.',
      keyTakeaways: [
        'super() must be the first statement in derived constructor.',
        'Dynamic dispatch resolves methods at runtime using the object type on heap.',
        'Static methods are resolved at compile time using reference type.'
      ]
    },
    {
      id: 'notes-2',
      title: 'Dynamic Programming: 0/1 Knapsack & Memory Optimization',
      tutorName: 'Rohan Deshmukh',
      tutorCollege: 'IIT Bombay',
      tutorAvatar: MALE_AVATAR_SVG,
      department: 'Computer Science',
      duration: '45 Mins',
      completedDate: '26 Aug 2026',
      rating: 4.9,
      subject: 'Data Structures & Algorithms',
      tags: ['#DynamicProgramming', '#Knapsack', '#Memoization', '#SpaceOptimization'],
      doubtNotes: 'Step-by-step conversion of recursive tree to 1D space optimized table.',
      keyTakeaways: [
        'Choice diagram: include current weight if w <= W, or exclude.',
        'Space can be reduced from O(N*W) to O(W) by iterating capacity backwards.',
        'Avoid integer overflow when summing high value bounds.'
      ]
    }
  ];

  return (
    <div className="studyloop-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="font-serif" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
              1:1 Peer Study Sessions
            </h1>
            <span className="tag" style={{ background: '#10b981', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem' }}>
              🛡️ 10-Min Free Demo Active
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '0.35rem 0 0 0', fontSize: '0.875rem' }}>
            Manage upcoming live doubt sessions, collaborate in real-time WebRTC study rooms, and review peer study notes.
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('connections')} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <Plus size={18} /> Find Campus Mentors
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setSessionsTab('upcoming')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.6rem 1.25rem',
            fontWeight: 800,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            color: sessionsTab === 'upcoming' ? 'var(--primary-color)' : 'var(--text-secondary)',
            borderBottom: sessionsTab === 'upcoming' ? '2px solid var(--primary-color)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Calendar size={17} /> Upcoming Live Sessions ({bookedSessions.length})
        </button>

        <button
          onClick={() => setSessionsTab('notes')}
          style={{
            background: 'none',
            border: 'none',
            padding: '0.6rem 1.25rem',
            fontWeight: 800,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            color: sessionsTab === 'notes' ? 'var(--primary-color)' : 'var(--text-secondary)',
            borderBottom: sessionsTab === 'notes' ? '2px solid var(--primary-color)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FileText size={17} /> Completed Sessions & Peer Notes ({completedSessionsNotes.length})
        </button>
      </div>

      {/* TAB 1: UPCOMING SESSIONS */}
      {sessionsTab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookedSessions.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧑‍🏫</div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>No Upcoming Study Sessions</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
                Need help with DSA, Semester Exams, or Placement Interviews? Connect with verified seniors across campuses with our 10-Minute Free Demo.
              </p>
              <button onClick={() => setActiveTab('connections')} className="btn btn-primary">
                Browse Campus Mentors
              </button>
            </div>
          ) : (
            bookedSessions.map(session => (
              <div key={session.id} className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1, minWidth: '300px' }}>
                  <img src={session.tutorAvatar} alt={session.tutorName} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <span className="tag tag-accent">{session.duration}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{session.time}</span>
                      {session.sessionType === 'swap' ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          🔄 Peer Skill Swap (100% Free Barter)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>
                          ⭐ 10-Min Free Demo Included (₹{session.fee || 50})
                        </span>
                      )}
                      {session.languages && session.languages.length > 0 && (
                        <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                          🗣️ {session.languages.join(' / ')}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>
                      {session.topic}
                    </h3>
                    {session.sessionType === 'swap' && session.swapOfferSubject && (
                      <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, margin: '2px 0 4px 0' }}>
                        🤝 Barter: You teach <strong>{session.swapOfferSubject}</strong> ⮀ Mentor teaches <strong>{session.topic}</strong>
                      </div>
                    )}
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Mentor: <strong>{session.tutorName}</strong> ({session.tutorCollege}) {session.sessionType !== 'swap' && <>• Direct UPI: <code>{session.tutorUpi || `${session.tutorName.toLowerCase().replace(/\s+/g, '')}@upi`}</code></>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {session.status === 'confirmed' ? (
                    <button 
                      onClick={() => onLaunchClassroom(session)} 
                      className="btn btn-primary" 
                      style={{ padding: '0.75rem 1.5rem', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Video size={18} /> Enter Live Classroom 🚀
                    </button>
                  ) : session.rated ? (
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: '#10b981', fontWeight: 700 }}>
                      ✓ Completed & Rated 5.0 ⭐
                    </div>
                  ) : (
                    <button 
                      onClick={() => onOpenReviewModal(session)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Star size={16} /> Rate Concept Clarity ⭐
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: COMPLETED SESSIONS & PEER NOTES */}
      {sessionsTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-premium" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={24} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  Zero-Storage Peer Study Repository
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Live 1:1 sessions are conducted peer-to-peer over secure WebRTC. Key takeaways and revision notes are saved directly in your personal student library without consuming cloud video storage.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {completedSessionsNotes.map(item => (
              <div key={item.id} className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="tag tag-accent">{item.subject}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.completedDate}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.4rem 0' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Taught by <strong>{item.tutorName}</strong> ({item.tutorCollege}) • ⭐ {item.rating}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Key Concepts Mastered
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {item.keyTakeaways.map((point, pIdx) => (
                      <li key={pIdx} style={{ marginBottom: '0.25rem' }}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button 
                    onClick={() => toast.success(`Downloading PDF notes for ${item.title}...`)}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.78rem', fontWeight: 700, padding: '0.5rem' }}
                  >
                    <Download size={14} style={{ marginRight: '0.35rem' }} /> Download Summary
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('connections');
                      toast.info(`Redirecting to connect with ${item.tutorName}...`);
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.5rem 1rem' }}
                  >
                    Book Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
