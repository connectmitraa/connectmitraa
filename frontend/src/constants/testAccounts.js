import { MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from './avatars';

// Pre-configured test accounts
export const TEST_ACCOUNTS = [
  { 
    email: 'studenta@student.com', 
    role: 'authenticated', 
    id: '11111111-1111-1111-1111-111111111111', 
    fullName: 'Aarav Sharma',
    college: 'IIT Madras',
    department: 'Computer Science',
    year: 2,
    gender: 'male',
    bio: '🎓 CS Major @ IIT Madras | 💻 Full-Stack & Java Mentor | 🚀 24 1:1 Classes Taught',
    headline: 'B.Tech CS @ IIT Madras • Java & DSA Peer Mentor • SIH Finalist',
    location: 'Chennai, Tamil Nadu, India',
    resumeFileName: 'Aarav_Sharma_BTech_CS_Resume.pdf',
    resumeUploadDate: 'Aug 2026',
    socialLinks: {
      github: 'https://github.com/aaravsharma',
      linkedin: 'https://linkedin.com/in/aarav-sharma-cs',
      leetcode: 'https://leetcode.com/aarav_codes',
      portfolio: 'https://aaravsharma.dev'
    },
    educations: [
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
    certifications: [
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
    achievements: [
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
    projects: [
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
    skills: ['Java', 'Algorithms', 'React', 'Calculus', 'WebRTC', 'Spring Boot'],
    teachingSkills: ['Java', 'Algorithms', 'Data Structures'],
    learningGoals: ['System Design', 'AI/ML', 'Microservices'],
    xp: 650,
    level: 4,
    coins: 45,
    followersCount: 148,
    followingCount: 92,
    walletBalance: 450,
    lifetimeEarnings: 1850,
    classesTaught: 24,
    customSessionRate: 50,
    conceptClarityRating: 4.9,
    tutorTier: 'certified',
    avatarUrl: MALE_AVATAR_SVG
  },
  { 
    email: 'studentb@student.com', 
    role: 'authenticated', 
    id: '22222222-2222-2222-2222-222222222222', 
    fullName: 'Bhavna Patel',
    college: 'IIT Madras',
    department: 'Computer Science',
    year: 3,
    gender: 'female',
    bio: '👩‍💻 AI Researcher & Peer Tutor | ⭐ 4.9 Rating | 🏆 87 Classes Taught • 96% Concept Clarity',
    headline: '3rd Year CS @ IIT Madras • AI Researcher • Master Peer Tutor (87+ Sessions)',
    location: 'Chennai, India',
    resumeFileName: 'Bhavna_Patel_AI_Tutor_Resume.pdf',
    resumeUploadDate: 'Aug 2026',
    socialLinks: {
      github: 'https://github.com/bhavnapatel',
      linkedin: 'https://linkedin.com/in/bhavna-patel',
      leetcode: 'https://leetcode.com/bhavna_ai',
      portfolio: 'https://bhavnapatel.ai'
    },
    educations: [
      {
        id: 'edu-b1',
        school: 'Indian Institute of Technology (IIT) Madras',
        degree: 'Bachelor of Technology - B.Tech',
        field: 'Computer Science',
        startYear: '2022',
        endYear: '2026',
        grade: '9.4 / 10.0 CGPA',
        activities: 'President at Women in Tech IITM, Senior Peer Tutor'
      }
    ],
    certifications: [
      {
        id: 'cert-b1',
        name: 'TensorFlow Developer Certificate',
        issuer: 'Google',
        issueDate: 'Mar 2025',
        credentialId: 'TF-DEV-19283',
        credentialUrl: 'https://google.com',
        badgeIcon: '🧠'
      },
      {
        id: 'cert-b2',
        name: 'Oracle Certified Professional: Java SE 11 Developer',
        issuer: 'Oracle',
        issueDate: 'Jan 2025',
        credentialId: 'OCP-JAVA-54892',
        credentialUrl: 'https://oracle.com',
        badgeIcon: '☕'
      }
    ],
    achievements: [
      {
        id: 'ach-b1',
        title: 'Google Solution Challenge Global Top 100',
        issuer: 'Google Developers',
        date: '2025',
        desc: 'Built assistive communication tool for students with hearing impairment.'
      }
    ],
    projects: [
      {
        id: 'proj-b1',
        title: 'NeuralVision - Edge AI Real-Time Object Recognition',
        stack: ['Python', 'PyTorch', 'FastAPI', 'React'],
        desc: 'Lightweight YOLOv8 object detector for low-power mobile devices.',
        githubUrl: 'https://github.com/bhavnapatel/neural-vision',
        liveUrl: 'https://neuralvision.dev'
      }
    ],
    skills: ['Python', 'Machine Learning', 'Data Structures', 'DBMS', 'PyTorch'],
    teachingSkills: ['Python', 'Machine Learning', 'DBMS', 'Java'],
    learningGoals: ['Cloud Computing', 'WebRTC'],
    xp: 820,
    level: 5,
    coins: 60,
    followersCount: 230,
    followingCount: 110,
    walletBalance: 890,
    lifetimeEarnings: 4350,
    classesTaught: 87,
    customSessionRate: 75,
    conceptClarityRating: 4.9,
    tutorTier: 'master',
    avatarUrl: FEMALE_AVATAR_SVG
  },
  { 
    email: 'studentc@student.com', 
    role: 'authenticated', 
    id: '33333333-3333-3333-3333-333333333333', 
    fullName: 'Chaitanya Reddy',
    college: 'BITS Pilani',
    department: 'Electrical Engineering',
    year: 1,
    gender: 'male',
    bio: '⚡ Electronics Enthusiast & C++ Learner | 🌱 Apprentice Tutor (7/10 Free Sessions Done)',
    headline: '1st Year EEE @ BITS Pilani • Embedded C++ & Circuits Hobbyist',
    location: 'Hyderabad, India',
    resumeFileName: 'Chaitanya_Reddy_EEE_Resume.pdf',
    resumeUploadDate: 'Jul 2026',
    socialLinks: {
      github: 'https://github.com/chaitanyareddy',
      linkedin: 'https://linkedin.com/in/chaitanya-reddy-eee',
      leetcode: 'https://leetcode.com/chaitanya_eee',
      portfolio: 'https://chaitanya.dev'
    },
    educations: [
      {
        id: 'edu-c1',
        school: 'BITS Pilani, Hyderabad Campus',
        degree: 'Bachelor of Engineering - B.E.',
        field: 'Electrical & Electronics Engineering',
        startYear: '2024',
        endYear: '2028',
        grade: '8.4 / 10.0 CGPA',
        activities: 'Robotics Club Member'
      }
    ],
    certifications: [
      {
        id: 'cert-c1',
        name: 'NPTEL: Basic Electrical Circuits',
        issuer: 'IIT Madras',
        issueDate: 'Apr 2025',
        credentialId: 'NPTEL25EE12',
        credentialUrl: 'https://nptel.ac.in',
        badgeIcon: '⚡'
      }
    ],
    achievements: [
      {
        id: 'ach-c1',
        title: 'State Level Science Exhibition 1st Place',
        issuer: 'Dept of Science & Tech',
        date: '2024',
        desc: 'Built smart micro-grid simulation circuit with renewable energy switching.'
      }
    ],
    projects: [
      {
        id: 'proj-c1',
        title: 'SmartCircuit - Arduino Based Energy Logger',
        stack: ['C++', 'Arduino', 'IoT', 'Embedded Systems'],
        desc: 'Real-time voltage and current telemetry sent to cloud dashboard.',
        githubUrl: 'https://github.com/chaitanya/smart-circuit',
        liveUrl: 'https://chaitanya.dev/smart-circuit'
      }
    ],
    skills: ['C++', 'Circuits', 'Calculus', 'Arduino'],
    teachingSkills: ['Circuits', 'C++'],
    learningGoals: ['Python', 'Web Development'],
    xp: 340,
    level: 2,
    coins: 20,
    followersCount: 85,
    followingCount: 75,
    walletBalance: 0,
    lifetimeEarnings: 0,
    classesTaught: 7,
    customSessionRate: 30,
    conceptClarityRating: 4.7,
    tutorTier: 'apprentice',
    avatarUrl: MALE_AVATAR_SVG
  },
  {
    email: 'admin@studyloop.app',
    role: 'super_admin',
    id: '00000000-0000-0000-0000-000000000000',
    fullName: 'Platform Administrator',
    college: 'StudyLoop Central HQ',
    department: 'Academic Safety & Moderation',
    year: 4,
    gender: 'other',
    bio: '🛡️ StudyLoop Safety & Platform Operations Lead',
    skills: ['Platform Operations', 'User Safety', 'Academic Auditing'],
    teachingSkills: ['All Subjects'],
    learningGoals: ['Community Scaling'],
    xp: 9999,
    level: 99,
    coins: 5000,
    followersCount: 1200,
    followingCount: 5,
    avatarUrl: NEUTRAL_AVATAR_SVG
  }
];
