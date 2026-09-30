import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Save, Code, BookOpen } from 'lucide-react';
import { apiCall } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const FocusTimerModal = ({ isOpen, onClose, onTimerSave }) => {
  const { showToast } = useNotification();
  const [sessionType, setSessionType] = useState('coding'); // 'coding' | 'study'
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  if (!isOpen) return null;

  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const handleSaveSession = async () => {
    if (seconds < 60) {
      showToast('Session is too short to log (must be at least 1 minute).', 'error');
      return;
    }

    const hoursLogged = Number((seconds / 3600).toFixed(2));
    try {
      const checkIn = await apiCall('/checkin');
      const payload = { ...checkIn };
      if (sessionType === 'coding') {
        payload.codingHours = Number(((payload.codingHours || 0) + hoursLogged).toFixed(2));
      } else {
        payload.studyHours = Number(((payload.studyHours || 0) + hoursLogged).toFixed(2));
      }

      await apiCall('/checkin', 'POST', payload);
      showToast(`Logged ${hoursLogged} hours of ${sessionType === 'coding' ? 'Full Stack Coding' : 'BCA Study'}! 🔥`, 'success');
      
      if (onTimerSave) onTimerSave();
      handleReset();
      onClose();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-fade-in" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Focus Session Timer</h3>
          <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Session Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
          <button
            className={`btn ${sessionType === 'coding' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSessionType('coding')}
          >
            <Code size={16} /> Full Stack Coding
          </button>
          <button
            className={`btn ${sessionType === 'study' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSessionType('study')}
          >
            <BookOpen size={16} /> BCA Study
          </button>
        </div>

        {/* Timer Display */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '3.25rem',
            fontWeight: 800,
            color: 'var(--accent-primary)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem 0',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em'
          }}
        >
          {formatTime(seconds)}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
            style={{ minWidth: '110px' }}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>

          <button className="btn btn-secondary" onClick={handleReset}>
            <RotateCcw size={18} /> Reset
          </button>

          <button className="btn btn-success" onClick={handleSaveSession} disabled={seconds < 60}>
            <Save size={18} /> Log Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusTimerModal;
