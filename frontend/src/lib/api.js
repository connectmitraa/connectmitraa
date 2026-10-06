// ============================================================
// StudyLoop — Central API Utility
// All frontend modules use this for REST + WebSocket calls
// ============================================================

// Base URL: empty in dev (Vite proxy), full URL in prod via env
const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Core fetch wrapper with auth token + error handling
 */
export async function apiCall(path, options = {}, token = '') {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = `API error ${res.status}`;
    try {
      const errBody = await res.json();
      errorMessage = errBody.message || errBody.error || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;
  return res.json();
}

/**
 * Multipart upload (for files, images, videos)
 */
export async function apiUpload(path, formData, token = '') {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload error ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Build WebSocket URL for backend chat/room endpoint
 */
export function wsUrl(token) {
  if (import.meta.env.VITE_WS_URL) {
    return `${import.meta.env.VITE_WS_URL}/ws/chat?token=${encodeURIComponent(token)}`;
  }
  if (import.meta.env.VITE_API_URL) {
    const wsBase = import.meta.env.VITE_API_URL.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
    return `${wsBase}/ws/chat?token=${encodeURIComponent(token)}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}/ws/chat?token=${encodeURIComponent(token)}`;
}
export const getWsUrl = wsUrl;

// ─── Grouped API helpers ────────────────────────────────────

export const ProfileAPI = {
  getMe: (token) => apiCall('/api/profiles/me', {}, token),
  update: (token, data) => apiCall('/api/profiles/me', { method: 'PUT', body: JSON.stringify(data) }, token),
  getById: (token, id) => apiCall(`/api/profiles/${id}`, {}, token),
  addEducation: (token, data) => apiCall('/api/profiles/me/education', { method: 'POST', body: JSON.stringify(data) }, token),
  addCertification: (token, data) => apiCall('/api/profiles/me/certifications', { method: 'POST', body: JSON.stringify(data) }, token),
  addProject: (token, data) => apiCall('/api/profiles/me/projects', { method: 'POST', body: JSON.stringify(data) }, token),
  addSkill: (token, skill) => apiCall('/api/profiles/me/skills', { method: 'POST', body: JSON.stringify({ skill }) }, token),
};

export const FeedAPI = {
  getFeed: (token) => apiCall('/api/feed', {}, token),
  like: (token, postId) => apiCall(`/api/feed/${postId}/like`, { method: 'POST' }, token),
  comment: (token, postId, text) => apiCall(`/api/feed/${postId}/comment`, { method: 'POST', body: JSON.stringify({ text }) }, token),
  getExamRadar: (token) => apiCall('/api/feed/exam-radar', {}, token),
};

export const ReelsAPI = {
  getFeed: (token) => apiCall('/api/reels', {}, token),
  getMine: (token) => apiCall('/api/reels', {}, token),
  like: (token, reelId) => apiCall(`/api/reels/${reelId}/like`, { method: 'POST' }, token),
  save: (token, reelId) => apiCall(`/api/reels/${reelId}/save`, { method: 'POST' }, token),
  delete: (token, reelId) => apiCall(`/api/reels/${reelId}`, { method: 'DELETE' }, token),
  upload: (token, data) => apiCall('/api/reels', { method: 'POST', body: JSON.stringify(data) }, token),
  comment: (token, reelId, text) => apiCall(`/api/reels/${reelId}/comment`, { method: 'POST', body: JSON.stringify({ comment: text }) }, token),
  getComments: (token, reelId) => apiCall(`/api/reels/${reelId}/comments`, {}, token),
};

export const ConnectionsAPI = {
  getAll: (token) => apiCall('/api/connections/active', {}, token),
  getPending: (token) => apiCall('/api/connections/requests/pending', {}, token),
  getSent: (token) => apiCall('/api/connections/sent', {}, token).catch(() => []),
  sendRequest: (token, targetId, note = '') => apiCall(`/api/connections/request?receiverId=${targetId}${note ? `&note=${encodeURIComponent(note)}` : ''}`, { method: 'POST' }, token),
  accept: (token, connectionId) => apiCall(`/api/connections/${connectionId}/accept`, { method: 'POST' }, token),
  acceptRequest: (token, connectionId) => apiCall(`/api/connections/${connectionId}/accept`, { method: 'POST' }, token),
  reject: (token, connectionId) => apiCall(`/api/connections/${connectionId}/reject`, { method: 'POST' }, token),
  withdraw: (token, connectionId) => apiCall(`/api/connections/${connectionId}/reject`, { method: 'POST' }, token),
};

export const DiscoverAPI = {
  getRanked: (token) => apiCall('/api/discovery/ranked', {}, token),
  match: (token, subject, skills) => apiCall('/api/peer-matching/match', { method: 'POST', body: JSON.stringify({ subject, skills }) }, token),
};

export const DoubtRoomsAPI = {
  getAll: (token) => apiCall('/api/doubts/live', {}, token),
  create: (token, data) => apiCall('/api/doubts', { method: 'POST', body: JSON.stringify(data) }, token),
  getById: (token, id) => apiCall(`/api/doubts/${id}`, {}, token),
  close: (token, id) => apiCall(`/api/doubts/${id}/close`, { method: 'POST' }, token),
};

export const LeaderboardAPI = {
  getGlobal: (token) => apiCall('/api/leaderboard', {}, token),
  getCampus: (token) => apiCall('/api/leaderboard?filter=campus', {}, token),
};

export const WalletAPI = {
  get: (token) => apiCall('/api/gamification/wallet', {}, token),
  getTransactions: (token) => apiCall('/api/gamification/transactions', {}, token),
  setRate: (token, rate) => apiCall('/api/gamification/rate', { method: 'PUT', body: JSON.stringify({ ratePerSession: rate }) }, token),
  withdraw: (token, upiId, amount) => apiCall('/api/gamification/withdraw', { method: 'POST', body: JSON.stringify({ upiId, amount }) }, token),
};

export const ChatAPI = {
  getContacts: (token) => apiCall('/api/chats/direct/threads', {}, token),
  getMessages: (token, chatId) => apiCall(`/api/chats/direct/${chatId}`, {}, token),
  initDirect: (token, peerId) => apiCall(`/api/chats/direct/init?peerId=${peerId}`, { method: 'POST' }, token),
  getDoubtMessages: (token, roomId) => apiCall(`/api/chats/doubt/${roomId}`, {}, token),
};

export const GamificationAPI = {
  getMyStats: (token) => apiCall('/api/gamification/stats', {}, token),
  claimStreak: (token) => apiCall('/api/gamification/streak/claim', { method: 'POST' }, token),
};

export const SessionsAPI = {
  getHistory: (token) => apiCall('/api/sessions/history', {}, token),
  book: (token, data) => apiCall('/api/sessions/book', { method: 'POST', body: JSON.stringify(data) }, token),
};

export const SupportAPI = {
  submitTicket: (token, data) => apiCall('/api/support/tickets', { method: 'POST', body: JSON.stringify(data) }, token),
  getTickets: (token) => apiCall('/api/support/tickets', {}, token),
};

export const AdminAPI = {
  getUsers: (token) => apiCall('/api/admin/users', {}, token),
  getRooms: (token) => apiCall('/api/admin/rooms', {}, token),
  getReels: (token) => apiCall('/api/admin/reels', {}, token),
  verifyUser: (token, id, verified) => apiCall(`/api/admin/users/${id}/verify`, { method: 'PUT', body: JSON.stringify({ verified }) }, token),
  giftRewards: (token, id) => apiCall(`/api/admin/users/${id}/gift`, { method: 'POST' }, token),
  deleteReel: (token, id) => apiCall(`/api/admin/reels/${id}`, { method: 'DELETE' }, token),
  broadcast: (token, message) => apiCall('/api/admin/broadcast', { method: 'POST', body: JSON.stringify({ message }) }, token),
  getBadges: (token) => apiCall('/api/admin/badges', {}, token),
  createBadge: (token, data) => apiCall('/api/admin/badges', { method: 'POST', body: JSON.stringify(data) }, token),
};
