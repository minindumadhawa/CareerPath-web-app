import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialForm = {
  title: '',
  category: '',
  description: '',
  instructor: '',
  duration: '',
  level: '',
};

const emptyVideo = () => ({ title: '', url: '' });

const AddLeadership = () => {
  const [form, setForm] = useState(initialForm);
  const [videos, setVideos] = useState([emptyVideo()]);
  const [errors, setErrors] = useState({});
  const [videoErrors, setVideoErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    // Title — letters, numbers, spaces only (no symbols)
    if (!form.title.trim()) {
      e.title = 'Program title is required';
    } else if (form.title.trim().length < 5) {
      e.title = 'Title must be at least 5 characters';
    } else if (form.title.trim().length > 100) {
      e.title = 'Title cannot exceed 100 characters';
    } else if (/[^a-zA-Z0-9\s\-&]/.test(form.title.trim())) {
      e.title = 'Title cannot contain special symbols (only letters, numbers, spaces, - and & allowed)';
    }

    if (!form.category) e.category = 'Please select a category';

    // Description — no special symbols like @#$%^*
    if (!form.description.trim()) {
      e.description = 'Description is required';
    } else if (form.description.trim().length < 20) {
      e.description = 'Description must be at least 20 characters';
    } else if (form.description.trim().length > 500) {
      e.description = 'Description cannot exceed 500 characters';
    } else if (/[^a-zA-Z0-9\s.,]/.test(form.description.trim())) {
      e.description = 'Description can only contain letters, numbers, spaces, (.) and (,)';
    }

    // Instructor — letters and spaces only, no numbers or symbols
    if (!form.instructor.trim()) {
      e.instructor = 'Instructor name is required';
    } else if (form.instructor.trim().length < 3) {
      e.instructor = 'Instructor name must be at least 3 characters';
    } else if (/[^a-zA-Z\s.\-]/.test(form.instructor.trim())) {
      e.instructor = 'Instructor name can only contain letters, spaces, dots and hyphens (no numbers or symbols)';
    }

    // Duration — letters, numbers, spaces only
    if (!form.duration.trim()) {
      e.duration = 'Duration is required';
    } else if (/[^a-zA-Z0-9\s\-]/.test(form.duration.trim())) {
      e.duration = 'Duration cannot contain special symbols';
    }

    if (!form.level) e.level = 'Please select a level';
    return e;
  };

  const validateVideos = () => {
    return videos.map(v => {
      const e = {};
      if (!v.title.trim()) e.title = 'Video title is required';
      if (!v.url.trim()) e.url = 'Video URL is required';
      else if (!/^https?:\/\/.+/.test(v.url)) e.url = 'Enter a valid URL';
      return e;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleVideoChange = (i, field, value) => {
    setVideos(prev => {
      const u = [...prev];
      u[i] = { ...u[i], [field]: value };
      return u;
    });
    setVideoErrors(prev => {
      const u = [...prev];
      u[i] = { ...u[i], [field]: '' };
      return u;
    });
  };

  const addVideo = () => {
    setVideos(p => [...p, emptyVideo()]);
    setVideoErrors(p => [...p, {}]);
  };

  const removeVideo = (i) => {
    if (videos.length === 1) { toast.warning('At least 1 video is required'); return; }
    setVideos(p => p.filter((_, idx) => idx !== i));
    setVideoErrors(p => p.filter((_, idx) => idx !== i));
  };

  const fillDummyData = () => {
    setForm({
      title: 'Effective Team Leadership & Communication',
      category: 'Leadership',
      description: 'This comprehensive program covers essential leadership skills including team management, effective communication strategies, conflict resolution, and motivational techniques for modern workplace environments.',
      instructor: 'Dr. Samantha Perera',
      duration: '6 Weeks',
      level: 'Intermediate',
    });
    setVideos([
      { title: 'Week 1 - Introduction to Leadership', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Week 2 - Team Dynamics & Communication', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Week 3 - Conflict Resolution', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ]);
    setErrors({});
    setVideoErrors([{}, {}, {}]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrs = validate();
    const vidErrs = validateVideos();
    const hasVidErr = vidErrs.some(e => Object.keys(e).length > 0);

    if (Object.keys(formErrs).length > 0 || hasVidErr) {
      setErrors(formErrs);
      setVideoErrors(vidErrs);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/leadership', { ...form, videos });
      toast.success('🏆 Leadership program added successfully!');
      setForm(initialForm);
      setVideos([emptyVideo()]);
      setErrors({});
      setVideoErrors([{}]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add program.');
    } finally {
      setLoading(false);
    }
  };

  // Block invalid characters on keypress
  const blockSymbolsInTitle = (e) => {
    if (/[^a-zA-Z0-9\s\-&]/.test(e.key) && e.key.length === 1) e.preventDefault();
  };
  const blockNonLettersInName = (e) => {
    if (/[^a-zA-Z\s.\-]/.test(e.key) && e.key.length === 1) e.preventDefault();
  };

  // Filter description onChange — strip everything except letters, numbers, space, . and ,
  const handleDescriptionChange = (e) => {
    const filtered = e.target.value.replace(/[^a-zA-Z0-9\s.,]/g, '');
    setForm(p => ({ ...p, description: filtered }));
    if (errors.description) setErrors(p => ({ ...p, description: '' }));
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Leadership Program 🏆</h1>
          <p className="page-subtitle">Create a new leadership or soft-skill training program with video series</p>
        </div>
        <button className="btn btn-secondary" onClick={fillDummyData}>⚡ Fill Sample Data</button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Program Details */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 style={{ fontSize: '1rem', margin: 0 }}>📋 Program Information</h3>
            <span className="badge badge-primary">Admin Only</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Program Title <span>*</span></label>
              <input
                type="text"
                name="title"
                className={`form-control ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Effective Team Leadership"
                value={form.title}
                onChange={handleChange}
                onKeyPress={blockSymbolsInTitle}
                maxLength={100}
              />
              {errors.title && <p className="error-text">⚠ {errors.title}</p>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category <span>*</span></label>
                <select name="category" className={`form-control ${errors.category ? 'error' : ''}`} value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {['Leadership', 'Soft Skills', 'Communication', 'Team Management', 'Problem Solving'].map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <p className="error-text">⚠ {errors.category}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Level <span>*</span></label>
                <select name="level" className={`form-control ${errors.level ? 'error' : ''}`} value={form.level} onChange={handleChange}>
                  <option value="">Select Level</option>
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                </select>
                {errors.level && <p className="error-text">⚠ {errors.level}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description <span>*</span></label>
              <textarea
                name="description"
                className={`form-control ${errors.description ? 'error' : ''}`}
                placeholder="Provide a detailed description..."
                value={form.description}
                onChange={handleDescriptionChange}
                rows={3}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.description ? <p className="error-text">⚠ {errors.description}</p> : <span />}
                <small style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{form.description.length} chars</small>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Instructor Name <span>*</span></label>
                <input type="text" name="instructor" className={`form-control ${errors.instructor ? 'error' : ''}`} placeholder="e.g. Dr. John Silva" value={form.instructor} onChange={handleChange} onKeyPress={blockNonLettersInName} />
                {errors.instructor && <p className="error-text">⚠ {errors.instructor}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Duration <span>*</span></label>
                <input type="text" name="duration" className={`form-control ${errors.duration ? 'error' : ''}`} placeholder="e.g. 4 Weeks, 10 Hours" value={form.duration} onChange={handleChange} />
                {errors.duration && <p className="error-text">⚠ {errors.duration}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Video Playlist Section */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>🎬 Video Playlist</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 3 }}>Add YouTube or any video links for this program</p>
            </div>
            <span className="badge badge-accent">{videos.length} Video{videos.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="card-body">
            {videos.map((v, i) => (
              <div key={i} style={{
                background: 'var(--light-gray)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                marginBottom: 12,
                border: '1.5px solid var(--border)',
                position: 'relative'
              }}>
                {/* Video number badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, background: 'var(--primary)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem'
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark-3)' }}>
                      Video {i + 1}
                    </span>
                  </div>
                  {videos.length > 1 && (
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeVideo(i)}>
                      🗑 Remove
                    </button>
                  )}
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Video Title <span>*</span></label>
                    <input
                      type="text"
                      className={`form-control ${videoErrors[i]?.title ? 'error' : ''}`}
                      placeholder="e.g. Week 1 - Introduction"
                      value={v.title}
                      onChange={e => handleVideoChange(i, 'title', e.target.value)}
                      style={{ background: 'white' }}
                    />
                    {videoErrors[i]?.title && <p className="error-text">⚠ {videoErrors[i].title}</p>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Video URL <span>*</span></label>
                    <input
                      type="url"
                      className={`form-control ${videoErrors[i]?.url ? 'error' : ''}`}
                      placeholder="https://youtube.com/watch?v=..."
                      value={v.url}
                      onChange={e => handleVideoChange(i, 'url', e.target.value)}
                      style={{ background: 'white' }}
                    />
                    {videoErrors[i]?.url && <p className="error-text">⚠ {videoErrors[i].url}</p>}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Video Button */}
            <button
              type="button"
              onClick={addVideo}
              style={{
                width: '100%', padding: '12px',
                border: '2px dashed var(--primary)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontWeight: 600, fontSize: '0.875rem',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--primary-light)'}
            >
              ➕ Add Another Video
            </button>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => { setForm(initialForm); setVideos([emptyVideo()]); setErrors({}); setVideoErrors([{}]); }}>
            🔄 Reset
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '⏳ Saving...' : `✅ Add Program (${videos.length} video${videos.length !== 1 ? 's' : ''})`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeadership;
