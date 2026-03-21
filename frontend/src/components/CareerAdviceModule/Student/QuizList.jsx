import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const catColor = { Leadership: 'badge-primary', Technical: 'badge-accent', 'Soft Skills': 'badge-purple', 'General Knowledge': 'badge-warning', 'Career Development': 'badge-success' };

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/quiz')
      .then(res => setQuizzes(res.data.data))
      .catch(() => toast.error('Failed to load quizzes'))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Leadership', 'Technical', 'Soft Skills', 'General Knowledge', 'Career Development'];
  const filtered = filter === 'All' ? quizzes : quizzes.filter(q => q.category === filter);

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Skill Assessments 📝</h1>
          <p className="page-subtitle">Test your knowledge and identify areas for improvement</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(c => (
          <button key={c} className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No Quizzes Available</h3>
          <p>Check back later for new assessments.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(q => (
            <div className="card" key={q._id}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                <span className={`badge ${catColor[q.category] || 'badge-primary'}`} style={{ marginBottom: 10 }}>
                  {q.category}
                </span>
                <h3 style={{ fontSize: '1rem', lineHeight: 1.4, marginBottom: 8 }}>{q.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray)', lineHeight: 1.5 }}>
                  {q.description?.substring(0, 90)}...
                </p>
              </div>
              <div style={{ padding: '14px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[
                    { icon: '❓', label: 'Questions', value: q.questions?.length || 0 },
                    { icon: '⏱', label: 'Time', value: `${q.timeLimit}m` },
                    { icon: '🎯', label: 'Pass', value: `${q.passingScore}%` },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', background: 'var(--light-gray)', padding: '8px 4px', borderRadius: 8 }}>
                      <div style={{ fontSize: '1rem' }}>{s.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--gray)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate(`/student/quiz/${q._id}`)}
                >
                  🚀 Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
