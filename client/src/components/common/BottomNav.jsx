import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  BarChart3,
  Code2,
  Menu,
  X,
  Calendar,
  FolderGit2,
  Briefcase,
  Target,
  Award,
  FileCheck,
  Settings
} from 'lucide-react';

const MAIN_MOBILE_ITEMS = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/today', label: 'Today', icon: CheckSquare },
  { path: '/habits', label: 'Habits', icon: ListTodo },
  { path: '/analytics', label: 'Stats', icon: BarChart3 },
  { path: '/developer', label: 'Dev', icon: Code2 }
];

const MORE_ITEMS = [
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/projects', label: 'Projects', icon: FolderGit2 },
  { path: '/job-ready', label: 'Job Ready', icon: Briefcase },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/achievements', label: 'Achievements', icon: Award },
  { path: '/reviews', label: 'Reviews', icon: FileCheck },
  { path: '/settings', label: 'Settings', icon: Settings }
];

const BottomNav = () => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      {/* More Drawer */}
      {showMoreMenu && (
        <div
          className="modal-backdrop"
          onClick={() => setShowMoreMenu(false)}
          style={{ zIndex: 100 }}
        >
          <div
            className="modal-content animate-fade-in"
            onClick={e => e.stopPropagation()}
            style={{ position: 'fixed', bottom: '70px', left: '12px', right: '12px', width: 'auto', padding: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>More Navigation</span>
              <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setShowMoreMenu(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {MORE_ITEMS.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMoreMenu(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    })}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 90
        }}
        className="mobile-only"
      >
        {MAIN_MOBILE_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.7rem',
                fontWeight: isActive ? 700 : 500
              })}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={() => setShowMoreMenu(prev => !prev)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            color: showMoreMenu ? 'var(--accent-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontWeight: 500
          }}
        >
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};

export default BottomNav;
