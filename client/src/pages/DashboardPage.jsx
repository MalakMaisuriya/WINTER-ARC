import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Code,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
  Play,
  FileEdit,
  ArrowRight,
  Sun
} from 'lucide-react';
import FocusTimerModal from '../components/common/FocusTimerModal';
import DailyCheckInModal from '../components/checkin/DailyCheckInModal';
import StartWinterArcModal from '../components/winterarc/StartWinterArcModal';
import { useNavigate } from 'react-router-dom';

const MOTIVATIONAL_QUOTES = [
  "Consistency beats motivation.",
  "Build before you consume.",
  "Small progress still counts.",
  "Focus on today's work.",
  "Your future self will thank you for today's discipline."
];

const DashboardPage = () => {
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isArcModalOpen, setIsArcModalOpen] = useState(false);

  // Quote of the day selection
  const [quote] = useState(() => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[idx];
  });

  const fetchDashboard = async () => {
    try {
      const res = await apiCall('/dashboard');
      setData(res);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading Winter Arc Dashboard...</div>
      </div>
    );
  }

  const { currentDay, todayProgress, streaks, overall, checkIn, goalStatement } = data || {};

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(17, 24, 39, 0.9) 100%)',
          borderColor: 'var(--border-hover)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                DAY {currentDay}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Winter Arc System</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              WINTER ARC
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
              "{goalStatement || 'Build the person you want to become.'}"
            </p>
          </div>

          <button className="btn btn-secondary" onClick={() => setIsArcModalOpen(true)}>
            <Sparkles size={16} /> Configure Arc
          </button>
        </div>

        {/* Motivational pill */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderLeft: '3px solid var(--accent-primary)',
            padding: '0.6rem 0.85rem',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginTop: '0.5rem'
          }}
        >
          💡 {quote}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* Today's Progress Card */}
        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Today's Progress
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {todayProgress?.completed} / {todayProgress?.total}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {todayProgress?.percent}%
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: `${todayProgress?.percent}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Current Streak
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={28} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {streaks?.currentStreak} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Days</span>
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Longest Streak: <strong style={{ color: 'var(--text-primary)' }}>{streaks?.longestStreak} Days</strong>
          </div>
        </div>

        {/* Overall Completion Card */}
        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Overall Completion
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
            {overall?.completionPercent}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Total Completed Habits: <strong style={{ color: 'var(--text-primary)' }}>{overall?.totalCompletedHabits}</strong>
          </div>
        </div>

        {/* Total Days Completed */}
        <div className="card">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Days Completed
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {overall?.totalDaysCompleted}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Missed Logs: {overall?.totalMissedHabits}
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="card" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--accent-primary)" /> Quick Actions
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/today')}>
            <CheckCircle2 size={16} /> Complete Habits
          </button>
          
          <button className="btn btn-secondary" onClick={() => setIsTimerOpen(true)}>
            <Play size={16} color="var(--accent-primary)" /> Start Focus Timer
          </button>

          <button className="btn btn-primary" onClick={() => setIsCheckInOpen(true)}>
            <FileEdit size={16} /> Daily Check-In
          </button>
        </div>
      </div>

      {/* Two Column Layout: Developer & Job Readiness overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Developer Tracker snippet */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={18} color="var(--accent-primary)" /> Full Stack Skill Matrix
            </div>
            <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => navigate('/developer')}>
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'DSA'].map((skill, idx) => (
              <div
                key={skill}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}
              >
                <span style={{ fontWeight: 600 }}>{skill}</span>
                <span className="badge badge-purple">
                  {idx < 2 ? 'Practicing' : idx < 5 ? 'Learning' : 'Interview Ready'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Check-in Snapshot */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sun size={18} color="#f59e0b" /> Today's Check-In Snapshot
            </div>
            <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => setIsCheckInOpen(true)}>
              Edit <FileEdit size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mood</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'capitalize' }}>
                {checkIn?.mood === 'great' ? '😄 Great' : checkIn?.mood === 'good' ? '🙂 Good' : checkIn?.mood || 'Normal'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Productivity</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {checkIn?.productivity || 7} / 10
              </div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coding Hours</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                {checkIn?.codingHours || 0} hrs
              </div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Study Hours</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                {checkIn?.studyHours || 0} hrs
              </div>
            </div>
          </div>

          {checkIn?.topPriorityTomorrow && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Tomorrow's #1 Priority:</strong> {checkIn.topPriorityTomorrow}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <FocusTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        onTimerSave={fetchDashboard}
      />
      <DailyCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onCheckInSaved={fetchDashboard}
      />
      <StartWinterArcModal
        isOpen={isArcModalOpen}
        onClose={() => setIsArcModalOpen(false)}
        currentArc={{ goalStatement }}
        onSaved={fetchDashboard}
      />
    </div>
  );
};

export default DashboardPage;
