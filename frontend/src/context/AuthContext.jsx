import React, { createContext, useContext, useState, useEffect } from 'react';
import { TEST_ACCOUNTS } from '../constants/testAccounts';
import { MALE_AVATAR_SVG } from '../constants/avatars';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const testAccounts = TEST_ACCOUNTS;
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('studyloop_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch(e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('studyloop_token') || '');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('studyloop_admin_token') || '');
  const [isAdminMode, setIsAdminMode] = useState(() => {
    try {
      const savedUser = localStorage.getItem('studyloop_user');
      if (savedUser) {
        return JSON.parse(savedUser).role === 'super_admin';
      }
    } catch(e) {}
    return false;
  });
  const [profile, setProfile] = useState(() => {
    try {
      const savedUser = localStorage.getItem('studyloop_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const cached = localStorage.getItem(`studyloop_profile_${u.id}`);
        if (cached) return JSON.parse(cached);
        return TEST_ACCOUNTS.find(acc => acc.id === u.id) || TEST_ACCOUNTS[0];
      }
    } catch(e) {}
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('studyloop_user');
    const savedToken = localStorage.getItem('studyloop_token');
    const savedAdminToken = localStorage.getItem('studyloop_admin_token');

    if (savedAdminToken) {
      setAdminToken(savedAdminToken);
    }

    if (savedUser && savedToken) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        setToken(savedToken);
        const cachedProfile = localStorage.getItem(`studyloop_profile_${u.id}`);
        if (cachedProfile) {
          try {
            setProfile(JSON.parse(cachedProfile));
          } catch(e) {
            setProfile(testAccounts.find(acc => acc.id === u.id) || testAccounts[0]);
          }
        } else {
          setProfile(testAccounts.find(acc => acc.id === u.id) || testAccounts[0]);
        }
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    setLoading(false);
  }, []);

  const loginSimulated = (email) => {
    const matched = testAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase()) || {
      id: `user-${Date.now()}`,
      email: email,
      role: 'authenticated',
      fullName: email.split('@')[0].replace('.', ' '),
      college: 'IIT Madras',
      department: 'Engineering',
      year: 1,
      gender: 'male',
      bio: '🎓 Campus Learner | 🚀 Exploring peer learning on StudyLoop',
      skills: ['General Academics'],
      teachingSkills: ['General Academics'],
      learningGoals: ['Programming'],
      xp: 100,
      level: 1,
      coins: 10,
      followersCount: 0,
      followingCount: 0,
      avatarUrl: MALE_AVATAR_SVG
    };

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: matched.id, email: matched.email, role: matched.role }));
    const mockJwt = `${header}.${payload}.signature`;

    setUser(matched);
    setProfile(matched);
    setToken(mockJwt);
    localStorage.setItem('studyloop_user', JSON.stringify(matched));
    localStorage.setItem('studyloop_token', mockJwt);
    localStorage.setItem(`studyloop_profile_${matched.id}`, JSON.stringify(matched));

    if (matched.role === 'super_admin' || email.toLowerCase() === 'admin@studyloop.app') {
      localStorage.setItem('studyloop_admin_token', mockJwt);
      setAdminToken(mockJwt);
      setIsAdminMode(true);
    }
  };

  const loginAdmin = (email = 'admin@studyloop.app') => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: "00000000-0000-0000-0000-000000000000", email: email, role: "super_admin" }));
    const mockJwt = `${header}.${payload}.signature`;

    const adminAcc = testAccounts.find(acc => acc.role === 'super_admin') || testAccounts[3];
    setUser(adminAcc);
    setProfile(adminAcc);
    setToken(mockJwt);
    setAdminToken(mockJwt);
    setIsAdminMode(true);
    localStorage.setItem('studyloop_user', JSON.stringify(adminAcc));
    localStorage.setItem('studyloop_token', mockJwt);
    localStorage.setItem('studyloop_admin_token', mockJwt);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken('');
    setIsAdminMode(false);
    localStorage.removeItem('studyloop_user');
    localStorage.removeItem('studyloop_token');
    localStorage.removeItem('studyloop_active_tab');
  };

  const updateProfileState = (newProf) => {
    setProfile(newProf);
    if (newProf.id) {
      localStorage.setItem(`studyloop_profile_${newProf.id}`, JSON.stringify(newProf));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      token, 
      loading, 
      loginSimulated, 
      loginAdmin,
      logout, 
      updateProfileState, 
      testAccounts, 
      isMockMode: true,
      isAdminMode,
      setIsAdminMode,
      adminToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
