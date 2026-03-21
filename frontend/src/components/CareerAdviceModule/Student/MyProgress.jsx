import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStudent } from '../../../context/CareerAdviceModule/StudentContext';
import { useNavigate } from 'react-router-dom';
import { generateCertificate } from '../../../utils/CareerAdviceModule/generateCertificate';

const MyProgress = () => {
  const { student, login, logout } = useStudent();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // Simple email-only lookup for guests
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');

  const fetchProgress = async (email) => {
    setLoading(true);
    try {
      const [enrRes, quizRes] = await Promise.all([
        axios.get(`/api/enrollments/student/${email}`),
        axios.get('/api/quiz/results'),
      ]);
      setEnrollments(enrRes.data.data);
      setQuizResults(quizRes.data.data.filter(r => r.studentEmail === email));
    } catch {
      toast.error('Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load if already logged in
  useEffect(() => {
    if (student) fetchProgress(student.email);
  }, [student]);

  const handleEmailLookup = () => {
    if (!emailInput.trim()) { setEmailError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) { setEmailError('Enter a valid email'); return; }
    login('Student', emailInput.trim()); // login with email only
  };

  // Stats
  const totalEnrolled = enrollments.length;
  const completed = enrollments.filter(e => e.isCompleted).length;
  const totalQuizzes = quizResults.length;
  const quizPassed = quizResults.filter(r => r.passed).length;
  const avgScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((a, b) => a + b.score, 0) / quizResults.length)
    : 0;

  // === NOT LOGGED IN — simple email lookup ===
  if (!student) {
    return (
      <div className="page-container fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Progress 📊</h1>
            <p className="page-subtitle">View your enrolled programs and quiz results</p>
          </div>
        </div>

        <div style={{ maxWidth: 440, margin: '40px auto' }}>
          <div className="card">
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              padding: '28px', borderRadius: '12px 12px 0 0', textAlign: 'center', color: 'white'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>📊</div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>View Your Progress</h2>
              <p style={{ opacity: 0.85, fontSize: '0.85rem', marginTop: 6 }}>
                Enter your email to see your learning history
              </p>
            </div>
            <div className="card-body">
              <div className="alert alert-info" style={{ marginBottom: 20 }}>
                💡 Use the same email you used when enrolling or taking a quiz
              </div>
              <div className="form-group">
                <label className="form-label">Your Email <span>*</span></label>
                <input
                  type="email"
                  className={`form-control ${emailError ? 'error' : ''}`}
                  placeholder="e.g. kasun@gmail.com"
                  value={emailInput}
                  onChange={e => { setEmailInput(e.target.value); setEmailError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleEmailLookup()}
                />
                {emailError && <p className="error-text">⚠ {emailError}</p>}
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleEmailLookup}
              >
                📊 View My Progress
              </button>

              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                  Haven't enrolled yet?{' '}
                  <span
                    style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => navigate('/student/leadership')}
                  >
                    Browse Programs →
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === LOGGED IN — show progress ===
  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Progress 📊</h1>
          <p className="page-subtitle">
            {student.name !== 'Student' ? `Hello, ${student.name}!` : ''} Viewing progress for{' '}
            <strong>{student.email}</strong>
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => { logout(); setEnrollments([]); setQuizResults([]); }}>
          🔄 Switch Account
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <>
          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Enrolled', value: totalEnrolled, icon: '📚', bg: '#e8f0fe', color: '#1a56db' },
              { label: 'Completed', value: completed, icon: '🎓', bg: '#d1fae5', color: '#059669' },
              { label: 'Quizzes Taken', value: totalQuizzes, icon: '📝', bg: '#ede9fe', color: '#7c3aed' },
              { label: 'Passed', value: quizPassed, icon: '✅', bg: '#d1fae5', color: '#059669' },
              { label: 'Avg Score', value: `${avgScore}%`, icon: '🎯', bg: '#fef3c7', color: '#b45309' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ background: s.bg }}>
                <div className="stat-icon" style={{ background: s.color, color: 'white', fontSize: '1.3rem' }}>{s.icon}</div>
                <div className="stat-info">
                  <h3 style={{ color: s.color }}>{s.value}</h3>
                  <p style={{ fontWeight: 600, color: 'var(--dark-2)', fontSize: '0.78rem' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Enrolled Programs */}
          <div className="card" style={{ marginBottom: 28 }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1rem', margin: 0 }}>📚 Enrolled Programs</h3>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/student/leadership')}>Browse More</button>
            </div>
            {enrollments.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📚</div>
                <p>No program enrollments found for this email.</p>
                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/student/leadership')}>Browse Programs →</button>
              </div>
            ) : (
              <div style={{ padding: '8px 0' }}>
                {enrollments.map(enr => {
                  const prog = enr.programId;
                  if (!prog) return null;
                  const watched = enr.watchedVideos?.length || 0;
                  const total = prog.videos?.length || 0;
                  const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
                  return (
                    <div key={enr._id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                            <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{prog.title}</h4>
                            {enr.isCompleted && <span className="badge badge-success">🎓 Completed</span>}
                            <span className={`badge ${enr.programType === 'TechnicalResource' ? 'badge-accent' : 'badge-primary'}`}>
                              {enr.programType === 'TechnicalResource' ? '💻 Technical' : '🏆 Leadership'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span className="badge badge-primary">{prog.category}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>👨‍🏫 {prog.instructor}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>⏱ {prog.duration}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: pct === 100 ? 'var(--success)' : 'var(--primary)' }}>{pct}%</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>{watched}/{total} videos</div>
                        </div>
                      </div>
                      <div style={{ background: 'var(--border)', borderRadius: 50, height: 8, overflow: 'hidden', marginBottom: 10 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--success)' : 'var(--primary)', borderRadius: 50, transition: 'width 0.4s' }} />
                      </div>
                      {prog.videos?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                          {prog.videos.map((v, i) => {
                            const isWatched = enr.watchedVideos?.includes(i);
                            return (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                padding: '3px 10px', borderRadius: 50, fontSize: '0.73rem',
                                background: isWatched ? '#d1fae5' : 'var(--light-gray)',
                                color: isWatched ? '#059669' : 'var(--gray)',
                                fontWeight: isWatched ? 600 : 400,
                                border: `1px solid ${isWatched ? '#a7f3d0' : 'var(--border)'}`
                              }}>
                                {isWatched ? '✅' : '⭕'} {v.title.length > 22 ? v.title.substring(0, 22) + '...' : v.title}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(enr.programType === 'TechnicalResource' ? '/student/technical' : '/student/leadership')}>
                          ▶ Continue Watching
                        </button>
                        {enr.isCompleted && (
                          <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg, #d4af37, #f0d060)', color: '#1a1a00', fontWeight: 700, border: 'none' }}
                            onClick={() => generateCertificate({
                              studentName: student.name !== 'Student' ? student.name : student.email.split('@')[0],
                              programTitle: prog.title,
                              category: prog.category,
                              instructor: prog.instructor,
                              completedDate: new Date(enr.completedAt || enr.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                            })}>
                            🏅 Download Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quiz Results */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1rem', margin: 0 }}>📝 My Quiz Results</h3>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/student/quizzes')}>Take Quiz</button>
            </div>
            {quizResults.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📝</div>
                <p>No quiz results found for this email.</p>
                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/student/quizzes')}>Start a Quiz →</button>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--light-gray)', borderBottom: '2px solid var(--border)' }}>
                    {['#', 'Quiz', 'Category', 'Score', 'Result', 'Time', 'Date'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((r, i) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--light-gray)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', color: 'var(--gray)', fontSize: '0.85rem' }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.875rem' }}>{r.quizId?.title || 'N/A'}</td>
                      <td style={{ padding: '12px 16px' }}><span className="badge badge-primary">{r.quizId?.category}</span></td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.85rem',
                          background: r.score >= 70 ? '#d1fae5' : r.score >= 50 ? '#fef3c7' : '#fee2e2',
                          color: r.score >= 70 ? '#059669' : r.score >= 50 ? '#92400e' : '#ef4444'
                        }}>{r.score}%</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${r.passed ? 'badge-success' : 'badge-danger'}`}>{r.passed ? '✅ Passed' : '❌ Failed'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--gray)' }}>
                        {r.timeTaken ? `${Math.floor(r.timeTaken / 60)}m ${r.timeTaken % 60}s` : 'N/A'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--gray)' }}>
                        {new Date(r.createdAt).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyProgress;
