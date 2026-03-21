import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const QuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/quiz/results');
        setResults(res.data.data);
      } catch {
        toast.error('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = results.filter(r =>
    r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    r.studentEmail?.toLowerCase().includes(search.toLowerCase()) ||
    r.quizId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const passed = results.filter(r => r.passed).length;
  const failed = results.length - passed;
  const avgScore = results.length > 0 ? Math.round(results.reduce((a, b) => a + b.score, 0) / results.length) : 0;

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quiz Results 📈</h1>
          <p className="page-subtitle">All student quiz submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Attempts', value: results.length, icon: '📊', color: '#e8f0fe', iconBg: '#1a56db' },
          { label: 'Passed', value: passed, icon: '✅', color: '#d1fae5', iconBg: '#10b981' },
          { label: 'Failed', value: failed, icon: '❌', color: '#fee2e2', iconBg: '#ef4444' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: '🎯', color: '#fef3c7', iconBg: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ background: s.color }}>
            <div className="stat-icon" style={{ background: s.iconBg, color: 'white' }}>{s.icon}</div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by student name, email or quiz title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No Results Found</h3>
          <p>No quiz submissions yet, or no match for your search.</p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--light-gray)', borderBottom: '2px solid var(--border)' }}>
                {['#', 'Student', 'Quiz', 'Score', 'Result', 'Time Taken', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--light-gray)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '13px 16px', color: 'var(--gray)', fontSize: '0.85rem' }}>{i + 1}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{r.studentEmail}</div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '0.875rem', color: 'var(--dark-3)' }}>
                    {r.quizId?.title || 'Quiz Deleted'}
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{r.quizId?.category}</div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: r.score >= 70 ? '#d1fae5' : r.score >= 50 ? '#fef3c7' : '#fee2e2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem',
                        color: r.score >= 70 ? '#059669' : r.score >= 50 ? '#92400e' : '#ef4444'
                      }}>
                        {r.score}%
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{r.totalQuestions}Q</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span className={`badge ${r.passed ? 'badge-success' : 'badge-danger'}`}>
                      {r.passed ? '✅ Passed' : '❌ Failed'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '0.85rem', color: 'var(--gray)' }}>
                    {r.timeTaken ? `${Math.floor(r.timeTaken / 60)}m ${r.timeTaken % 60}s` : 'N/A'}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '0.82rem', color: 'var(--gray)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizResults;
