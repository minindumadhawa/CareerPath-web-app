import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-breadcrumb">CareerPath /</span>
        <span className="navbar-page-title">
          {isAdmin ? 'Admin Panel' : 'Student Portal'}
        </span>
      </div>
      <div className="navbar-right">
        <div className="role-switch">
          <button
            className={`role-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => navigate('/student/dashboard')}
          >
            👨‍🎓 Student
          </button>
          <button
            className={`role-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => navigate('/admin/dashboard')}
          >
            ⚙️ Admin
          </button>
        </div>
        <div className="user-avatar">AD</div>
      </div>
    </nav>
  );
};

export default Navbar;
