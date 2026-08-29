import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft, Shield, 
  Zap, Award, CheckCircle, Clock, Plus, AlertCircle, CreditCard, Sparkles
} from 'lucide-react';

export function WalletScreen({ token }) {
  const { profile, updateProfileState } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('450');
  const [upiId, setUpiId] = useState('');
  const [customRate, setCustomRate] = useState(profile?.customSessionRate || 50);

  const walletBalance = profile?.walletBalance !== undefined ? profile.walletBalance : 450;
  const lifetimeEarnings = profile?.lifetimeEarnings !== undefined ? profile.lifetimeEarnings : 1850;
  const classesTaught = profile?.classesTaught !== undefined ? profile.classesTaught : 24;
  const tutorTier = profile?.tutorTier || 'certified';

  const transactions = [
    { id: 'tx-1', desc: '1:1 Session: Java OOP Inheritance (Rahul S.)', date: 'Today, 4:30 PM', amount: '+₹45.00', status: 'Completed (10% Fee)', isCredit: true },
    { id: 'tx-2', desc: '1:1 Session: Dynamic Programming State Transition (Sneha R.)', date: 'Yesterday', amount: '+₹54.00', status: 'Completed (10% Fee)', isCredit: true },
    { id: 'tx-3', desc: 'UPI Bank Withdrawal to aarav@okaxis', date: '26 Aug 2026', amount: '-₹500.00', status: 'Settled to Bank Account', isCredit: false },
    { id: 'tx-4', desc: '1:1 Session: Recursion & Binary Trees (Vikram J.)', date: '24 Aug 2026', amount: '+₹45.00', status: 'Completed', isCredit: true }
  ];

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
      alert("Please enter a valid UPI ID (e.g. yourname@oksbi or phonepe)");
      return;
    }
    const amountNum = parseInt(withdrawAmount);
    if (amountNum > walletBalance) {
      alert("Withdrawal amount cannot exceed available balance.");
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Student Earning Wallet & Monetization Hub
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

      {/* 4 STATS CARDS */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            Available Earning Balance
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-color)' }}>
            ₹{walletBalance}.00
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Ready for instant bank transfer
          </div>
        </div>

        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            Lifetime Earnings
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{lifetimeEarnings}.00
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 600, marginTop: '0.25rem' }}>
            ↑ 100% Student Self-Funded
          </div>
        </div>

        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            1:1 Classes Taught
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {classesTaught} Classes
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Verified campus doubt sessions
          </div>
        </div>

        <div className="card-premium">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            Concept Clarity Rating
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning-color)' }}>
            4.9 ⭐
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            96.4% positive student feedback
          </div>
        </div>
      </div>

      {/* TWO COLUMN: MONETIZATION PROGRESSION & PRICING SETTINGS + TRANSACTION HISTORY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* COLUMN 1: MONETIZATION TIER & RATE CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card-premium">
            <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: 'var(--accent-primary)' }} /> Tutor Qualification & Monetization Tier
            </h3>

            {/* 10-Class Rule Progress */}
            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <span>Tier Status: <strong>Certified Peer Tutor</strong></span>
                <span style={{ color: 'var(--success-color)' }}>10/10 Milestone Passed ✓</span>
              </div>
              
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #0066FF 100%)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', margin: '0.75rem 0 0 0' }}>
                🎓 <strong>Rule:</strong> Every student must first complete 10 verified practice/free doubt sessions before unlocking paid classes. You have unlocked paid mentoring!
              </p>
            </div>

            {/* Custom Session Rate Setting */}
            <form onSubmit={handleSaveRate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Set Your Custom Rate Per 30-Minute Session (₹30 – ₹500)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="number" 
                    min="30" 
                    max="500" 
                    className="input" 
                    value={customRate} 
                    onChange={e => setCustomRate(e.target.value)} 
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

          {/* Student Earning Model Info */}
          <div className="card-premium" style={{ backgroundColor: 'rgba(0, 102, 255, 0.04)', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              💡 How Student Earning Works:
            </h4>
            <ul style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.6, margin: 0 }}>
              <li>10 Classes × ₹50 = <strong>₹500</strong></li>
              <li>20 Classes × ₹50 = <strong>₹1,000</strong></li>
              <li>Platform keeps a 10% safety & server infrastructure fee; <strong>90% goes directly to you</strong>.</li>
            </ul>
          </div>

        </div>

        {/* COLUMN 2: TRANSACTION HISTORY & ESCROW LEDGER */}
        <div className="card-premium">
          <h3 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} style={{ color: 'var(--accent-primary)' }} /> Earnings Ledger & Escrow Releases
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{tx.desc}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date} • {tx.status}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: tx.isCredit ? 'var(--success-color)' : 'var(--danger-color)' }}>
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
                <input 
                  type="number" 
                  max={walletBalance} 
                  min="50" 
                  className="input" 
                  value={withdrawAmount} 
                  onChange={e => setWithdrawAmount(e.target.value)} 
                  required 
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Available: ₹{walletBalance}.00
                </div>
              </div>

              <div>
                <label className="label">Enter UPI ID (GooglePay / PhonePe / Paytm)</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. aarav@okhdfcbank or 9876543210@paytm" 
                  value={upiId} 
                  onChange={e => setUpiId(e.target.value)} 
                  required 
                />
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

