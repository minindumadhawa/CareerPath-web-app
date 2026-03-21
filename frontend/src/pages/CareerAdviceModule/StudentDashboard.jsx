import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [stats, setStats] = useState({ leadership: 0, technical: 0, quizzes: 0 });
  const [recentLeadership, setRecentLeadership] = useState([]);
  const [recentTechnical, setRecentTechnical] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [l, t, q] = await Promise.all([
          axios.get('/api/leadership'),
          axios.get('/api/technical'),
          axios.get('/api/quiz'),
        ]);
        setStats({ leadership: l.data.count, technical: t.data.count, quizzes: q.data.count });
        setRecentLeadership(l.data.data.slice(0, 3));
        setRecentTechnical(t.data.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const modules = [
    { title: 'Leadership Programs', desc: 'Build leadership & soft skills', count: stats.leadership, icon: '🏆', color: '#1a56db', bg: '#e8f0fe', path: '/student/leadership' },
    { title: 'Technical Resources', desc: 'Enhance your technical skills', count: stats.technical, icon: '💻', color: '#06b6d4', bg: '#cffafe', path: '/student/technical' },
    { title: 'Skill Assessments', desc: 'Test your knowledge', count: stats.quizzes, icon: '📝', color: '#8b5cf6', bg: '#ede9fe', path: '/student/quizzes' },
  ];

  const levelColor = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' };

  return (
    <div className="page-container fade-in">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a56db 100%)',
        borderRadius: 'var(--radius-lg)', padding: '32px 36px', color: 'white', marginBottom: 28,
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)', fontSize: '6rem', opacity: 0.1 }}>🎓</div>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 8 }}>Welcome to Career Advice Module 👋</h1>
        <p style={{ opacity: 0.8, fontSize: '0.95rem', maxWidth: 500 }}>
          Explore leadership programs, technical resources, and skill assessments to boost your career readiness.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }} onClick={() => navigate('/student/quizzes')}>
            📝 Take a Quiz
          </button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => navigate('/student/leadership')}>
            🏆 View Programs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {modules.map(m => (
          <div key={m.title} className="stat-card" style={{ cursor: 'pointer', background: m.bg }} onClick={() => navigate(m.path)}>
            <div className="stat-icon" style={{ background: m.color, color: 'white', fontSize: '1.5rem' }}>{m.icon}</div>
            <div className="stat-info">
              <h3 style={{ color: m.color }}>{m.count}</h3>
              <p style={{ fontWeight: 600, color: 'var(--dark-2)' }}>{m.title}</p>
              <p style={{ fontSize: '0.75rem', marginTop: 2 }}>{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid-2" style={{ marginTop: 28 }}>
        {/* Leadership */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem', margin: 0 }}>🏆 Recent Leadership Programs</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/leadership')}>View All</button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentLeadership.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray)', fontSize: '0.875rem' }}>No programs yet</div>
            ) : recentLeadership.map(p => (
              <div key={p._id} style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--light-gray)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => navigate('/student/leadership')}
              >
                <div style={{ width: 40, height: 40, background: 'var(--primary-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🏆</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{p.instructor} · {p.duration}</div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: levelColor[p.level], background: `${levelColor[p.level]}20`, padding: '3px 8px', borderRadius: 50, flexShrink: 0 }}>{p.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem', margin: 0 }}>💻 Recent Technical Resources</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/technical')}>View All</button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentTechnical.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray)', fontSize: '0.875rem' }}>No resources yet</div>
            ) : recentTechnical.map(r => (
              <div key={r._id} style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--light-gray)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => navigate('/student/technical')}
              >
                <div style={{ width: 40, height: 40, background: '#cffafe', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>▶️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{r.category} · {r.duration}</div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: levelColor[r.level], background: `${levelColor[r.level]}20`, padding: '3px 8px', borderRadius: 50, flexShrink: 0 }}>{r.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 28 }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1rem', margin: 0 }}>⚡ Quick Actions</h3>
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { icon: '📝', label: 'Take a Quiz', path: '/student/quizzes', color: 'btn-primary' },
            { icon: '🏆', label: 'Browse Leadership', path: '/student/leadership', color: 'btn-secondary' },
            { icon: '💻', label: 'Watch Videos', path: '/student/technical', color: 'btn-secondary' },
          ].map(a => (
            <button key={a.label} className={`btn ${a.color} btn-lg`} onClick={() => navigate(a.path)}>
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
