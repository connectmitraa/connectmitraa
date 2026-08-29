import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowUpRight, Award, Bell, BookOpen, Bookmark, Briefcase, Calendar, Camera, Check, CheckCircle, ChevronRight, Clock, Code, Download, Edit, ExternalLink, Eye, FileText, Filter, Flame, Github, Globe, GraduationCap, Grid, Heart, MapPin, MessageSquare, Pencil, Plus, PlusCircle, Search, Send, Settings, Share2, Shield, Sparkles, Star, Trash2, TrendingUp, Trophy, Tv2, Upload, UploadCloud, UserCheck, Users, Video, X, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';
import { AvatarChangeModal } from '../../components/modals/AvatarChangeModal';
import { PhotoPreviewModal } from '../../components/modals/PhotoPreviewModal';

// Profile Modals
import { EditIntroModal } from '../../components/profile/EditIntroModal';
import { AddEducationModal } from '../../components/profile/AddEducationModal';
import { AddCertificateModal } from '../../components/profile/AddCertificateModal';
import { AddAchievementModal } from '../../components/profile/AddAchievementModal';
import { AddProjectModal } from '../../components/profile/AddProjectModal';
import { AddSkillModal } from '../../components/profile/AddSkillModal';
import { ResumeUploadModal } from '../../components/profile/ResumeUploadModal';
import { ResumePreviewModal } from '../../components/profile/ResumePreviewModal';

export function DashboardScreen({ token, setActiveTab, onOpenUserList, onStartChat }) {
  const { user, profile: authProfile, updateProfileState, testAccounts } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [showCreateHighlightModal, setShowCreateHighlightModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Tabs: 'posts', 'reels', 'videos', 'connections', 'badges'
  const [activeTabName, setActiveTabName] = useState('posts');
  
  // Theater Player Modal state
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const profile = { ...(data?.profile || {}), ...(authProfile || {}) };

  // Profile Edit Form States
  const [editFullName, setEditFullName] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editYear, setEditYear] = useState(1);
  const [editGender, setEditGender] = useState('male');
  const [editBio, setEditBio] = useState('');
  const [editTeachingSkills, setEditTeachingSkills] = useState('');
  const [editLearningGoals, setEditLearningGoals] = useState('');

  // Upload Modal States
  const [uploadType, setUploadType] = useState('reel'); // 'reel', 'video', 'post'
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('#Java');
  const [uploadDuration, setUploadDuration] = useState('0:45');
  const [filePreviewUrl, setFilePreviewUrl] = useState('');

  // Story Highlights
  const [highlightsList, setHighlightsList] = useState([
    {
      id: 'hl-1',
      title: 'Lab Notes',
      cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'hl-2',
      title: 'Placements',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80'
    }
  ]);
  const [newHighlightTitle, setNewHighlightTitle] = useState('');
  const [newHighlightCover, setNewHighlightCover] = useState('');

  // Posts Dataset
  const [postsList, setPostsList] = useState([
    {
      id: 'post-1',
      title: '🚀 Complete Java Collections Cheat Sheet - HashMaps vs TreeMaps breakdown for mid-terms!',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      likes: 42,
      comments: [
        { author: 'Bhavna Patel', text: 'Super clear diagram! Helped me score A in my lab test.' },
        { author: 'Chaitanya Reddy', text: 'Can you share the PDF link too?' }
      ]
    },
    {
      id: 'post-2',
      title: '📊 Dynamic Programming 101 - Knapsack Problem visual guide with time complexity analysis',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      likes: 89,
      comments: [
        { author: 'Aarav Sharma', text: 'DP tables finally made sense after this post 🔥' }
      ]
    },
    {
      id: 'post-3',
      title: '⚡ 5 React Hooks Mistakes to avoid in your semester project! Save for later 📌',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      likes: 112,
      comments: [
        { author: 'Student Peer', text: 'useEffect dependencies explanation was 10/10!' }
      ]
    }
  ]);

  // Reels Dataset (9:16 Shorts)
  const [reelsList, setReelsList] = useState([
    {
      id: 'reel-1',
      title: '3 Tricks to solve Recursion fast ⚡ #Java #Algorithms',
      duration: '0:45',
      views: '1.4k',
      likes: 154,
      hashtag: '#Algorithms',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
      comments: [
        { author: 'Aarav Sharma', text: 'Recursion base condition explanation was super clear!' },
        { author: 'Bhavna Patel', text: 'Loved the visual stack trace diagram 🚀' }
      ]
    },
    {
      id: 'reel-2',
      title: 'How Spring Boot Inversion of Control works in 60s ☕ #SpringBoot',
      duration: '0:58',
      views: '2.1k',
      likes: 218,
      hashtag: '#Java',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      comments: [
        { author: 'Chaitanya Reddy', text: 'Dependency injection explained visually is so helpful!' }
      ]
    }
  ]);

  // Videos Dataset (16:9 Lectures)
  const [videosList, setVideosList] = useState([
    {
      id: 'vid-1',
      title: 'Full Spring Boot & React Crash Course for College Projects',
      duration: '18:45',
      views: '4.8k',
      likes: 340,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
      comments: [
        { author: 'Chaitanya Reddy', text: 'Awesome crash course for beginners!' }
      ]
    },
    {
      id: 'vid-2',
      title: 'Operating Systems: Thread Synchronization & Deadlock Prevention Masterclass',
      duration: '28:30',
      views: '3.1k',
      likes: 210,
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-student-reading-a-book-in-a-library-41544-large.mp4',
      comments: []
    }
  ]);

  // Real-Time Connections Dataset
  const [connectionsList, setConnectionsList] = useState([
    {
      id: 'conn-1',
      fullName: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'Computer Science',
      year: 3,
      isOnline: true,
      avatarUrl: FEMALE_AVATAR_SVG,
      teachingSkills: ['Python', 'Machine Learning'],
      rating: 4.9
    },
    {
      id: 'conn-2',
      fullName: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'Electrical Engineering',
      year: 1,
      isOnline: true,
      avatarUrl: MALE_AVATAR_SVG,
      teachingSkills: ['Circuits', 'Calculus'],
      rating: 4.7
    }
  ]);

  // Pending Requests Dataset
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req-1',
      fullName: 'Divya Nambiar',
      college: 'NIT Trichy',
      department: 'Data Science',
      year: 2,
      avatarUrl: FEMALE_AVATAR_SVG,
      skills: ['SQL', 'Tableau', 'Statistics']
    }
  ]);

  const fetchDashboardData = async () => {
    setLoading(true);
    let targetProfileId = authProfile?.id || user?.id || '11111111-1111-1111-1111-111111111111';
    
    // Check cached profile in localStorage
    const cachedMock = localStorage.getItem(`studyloop_profile_${targetProfileId}`);
    const matchedAccount = testAccounts?.find(acc => acc.id === targetProfileId) || {};
    
    let activeMockProfile = {
      id: targetProfileId,
      fullName: matchedAccount.fullName || 'Aarav Sharma',
      college: matchedAccount.college || 'IIT Madras',
      department: matchedAccount.department || 'Computer Science',
      year: matchedAccount.year || 2,
      gender: matchedAccount.gender || 'male',
      bio: matchedAccount.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught',
      headline: matchedAccount.headline || 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist',
      location: matchedAccount.location || 'Chennai, Tamil Nadu, India',
      resumeFileName: matchedAccount.resumeFileName || 'Aarav_Sharma_BTech_CS_Resume.pdf',
      resumeUploadDate: matchedAccount.resumeUploadDate || 'Aug 2026',
      socialLinks: matchedAccount.socialLinks || {
        github: 'https://github.com/aaravsharma',
        linkedin: 'https://linkedin.com/in/aarav-sharma-cs',
        leetcode: 'https://leetcode.com/aarav_codes',
        portfolio: 'https://aaravsharma.dev'
      },
      educations: matchedAccount.educations || [
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
      certifications: matchedAccount.certifications || [
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
          credentialUrl: 'https://nptel.ac.in',
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
      achievements: matchedAccount.achievements || [
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
      projects: matchedAccount.projects || [
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
      skills: matchedAccount.skills || ['Java', 'Algorithms', 'React', 'Calculus', 'WebRTC', 'Spring Boot'],
      teachingSkills: matchedAccount.teachingSkills || ['Java', 'Algorithms', 'Data Structures'],
      learningGoals: matchedAccount.learningGoals || ['System Design', 'AI/ML', 'Microservices'],
      xp: matchedAccount.xp !== undefined ? matchedAccount.xp : 650,
      level: matchedAccount.level !== undefined ? matchedAccount.level : 4,
      coins: matchedAccount.coins !== undefined ? matchedAccount.coins : 45,
      followersCount: matchedAccount.followersCount !== undefined ? matchedAccount.followersCount : 148,
      followingCount: matchedAccount.followingCount !== undefined ? matchedAccount.followingCount : 92,
      avatarUrl: matchedAccount.avatarUrl || getDefaultAvatarByGender(matchedAccount.gender)
    };

    if (cachedMock) {
      try {
        const parsed = JSON.parse(cachedMock);
        activeMockProfile = { ...activeMockProfile, ...parsed };
      } catch (e) {}
    }

    setData({ profile: activeMockProfile });
    setEditFullName(activeMockProfile.fullName);
    setEditCollege(activeMockProfile.college);
    setEditDepartment(activeMockProfile.department);
    setEditYear(activeMockProfile.year);
    setEditGender(activeMockProfile.gender || 'male');
    setEditBio(activeMockProfile.bio);
    setEditTeachingSkills((activeMockProfile.teachingSkills || []).join(', '));
    setEditLearningGoals((activeMockProfile.learningGoals || []).join(', '));
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, authProfile]);

  // Calculate LinkedIn / Naukri Profile Completeness in Percentage
  const calculateDashboardProfileStrength = () => {
    let score = 0;
    const items = [];

    const hasBasic = !!(profile.fullName && profile.headline && profile.bio && profile.college);
    if (hasBasic) score += 20;
    items.push({ label: 'Basic Info & Bio', weight: 20, done: hasBasic });

    const hasAvatar = !!(profile.avatarUrl || profile.gender);
    if (hasAvatar) score += 15;
    items.push({ label: 'Avatar & Identity', weight: 15, done: hasAvatar });

    const hasEdu = (profile.educations || []).length > 0;
    if (hasEdu) score += 15;
    items.push({ label: 'Education History', weight: 15, done: hasEdu });

    const hasCerts = (profile.certifications || []).length > 0;
    if (hasCerts) score += 15;
    items.push({ label: 'Verified Certifications', weight: 15, done: hasCerts });

    const hasProjects = (profile.projects || []).length > 0;
    if (hasProjects) score += 15;
    items.push({ label: 'Software Projects', weight: 15, done: hasProjects });

    const hasResume = !!(profile.resumeFileName);
    if (hasResume) score += 10;
    items.push({ label: 'Resume Upload', weight: 10, done: hasResume });

    const hasSkills = (profile.teachingSkills || profile.skills || []).length > 0;
    if (hasSkills) score += 10;
    items.push({ label: 'Skills & Mentoring', weight: 10, done: hasSkills });

    let levelLabel = 'Beginner (30%)';
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

  const dashboardProfileStrength = calculateDashboardProfileStrength();

  // MODULAR MODAL STATES
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showResumeUploadModal, setShowResumeUploadModal] = useState(false);
  const [showResumePreviewModal, setShowResumePreviewModal] = useState(false);

  // SECTION MUTATION HELPERS
  const saveUpdatedProfile = (updatedProf) => {
    setData(prev => ({ ...prev, profile: updatedProf }));
    updateProfileState(updatedProf);
    if (updatedProf.id) {
      localStorage.setItem(`studyloop_profile_${updatedProf.id}`, JSON.stringify(updatedProf));
    }
  };

  // Education Handlers
  const handleAddEducation = (newEdu) => {
    const updated = {
      ...profile,
      educations: [newEdu, ...(profile.educations || [])]
    };
    saveUpdatedProfile(updated);
    setShowAddEducationModal(false);
    alert("🎓 Education entry added to profile!");
  };

  const handleDeleteEducation = (eduId) => {
    const updated = {
      ...profile,
      educations: (profile.educations || []).filter(e => e.id !== eduId)
    };
    saveUpdatedProfile(updated);
  };

  // Certification Handlers
  const handleAddCertificate = (newCert) => {
    const updated = {
      ...profile,
      certifications: [newCert, ...(profile.certifications || [])]
    };
    saveUpdatedProfile(updated);
    setShowAddCertificateModal(false);
    alert("📜 License & Certificate added to profile!");
  };

  const handleDeleteCertificate = (certId) => {
    const updated = {
      ...profile,
      certifications: (profile.certifications || []).filter(c => c.id !== certId)
    };
    saveUpdatedProfile(updated);
  };

  // Achievement Handlers
  const handleAddAchievement = (newAch) => {
    const updated = {
      ...profile,
      achievements: [newAch, ...(profile.achievements || [])]
    };
    saveUpdatedProfile(updated);
    setShowAddAchievementModal(false);
    alert("🏆 Honor & Achievement added to profile!");
  };

  const handleDeleteAchievement = (achId) => {
    const updated = {
      ...profile,
      achievements: (profile.achievements || []).filter(a => a.id !== achId)
    };
    saveUpdatedProfile(updated);
  };

  // Project Handlers
  const handleAddProject = (newProj) => {
    const updated = {
      ...profile,
      projects: [newProj, ...(profile.projects || [])]
    };
    saveUpdatedProfile(updated);
    setShowAddProjectModal(false);
    alert("💻 Technical Project added to portfolio!");
  };

  const handleDeleteProject = (projId) => {
    const updated = {
      ...profile,
      projects: (profile.projects || []).filter(p => p.id !== projId)
    };
    saveUpdatedProfile(updated);
  };

  // Skill Handlers
  const handleAddSkill = (skillName, category) => {
    if (!skillName.trim()) return;
    let updated = { ...profile };
    if (category === 'teaching') {
      updated.teachingSkills = [...(profile.teachingSkills || []), skillName.trim()];
    } else if (category === 'learning') {
      updated.learningGoals = [...(profile.learningGoals || []), skillName.trim()];
    } else {
      updated.skills = [...(profile.skills || []), skillName.trim()];
    }
    saveUpdatedProfile(updated);
    setShowAddSkillModal(false);
    alert("⭐ Skill added successfully!");
  };

  const handleEndorseSkill = (skill) => {
    alert(`👍 You endorsed ${profile.fullName} for ${skill}! (+1 Skill Trust Point)`);
  };

  // Resume Upload Handler
  const handleUploadResume = (fileName) => {
    const updated = {
      ...profile,
      resumeFileName: fileName,
      resumeUploadDate: 'Aug 2026'
    };
    saveUpdatedProfile(updated);
    setShowResumeUploadModal(false);
    alert(`📄 Resume updated to "${fileName}"!`);
  };



  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedProf = {
      ...profile,
      fullName: editFullName || profile.fullName,
      college: editCollege || profile.college,
      department: editDepartment || profile.department,
      year: parseInt(editYear) || profile.year,
      gender: editGender || profile.gender,
      bio: editBio || profile.bio,
      teachingSkills: typeof editTeachingSkills === 'string' ? editTeachingSkills.split(',').map(s => s.trim()).filter(Boolean) : (profile.teachingSkills || []),
      learningGoals: typeof editLearningGoals === 'string' ? editLearningGoals.split(',').map(s => s.trim()).filter(Boolean) : (profile.learningGoals || [])
    };

    if (!updatedProf.avatarUrl || updatedProf.avatarUrl.includes('svg')) {
      updatedProf.avatarUrl = getDefaultAvatarByGender(editGender, updatedProf.avatarUrl);
    }

    setData(prev => ({ ...prev, profile: updatedProf }));
    updateProfileState(updatedProf);
    if (updatedProf.id) {
      localStorage.setItem(`studyloop_profile_${updatedProf.id}`, JSON.stringify(updatedProf));
    }
    setShowEditModal(false);
    alert("✨ Profile updated successfully!");
  };

  const handleSaveAvatar = (newAvatarUrl) => {
    if (!newAvatarUrl) return;
    const updatedProf = { ...profile, avatarUrl: newAvatarUrl };
    saveUpdatedProfile(updatedProf);
    setShowAvatarModal(false);
  };

  const claimStreakBonus = () => {
    const updatedProf = {
      ...profile,
      xp: (profile.xp || 650) + 2,
      coins: (profile.coins || 45) + 1
    };
    saveUpdatedProfile(updatedProf);
    alert("🔥 Daily Streak claimed! +2 XP & +1 Peer Coin added to your wallet.");
  };

  const handleAcceptRequest = (req) => {
    setPendingRequests(prev => prev.filter(r => r.id !== req.id));
    setConnectionsList(prev => [
      ...prev,
      {
        id: req.id,
        fullName: req.fullName,
        college: req.college,
        department: req.department,
        year: req.year,
        isOnline: true,
        avatarUrl: req.avatarUrl,
        teachingSkills: req.skills || ['General Academics'],
        rating: 5.0
      }
    ]);
    alert(`🎉 Connected with ${req.fullName}!`);
  };

  const handleIgnoreRequest = (reqId) => {
    setPendingRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleLikeMedia = () => {
    if (!selectedMedia) return;
    setSelectedMedia(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    if (selectedMedia.type === 'reel') {
      setReelsList(prev => prev.map(r => r.id === selectedMedia.id ? { ...r, likes: r.likes + 1 } : r));
    } else if (selectedMedia.type === 'post') {
      setPostsList(prev => prev.map(p => p.id === selectedMedia.id ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedMedia) return;
    const newC = { author: profile.fullName || 'You', text: commentInput.trim() };
    setSelectedMedia(prev => ({ ...prev, comments: [...(prev.comments || []), newC] }));
    if (selectedMedia.type === 'reel') {
      setReelsList(prev => prev.map(r => r.id === selectedMedia.id ? { ...r, comments: [...(r.comments || []), newC] } : r));
    } else if (selectedMedia.type === 'post') {
      setPostsList(prev => prev.map(p => p.id === selectedMedia.id ? { ...p, comments: [...(p.comments || []), newC] } : p));
    }
    setCommentInput('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handlePublishContent = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      alert("Please enter a title for your content!");
      return;
    }

    if (uploadType === 'reel') {
      const newReel = {
        id: `reel-${Date.now()}`,
        title: uploadTitle.trim(),
        duration: uploadDuration || '0:45',
        views: '1',
        likes: 1,
        hashtag: uploadSubject || '#Java',
        videoUrl: filePreviewUrl || 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        comments: []
      };
      setReelsList(prev => [newReel, ...prev]);
      setActiveTabName('reels');
      alert("📱 Educational Reel published successfully!");
    } else if (uploadType === 'video') {
      const newVid = {
        id: `vid-${Date.now()}`,
        title: uploadTitle.trim(),
        duration: uploadDuration || '15:20',
        views: '1',
        likes: 1,
        thumbnail: filePreviewUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-41334-large.mp4',
        comments: []
      };
      setVideosList(prev => [newVid, ...prev]);
      setActiveTabName('videos');
      alert("🎥 Long Lecture Video published!");
    } else {
      const newPost = {
        id: `post-${Date.now()}`,
        title: uploadTitle.trim(),
        image: filePreviewUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        likes: 1,
        comments: []
      };
      setPostsList(prev => [newPost, ...prev]);
      setActiveTabName('posts');
      alert("🖼️ Study Post published!");
    }

    setShowUploadModal(false);
    setUploadTitle('');
    setFilePreviewUrl('');
  };

  const xpProgress = Math.min(100, Math.round(((profile.xp || 650) % 200) / 2));
  const educations = profile.educations || [];
  const certifications = profile.certifications || [];
  const achievements = profile.achievements || [];
  const projects = profile.projects || [];
  const socialLinks = profile.socialLinks || {};

  return (
    <div style={{ padding: '1.5rem 2.5rem 4rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 1. LINKEDIN-STYLE PROFILE COVER & HEADER CARD */}
      <div className="card-premium" style={{ marginBottom: '2rem', padding: 0, overflow: 'hidden', position: 'relative' }}>
        
        {/* COVER BANNER */}
        <div style={{ height: '180px', width: '100%', background: 'linear-gradient(135deg, #0066FF 0%, #00C6FF 50%, #4F46E5 100%)', position: 'relative' }}>
          <button 
            onClick={() => alert("📸 Cover photo upload: Select custom background banner")}
            style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-full)', padding: '0.4rem 0.875rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}
          >
            <Camera size={14} /> Edit Cover
          </button>
        </div>

        {/* PROFILE INTRO BODY */}
        <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginTop: '-60px', marginBottom: '1.25rem' }}>
            
            {/* AVATAR + 100% COMPLETION GREEN MARK + FLOATING EDIT PENCIL */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowPhotoPreview(true)}
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  padding: '4px',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: dashboardProfileStrength.score === 100 
                    ? '0 0 0 3px #10b981, 0 0 20px rgba(16, 185, 129, 0.4)' 
                    : 'var(--shadow-lg)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                title={dashboardProfileStrength.score === 100 ? "100% Profile Completed (All-Star) - Click to preview" : "Click to preview avatar"}
              >
                <img 
                  src={getDefaultAvatarByGender(profile.gender, profile.avatarUrl)} 
                  alt="Avatar" 
                  onError={(e) => { e.target.src = getDefaultAvatarByGender(profile.gender); }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    border: '3.5px solid #10b981', 
                    objectFit: 'cover' 
                  }} 
                />

                {/* TOP-RIGHT BADGE: 100% TICK MARK OR EXACT PERCENTAGE */}
                <div
                  title={dashboardProfileStrength.score === 100 ? "100% Profile Completed" : `${dashboardProfileStrength.score}% Profile Completed`}
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
                  {dashboardProfileStrength.score === 100 ? (
                    <Check size={18} style={{ strokeWidth: 3.5 }} />
                  ) : (
                    <span>{dashboardProfileStrength.score}%</span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('settings'); }}
                title="Edit Profile & Settings"
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
                <Pencil size={16} style={{ strokeWidth: 2.5 }} />
              </button>
            </div>

            {/* QUICK ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
              
              <button 
                onClick={() => setActiveTab('settings')} 
                className="btn btn-primary"
                style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 700 }}
              >
                <Settings size={14} /> Edit Profile & Settings
              </button>

              <button 
                onClick={claimStreakBonus} 
                className="btn btn-accent"
                style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 800 }}
              >
                <Flame size={15} /> Streak (+2 XP)
              </button>

            </div>

          </div>

          {/* NAME, HEADLINE & METADATA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 className="font-serif" style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0 }}>
                {profile.fullName || 'Aarav Sharma'}
              </h1>
              <span className="tag tag-accent" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                ✓ Verified Student
              </span>
              <span className="tag tag-success" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                🎓 Open to 1:1 Peer Mentoring
              </span>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {profile.headline || 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <GraduationCap size={15} style={{ color: 'var(--accent-primary)' }} />
                {profile.college || 'IIT Madras'} • {profile.department || 'Computer Science'} (Year {profile.year || 2})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
                {profile.location || 'Chennai, Tamil Nadu, India'}
              </span>
              <span style={{ color: 'var(--warning-color)', fontWeight: 700 }}>
                ⭐ {profile.conceptClarityRating || 4.9} Tutor Rating ({profile.classesTaught || 24} Classes Taught)
              </span>
            </div>

            {/* SOCIAL / CODING HANDLES STRIP */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="tag tag-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Github size={13} /> GitHub Profile ↗
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="tag tag-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Briefcase size={13} /> LinkedIn ↗
                </a>
              )}
              {socialLinks.leetcode && (
                <a href={socialLinks.leetcode} target="_blank" rel="noreferrer" className="tag tag-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Code size={13} /> LeetCode (Knight) ↗
                </a>
              )}
              {socialLinks.portfolio && (
                <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" className="tag tag-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Globe size={13} /> Portfolio Website ↗
                </a>
              )}
            </div>

            {/* COUNTERS STRIP */}
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem' }}>
              <div><strong>{postsList.length}</strong> <span style={{ color: 'var(--text-secondary)' }}>posts</span></div>
              <div><strong>{reelsList.length}</strong> <span style={{ color: 'var(--text-secondary)' }}>shorts</span></div>
              <div 
                onClick={() => onOpenUserList && onOpenUserList('Followers', profile.id)} 
                style={{ cursor: 'pointer' }}
              >
                <strong>{profile.followersCount !== undefined ? profile.followersCount : 148}</strong> <span style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>followers</span>
              </div>
              <div 
                onClick={() => onOpenUserList && onOpenUserList('Following', profile.id)} 
                style={{ cursor: 'pointer' }}
              >
                <strong>{profile.followingCount !== undefined ? profile.followingCount : 92}</strong> <span style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>following</span>
              </div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                ⚡ {profile.xp || 650} XP • Lvl {profile.level || 4}
              </div>
            </div>

            {/* ABOUT / BIO */}
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {profile.bio || '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught'}
              </p>
            </div>

          </div>

          {/* XP PROGRESS BAR */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
              <span>Campus Rank: <strong>#1 In Computer Science</strong></span>
              <span>🪙 {profile.coins !== undefined ? profile.coins : 45} Peer Coins Balance</span>
              <span>Level {profile.level || 4} ({xpProgress}% to Level { (profile.level || 4) + 1 })</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${xpProgress}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-full)' }}></div>
            </div>
          </div>

        </div>
      </div>



      {/* 3. CAREER & RESUME HUB CARD (LINKEDIN / NAUKRI STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', backgroundColor: 'rgba(0, 102, 255, 0.03)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {profile.resumeFileName || 'Aarav_Sharma_BTech_CS_Resume.pdf'}
              </div>
              <span className="tag tag-success" style={{ fontSize: '0.6875rem' }}>✓ Active ATS Resume</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
              Uploaded {profile.resumeUploadDate || 'Aug 2026'} • Visible to peer mentors, hackathon recruiters & campus organizers
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button 
            onClick={() => setShowResumeUploadModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 700 }}
          >
            <UploadCloud size={15} /> Upload / Replace PDF
          </button>
          <button 
            onClick={() => setShowResumePreviewModal(true)} 
            className="btn btn-accent" 
            style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem', fontWeight: 800 }}
          >
            <Download size={15} /> 1-Click ATS Resume
          </button>
        </div>
      </div>

      {/* 3. EDUCATION SECTION CARD (LINKEDIN STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <GraduationCap size={22} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Education & Academics</h3>
          </div>
          <button 
            onClick={() => setShowAddEducationModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Education
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {educations.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  🎓
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{edu.school}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{edu.degree} • {edu.field}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {edu.startYear} – {edu.endYear} • <strong style={{ color: 'var(--accent-primary)' }}>Grade: {edu.grade}</strong>
                  </div>
                  {edu.activities && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                      <em>Activities: {edu.activities}</em>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleDeleteEducation(edu.id)} 
                className="btn-icon" 
                title="Delete Education"
                style={{ color: 'var(--danger-color)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LICENSES & CERTIFICATIONS SECTION CARD (LINKEDIN STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Award size={22} style={{ color: 'var(--warning-color)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Licenses & Verified Certifications</h3>
          </div>
          <button 
            onClick={() => setShowAddCertificateModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Certification
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  {cert.badgeIcon || '📜'}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{cert.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Issuing Organization: <strong>{cert.issuer}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Issued {cert.issueDate} • Credential ID: <code style={{ backgroundColor: 'var(--bg-card)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{cert.credentialId}</code>
                  </div>
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, marginTop: '0.375rem', textDecoration: 'none' }}
                    >
                      Show credential <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleDeleteCertificate(cert.id)} 
                className="btn-icon" 
                title="Delete Certification"
                style={{ color: 'var(--danger-color)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HONORS & ACHIEVEMENTS SECTION CARD (UNSTOP STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Trophy size={22} style={{ color: '#ea580c' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Honors & Hackathon Achievements (Unstop Style)</h3>
          </div>
          <button 
            onClick={() => setShowAddAchievementModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Achievement
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {achievements.map(ach => (
            <div key={ach.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                  🏆
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{ach.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Issuer: <strong>{ach.issuer}</strong> • {ach.date}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem', lineHeight: 1.4 }}>
                    {ach.desc}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleDeleteAchievement(ach.id)} 
                className="btn-icon" 
                title="Delete Achievement"
                style={{ color: 'var(--danger-color)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PROJECTS PORTFOLIO SECTION CARD (GITHUB STANDARD) */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Code size={22} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Technical Projects & Repositories</h3>
          </div>
          <button 
            onClick={() => setShowAddProjectModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Project
          </button>
        </div>

        <div className="grid-2">
          {projects.map(proj => (
            <div key={proj.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{proj.title}</div>
                  <button 
                    onClick={() => handleDeleteProject(proj.id)} 
                    className="btn-icon" 
                    title="Delete Project"
                    style={{ color: 'var(--danger-color)' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 0.75rem 0' }}>
                  {proj.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                  {proj.stack.map((st, i) => (
                    <span key={i} className="tag tag-accent" style={{ fontSize: '0.6875rem' }}>
                      #{st}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.6rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <Github size={14} /> Code Repo ↗
                  </a>
                )}
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="btn btn-accent" style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.6rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <Globe size={14} /> Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. SKILLS & PEER ENDORSEMENTS SECTION CARD */}
      <div className="card-premium" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Star size={22} style={{ color: 'var(--warning-color)' }} />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Technical Skills & Peer Endorsements</h3>
          </div>
          <button 
            onClick={() => setShowAddSkillModal(true)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem', fontWeight: 700 }}
          >
            <Plus size={14} /> Add Skill
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              🎓 1:1 Mentoring Expertises
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.teachingSkills || ['Java', 'Algorithms', 'Data Structures']).map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--accent-primary)' }}>⭐ {skill}</span>
                  <button onClick={() => handleEndorseSkill(skill)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }} title="Endorse this skill">
                    +1 👍
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              🎯 Learning & Exploration Goals
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.learningGoals || ['System Design', 'AI/ML', 'Microservices']).map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--success-color)' }}>🚀 {skill}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 8. DASHBOARD MEDIA TABS NAVBAR (POSTS / SHORTS / LECTURES / CONNECTIONS) */}
      <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', gap: '0.5rem' }}>
        <button 
          onClick={() => setActiveTabName('posts')}
          style={{
            padding: '0.875rem 2rem',
            border: 'none',
            borderBottom: activeTabName === 'posts' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeTabName === 'posts' ? 700 : 500,
            color: activeTabName === 'posts' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Grid size={18} /> POSTS ({postsList.length})
        </button>

        <button 
          onClick={() => setActiveTabName('reels')}
          style={{
            padding: '0.875rem 2rem',
            border: 'none',
            borderBottom: activeTabName === 'reels' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeTabName === 'reels' ? 700 : 500,
            color: activeTabName === 'reels' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Tv2 size={18} /> SHORTS ({reelsList.length})
        </button>

        <button 
          onClick={() => setActiveTabName('videos')}
          style={{
            padding: '0.875rem 2rem',
            border: 'none',
            borderBottom: activeTabName === 'videos' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeTabName === 'videos' ? 700 : 500,
            color: activeTabName === 'videos' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <Bookmark size={18} /> LECTURES ({videosList.length})
        </button>

        <button 
          onClick={() => setActiveTabName('connections')}
          style={{
            padding: '0.875rem 2rem',
            border: 'none',
            borderBottom: activeTabName === 'connections' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            fontWeight: activeTabName === 'connections' ? 700 : 500,
            color: activeTabName === 'connections' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <UserCheck size={18} /> CONNECTIONS ({connectionsList.length})
        </button>
      </div>

      {/* TAB CONTENT 1: POSTS GRID */}
      {activeTabName === 'posts' && (
        <div className="grid-3">
          {postsList.map(post => (
            <div 
              key={post.id} 
              onClick={() => setSelectedMedia({ ...post, type: 'post' })}
              className="card-premium interactive-hover" 
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <img src={post.image} alt="Post" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                  {post.title}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>❤️ {post.likes} likes</span>
                  <span>💬 {post.comments.length} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 2: REELS GRID (9:16 VERTICAL SHORTS) */}
      {activeTabName === 'reels' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>My Published Concept Shorts (9:16)</h3>
            <button onClick={() => { setUploadType('reel'); setShowUploadModal(true); }} className="btn btn-accent" style={{ fontSize: '0.8125rem' }}>
              <PlusCircle size={15} /> Upload Short Reel
            </button>
          </div>

          <div className="grid-3">
            {reelsList.map(reel => (
              <div 
                key={reel.id} 
                onClick={() => setSelectedMedia({ ...reel, type: 'reel' })}
                className="card-premium interactive-hover" 
                style={{ 
                  padding: 0, 
                  overflow: 'hidden', 
                  aspectRatio: '9 / 16', 
                  maxHeight: '380px', 
                  backgroundColor: '#09090b', 
                  position: 'relative'
                }}
              >
                <video src={reel.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#ffffff', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 700 }}>
                  ⚡ 9:16 • {reel.duration}
                </div>

                <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', color: '#ffffff' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem', lineHeight: 1.3 }}>{reel.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.9 }}>
                    <span>▶ {reel.views} views</span>
                    <span style={{ color: '#f43f5e', fontWeight: 700 }}>❤️ {reel.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: LONG LECTURES (16:9) */}
      {activeTabName === 'videos' && (
        <div className="grid-2">
          {videosList.map(vid => (
            <div 
              key={vid.id} 
              onClick={() => setSelectedMedia({ ...vid, type: 'video' })}
              className="card-premium interactive-hover" 
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', aspectRatio: '16 / 9', backgroundColor: '#000000', overflow: 'hidden' }}>
                <img src={vid.thumbnail} alt="Video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', color: '#ffffff', padding: '0.25rem 0.625rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  🎥 16:9 • {vid.duration}
                </div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{vid.title}</div>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>▶ {vid.views} views</span>
                  <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>❤️ {vid.likes} likes</span>
                  <span>💬 {vid.comments.length} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 4: REAL-TIME CONNECTIONS */}
      {activeTabName === 'connections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* PENDING INCOMING REQUESTS */}
          {pendingRequests.length > 0 && (
            <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
              <h3 className="font-serif" style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} style={{ color: 'var(--accent-primary)' }} /> Pending Connection Requests ({pendingRequests.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingRequests.map(req => (
                  <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <img src={req.avatarUrl} alt="Req" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{req.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{req.college} • {req.department} (Year {req.year})</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleAcceptRequest(req)} className="btn btn-primary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}>
                        Accept Request
                      </button>
                      <button onClick={() => handleIgnoreRequest(req.id)} className="btn btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}>
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE CONNECTIONS LIST */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Your Connected Campus Mentors & Peers</h3>
              <button onClick={() => setActiveTab('discover')} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
                + Find More Peers
              </button>
            </div>

            <div className="grid-2">
              {connectionsList.map(conn => (
                <div key={conn.id} className="card-premium" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={conn.avatarUrl} alt="Conn" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      {conn.isOnline && (
                        <div className="live-dot" style={{ position: 'absolute', bottom: '2px', right: '2px', backgroundColor: '#22c55e', width: '10px', height: '10px' }} title="Online Now"></div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{conn.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{conn.college} • {conn.department}</div>
                      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                        {(conn.teachingSkills || []).map((s, i) => (
                          <span key={i} className="tag tag-accent" style={{ fontSize: '0.625rem', padding: '0.1rem 0.375rem' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onStartChat && onStartChat(conn)}
                    className="btn btn-primary"
                    style={{ padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}
                  >
                    <MessageSquare size={13} /> Chat
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}



      {/* --- MODAL 2: ADD EDUCATION MODAL --- */}
      {showAddEducationModal && (
        <AddEducationModal
          onClose={() => setShowAddEducationModal(false)}
          onSave={handleAddEducation}
        />
      )}

      {/* --- MODAL 3: ADD CERTIFICATE MODAL --- */}
      {showAddCertificateModal && (
        <AddCertificateModal
          onClose={() => setShowAddCertificateModal(false)}
          onSave={handleAddCertificate}
        />
      )}

      {/* --- MODAL 4: ADD ACHIEVEMENT MODAL --- */}
      {showAddAchievementModal && (
        <AddAchievementModal
          onClose={() => setShowAddAchievementModal(false)}
          onSave={handleAddAchievement}
        />
      )}

      {/* --- MODAL 5: ADD PROJECT MODAL --- */}
      {showAddProjectModal && (
        <AddProjectModal
          onClose={() => setShowAddProjectModal(false)}
          onSave={handleAddProject}
        />
      )}

      {/* --- MODAL 6: ADD SKILL MODAL --- */}
      {showAddSkillModal && (
        <AddSkillModal
          onClose={() => setShowAddSkillModal(false)}
          onSave={handleAddSkill}
        />
      )}

      {/* --- MODAL 7: RESUME UPLOAD MODAL --- */}
      {showResumeUploadModal && (
        <ResumeUploadModal
          currentFileName={profile.resumeFileName}
          onClose={() => setShowResumeUploadModal(false)}
          onUpload={handleUploadResume}
        />
      )}

      {/* --- MODAL 8: ATS RESUME PREVIEW & PRINT MODAL --- */}
      {showResumePreviewModal && (
        <ResumePreviewModal
          profile={profile}
          onClose={() => setShowResumePreviewModal(false)}
        />
      )}

      {/* THEATER VIDEO PLAYER MODAL */}
      {selectedMedia && (() => {
        const isShort = selectedMedia.type === 'reel';

        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 13, 22, 0.92)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div className="card-premium" style={{ width: '100%', maxWidth: isShort ? '460px' : '720px', padding: '1.75rem', borderRadius: 'var(--radius-xl)', position: 'relative', maxHeight: '92vh', overflowY: 'auto', backgroundColor: 'var(--bg-elevated)' }}>
              
              <button 
                onClick={() => setSelectedMedia(null)} 
                className="btn-icon"
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <img src={profile.avatarUrl} alt="Avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{profile.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{profile.college} • {profile.department}</div>
                </div>
              </div>

              {/* VIDEO PLAYER */}
              <div style={{ 
                position: 'relative', 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden', 
                backgroundColor: '#000000', 
                marginBottom: '1.25rem', 
                aspectRatio: isShort ? '9 / 16' : '16 / 9',
                maxHeight: isShort ? '440px' : '360px',
                margin: isShort ? '0 auto 1.25rem auto' : '0 0 1.25rem 0'
              }}>
                <video 
                  src={selectedMedia.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42867-large.mp4'} 
                  controls 
                  autoPlay 
                  loop 
                  playsInline 
                  style={{ width: '100%', height: '100%', display: 'block', backgroundColor: '#000000', objectFit: isShort ? 'cover' : 'contain' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{selectedMedia.title}</h3>
              </div>

              {/* ACTION BAR */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button onClick={handleLikeMedia} className="btn btn-secondary" style={{ color: 'var(--danger-color)', fontWeight: 700 }}>
                    ❤️ Like ({selectedMedia.likes})
                  </button>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    💬 {selectedMedia.comments ? selectedMedia.comments.length : 0} Comments
                  </span>
                </div>
              </div>

              {/* COMMENTS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {(selectedMedia.comments || []).map((c, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{c.author}:</strong> <span style={{ color: 'var(--text-secondary)' }}>{c.text}</span>
                  </div>
                ))}
              </div>

              {/* ADD COMMENT FORM */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Add a peer comment..." 
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                />
                <button type="submit" className="btn btn-accent"><Send size={15} /></button>
              </form>

            </div>
          </div>
        );
      })()}

      {/* MEDIA CREATOR STUDIO MODAL */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusCircle size={22} />
                </div>
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.375rem', margin: 0 }}>Create & Upload Media</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Publish Short Reels (9:16) or Long Lecture Videos to your student profile</p>
                </div>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="btn-icon"><X size={20} /></button>
            </div>

            <form onSubmit={handlePublishContent} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Select Content Format</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => { setUploadType('reel'); setUploadDuration('0:45'); }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: uploadType === 'reel' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: uploadType === 'reel' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      color: uploadType === 'reel' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    📱 Short Reel (9:16)
                  </button>

                  <button
                    type="button"
                    onClick={() => { setUploadType('video'); setUploadDuration('15:20'); }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: uploadType === 'video' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: uploadType === 'video' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      color: uploadType === 'video' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    🎥 Long Lecture (16:9)
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadType('post')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: uploadType === 'post' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: uploadType === 'post' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      color: uploadType === 'post' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem'
                    }}
                  >
                    🖼️ Study Notes Post
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Title / Headline</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder={uploadType === 'reel' ? "e.g. 3 Tricks to solve Recursion fast ⚡" : "e.g. Operating Systems: Deadlock Prevention"} 
                  value={uploadTitle} 
                  onChange={e => setUploadTitle(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Subject Tag</label>
                  <select className="input" value={uploadSubject} onChange={e => setUploadSubject(e.target.value)}>
                    <option value="#Java">#Java</option>
                    <option value="#Algorithms">#Algorithms</option>
                    <option value="#React">#React</option>
                    <option value="#Calculus">#Calculus</option>
                    <option value="#WebRTC">#WebRTC</option>
                    <option value="#SystemDesign">#SystemDesign</option>
                  </select>
                </div>

                <div>
                  <label className="label">Estimated Duration</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g. 0:45" 
                    value={uploadDuration} 
                    onChange={e => setUploadDuration(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="label">Upload Media File</label>
                <input 
                  type="file" 
                  accept="video/*,image/*" 
                  onChange={handleFileSelect} 
                  className="input" 
                  style={{ padding: '0.5rem' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-accent" style={{ flex: 1, padding: '0.75rem' }}>
                  🚀 Publish to Profile & Feed
                </button>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* AVATAR CHANGE MODAL */}
      {showAvatarModal && (
        <AvatarChangeModal
          currentAvatarUrl={profile.avatarUrl}
          onSave={handleSaveAvatar}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* PHOTO PREVIEW LIGHTBOX */}
      {showPhotoPreview && (
        <PhotoPreviewModal
          imageUrl={getDefaultAvatarByGender(profile.gender, profile.avatarUrl)}
          userName={profile.fullName}
          onClose={() => setShowPhotoPreview(false)}
        />
      )}

    </div>
  );
}

