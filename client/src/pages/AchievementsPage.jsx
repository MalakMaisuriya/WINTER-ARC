import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Award, Flame, Code, BookOpen, Dumbbell, Rocket, Briefcase, Target, Lock } from 'lucide-react';

const ICON_MAP = {
  Flame,
  Code,
  BookOpen,
  Dumbbell,
  Rocket,
  Briefcase,
  Target
};

const AchievementsPage = () => {
  const { showToast } = useNotification();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await apiCall('/achievements');
        setAchievements(res);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (loading) return <div className="page-wrapper">Loading Achievements & Badges...</div>;

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award color="#f59e0b" /> Achievements & Milestone Badges
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Badges are automatically unlocked based on verifiable database logs.
            </p>
          </div>
          <span className="badge badge-amber" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {achievements.map(badge => {
          const IconComponent = ICON_MAP[badge.icon] || Flame;
          return (
            <div
              key={badge.badgeKey}
              className="card"
              style={{
                opacity: badge.isUnlocked ? 1 : 0.5,
                background: badge.isUnlocked ? 'var(--bg-card)' : 'rgba(0,0,0,0.3)',
                borderColor: badge.isUnlocked ? 'var(--border-hover)' : 'var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.5rem 1rem',
                gap: '0.75rem',
                position: 'relative'
              }}
            >
              {!badge.isUnlocked && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--text-muted)' }}>
                  <Lock size={16} />
                </div>
              )}

              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: badge.isUnlocked ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconComponent size={28} color={badge.isUnlocked ? '#f59e0b' : 'var(--text-muted)'} />
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{badge.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {badge.description}
                </p>
              </div>

              {badge.isUnlocked && (
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                  Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;
