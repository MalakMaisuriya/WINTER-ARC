import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, Circle, Clock, Flame, Calendar, Plus, Edit2, Play } from 'lucide-react';
import FocusTimerModal from '../components/common/FocusTimerModal';

const CATEGORIES = ['MORNING', 'STUDY', 'DEVELOPMENT', 'CAREER', 'HEALTH', 'DIGITAL DISCIPLINE', 'NIGHT', 'CUSTOM'];

const TodayPage = () => {
  const { showToast } = useNotification();
  const [habits, setHabits] = useState([]);
  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const fetchTodayData = async () => {
    try {
      const [habitsRes, dashRes] = await Promise.all([
        apiCall('/habits'),
        apiCall('/dashboard')
      ]);
      setHabits(habitsRes);
      setDashboardInfo(dashRes);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const handleToggleHabit = async (habit) => {
    const currentStatus = habit.todayLog?.status;
    const newStatus = currentStatus === 'completed' ? 'missed' : 'completed';

    try {
      await apiCall(`/habits/${habit._id}/log`, 'POST', {
        status: newStatus
      });
      fetchTodayData();
      showToast(newStatus === 'completed' ? `Completed ${habit.title}! 🔥` : `Marked ${habit.title} uncompleted`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return <div className="page-wrapper">Loading Today's Work...</div>;
  }

  const completedCount = habits.filter(h => h.todayLog?.status === 'completed').length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'var(--bg-secondary)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              TODAY'S MISSION
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>What do I need to do today?</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="badge badge-amber" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <Flame size={16} fill="#f59e0b" /> {dashboardInfo?.streaks?.currentStreak || 0} Day Streak
            </div>
            <button className="btn btn-primary" onClick={() => setIsTimerOpen(true)}>
              <Play size={16} /> Focus Timer
            </button>
          </div>
        </div>

        {/* Today's Progress Bar */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>Progress: {completedCount} / {totalCount} Habits Done</span>
            <span style={{ color: 'var(--accent-primary)' }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* Habits Categorized */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {CATEGORIES.map(category => {
          const categoryHabits = habits.filter(h => h.category === category);
          if (categoryHabits.length === 0) return null;

          return (
            <div key={category} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                {category}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {categoryHabits.map(habit => {
                  const isCompleted = habit.todayLog?.status === 'completed';
                  return (
                    <div
                      key={habit._id}
                      onClick={() => handleToggleHabit(habit)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isCompleted ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                        border: '1px solid',
                        borderColor: isCompleted ? 'var(--accent-primary)' : 'var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {isCompleted ? (
                          <CheckCircle2 size={22} color="var(--accent-primary)" fill="var(--accent-primary)" />
                        ) : (
                          <Circle size={22} color="var(--text-muted)" />
                        )}
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)'
                            }}
                          >
                            {habit.title}
                          </div>
                          {habit.targetText && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Target: {habit.targetText}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12} /> {habit.preferredTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <FocusTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        onTimerSave={fetchTodayData}
      />
    </div>
  );
};

export default TodayPage;
