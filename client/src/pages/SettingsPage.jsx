import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Settings, User, Lock, Download, Upload, Trash2, ShieldAlert, Check, X, Save } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useNotification();

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Malak Maisuriya',
    education: user?.education || 'BCA Semester 5',
    career: user?.career || 'Full Stack Web Developer',
    currentStatus: user?.currentStatus || 'Student / Fresher / Looking for Job',
    bio: user?.bio || ''
  });

  // Password Form
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });

  // Settings
  const [streakThreshold, setStreakThreshold] = useState(80);

  // Security Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // Import Backup
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiCall('/user/settings');
        if (res.streakThresholdPercent) setStreakThreshold(res.streakThresholdPercent);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/user/password', 'PUT', passwords);
      showToast('Password changed successfully!', 'success');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await apiCall('/user/settings', 'PUT', { streakThresholdPercent: streakThreshold });
      showToast('Streak threshold settings saved!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleExportJson = () => {
    window.open('/api/export/json', '_blank');
  };

  const handleExportCsv = () => {
    window.open('/api/export/csv', '_blank');
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      await apiCall('/export/import', 'POST', { backupData: parsed });
      showToast('Winter Arc backup imported successfully!', 'success');
      setIsImportModalOpen(false);
    } catch (err) {
      showToast('Invalid JSON backup file or import error.', 'error');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/export/account', 'DELETE', {
        password: deletePassword,
        confirmationText: deleteConfirmationText
      });
      showToast('Account permanently deleted.', 'info');
      logout();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings color="var(--accent-primary)" /> System Settings & Data Management
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Manage your personal profile, security credentials, backup exports, and system settings.
        </p>
      </div>

      {/* 1. User Profile Settings */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="var(--accent-primary)" /> Personal Account Profile
        </h3>

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                className="input"
                value={profileData.name}
                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                Education Status
              </label>
              <input
                type="text"
                className="input"
                value={profileData.education}
                onChange={e => setProfileData({ ...profileData, education: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                Career Goal
              </label>
              <input
                type="text"
                className="input"
                value={profileData.career}
                onChange={e => setProfileData({ ...profileData, career: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                Current Employment / Student Status
              </label>
              <input
                type="text"
                className="input"
                value={profileData.currentStatus}
                onChange={e => setProfileData({ ...profileData, currentStatus: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
              Bio / Personal Statement
            </label>
            <textarea
              className="textarea"
              rows={2}
              value={profileData.bio}
              onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. Password & Security */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={18} color="var(--accent-primary)" /> Password & Security
        </h3>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
              Current Password
            </label>
            <input
              type="password"
              className="input"
              value={passwords.currentPassword}
              onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
              New Password
            </label>
            <input
              type="password"
              className="input"
              value={passwords.newPassword}
              onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button type="submit" className="btn btn-secondary">
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* 3. Streak Config */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Streak & Successful Day Criterion
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Define the completion percentage required for a day to count towards your streak. (Default: 80%)
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '400px' }}>
          <input
            type="range"
            min={50}
            max={100}
            step={5}
            value={streakThreshold}
            onChange={e => setStreakThreshold(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontWeight: 800, minWidth: '45px' }}>{streakThreshold}%</span>
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            Save
          </button>
        </div>
      </div>

      {/* 4. Backup Export & Import */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} color="var(--accent-primary)" /> Data Backup & Export
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Download a complete offline JSON backup of your Winter Arc history, habits, check-ins, projects, and goals.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleExportJson}>
            <Download size={16} /> Export Complete JSON Backup
          </button>
          <button className="btn btn-secondary" onClick={handleExportCsv}>
            <Download size={16} /> Export Progress CSV
          </button>
          <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)}>
            <Upload size={16} /> Import Backup
          </button>
        </div>
      </div>

      {/* 5. Danger Zone / Delete Account */}
      <div className="card" style={{ borderColor: 'var(--danger-light)', background: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--danger)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} /> Danger Zone: Permanent Account Deletion
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Permanently delete your user account and erase all associated Winter Arc records. This action cannot be undone.
        </p>

        <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
          <Trash2 size={16} /> Delete My Winter Arc Account
        </button>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Import Backup Data</h3>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setIsImportModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Paste Winter Arc JSON Backup Content
                </label>
                <textarea
                  className="textarea"
                  rows={6}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder='{"app": "WINTER ARC", ...}'
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsImportModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Import Backup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-fade-in" style={{ borderColor: 'var(--danger)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--danger)' }}>
                Confirm Account Deletion
              </h3>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setIsDeleteModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              This will permanently delete your Winter Arc account and all associated habit logs, daily check-ins, projects, and goals.
            </p>

            <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Type <span style={{ color: 'var(--danger)' }}>"DELETE MY WINTER ARC"</span> to confirm
                </label>
                <input
                  type="text"
                  className="input"
                  value={deleteConfirmationText}
                  onChange={e => setDeleteConfirmationText(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                  Verify Your Password
                </label>
                <input
                  type="password"
                  className="input"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={deleteConfirmationText !== 'DELETE MY WINTER ARC' || !deletePassword}
                >
                  Permanently Delete Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
