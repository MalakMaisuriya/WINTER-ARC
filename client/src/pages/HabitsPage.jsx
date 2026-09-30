import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Plus, Edit2, Trash2, ShieldOff, Check, X, Clock, Bell, Sparkles } from 'lucide-react';

const CATEGORIES = ['MORNING', 'STUDY', 'DEVELOPMENT', 'CAREER', 'HEALTH', 'DIGITAL DISCIPLINE', 'NIGHT', 'CUSTOM'];

const HabitsPage = () => {
  const { showToast } = useNotification();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'CUSTOM',
    targetText: '1 hour',
    preferredTime: '08:00',
    reminderEnabled: false,
    color: '#3b82f6'
  });

  const fetchHabits = async () => {
    try {
      const data = await apiCall('/habits?includeInactive=true');
      setHabits(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const openCreateModal = () => {
    setEditingHabit(null);
    setFormData({
      title: '',
      category: 'CUSTOM',
      targetText: '1 hour',
      preferredTime: '08:00',
      reminderEnabled: false,
      color: '#3b82f6'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setFormData({
      title: habit.title,
      category: habit.category,
      targetText: habit.targetText,
      preferredTime: habit.preferredTime,
      reminderEnabled: habit.reminderEnabled,
      color: habit.color || '#3b82f6'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHabit) {
        await apiCall(`/habits/${editingHabit._id}`, 'PUT', formData);
        showToast('Habit updated successfully!', 'success');
      } else {
        await apiCall('/habits', 'POST', formData);
        showToast('Custom habit added!', 'success');
      }
      setIsModalOpen(false);
      fetchHabits();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDisableHabit = async (habit) => {
    try {
      if (habit.isActive) {
        await apiCall(`/habits/${habit._id}`, 'DELETE');
        showToast(`Disabled ${habit.title}. Historical logs preserved!`, 'info');
      } else {
        await apiCall(`/habits/${habit._id}`, 'PUT', { isActive: true });
        showToast(`Re-activated ${habit.title}!`, 'success');
      }
      fetchHabits();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="page-wrapper">Loading Habits Manager...</div>;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Habit Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Configure default and custom habits. Disabling a habit keeps historical records intact.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Add Custom Habit
        </button>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {CATEGORIES.map(category => {
          const categoryHabits = habits.filter(h => h.category === category);
          if (categoryHabits.length === 0) return null;

          return (
            <div key={category} className="card">
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {category} ({categoryHabits.length})
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {categoryHabits.map(habit => (
                  <div
                    key={habit._id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: habit.isActive ? 'var(--bg-tertiary)' : 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      opacity: habit.isActive ? 1 : 0.6,
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{habit.title}</span>
                          {!habit.isActive && <span className="badge badge-gray">Disabled</span>}
                          {habit.isDefault && <span className="badge badge-blue">Default</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Target: {habit.targetText}
                        </div>
                      </div>

                      <button className="btn btn-ghost" style={{ padding: '0.3rem' }} onClick={() => openEditModal(habit)}>
                        <Edit2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} /> {habit.preferredTime}
                      </span>

                      <button
                        className={`btn ${habit.isActive ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => handleDisableHabit(habit)}
                      >
                        {habit.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Habit Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {editingHabit ? 'Edit Habit' : 'Create Custom Habit'}
              </h3>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Habit Name
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Reading Tech Books"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Category
                  </label>
                  <select
                    className="select"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Target Description
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.targetText}
                    onChange={e => setFormData({ ...formData, targetText: e.target.value })}
                    placeholder="e.g. 30 minutes"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Preferred Time
                </label>
                <input
                  type="time"
                  className="input"
                  value={formData.preferredTime}
                  onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsPage;
