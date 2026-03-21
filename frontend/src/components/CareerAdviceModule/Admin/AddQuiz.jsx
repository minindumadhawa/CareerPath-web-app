import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const emptyQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
});

const initialForm = {
  title: '',
  category: '',
  description: '',
  timeLimit: '',
  passingScore: '',
};

const AddQuiz = () => {
  const [form, setForm] = useState(initialForm);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [errors, setErrors] = useState({});
  const [qErrors, setQErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const e = {};

    // Title — no symbols
    if (!form.title.trim()) e.title = 'Quiz title is required';
    else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters';
    else if (form.title.trim().length > 100) e.title = 'Title cannot exceed 100 characters';
    else if (/[^a-zA-Z0-9\s\-&]/.test(form.title.trim())) e.title = 'Title cannot contain special symbols';

    if (!form.category) e.category = 'Please select a category';

    // Description — letters, numbers, spaces, . , only
    if (!form.description.trim()) e.description = 'Description is required';
    else if (/[^a-zA-Z0-9\s.,]/.test(form.description.trim())) e.description = 'Description can only contain letters, numbers, spaces, (.) and (,)';

    if (!form.timeLimit) e.timeLimit = 'Time limit is required';
    else if (isNaN(form.timeLimit) || Number(form.timeLimit) < 1) e.timeLimit = 'Must be at least 1 minute';

    if (!form.passingScore) e.passingScore = 'Passing score is required';
    else if (isNaN(form.passingScore) || Number(form.passingScore) < 0 || Number(form.passingScore) > 100)
      e.passingScore = 'Must be between 0 and 100';

    return e;
  };

  const validateQuestions = () => {
    return questions.map((q) => {
      const e = {};

      // Question text — no symbols except . , ?
      if (!q.questionText.trim()) e.questionText = 'Question text is required';
      else if (/[^a-zA-Z0-9\s.,?]/.test(q.questionText.trim())) e.questionText = 'Question text cannot contain special symbols';

      // Options — no symbols
      q.options.forEach((opt, i) => {
        if (!opt.trim()) e[`option${i}`] = `Option ${i + 1} is required`;
        else if (/[^a-zA-Z0-9\s.,]/.test(opt.trim())) e[`option${i}`] = `Option ${i + 1} cannot contain special symbols`;
      });

      if (q.correctAnswer === '' || q.correctAnswer === null || q.correctAnswer === undefined)
        e.correctAnswer = 'Select the correct answer';

      return e;
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  // Title — filter symbols on input
  const handleTitleChange = (e) => {
    const filtered = e.target.value.replace(/[^a-zA-Z0-9\s\-&]/g, '');
    setForm(p => ({ ...p, title: filtered }));
    if (errors.title) setErrors(p => ({ ...p, title: '' }));
  };

  // Description — only letters, numbers, spaces, . and ,
  const handleDescChange = (e) => {
    const filtered = e.target.value.replace(/[^a-zA-Z0-9\s.,]/g, '');
    setForm(p => ({ ...p, description: filtered }));
    if (errors.description) setErrors(p => ({ ...p, description: '' }));
  };

  // Question text — letters, numbers, spaces, . , ?
  const handleQuestionTextChange = (qi, value) => {
    const filtered = value.replace(/[^a-zA-Z0-9\s.,?]/g, '');
    handleQuestionChange(qi, 'questionText', filtered);
  };

  // Options — letters, numbers, spaces, . ,
  const handleOptionChangeFiltered = (qi, oi, value) => {
    const filtered = value.replace(/[^a-zA-Z0-9\s.,]/g, '');
    setQuestions(prev => {
      const updated = [...prev];
      const opts = [...updated[qi].options];
      opts[oi] = filtered;
      updated[qi] = { ...updated[qi], options: opts };
      return updated;
    });
    setQErrors(prev => {
      const updated = [...prev];
      updated[qi] = { ...updated[qi], [`option${oi}`]: '' };
      return updated;
    });
  };

  // Explanation — letters, numbers, spaces, . ,
  const handleExplanationChange = (qi, value) => {
    const filtered = value.replace(/[^a-zA-Z0-9\s.,]/g, '');
    handleQuestionChange(qi, 'explanation', filtered);
  };

  const handleQuestionChange = (qi, field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qi] = { ...updated[qi], [field]: value };
      return updated;
    });
    setQErrors(prev => {
      const updated = [...prev];
      updated[qi] = { ...updated[qi], [field]: '' };
      return updated;
    });
  };

  const handleOptionChange = (qi, oi, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      const opts = [...updated[qi].options];
      opts[oi] = value;
      updated[qi] = { ...updated[qi], options: opts };
      return updated;
    });
    setQErrors(prev => {
      const updated = [...prev];
      updated[qi] = { ...updated[qi], [`option${oi}`]: '' };
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, emptyQuestion()]);
    setQErrors(prev => [...prev, {}]);
  };

  const removeQuestion = (qi) => {
    if (questions.length === 1) { toast.warning('At least 1 question is required'); return; }
    setQuestions(prev => prev.filter((_, i) => i !== qi));
    setQErrors(prev => prev.filter((_, i) => i !== qi));
  };

  const fillDummyData = () => {
    setForm({
      title: 'Leadership & Communication Skills Test',
      category: 'Leadership',
      description: 'Assess your understanding of key leadership and communication concepts.',
      timeLimit: '15',
      passingScore: '60',
    });
    setQuestions([
      {
        questionText: 'Which of the following is a key characteristic of an effective leader?',
        options: ['Micromanaging every task', 'Delegating tasks and trusting the team', 'Avoiding communication', 'Taking all decisions alone'],
        correctAnswer: 1,
        explanation: 'Effective leaders delegate and build trust within their team.',
      },
      {
        questionText: 'What is active listening in communication?',
        options: ['Waiting for your turn to speak', 'Fully concentrating and responding to the speaker', 'Multitasking while listening', 'Only hearing the key words'],
        correctAnswer: 1,
        explanation: 'Active listening means fully focusing and engaging with the speaker.',
      },
      {
        questionText: 'Which communication style is most effective in a professional setting?',
        options: ['Aggressive', 'Passive', 'Assertive', 'Passive-aggressive'],
        correctAnswer: 2,
        explanation: 'Assertive communication is clear, confident, and respectful.',
      },
    ]);
    setErrors({});
    setQErrors([{}, {}, {}]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrs = validateForm();
    const qErrs = validateQuestions();
    const hasQErr = qErrs.some(e => Object.keys(e).length > 0);

    if (Object.keys(formErrs).length > 0 || hasQErr) {
      setErrors(formErrs);
      setQErrors(qErrs);
      toast.error('Please fix all errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        timeLimit: Number(form.timeLimit),
        passingScore: Number(form.passingScore),
        questions: questions.map(q => ({
          ...q,
          correctAnswer: Number(q.correctAnswer),
        })),
      };
      await axios.post('/api/quiz', payload);
      toast.success('📝 Quiz created successfully!');
      setForm(initialForm);
      setQuestions([emptyQuestion()]);
      setErrors({});
      setQErrors([{}]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  const levelColors = { Beginner: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-danger' };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Quiz 📝</h1>
          <p className="page-subtitle">Build a skill assessment quiz for students</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={fillDummyData}>⚡ Fill Sample Data</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Quiz Details */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 style={{ fontSize: '1rem', margin: 0 }}>📋 Quiz Details</h3>
            <span className="badge badge-purple">{questions.length} Question{questions.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Quiz Title <span>*</span></label>
              <input
                type="text"
                name="title"
                className={`form-control ${errors.title ? 'error' : ''}`}
                placeholder="e.g. JavaScript Fundamentals Assessment"
                value={form.title}
                onChange={handleTitleChange}
                maxLength={100}
              />
              {errors.title && <p className="error-text">⚠ {errors.title}</p>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category <span>*</span></label>
                <select
                  name="category"
                  className={`form-control ${errors.category ? 'error' : ''}`}
                  value={form.category}
                  onChange={handleFormChange}
                >
                  <option value="">Select Category</option>
                  <option>Leadership</option>
                  <option>Technical</option>
                  <option>Soft Skills</option>
                  <option>General Knowledge</option>
                  <option>Career Development</option>
                </select>
                {errors.category && <p className="error-text">⚠ {errors.category}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Time Limit (minutes) <span>*</span></label>
                <input
                  type="number"
                  name="timeLimit"
                  className={`form-control ${errors.timeLimit ? 'error' : ''}`}
                  placeholder="e.g. 15"
                  value={form.timeLimit}
                  onChange={handleFormChange}
                  min="1"
                />
                {errors.timeLimit && <p className="error-text">⚠ {errors.timeLimit}</p>}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Description <span>*</span></label>
                <textarea
                  name="description"
                  className={`form-control ${errors.description ? 'error' : ''}`}
                  placeholder="Brief description of what this quiz tests..."
                  value={form.description}
                  onChange={handleDescChange}
                  rows={3}
                />
                {errors.description && <p className="error-text">⚠ {errors.description}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Passing Score (%) <span>*</span></label>
                <input
                  type="number"
                  name="passingScore"
                  className={`form-control ${errors.passingScore ? 'error' : ''}`}
                  placeholder="e.g. 60"
                  value={form.passingScore}
                  onChange={handleFormChange}
                  min="0"
                  max="100"
                />
                {errors.passingScore && <p className="error-text">⚠ {errors.passingScore}</p>}
                {form.passingScore && !errors.passingScore && (
                  <small style={{ color: 'var(--success)' }}>Students need {form.passingScore}% to pass</small>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, qi) => (
          <div className="card" key={qi} style={{ marginBottom: 20, borderLeft: '4px solid var(--primary)' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, background: 'var(--primary)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.8rem', fontWeight: 700
                }}>
                  {qi + 1}
                </div>
                <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Question {qi + 1}</h3>
              </div>
              {questions.length > 1 && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(qi)}>
                  🗑 Remove
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Question Text <span>*</span></label>
                <textarea
                  className={`form-control ${qErrors[qi]?.questionText ? 'error' : ''}`}
                  placeholder="Enter your question here..."
                  value={q.questionText}
                  onChange={e => handleQuestionTextChange(qi, e.target.value)}
                  rows={2}
                />
                {qErrors[qi]?.questionText && <p className="error-text">⚠ {qErrors[qi].questionText}</p>}
              </div>

              <label className="form-label">Answer Options <span>*</span></label>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: 12 }}>
                Click the circle to mark the correct answer
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {q.options.map((opt, oi) => (
                  <div key={oi} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: q.correctAnswer === oi ? '#d1fae5' : 'var(--light-gray)',
                    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                    border: q.correctAnswer === oi ? '2px solid var(--success)' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}>
                    <button
                      type="button"
                      onClick={() => handleQuestionChange(qi, 'correctAnswer', oi)}
                      style={{
                        width: 22, height: 22, borderRadius: '50%',
                        border: `2px solid ${q.correctAnswer === oi ? 'var(--success)' : 'var(--gray)'}`,
                        background: q.correctAnswer === oi ? 'var(--success)' : 'transparent',
                        cursor: 'pointer', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.7rem'
                      }}
                    >
                      {q.correctAnswer === oi ? '✓' : ''}
                    </button>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray)', minWidth: 18 }}>
                      {['A', 'B', 'C', 'D'][oi]}.
                    </span>
                    <input
                      type="text"
                      className={`form-control ${qErrors[qi]?.[`option${oi}`] ? 'error' : ''}`}
                      placeholder={`Option ${oi + 1}`}
                      value={opt}
                      onChange={e => handleOptionChangeFiltered(qi, oi, e.target.value)}
                      style={{ flex: 1, background: 'transparent', border: 'none', padding: '4px 0', boxShadow: 'none' }}
                    />
                  </div>
                ))}
              </div>
              {qErrors[qi]?.correctAnswer && <p className="error-text">⚠ {qErrors[qi].correctAnswer}</p>}

              <div className="form-group" style={{ marginTop: 12, marginBottom: 0 }}>
                <label className="form-label">Explanation (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Explain why the correct answer is right..."
                  value={q.explanation}
                  onChange={e => handleExplanationChange(qi, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={addQuestion}
          style={{ width: '100%', marginBottom: 24, justifyContent: 'center', borderStyle: 'dashed', border: '2px dashed var(--border)' }}
        >
          ➕ Add Another Question
        </button>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => { setForm(initialForm); setQuestions([emptyQuestion()]); setErrors({}); setQErrors([{}]); }}>
            🔄 Reset All
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '⏳ Creating...' : `🚀 Create Quiz (${questions.length} Questions)`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuiz;
