import React, { useState } from 'react';
import { Snowflake, Calendar as CalendarIcon, Target, X } from 'lucide-react';
import { apiCall } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const StartWinterArcModal = ({ isOpen, onClose, currentArc, onSaved }) => {
  const { showToast } = useNotification();
  const [startDate, setStartDate] = useState(
    currentArc?.startDate ? new Date(currentArc.startDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10)
  );
  const [hasEndDate, setHasEndDate] = useState(currentArc?.hasEndDate || false);
  const [endDate, setEndDate] = useState(
    currentArc?.endDate ? new Date(currentArc.endDate).toISOString().substring(0, 10) : ''
  );
  const [goalStatement, setGoalStatement] = useState(
    currentArc?.goalStatement || 'Build the person you want to become.'
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiCall('/winterarc/start', 'POST', {
        startDate,
        hasEndDate,
        endDate: hasEndDate ? endDate : null,
        goalStatement
      });

      showToast(`Winter Arc started! You are on Day ${result.currentDay}. 🔥`, 'success');
      if (onSaved) onSaved(result);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Snowflake color="var(--accent-primary)" size={24} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Start Your Winter Arc</h3>
          </div>
          <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Do you want to start your Winter Arc? Set your official start date and define your core mindset for self-improvement and long-term career growth.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Start Date
            </label>
            <input
              type="date"
              className="input"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={hasEndDate}
                onChange={e => setHasEndDate(e.target.checked)}
              />
              <span>Set Optional End Date (Default: No End Date / Indefinite)</span>
            </label>
          </div>

          {hasEndDate && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                End Date
              </label>
              <input
                type="date"
                className="input"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
              Core Arc Goal Statement
            </label>
            <textarea
              className="textarea"
              rows={2}
              value={goalStatement}
              onChange={e => setGoalStatement(e.target.value)}
              placeholder="Build the person you want to become."
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Confirm & Begin Arc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartWinterArcModal;
