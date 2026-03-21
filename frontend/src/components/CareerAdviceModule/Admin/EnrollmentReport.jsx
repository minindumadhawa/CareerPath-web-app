import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EnrollmentReport = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/enrollments/admin/all')
      .then(res => setEnrollments(res.data.data))
      .catch(() => toast.error('Failed to load enrollments'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter(e =>
    e.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    e.studentEmail?.toLowerCase().includes(search.toLowerCase()) ||
    e.programId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const total = enrollments.length;
  const completed = enrollments.filter(e => e.isCompleted).length;
  const inProgress = total - completed;

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Enrollment Report 👥</h1>
          <p className="page-subtitle">All student program enrollments</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Enrollments', value: total, icon: '📚', bg: '#e8f0fe', color: '#1a56db' },
          { label: 'Completed', value: completed, icon: '🎓', bg: '#d1fae5', color: '#059669' },
          { label: 'In Progress', value: inProgress, icon: '⏳', bg: '#fef3c7', color: '#b45309' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ background: s.bg }}>
            <div className="stat-icon" style={{ background: s.color, color: 'white' }}>{s.icon}</div>
            <div className="stat-info">
              <h3 style={{ color: s.color }}>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <input type="text" className="form-control" placeholder="🔍 Search by name, email or program..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400 }} />
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--light-gray)', borderBottom: '2px solid var(--border)' }}>
                {['#', 'Student', 'Program', 'Videos Watched', 'Progress', 'Status', 'Enrolled On'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const total = e.programId?.videos?.length || 0;
                const watched = e.watchedVideos?.length || 0;
                const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
                return (
                  <tr key={e._id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={ev => ev.currentTarget.style.background = 'var(--light-gray)'}
                    onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px', color: 'var(--gray)', fontSize: '0.85rem' }}>{i + 1}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{e.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{e.studentEmail}</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '0.875rem', color: 'var(--dark-3)' }}>
                      {e.programId?.title || 'Program Deleted'}
                      <div><span className="badge badge-primary" style={{ marginTop: 3 }}>{e.programId?.category}</span></div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '0.875rem', color: 'var(--dark-3)' }}>
                      {watched} / {total}
                    </td>
                    <td style={{ padding: '13px 16px', minWidth: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, background: 'var(--border)', borderRadius: 50, height: 6, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--success)' : 'var(--primary)', borderRadius: 50 }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark-3)', minWidth: 32 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span className={`badge ${e.isCompleted ? 'badge-success' : 'badge-warning'}`}>
                        {e.isCompleted ? '🎓 Completed' : '⏳ In Progress'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '0.8rem', color: 'var(--gray)' }}>
                      {new Date(e.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No enrollments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrollmentReport;
