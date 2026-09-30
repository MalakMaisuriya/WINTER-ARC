import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Briefcase, Plus, ExternalLink, CheckCircle2, Circle, Edit2, Trash2, X, Building, MapPin } from 'lucide-react';

const READINESS_ITEMS = [
  'Resume Prepared',
  'Portfolio Built',
  'GitHub Profile Active',
  'LinkedIn Optimized',
  '2 Production Projects Built',
  'DSA Array & String Revision',
  'JavaScript Technical Interview',
  'React.js Technical Interview',
  'Node.js & Express API Interview',
  'MongoDB & Database Interview',
  'Mock Interview Completed',
  'Active Job Applications Submitted'
];

const JobReadyPage = () => {
  const { showToast } = useNotification();
  const [applications, setApplications] = useState([]);
  const [readinessState, setReadinessState] = useState(() => {
    const saved = localStorage.getItem('winter_arc_job_readiness');
    return saved ? JSON.parse(saved) : {};
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const [formData, setFormData] = useState({
    company: '',
    role: 'Full Stack Web Developer',
    location: 'Remote / Hybrid',
    status: 'Applied',
    jobUrl: '',
    notes: ''
  });

  const fetchApplications = async () => {
    try {
      const data = await apiCall('/job-applications');
      setApplications(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const toggleReadinessItem = (item) => {
    const updated = { ...readinessState, [item]: !readinessState[item] };
    setReadinessState(updated);
    localStorage.setItem('winter_arc_job_readiness', JSON.stringify(updated));
  };

  const openCreateModal = () => {
    setEditingApp(null);
    setFormData({
      company: '',
      role: 'Full Stack Web Developer',
      location: 'Remote / Hybrid',
      status: 'Applied',
      jobUrl: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      company: app.company,
      role: app.role,
      location: app.location || 'Remote',
      status: app.status,
      jobUrl: app.jobUrl || '',
      notes: app.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApp) {
        await apiCall(`/job-applications/${editingApp._id}`, 'PUT', formData);
        showToast('Application updated!', 'success');
      } else {
        await apiCall('/job-applications', 'POST', formData);
        showToast('Job application added! 💼', 'success');
      }
      setIsModalOpen(false);
      fetchApplications();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete application record?')) return;
    try {
      await apiCall(`/job-applications/${id}`, 'DELETE');
      showToast('Application deleted', 'info');
      fetchApplications();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="page-wrapper">Loading Job Readiness Dashboard...</div>;

  const completedReadinessCount = READINESS_ITEMS.filter(item => readinessState[item]).length;
  const readinessPercent = Math.round((completedReadinessCount / READINESS_ITEMS.length) * 100);

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase color="var(--accent-primary)" /> JOB READY DASHBOARD
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Track career readiness milestones and manage full-stack developer job applications.
        </p>
      </div>

      {/* Career Readiness Checklist */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Full Stack Career Readiness ({readinessPercent}%)</h3>
          <span className="badge badge-blue">{completedReadinessCount} / {READINESS_ITEMS.length} Completed</span>
        </div>

        <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{ width: `${readinessPercent}%`, height: '100%', background: 'var(--success)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.65rem' }}>
          {READINESS_ITEMS.map(item => {
            const isDone = Boolean(readinessState[item]);
            return (
              <div
                key={item}
                onClick={() => toggleReadinessItem(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isDone ? 'var(--success-light)' : 'var(--bg-tertiary)',
                  border: '1px solid',
                  borderColor: isDone ? 'var(--success)' : 'var(--border-color)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                {isDone ? <CheckCircle2 size={18} color="var(--success)" fill="var(--success)" /> : <Circle size={18} color="var(--text-muted)" />}
                <span style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Job Applications Tracker Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Job Applications Tracker</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Never automatically deleted. All historical applications remain permanently stored.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Add Job Application
        </button>
      </div>

      {/* Applications Table / Cards */}
      <div className="card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem' }}>COMPANY</th>
              <th style={{ padding: '0.75rem' }}>ROLE</th>
              <th style={{ padding: '0.75rem' }}>LOCATION</th>
              <th style={{ padding: '0.75rem' }}>DATE</th>
              <th style={{ padding: '0.75rem' }}>STATUS</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>{app.company}</td>
                <td style={{ padding: '0.75rem' }}>{app.role}</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{app.location}</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(app.applicationDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span className={`badge ${app.status === 'Interview' ? 'badge-amber' : app.status === 'Selected' ? 'badge-green' : app.status === 'Applied' ? 'badge-blue' : 'badge-gray'}`}>
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                    {app.jobUrl && (
                      <a href={app.jobUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '0.3rem' }}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button className="btn btn-ghost" style={{ padding: '0.3rem' }} onClick={() => openEditModal(app)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '0.3rem', color: 'var(--danger)' }} onClick={() => handleDelete(app._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {editingApp ? 'Edit Application' : 'Add Job Application'}
              </h3>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Role Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
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
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Job Listing URL
                </label>
                <input
                  type="url"
                  className="input"
                  value={formData.jobUrl}
                  onChange={e => setFormData({ ...formData, jobUrl: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Notes
                </label>
                <textarea
                  className="textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingApp ? 'Save Application' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobReadyPage;
