# 🎓 StudyLoop — Real-Time Campus Peer-to-Peer Learning & Video Mentoring Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![WebRTC](https://img.shields.io/badge/Video-Native%20WebRTC%20P2P-333333?style=for-the-badge&logo=webrtc)](https://webrtc.org/)
[![Socket.io](https://img.shields.io/badge/RealTime-Socket.io%20Signaling-010101?style=for-the-badge&logo=socket.dot.io)](https://socket.io/)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20%26%20Code--Splitting-7c3aed?style=for-the-badge)](https://github.com/hemadrikaligiri4-source/students_connect)

StudyLoop is a campus networking, 1:1 doubt-solving, and video mentoring web platform engineered with a **modular, high-performance architecture** (inspired by LinkedIn, LeetCode, and Chegg).

---

## 🌟 Key Features Overview

### 1. 🌐 Campus Connections & Network Directory (`#connections`)
* **All Campus Members Directory**: Searchable directory filtered by university chips (`IIT Madras`, `BITS Pilani`, `NIT Trichy`, `IIIT Hyderabad`, etc.).
* **Instagram + LinkedIn Hybrid Public Profile Modal**:
  * Gradient cover banner, verified student checkmark, real-time online status.
  * Metrics bar: Followers count, Following count, Mutual connections, Doubts Solved, Rating (`⭐ 4.95`), XP Points (`⚡ 820 XP`).
  * Tabs: **📋 Overview & Bio**, **📜 Verified Certifications**, **🎓 Education History**, **💼 Projects**, **🏆 Honors & Achievements**, **📱 Concept Shorts**, **⭐ Peer Reviews**.
  * 1-Click Actions: `🤝 Connect / Follow`, `💬 Direct Message`, `📅 Book Live Class`, `⭐ Endorse Skill (+5🪙)`.
* **Pending Requests Tab**: View custom student notes with Instagram-style acceptance celebration dialog.
* **My Connections Tab**: Real-time connected peer network.

### 2. 💬 WhatsApp & Instagram Messenger Suite (`#chat`)
* 2-column layout with real-time active conversations list and peer chat view.
* Double tick read receipts (`✓✓`), audio waveform voice notes, syntax-highlighted code snippet copy buttons, PDF study material cards, and search.
* 1-Click Launchers for 📞 High-Def Audio Call and 🎥 Video Classroom.

### 3. 📱 Reels & Video Shorts Creator Studio (`#reels`)
* **9:16 Vertical Video Shorts Player**: Smooth feed with like counter, heart animations, and slide-in comments drawer.
* **Creator Studio**: Video upload modal with topic tagging (`#Java`, `#Algorithms`, `#WebRTC`, `#SystemDesign`), title, duration, and reach analytics.

### 4. 💡 Live Audio/Video Doubt Rooms (`#doubts`)
* Interactive rooms for instant peer doubt clearing.
* **WebRTC Video Overlay (`RtcCallOverlay`)**: 100% free peer-to-peer audio/video streaming, microphone mute/unmute, camera toggle, and low-latency screen sharing.

### 5. 📚 Live Classroom & Recorded Lectures Archive (`#sessions`)
* **Live Classroom**: Collaborative code editor, live study timer, and peer messaging.
* **Recorded Lectures Archive**: Video player modal with chapter timestamps (`0:00 Intro`, `12:40 Architecture`, `28:15 Code Demo`), post-session notes download, and tutor reviews.

### 6. 👤 Student Profile & Settings Suite (`#profile`)
* Profile cover photo customization, 1-click avatar selector (Male, Female, Neutral).
* Categorized navigation: **Basic Identity**, **Academic Education**, **Certifications (NPTEL, Oracle, AWS)**, **Projects**, **Social & Coding Handles (GitHub, LeetCode, LinkedIn, Codeforces)**, **PDF Resume & ATS Score Analyzer**.

### 7. 🪙 Peer Coin Wallet & Gamification (`#wallet`, `#leaderboard`)
* Peer Coin balance (🪙) & Indian Rupee (₹) earnings ledger.
* Campus Leaderboards with Gold, Silver, and Bronze medals for top peer mentors.

### 8. 🛡️ Security Gate & Admin Console (`#admin`)
* Protected PIN passkey gate for platform administrators.
* User moderation, doubt room oversight, coin ledger audits, and system log monitors.

---

## 🏗️ Modular Architecture & Code Structure

The frontend codebase uses **modular feature-based architecture** with **React.lazy() Code Splitting** for instant load times:

```text
students_connect/frontend/src/
├── constants/
│   ├── avatars.js                 # High-resolution vector SVGs & gender avatar resolver
│   └── testAccounts.js            # Initial campus student datasets & mock profiles
│
├── context/
│   └── AuthContext.jsx            # AuthProvider, useAuth hook, JWT token & profile state
│
├── components/
│   ├── common/
│   │   ├── SidebarLink.jsx        # Navigation links with active badge pill
│   │   └── LoadingFallback.jsx    # Lazy-loading animated skeleton spinner
│   ├── modals/
│   │   ├── PublicProfileModal.jsx # Instagram/LinkedIn public student profile
│   │   ├── UserListModal.jsx      # Followers/Following inspector dialog
│   │   ├── AvatarChangeModal.jsx  # Student avatar selector
│   │   ├── PhotoPreviewModal.jsx  # Enlarged profile lightbox modal
│   │   ├── BookingModal.jsx       # 1:1 Live Class scheduler
│   │   └── ReviewSessionModal.jsx # 5-Star peer rating dialog
│   └── profile/
│       ├── EditIntroModal.jsx     # Headline, college, and bio editor
│       ├── AddEducationModal.jsx  # University / School education entry
│       ├── AddCertificateModal.jsx# NPTEL / Oracle / AWS certificates
│       ├── AddAchievementModal.jsx# SIH / Hackathon / Olympiad achievements
│       ├── AddProjectModal.jsx    # GitHub repos & live demo apps
│       ├── AddSkillModal.jsx      # Academic skill chips
│       ├── ResumeUploadModal.jsx  # Resume uploader
│       └── ResumePreviewModal.jsx # PDF resume viewer & ATS analyzer
│
├── features/
│   ├── landing/LandingScreen.jsx          # Public showcase & authentication modal
│   ├── dashboard/DashboardScreen.jsx      # Student dashboard & feed
│   ├── connections/ConnectionsScreen.jsx  # Campus Network Directory & Member Grid
│   ├── chat/ChatScreen.jsx                # WhatsApp-style 2-column messenger
│   ├── doubts/
│   │   ├── DoubtRoomsScreen.jsx           # Live doubt solver rooms
│   │   └── RtcCallOverlay.jsx             # WebRTC screen sharing & video overlay
│   ├── reels/ReelsScreen.jsx              # 9:16 Shorts player + Creator Studio
│   ├── sessions/
│   │   ├── MySessionsScreen.jsx           # Recorded video lectures archive
│   │   └── LiveClassroomScreen.jsx        # Live classroom with shared editor
│   ├── discover/DiscoverScreen.jsx        # Campus explore & topic discover
│   ├── wallet/WalletScreen.jsx            # Peer Coin wallet & transaction ledger
│   ├── leaderboard/LeaderboardScreen.jsx  # Campus rankings & medal leaderboards
│   ├── settings/SettingsScreen.jsx        # Profile editor & ATS resume optimizer
│   ├── admin/
│   │   ├── AdminConsoleScreen.jsx         # Platform audit & user moderation
│   │   └── AdminGateScreen.jsx            # Admin PIN security gate
│   └── support/
│       ├── ContactSupportScreen.jsx       # Campus operations help desk
│       └── FeedScreen.jsx                 # Campus study stream
│
├── layouts/
│   └── MainLayout.jsx                     # Top bar, sidebar, modal orchestration, route persistence
│
├── App.jsx                                # Root router (~15 lines) with Suspense
├── index.css                              # Design tokens, themes & responsive utilities
└── main.jsx                               # DOM root entry
```

---

## ⚡ Performance Optimization (Code Splitting)

By utilizing `React.lazy()` and dynamic imports, every feature screen is bundled into an independent chunk that downloads only when opened:

| Feature Screen | Chunk Size (Gzipped) |
|---|---|
| **Initial Base Shell** | **~63 kB** *(instant load on 3G/4G)* |
| `ConnectionsScreen.js` | 5.15 kB |
| `ChatScreen.js` | 7.94 kB |
| `ReelsScreen.js` | 6.85 kB |
| `SettingsScreen.js` | 17.35 kB |
| `MySessionsScreen.js` | 4.23 kB |
| `AdminConsoleScreen.js` | 7.26 kB |

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/hemadrikaligiri4-source/students_connect.git
cd students_connect

# Install frontend dependencies
cd frontend
npm install
```

### 3. Running Locally
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
# Compile optimized production bundle
npm run build
```

---

## 🧪 Test Credentials

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **Student (IIT Madras)** | `studenta@student.com` | `password` | Full Platform, Connections, Chat, Doubt Rooms, Video Shorts |
| **Peer Mentor (IIT Madras)** | `studentb@student.com` | `password` | Master Mentor Profile, Live Classes, Earnings Wallet |
| **Apprentice (BITS Pilani)** | `studentc@student.com` | `password` | Circuit Labs, Study Rooms |
| **Super Admin** | `admin@studyloop.app` | PIN: `1337` | Admin Console, Moderation, Coins Ledger, System Logs |

---

## 📄 License
This project is licensed under the MIT License.