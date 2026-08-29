import React, { useState } from 'react';
import { Award, Trophy, Medal, Flame, Star, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { getDefaultAvatarByGender, MALE_AVATAR_SVG, FEMALE_AVATAR_SVG, NEUTRAL_AVATAR_SVG } from '../../constants/avatars';

export function LeaderboardScreen({ token, onOpenPublicProfile }) {
  const leaders = [
    { rank: 1, name: 'Aarav Sharma', college: 'IIT Madras', xp: 650, doubtsSolved: 15, level: 4, avatar: MALE_AVATAR_SVG },
    { rank: 2, name: 'Bhavna Patel', college: 'IIT Madras', xp: 820, doubtsSolved: 18, level: 5, avatar: FEMALE_AVATAR_SVG },
    { rank: 3, name: 'Chaitanya Reddy', college: 'BITS Pilani', xp: 340, doubtsSolved: 8, level: 2, avatar: MALE_AVATAR_SVG }
  ];

  return (
    <div style={{ padding: '1.5rem 2.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Campus Leaderboard</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Top peer tutors and students ranked by academic doubt resolution and XP points.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th>University</th>
            <th>Doubts Solved</th>
            <th>Level</th>
            <th>XP Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map(l => (
            <tr key={l.rank}>
              <td><strong>#{l.rank}</strong></td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={l.avatar} alt="Av" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontWeight: 700 }}>{l.name}</span>
                </div>
              </td>
              <td>{l.college}</td>
              <td>{l.doubtsSolved} Solved</td>
              <td><span className="tag tag-accent">Lvl {l.level}</span></td>
              <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>⚡ {l.xp} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

