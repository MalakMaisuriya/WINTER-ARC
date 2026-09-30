import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  Calendar,
  BarChart3,
  Code2,
  FolderGit2,
  Briefcase,
  Target,
  Award,
  FileCheck,
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/today', label: 'Today', icon: CheckSquare },
  { path: '/habits', label: 'Habits', icon: ListTodo },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/developer', label: 'Developer', icon: Code2 },
  { path: '/projects', label: 'Projects', icon: FolderGit2 },
  { path: '/job-ready', label: 'Job Ready', icon: Briefcase },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/achievements', label: 'Achievements', icon: Award },
  { path: '/reviews', label: 'Reviews', icon: FileCheck },
  { path: '/settings', label: 'Settings', icon: Settings }
];

const Sidebar = () => {
  return (
    <aside
      style={{
        width: '230px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem 0.75rem',
        flexShrink: 0
      }}
      className="hidden-mobile"
    >
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '0.75rem', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Navigation
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `btn btn-ghost ${isActive ? 'active-nav-item' : ''}`
              }
              style={({ isActive }) => ({
                justifyContent: 'flex-start',
                padding: '0.65rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                borderRadius: 'var(--radius-sm)'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
