import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [viewQuiz, setViewQuiz] = useState(null);
  const [editQuiz, setEditQuiz] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editQuestions, setEditQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/quiz/admin/all');
      setQuizzes(res.data.data);
    } catch {
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/quiz/${id}`);
      toast.success('Quiz deleted!');
      setDeleteId(null);
      fetchQuizzes();
    } catch {
      toast.error('Failed to delete quiz');
    }
  };

  const openEdit = (quiz) => {
    setEditQuiz(quiz);
    setEditForm({
      title: quiz.title,
      category: quiz.category,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      isActive: quiz.isActive,
    });
    setEditQuestions(quiz.questions.map(q => ({
      questionText: q.questionText,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
    })));
  };

  const handleEditChange = (e) => {
    setEditForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleQChange = (qi, field, value) => {
    setEditQuestions(prev => {
      const u = [...prev];
      u[qi] = { ...u[qi], [field]: value };
      return u;
    });
  };

  const handleOptionChange = (qi, oi, value) => {
    setEditQuestions(prev => {
      const u = [...prev];
      const opts = [...u[qi].options];
      opts[oi] = value;
      u[qi] = { ...u[qi], options: opts };
      return u;
    });
  };

  const addQuestion = () => {
    setEditQuestions(prev => [...prev, { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
  };

  const removeQuestion = (qi) => {
    if (editQuestions.length === 1) { toast.warning('At least 1 question required'); return; }
    setEditQuestions(prev => prev.filter((_, i) => i !== qi));
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        timeLimit: Number(editForm.timeLimit),
        passingScore: Number(editForm.passingScore),
        questions: editQuestions.map(q => ({ ...q, correctAnswer: Number(q.correctAnswer) })),
      };
      await axios.put(`/api/quiz/${editQuiz._id}`, payload);
      toast.success('✅ Quiz updated successfully!');
      setEditQuiz(null);
      fetchQuizzes();
    } catch {
      toast.error('Failed to update quiz');
    } finally {
      setSaving(false);
    }
  };

  const catColor = { Leadership: 'badge-primary', Technical: 'badge-accent', 'Soft Skills': 'badge-purple', 'General Knowledge': 'badge-warning', 'Career Development': 'badge-success' };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Quizzes 📝</h1>
          <p className="page-subtitle">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} total</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchQuizzes}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No Quizzes Yet</h3>
          <p>Create quizzes from the "Add Quiz" page.</p>
        </div>
      ) : (
        <div className="grid-3">
          {quizzes.map(quiz => (
            <div className="card" key={quiz._id}>
              <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '0.95rem', lineHeight: 1.4, flex: 1, marginRight: 8 }}>{quiz.title}</h3>
                  <span className={`badge ${quiz.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {quiz.isActive ? 'Active' : 'Off'}
                  </span>
                </div>
                <span className={`badge ${catColor[quiz.category] || 'badge-primary'}`} style={{ marginTop: 8 }}>
                  {quiz.category}
                </span>
              </div>
              <div style={{ padding: '12px 20px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray)', marginBottom: 10, lineHeight: 1.5 }}>
                  {quiz.description?.substring(0, 80)}...
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Questions', value: quiz.questions?.length || 0, icon: '❓' },
                    { label: 'Time Limit', value: `${quiz.timeLimit} min`, icon: '⏱' },
                    { label: 'Pass Score', value: `${quiz.passingScore}%`, icon: '🎯' },
                    { label: 'Created', value: new Date(quiz.createdAt).toLocaleDateString(), icon: '📅' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--light-gray)', padding: '8px 10px', borderRadius: 8 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray)', marginBottom: 2 }}>{s.icon} {s.label}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 3 buttons now */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setViewQuiz(quiz)}>
                  👁 View
                </button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => openEdit(quiz)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => setDeleteId(quiz._id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editQuiz && (
        <div className="modal-overlay" onClick={() => setEditQuiz(null)}>
          <div className="modal-box" style={{ maxWidth: 750 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>✏️ Edit Quiz</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 2 }}>{editQuestions.length} questions</p>
              </div>
              <button className="modal-close" onClick={() => setEditQuiz(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>

              {/* Basic Info */}
              <div style={{ background: 'var(--light-gray)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.875rem', marginBottom: 14, color: 'var(--dark-3)' }}>📋 Quiz Information</h4>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" name="title" className="form-control" value={editForm.title || ''} onChange={handleEditChange} style={{ background: 'white' }} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select name="category" className="form-control" value={editForm.category || ''} onChange={handleEditChange} style={{ background: 'white' }}>
                      {['Leadership', 'Technical', 'Soft Skills', 'General Knowledge', 'Career Development'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select name="isActive" className="form-control" value={editForm.isActive} onChange={e => setEditForm(p => ({ ...p, isActive: e.target.value === 'true' }))} style={{ background: 'white' }}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-control" rows={2} value={editForm.description || ''} onChange={handleEditChange} style={{ background: 'white' }} />
                </div>
                <div className="grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Time Limit (min)</label>
                    <input type="number" name="timeLimit" className="form-control" value={editForm.timeLimit || ''} onChange={handleEditChange} min="1" style={{ background: 'white' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Passing Score (%)</label>
                    <input type="number" name="passingScore" className="form-control" value={editForm.passingScore || ''} onChange={handleEditChange} min="0" max="100" style={{ background: 'white' }} />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.875rem', margin: 0 }}>❓ Questions</h4>
                <span className="badge badge-purple">{editQuestions.length} questions</span>
              </div>

              {editQuestions.map((q, qi) => (
                <div key={qi} style={{ border: '1.5px solid var(--border)', borderRadius: 10, marginBottom: 14, overflow: 'hidden' }}>
                  {/* Question header */}
                  <div style={{ background: 'var(--primary-light)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.78rem', fontWeight: 700 }}>
                        {qi + 1}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary-dark)' }}>Question {qi + 1}</span>
                    </div>
                    {editQuestions.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(qi)}>🗑 Remove</button>
                    )}
                  </div>

                  <div style={{ padding: 14 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Question Text</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={q.questionText}
                        onChange={e => handleQChange(qi, 'questionText', e.target.value)}
                        placeholder="Enter question..."
                      />
                    </div>

                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Options — click circle to mark correct answer</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                      {q.options.map((opt, oi) => (
                        <div key={oi} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          background: q.correctAnswer === oi ? '#d1fae5' : 'var(--light-gray)',
                          border: `2px solid ${q.correctAnswer === oi ? 'var(--success)' : 'transparent'}`,
                          borderRadius: 8, padding: '6px 10px',
                        }}>
                          <button
                            type="button"
                            onClick={() => handleQChange(qi, 'correctAnswer', oi)}
                            style={{
                              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                              border: `2px solid ${q.correctAnswer === oi ? 'var(--success)' : 'var(--gray)'}`,
                              background: q.correctAnswer === oi ? 'var(--success)' : 'transparent',
                              color: 'white', fontSize: '0.7rem', fontWeight: 700,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >{q.correctAnswer === oi ? '✓' : ''}</button>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray)', minWidth: 14 }}>{['A','B','C','D'][oi]}.</span>
                          <input
                            type="text"
                            className="form-control"
                            value={opt}
                            onChange={e => handleOptionChange(qi, oi, e.target.value)}
                            placeholder={`Option ${oi + 1}`}
                            style={{ flex: 1, background: 'transparent', border: 'none', padding: '2px 0', boxShadow: 'none', fontSize: '0.85rem' }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Explanation (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={q.explanation}
                        onChange={e => handleQChange(qi, 'explanation', e.target.value)}
                        placeholder="Why is this the correct answer?"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <button
                type="button"
                onClick={addQuestion}
                style={{
                  width: '100%', padding: '11px',
                  border: '2px dashed var(--primary)', borderRadius: 8,
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', marginBottom: 20
                }}
              >
                ➕ Add Question
              </button>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setEditQuiz(null)}>Cancel</button>
                <button className="btn btn-primary btn-lg" onClick={handleEditSave} disabled={saving}>
                  {saving ? '⏳ Saving...' : `✅ Save Changes (${editQuestions.length} questions)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Questions Modal */}
      {viewQuiz && (
        <div className="modal-overlay" onClick={() => setViewQuiz(null)}>
          <div className="modal-box" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{viewQuiz.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: 2 }}>{viewQuiz.questions?.length} questions · {viewQuiz.timeLimit} min · Pass: {viewQuiz.passingScore}%</p>
              </div>
              <button className="modal-close" onClick={() => setViewQuiz(null)}>✕</button>
            </div>
            <div className="modal-body">
              {viewQuiz.questions?.map((q, i) => (
                <div key={i} style={{ marginBottom: 20, padding: 16, background: 'var(--light-gray)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--primary)', marginRight: 6 }}>Q{i + 1}.</span>{q.questionText}
                  </p>
                  {q.options?.map((opt, oi) => (
                    <div key={oi} style={{
                      padding: '6px 12px', borderRadius: 6, marginBottom: 4, fontSize: '0.85rem',
                      background: oi === q.correctAnswer ? '#d1fae5' : 'white',
                      border: `1px solid ${oi === q.correctAnswer ? 'var(--success)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', gap: 8
                    }}>
                      {oi === q.correctAnswer && <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>}
                      <span style={{ fontWeight: 600, color: 'var(--gray)', minWidth: 16 }}>{['A', 'B', 'C', 'D'][oi]}.</span>
                      {opt}
                    </div>
                  ))}
                  {q.explanation && <p style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: 6, fontStyle: 'italic' }}>💡 {q.explanation}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: 'var(--danger)' }}>⚠️ Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 24, color: 'var(--dark-3)' }}>Delete this quiz? All related data will be removed.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>🗑 Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuiz;
