import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Check,
  CheckCheck,
  ChevronLeft,
  Image,
  MessageSquare,
  Paperclip,
  Phone,
  Search,
  Send,
  Trash2,
  User,
  Video,
  X
} from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG } from '../../constants/avatars';

export function ChatScreen({
  token,
  activeChatId,
  setActiveChatId,
  chatPeer,
  setChatPeer,
  socket,
  wsMessages,
  setWsMessages,
  setActiveTab,
  startWebRtcCall
}) {
  const { profile } = useAuth();
  const toast = useToast();
  const messagesEndRef = useRef(null);

  // Simple Contact List
  const [contacts, setContacts] = useState([
    {
      id: 'c-1',
      fullName: 'Bhavna Patel',
      college: 'IIT Madras',
      department: 'CS 4th Year • Java Mentor',
      avatarUrl: FEMALE_AVATAR_SVG,
      status: 'online',
      lastMessage: 'Hey! Are we ready for the DP knapsack live study call?',
      lastTime: '10:45 AM',
      unread: 1
    },
    {
      id: 'c-2',
      fullName: 'Chaitanya Reddy',
      college: 'BITS Pilani',
      department: 'EEE • Circuit & ML Tutor',
      avatarUrl: MALE_AVATAR_SVG,
      status: 'online',
      lastMessage: 'Check out the new doubt posted in Java multithreading.',
      lastTime: 'Yesterday',
      unread: 0
    },
    {
      id: 'c-3',
      fullName: 'Rohan Deshmukh',
      college: 'IIT Bombay',
      department: 'CP Lead • Algorithms',
      avatarUrl: MALE_AVATAR_SVG,
      status: 'offline',
      lastMessage: 'Shared the meeting link for tomorrow evening.',
      lastTime: '2 days ago',
      unread: 0
    },
    {
      id: 'c-4',
      fullName: 'Divya Nambiar',
      college: 'NIT Trichy',
      department: 'Data Science & SQL',
      avatarUrl: FEMALE_AVATAR_SVG,
      status: 'online',
      lastMessage: 'Thanks for explaining the BCNF decomposition proof!',
      lastTime: '3 days ago',
      unread: 0
    }
  ]);

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Message Map per contact ID
  const [chatMessages, setChatMessages] = useState({
    'c-1': [
      { id: 'm1', sender: 'peer', text: 'Hi Aarav! Did you go through the graph cycle detection notes?', time: '10:30 AM' },
      { id: 'm2', sender: 'me', text: 'Yes Bhavna! The Kahn\'s algorithm top-sort explanation was super clear.', time: '10:35 AM' },
      { id: 'm3', sender: 'peer', text: 'Hey! Are we ready for the DP knapsack live study call?', time: '10:45 AM' }
    ],
    'c-2': [
      { id: 'm4', sender: 'peer', text: 'Check out the new doubt posted in Java multithreading.', time: 'Yesterday' }
    ],
    'c-3': [
      { id: 'm5', sender: 'peer', text: 'Shared the meeting link for tomorrow evening.', time: '2 days ago' }
    ],
    'c-4': [
      { id: 'm6', sender: 'peer', text: 'Thanks for explaining the BCNF decomposition proof!', time: '3 days ago' }
    ]
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedContact]);

  // Sync with incoming activeChatId / chatPeer from other screens (e.g. Share link)
  useEffect(() => {
    if (chatPeer) {
      const match = contacts.find(c => c.id === chatPeer.id || c.fullName === chatPeer.fullName);
      if (match) {
        setSelectedContact(match);
      }
    }
  }, [chatPeer, contacts]);

  // Send Message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !selectedContact) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
    }));

    // Update last message in contact list
    setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, lastMessage: inputText.trim(), lastTime: 'Just now' } : c));
    setInputText('');
  };

  // Delete Entire Conversation for Selected Peer
  const handleDeleteEntireChat = () => {
    if (!selectedContact) return;

    setChatMessages(prev => ({
      ...prev,
      [selectedContact.id]: []
    }));

    setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, lastMessage: 'Chat cleared', lastTime: '' } : c));
    setShowDeleteConfirm(false);
    toast.success(`🗑️ Entire chat history with ${selectedContact.fullName} has been deleted.`);
  };

  // Audio Call
  const handleAudioCall = () => {
    if (!selectedContact) return;
    const roomId = `call-${selectedContact.id}-${Date.now().toString().slice(-4)}`;
    if (startWebRtcCall) {
      startWebRtcCall(selectedContact, roomId, `Voice Call with ${selectedContact.fullName}`, 'Audio Discussion');
    }
    toast.success(`📞 Starting Voice Call with ${selectedContact.fullName}...`);
  };

  // Video Call
  const handleVideoCall = () => {
    if (!selectedContact) return;
    const roomId = `call-${selectedContact.id}-${Date.now().toString().slice(-4)}`;
    if (startWebRtcCall) {
      startWebRtcCall(selectedContact, roomId, `Video Call with ${selectedContact.fullName}`, 'Video Mentoring');
    }
    toast.success(`🎥 Starting Video Call with ${selectedContact.fullName}...`);
  };

  const filteredContacts = contacts.filter(c => 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = (selectedContact && chatMessages[selectedContact.id]) || [];

  return (
    <div className="studyloop-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px', height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column' }}>

      {/* ── 2-COLUMN CHAT CONTAINER ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>

        {/* ── LEFT COLUMN: CONTACTS LIST ── */}
        <div style={{
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          {/* Search Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Chats
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {contacts.length} peers
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px',
                  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Contact rows list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map(contact => {
              const isSelected = selectedContact?.id === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  style={{
                    display: 'flex', gap: '10px', alignItems: 'center',
                    padding: '12px 16px', cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--accent-light)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={contact.avatarUrl}
                      alt=""
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: contact.status === 'online' ? '#10b981' : '#94a3b8',
                      border: '2px solid var(--bg-secondary)'
                    }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contact.fullName}
                      </span>
                      <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                        {contact.lastTime}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.lastMessage}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT COLUMN: ACTIVE CONVERSATION ── */}
        {selectedContact ? (
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>

            {/* Chat Top Header: Peer Name + Call & Delete Options */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px', backgroundColor: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={selectedContact.avatarUrl}
                    alt=""
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '9px', height: '9px', borderRadius: '50%',
                    backgroundColor: selectedContact.status === 'online' ? '#10b981' : '#94a3b8',
                    border: '1.5px solid #fff'
                  }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                    {selectedContact.fullName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: selectedContact.status === 'online' ? '#10b981' : 'var(--text-muted)', fontWeight: 600 }}>
                    {selectedContact.status === 'online' ? '🟢 Active Now' : '⚪ Offline'} • {selectedContact.college}
                  </div>
                </div>
              </div>

              {/* Simple Action Buttons: Audio Call, Video Call, Clear Chat */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleAudioCall}
                  title="Audio Call"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                    fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-light)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                >
                  <Phone size={15} style={{ color: '#10b981' }} /> Call
                </button>

                <button
                  onClick={handleVideoCall}
                  title="Video Call"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 12px', borderRadius: '8px', border: 'none',
                    backgroundColor: 'var(--accent-primary)', color: '#ffffff',
                    fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  <Video size={15} /> Video
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete entire chat"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '34px', height: '34px', borderRadius: '8px', border: '1px solid var(--border-color)',
                    backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div style={{
              flex: 1, padding: '20px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              {currentMessages.length > 0 ? (
                currentMessages.map(msg => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: '8px'
                      }}
                    >
                      {!isMe && (
                        <img src={selectedContact.avatarUrl} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', marginBottom: '2px' }} />
                      )}

                      <div
                        style={{
                          maxWidth: '68%',
                          padding: '10px 14px',
                          borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          backgroundColor: isMe ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: isMe ? '#ffffff' : 'var(--text-primary)',
                          border: isMe ? 'none' : '1px solid var(--border-color)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          fontSize: '0.86rem',
                          lineHeight: 1.45
                        }}
                      >
                        <div>{msg.text}</div>
                        <div style={{
                          fontSize: '0.65rem',
                          color: isMe ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
                          textAlign: 'right',
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '3px'
                        }}>
                          {msg.time}
                          {isMe && <CheckCheck size={12} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>No messages yet</div>
                  <div style={{ fontSize: '0.78rem' }}>Send a message to start chatting with {selectedContact.fullName}</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Input Bar */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '14px 20px', backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)', display: 'flex',
                alignItems: 'center', gap: '10px'
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`Message ${selectedContact.fullName}...`}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '999px',
                  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                }}
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                  backgroundColor: inputText.trim() ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: inputText.trim() ? '#ffffff' : 'var(--text-muted)',
                  cursor: inputText.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <Send size={16} />
              </button>
            </form>

          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a peer to start messaging
          </div>
        )}

      </div>

      {/* ── DELETE ENTIRE CHAT CONFIRMATION MODAL ── */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '22px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Delete Entire Conversation?
                </h3>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  This will clear all messages with {selectedContact?.fullName}.
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
              Are you sure you want to delete this entire chat? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEntireChat}
                style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
