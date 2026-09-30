import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { FolderGit2, Plus, GitBranch, ExternalLink, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';

const ProjectsPage = () => {
  const { showToast } = useNotification();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: 'React, Node.js, Express.js, MongoDB',
    status: 'In Progress',
    githubUrl: '',
    liveUrl: '',
    progressPercent: 50,
    notes: ''
  });

  const fetchProjects = async () => {
    try {
      const data = await apiCall('/projects');
      setProjects(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      technologies: 'React, Node.js, Express.js, MongoDB',
      status: 'In Progress',
      githubUrl: '',
      liveUrl: '',
      progressPercent: 50,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      name: proj.name,
      description: proj.description || '',
      technologies: (proj.technologies || []).join(', '),
      status: proj.status,
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      progressPercent: proj.progressPercent || 0,
      notes: proj.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await apiCall(`/projects/${editingProject._id}`, 'PUT', formData);
        showToast('Project updated!', 'success');
      } else {
        await apiCall('/projects', 'POST', formData);
        showToast('New project created!', 'success');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await apiCall(`/projects/${id}`, 'DELETE');
      showToast('Project deleted', 'info');
      fetchProjects();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="page-wrapper">Loading Projects...</div>;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderGit2 color="var(--accent-primary)" /> Project Development Tracker
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Build production-ready web applications to demonstrate full stack mastery.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Create New Project
        </button>
      </div>

      {/* Projects List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {projects.map(proj => (
          <div key={proj._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{proj.name}</h3>
                <span className={`badge ${proj.status === 'Completed' ? 'badge-green' : proj.status === 'In Progress' ? 'badge-blue' : 'badge-amber'}`}>
                  {proj.status}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                {proj.description || 'No description provided.'}
              </p>

              {/* Technologies Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                {(proj.technologies || []).map(tech => (
                  <span key={tech} className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span>Completion</span>
                  <span>{proj.progressPercent}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${proj.progressPercent}%`, height: '100%', background: 'var(--accent-primary)' }} />
                </div>
              </div>
            </div>

            {/* Links & Actions Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                    <GitBranch size={14} /> GitHub
                  </a>
                )}
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button className="btn btn-ghost" style={{ padding: '0.3rem' }} onClick={() => openEditModal(proj)}>
                  <Edit2 size={14} />
                </button>
                <button className="btn btn-ghost" style={{ padding: '0.3rem', color: 'var(--danger)' }} onClick={() => handleDelete(proj._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h3>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Project Name
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Driving School Management System"
                  required
                />
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
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.technologies}
                  onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Status
                  </label>
                  <select
                    className="select"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Progress ({formData.progressPercent}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formData.progressPercent}
                    onChange={e => setFormData({ ...formData, progressPercent: Number(e.target.value) })}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Live URL
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={formData.liveUrl}
                    onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Save Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
