const http = require('http');

// Student Token (Aarav Sharma)
const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const studentPayload = Buffer.from(JSON.stringify({ 
  sub: '11111111-1111-1111-1111-111111111111', 
  email: 'studenta@student.com', 
  role: 'authenticated' 
})).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const studentToken = `${header}.${studentPayload}.signature`;

// Admin Token
const adminPayload = Buffer.from(JSON.stringify({ 
  sub: '00000000-0000-0000-0000-000000000000', 
  email: 'admin@student.com', 
  role: 'super_admin' 
})).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const adminToken = `${header}.${adminPayload}.signature`;

const endpoints = [
  { name: 'Health Check', path: '/health', method: 'GET', token: null },
  { name: 'Root Endpoint', path: '/', method: 'GET', token: null },
  { name: 'My Profile', path: '/api/profiles/me', method: 'GET', token: studentToken },
  { name: 'Live Doubt Rooms', path: '/api/doubts/live', method: 'GET', token: studentToken },
  { name: 'My Created Doubts', path: '/api/doubts/my-created', method: 'GET', token: studentToken },
  { name: 'My Helping Doubts', path: '/api/doubts/my-helping', method: 'GET', token: studentToken },
  { name: 'Campus Leaderboard', path: '/api/leaderboard', method: 'GET', token: studentToken },
  { name: 'Discoverable Peers', path: '/api/discovery', method: 'GET', token: studentToken },
  { name: 'Senior Mentors', path: '/api/discovery/mentors', method: 'GET', token: studentToken },
  { name: 'Skill Swap Matches', path: '/api/discovery/skill-swap', method: 'GET', token: studentToken },
  { name: 'Active Connections', path: '/api/connections/active', method: 'GET', token: studentToken },
  { name: 'Pending Requests', path: '/api/connections/requests/pending', method: 'GET', token: studentToken },
  { name: 'Direct Chat Threads', path: '/api/chats/direct/threads', method: 'GET', token: studentToken },
  { name: 'All Reels', path: '/api/reels', method: 'GET', token: studentToken },
  
  // Admin Endpoints
  { name: 'Admin Check Status', path: '/api/admin/check', method: 'GET', token: adminToken },
  { name: 'Admin Platform Analytics', path: '/api/admin/analytics', method: 'GET', token: adminToken },
  { name: 'Admin User Moderation List', path: '/api/admin/users', method: 'GET', token: adminToken },
  { name: 'Admin Doubt Room Oversight', path: '/api/admin/doubts', method: 'GET', token: adminToken },
  { name: 'Gamification Badge Rules', path: '/api/gamification/rules', method: 'GET', token: adminToken },
  { name: 'Admin System Audit Logs', path: '/api/admin/audit-logs', method: 'GET', token: adminToken }
];

function fetchEndpoint(endpoint) {
  return new Promise((resolve) => {
    const headers = {};
    if (endpoint.token) {
      headers['Authorization'] = `Bearer ${endpoint.token}`;
    }

    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: endpoint.path,
      method: endpoint.method,
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          name: endpoint.name,
          path: endpoint.path,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 'ERROR',
        success: false,
        data: err.message
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('--- Testing StudyLoop Student & Admin REST APIs ---');
  let passedCount = 0;
  for (const endpoint of endpoints) {
    const result = await fetchEndpoint(endpoint);
    if (result.success) {
      console.log(`[PASS] ${result.name} (${result.path}) - Status: ${result.status}`);
      passedCount++;
    } else {
      console.log(`[FAIL] ${result.name} (${result.path}) - Status: ${result.status}`);
      console.log(`       Details: ${result.data.substring(0, 150)}`);
    }
  }
  console.log(`--------------------------------------------------`);
  console.log(`Passed: ${passedCount}/${endpoints.length}`);
}

runTests();
