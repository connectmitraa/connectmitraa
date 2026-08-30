import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Clock, CreditCard, History, Shield, X, Zap } from 'lucide-react';

export function WalletScreen({ token }) {
  const { profile, updateProfileState } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('450');
  const [upiId, setUpiId] = useState('');
  const [customRate, setCustomRate] = useState(profile?.customSessionRate || 50);

  const walletBalance = profile?.walletBalance !== undefined ? profile.walletBalance : 450;
  const lifetimeEarnings = profile?.lifetimeEarnings !== undefined ? profile.lifetimeEarnings : 1850;
  const classesTaught = profile?.classesTaught !== undefined ? profile.classesTaught : 24;

  const [transactions, setTransactions] = useState([
    { id: 'tx-1', desc: '1:1 Session: Java OOP Inheritance (Rahul S.)', date: 'Today, 4:30 PM', amount: '+₹45.00', status: 'Completed (10% Fee)', isCredit: true },
    { id: 'tx-2', desc: '1:1 Session: Dynamic Programming State Transition (Sneha R.)', date: 'Yesterday', amount: '+₹54.00', status: 'Completed (10% Fee)', isCredit: true },
    { id: 'tx-3', desc: 'UPI Bank Withdrawal to aarav@okaxis', date: '26 Aug 2026', amount: '-₹500.00', status: 'Settled to Bank Account', isCredit: false },
    { id: 'tx-4', desc: '1:1 Session: Recursion & Binary Trees (Vikram J.)', date: '24 Aug 2026', amount: '+₹45.00', status: 'Completed', isCredit: true }
  ]);
  const [pendingEscrow, setPendingEscrow] = useState(135);
  const [escrowFlash, setEscrowFlash] = useState(null);

  // ── Live escrow release every 30s ──
  const SESSION_TEMPLATES = [
    { student: 'Priya M.', topic: 'OS Virtual Memory Paging', amount: 45 },
    { student: 'Arjun K.', topic: 'SQL Transaction Isolation Levels', amount: 54 },
    { student: 'Nandini R.', topic: 'React Context API Optimization', amount: 63 },
    { student: 'Meera S.', topic: 'Python Async/Await Patterns', amount: 72 },
  ];
  const escrowIdxRef = React.useRef(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const tpl = SESSION_TEMPLATES[escrowIdxRef.current % SESSION_TEMPLATES.length];
      escrowIdxRef.current++;
      const credit = tpl.amount;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newTx = {
        id: `tx-live-${Date.now()}`,
        desc: `1:1 Session: ${tpl.topic} (${tpl.student}) — Escrow Released`,
        date: `Today, ${timeStr}`,
        amount: `+₹${credit}.00`,
        status: 'Escrow Released ✅',
        isCredit: true,
        isNew: true
      };
      setTransactions(prev => [newTx, ...prev]);
      setPendingEscrow(prev => Math.max(0, prev - credit));
      if (profile) {
        updateProfileState({ ...profile, walletBalance: (profile.walletBalance ?? 450) + credit });
      }
      setEscrowFlash({ amount: credit, student: tpl.student });
      setTimeout(() => setEscrowFlash(null), 5000);
    }, 30000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveRate = (e) => {
    e.preventDefault();
    if (profile) {
      updateProfileState({ ...profile, customSessionRate: parseInt(customRate) });
    }
    alert(`🎉 Your session rate updated to ₹${customRate} / 30 mins!`);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!upiId.trim()) {
      alert('Please enter a valid UPI ID (e.g. yourname@oksbi or phonepe)');
      return;
    }
    const amountNum = parseInt(withdrawAmount);
    if (amountNum > walletBalance) {
      alert('Withdrawal amount cannot exceed available balance.');
      return;
    }
    if (profile) {
      updateProfileState({ ...profile, walletBalance: walletBalance - amountNum });
    }
    alert(`💸 Payout of ₹${amountNum} initiated successfully to ${upiId}! Funds will reflect in your bank in 1-2 hours.`);
    setShowWithdrawModal(false);
  };

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Student Earning Wallet &amp; Monetization Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Earn money by teaching concepts you excel at. Track completed sessions, adjust rates, and withdraw to UPI.
          </p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="btn btn-accent"
          style={{ padding: '0.75rem 1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--success-color)' }}
        >
          <CreditCard size={18} /> Withdraw to UPI (₹{walletBalance})
        </button>
      </div>

      {/* Live escrow release flash */}
      {escrowFlash && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)', padding: '0.875rem 1.25rem', marginBottom: '1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'dropdown-animate 0.4s ease'
        }}>
          <CheckCircle size={20} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--success-color)' }}>
              💰 +₹{escrowFlash.amount} credited to your wallet!
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Escrow released — {escrowFlash.student} confirmed session clarity ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
      )}

      {/* Pending Escrow Banner */}
      {pendingEscrow > 0 && (
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-md)', padding: '0.625rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          <Clock size={16} style={{ color: 'var(--warning-color)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--warning-color)' }}>₹{pendingEscrow} in Pending Escrow</strong> — held until students confirm session clarity.
          </span>
        </div>
      )}

      {/* 4 STATS CARDS */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Available Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-color)' }}>₹{walletBalance}.00</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Ready for instant bank transfer</div>
        </div>
        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Lifetime Earnings</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{lifetimeEarnings}.00</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600, marginTop: '0.25rem' }}>↑ 100% Student Self-Funded</div>
        </div>
        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>1:1 Classes Taught</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{classesTaught} Classes</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Verified campus doubt sessions</div>
        </div>
        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Concept Clarity Rating</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning-color)' }}>4.9 ⭐</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>96.4% positive student feedback</div>
        </div>
      </div>

      {/* TWO COLUMN: MONETIZATION + TRANSACTION HISTORY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* COLUMN 1: TIER & RATE CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-premium">
            <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: 'var(--accent-primary)' }} /> Tutor Qualification &amp; Monetization Tier
            </h3>

            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <span>Tier Status: <strong>Certified Peer Tutor</strong></span>
                <span style={{ color: 'var(--success-color)' }}>10/10 Milestone Passed ✓</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #0066FF 100%)', borderRadius: 'var(--radius-full)' }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', margin: '0.75rem 0 0 0' }}>
                🎓 <strong>Rule:</strong> Every student must first complete 10 verified practice/free doubt sessions before unlocking paid classes. You have unlocked paid mentoring!
              </p>
            </div>

            <form onSubmit={handleSaveRate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Set Your Custom Rate Per 30-Minute Session (₹30 – ₹500)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="number" min="30" max="500" className="input"
                    value={customRate} onChange={e => setCustomRate(e.target.value)}
                    style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', maxWidth: '140px' }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>₹ / 30-minute 1:1 class</span>
                </div>
              </div>
              <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem' }}>
                Save Session Rate 💾
              </button>
            </form>
          </div>

          <div className="card-premium" style={{ backgroundColor: 'rgba(0, 102, 255, 0.04)', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              💡 How Student Earning Works:
            </h4>
            <ul style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.6, margin: 0 }}>
              <li>10 Classes × ₹50 = <strong>₹500</strong></li>
              <li>20 Classes × ₹50 = <strong>₹1,000</strong></li>
              <li>Platform keeps a 10% safety &amp; server infrastructure fee; <strong>90% goes directly to you</strong>.</li>
            </ul>
          </div>
        </div>

        {/* COLUMN 2: LIVE TRANSACTION HISTORY */}
        <div className="card-premium">
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={20} style={{ color: 'var(--accent-primary)' }} /> Earnings Ledger
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse-ring 1.5s infinite' }} />
              Live
            </div>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxHeight: '400px', overflowY: 'auto' }}>
            {transactions.map(tx => (
              <div
                key={tx.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.875rem', borderRadius: 'var(--radius-md)',
                  backgroundColor: tx.isNew ? 'rgba(16,185,129,0.06)' : 'var(--bg-tertiary)',
                  border: tx.isNew ? '1px solid rgba(16,185,129,0.25)' : '1px solid transparent',
                  animation: tx.isNew ? 'dropdown-animate 0.4s ease' : undefined
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.desc}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{tx.date} • {tx.status}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: tx.isCredit ? 'var(--success-color)' : 'var(--danger-color)', flexShrink: 0 }}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* WITHDRAWAL TO UPI MODAL */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(6px)' }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '460px', padding: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-elevated)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', margin: 0 }}>Instant UPI Bank Payout</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Withdrawal Amount (₹)</label>
                <input type="number" max={walletBalance} min="50" className="input" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} required />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Available: ₹{walletBalance}.00</div>
              </div>
              <div>
                <label className="label">Enter UPI ID (GooglePay / PhonePe / Paytm)</label>
                <input type="text" className="input" placeholder="e.g. aarav@okhdfcbank or 9876543210@paytm" value={upiId} onChange={e => setUpiId(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-accent" style={{ padding: '0.75rem', fontWeight: 800, backgroundColor: 'var(--success-color)' }}>
                Transfer ₹{withdrawAmount} to UPI Now 💸
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
