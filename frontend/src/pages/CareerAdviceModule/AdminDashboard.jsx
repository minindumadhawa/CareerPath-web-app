import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ leadership: 0, technical: 0, quizzes: 0, results: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [l, t, q, r] = await Promise.all([
          axios.get('/api/leadership/admin/all'),
          axios.get('/api/technical/admin/all'),
          axios.get('/api/quiz/admin/all'),
          axios.get('/api/quiz/results'),
        ]);
        setStats({ leadership: l.data.count, technical: t.data.count, quizzes: q.data.count, results: r.data.count });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { title: 'Leadership Programs', value: stats.leadership, icon: '🏆', bg: '#e8f0fe', color: '#1a56db', path: '/admin/leadership/manage' },
    { title: 'Technical Resources', value: stats.technical, icon: '💻', bg: '#cffafe', color: '#06b6d4', path: '/admin/technical/manage' },
    { title: 'Total Quizzes', value: stats.quizzes, icon: '📝', bg: '#ede9fe', color: '#8b5cf6', path: '/admin/quiz/manage' },
    { title: 'Quiz Submissions', value: stats.results, icon: '📊', bg: '#d1fae5', color: '#10b981', path: '/admin/quiz/results' },
  ];

  const quickActions = [
    { icon: '➕', label: 'Add Leadership Program', path: '/admin/leadership/add', color: 'var(--primary)' },
    { icon: '➕', label: 'Add Technical Resource', path: '/admin/technical/add', color: 'var(--accent)' },
    { icon: '➕', label: 'Create Quiz', path: '/admin/quiz/add', color: '#8b5cf6' },
    { icon: '📊', label: 'View Quiz Results', path: '/admin/quiz/results', color: 'var(--success)' },
  ];

  return (
    <div className="page-container fade-in">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        borderRadius: 'var(--radius-lg)', padding: '28px 36px', color: 'white', marginBottom: 28
      }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>⚙️ Admin Dashboard</h1>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          Career Advice Management System — Manage all content from here
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map(s => (
              <div key={s.title} className="stat-card" style={{ cursor: 'pointer', background: s.bg }} onClick={() => navigate(s.path)}>
                <div className="stat-icon" style={{ background: s.color, color: 'white', fontSize: '1.4rem' }}>{s.icon}</div>
                <div className="stat-info">
                  <h3 style={{ color: s.color }}>{s.value}</h3>
                  <p style={{ fontWeight: 600, color: 'var(--dark-2)' }}>{s.title}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: 3 }}>Click to manage →</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ marginTop: 28 }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1rem', margin: 0 }}>⚡ Quick Actions</h3>
            </div>
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {quickActions.map(a => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  style={{
                    padding: '20px 16px', borderRadius: 'var(--radius)', border: `2px solid ${a.color}20`,
                    background: `${a.color}10`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${a.color}20`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{a.icon}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: a.color }}>{a.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Module Links */}
          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1rem', margin: 0 }}>📋 Management Sections</h3>
            </div>
            <div style={{ padding: '12px 0' }}>
              {[
                { label: 'Manage Leadership Programs', desc: 'Edit, activate or delete leadership programs', icon: '🏆', path: '/admin/leadership/manage' },
                { label: 'Manage Technical Resources', desc: 'Edit or remove technical learning resources', icon: '💻', path: '/admin/technical/manage' },
                { label: 'Manage Quizzes', desc: 'View and delete skill assessment quizzes', icon: '📝', path: '/admin/quiz/manage' },
                { label: 'Quiz Submissions & Results', desc: 'Track student quiz performance and scores', icon: '📈', path: '/admin/quiz/results' },
              ].map(item => (
                <div
                  key={item.label}
                  style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--light-gray)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate(item.path)}
                >
                  <div style={{ width: 42, height: 42, background: 'var(--primary-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--dark)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <span style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
