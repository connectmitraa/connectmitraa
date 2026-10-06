import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { ProfileAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { AlertCircle, ArrowLeft, Award, BarChart3, Bell, BookOpen, Briefcase, Building2, Calendar, Camera, Check, CheckCircle, CheckCircle2, Clock, Code, Coins, Compass, Download, ExternalLink, Eye, EyeOff, FileText, Flame, FolderOpen, Github, Globe, GraduationCap, Key, Lock, Mail, MapPin, Moon, Phone, Play, Plus, RefreshCw, Save, School, Search, Shield, Sun, Trash2, Trophy, Tv2, Upload, UploadCloud, User, X } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';
import { AvatarChangeModal } from '../../components/modals/AvatarChangeModal';
import { PhotoPreviewModal } from '../../components/modals/PhotoPreviewModal';
import { StudentVerificationSection } from './StudentVerificationSection';
import { MentoringPayoutSection } from './MentoringPayoutSection';

export function SettingsScreen({ token, setActiveTab, theme, setTheme }) {
  const { user, profile: authProfile, updateProfileState, testAccounts } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // CLEAN VECTOR PRESETS ONLY (NO STRANGER PHOTOS)
  const AVATAR_PRESETS = [
    { id: 'vector_m', label: '👨 Male Vector', isVector: true, gender: 'male' },
    { id: 'vector_f', label: '👩 Female Vector', isVector: true, gender: 'female' },
    { id: 'vector_n', label: '🧑 Neutral Vector', isVector: true, gender: 'other' }
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image must be smaller than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          const updated = { ...formData, avatarUrl: dataUrl };
          setFormData(updated);
          handleSaveAll(updated);
          toast.success("Profile photo updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Cover image must be smaller than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          const updated = { ...formData, coverUrl: dataUrl };
          setFormData(updated);
          handleSaveAll(updated);
          toast.success("Cover banner updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Resume file must be smaller than 10MB");
        return;
      }
      const updated = {
        ...formData,
        resumeFileName: file.name,
        resumeUploadDate: 'Just now'
      };
      setFormData(updated);
      handleSaveAll(updated);
      toast.success(`Resume "${file.name}" uploaded successfully!`);
    }
  };
  
  // Categorized navigation with persistence
  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem('studyloop_settings_category') || 'basic';
  });

  useEffect(() => {
    if (activeCategory) {
      localStorage.setItem('studyloop_settings_category', activeCategory);
    }
  }, [activeCategory]);

  const [searchFilter, setSearchFilter] = useState('');
  const [saveToast, setSaveToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [reachTimeframe, setReachTimeframe] = useState('30d'); // '7d', '30d', 'all'

  // Initialize editable state
  const currentProfile = authProfile || {};
  
  const [formData, setFormData] = useState({
    fullName: currentProfile.fullName || 'Aarav Sharma',
    headline: currentProfile.headline || 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist',
    bio: currentProfile.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor • Peer Learning & Research',
    college: currentProfile.college || 'IIT Madras',
    department: currentProfile.department || 'Computer Science',
    year: currentProfile.year || 2,
    gender: currentProfile.gender || 'male',
    location: currentProfile.location || 'Chennai, Tamil Nadu, India',
    pronouns: currentProfile.pronouns || 'He/Him',
    avatarUrl: currentProfile.avatarUrl || '',
    bannerTheme: currentProfile.bannerTheme || 'royal-blue',
    walletBalance: currentProfile.walletBalance !== undefined ? currentProfile.walletBalance : 450,
    hourlyRate: currentProfile.hourlyRate || 50,
    upiId: currentProfile.upiId || 'aarav@oksbi',
    freeDemoAvailable: currentProfile.freeDemoAvailable !== undefined ? currentProfile.freeDemoAvailable : true,
    collegeEmail: currentProfile.collegeEmail || 'cs23b015@iitm.ac.in',
    collegeIdCard: currentProfile.collegeIdCard || 'IITM-2023-CS-042',
    verificationStatus: currentProfile.verificationStatus || 'VERIFIED',
    targetGoal: currentProfile.targetGoal || '🚀 Placements & Referrals',
    coinRate: currentProfile.coinRate || 45,
    isAvailableForMentoring: currentProfile.isAvailableForMentoring !== undefined ? currentProfile.isAvailableForMentoring : true,
    teachingSkills: currentProfile.teachingSkills || ['Java', 'Algorithms', 'Data Structures', 'React', 'Spring Boot'],
    learningGoals: currentProfile.learningGoals || ['System Design', 'AI/ML', 'Microservices'],
    socialLinks: currentProfile.socialLinks || {
      github: 'https://github.com/aaravsharma',
      linkedin: 'https://linkedin.com/in/aarav-sharma-cs',
      leetcode: 'https://leetcode.com/aarav_codes',
      portfolio: 'https://aaravsharma.dev',
      codeforces: 'https://codeforces.com/profile/aarav_codes',
      twitter: 'https://twitter.com/aarav_codes'
    },
    educations: currentProfile.educations || [
      {
        id: 'edu-1',
        school: 'Indian Institute of Technology (IIT) Madras',
        degree: 'Bachelor of Technology - B.Tech',
        field: 'Computer Science & Engineering',
        startYear: '2023',
        endYear: '2027',
        grade: '8.95 / 10.0 CGPA',
        activities: 'Lead at Google Developer Student Club (GDSC), Campus Doubt Mentor'
      },
      {
        id: 'edu-2',
        school: 'Delhi Public School (DPS), R.K. Puram',
        degree: 'Higher Secondary School Certificate (Class XII)',
        field: 'Physics, Chemistry, Mathematics & Computer Science',
        startYear: '2021',
        endYear: '2023',
        grade: '96.4% Aggregate',
        activities: 'National Cyber Olympiad Gold Medalist'
      }
    ],
    certifications: currentProfile.certifications || [
      {
        id: 'cert-1',
        name: 'Oracle Certified Associate, Java SE 8 Programmer (1Z0-808)',
        issuer: 'Oracle',
        issueDate: 'Jan 2026',
        credentialId: 'OCA-JAVA-98742',
        credentialUrl: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=demo',
        badgeIcon: '☕'
      },
      {
        id: 'cert-2',
        name: 'NPTEL Elite Gold: Programming, Data Structures And Algorithms In Python',
        issuer: 'IIT Madras & NPTEL',
        issueDate: 'Oct 2025',
        credentialId: 'NPTEL25CS89104',
        credentialUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS89104',
        badgeIcon: '🐍'
      },
      {
        id: 'cert-3',
        name: 'AWS Certified Cloud Practitioner (CLF-C02)',
        issuer: 'Amazon Web Services (AWS)',
        issueDate: 'May 2025',
        credentialId: 'AWS-CCP-76291',
        credentialUrl: 'https://aws.amazon.com/verification',
        badgeIcon: '☁️'
      }
    ],
    achievements: currentProfile.achievements || [
      {
        id: 'ach-1',
        title: 'Smart India Hackathon (SIH 2025) - National Finalist',
        issuer: 'Ministry of Education & Unstop',
        date: 'Dec 2025',
        desc: 'Selected in Top 5 teams out of 12,000+ national submissions for building AI peer doubt router.'
      },
      {
        id: 'ach-2',
        title: 'LeetCode Knight Badge (Top 2.5% Globally • Rating: 1985)',
        issuer: 'LeetCode',
        date: '2026',
        desc: 'Solved 450+ data structures & algorithms questions with 85% dynamic programming accuracy.'
      },
      {
        id: 'ach-3',
        title: 'Flipkart GRiD 6.0 Software Development Semi-Finalist',
        issuer: 'Flipkart & Unstop',
        date: 'Aug 2025',
        desc: 'Built high-throughput inventory allocation service handling 10k QPS simulation.'
      }
    ],
    projects: currentProfile.projects || [
      {
        id: 'proj-1',
        title: 'PeerCode - WebRTC Real-Time Collaborative Workspace',
        stack: ['React', 'WebRTC', 'Node.js', 'Socket.io', 'Java'],
        desc: 'Low-latency collaborative coding and live doubt-solving workspace with synchronized editor and audio/video.',
        githubUrl: 'https://github.com/aaravsharma/peercode-workspace',
        liveUrl: 'https://peercode.studyloop.app'
      },
      {
        id: 'proj-2',
        title: 'AlgoVisualizer - Interactive Graph & DP Algorithm Visualizer',
        stack: ['JavaScript', 'Canvas API', 'Algorithms', 'CSS3'],
        desc: 'Step-by-step interactive animations for Dijkstra, BFS/DFS, 0/1 Knapsack, and Tree traversals used by 500+ students.',
        githubUrl: 'https://github.com/aaravsharma/algo-visualizer',
        liveUrl: 'https://algovis.studyloop.app'
      }
    ],
    resumeFileName: currentProfile.resumeFileName || 'Aarav_Sharma_BTech_CS_Resume.pdf',
    resumeUploadDate: currentProfile.resumeUploadDate || 'Aug 2026',
    notificationSettings: {
      doubtAlerts: true,
      directMessages: true,
      streakReminders: true,
      leaderboardUpdates: true,
      emailDigest: false
    },
    privacySettings: {
      profileVisibility: 'public',
      allowDirectDoubts: true,
      showActivityStatus: true,
      twoFactorEnabled: false
    }
  });

  // Modals for adding items
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', field: '', startYear: '2023', endYear: '2027', grade: '', activities: '' });
  
  const [showAddCert, setShowAddCert] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', issuer: 'Oracle', issueDate: 'Aug 2026', credentialId: '', credentialUrl: '', badgeIcon: '☕' });

  const [showAddAch, setShowAddAch] = useState(false);
  const [newAch, setNewAch] = useState({ title: '', issuer: '', date: '2026', desc: '' });

  const [showAddProj, setShowAddProj] = useState(false);
  const [newProj, setNewProj] = useState({ title: '', stack: '', desc: '', githubUrl: '', liveUrl: '' });

  const [newSkillTag, setNewSkillTag] = useState('');

  // Save & Real-Time Reflection Handler
  const handleSaveAll = (customUpdates = {}) => {
    setIsSaving(true);
    const updated = {
      ...currentProfile,
      ...formData,
      ...customUpdates
    };
    if (updateProfileState) {
      updateProfileState(updated);
    }
    if (updated.id) {
      localStorage.setItem(`studyloop_profile_${updated.id}`, JSON.stringify(updated));
    }
    setTimeout(() => {
      setIsSaving(false);
      setSaveToast("✅ All profile & settings changes updated and reflected live!");
      setTimeout(() => setSaveToast(null), 3500);
    }, 250);
  };

  // Education Helpers
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.school.trim() || !newEdu.degree.trim()) return;
    const entry = { ...newEdu, id: `edu-${Date.now()}` };
    const nextEducations = [entry, ...(formData.educations || [])];
    const nextForm = { ...formData, educations: nextEducations };
    setFormData(nextForm);
    handleSaveAll(nextForm);
    setShowAddEdu(false);
    setNewEdu({ school: '', degree: '', field: '', startYear: '2023', endYear: '2027', grade: '', activities: '' });
  };

  const handleDeleteEducation = (id) => {
    const nextEducations = (formData.educations || []).filter(e => e.id !== id);
    const nextForm = { ...formData, educations: nextEducations };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Certificate Helpers
  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!newCert.name.trim() || !newCert.issuer.trim()) return;
    const entry = { ...newCert, id: `cert-${Date.now()}` };
    const nextCerts = [entry, ...(formData.certifications || [])];
    const nextForm = { ...formData, certifications: nextCerts };
    setFormData(nextForm);
    handleSaveAll(nextForm);
    setShowAddCert(false);
    setNewCert({ name: '', issuer: 'Oracle', issueDate: 'Aug 2026', credentialId: '', credentialUrl: '', badgeIcon: '☕' });
  };

  const handleDeleteCertificate = (id) => {
    const nextCerts = (formData.certifications || []).filter(c => c.id !== id);
    const nextForm = { ...formData, certifications: nextCerts };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Achievement Helpers
  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!newAch.title.trim()) return;
    const entry = { ...newAch, id: `ach-${Date.now()}` };
    const nextAch = [entry, ...(formData.achievements || [])];
    const nextForm = { ...formData, achievements: nextAch };
    setFormData(nextForm);
    handleSaveAll(nextForm);
    setShowAddAch(false);
    setNewAch({ title: '', issuer: '', date: '2026', desc: '' });
  };

  const handleDeleteAchievement = (id) => {
    const nextAch = (formData.achievements || []).filter(a => a.id !== id);
    const nextForm = { ...formData, achievements: nextAch };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Project Helpers
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProj.title.trim()) return;
    const stackArr = newProj.stack ? newProj.stack.split(',').map(s => s.trim()).filter(Boolean) : ['React', 'JavaScript'];
    const entry = { ...newProj, stack: stackArr, id: `proj-${Date.now()}` };
    const nextProj = [entry, ...(formData.projects || [])];
    const nextForm = { ...formData, projects: nextProj };
    setFormData(nextForm);
    handleSaveAll(nextForm);
    setShowAddProj(false);
    setNewProj({ title: '', stack: '', desc: '', githubUrl: '', liveUrl: '' });
  };

  const handleDeleteProject = (id) => {
    const nextProj = (formData.projects || []).filter(p => p.id !== id);
    const nextForm = { ...formData, projects: nextProj };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Skills Tag Helpers
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillTag.trim()) return;
    if (!(formData.teachingSkills || []).includes(newSkillTag.trim())) {
      const nextSkills = [...(formData.teachingSkills || []), newSkillTag.trim()];
      const nextForm = { ...formData, teachingSkills: nextSkills };
      setFormData(nextForm);
      handleSaveAll(nextForm);
    }
    setNewSkillTag('');
  };

  const handleRemoveSkill = (skill) => {
    const nextSkills = (formData.teachingSkills || []).filter(s => s !== skill);
    const nextForm = { ...formData, teachingSkills: nextSkills };
    setFormData(nextForm);
    handleSaveAll(nextForm);
  };

  // Calculate StudyLoop Profile Completeness in Percentage
  const calculateProfileStrength = () => {
    let score = 0;
    const items = [];

    const hasBasic = !!(formData.fullName && formData.headline && formData.bio && formData.college);
    if (hasBasic) score += 20;
    items.push({ label: 'Basic Info & Bio', weight: 20, done: hasBasic, categoryId: 'basic' });

    const hasAvatar = !!(formData.avatarUrl || currentProfile.avatarUrl || formData.gender);
    if (hasAvatar) score += 15;
    items.push({ label: 'Avatar & Identity', weight: 15, done: hasAvatar, categoryId: 'basic' });

    const hasEdu = (formData.educations || []).length > 0;
    if (hasEdu) score += 15;
    items.push({ label: 'Education History', weight: 15, done: hasEdu, categoryId: 'education' });

    const hasCerts = (formData.certifications || []).length > 0;
    if (hasCerts) score += 15;
    items.push({ label: 'Verified Certifications', weight: 15, done: hasCerts, categoryId: 'certifications' });

    const hasProjects = (formData.projects || []).length > 0;
    if (hasProjects) score += 15;
    items.push({ label: 'Software Projects', weight: 15, done: hasProjects, categoryId: 'projects' });

    const hasResume = !!(formData.resumeFileName);
    if (hasResume) score += 10;
    items.push({ label: 'Resume Upload', weight: 10, done: hasResume, categoryId: 'resume' });

    const hasSkills = (formData.teachingSkills || []).length > 0;
    if (hasSkills) score += 10;
    items.push({ label: 'Skills & Mentoring', weight: 10, done: hasSkills, categoryId: 'tutoring' });

    let levelLabel = 'Beginner';
    let levelBadge = 'tag-secondary';
    if (score >= 100) {
      levelLabel = 'All-Star 🌟 (100%)';
      levelBadge = 'tag-success';
    } else if (score >= 70) {
      levelLabel = `Advanced 🔥 (${score}%)`;
      levelBadge = 'tag-accent';
    } else if (score >= 40) {
      levelLabel = `Intermediate ⚡ (${score}%)`;
      levelBadge = 'tag-warning';
    } else {
      levelLabel = `Beginner (${score}%)`;
      levelBadge = 'tag-secondary';
    }

    return { score, levelLabel, levelBadge, items };
  };

  const profileStrength = calculateProfileStrength();

  // Structured Settings Categories with Logical Grouping
  const categoryGroups = [
    {
      group: 'PROFILE & ACADEMICS',
      icon: '👤',
      items: [
        { id: 'basic', label: 'Personal Portfolio & Bio', icon: <User size={16} />, badge: 'Core' },
        { id: 'education', label: 'Education & Degrees', icon: <GraduationCap size={16} />, count: (formData.educations || []).length },
        { id: 'projects', label: 'Projects & Code Repos', icon: <Code size={16} />, count: (formData.projects || []).length },
        { id: 'social', label: 'Social & Coding Links', icon: <Globe size={16} /> },
      ]
    },
    {
      group: 'DOCUMENTS & VERIFICATION',
      icon: '🛡️',
      items: [
        { id: 'verification', label: 'Student ID & Green Tick', icon: <CheckCircle2 size={16} />, badge: 'Verified 🎓', highlight: true },
        { id: 'certifications', label: 'Verified Certifications', icon: <Award size={16} />, count: (formData.certifications || []).length, highlight: true },
        { id: 'resume', label: 'Resume & ATS Parser', icon: <FileText size={16} />, badge: '94% Match' },
      ]
    },
    {
      group: '1:1 LIVE CLASSES & HISTORY',
      icon: '🧑‍🏫',
      items: [
        { id: 'peer_classes', label: '1:1 Live Classes & History', icon: <Calendar size={16} />, badge: '24 Taught', highlight: true },
        { id: 'tutoring', label: 'Mentoring Rates & Payouts', icon: <Coins size={16} /> },
        { id: 'achievements', label: 'Honors & Hackathons', icon: <Trophy size={16} />, count: (formData.achievements || []).length },
      ]
    },
    {
      group: 'ACCOUNT & SECURITY',
      icon: '🔒',
      items: [
        { id: 'security', label: 'Privacy & Security Controls', icon: <Shield size={16} />, badge: 'Zero-Leak' },
        { id: 'notifications', label: 'Alerts & Reminders', icon: <Bell size={16} /> },
      ]
    }
  ];

  const categories = categoryGroups.flatMap(g => g.items);

  return (
    <div style={{ width: '100%', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* TOAST FEEDBACK NOTIFICATION */}
      {saveToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          padding: '0.875rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px -3px rgba(16, 185, 129, 0.4)',
          fontWeight: 700,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle size={18} />
          {saveToast}
        </div>
      )}

      {/* ── TOP NAV (slim 52px) ──────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        height: '52px', backdropFilter: 'blur(12px)'
      }}>
        {/* Logo */}
        <div
          onClick={() => { if (setActiveTab) setActiveTab('landing'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer'
          }}
          title="← Return to Campus Home"
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '9px',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,102,255,0.25)', flexShrink: 0
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.9rem' }}>SL</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>StudyLoop</div>
            <div style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scholar Profile</div>
          </div>
        </div>

        {/* Center: Profile Strength */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '999px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Profile</span>
          <div style={{ width: '60px', height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${profileStrength.score}%`, height: '100%', backgroundColor: profileStrength.score === 100 ? '#10b981' : 'var(--accent-primary)', borderRadius: '999px', transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '0.78rem', color: profileStrength.score === 100 ? '#10b981' : 'var(--accent-primary)' }}>{profileStrength.score}%</span>
          <span style={{ fontSize: '0.625rem', fontWeight: 800, padding: '2px 7px', borderRadius: '999px', backgroundColor: profileStrength.score === 100 ? 'rgba(16,185,129,0.12)' : 'var(--accent-light)', color: profileStrength.score === 100 ? '#059669' : 'var(--accent-primary)' }}>
            {profileStrength.levelLabel.split(' ')[0]}
          </span>
        </div>

        {/* Right: Theme + Discard Changes + Save All Changes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
            <GraduationCap size={12} style={{ color: 'var(--accent-primary)' }} />
            {formData.college || 'IIT Madras'}
          </span>
          {setTheme && (
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          )}
          {saveToast && (
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              ✓ Saved
            </span>
          )}
          <button
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,102,255,0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            {isSaving ? <RefreshCw size={13} className="spin" /> : <Save size={13} />}
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN 2-COLUMN CATEGORIZED LAYOUT (FULL-WIDTH SCROLLABLE STANDALONE PAGE) */}
      <main style={{ flex: 1, padding: '1.25rem 0 4rem 0', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TOP NAVIGATION & MODE SWITCHER */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('landing')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '12px',
              border: '1.5px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              e.currentTarget.style.transform = 'translateX(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,102,255,0.18)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
            title="← Return to Campus Home"
          >
            <ArrowLeft size={18} style={{ color: 'var(--accent-primary)', strokeWidth: 2.5 }} />
            <span>Back to Home</span>
          </button>

          {/* DEDICATED SECTIONS QUICK SWITCHER */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--accent-primary)',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                fontSize: '0.8125rem',
                fontWeight: 800,
                cursor: 'default'
              }}
            >
              <span>👤 Profile & Credentials</span>
            </button>

            <button
              onClick={() => setActiveTab('classes_history')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              title="Open dedicated 1:1 Live Classes & Teaching History page"
            >
              <span>🧑‍🏫 1:1 Classes History</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '1px 6px', borderRadius: '4px' }}>
                24 Taught
              </span>
            </button>

            <button
              onClick={() => setActiveTab('privacy_settings')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              title="Open dedicated Campus Privacy & Security Settings center"
            >
              <Shield size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>Campus Privacy & Security</span>
            </button>
          </div>
        </div>

        {/* 1. MASTER STUDENT PROFILE GRAND HERO CARD */}
        <div className="card-premium" style={{ marginBottom: '1.75rem', overflow: 'hidden', padding: 0, border: '1px solid var(--border-color)', borderRadius: '20px' }}>
          {/* COVER BANNER */}
          <div style={{
            height: '180px',
            background: formData.coverUrl ? `url(${formData.coverUrl}) center/cover no-repeat` : (formData.bannerTheme === 'gradient-emerald' ? 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' : (formData.bannerTheme === 'gradient-sunset' ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' : 'var(--accent-gradient)')),
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '1rem 1.5rem'
          }}>
            <input 
              type="file" 
              ref={coverInputRef} 
              accept="image/*" 
              onChange={handleCoverUpload} 
              style={{ display: 'none' }} 
            />
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="btn btn-secondary" 
              style={{
                fontSize: '0.75rem', 
                padding: '0.375rem 0.875rem', 
                backgroundColor: 'rgba(0,0,0,0.65)', 
                color: '#ffffff', 
                border: '1px solid rgba(255,255,255,0.3)', 
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Camera size={13} /> Edit Cover
            </button>
          </div>

          {/* HERO IDENTITY & ACTIONS ROW */}
          <div style={{ padding: '0 2rem 1.75rem 2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-65px', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1.25rem' }}>
              
              {/* AVATAR WITH GREEN RING, 100% TICK / PERCENTAGE & EDIT BADGE */}
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to choose a photo from your computer or phone"
                  style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    padding: '4px',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: profileStrength.score === 100 
                      ? '0 0 0 3.5px #10b981, 0 0 20px rgba(16, 185, 129, 0.4)' 
                      : 'var(--shadow-lg)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={getDefaultAvatarByGender(formData.gender, formData.avatarUrl)} 
                    alt="Avatar" 
                    onError={(e) => { e.target.src = getDefaultAvatarByGender(formData.gender); }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%', 
                      border: '3.5px solid #10b981', 
                      objectFit: 'cover' 
                    }} 
                  />

                  {/* TOP-RIGHT BADGE: 100% TICK MARK */}
                  <div
                    title={profileStrength.score === 100 ? "100% Profile Completed" : `${profileStrength.score}% Profile Completed`}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: '3px solid var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      zIndex: 5
                    }}
                  >
                    {profileStrength.score === 100 ? (
                      <Check size={18} style={{ strokeWidth: 3.5 }} />
                    ) : (
                      <span>{profileStrength.score}%</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Photo from Device"
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: '3px solid var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)',
                    zIndex: 6
                  }}
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* HERO QUICK ACTIONS: SAVE ALL CHANGES & GREEN TICK */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveCategory('verification')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  title="Complete verification steps for Green Tick"
                >
                  <Shield size={15} style={{ color: '#10b981' }} />
                  <span>Get Green Tick</span>
                </button>

                <button
                  onClick={() => handleSaveAll()}
                  disabled={isSaving}
                  style={{
                    padding: '8px 22px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'var(--accent-gradient)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(0, 102, 255, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSaving ? <RefreshCw size={15} className="spin" /> : <Save size={15} />}
                  <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
              </div>

            </div>

            {/* NAME, HEADLINE & METADATA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 className="font-serif" style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>
                  {formData.fullName || 'Aarav Sharma'}
                </h1>
                <span className="tag tag-accent" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  ✓ Verified Student
                </span>
                <span className="tag tag-success" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  🎓 Open to 1:1 Peer Mentoring
                </span>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {formData.headline || 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <GraduationCap size={15} style={{ color: 'var(--accent-primary)' }} />
                  {formData.college || 'IIT Madras'} • {formData.department || 'Computer Science'} (Year {formData.year || 2})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                  {formData.location || 'Chennai, Tamil Nadu, India'}
                </span>
                <span style={{ color: 'var(--warning-color)', fontWeight: 700 }}>
                  ⭐ 4.9 Scholar Trust Rating • Verified Campus Scholar
                </span>
              </div>

              {/* SOCIAL / CODING HANDLES STRIP */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {formData.socialLinks?.github && (
                  <a href={formData.socialLinks.github} target="_blank" rel="noreferrer" className="tag tag-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Github size={13} /> GitHub Profile ↗
                  </a>
                )}
                {formData.socialLinks?.linkedin && (
                  <a href={formData.socialLinks.linkedin} target="_blank" rel="noreferrer" className="tag tag-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Briefcase size={13} /> LinkedIn ↗
                  </a>
                )}
                {formData.socialLinks?.leetcode && (
                  <a href={formData.socialLinks.leetcode} target="_blank" rel="noreferrer" className="tag tag-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Code size={13} /> LeetCode (Knight) ↗
                  </a>
                )}
                {formData.socialLinks?.portfolio && (
                  <a href={formData.socialLinks.portfolio} target="_blank" rel="noreferrer" className="tag tag-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Globe size={13} /> Portfolio Website ↗
                  </a>
                )}
              </div>

              {/* COUNTERS STRIP */}
              <div style={{ display: 'flex', gap: '0', fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Posts', value: 3 },
                  { label: 'Shorts', value: 2 },
                  { label: 'Followers', value: 148 },
                  { label: 'Following', value: 92 },
                  { label: 'Connections', value: authProfile?.connections || 148, accent: true },
                  { label: 'XP · Lvl 4', value: formData.xp || 680, accent: true },
                ].map((stat, i) => (
                  <div key={i} style={{
                    paddingRight: '1.5rem', marginRight: '1.5rem',
                    borderRight: i < 5 ? '1px solid var(--border-color)' : 'none',
                    paddingTop: '0.25rem', paddingBottom: '0.25rem',
                    color: stat.accent ? 'var(--accent-primary)' : 'inherit'
                  }}>
                    <strong style={{ fontSize: '0.9375rem' }}>{stat.value}</strong>{' '}
                    <span style={{ color: stat.accent ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* ABOUT / BIO */}
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {formData.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor • Peer Learning & Research'}
                </p>
              </div>

            </div>

            {/* XP PROGRESS BAR */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>Campus Rank: <strong>#1 In Computer Science</strong></span>
                <span>🪙 45 Peer Coins Balance</span>
                <span>Level 4 (40% to Level 5)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
          GAMING QUEST FLOWCHART ROADMAP — Green Tick & Scholar Journey
        ═══════════════════════════════════════════════════════════════ */}
        <div className="card-premium" style={{
          marginBottom: '1.5rem',
          padding: '1.15rem 1.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎮</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Scholar Quest & Green Tick Pathway
                  </h2>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    🛡️ Green Tick Ready
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
                  Complete all milestone quests to unlock Verified Scholar Green Tick & 1:1 Peer Mentoring.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', background: 'var(--bg-tertiary)', padding: '0.35rem 0.85rem', borderRadius: '999px' }}>
              <span>🏆 Total Rewards:</span>
              <span style={{ color: '#10b981' }}>+750 XP</span>
              <span>•</span>
              <span style={{ color: '#f59e0b' }}>🪙 45 Coins</span>
            </div>
          </div>

          {/* FLOWCHART INTERACTIVE STEPPER */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '0.875rem',
            position: 'relative'
          }}>
            {[
              {
                step: '1',
                icon: '📸',
                title: 'Photo & Intro',
                desc: 'Avatar & bio set',
                xp: '+50 XP',
                status: 'done',
                cat: 'basic'
              },
              {
                step: '2',
                icon: '💼',
                title: 'Projects & Work',
                desc: 'WebRTC & Code Repos',
                xp: '+100 XP',
                status: 'done',
                cat: 'projects'
              },
              {
                step: '3',
                icon: '🎓',
                title: 'College Verified',
                desc: 'IIT Madras CS Dept',
                xp: '+150 XP',
                status: 'done',
                cat: 'education'
              },
              {
                step: '4',
                icon: '🛡️',
                title: 'Student ID Card',
                desc: 'Green Tick Ready',
                xp: '+200 XP',
                status: 'active',
                cat: 'verification'
              },
              {
                step: '5',
                icon: '🧑‍🏫',
                title: '1:1 Peer Mentor',
                desc: 'Earn ₹3,600+ / mo',
                xp: '+250 XP',
                status: 'unlocked',
                cat: 'peer_classes'
              }
            ].map((q, idx) => {
              const isDone = q.status === 'done';
              const isActive = q.status === 'active';
              return (
                <div
                  key={idx}
                  onClick={() => setActiveCategory(q.cat)}
                  style={{
                    padding: '0.875rem 0.75rem',
                    borderRadius: '14px',
                    background: isDone 
                      ? 'rgba(16, 185, 129, 0.06)' 
                      : (isActive ? 'rgba(0, 102, 255, 0.08)' : 'var(--bg-tertiary)'),
                    border: isDone 
                      ? '1.5px solid rgba(16, 185, 129, 0.35)' 
                      : (isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title={`Click to open ${q.title} settings`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: isDone ? '#10b981' : (isActive ? 'var(--accent-primary)' : 'var(--border-color)'),
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 800
                    }}>
                      {isDone ? '✓' : q.icon}
                    </div>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '6px',
                      backgroundColor: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 102, 255, 0.12)',
                      color: isDone ? '#10b981' : 'var(--accent-primary)'
                    }}>
                      {q.xp}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {q.title}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                    {q.desc}
                  </div>

                  <div style={{ marginTop: '0.25rem', paddingTop: '0.25rem', borderTop: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: isDone ? '#10b981' : (isActive ? 'var(--accent-primary)' : 'var(--text-muted)')
                    }}>
                      {isDone ? '✅ Claimed' : (isActive ? '⚡ In Progress' : '🔓 Unlocked')}
                    </span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Edit →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. MAIN 2-COLUMN CATEGORIZED SETTINGS LAYOUT */}
        <div className="settings-responsive-layout">
        
        {/* LEFT COLUMN: CATEGORIES SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '4.5rem' }}>
          
          {/* CATEGORIES SIDEBAR WITH LOGICAL GROUPS */}
          <div className="card-premium" style={{ padding: '0.875rem' }}>
          
          <div style={{ padding: '0.35rem 0.5rem 0.65rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search settings..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.75rem', color: 'var(--text-primary)', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {categories
              .filter(cat => cat.label.toLowerCase().includes(searchFilter.toLowerCase()))
              .filter(cat => cat.id !== 'peer_classes') // peer_classes is a dedicated separate page
              .map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ color: isActive ? '#ffffff' : 'var(--accent-primary)', flexShrink: 0 }}>{cat.icon}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.label}</span>
                  </div>

                  {cat.badge && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)',
                      color: isActive ? '#ffffff' : '#10b981',
                      flexShrink: 0
                    }}>
                      {cat.badge}
                    </span>
                  )}

                  {cat.count !== undefined && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      flexShrink: 0
                    }}>
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CATEGORY CONTENT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* ========================================================================= */}
          {/* CATEGORY 1: PERSONAL & BASIC IDENTITY */}
          {/* ========================================================================= */}
          {activeCategory === 'basic' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    👤 Personal Identity & Avatar
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Your primary student identity shown on Campus Leaderboards, Doubt Rooms, and 1:1 Classes.
                  </p>
                </div>
              </div>

              {/* AVATAR & PHOTO MANAGEMENT SUITE */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem', 
                padding: '1.5rem', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.75rem',
                border: '1px solid var(--border-color)'
              }}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }} 
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {/* AVATAR PREVIEW (CLICK TO UPLOAD) */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to choose a photo from your computer or phone"
                    style={{ 
                      position: 'relative', 
                      cursor: 'pointer',
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      padding: '3px',
                      backgroundColor: 'var(--bg-card)',
                      boxShadow: formData.avatarUrl ? '0 0 0 3px #10b981, 0 4px 12px rgba(16, 185, 129, 0.25)' : '0 0 0 2px var(--border-color)'
                    }}
                  >
                    <img 
                      src={getDefaultAvatarByGender(formData.gender, formData.avatarUrl)} 
                      alt="Avatar" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '0', 
                      right: '0', 
                      background: '#10b981', 
                      color: '#fff', 
                      borderRadius: '50%', 
                      padding: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Camera size={15} />
                    </div>
                  </div>

                  {/* UPLOAD ACTIONS & STATUS */}
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Profile Photo & Avatar
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Upload a picture from your computer/phone or choose an official avatar preset.
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.45rem 0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <UploadCloud size={14} /> Upload from Device
                      </button>

                      {formData.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...formData, avatarUrl: '' };
                            setFormData(updated);
                            handleSaveAll(updated);
                          }}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.45rem 0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Trash2 size={13} /> Reset Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRESET AVATARS SELECTOR */}
                <div>
                  <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Choose Avatar Presets (Click to apply)
                  </label>
                  <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                    {AVATAR_PRESETS.map(preset => {
                      const isSelected = preset.isVector 
                        ? (formData.gender === preset.gender && !formData.avatarUrl)
                        : (formData.avatarUrl === preset.url);

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            let updated;
                            if (preset.isVector) {
                              updated = { ...formData, gender: preset.gender, avatarUrl: '' };
                            } else {
                              updated = { ...formData, avatarUrl: preset.url };
                            }
                            setFormData(updated);
                            handleSaveAll(updated);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: isSelected ? '2px solid #10b981' : '1px solid var(--border-color)',
                            background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                            color: isSelected ? '#10b981' : 'var(--text-primary)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {!preset.isVector && (
                            <img 
                              src={preset.url} 
                              alt={preset.label} 
                              style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                          )}
                          <span>{preset.label}</span>
                          {isSelected && <Check size={12} style={{ strokeWidth: 3 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CUSTOM IMAGE URL INPUT */}
                <div>
                  <label className="label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem', fontWeight: 700 }}>
                    Or Paste Custom Image URL
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="url"
                      placeholder="https://images.unsplash.com/... or public image URL"
                      className="input"
                      style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem', flex: 1 }}
                      value={formData.avatarUrl && !formData.avatarUrl.startsWith('data:') ? formData.avatarUrl : customUrlInput}
                      onChange={e => setCustomUrlInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          const updated = { ...formData, avatarUrl: customUrlInput.trim() };
                          setFormData(updated);
                          handleSaveAll(updated);
                          setCustomUrlInput('');
                        }
                      }}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.45rem 1rem', fontWeight: 700 }}
                    >
                      Apply URL
                    </button>
                  </div>
                </div>
              </div>

              {/* STRUCTURED FORM SECTIONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                
                {/* 1. BASIC IDENTITY */}
                <div style={{ padding: '1.25rem', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>👤</span> Basic Student Information
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px', background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                      +25 XP
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="label">Full Legal / Display Name *</label>
                      <input 
                        type="text" 
                        className="input" 
                        value={formData.fullName} 
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })} 
                        placeholder="e.g. Aarav Sharma" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="label">Pronouns</label>
                      <input 
                        type="text" 
                        className="input" 
                        value={formData.pronouns} 
                        onChange={e => setFormData({ ...formData, pronouns: e.target.value })} 
                        placeholder="e.g. He/Him, She/Her, They/Them" 
                      />
                    </div>

                    <div>
                      <label className="label">City & Country</label>
                      <input 
                        type="text" 
                        className="input" 
                        value={formData.location} 
                        onChange={e => setFormData({ ...formData, location: e.target.value })} 
                        placeholder="e.g. Chennai, Tamil Nadu, India" 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CAMPUS & ACADEMICS */}
                <div style={{ padding: '1.25rem', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🎓</span> College & Degree Details
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px', background: 'rgba(0,102,255,0.12)', color: 'var(--accent-primary)' }}>
                      +50 XP
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="label">College / Institute *</label>
                      <input 
                        type="text" 
                        className="input" 
                        value={formData.college} 
                        onChange={e => setFormData({ ...formData, college: e.target.value })} 
                        placeholder="e.g. IIT Madras, BITS Pilani" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="label">Department / Branch *</label>
                      <input 
                        type="text" 
                        className="input" 
                        value={formData.department} 
                        onChange={e => setFormData({ ...formData, department: e.target.value })} 
                        placeholder="e.g. Computer Science & Engineering" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="label">Academic Year</label>
                      <select 
                        className="input" 
                        value={formData.year} 
                        onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
                      >
                        <option value={1}>1st Year (Freshman)</option>
                        <option value={2}>2nd Year (Sophomore)</option>
                        <option value={3}>3rd Year (Junior)</option>
                        <option value={4}>4th Year (Senior / Finalist)</option>
                        <option value={5}>Postgraduate / Master's / PhD</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. HEADLINE & BIO */}
                <div style={{ padding: '1.25rem', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✍️</span> Student Headline & Bio
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                      +50 XP
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="label">Professional Student Headline *</label>
                      <input 
                        type="text" 
                        className="input" 
                        value={formData.headline} 
                        onChange={e => setFormData({ ...formData, headline: e.target.value })} 
                        placeholder="e.g. B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist" 
                        required 
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Tip: Mention your university, key tech stack (Java/React/AI), and strengths.
                      </div>
                    </div>

                    <div>
                      <label className="label">About / Student Bio</label>
                      <textarea 
                        className="input" 
                        style={{ minHeight: '80px' }} 
                        value={formData.bio} 
                        onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                        placeholder="Brief description about your studies, passions, and peer mentoring background..." 
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleSaveAll()} 
                  className="btn btn-primary"
                  style={{ fontWeight: 700, padding: '0.6rem 1.5rem' }}
                >
                  Save Personal Details
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 2: EDUCATION & ACADEMICS */}
          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* CATEGORY 2: PEER-TO-PEER LIVE CLASSES & MENTORSHIP */}
          {/* ========================================================================= */}
          {activeCategory === 'peer_classes' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🧑‍🏫 Peer-to-Peer Live Classes & Mentorship Studio
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Your live 1:1 teaching history, student reviews, rate controls, and upcoming scheduled sessions.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('sessions')}
                    className="btn btn-accent"
                    style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <Calendar size={15} /> Open Classes Schedule
                  </button>
                </div>
              </div>

              {/* METRIC HIGHLIGHTS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(0, 198, 255, 0.08) 100%)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Classes Conducted</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {formData.classesTaught || 24}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>100% On-time completion</div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success-color)', textTransform: 'uppercase' }}>Peer Tutoring Earnings</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    ₹{((formData.totalEarned || 3600)).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Released via UPI Escrow</div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--warning-color)', textTransform: 'uppercase' }}>Mentor Rating</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    4.92 / 5.0 ⭐
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>From 38 student reviews</div>
                </div>
              </div>

              {/* RATE PREFERENCES & AVAILABILITY TOGGLE */}
              <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Live Class Hourly Rates</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Students book 45-60 min 1:1 sessions based on your hourly pricing.</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: formData.isAvailableForMentoring ? 'var(--success-color)' : 'var(--text-muted)' }}>
                      {formData.isAvailableForMentoring ? '🟢 Available for Bookings' : '⚪ Unavailable'}
                    </span>
                    <input 
                      type="checkbox" 
                      checked={formData.isAvailableForMentoring} 
                      onChange={e => {
                        const next = { ...formData, isAvailableForMentoring: e.target.checked };
                        setFormData(next);
                        handleSaveAll(next);
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="label">Hourly Rate (₹ INR)</label>
                    <input 
                      type="number" 
                      className="input" 
                      value={formData.hourlyRate || 450} 
                      onChange={e => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                  <div>
                    <label className="label">Rate in StudyLoop Coins (🪙)</label>
                    <input 
                      type="number" 
                      className="input" 
                      value={formData.coinRate || 45} 
                      onChange={e => setFormData({ ...formData, coinRate: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>
              </div>

              {/* RECENT CONDUCTED CLASSES & STUDENT REVIEWS */}
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                  Recent 1:1 Live Classes Taught
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { topic: 'Dynamic Programming: 0/1 Knapsack & Memoization', student: 'Bhavna Patel', college: 'IIT Madras', duration: '45 mins', fee: '₹150', rating: 5.0, date: 'Yesterday', review: 'Aarav is the best DSA mentor on campus! Clear diagrams and whiteboard explanations.' },
                    { topic: 'Spring Boot Microservices & JPA Cascading', student: 'Chaitanya Reddy', college: 'BITS Pilani', duration: '60 mins', fee: '₹200', rating: 4.9, date: '3 days ago', review: 'Saved me hours of debugging before my semester submission deadline.' },
                    { topic: 'React Custom Hooks & Memory Leaks in useEffect', student: 'Kavya Subramanian', college: 'IIT Delhi', duration: '45 mins', fee: '₹150', rating: 5.0, date: '1 week ago', review: 'Super clear practical examples. Highly recommended!' },
                    { topic: 'Binary Trees & Level Order Traversal in Java', student: 'Rohan Deshmukh', college: 'IIT Bombay', duration: '60 mins', fee: '₹200', rating: 4.8, date: '2 weeks ago', review: 'Great pacing and guided practice problems.' }
                  ].map((cls, idx) => (
                    <div key={idx} style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{cls.topic}</span>
                          <span className="tag tag-success" style={{ fontSize: '0.65rem' }}>Completed</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Student: <strong>{cls.student}</strong> ({cls.college}) • {cls.duration} • {cls.date}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.35rem' }}>
                          "{cls.review}"
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--success-color)' }}>+{cls.fee}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>⭐ {cls.rating} / 5.0</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 3: EDUCATION & ACADEMICS */}
          {/* ========================================================================= */}
          {activeCategory === 'education' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🎓 Education & Academic Qualifications
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Add college degrees, schools, grade point averages, and extracurricular campus societies.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddEdu(true)} 
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={15} /> Add Education
                </button>
              </div>

              {/* ADD EDUCATION FORM DRAWER */}
              {showAddEdu && (
                <form onSubmit={handleAddEducation} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ➕ Add Degree / School Record
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="label">Institution / School Name *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Indian Institute of Technology (IIT) Madras" 
                        value={newEdu.school} 
                        onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Degree *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Bachelor of Technology - B.Tech" 
                        value={newEdu.degree} 
                        onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Field of Study / Branch</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Computer Science & Engineering" 
                        value={newEdu.field} 
                        onChange={e => setNewEdu({ ...newEdu, field: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Grade / CGPA</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 8.95 / 10.0 CGPA" 
                        value={newEdu.grade} 
                        onChange={e => setNewEdu({ ...newEdu, grade: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Start Year</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 2023" 
                        value={newEdu.startYear} 
                        onChange={e => setNewEdu({ ...newEdu, startYear: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">End Year (or Expected)</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 2027" 
                        value={newEdu.endYear} 
                        onChange={e => setNewEdu({ ...newEdu, endYear: e.target.value })} 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Activities, Clubs & Societies</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Lead at Google Developer Student Club (GDSC), Doubt Mentor" 
                        value={newEdu.activities} 
                        onChange={e => setNewEdu({ ...newEdu, activities: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowAddEdu(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Save Education</button>
                  </div>
                </form>
              )}

              {/* LIST OF CURRENT EDUCATIONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(formData.educations || []).map((edu, idx) => (
                  <div key={edu.id || idx} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                        <GraduationCap size={22} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{edu.school}</h4>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                          {edu.degree} {edu.field ? `• ${edu.field}` : ''}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          📅 {edu.startYear} - {edu.endYear} {edu.grade ? `| Grade: ${edu.grade}` : ''}
                        </div>
                        {edu.activities && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                            🏅 {edu.activities}
                          </div>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteEducation(edu.id)} 
                      className="btn btn-danger" 
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      title="Remove Education"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 3: CERTIFICATIONS & LICENSES */}
          {/* ========================================================================= */}
          {activeCategory === 'certifications' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    📜 Certifications & Verified Credentials
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Showcase credentials from Oracle, AWS, Google, NPTEL, Coursera, HackerRank, and University Honors.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddCert(true)} 
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={15} /> Add Certificate
                </button>
              </div>

              {/* ADD CERTIFICATE DRAWER */}
              {showAddCert && (
                <form onSubmit={handleAddCertificate} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ➕ Add Professional or Academic Certificate
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Certificate / Course Title *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Oracle Certified Associate, Java SE 8 Programmer" 
                        value={newCert.name} 
                        onChange={e => setNewCert({ ...newCert, name: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Issuing Organization *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Oracle, AWS, NPTEL, Google, Coursera" 
                        value={newCert.issuer} 
                        onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Issue Date</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Jan 2026" 
                        value={newCert.issueDate} 
                        onChange={e => setNewCert({ ...newCert, issueDate: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Credential / License ID</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. OCA-JAVA-98742" 
                        value={newCert.credentialId} 
                        onChange={e => setNewCert({ ...newCert, credentialId: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Badge Icon / Emoji</label>
                      <select 
                        className="input" 
                        value={newCert.badgeIcon} 
                        onChange={e => setNewCert({ ...newCert, badgeIcon: e.target.value })}
                      >
                        <option value="☕">☕ Java / Oracle</option>
                        <option value="☁️">☁️ AWS / Cloud</option>
                        <option value="🐍">🐍 Python / NPTEL</option>
                        <option value="⚛️">⚛️ React / Frontend</option>
                        <option value="🛡️">🛡️ Cybersecurity / CompTIA</option>
                        <option value="🤖">🤖 AI / Machine Learning</option>
                        <option value="🏆">🏆 University Gold Medal</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Credential Verification URL</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="https://nptel.ac.in/noc/Ecertificate/... or verification link" 
                        value={newCert.credentialUrl} 
                        onChange={e => setNewCert({ ...newCert, credentialUrl: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowAddCert(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Save Certificate</button>
                  </div>
                </form>
              )}

              {/* LIST OF CERTIFICATES */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {(formData.certifications || []).map((cert, idx) => (
                  <div key={cert.id || idx} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '1.75rem', lineHeight: 1, padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                        {cert.badgeIcon || '📜'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cert.name}</h4>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                          {cert.issuer}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          📅 Issued: {cert.issueDate}
                        </div>
                        {cert.credentialId && (
                          <div style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            ID: {cert.credentialId}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      <span className="tag tag-success" style={{ fontSize: '0.6875rem', fontWeight: 700 }}>
                        ✓ Verified Credential
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>
                            <ExternalLink size={12} /> Verify ↗
                          </a>
                        )}
                        <button onClick={() => handleDeleteCertificate(cert.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 4: HONORS & HACKATHONS */}
          {/* ========================================================================= */}
          {activeCategory === 'achievements' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    🏆 Honors, Hackathons & Coding Ranks
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Competitive programming ranks, Smart India Hackathon awards, and college medals.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddAch(true)} 
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={15} /> Add Honor
                </button>
              </div>

              {/* ADD ACHIEVEMENT DRAWER */}
              {showAddAch && (
                <form onSubmit={handleAddAchievement} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ➕ Add Honor or Hackathon Rank
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Award / Honor Title *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Smart India Hackathon (SIH 2025) - National Finalist" 
                        value={newAch.title} 
                        onChange={e => setNewAch({ ...newAch, title: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="label">Organizer / Issuer</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Ministry of Education & Unstop, LeetCode" 
                        value={newAch.issuer} 
                        onChange={e => setNewAch({ ...newAch, issuer: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Year / Date</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Dec 2025" 
                        value={newAch.date} 
                        onChange={e => setNewAch({ ...newAch, date: e.target.value })} 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Brief Description of Achievement</label>
                      <textarea 
                        className="input" 
                        style={{ minHeight: '70px' }} 
                        placeholder="Details about your rank, project impact, or score..." 
                        value={newAch.desc} 
                        onChange={e => setNewAch({ ...newAch, desc: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowAddAch(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Save Honor</button>
                  </div>
                </form>
              )}

              {/* LIST OF ACHIEVEMENTS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(formData.achievements || []).map((ach, idx) => (
                  <div key={ach.id || idx} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning-color)', flexShrink: 0 }}>
                        <Trophy size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{ach.title}</h4>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '0.15rem' }}>
                          {ach.issuer} {ach.date ? `• ${ach.date}` : ''}
                        </div>
                        {ach.desc && (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                            {ach.desc}
                          </div>
                        )}
                      </div>
                    </div>

                    <button onClick={() => handleDeleteAchievement(ach.id)} className="btn btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 5: PROJECTS & CODE REPOSITORIES */}
          {/* ========================================================================= */}
          {activeCategory === 'projects' && (
            <div className="card-premium">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                    💼 Software Projects & Workspaces
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                    Showcase real-world full-stack apps, WebRTC workspaces, and GitHub open-source work.
                  </p>
                </div>

                <button 
                  onClick={() => setShowAddProj(true)} 
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Plus size={15} /> Add Project
                </button>
              </div>

              {/* ADD PROJECT FORM */}
              {showAddProj && (
                <form onSubmit={handleAddProject} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    ➕ Add Project Showcase
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Project Title *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. PeerCode - Real-Time Collaborative Workspace" 
                        value={newProj.title} 
                        onChange={e => setNewProj({ ...newProj, title: e.target.value })} 
                        required 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Tech Stack (comma separated)</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. React, WebRTC, Node.js, Spring Boot, Socket.io" 
                        value={newProj.stack} 
                        onChange={e => setNewProj({ ...newProj, stack: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">GitHub Repository URL</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="https://github.com/username/project" 
                        value={newProj.githubUrl} 
                        onChange={e => setNewProj({ ...newProj, githubUrl: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="label">Live Demo URL</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="https://myproject.studyloop.app" 
                        value={newProj.liveUrl} 
                        onChange={e => setNewProj({ ...newProj, liveUrl: e.target.value })} 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Project Description</label>
                      <textarea 
                        className="input" 
                        style={{ minHeight: '70px' }} 
                        placeholder="What problem does this solve? Mention key technical feats..." 
                        value={newProj.desc} 
                        onChange={e => setNewProj({ ...newProj, desc: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setShowAddProj(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Save Project</button>
                  </div>
                </form>
              )}

              {/* LIST OF PROJECTS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(formData.projects || []).map((p, idx) => (
                  <div key={p.id || idx} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{p.title}</h4>
                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', margin: '0.4rem 0' }}>
                          {(p.stack || []).map((tech, sIdx) => (
                            <span key={sIdx} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                          {p.desc}
                        </p>
                      </div>

                      <button onClick={() => handleDeleteProject(p.id)} className="btn btn-danger" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
                          <Github size={13} /> Source Code
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-accent" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}>
                          <ExternalLink size={13} /> Live Application ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 6: SOCIAL & CODING LINKS */}
          {/* ========================================================================= */}
          {activeCategory === 'social' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🔗 Social Handles & Developer Profiles
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Connect your GitHub, LinkedIn, LeetCode Knight, and portfolio for campus peers.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="label">GitHub Profile URL</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.github || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })} 
                    placeholder="https://github.com/aaravsharma" 
                  />
                </div>

                <div>
                  <label className="label">LinkedIn URL</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.linkedin || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })} 
                    placeholder="https://linkedin.com/in/aarav-sharma-cs" 
                  />
                </div>

                <div>
                  <label className="label">LeetCode Profile / Rating</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.leetcode || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, leetcode: e.target.value } })} 
                    placeholder="https://leetcode.com/aarav_codes" 
                  />
                </div>

                <div>
                  <label className="label">Personal Portfolio Website</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.portfolio || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, portfolio: e.target.value } })} 
                    placeholder="https://aaravsharma.dev" 
                  />
                </div>

                <div>
                  <label className="label">Codeforces Handle</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.codeforces || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, codeforces: e.target.value } })} 
                    placeholder="https://codeforces.com/profile/aarav_codes" 
                  />
                </div>

                <div>
                  <label className="label">Twitter / X Handle</label>
                  <input 
                    type="url" 
                    className="input" 
                    value={formData.socialLinks?.twitter || ''} 
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })} 
                    placeholder="https://twitter.com/aarav_codes" 
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleSaveAll()} className="btn btn-primary" style={{ fontWeight: 700, padding: '0.6rem 1.5rem' }}>
                  Save Social Profiles
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 7: RESUME & ATS OPTIMIZER */}
          {/* ========================================================================= */}
          {activeCategory === 'resume' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                📄 PDF Resume & ATS Score Analyzer
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Current uploaded resume and AI-powered ATS scoring for campus placements.
              </p>

              {/* CURRENT RESUME BANNER */}
              <input 
                type="file" 
                ref={resumeInputRef} 
                accept=".pdf,.doc,.docx" 
                onChange={handleResumeUpload} 
                style={{ display: 'none' }} 
              />
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={26} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formData.resumeFileName || 'Aarav_Sharma_Resume.pdf'}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Uploaded: {formData.resumeUploadDate || 'Aug 2026'} • 2.4 MB PDF Document
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => toast.info(`📥 Downloading ${formData.resumeFileName || 'resume.pdf'}...`)} className="btn btn-secondary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    <Download size={14} /> Download
                  </button>
                  <button onClick={() => resumeInputRef.current?.click()} className="btn btn-accent" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    <UploadCloud size={14} /> Upload New PDF
                  </button>
                </div>
              </div>

              {/* ATS SCORE CARD */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>ATS Placements Match Score</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Analyzed against 5,000+ Software Engineering campus hiring benchmarks</div>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--success-color)' }}>
                    94 / 100
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Keywords & Tech Stack</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>96% Match</div>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Standard Chronological Layout</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--success-color)', marginTop: '0.2rem' }}>98% Clean</div>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Action Verbs & Impact Quantification</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--warning-color)', marginTop: '0.2rem' }}>88% Strong</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 8: CREATOR & REELS REACH ANALYTICS — StudyLoop Shorts Studio */}
          {/* ========================================================================= */}
          {activeCategory === 'verification' && (
            <StudentVerificationSection 
              formData={formData} 
              setFormData={setFormData} 
              handleSaveAll={handleSaveAll} 
              toast={toast} 
            />
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 9: PEER TUTORING & PRICING */}
          {/* ========================================================================= */}
          {activeCategory === 'tutoring' && (
            <MentoringPayoutSection
              formData={formData}
              setFormData={setFormData}
              handleSaveAll={handleSaveAll}
              toast={toast}
              newSkillTag={newSkillTag}
              setNewSkillTag={setNewSkillTag}
              handleAddSkill={handleAddSkill}
              handleRemoveSkill={handleRemoveSkill}
            />
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 10: NOTIFICATIONS & REMINDERS */}
          {/* ========================================================================= */}
          {activeCategory === 'notifications' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🔔 Notifications & Daily Study Reminders
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Configure real-time sound alerts, peer messages, and streak protection notifications.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'doubtAlerts', title: 'Academic Doubt Room Alerts', desc: 'Instant audio ping when peers join your live doubt room' },
                  { key: 'directMessages', title: 'Direct Peer Messages (DMs)', desc: 'Instant notification on receiving 1:1 chat messages' },
                  { key: 'streakReminders', title: 'Daily Streak Protection Reminders', desc: 'Alert before midnight so you never lose your XP streak' },
                  { key: 'leaderboardUpdates', title: 'Weekly Leaderboard & Medal Recaps', desc: 'Notify when you rank up or receive top mentor badges' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{item.desc}</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.notificationSettings?.[item.key] !== false} 
                      onChange={e => {
                        const next = {
                          ...formData,
                          notificationSettings: {
                            ...formData.notificationSettings,
                            [item.key]: e.target.checked
                          }
                        };
                        setFormData(next);
                        handleSaveAll(next);
                      }}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 11: PRIVACY & ACCOUNT SECURITY */}
          {/* ========================================================================= */}
          {activeCategory === 'security' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🔒 Privacy & Account Security
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Control your profile visibility, two-factor authentication, and connected devices.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div>
                  <label className="label">Profile Visibility</label>
                  <select 
                    className="input"
                    value={formData.privacySettings?.profileVisibility || 'public'}
                    onChange={e => {
                      const next = {
                        ...formData,
                        privacySettings: {
                          ...formData.privacySettings,
                          profileVisibility: e.target.value
                        }
                      };
                      setFormData(next);
                      handleSaveAll(next);
                    }}
                  >
                    <option value="public">🌐 Public (Visible to all students across all universities)</option>
                    <option value="campus_only">🏫 Campus Only (Only verified {formData.college || 'IIT Madras'} students)</option>
                    <option value="private">🔒 Private (Only approved connections)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Require OTP code when signing in on a new device</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.privacySettings?.twoFactorEnabled || false} 
                    onChange={e => {
                      const next = {
                        ...formData,
                        privacySettings: {
                          ...formData.privacySettings,
                          twoFactorEnabled: e.target.checked
                        }
                      };
                      setFormData(next);
                      handleSaveAll(next);
                    }}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                  />
                </div>

                {/* ACTIVE LOGGED-IN SESSION */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    ACTIVE SESSIONS & DEVICES
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                        <Globe size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Chrome on Windows 11 • Chennai, India</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--success-color)', fontWeight: 700 }}>● Active Now (Current Session)</div>
                      </div>
                    </div>
                    <span className="tag tag-success" style={{ fontSize: '0.6875rem' }}>Secured</span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      </main>
    </div>
  );
}
