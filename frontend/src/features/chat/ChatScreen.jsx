import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { BellOff, Calendar, Check, CheckCheck, ChevronLeft, Code, Copy, CornerUpLeft, Download, ExternalLink, FileText, Image, MessageSquare, Mic, MoreVertical, Paperclip, Phone, Play, Search, Send, Smile, Trash2, UserPlus, Video, X } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function ChatScreen({ token, activeChatId, setActiveChatId, chatPeer, setChatPeer, socket, wsMessages, setWsMessages, setActiveTab }) {
  const { profile } = useAuth();
  
  // Persistent or default contacts list
  const [contacts, setContacts] = useState([
    {
      id: 'c-1',
      fullName: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'Computer Science (Yr 3)',
      avatarUrl: FEMALE_AVATAR_SVG,
      status: 'online',
      lastSeen: 'Online',
      lastMessage: 'Yes! Virtual to physical address translation table is ready. Want to jump on a quick call?',
      lastTime: '4:32 PM',
      unread: 0,
      isTyping: false
    },
    {
      id: 'c-2',
      fullName: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'Electrical Eng (Yr 1)',
      avatarUrl: MALE_AVATAR_SVG,
      status: 'online',
      lastSeen: 'Online',
      lastMessage: 'Can you explain Valgrind memory leak output for binary trees?',
      lastTime: '3:15 PM',
      unread: 2,
      isTyping: false
    },
    {
      id: 'c-3',
      fullName: 'Divya Nambiar',
      college: 'NIT Trichy',
      department: 'Data Science (Yr 2)',
      avatarUrl: FEMALE_AVATAR_SVG,
      status: 'offline',
      lastSeen: 'Last seen today at 1:40 PM',
      lastMessage: 'Here is the SQL query for multi-table indexing optimization.',
      lastTime: '1:40 PM',
      unread: 0,
      isTyping: false
    },
    {
      id: 'c-4',
      fullName: 'Rohan Deshmukh',
      college: 'IIT Bombay',
      department: 'Computer Science (Yr 2)',
      avatarUrl: MALE_AVATAR_SVG,
      status: 'online',
      lastSeen: 'Online',
      lastMessage: 'The 0/1 Knapsack memoization table transition was super clear!',
      lastTime: 'Yesterday',
      unread: 0,
      isTyping: false
    },
    {
      id: 'c-5',
      fullName: 'Kavya Subramanian',
      college: 'IIT Delhi',
      department: 'Software Eng (Yr 4)',
      avatarUrl: FEMALE_AVATAR_SVG,
      status: 'offline',
      lastSeen: 'Last seen yesterday at 8:15 PM',
      lastMessage: 'Let\'s schedule our system design peer session for tomorrow.',
      lastTime: 'Yesterday',
      unread: 0,
      isTyping: false
    }
  ]);

  // Active contact selection
  const [selectedContactId, setSelectedContactId] = useState(() => {
    if (chatPeer?.id) return `c-${chatPeer.id.replace('c-', '')}`;
    return localStorage.getItem('studyloop_active_chat_contact') || 'c-1';
  });

  useEffect(() => {
    if (chatPeer?.id) {
      const matchId = `c-${chatPeer.id.replace('c-', '')}`;
      setSelectedContactId(matchId);
      // Ensure peer is in contacts
      setContacts(prev => {
        if (!prev.some(c => c.id === matchId)) {
          return [{
            id: matchId,
            fullName: chatPeer.fullName || 'Peer Tutor',
            college: chatPeer.college || 'IIT Madras',
            department: chatPeer.department || 'Computer Science',
            avatarUrl: chatPeer.avatarUrl || FEMALE_AVATAR_SVG,
            status: 'online',
            lastSeen: 'Online',
            lastMessage: 'Started new study discussion.',
            lastTime: 'Just now',
            unread: 0,
            isTyping: false
          }, ...prev];
        }
        return prev;
      });
    }
  }, [chatPeer]);

  useEffect(() => {
    if (selectedContactId) {
      localStorage.setItem('studyloop_active_chat_contact', selectedContactId);
    }
  }, [selectedContactId]);

  const activeContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  // Conversation history by contact
  const [chatHistories, setChatHistories] = useState({
    'c-1': [
      { id: 'm-1', sender: 'Bhavna Patel', text: 'Hey Aarav! Did you get a chance to check that OS memory paging question from assignment 3?', time: '4:28 PM', status: 'read', type: 'text' },
      { id: 'm-2', sender: 'Aarav Sharma', text: 'Yes! Virtual to physical address translation table is ready. Want to jump on a quick call?', time: '4:30 PM', status: 'read', type: 'text' },
      { id: 'm-3', sender: 'Aarav Sharma', text: '// Page Table Translation Formula\nint pageNumber = logicalAddress / PAGE_SIZE;\nint offset = logicalAddress % PAGE_SIZE;\nint physicalAddress = (frameTable[pageNumber] * PAGE_SIZE) + offset;', time: '4:31 PM', status: 'read', type: 'code', codeLang: 'java' },
      { id: 'm-4', sender: 'Bhavna Patel', text: 'That snippet is so clean! Let\'s test with 4KB page size.', time: '4:32 PM', status: 'read', type: 'text' }
    ],
    'c-2': [
      { id: 'm-21', sender: 'Chaitanya Reddy', text: 'Hey Aarav, can you explain Valgrind memory leak output for binary trees?', time: '3:12 PM', status: 'read', type: 'text' },
      { id: 'm-22', sender: 'Chaitanya Reddy', text: 'I am getting "definitely lost: 32 bytes in 1 blocks" on post-order traversal deletion.', time: '3:15 PM', status: 'read', type: 'text' }
    ],
    'c-3': [
      { id: 'm-31', sender: 'Divya Nambiar', text: 'Here is the SQL query for multi-table indexing optimization.', time: '1:40 PM', status: 'read', type: 'text' }
    ],
    'c-4': [
      { id: 'm-41', sender: 'Rohan Deshmukh', text: 'The 0/1 Knapsack memoization table transition was super clear!', time: 'Yesterday', status: 'read', type: 'text' }
    ],
    'c-5': [
      { id: 'm-51', sender: 'Kavya Subramanian', text: 'Let\'s schedule our system design peer session for tomorrow.', time: 'Yesterday', status: 'read', type: 'text' }
    ]
  });

  const activeMessages = chatHistories[activeContact?.id] || [];

  const [inputText, setInputText] = useState('');
  const [searchContactFilter, setSearchContactFilter] = useState('');
  const [chatCategoryFilter, setChatCategoryFilter] = useState('all'); // all, unread, mentors
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [searchInChatQuery, setSearchInChatQuery] = useState('');
  const [showSearchInChat, setShowSearchInChat] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [activeMessageActionId, setActiveMessageActionId] = useState(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [callSimulationModal, setCallSimulationModal] = useState(null); // 'audio', 'video'
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  useEffect(() => {
    let timer;
    if (isRecordingAudio) {
      timer = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingAudio]);

  const handleSendMessage = (textToSend = inputText, type = 'text', extraData = {}) => {
    const text = textToSend.trim();
    if (!text && type === 'text') return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'Aarav Sharma',
      text,
      time: currentTime,
      status: 'sent',
      type,
      replyTo: replyingTo ? { sender: replyingTo.sender, text: replyingTo.text } : null,
      ...extraData
    };

    setChatHistories(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg]
    }));

    // Update contacts list preview
    setContacts(prev => prev.map(c => c.id === activeContact.id ? { ...c, lastMessage: type === 'code' ? '💻 Shared Code Snippet' : (type === 'file' ? `📄 ${extraData.fileName || 'Shared Document'}` : text), lastTime: currentTime } : c));

    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowAttachMenu(false);

    // Simulate peer typing & auto-response
    setTimeout(() => {
      setContacts(prev => prev.map(c => c.id === activeContact.id ? { ...c, isTyping: true } : c));
      
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const autoReplies = [
          "Got it! That makes total sense.",
          "Awesome explanation, thank you! 👍",
          "Understood! Let's solve the next edge case together 🚀",
          "Super helpful breakdown! Reviewing this right now."
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        
        const peerReply = {
          id: `m-${Date.now() + 1}`,
          sender: activeContact.fullName,
          text: randomReply,
          time: replyTime,
          status: 'read',
          type: 'text'
        };

        setChatHistories(prev => ({
          ...prev,
          [activeContact.id]: [...(prev[activeContact.id] || []), peerReply]
        }));

        setContacts(prev => prev.map(c => c.id === activeContact.id ? { ...c, isTyping: false, lastMessage: randomReply, lastTime: replyTime } : c));
      }, 1500);
    }, 800);
  };

  const handleDeleteMessage = (msgId, forEveryone = false) => {
    setChatHistories(prev => ({
      ...prev,
      [activeContact.id]: prev[activeContact.id].filter(m => m.id !== msgId)
    }));
    setActiveMessageActionId(null);
  };

  const handleClearChat = () => {
    if (confirm(`Clear all messages with ${activeContact.fullName}?`)) {
      setChatHistories(prev => ({
        ...prev,
        [activeContact.id]: []
      }));
      setShowChatSettings(false);
    }
  };

  const handleSendVoiceNote = () => {
    setIsRecordingAudio(false);
    handleSendMessage(`🎙️ Voice Message (${recordingSeconds}s)`, 'voice', { duration: `${recordingSeconds}s` });
  };

  const handleShareCodeSnippet = () => {
    const sampleCode = `// Quick Java Solution for ${activeContact.fullName}\npublic static int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`;
    handleSendMessage(sampleCode, 'code', { codeLang: 'java' });
  };

  const handleShareStudyNotes = () => {
    handleSendMessage('Operating Systems Memory Management Complete Notes (Paging, TLB, Virtual Memory)', 'file', { fileName: 'OS_Paging_Virtual_Memory_Notes.pdf', fileSize: '2.4 MB' });
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchContactFilter.toLowerCase()) || c.college.toLowerCase().includes(searchContactFilter.toLowerCase()) || c.department.toLowerCase().includes(searchContactFilter.toLowerCase());
    if (chatCategoryFilter === 'unread') return matchesSearch && c.unread > 0;
    if (chatCategoryFilter === 'online') return matchesSearch && c.status === 'online';
    return matchesSearch;
  });

  const displayedMessages = activeMessages.filter(m => {
    if (!searchInChatQuery.trim()) return true;
    return m.text.toLowerCase().includes(searchInChatQuery.toLowerCase());
  });

  const EMOJI_LIST = ['👍', '🔥', '💡', '🚀', '💻', '🎓', '✅', '❤️', '👏', '🙌', '💯', '☕', '🧠', '✨'];

  return (
    <div style={{ padding: '1.25rem 2rem 2.5rem 2rem', width: '100%', maxWidth: '1440px', margin: '0 auto', height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 2-COLUMN WHATSAPP & INSTAGRAM MESSENGER CONTAINER */}
      <div className="card-premium" style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr', padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* LEFT COLUMN: CHATS & CONTACTS LIST (WHATSAPP WEB STYLE) */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
          
          {/* Header & Status Pill */}
          <div style={{ padding: '1.25rem 1.25rem 0.875rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <h2 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Direct Messages</h2>
                <div style={{ fontSize: '0.6875rem', color: 'var(--success-color)', fontWeight: 700 }}>● Instant Live Peer Chat</div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('connections')} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontWeight: 700 }}
              title="Find New Peers on Campus"
            >
              <UserPlus size={13} /> Add
            </button>
          </div>

          {/* Search Contacts */}
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.45rem 0.875rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search chats or peers..." 
                value={searchContactFilter} 
                onChange={e => setSearchContactFilter(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8125rem', width: '100%', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Quick Filter Pills */}
            <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.625rem' }}>
              {['all', 'unread', 'online'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setChatCategoryFilter(cat)}
                  style={{
                    padding: '0.2rem 0.625rem',
                    borderRadius: 'var(--radius-full)',
                    border: chatCategoryFilter === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: chatCategoryFilter === cat ? 'var(--accent-light)' : 'transparent',
                    color: chatCategoryFilter === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {cat === 'all' ? 'All Chats' : (cat === 'unread' ? 'Unread (2)' : 'Online Now')}
                </button>
              ))}
            </div>
          </div>

          {/* Contacts Scrollable Stream */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map(c => {
              const isSelected = c.id === activeContact?.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedContactId(c.id);
                    setContacts(prev => prev.map(item => item.id === c.id ? { ...item, unread: 0 } : item));
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.875rem 1.25rem',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--accent-light)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {/* Avatar + Online Dot */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img 
                      src={c.avatarUrl} 
                      alt={c.fullName} 
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '11px',
                      height: '11px',
                      borderRadius: '50%',
                      backgroundColor: c.status === 'online' ? '#10b981' : '#94a3b8',
                      border: '2px solid var(--bg-secondary)'
                    }}></div>
                  </div>

                  {/* Contact Info & Preview */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.fullName}
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                        {c.lastTime}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: c.isTyping ? '#10b981' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '190px', fontStyle: c.isTyping ? 'italic' : 'normal' }}>
                        {c.isTyping ? 'typing...' : c.lastMessage}
                      </div>
                      {c.unread > 0 && (
                        <span style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', fontSize: '0.625rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: WHATSAPP / INSTAGRAM ACTIVE CHAT ROOM */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)', position: 'relative' }}>
          
          {/* Active Chat Header */}
          <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ position: 'relative' }}>
                <img src={activeContact.avatarUrl} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: activeContact.status === 'online' ? '#10b981' : '#94a3b8', border: '2px solid var(--bg-card)' }}></div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {activeContact.fullName}
                  <span className="tag tag-accent" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem' }}>Verified Peer</span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: activeContact.status === 'online' ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>
                  {activeContact.isTyping ? 'typing...' : activeContact.lastSeen} • {activeContact.college}
                </div>
              </div>
            </div>

            {/* Actions: Audio Call, 1-Click Video Classroom, Search in Chat, Settings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setCallSimulationModal('audio')} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                title="Start Audio Doubt Call"
              >
                <Phone size={14} style={{ color: 'var(--success-color)' }} /> Audio
              </button>

              <button 
                onClick={() => setActiveTab('doubts')} 
                className="btn btn-accent" 
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800 }}
                title="Enter Live WebRTC Video Doubt Room"
              >
                <Video size={14} /> Video Call 🚀
              </button>

              <button 
                onClick={() => setShowSearchInChat(!showSearchInChat)} 
                className="btn-icon" 
                style={{ width: '34px', height: '34px', borderRadius: '50%' }}
                title="Search in this conversation"
              >
                <Search size={15} />
              </button>

              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowChatSettings(!showChatSettings)} 
                  className="btn-icon" 
                  style={{ width: '34px', height: '34px', borderRadius: '50%' }}
                >
                  <MoreVertical size={15} />
                </button>

                {/* Dropdown Options Menu */}
                {showChatSettings && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    width: '200px',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <button onClick={() => { alert("🔔 Notifications muted for this chat."); setShowChatSettings(false); }} className="dropdown-item">
                      <BellOff size={14} /> Mute Notifications
                    </button>
                    <button onClick={handleClearChat} className="dropdown-item" style={{ color: 'var(--danger-color)' }}>
                      <Trash2 size={14} /> Clear Messages
                    </button>
                    <button onClick={() => { alert(`Exported conversation transcript with ${activeContact.fullName} as .txt`); setShowChatSettings(false); }} className="dropdown-item">
                      <Download size={14} /> Export Transcript
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Inside Chat Drawer */}
          {showSearchInChat && (
            <div style={{ padding: '0.5rem 1.5rem', backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Find message in chat..." 
                value={searchInChatQuery} 
                onChange={e => setSearchInChatQuery(e.target.value)} 
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8125rem', color: 'var(--text-primary)' }} 
              />
              {searchInChatQuery && (
                <button onClick={() => setSearchInChatQuery('')} className="btn-icon" style={{ padding: '0.2rem' }}>
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          {/* Message Stream (WhatsApp Bubbles) */}
          <div style={{
            flex: 1,
            padding: '1.25rem 1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            background: 'var(--bg-card)'
          }}>
            
            {/* Encryption & Safety Watermark */}
            <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>
              <span style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.6875rem', padding: '0.3rem 0.875rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                🔒 End-to-End Academic Doubt Session • StudyLoop Safety Guaranteed
              </span>
            </div>

            {displayedMessages.map(msg => {
              const isMe = msg.sender === 'Aarav Sharma' || msg.sender === 'You';
              return (
                <div 
                  key={msg.id} 
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  onMouseEnter={() => setActiveMessageActionId(msg.id)}
                  onMouseLeave={() => setActiveMessageActionId(null)}
                >
                  
                  {/* Message Bubble Container */}
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: isMe ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: isMe ? '#ffffff' : 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    border: isMe ? 'none' : '1px solid var(--border-color)',
                    position: 'relative'
                  }}>
                    
                    {/* Reply Quoted Preview */}
                    {msg.replyTo && (
                      <div style={{
                        padding: '0.35rem 0.625rem',
                        marginBottom: '0.5rem',
                        backgroundColor: isMe ? 'rgba(0,0,0,0.2)' : 'var(--bg-secondary)',
                        borderLeft: `3px solid ${isMe ? '#ffffff' : 'var(--accent-primary)'}`,
                        borderRadius: '4px',
                        fontSize: '0.6875rem'
                      }}>
                        <strong style={{ display: 'block', marginBottom: '0.1rem' }}>{msg.replyTo.sender}</strong>
                        <span style={{ opacity: 0.85 }}>{msg.replyTo.text}</span>
                      </div>
                    )}

                    {/* Message Body by Type */}
                    {msg.type === 'code' ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.6875rem', color: isMe ? '#dbeafe' : 'var(--text-muted)', fontWeight: 700 }}>
                          <span>💻 {msg.codeLang?.toUpperCase() || 'CODE'} SNIPPET</span>
                          <button 
                            onClick={() => { navigator.clipboard?.writeText(msg.text); alert("Code snippet copied!"); }} 
                            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem' }}
                          >
                            <Copy size={11} /> Copy
                          </button>
                        </div>
                        <pre style={{
                          backgroundColor: '#090d16',
                          color: '#38bdf8',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          fontFamily: "'Fira Code', monospace",
                          fontSize: '0.75rem',
                          overflowX: 'auto',
                          margin: 0,
                          lineHeight: 1.5
                        }}>
                          {msg.text}
                        </pre>
                      </div>
                    ) : msg.type === 'file' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: isMe ? 'rgba(0,0,0,0.2)' : 'var(--bg-secondary)', padding: '0.625rem 0.875rem', borderRadius: '8px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--accent-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{msg.fileName || 'Study_Document.pdf'}</div>
                          <div style={{ fontSize: '0.6875rem', opacity: 0.8 }}>{msg.fileSize || '1.8 MB'} • Study Notes</div>
                        </div>
                        <button onClick={() => alert(`Downloading ${msg.fileName}...`)} className="btn-icon" style={{ color: 'inherit' }}>
                          <Download size={15} />
                        </button>
                      </div>
                    ) : msg.type === 'voice' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '180px' }}>
                        <button onClick={() => alert("Playing simulated voice note...")} className="btn-icon" style={{ backgroundColor: isMe ? '#ffffff' : 'var(--accent-primary)', color: isMe ? 'var(--accent-primary)' : '#ffffff', width: '32px', height: '32px', borderRadius: '50%' }}>
                          <Play size={14} />
                        </button>
                        <div style={{ flex: 1, height: '4px', backgroundColor: isMe ? 'rgba(255,255,255,0.4)' : 'var(--border-color)', borderRadius: '2px' }}>
                          <div style={{ width: '45%', height: '100%', backgroundColor: isMe ? '#ffffff' : 'var(--accent-primary)', borderRadius: '2px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700 }}>{msg.duration || '0:14'}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.875rem', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {msg.text}
                      </div>
                    )}

                    {/* Timestamp & Double Tick Indicator */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.25rem',
                      marginTop: '0.25rem',
                      fontSize: '0.625rem',
                      color: isMe ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)'
                    }}>
                      <span>{msg.time}</span>
                      {isMe && (
                        <span title="Read receipt" style={{ color: '#67e8f9', fontWeight: 800 }}>
                          ✓✓
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Hover Floating Action Bar (Reply, Copy, Delete) */}
                  {activeMessageActionId === msg.id && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: isMe ? '0' : 'auto',
                      left: isMe ? 'auto' : '0',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.2rem 0.5rem',
                      boxShadow: 'var(--shadow-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      zIndex: 10
                    }}>
                      <button onClick={() => setReplyingTo(msg)} title="Reply" className="btn-icon" style={{ padding: '0.2rem' }}>
                        <CornerUpLeft size={12} />
                      </button>
                      <button onClick={() => { navigator.clipboard?.writeText(msg.text); alert("Message copied!"); }} title="Copy" className="btn-icon" style={{ padding: '0.2rem' }}>
                        <Copy size={12} />
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.id)} title="Delete" className="btn-icon" style={{ padding: '0.2rem', color: 'var(--danger-color)' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Replying Quote Bar */}
          {replyingTo && (
            <div style={{ padding: '0.5rem 1.5rem', backgroundColor: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '0.625rem', fontSize: '0.75rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Replying to {replyingTo.sender}</span>
                <div style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>{replyingTo.text}</div>
              </div>
              <button onClick={() => setReplyingTo(null)} className="btn-icon"><X size={14} /></button>
            </div>
          )}

          {/* Emoji Popover */}
          {showEmojiPicker && (
            <div style={{
              position: 'absolute',
              bottom: '75px',
              left: '1.5rem',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              padding: '0.75rem',
              zIndex: 300,
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.5rem'
            }}>
              {EMOJI_LIST.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => { setInputText(prev => prev + emoji); setShowEmojiPicker(false); }}
                  style={{ fontSize: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Attach Menu Popover */}
          {showAttachMenu && (
            <div style={{
              position: 'absolute',
              bottom: '75px',
              left: '3.5rem',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              padding: '0.625rem',
              zIndex: 300,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              width: '220px'
            }}>
              <button onClick={handleShareCodeSnippet} className="dropdown-item" style={{ fontSize: '0.8125rem' }}>
                <Code size={16} style={{ color: '#38bdf8' }} /> Share Code Snippet
              </button>
              <button onClick={handleShareStudyNotes} className="dropdown-item" style={{ fontSize: '0.8125rem' }}>
                <FileText size={16} style={{ color: '#10b981' }} /> Send Notes PDF
              </button>
              <button onClick={() => { handleSendMessage('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80', 'file', { fileName: 'Algorithm_Complexity_Graph.png' }); setShowAttachMenu(false); }} className="dropdown-item" style={{ fontSize: '0.8125rem' }}>
                <Image size={16} style={{ color: '#f59e0b' }} /> Share Diagram Image
              </button>
            </div>
          )}

          {/* Bottom WhatsApp Input Bar */}
          <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            
            {/* Emoji Button */}
            <button 
              type="button" 
              onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachMenu(false); }} 
              className="btn-icon" 
              title="Add Emoji"
              style={{ color: showEmojiPicker ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              <Smile size={19} />
            </button>

            {/* Attach Button */}
            <button 
              type="button" 
              onClick={() => { setShowAttachMenu(!showAttachMenu); setShowEmojiPicker(false); }} 
              className="btn-icon" 
              title="Attach Code / Notes / Media"
              style={{ color: showAttachMenu ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              <Paperclip size={19} />
            </button>

            {/* Text Input / Voice Note Recording Bar */}
            {isRecordingAudio ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)', fontWeight: 700, fontSize: '0.8125rem' }}>
                  <span className="live-dot" style={{ backgroundColor: 'var(--danger-color)' }}></span>
                  Recording Voice Note... ({recordingSeconds}s)
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setIsRecordingAudio(false)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>Cancel</button>
                  <button onClick={handleSendVoiceNote} className="btn btn-accent" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: 'var(--success-color)' }}>Send Voice</button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ flex: 1, display: 'flex', gap: '0.625rem' }}>
                <input 
                  type="text" 
                  className="input" 
                  placeholder={`Message ${activeContact.fullName} (Enter to send)...`} 
                  value={inputText} 
                  onChange={e => setInputText(e.target.value)} 
                  style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
                />
                
                {inputText.trim() ? (
                  <button type="submit" className="btn btn-accent" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Send size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setIsRecordingAudio(true)} 
                    className="btn btn-secondary" 
                    title="Record Voice Note"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Mic size={17} />
                  </button>
                )}
              </form>
            )}

          </div>

        </div>

      </div>

      {/* AUDIO CALL SIMULATION MODAL */}
      {callSimulationModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', textAlign: 'center', borderRadius: '24px', backgroundColor: 'var(--bg-elevated)' }}>
            <img src={activeContact.avatarUrl} alt="Peer" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #10b981', objectFit: 'cover', margin: '0 auto 1.25rem auto' }} />
            <h3 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>{activeContact.fullName}</h3>
            <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 700, marginBottom: '1.5rem' }}>
              📞 Live Doubt Audio Call Connected (00:34)
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => setCallSimulationModal(null)} className="btn btn-danger" style={{ borderRadius: 'var(--radius-full)', padding: '0.625rem 1.5rem', fontWeight: 800 }}>
                End Call 🔴
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

