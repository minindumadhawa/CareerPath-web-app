import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const studentLinks = [
    { to: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/student/leadership', icon: '🏆', label: 'Leadership Programs' },
    { to: '/student/technical', icon: '💻', label: 'Technical Resources' },
    { to: '/student/quizzes', icon: '📝', label: 'Skill Tests' },
    { to: '/student/progress', icon: '📊', label: 'My Progress' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/leadership/add', icon: '➕', label: 'Add Leadership Program' },
    { to: '/admin/leadership/manage', icon: '🏆', label: 'Manage Leadership' },
    { to: '/admin/technical/add', icon: '➕', label: 'Add Technical Resource' },
    { to: '/admin/technical/manage', icon: '💻', label: 'Manage Technical' },
    { to: '/admin/quiz/add', icon: '➕', label: 'Add Quiz' },
    { to: '/admin/quiz/manage', icon: '📝', label: 'Manage Quizzes' },
    { to: '/admin/quiz/results', icon: '📈', label: 'Quiz Results' },
    { to: '/admin/enrollments', icon: '👥', label: 'Enrollment Report' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="brand-icon">🎯</div>
          <div>
            <div className="brand-text">CareerPath</div>
            <div className="brand-sub">Career Advice Module</div>
          </div>
        </div>
      </div>
      {isAdmin ? (
        <div className="sidebar-section">
          <div className="sidebar-section-label">Admin Panel</div>
          {adminLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      ) : (
        <div className="sidebar-section">
          <div className="sidebar-section-label">Student Portal</div>
          {studentLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
