import React, { useState, useEffect, useRef } from 'react';
import { Code, ScreenShare, Play, PenTool, Eraser, Trash2, RotateCcw, Sparkles, Terminal, Check, Video, Mic, Volume2 } from 'lucide-react';

// Web Audio API Synthetic Chimes (Zero-dependency audio alerts)
const playChime = (type = 'success') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'run') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // AudioContext not allowed before user gesture or unavailable
  }
};

const CODE_TEMPLATES = {
  java: {
    name: 'Java 17',
    code: `// 🎓 StudyLoop Live 1:1 Collaborative Workspace\n// Topic: Java OOP Polymorphism & Dynamic Dispatch\n\nabstract class PaymentGateway {\n    abstract void processPayment(double amount);\n}\n\nclass UpiPayment extends PaymentGateway {\n    @Override\n    void processPayment(double amount) {\n        System.out.println("Processing ₹" + amount + " via UPI Instant Transfer ⚡");\n    }\n}\n\nclass EscrowPayment extends PaymentGateway {\n    @Override\n    void processPayment(double amount) {\n        System.out.println("Locking ₹" + amount + " in Peer Escrow Vault 🔒");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        PaymentGateway upi = new UpiPayment();\n        PaymentGateway escrow = new EscrowPayment();\n        \n        upi.processPayment(45.00);\n        escrow.processPayment(150.00);\n        System.out.println("[✓] Verified: Runtime Polymorphism working correctly.");\n    }\n}`,
    output: 'Processing ₹45.0 via UPI Instant Transfer ⚡\nLocking ₹150.0 in Peer Escrow Vault 🔒\n[✓] Verified: Runtime Polymorphism working correctly.\n\n[Process exited with status 0 in 0.04s]'
  },
  python: {
    name: 'Python 3.11',
    code: `# 🎓 StudyLoop Live 1:1 Collaborative Workspace\n# Topic: Dynamic Programming (Memoized Fibonacci)\n\ndef fib_memo(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)\n    return memo[n]\n\nif __name__ == "__main__":\n    test_values = [10, 25, 40]\n    for val in test_values:\n        result = fib_memo(val)\n        print(f"fib({val}) = {result:,}")\n    print("\\n[✓] Complexity: O(N) Time, O(N) Space")`,
    output: 'fib(10) = 55\nfib(25) = 75,025\nfib(40) = 102,334,155\n\n[✓] Complexity: O(N) Time, O(N) Space\n[Process exited with status 0 in 0.02s]'
  },
  cpp: {
    name: 'C++ 20',
    code: `// 🎓 StudyLoop Live 1:1 Collaborative Workspace\n// Topic: Binary Search Tree In-Order Traversal\n\n#include <iostream>\n#include <vector>\n\nstruct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nvoid inOrder(TreeNode* root) {\n    if (!root) return;\n    inOrder(root->left);\n    std::cout << root->val << " -> ";\n    inOrder(root->right);\n}\n\nint main() {\n    TreeNode* root = new TreeNode(4);\n    root->left = new TreeNode(2);\n    root->right = new TreeNode(7);\n    root->left->left = new TreeNode(1);\n    root->left->right = new TreeNode(3);\n\n    std::cout << "BST In-Order Traversal: ";\n    inOrder(root);\n    std::cout << "NULL\\n";\n    std::cout << "[✓] BST Property Verified: Elements sorted in ascending order.\\n";\n    return 0;\n}`,
    output: 'BST In-Order Traversal: 1 -> 2 -> 3 -> 4 -> 7 -> NULL\n[✓] BST Property Verified: Elements sorted in ascending order.\n\n[Process exited with status 0 in 0.03s]'
  },
  sql: {
    name: 'PostgreSQL',
    code: `-- 🎓 StudyLoop Live 1:1 Collaborative Workspace\n-- Topic: Indexed Multi-Table Peer Query\n\nSELECT \n    p.full_name AS mentor,\n    p.college,\n    COUNT(d.id) AS doubts_resolved,\n    ROUND(AVG(d.rating), 2) AS avg_rating\nFROM profiles p\nJOIN doubt_rooms d ON d.helper_id = p.id\nWHERE d.status = 'SOLVED'\nGROUP BY p.id, p.full_name, p.college\nHAVING COUNT(d.id) >= 5\nORDER BY avg_rating DESC\nLIMIT 3;`,
    output: 'mentor          | college      | doubts_resolved | avg_rating\n----------------+--------------+-----------------+------------\nBhavna Patel    | IIT Madras   | 24              | 4.95\nChaitanya Reddy | BITS Pilani  | 18              | 4.90\nAarav Sharma    | IIT Madras   | 12              | 4.85\n\n(3 rows selected in 1.4ms)'
  }
};

export function LiveClassroomScreen({ session, onEndClassroom, localVideoRef, remoteVideoRef, toggleScreenShare, isScreenSharing }) {
  // Workspace Mode: 'code' | 'whiteboard'
  const [workspaceMode, setWorkspaceMode] = useState('code');

  // Code state
  const [codeLanguage, setCodeLanguage] = useState('java');
  const [codeContent, setCodeContent] = useState(CODE_TEMPLATES.java.code);
  const [consoleOutput, setConsoleOutput] = useState(CODE_TEMPLATES.java.output);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('Key Takeaway: Child class overrides parent method. Reference type of parent holding child object enables Runtime Polymorphism.');

  // Whiteboard Canvas state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#38bdf8');
  const [brushSize, setBrushSize] = useState(3);
  const [drawTool, setDrawTool] = useState('pen'); // 'pen' | 'eraser'

  // Live elapsed timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const sessionDurationMins = parseInt(session?.duration || '30', 10);
  const totalSecs = sessionDurationMins * 60;
  const isOvertime = secondsElapsed >= totalSecs;

  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalLabel = `${sessionDurationMins.toString().padStart(2, '0')}:00`;

  // Start local camera stream when classroom mounts
  useEffect(() => {
    let stream;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(s => {
        stream = s;
        if (localVideoRef?.current) {
          localVideoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        // Camera/mic permission denied — fallback silently
      });
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Switch starter template when language changes
  const handleLanguageChange = (lang) => {
    setCodeLanguage(lang);
    if (CODE_TEMPLATES[lang]) {
      setCodeContent(CODE_TEMPLATES[lang].code);
      setConsoleOutput(CODE_TEMPLATES[lang].output);
    }
  };

  // Run Code simulation with compilation and execution feedback
  const handleRunCode = () => {
    setIsRunningCode(true);
    playChime('run');
    setConsoleOutput('Compiling and executing code in sandbox environment...');

    setTimeout(() => {
      setIsRunningCode(false);
      playChime('success');

      if (CODE_TEMPLATES[codeLanguage]) {
        // Check if user added custom console outputs
        const code = codeContent.toLowerCase();
        let customOut = '';
        if (code.includes('system.out.println') || code.includes('print(') || code.includes('std::cout')) {
          customOut = CODE_TEMPLATES[codeLanguage].output;
        } else {
          customOut = `[Executed successfully]\nReturn code: 0 (No runtime exceptions)\nExecution time: 0.032s`;
        }
        setConsoleOutput(customOut);
      } else {
        setConsoleOutput(`[Execution finished with exit code 0]`);
      }
    }, 600);
  };

  // Whiteboard Canvas Drawing Logic
  useEffect(() => {
    if (workspaceMode !== 'whiteboard') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to parent bounding rect
    const parent = canvas.parentElement;
    if (parent && canvas.width !== parent.clientWidth) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight - 48; // Leave room for toolbar
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [workspaceMode]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawTool === 'eraser' ? '#0b0f19' : brushColor;
    ctx.lineWidth = drawTool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playChime('run');
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#090d16', color: '#ffffff' }}>

      {/* CLASSROOM HEADER */}
      <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="live-dot"></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Live 1:1 Class: {session?.topic || 'Java OOP Inheritance'}</span>
              <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                ⚡ Active Session
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Tutor: {session?.tutorName || 'Bhavna Patel'} • You (Learner) — Escrow Protected (₹{session?.fee || '45'})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Live Countdown Timer */}
          <span style={{
            backgroundColor: isOvertime ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            color: isOvertime ? '#f87171' : '#60a5fa',
            padding: '0.25rem 0.875rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: `1px solid ${isOvertime ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)'}`,
            fontVariantNumeric: 'tabular-nums',
            minWidth: '130px',
            textAlign: 'center'
          }}>
            ⏱️ {formatTime(secondsElapsed)} / {totalLabel} Mins{isOvertime ? ' ⚠️' : ''}
          </span>

          <button onClick={toggleScreenShare} className={`btn ${isScreenSharing ? 'btn-accent' : 'btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
            <ScreenShare size={14} /> {isScreenSharing ? 'Stop Share' : 'Share Screen'}
          </button>

          <button 
            onClick={() => {
              playChime('success');
              onEndClassroom(session);
            }} 
            className="btn btn-danger" 
            style={{ fontSize: '0.8125rem', padding: '0.375rem 1rem', fontWeight: 800 }}
          >
            Finish Class &amp; Review ⭐
          </button>
        </div>
      </div>

      {/* DUAL WORKSPACE: LEFT (CODE OR WHITEBOARD) | RIGHT (WEBRTC VIDEO & NOTES) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', padding: '1rem', minHeight: 0 }}>

        {/* LEFT WORKSPACE: DUAL-TAB (CODE EDITOR VS CONCEPT WHITEBOARD) */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', border: '1px solid #1e293b', overflow: 'hidden' }}>
          
          {/* WORKSPACE TOOLBAR & TAB SWITCHER */}
          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#182234' }}>
            
            {/* TABS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setWorkspaceMode('code')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: workspaceMode === 'code' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: workspaceMode === 'code' ? '#38bdf8' : '#94a3b8'
                }}
              >
                <Code size={15} /> Live Code Editor
              </button>

              <button
                onClick={() => setWorkspaceMode('whiteboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: workspaceMode === 'whiteboard' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                  color: workspaceMode === 'whiteboard' ? '#f59e0b' : '#94a3b8'
                }}
              >
                <PenTool size={15} /> Concept Whiteboard
              </button>
            </div>

            {/* CONTROLS (MODE SPECIFIC) */}
            {workspaceMode === 'code' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <select
                  value={codeLanguage}
                  onChange={e => handleLanguageChange(e.target.value)}
                  style={{ backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', outline: 'none' }}
                >
                  <option value="java">Java 17 (LTS)</option>
                  <option value="python">Python 3.11</option>
                  <option value="cpp">C++ 20</option>
                  <option value="sql">PostgreSQL</option>
                </select>

                <button
                  onClick={handleRunCode}
                  disabled={isRunningCode}
                  className="btn btn-accent"
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  title="Execute code in interactive sandbox"
                >
                  <Play size={13} fill="#ffffff" /> {isRunningCode ? 'Running...' : 'Run Code ▶'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* TOOL: PEN OR ERASER */}
                <button
                  onClick={() => setDrawTool('pen')}
                  style={{
                    backgroundColor: drawTool === 'pen' ? '#334155' : 'transparent',
                    color: drawTool === 'pen' ? '#38bdf8' : '#94a3b8',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <PenTool size={13} /> Pen
                </button>

                <button
                  onClick={() => setDrawTool('eraser')}
                  style={{
                    backgroundColor: drawTool === 'eraser' ? '#334155' : 'transparent',
                    color: drawTool === 'eraser' ? '#f87171' : '#94a3b8',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Eraser size={13} /> Eraser
                </button>

                {/* COLOR PALETTE */}
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', marginLeft: '0.25rem' }}>
                  {['#38bdf8', '#4ade80', '#fbbf24', '#f87171', '#ffffff'].map(c => (
                    <div
                      key={c}
                      onClick={() => { setBrushColor(c); setDrawTool('pen'); }}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        cursor: 'pointer',
                        border: brushColor === c && drawTool === 'pen' ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)'
                      }}
                      title={`Color: ${c}`}
                    />
                  ))}
                </div>

                {/* CLEAR CANVAS */}
                <button
                  onClick={clearWhiteboard}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginLeft: '0.5rem'
                  }}
                >
                  <Trash2 size={13} /> Clear
                </button>
              </div>
            )}
          </div>

          {/* MAIN CANVAS / EDITOR CONTAINER */}
          {workspaceMode === 'code' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <textarea
                value={codeContent}
                onChange={e => setCodeContent(e.target.value)}
                spellCheck="false"
                style={{
                  flex: 1,
                  backgroundColor: '#090d16',
                  color: '#38bdf8',
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  fontSize: '0.875rem',
                  padding: '1rem',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.6
                }}
              />

              {/* Console output bar */}
              <div style={{ height: '110px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', padding: '0.5rem 1rem', fontFamily: "'Fira Code', monospace", fontSize: '0.75rem', color: '#4ade80', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Terminal size={12} /> Sandbox Terminal Console
                  </div>
                  <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>
                    {isRunningCode ? '● Compiling...' : '● Ready'}
                  </span>
                </div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{consoleOutput}</pre>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#0b0f19' }}>
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{
                  width: '100%',
                  height: '100%',
                  cursor: drawTool === 'eraser' ? 'cell' : 'crosshair',
                  touchAction: 'none'
                }}
              />
              <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', backgroundColor: 'rgba(15, 23, 42, 0.75)', padding: '0.25rem 0.625rem', borderRadius: '4px', fontSize: '0.6875rem', color: '#94a3b8', pointerEvents: 'none' }}>
                🎨 Draw formulas, trees, and system architecture freely
              </div>
            </div>
          )}

        </div>

        {/* RIGHT WORKSPACE: WEBRTC VIDEO FEEDS & NOTES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>

          {/* Peer Video Grids */}
          <div style={{ flex: 1.2, display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.75rem', minHeight: 0 }}>
            {/* Remote (Tutor) video */}
            <div style={{ position: 'relative', backgroundColor: '#162032', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Fallback placeholder when no remote stream */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '2.5rem', opacity: 0.35 }}>👨‍🏫</span>
              </div>
              <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span>👨‍🏫 Tutor: {session?.tutorName || 'Bhavna Patel'}</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              </div>
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'rgba(239,68,68,0.85)', borderRadius: '4px', padding: '0.15rem 0.4rem', fontSize: '0.625rem', fontWeight: 800 }}>
                LIVE
              </div>
            </div>

            {/* Local (You) video — srcObject set by useEffect above */}
            <div style={{ position: 'relative', backgroundColor: '#162032', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #1e293b' }}>
              <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Fallback placeholder */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '2.5rem', opacity: 0.35 }}>🎓</span>
              </div>
              <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                You (Learner)
              </div>
            </div>
          </div>

          {/* Quick Scratchpad Notes */}
          <div style={{ flex: 0.8, backgroundColor: '#111827', borderRadius: 'var(--radius-md)', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.375rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📝 Shared Concept Summary Notes</span>
              <span style={{ fontSize: '0.625rem', color: '#10b981' }}>Auto-saved ✓</span>
            </div>
            <textarea
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              placeholder="Take notes during the explanation..."
              style={{ flex: 1, backgroundColor: '#182234', color: '#ffffff', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.5rem', fontSize: '0.8125rem', resize: 'none' }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
