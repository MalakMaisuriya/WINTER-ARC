import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, User, Flame, Snowflake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ currentDay = 1, streakCount = 0 }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header
      style={{
        height: '64px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '1.125rem',
            letterSpacing: '0.05em',
            color: 'var(--text-primary)'
          }}
        >
          <Snowflake size={22} color="var(--accent-primary)" />
          <span>WINTER ARC</span>
        </div>

        <div className="badge badge-blue" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem' }}>
          DAY {currentDay}
        </div>

        {streakCount > 0 && (
          <div className="badge badge-amber" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
            <Flame size={13} fill="#f59e0b" /> {streakCount} Days
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* User Info pill */}
        {user && (
          <div
            onClick={() => navigate('/settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.75rem', lineHeight: '1.2' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>{user.education}</span>
            </div>
          </div>
        )}

        <button
          className="btn btn-ghost"
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
          style={{ padding: '0.5rem', borderRadius: '50%' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          title="Logout"
          style={{ padding: '0.5rem', borderRadius: '50%', color: 'var(--danger)' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
