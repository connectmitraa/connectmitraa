import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ArrowLeft, Award, BarChart3, Bell, BookOpen, Briefcase, Building2, Camera, Check, CheckCircle, CheckCircle2, Clock, Code, Coins, Compass, Download, ExternalLink, Eye, EyeOff, FileText, Flame, Github, Globe, GraduationCap, Key, Lock, Mail, MapPin, Moon, Phone, Play, Plus, RefreshCw, Save, School, Search, Shield, Sun, Trash2, Trophy, Tv2, Upload, UploadCloud, User, X } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';
import { AvatarChangeModal } from '../../components/modals/AvatarChangeModal';
import { PhotoPreviewModal } from '../../components/modals/PhotoPreviewModal';

export function SettingsScreen({ token, setActiveTab, theme, setTheme }) {
  const { user, profile: authProfile, updateProfileState, testAccounts } = useAuth();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
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
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          const updated = { ...formData, avatarUrl: dataUrl };
          setFormData(updated);
          handleSaveAll(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Cover image must be smaller than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          const updated = { ...formData, coverUrl: dataUrl };
          setFormData(updated);
          handleSaveAll(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Categorized navigation (Naukri & Professional Platform style with Persistence)
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
    bio: currentProfile.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught',
    college: currentProfile.college || 'IIT Madras',
    department: currentProfile.department || 'Computer Science',
    year: currentProfile.year || 2,
    gender: currentProfile.gender || 'male',
    location: currentProfile.location || 'Chennai, Tamil Nadu, India',
    pronouns: currentProfile.pronouns || 'He/Him',
    avatarUrl: currentProfile.avatarUrl || '',
    bannerTheme: currentProfile.bannerTheme || 'royal-blue',
    walletBalance: currentProfile.walletBalance !== undefined ? currentProfile.walletBalance : 450,
    hourlyRate: currentProfile.hourlyRate || 450,
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

  // Calculate LinkedIn / Naukri Profile Completeness in Percentage
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

  // Categories definition (Naukri style)
  const categories = [
    { id: 'basic', label: 'Personal & Identity', icon: <User size={16} />, badge: 'Core' },
    { id: 'education', label: 'Education & Academics', icon: <GraduationCap size={16} />, count: (formData.educations || []).length },
    { id: 'certifications', label: 'Certificates & Licenses', icon: <Award size={16} />, count: (formData.certifications || []).length, highlight: true },
    { id: 'achievements', label: 'Honors & Hackathons', icon: <Trophy size={16} />, count: (formData.achievements || []).length },
    { id: 'projects', label: 'Projects & Code Repos', icon: <Code size={16} />, count: (formData.projects || []).length },
    { id: 'social', label: 'Social & Coding Links', icon: <Globe size={16} /> },
    { id: 'resume', label: 'Resume & ATS Parser', icon: <FileText size={16} />, badge: '94% Match' },
    { id: 'reach', label: 'Shorts Studio & Insights', icon: <BarChart3 size={16} />, badge: '14.8k Reach', isInsta: true },
    { id: 'tutoring', label: '1:1 Mentoring & Rates', icon: <Coins size={16} /> },
    { id: 'notifications', label: 'Alerts & Reminders', icon: <Bell size={16} /> },
    { id: 'security', label: 'Privacy & Security', icon: <Shield size={16} /> },
  ];

  // Instagram-style Creator & Reels Reach Analytics Data with Privacy Controls
  const [reelAnalyticsData, setReelAnalyticsData] = useState([
    {
      id: 'reel-1',
      title: '3 Tricks to solve Recursion fast ⚡ #Java #Algorithms',
      views: 12450,
      reachMembers: 8420,
      watchTimeHours: 105.4,
      avgWatchPct: 88.5,
      likes: 654,
      comments: 89,
      saves: 210,
      shares: 142,
      nonFollowerReachPct: 68,
      postedDate: 'Aug 24, 2026',
      visibility: 'public',
      allowComments: true,
      allowTips: true,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'reel-2',
      title: 'Spring Boot @Transactional vs Manual Rollback in 60s 🚀 #SpringBoot',
      views: 5820,
      reachMembers: 4190,
      watchTimeHours: 58.2,
      avgWatchPct: 82.0,
      likes: 342,
      comments: 45,
      saves: 130,
      shares: 68,
      nonFollowerReachPct: 54,
      postedDate: 'Aug 20, 2026',
      visibility: 'campus',
      allowComments: true,
      allowTips: true,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'reel-3',
      title: 'Dynamic Programming: 0/1 Knapsack Memory Trick 💡 #DSA',
      views: 3410,
      reachMembers: 2210,
      watchTimeHours: 31.0,
      avgWatchPct: 79.4,
      likes: 184,
      comments: 28,
      saves: 94,
      shares: 41,
      nonFollowerReachPct: 45,
      postedDate: 'Aug 14, 2026',
      visibility: 'public',
      allowComments: true,
      allowTips: true,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  const [showUploadShortModal, setShowUploadShortModal] = useState(false);
  const [newShortForm, setNewShortForm] = useState({
    title: '',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
    visibility: 'public',
    category: 'Algorithms',
    allowComments: true,
    allowTips: true,
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'
  });

  const handleCreateShort = (e) => {
    e.preventDefault();
    if (!newShortForm.title.trim()) return;
    const newEntry = {
      id: `reel-${Date.now()}`,
      title: newShortForm.title.trim(),
      views: 1,
      reachMembers: 1,
      watchTimeHours: 0.1,
      avgWatchPct: 100,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0,
      nonFollowerReachPct: 0,
      postedDate: 'Just now',
      visibility: newShortForm.visibility,
      allowComments: newShortForm.allowComments,
      allowTips: newShortForm.allowTips,
      thumbnail: newShortForm.thumbnail
    };
    setReelAnalyticsData(prev => [newEntry, ...prev]);
    setShowUploadShortModal(false);
    setNewShortForm({
      title: '',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      visibility: 'public',
      category: 'Algorithms',
      allowComments: true,
      allowTips: true,
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'
    });
    setSaveToast("🎬 Concept Short published successfully with your custom privacy settings!");
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleUpdateReelVisibility = (reelId, nextVis) => {
    setReelAnalyticsData(prev => prev.map(r => r.id === reelId ? { ...r, visibility: nextVis } : r));
    setSaveToast(`🔒 Visibility updated to "${nextVis.toUpperCase()}"!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleDeleteReel = (reelId) => {
    setReelAnalyticsData(prev => prev.filter(r => r.id !== reelId));
    setSaveToast("🗑️ Concept Short deleted from creator studio.");
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
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

      {/* 1. DEDICATED SEPARATE PAGE TOP NAVIGATION HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* BRAND LOGO + DEDICATED STUDENT PROFILE BADGE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div 
            onClick={() => setActiveTab('landing')} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
            title="Return to Home Hub"
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="font-serif" style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>SL</span>
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                StudyLoop
              </div>
              <div style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                STUDENT PROFILE
              </div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>

          <button 
            onClick={() => setActiveTab('landing')} 
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.8125rem',
              padding: '0.45rem 1rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <ArrowLeft size={15} /> Back to Home Hub
          </button>
        </div>

        {/* RIGHT: CAMPUS BADGE + THEME TOGGLE + USER CHIP + PRIMARY SAVE BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <span className="tag tag-accent" style={{ fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <GraduationCap size={13} /> {formData.college || 'IIT Madras'}
          </span>

          {setTheme && (
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="btn-icon"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)'
              }}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          )}

          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)'
            }}
          >
            <img 
              src={getDefaultAvatarByGender(formData.gender, formData.avatarUrl)} 
              alt="Avatar" 
              style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #10b981', objectFit: 'cover' }} 
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formData.fullName || 'Aarav Sharma'}
              </div>
              <div style={{ fontSize: '0.625rem', color: '#10b981', fontWeight: 700 }}>
                {profileStrength.score === 100 ? '✓ 100% Completed' : `${profileStrength.score}% Completed`}
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleSaveAll()} 
            disabled={isSaving}
            className="btn btn-accent"
            style={{
              fontWeight: 800,
              fontSize: '0.8125rem',
              padding: '0.5rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isSaving ? <RefreshCw size={14} className="spin" /> : <Check size={15} />}
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </header>

      {/* 2. SUBHEADER: STREAMLINED PROFILE STRENGTH PROGRESS BAR */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.625rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            🎯 Profile Strength: <strong style={{ color: profileStrength.score === 100 ? '#10b981' : 'var(--accent-primary)' }}>{profileStrength.score}%</strong>
          </span>
          <span className={`tag ${profileStrength.levelBadge}`} style={{ fontSize: '0.6875rem', fontWeight: 800 }}>
            {profileStrength.levelLabel}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, maxWidth: '420px' }}>
          <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ 
              width: `${profileStrength.score}%`, 
              height: '100%', 
              backgroundColor: profileStrength.score === 100 ? '#10b981' : 'var(--accent-primary)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease' 
            }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: profileStrength.score === 100 ? '#10b981' : 'var(--accent-primary)' }}>
            {profileStrength.score}%
          </span>
        </div>
      </div>

      {/* 3. MAIN 2-COLUMN CATEGORIZED LAYOUT (FULL-WIDTH SCROLLABLE STANDALONE PAGE) */}
      <main style={{ flex: 1, padding: '2rem 2.5rem 4rem 2.5rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* 1. MASTER STUDENT PROFILE HERO CARD */}
        <div className="card-premium" style={{ marginBottom: '2rem', overflow: 'hidden', padding: 0, border: '1px solid var(--border-color)' }}>
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

                  {/* TOP-RIGHT BADGE: 100% TICK MARK OR PERCENTAGE */}
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

              {/* QUICK ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleSaveAll()} 
                  disabled={isSaving}
                  className="btn btn-accent"
                  style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {isSaving ? <RefreshCw size={14} className="spin" /> : <Check size={15} />}
                  {isSaving ? 'Saving...' : 'Save All Changes'}
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
                  ⭐ 4.9 Tutor Rating (24 Classes Taught)
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
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem', flexWrap: 'wrap' }}>
                <div><strong>3</strong> <span style={{ color: 'var(--text-secondary)' }}>posts</span></div>
                <div><strong>2</strong> <span style={{ color: 'var(--text-secondary)' }}>shorts</span></div>
                <div><strong>148</strong> <span style={{ color: 'var(--text-secondary)' }}>followers</span></div>
                <div><strong>92</strong> <span style={{ color: 'var(--text-secondary)' }}>following</span></div>
                <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                  ⚡ 680 XP • Lvl 4
                </div>
              </div>

              {/* ABOUT / BIO */}
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {formData.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught'}
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

        {/* 2. MAIN 2-COLUMN CATEGORIZED LAYOUT (NAUKRI & ENTERPRISE PORTAL STYLE) */}
        <div className="settings-responsive-layout">
        
        {/* LEFT COLUMN: CATEGORIES SIDEBAR */}
        <div className="card-premium" style={{ padding: '1rem', position: 'sticky', top: '1.5rem' }}>
          
          <div style={{ padding: '0.5rem 0.75rem 0.75rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              SETTINGS CATEGORIES
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {categories
              .filter(cat => cat.label.toLowerCase().includes(searchFilter.toLowerCase()))
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
                      padding: '0.65rem 0.875rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <span style={{ color: isActive ? '#ffffff' : 'var(--accent-primary)' }}>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>

                    {cat.badge && (
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : (cat.isInsta ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-tertiary)'),
                        color: isActive ? '#ffffff' : (cat.isInsta ? '#ec4899' : 'var(--accent-primary)')
                      }}>
                        {cat.badge}
                      </span>
                    )}

                    {cat.count !== undefined && (
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)',
                        color: isActive ? '#ffffff' : 'var(--text-secondary)'
                      }}>
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
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

              {/* FORM FIELDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
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

                <div style={{ gridColumn: '1 / -1' }}>
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
                    Tip: Mention your major, university, and core strengths like peer mentoring or hackathon awards.
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label">About / Student Bio</label>
                  <textarea 
                    className="input" 
                    style={{ minHeight: '90px' }} 
                    value={formData.bio} 
                    onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                    placeholder="Brief description about your studies, passions, and mentoring background..." 
                  />
                </div>

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
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={26} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formData.resumeFileName}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      Uploaded: {formData.resumeUploadDate} • 2.4 MB PDF Document
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => alert("📥 Downloading verified resume PDF...")} className="btn btn-secondary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    <Download size={14} /> Download
                  </button>
                  <button onClick={() => alert("📤 Resume file upload: Select new PDF file from device")} className="btn btn-accent" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
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
          {/* CATEGORY 8: CREATOR & REELS REACH ANALYTICS (INSTAGRAM & YOUTUBE SHORTS STUDIO) */}
          {/* ========================================================================= */}
          {activeCategory === 'reach' && (
            <div className="card-premium">
              
              {/* INSTAGRAM CREATOR STUDIO STYLE HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                      📊 Creator & Concept Shorts Studio
                    </h2>
                    <span className="tag tag-accent" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#ffffff', fontWeight: 800, fontSize: '0.75rem' }}>
                      ⚡ Studio & Privacy Mode
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                    Publish educational shorts, configure Public / Campus / Private visibility, and inspect live reach analytics.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* UPLOAD NEW SHORT ACTION */}
                  <button 
                    onClick={() => setShowUploadShortModal(true)} 
                    className="btn btn-accent"
                    style={{ fontSize: '0.8125rem', fontWeight: 800, padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <Plus size={15} /> Publish Concept Short (9:16)
                  </button>

                  {/* TIMEFRAME SWITCHER */}
                  <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                    {[
                      { id: '7d', label: 'Last 7 Days' },
                      { id: '30d', label: 'Last 30 Days' },
                      { id: 'all', label: 'All Time' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setReachTimeframe(t.id)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-xs)',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: reachTimeframe === t.id ? 'var(--bg-card)' : 'transparent',
                          color: reachTimeframe === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          boxShadow: reachTimeframe === t.id ? 'var(--shadow-sm)' : 'none'
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* UPLOAD SHORT MODAL DRAWER */}
              {showUploadShortModal && (
                <form onSubmit={handleCreateShort} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🎬 Publish New Concept Short (9:16 Format)
                    </h4>
                    <button type="button" onClick={() => setShowUploadShortModal(false)} className="btn-icon"><X size={16} /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Short Video Title & Tags *</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 3 Tricks to solve Recursion Tree problems fast in Java ⚡ #Algorithms #Java"
                        value={newShortForm.title} 
                        onChange={e => setNewShortForm({ ...newShortForm, title: e.target.value })} 
                        required 
                      />
                    </div>

                    <div>
                      <label className="label">Academic Subject / Domain</label>
                      <select 
                        className="input"
                        value={newShortForm.category}
                        onChange={e => setNewShortForm({ ...newShortForm, category: e.target.value })}
                      >
                        <option value="Algorithms">Algorithms & Data Structures</option>
                        <option value="Java">Java & Object Oriented</option>
                        <option value="React">React & Frontend Architecture</option>
                        <option value="System Design">System Design & Backend</option>
                        <option value="AI / ML">AI / Machine Learning</option>
                        <option value="Gate Exam">GATE Exam Tricks</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">🔒 Audience & Privacy Level</label>
                      <select 
                        className="input"
                        value={newShortForm.visibility}
                        onChange={e => setNewShortForm({ ...newShortForm, visibility: e.target.value })}
                      >
                        <option value="public">🌐 Public (All Campus Students & Network)</option>
                        <option value="campus">🏫 Campus Only (Verified IIT Madras peers)</option>
                        <option value="private">🔒 Private / Unlisted Draft</option>
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Video Source URL (MP4 / WebM / CDN)</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="https://assets.mixkit.co/videos/... or media link"
                        value={newShortForm.videoUrl} 
                        onChange={e => setNewShortForm({ ...newShortForm, videoUrl: e.target.value })} 
                        required 
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={newShortForm.allowComments} 
                          onChange={e => setNewShortForm({ ...newShortForm, allowComments: e.target.checked })} 
                        />
                        💬 Allow Peer Comments & Discussion
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={newShortForm.allowTips} 
                          onChange={e => setNewShortForm({ ...newShortForm, allowTips: e.target.checked })} 
                        />
                        🪙 Allow Peer Coin Tips (1 to 50 Coins)
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => setShowUploadShortModal(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Cancel</button>
                    <button type="submit" className="btn btn-accent" style={{ fontSize: '0.75rem', fontWeight: 800 }}>Publish Short 🚀</button>
                  </div>
                </form>
              )}

              {/* TOP KPI CARDS STRIP */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.08) 0%, rgba(0, 198, 255, 0.08) 100%)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL ACCOUNTS REACHED</span>
                    <Eye size={16} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                    14,820
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 700, marginTop: '0.2rem' }}>
                    ↑ +34.2% vs previous period
                  </div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL REEL PLAYS & VIEWS</span>
                    <Play size={16} style={{ color: '#ec4899' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                    38,450
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 700, marginTop: '0.2rem' }}>
                    ↑ +28.6% engagement
                  </div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL WATCH TIME</span>
                    <Clock size={16} style={{ color: 'var(--success-color)' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                    194.6 Hrs
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Avg 83.3% completion rate
                  </div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>CREATOR ENGAGEMENT</span>
                    <Flame size={16} style={{ color: 'var(--warning-color)' }} />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                    12.8%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '0.2rem' }}>
                    ⭐ Top 5% Peer Creator
                  </div>
                </div>
              </div>

              {/* INDIVIDUAL REEL REACH PERFORMANCE (DETAILED BREAKDOWN WITH VISIBILITY TOGGLES) */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tv2 size={18} style={{ color: 'var(--accent-primary)' }} />
                  Your Published Concept Shorts & Privacy Controls
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reelAnalyticsData.map((reel) => (
                    <div key={reel.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                      
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: '280px', flex: 1 }}>
                        <img 
                          src={reel.thumbnail} 
                          alt="Thumbnail" 
                          style={{ width: '60px', height: '90px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)' }} 
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>{reel.title}</h4>
                          </div>
                          
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Published {reel.postedDate} • Educational Concept Short (9:16)
                          </div>

                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <span>❤️ {reel.likes} Likes</span>
                            <span>💬 {reel.comments} Comments</span>
                            <span>🔖 {reel.saves} Saves</span>
                            <span>↗️ {reel.shares} Shares</span>
                          </div>
                        </div>
                      </div>

                      {/* STATS MATRIX FOR REEL */}
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MEMBERS SEEN</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
                            {reel.reachMembers.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--success-color)', fontWeight: 700 }}>
                            {reel.nonFollowerReachPct}% Non-Followers
                          </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL PLAYS</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                            {reel.views.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            {reel.watchTimeHours} Hours Total
                          </div>
                        </div>

                        {/* PRIVACY CONTROLS DROPDOWN & DELETE */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: '150px' }}>
                          <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Audience Visibility</label>
                          <select 
                            value={reel.visibility || 'public'} 
                            onChange={e => handleUpdateReelVisibility(reel.id, e.target.value)}
                            className="input"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
                          >
                            <option value="public">🌐 Public (All)</option>
                            <option value="campus">🏫 Campus Only</option>
                            <option value="private">🔒 Private Draft</option>
                          </select>

                          <button 
                            onClick={() => handleDeleteReel(reel.id)} 
                            className="btn btn-secondary" 
                            style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', color: 'var(--danger-color)', border: '1px solid var(--border-color)' }}
                          >
                            <Trash2 size={12} /> Delete Short
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* AUDIENCE DEMOGRAPHICS & REACH DISTRIBUTION */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                
                <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={16} style={{ color: 'var(--accent-primary)' }} />
                    Top Reached Campuses
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { college: 'IIT Madras', pct: 42, count: '6,224 students' },
                      { college: 'IIT Bombay', pct: 24, count: '3,556 students' },
                      { college: 'BITS Pilani', pct: 18, count: '2,667 students' },
                      { college: 'NIT Trichy', pct: 10, count: '1,482 students' },
                      { college: 'Other Universities', pct: 6, count: '891 students' }
                    ].map((c, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.college}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{c.count} ({c.pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${c.pct}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={16} style={{ color: '#ec4899' }} />
                    Discovery & Traffic Sources
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { source: 'Campus Concept Shorts Feed', pct: 62, icon: '📱' },
                      { source: 'Topic & Doubt Room Searches', pct: 23, icon: '🔍' },
                      { source: 'Direct Chat & Peer Shares', pct: 15, icon: '💬' }
                    ].map((s, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.icon} {s.source}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{s.pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${s.pct}%`, height: '100%', backgroundColor: '#ec4899' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 9: PEER TUTORING & PRICING */}
          {/* ========================================================================= */}
          {activeCategory === 'tutoring' && (
            <div className="card-premium">
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                🧑‍🏫 1:1 Peer Mentoring & Pricing Preferences
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Set your availability for live 1:1 video classes, hourly rate, and subjects you teach.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Open to 1:1 Peer Mentoring</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow fellow campus students to book 1:1 study sessions with you</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.isAvailableForMentoring} 
                  onChange={e => {
                    const next = { ...formData, isAvailableForMentoring: e.target.checked };
                    setFormData(next);
                    handleSaveAll(next);
                  }}
                  style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="label">Hourly Rate in Rupee (₹)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>₹</span>
                    <input 
                      type="number" 
                      className="input" 
                      value={formData.hourlyRate} 
                      onChange={e => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Rate in Peer Coins (🪙)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>🪙</span>
                    <input 
                      type="number" 
                      className="input" 
                      value={formData.coinRate} 
                      onChange={e => setFormData({ ...formData, coinRate: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>
              </div>

              {/* TEACHING SKILLS TAGS */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="label">Subjects & Skills You Teach</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {(formData.teachingSkills || []).map((skill, sIdx) => (
                    <span key={sIdx} className="tag tag-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}>
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Add subject (e.g. Dynamic Programming, Java, Calculus)" 
                    value={newSkillTag} 
                    onChange={e => setNewSkillTag(e.target.value)} 
                  />
                  <button type="submit" className="btn btn-secondary" style={{ flexShrink: 0 }}>Add Tag</button>
                </form>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleSaveAll()} className="btn btn-primary" style={{ fontWeight: 700, padding: '0.6rem 1.5rem' }}>
                  Save Mentoring Preferences
                </button>
              </div>
            </div>
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
