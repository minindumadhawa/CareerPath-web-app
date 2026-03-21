import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStudent } from '../../../context/CareerAdviceModule/StudentContext';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student, login } = useStudent();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('info'); // info | quiz | result
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // Pre-fill from context if already logged in
  const [studentInfo, setStudentInfo] = useState({
    name: student?.name || '',
    email: student?.email || '',
  });
  const [infoErrors, setInfoErrors] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/quiz/take/${id}`)
      .then(res => {
        setQuiz(res.data.data);
        setTimeLeft(res.data.data.timeLimit * 60);
        setAnswers(new Array(res.data.data.questions.length).fill(null));
      })
      .catch(() => { toast.error('Quiz not found'); navigate('/student/quizzes'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return;

    if (!auto) {
      const unansweredCount = answers.filter(a => a === null).length;
      if (unansweredCount > 0) {
        const confirmSubmit = window.confirm(`You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`);
        if (!confirmSubmit) return;
      }
    }

    setSubmitting(true);
    clearInterval(timerRef.current);
    const timeTaken = quiz.timeLimit * 60 - timeLeft;
    try {
      const res = await axios.post(`/api/quiz/submit/${id}`, {
        studentName: studentInfo.name,
        studentEmail: studentInfo.email,
        answers,
        timeTaken
      });
      setResult(res.data.data);
      setPhase('result');
      if (auto) toast.info('⏰ Time is up! Quiz auto-submitted.');
    } catch {
      toast.error('Submission failed');
      setSubmitting(false);
    }
  }, [submitting, quiz, timeLeft, id, studentInfo, answers]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, handleSubmit]);

  const validateInfo = () => {
    const e = {};
    if (!studentInfo.name.trim()) e.name = 'Name is required';
    if (!studentInfo.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentInfo.email)) e.email = 'Enter a valid email';
    return e;
  };

  const startQuiz = () => {
    const e = validateInfo();
    if (Object.keys(e).length > 0) { setInfoErrors(e); return; }
    // Save to context so progress page works automatically
    login(studentInfo.name, studentInfo.email);
    setPhase('quiz');
    setStartTime(Date.now());
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const answered = answers.filter(a => a !== null).length;
  const progress = quiz ? (answered / quiz.questions.length) * 100 : 0;

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!quiz) return null;

  // === INFO PHASE ===
  if (phase === 'info') {
    return (
      <div className="page-container fade-in" style={{ maxWidth: 580, margin: '0 auto' }}>
        <div className="card">
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '28px', borderRadius: '12px 12px 0 0', color: 'white' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📝</div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>{quiz.title}</h2>
            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>{quiz.description}</p>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { icon: '❓', label: 'Questions', value: quiz.questions?.length },
                { icon: '⏱', label: 'Time Limit', value: `${quiz.timeLimit} min` },
                { icon: '🎯', label: 'Pass Score', value: `${quiz.passingScore}%` },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', background: 'var(--light-gray)', padding: '14px', borderRadius: 10 }}>
                  <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* If already logged in — show name and skip form */}
            {student ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#d1fae5', border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 20
                }}>
                  <div style={{ width: 40, height: 40, background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#065f46' }}>{student.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#059669' }}>{student.email}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#059669', fontWeight: 600, background: 'white', padding: '3px 10px', borderRadius: 50 }}>✅ Logged in</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-secondary btn-lg" onClick={() => navigate('/student/quizzes')} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={startQuiz} style={{ flex: 2, justifyContent: 'center' }}>🚀 Start Quiz</button>
                </div>
              </>
            ) : (
              <>
                <div className="alert alert-info" style={{ marginBottom: 20 }}>
                  ℹ️ Enter your details once — next time you won't need to re-enter them.
                </div>
                <div className="form-group">
                  <label className="form-label">Your Full Name <span>*</span></label>
                  <input
                    type="text"
                    className={`form-control ${infoErrors.name ? 'error' : ''}`}
                    placeholder="e.g. Kasun Perera"
                    value={studentInfo.name}
                    onChange={e => { setStudentInfo(p => ({ ...p, name: e.target.value })); setInfoErrors(p => ({ ...p, name: '' })); }}
                  />
                  {infoErrors.name && <p className="error-text">⚠ {infoErrors.name}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Your Email <span>*</span></label>
                  <input
                    type="email"
                    className={`form-control ${infoErrors.email ? 'error' : ''}`}
                    placeholder="e.g. kasun@gmail.com"
                    value={studentInfo.email}
                    onChange={e => { setStudentInfo(p => ({ ...p, email: e.target.value })); setInfoErrors(p => ({ ...p, email: '' })); }}
                  />
                  {infoErrors.email && <p className="error-text">⚠ {infoErrors.email}</p>}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-secondary btn-lg" onClick={() => navigate('/student/quizzes')} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={startQuiz} style={{ flex: 2, justifyContent: 'center' }}>🚀 Start Quiz</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // === QUIZ PHASE ===
  if (phase === 'quiz') {
    const q = quiz.questions[current];
    const timerPercent = (timeLeft / (quiz.timeLimit * 60)) * 100;
    const timerColor = timerPercent > 50 ? 'var(--success)' : timerPercent > 20 ? 'var(--warning)' : 'var(--danger)';

    return (
      <div className="page-container fade-in" style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{quiz.title}</h2>
            <p style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>Question {current + 1} of {quiz.questions.length}</p>
          </div>
          <div style={{
            background: timeLeft < 60 ? '#fee2e2' : 'var(--light-gray)',
            padding: '10px 18px', borderRadius: 50,
            fontFamily: 'monospace', fontWeight: 700, fontSize: '1.2rem',
            color: timerColor, border: `2px solid ${timerColor}`,
            transition: 'all 0.5s'
          }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: 'var(--border)', borderRadius: 50, height: 6, marginBottom: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((current + 1) / quiz.questions.length) * 100}%`, background: 'var(--primary)', borderRadius: 50, transition: 'width 0.3s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gray)', marginBottom: 20 }}>
          <span>{answered} of {quiz.questions.length} answered</span>
          <span>{Math.round(progress)}% complete</span>
        </div>

        {/* Question Card */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ padding: '20px 24px', background: 'var(--primary-light)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                {current + 1}
              </div>
              <p style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.5, color: 'var(--dark)' }}>
                {q.questionText}
              </p>
            </div>
          </div>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, oi) => {
              const isSelected = answers[current] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => {
                    const newAns = [...answers];
                    newAns[current] = oi;
                    setAnswers(newAns);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-light)' : 'var(--white)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--dark)',
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--gray)'}`,
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isSelected ? 'white' : 'var(--gray)', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0
                  }}>
                    {isSelected ? '✓' : ['A', 'B', 'C', 'D'][oi]}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-lg" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
            ← Previous
          </button>

          <div style={{ display: 'flex', gap: 6 }}>
            {quiz.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  background: i === current ? 'var(--primary)' : answers[i] !== null ? '#d1fae5' : 'var(--border)',
                  color: i === current ? 'white' : answers[i] !== null ? '#059669' : 'var(--gray)',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {current < quiz.questions.length - 1 ? (
            <button className="btn btn-primary btn-lg" onClick={() => setCurrent(current + 1)}>
              Next →
            </button>
          ) : (
            <button
              className="btn btn-success btn-lg"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              style={{ background: 'var(--success)' }}
            >
              {submitting ? 'Submitting...' : `✅ Submit (${answered}/${quiz.questions.length})`}
            </button>
          )}
        </div>
      </div>
    );
  }

  // === RESULT PHASE ===
  if (phase === 'result' && result) {
    return (
      <div className="page-container fade-in" style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Score Hero */}
        <div style={{
          background: result.passed ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #dc2626, #ef4444)',
          borderRadius: 'var(--radius-lg)', padding: '36px', textAlign: 'center', color: 'white', marginBottom: 24
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>{result.passed ? '🎉' : '📚'}</div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 6 }}>{result.passed ? 'Congratulations!' : 'Keep Practicing!'}</h2>
          <p style={{ opacity: 0.9, marginBottom: 20 }}>
            {result.passed ? `Well done, ${studentInfo.name}! You passed the quiz.` : `Don't give up, ${studentInfo.name}! Review and try again.`}
          </p>
          <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>{result.score}%</div>
          <p style={{ opacity: 0.85 }}>{result.correct} correct out of {result.total} questions</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Score', value: `${result.score}%`, icon: '🎯', color: '#e8f0fe' },
            { label: 'Correct', value: `${result.correct}/${result.total}`, icon: '✅', color: '#d1fae5' },
            { label: 'Time Taken', value: result.timeTaken ? `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s` : 'N/A', icon: '⏱', color: '#fef3c7' },
          ].map(s => (
            <div key={s.label} style={{ background: s.color, padding: '16px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--dark)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Question Review */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 style={{ fontSize: '1rem', margin: 0 }}>📋 Question Review</h3>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {result.processedAnswers?.map((a, i) => (
              <div key={i} style={{
                padding: '12px 16px', borderRadius: 8,
                background: a.isCorrect ? '#d1fae5' : '#fee2e2',
                border: `1px solid ${a.isCorrect ? '#a7f3d0' : '#fca5a5'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Q{i + 1}. {quiz.questions[i]?.questionText}</span>
                  <span>{a.isCorrect ? '✅' : '❌'}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--dark-3)' }}>
                  Your answer: <strong>{a.selectedAnswer !== null ? quiz.questions[i]?.options[a.selectedAnswer] : 'Not answered'}</strong>
                </div>
                {!a.isCorrect && (
                  <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: 3 }}>
                    Correct: <strong>{quiz.questions[i]?.options[a.correctAnswer]}</strong>
                  </div>
                )}
                {a.explanation && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 4, fontStyle: 'italic' }}>
                    💡 {a.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/student/quizzes')}>
            ← Back to Quizzes
          </button>
          <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.location.reload()}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default TakeQuiz;
