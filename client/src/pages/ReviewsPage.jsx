import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { FileCheck, Plus, Calendar, Save, X } from 'lucide-react';

const ReviewsPage = () => {
  const { showToast } = useNotification();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: 'weekly',
    periodIdentifier: '2026-W40',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    bestHabit: 'Full Stack Coding',
    weakestHabit: 'Sleep On Time',
    whatWentWell: 'Completed React project features and maintained 3 hours coding per day.',
    whatWentWrong: 'Scrolled on phone late at night twice.',
    improvements: 'Put phone outside bedroom by 10:30 PM.',
    mainGoalNextPeriod: 'Complete Node.js Express REST API unit tests and start DSA tree practice.'
  });

  const fetchReviews = async () => {
    try {
      const data = await apiCall('/reviews');
      setReviews(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/reviews', 'POST', formData);
      showToast('Review submitted and saved permanently! 📝', 'success');
      setIsModalOpen(false);
      fetchReviews();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="page-wrapper">Loading Weekly & Monthly Reviews...</div>;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck color="var(--accent-primary)" /> Weekly & Monthly Reviews
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Reflect on progress, evaluate weakest habits, and define goals for upcoming periods.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Submit New Review
        </button>
      </div>

      {/* History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {reviews.map(rev => (
          <div key={rev._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-purple" style={{ textTransform: 'uppercase' }}>
                  {rev.type} Review ({rev.periodIdentifier})
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {new Date(rev.startDate).toLocaleDateString()} — {new Date(rev.endDate).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                <div>Completion: <strong style={{ color: 'var(--success)' }}>{rev.completionRate}%</strong></div>
                <div>Coding: <strong>{rev.codingHours} hrs</strong></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>What went well?</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{rev.whatWentWell || 'N/A'}</p>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>What to improve?</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{rev.improvements || 'N/A'}</p>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>Main Goal Next Period:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{rev.mainGoalNextPeriod || 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Review Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Create Weekly / Monthly Review</h3>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Review Type
                  </label>
                  <select
                    className="select"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="weekly">Weekly Review</option>
                    <option value="monthly">Monthly Review</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Period Identifier
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.periodIdentifier}
                    onChange={e => setFormData({ ...formData, periodIdentifier: e.target.value })}
                    placeholder="2026-W40 or 2026-10"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  What went well?
                </label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={formData.whatWentWell}
                  onChange={e => setFormData({ ...formData, whatWentWell: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  What went wrong / weak areas?
                </label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={formData.whatWentWrong}
                  onChange={e => setFormData({ ...formData, whatWentWrong: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Action plan for next period
                </label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={formData.improvements}
                  onChange={e => setFormData({ ...formData, improvements: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
