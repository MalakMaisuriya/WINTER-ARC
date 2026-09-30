import React, { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Code2, Plus, CheckCircle, Circle, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

const STATUS_ORDER = ['Not Started', 'Learning', 'Practicing', 'Project Ready', 'Interview Ready'];

const STATUS_BADGE_CLASS = {
  'Not Started': 'badge-gray',
  'Learning': 'badge-blue',
  'Practicing': 'badge-amber',
  'Project Ready': 'badge-purple',
  'Interview Ready': 'badge-green'
};

const DeveloperPage = () => {
  const { showToast } = useNotification();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const fetchSkills = async () => {
    try {
      const data = await apiCall('/developer/skills');
      setSkills(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleStatusChange = async (skillId, newStatus) => {
    try {
      await apiCall(`/developer/skills/${skillId}`, 'PUT', { status: newStatus });
      showToast('Skill status updated!', 'success');
      fetchSkills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicTitle || !selectedSkill) return;

    try {
      await apiCall(`/developer/skills/${selectedSkill._id}/topics`, 'POST', {
        title: newTopicTitle,
        status: 'Learning'
      });
      showToast('Topic added to skill!', 'success');
      setNewTopicTitle('');
      fetchSkills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleTopicPractice = async (skillId, topic) => {
    try {
      await apiCall(`/developer/skills/${skillId}/topics/${topic._id}`, 'PUT', {
        practiceCompleted: !topic.practiceCompleted,
        status: !topic.practiceCompleted ? 'Completed' : 'Practicing'
      });
      fetchSkills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <div className="page-wrapper">Loading Developer Skills Matrix...</div>;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code2 color="var(--accent-primary)" /> DEVELOPER MODE
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Track technical proficiency across core full-stack technologies, DSA, and interview preparedness.
        </p>
      </div>

      {/* Skills Matrix Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {skills.map(skill => (
          <div key={skill._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{skill.skillName}</h3>
                <span className={`badge ${STATUS_BADGE_CLASS[skill.status]}`}>
                  {skill.status}
                </span>
              </div>

              {/* Status Select */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Update Proficiency Status
                </label>
                <select
                  className="select"
                  value={skill.status}
                  onChange={e => handleStatusChange(skill._id, e.target.value)}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                >
                  {STATUS_ORDER.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Topic List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  TOPICS & CONCEPTS ({skill.topics?.length || 0})
                </div>

                {skill.topics && skill.topics.map(topic => (
                  <div
                    key={topic._id}
                    onClick={() => handleToggleTopicPractice(skill._id, topic)}
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
                    {topic.practiceCompleted ? (
                      <CheckCircle size={15} color="var(--success)" />
                    ) : (
                      <Circle size={15} color="var(--text-muted)" />
                    )}
                    <span style={{ textDecoration: topic.practiceCompleted ? 'line-through' : 'none', color: topic.practiceCompleted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {topic.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Topic Input */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <form
                onSubmit={e => {
                  setSelectedSkill(skill);
                  handleAddTopic(e);
                }}
                style={{ display: 'flex', gap: '0.5rem' }}
              >
                <input
                  type="text"
                  className="input"
                  placeholder="Add topic (e.g. Redux Toolkit)"
                  value={selectedSkill?._id === skill._id ? newTopicTitle : ''}
                  onChange={e => {
                    setSelectedSkill(skill);
                    setNewTopicTitle(e.target.value);
                  }}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
                  <Plus size={14} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperPage;
