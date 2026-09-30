import React, { useState, useEffect } from 'react';
import { X, Smile, Zap, TrendingUp, Moon, Code, BookOpen, Dumbbell, Smartphone, Save } from 'lucide-react';
import { apiCall } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const MOOD_OPTIONS = [
  { value: 'great', label: '😄 Great' },
  { value: 'good', label: '🙂 Good' },
  { value: 'normal', label: '😐 Normal' },
  { value: 'low', label: '😔 Low' }
];

const DailyCheckInModal = ({ isOpen, onClose, dateStr, onCheckInSaved }) => {
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    mood: 'good',
    energy: 7,
    productivity: 7,
    sleepHours: 7,
    codingHours: 0,
    studyHours: 0,
    workoutMinutes: 30,
    screenTime: 90,
    accomplishments: '',
    improvements: '',
    topPriorityTomorrow: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCheckIn = async () => {
        try {
          const data = await apiCall(`/checkin?date=${dateStr || ''}`);
          if (data) {
            setFormData({
              mood: data.mood || 'good',
              energy: data.energy || 7,
              productivity: data.productivity || 7,
              sleepHours: data.sleepHours || 7,
              codingHours: data.codingHours || 0,
              studyHours: data.studyHours || 0,
              workoutMinutes: data.workoutMinutes || 0,
              screenTime: data.screenTime || 0,
              accomplishments: data.accomplishments || '',
              improvements: data.improvements || '',
              topPriorityTomorrow: data.topPriorityTomorrow || ''
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchCheckIn();
    }
  }, [isOpen, dateStr]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saved = await apiCall('/checkin', 'POST', {
        ...formData,
        date: dateStr
      });
      showToast('Daily Check-In saved permanently! 🔥', 'success');
      if (onCheckInSaved) onCheckInSaved(saved);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Daily Review & Check-In</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dateStr || 'Today'}</p>
          </div>
          <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Mood selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              How was your day? (Mood)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {MOOD_OPTIONS.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setFormData({ ...formData, mood: opt.value })}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: formData.mood === opt.value ? 'var(--accent-primary)' : 'var(--border-color)',
                    background: formData.mood === opt.value ? 'var(--accent-light)' : 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy & Productivity Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                ⚡ Energy Level ({formData.energy}/10)
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={formData.energy}
                onChange={e => setFormData({ ...formData, energy: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                📈 Productivity ({formData.productivity}/10)
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={formData.productivity}
                onChange={e => setFormData({ ...formData, productivity: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                😴 Sleep (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                className="input"
                value={formData.sleepHours}
                onChange={e => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                💻 Coding (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                className="input"
                value={formData.codingHours}
                onChange={e => setFormData({ ...formData, codingHours: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                📚 Study (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                className="input"
                value={formData.studyHours}
                onChange={e => setFormData({ ...formData, studyHours: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                🏃 Workout (Mins)
              </label>
              <input
                type="number"
                step="5"
                className="input"
                value={formData.workoutMinutes}
                onChange={e => setFormData({ ...formData, workoutMinutes: Number(e.target.value) })}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                📱 Screen Time (Total Mins)
              </label>
              <input
                type="number"
                step="5"
                className="input"
                value={formData.screenTime}
                onChange={e => setFormData({ ...formData, screenTime: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Reflections */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
              What did I accomplish today?
            </label>
            <textarea
              className="textarea"
              rows={2}
              value={formData.accomplishments}
              onChange={e => setFormData({ ...formData, accomplishments: e.target.value })}
              placeholder="Built project features, revised Node.js..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
              What could I improve tomorrow?
            </label>
            <textarea
              className="textarea"
              rows={2}
              value={formData.improvements}
              onChange={e => setFormData({ ...formData, improvements: e.target.value })}
              placeholder="Reduce phone distraction, start morning walk earlier..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
              What is tomorrow's #1 priority?
            </label>
            <input
              type="text"
              className="input"
              value={formData.topPriorityTomorrow}
              onChange={e => setFormData({ ...formData, topPriorityTomorrow: e.target.value })}
              placeholder="Complete DSA tree algorithms & push React code to GitHub"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save Check-In'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyCheckInModal;
