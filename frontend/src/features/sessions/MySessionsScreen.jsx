import React, { useState } from 'react';
import { 
  Calendar, Clock, Video, BookOpen, Star, CheckCircle, XCircle, 
  ArrowUpRight, AlertCircle, Play, Download, MessageSquare, Plus, X
} from 'lucide-react';

export function MySessionsScreen({ bookedSessions, onLaunchClassroom, onOpenReviewModal, setActiveTab }) {
  const [sessionsTab, setSessionsTab] = useState(() => localStorage.getItem('studyloop_sessions_tab') || 'upcoming');
  const [activeRecordingModal, setActiveRecordingModal] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    localStorage.setItem('studyloop_sessions_tab', sessionsTab);
  }, [sessionsTab]);

  // Stored live class video recordings (YouTube/Coursera lecture archive)
  const recordedLectures = [
    {
      id: 'rec-1',
      title: 'Java OOP: Inheritance, Dynamic Dispatch & @Override Deep Dive',
      tutorName: 'Bhavna Patel',
      tutorCollege: 'IIT Madras',
      tutorAvatar: FEMALE_AVATAR_SVG,
      department: 'Computer Science',
      duration: '32:15 Mins',
      dateRecorded: '28 Aug 2026',
      rating: 4.95,
      subject: 'Java & OOP',
      tags: ['#Inheritance', '#DynamicMethodDispatch', '#SuperKeyword', '#Polymorphism'],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      views: 240,
      doubtNotes: 'Learner was confused on method overriding with runtime type resolution. Solved with animal hierarchy code sample.',
      chapters: [
        { time: '00:00', title: 'Introduction & Problem Statement' },
        { time: '05:30', title: 'Why is Super() constructor invoked first?' },
        { time: '14:20', title: 'Dynamic Method Dispatch in Bytecode' },
        { time: '25:40', title: 'Live Coding & Doubt Resolution' }
      ]
    },
    {
      id: 'rec-2',
      title: 'Dynamic Programming: 0/1 Knapsack State Equations & Memory Optimization',
      tutorName: 'Rohan Deshmukh',
      tutorCollege: 'IIT Bombay',
      tutorAvatar: MALE_AVATAR_SVG,
      department: 'Computer Science',
      duration: '45:10 Mins',
      dateRecorded: '26 Aug 2026',
      rating: 4.9,
      subject: 'Data Structures & Algorithms',
      tags: ['#DynamicProgramming', '#Knapsack', '#Memoization', '#SpaceOptimization'],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      views: 318,
      doubtNotes: 'Step-by-step conversion of recursive exponential tree to 1D array DP table.',
      chapters: [
        { time: '00:00', title: 'Recursive Choice Diagram' },
        { time: '12:15', title: 'Top-Down DP Matrix Formulation' },
        { time: '28:00', title: 'Space Optimization from O(N*W) to O(W)' }
      ]
    },
    {
      id: 'rec-3',
      title: 'C++ Pointers, References & Valgrind Memory Leak Debugging',
      tutorName: 'Chaitanya Reddy',
      tutorCollege: 'BITS Pilani',
      tutorAvatar: MALE_AVATAR_SVG,
      department: 'Electrical & CS',
      duration: '27:40 Mins',
      dateRecorded: '24 Aug 2026',
      rating: 4.85,
      subject: 'C / C++',
      tags: ['#Pointers', '#Valgrind', '#HeapMemory', '#SmartPointers'],
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4',
      views: 184,
      doubtNotes: 'Walkthrough on double pointers and freeing post-order binary tree nodes cleanly.',
      chapters: [
        { time: '00:00', title: 'Stack vs Heap in C++' },
        { time: '08:45', title: 'Reading Valgrind Memory Leak Traces' },
        { time: '19:20', title: 'Smart Pointers: std::unique_ptr vs std::shared_ptr' }
      ]
    }
  ];

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Study Classes & Video Lecture Archive
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Launch live WebRTC video classrooms with peer tutors or watch saved video lecture recordings with chapter notes.
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setSessionsTab('upcoming')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: 700,
                backgroundColor: sessionsTab === 'upcoming' ? 'var(--bg-secondary)' : 'transparent',
                color: sessionsTab === 'upcoming' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                boxShadow: sessionsTab === 'upcoming' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              📅 Booked Classes ({bookedSessions.length})
            </button>
            <button
              onClick={() => setSessionsTab('recordings')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: 700,
                backgroundColor: sessionsTab === 'recordings' ? 'var(--bg-secondary)' : 'transparent',
                color: sessionsTab === 'recordings' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                boxShadow: sessionsTab === 'recordings' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              📼 Recorded Lectures ({recordedLectures.length})
            </button>
          </div>

          <button onClick={() => setActiveTab('discover')} className="btn btn-accent" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
            <Search size={14} /> Find More Tutors
          </button>
        </div>
      </div>

      {/* TAB 1: UPCOMING & BOOKED SESSIONS */}
      {sessionsTab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookedSessions.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
              <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Active Booked Sessions</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Find a verified peer tutor to schedule your first 1:1 study session.</p>
              <button onClick={() => setActiveTab('discover')} className="btn btn-accent">Explore Peer Tutors 🚀</button>
            </div>
          ) : (
            bookedSessions.map(session => (
              <div key={session.id} className="card-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1, minWidth: '300px' }}>
                  <img src={session.tutorAvatar} alt={session.tutorName} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="tag tag-accent">{session.duration}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.time}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: session.fee === 0 ? 'var(--success-color)' : 'var(--accent-primary)' }}>
                        {session.fee === 0 ? 'FREE Session' : `₹${session.fee} Paid (Escrow Active)`}
                      </span>
                    </div>
                    <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>
                      {session.topic}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Tutor: <strong>{session.tutorName}</strong> ({session.tutorCollege}) • Notes: <em>"{session.doubtNotes}"</em>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {session.status === 'confirmed' ? (
                    <button 
                      onClick={() => onLaunchClassroom(session)} 
                      className="btn btn-accent" 
                      style={{ padding: '0.75rem 1.5rem', fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-glow)' }}
                    >
                      <Video size={18} /> Enter Live Classroom 🚀
                    </button>
                  ) : session.rated ? (
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--success-color)', fontWeight: 700 }}>
                      ✓ Completed & Rated 5.0 ⭐
                    </div>
                  ) : (
                    <button 
                      onClick={() => onOpenReviewModal(session)} 
                      className="btn btn-primary" 
                      style={{ padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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

      {/* TAB 2: RECORDED CLASSES & LECTURE ARCHIVE */}
      {sessionsTab === 'recordings' && (
        <div>
          {/* Banner */}
          <div className="card-premium" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="tag tag-success" style={{ marginBottom: '0.5rem', fontSize: '0.6875rem', fontWeight: 800 }}>
                  📼 100% Cloud Recorded & Synced
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                  Your Academic Lecture Library
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Re-watch any 1:1 doubt session with interactive video chapters, live code snippets, and tutor revision notes.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-primary)' }}>3 Recorded</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Class Sessions</div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--success-color)' }}>1 hr 45m</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Watch Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stored Video Recordings Grid */}
          <div className="grid-3">
            {recordedLectures.map(rec => (
              <div key={rec.id} className="card-premium interactive-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
                
                {/* Video Thumbnail Preview */}
                <div 
                  onClick={() => setActiveRecordingModal(rec)}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#000000',
                    aspectRatio: '16/9',
                    cursor: 'pointer'
                  }}
                >
                  <video src={rec.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  
                  {/* Play Overlay Button */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(59, 130, 246, 0.9)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      transition: 'transform var(--transition-fast)'
                    }}>
                      <Play size={22} fill="#ffffff" style={{ marginLeft: '3px' }} />
                    </div>
                  </div>

                  {/* Duration & Views Badge */}
                  <span style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(0,0,0,0.85)', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    ⏱️ {rec.duration}
                  </span>

                  <span style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.9)', color: '#ffffff', fontSize: '0.625rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    HD 1080p
                  </span>
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>{rec.subject}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{rec.dateRecorded}</span>
                  </div>

                  <h3 
                    onClick={() => setActiveRecordingModal(rec)}
                    style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)', cursor: 'pointer', lineHeight: 1.35 }}
                  >
                    {rec.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                    <img src={rec.tutorAvatar} alt="Tutor" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--accent-primary)' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{rec.tutorName}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{rec.tutorCollege} • ⭐ {rec.rating}</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.875rem' }}>
                    {rec.tags.map((t, idx) => (
                      <span key={idx} style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', backgroundColor: 'var(--accent-light)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <button 
                      onClick={() => setActiveRecordingModal(rec)} 
                      className="btn btn-accent" 
                      style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 700 }}
                    >
                      <Play size={13} /> Watch Recording
                    </button>
                    <button 
                      onClick={() => alert(`Downloading Concept Summary Notes for: ${rec.title}...`)} 
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                      title="Download PDF Study Notes"
                    >
                      <Download size={14} /> Notes
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERACTIVE RECORDED CLASS VIDEO PLAYER MODAL */}
      {activeRecordingModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.88)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--bg-elevated)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="tag tag-success" style={{ fontSize: '0.6875rem', fontWeight: 800 }}>📼 Live Class Recorded Session</span>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>{activeRecordingModal.title}</h3>
              </div>
              <button onClick={() => setActiveRecordingModal(null)} className="btn-icon"><X size={20} /></button>
            </div>

            {/* Video Player */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000000', position: 'relative' }}>
              <video 
                src={activeRecordingModal.videoUrl} 
                controls 
                autoPlay 
                style={{ width: '100%', height: '380px', objectFit: 'cover' }} 
              />
            </div>

            {/* Playback Controls & Chapters Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
              
              {/* Tutor & Concept Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
                  <img src={activeRecordingModal.tutorAvatar} alt="Tutor" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Taught by {activeRecordingModal.tutorName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activeRecordingModal.tutorCollege} • {activeRecordingModal.department}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.8125rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                    📝 Post-Session Tutor Notes:
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    "{activeRecordingModal.doubtNotes}"
                  </p>
                </div>
              </div>

              {/* Chapter Timeline Markers */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                  ⏱️ Chapter Timestamps:
                </div>
                {activeRecordingModal.chapters?.map((ch, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', padding: '0.35rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{ch.time}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{ch.title}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

