import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Target, Plus, CheckSquare, Square, Edit2, Trash2, X } from 'lucide-react';

const CATEGORIES = ['Personal', 'Health', 'BCA', 'Development', 'Career', 'Finance', 'Other'];

const GoalsPage = () => {
  const { showToast } = useNotification();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Career',
    status: 'In Progress',
    milestoneInput: 'Complete React revision, Complete Node.js revision, Build 2 projects, Apply to jobs'
  });

  const fetchGoals = async () => {
    try {
      const data = await apiCall('/goals');
      setGoals(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const toggleMilestone = async (goal, milestoneIndex) => {
    const updatedMilestones = [...goal.milestones];
    updatedMilestones[milestoneIndex].isCompleted = !updatedMilestones[milestoneIndex].isCompleted;

    try {
      await apiCall(`/goals/${goal._id}`, 'PUT', {
        milestones: updatedMilestones
      });
      fetchGoals();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      category: 'Career',
      status: 'In Progress',
      milestoneInput: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const milestones = formData.milestoneInput
      .split(',')
      .map(m => m.trim())
      .filter(Boolean)
      .map(t => ({ title: t, isCompleted: false }));

    try {
      if (editingGoal) {
        await apiCall(`/goals/${editingGoal._id}`, 'PUT', {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          status: formData.status
        });
        showToast('Goal updated!', 'success');
      } else {
        await apiCall('/goals', 'POST', {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          status: formData.status,
          milestones
        });
        showToast('Goal created! 🎯', 'success');
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete goal?')) return;
    try {
      await apiCall(`/goals/${id}`, 'DELETE');
      showToast('Goal deleted', 'info');
      fetchGoals();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="page-wrapper">Loading Goals...</div>;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target color="var(--accent-primary)" /> Long-term Goals & Milestones
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Break down ambitious objectives into actionable step-by-step milestones.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Create Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {goals.map(goal => (
          <div key={goal._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{goal.title}</h3>
                <span className={`badge ${goal.status === 'Completed' ? 'badge-green' : 'badge-blue'}`}>
                  {goal.category}
                </span>
              </div>

              {goal.description && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {goal.description}
                </p>
              )}

              {/* Progress Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span>Progress</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{goal.progressPercent}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${goal.progressPercent}%`, height: '100%', background: 'var(--accent-primary)' }} />
                </div>
              </div>

              {/* Milestones list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MILESTONES</div>
                {goal.milestones?.map((m, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleMilestone(goal, idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {m.isCompleted ? <CheckSquare size={16} color="var(--success)" /> : <Square size={16} color="var(--text-muted)" />}
                    <span style={{ textDecoration: m.isCompleted ? 'line-through' : 'none', color: m.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-ghost" style={{ padding: '0.3rem', color: 'var(--danger)' }} onClick={() => handleDelete(goal._id)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Goal Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Create Goal</h3>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Goal Title
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Become Job Ready as Full Stack Developer"
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
                    Status
                  </label>
                  <select
                    className="select"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Description
                </label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Milestones (Comma separated)
                </label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={formData.milestoneInput}
                  onChange={e => setFormData({ ...formData, milestoneInput: e.target.value })}
                  placeholder="Complete React revision, Complete Node revision, Build 2 projects"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
