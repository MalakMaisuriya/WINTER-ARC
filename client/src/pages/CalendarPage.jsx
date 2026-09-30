import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock, FileText, Activity } from 'lucide-react';

const CalendarPage = () => {
  const { showToast } = useNotification();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [historyLogs, setHistoryLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateDetail, setDateDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const fetchMonthHistory = async () => {
    try {
      const firstDay = new Date(year, month, 1).toISOString().substring(0, 10);
      const lastDay = new Date(year, month + 1, 0).toISOString().substring(0, 10);
      const logs = await apiCall(`/habits/history?startDate=${firstDay}&endDate=${lastDay}`);
      setHistoryLogs(logs);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthHistory();
  }, [currentMonth]);

  const openDateDetails = async (dateStr) => {
    setSelectedDate(dateStr);
    try {
      const [habitsRes, checkInRes] = await Promise.all([
        apiCall(`/habits?date=${dateStr}`),
        apiCall(`/checkin?date=${dateStr}`)
      ]);
      setDateDetail({ habits: habitsRes, checkIn: checkInRes });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Calendar generation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  const logsByDate = {};
  historyLogs.forEach(l => {
    if (!logsByDate[l.date]) logsByDate[l.date] = { completed: 0, total: 0 };
    logsByDate[l.date].total += 1;
    if (l.status === 'completed') logsByDate[l.date].completed += 1;
  });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Calendar Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon color="var(--accent-primary)" /> Winter Arc Calendar History
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Access complete historical logs from Day 1. Click any day to view metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handlePrevMonth}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '140px', textAlign: 'center' }}>
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button className="btn btn-secondary" onClick={handleNextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)' }} /> Completed (&gt;80%)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning)' }} /> Partial Day
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger)' }} /> Missed Day
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--bg-tertiary)' }} /> No Data
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="card" style={{ padding: '1rem' }}>
        {/* Day of Week Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {/* Blank spaces for preceding month */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`blank-${i}`} style={{ height: '70px', borderRadius: 'var(--radius-sm)', background: 'transparent' }} />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const logData = logsByDate[dateStr];
            
            let statusColor = 'var(--bg-tertiary)';
            let percent = 0;

            if (logData && logData.total > 0) {
              percent = Math.round((logData.completed / logData.total) * 100);
              if (percent >= 80) statusColor = 'rgba(16, 185, 129, 0.2)';
              else if (percent >= 40) statusColor = 'rgba(245, 158, 11, 0.2)';
              else statusColor = 'rgba(239, 68, 68, 0.2)';
            }

            return (
              <div
                key={dateStr}
                onClick={() => openDateDetails(dateStr)}
                style={{
                  height: '75px',
                  borderRadius: 'var(--radius-sm)',
                  background: statusColor,
                  border: '1px solid var(--border-color)',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{dayNum}</div>
                {logData && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {percent}% ({logData.completed}/{logData.total})
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Inspection Modal */}
      {selectedDate && dateDetail && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Historical Log: {selectedDate}</h3>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setSelectedDate(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Daily CheckIn Metrics */}
              <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  DAY METRICS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div>Mood: <strong>{dateDetail.checkIn?.mood || 'Normal'}</strong></div>
                  <div>Productivity: <strong>{dateDetail.checkIn?.productivity || 0}/10</strong></div>
                  <div>Energy: <strong>{dateDetail.checkIn?.energy || 0}/10</strong></div>
                  <div>Coding: <strong>{dateDetail.checkIn?.codingHours || 0} hrs</strong></div>
                  <div>Study: <strong>{dateDetail.checkIn?.studyHours || 0} hrs</strong></div>
                  <div>Workout: <strong>{dateDetail.checkIn?.workoutMinutes || 0} mins</strong></div>
                </div>
              </div>

              {/* Habit Records */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  HABITS COMPLETED
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {dateDetail.habits.map(h => (
                    <div
                      key={h._id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: h.todayLog?.status === 'completed' ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{h.title}</span>
                      <span className={h.todayLog?.status === 'completed' ? 'badge badge-green' : 'badge badge-red'}>
                        {h.todayLog?.status || 'missed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {dateDetail.checkIn?.accomplishments && (
                <div style={{ fontSize: '0.85rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Accomplishments:</strong> {dateDetail.checkIn.accomplishments}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
