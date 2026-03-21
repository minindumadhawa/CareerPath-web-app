import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialForm = {
  title: '', category: '', description: '',
  instructor: '', duration: '', level: '', tags: '',
};
const emptyVideo = () => ({ title: '', url: '' });

const AddTechnicalResource = () => {
  const [form, setForm] = useState(initialForm);
  const [videos, setVideos] = useState([emptyVideo()]);
  const [errors, setErrors] = useState({});
  const [videoErrors, setVideoErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    // Title — no symbols
    if (!form.title.trim()) {
      e.title = 'Resource title is required';
    } else if (form.title.trim().length < 5) {
      e.title = 'Title must be at least 5 characters';
    } else if (form.title.trim().length > 100) {
      e.title = 'Title cannot exceed 100 characters';
    } else if (/[^a-zA-Z0-9\s\-&./]/.test(form.title.trim())) {
      e.title = 'Title cannot contain special symbols (only letters, numbers, spaces, - & . / allowed)';
    }

    if (!form.category) e.category = 'Please select a category';

    // Description — no special symbols
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
      e.instructor = 'Name must be at least 3 characters';
    } else if (/[^a-zA-Z\s.\-]/.test(form.instructor.trim())) {
      e.instructor = 'Instructor name can only contain letters, spaces, dots and hyphens (no numbers or symbols)';
    }

    // Duration — letters and numbers only
    if (!form.duration.trim()) {
      e.duration = 'Duration is required';
    } else if (/[^a-zA-Z0-9\s\-]/.test(form.duration.trim())) {
      e.duration = 'Duration cannot contain special symbols';
    }

    if (!form.level) e.level = 'Please select a level';
    return e;
  };

  const validateVideos = () => videos.map(v => {
    const e = {};
    if (!v.title.trim()) e.title = 'Video title is required';
    if (!v.url.trim()) e.url = 'Video URL is required';
    else if (!/^https?:\/\/.+/.test(v.url)) e.url = 'Enter a valid URL';
    return e;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleVideoChange = (i, field, value) => {
    setVideos(prev => { const u = [...prev]; u[i] = { ...u[i], [field]: value }; return u; });
    setVideoErrors(prev => { const u = [...prev]; u[i] = { ...u[i], [field]: '' }; return u; });
  };

  const addVideo = () => { setVideos(p => [...p, emptyVideo()]); setVideoErrors(p => [...p, {}]); };
  const removeVideo = (i) => {
    if (videos.length === 1) { toast.warning('At least 1 video required'); return; }
    setVideos(p => p.filter((_, idx) => idx !== i));
    setVideoErrors(p => p.filter((_, idx) => idx !== i));
  };

  const fillDummy = () => {
    setForm({ title: 'Full Stack Web Development with React & Node.js', category: 'Web Development', description: 'A complete guide to building modern full-stack web applications using React for the frontend and Node.js with Express for the backend, including RESTful API design and MongoDB integration.', instructor: 'Mr. Kasun Rajapaksha', duration: '8 Hours', level: 'Intermediate', tags: 'React, Node.js, MongoDB' });
    setVideos([
      { title: 'Part 1 - Project Setup & React Basics', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Part 2 - Node.js & Express Backend', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Part 3 - MongoDB Integration', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ]);
    setErrors({}); setVideoErrors([{}, {}, {}]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrs = validate();
    const vidErrs = validateVideos();
    const hasVidErr = vidErrs.some(e => Object.keys(e).length > 0);
    if (Object.keys(formErrs).length > 0 || hasVidErr) {
      setErrors(formErrs); setVideoErrors(vidErrs);
      toast.error('Please fix errors before submitting.'); return;
    }
    setLoading(true);
    try {
      const payload = { ...form, videos, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      await axios.post('/api/technical', payload);
      toast.success('💻 Technical resource added successfully!');
      setForm(initialForm); setVideos([emptyVideo()]); setErrors({}); setVideoErrors([{}]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add resource.');
    } finally { setLoading(false); }
  };

  // Block invalid characters on keypress
  const blockSymbolsInTitle = (e) => {
    if (/[^a-zA-Z0-9\s\-&./]/.test(e.key) && e.key.length === 1) e.preventDefault();
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
          <h1 className="page-title">Add Technical Resource 💻</h1>
          <p className="page-subtitle">Add a new technical learning resource with video series</p>
        </div>
        <button className="btn btn-secondary" onClick={fillDummy}>⚡ Fill Sample Data</button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Resource Details */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <h3 style={{ fontSize: '1rem', margin: 0 }}>📋 Resource Information</h3>
            <span className="badge badge-accent">Technical</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Resource Title <span>*</span></label>
              <input type="text" name="title" className={`form-control ${errors.title ? 'error' : ''}`} placeholder="e.g. Python for Beginners" value={form.title} onChange={handleChange} onKeyPress={blockSymbolsInTitle} maxLength={100} />
              {errors.title && <p className="error-text">⚠ {errors.title}</p>}
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category <span>*</span></label>
                <select name="category" className={`form-control ${errors.category ? 'error' : ''}`} value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {['Programming', 'Database', 'Web Development', 'Mobile Development', 'Cloud & DevOps', 'Data Science', 'Cybersecurity', 'UI/UX Design'].map(c => <option key={c}>{c}</option>)}
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
              <textarea name="description" className={`form-control ${errors.description ? 'error' : ''}`} rows={3} placeholder="Describe what students will learn..." value={form.description} onChange={handleDescriptionChange} maxLength={500} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.description ? <p className="error-text">⚠ {errors.description}</p> : <span />}
                <small style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>{form.description.length} chars</small>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Instructor <span>*</span></label>
                <input type="text" name="instructor" className={`form-control ${errors.instructor ? 'error' : ''}`} placeholder="Instructor name" value={form.instructor} onChange={handleChange} onKeyPress={blockNonLettersInName} />
                {errors.instructor && <p className="error-text">⚠ {errors.instructor}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Duration <span>*</span></label>
                <input type="text" name="duration" className={`form-control ${errors.duration ? 'error' : ''}`} placeholder="e.g. 5 Hours, 3 Weeks" value={form.duration} onChange={handleChange} />
                {errors.duration && <p className="error-text">⚠ {errors.duration}</p>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (Optional)</label>
              <input type="text" name="tags" className="form-control" placeholder="React, JavaScript, CSS (comma-separated)" value={form.tags} onChange={handleChange} />
              <small style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>Separate tags with commas</small>
            </div>
          </div>
        </div>

        {/* Video Playlist */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>🎬 Video Playlist</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 3 }}>Add YouTube or any video links for this resource</p>
            </div>
            <span className="badge badge-accent">{videos.length} Video{videos.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="card-body">
            {videos.map((v, i) => (
              <div key={i} style={{ background: 'var(--light-gray)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 12, border: '1.5px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>{i + 1}</div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark-3)' }}>Video {i + 1}</span>
                  </div>
                  {videos.length > 1 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeVideo(i)}>🗑 Remove</button>}
                </div>
                <div className="grid-2" style={{ gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Video Title <span>*</span></label>
                    <input type="text" className={`form-control ${videoErrors[i]?.title ? 'error' : ''}`} placeholder="e.g. Part 1 - Introduction" value={v.title} onChange={e => handleVideoChange(i, 'title', e.target.value)} style={{ background: 'white' }} />
                    {videoErrors[i]?.title && <p className="error-text">⚠ {videoErrors[i].title}</p>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Video URL <span>*</span></label>
                    <input type="url" className={`form-control ${videoErrors[i]?.url ? 'error' : ''}`} placeholder="https://youtube.com/watch?v=..." value={v.url} onChange={e => handleVideoChange(i, 'url', e.target.value)} style={{ background: 'white' }} />
                    {videoErrors[i]?.url && <p className="error-text">⚠ {videoErrors[i].url}</p>}
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addVideo} style={{ width: '100%', padding: 12, border: '2px dashed var(--accent)', borderRadius: 'var(--radius-sm)', background: '#cffafe', color: 'var(--accent-dark)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              ➕ Add Another Video
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => { setForm(initialForm); setVideos([emptyVideo()]); setErrors({}); setVideoErrors([{}]); }}>🔄 Reset</button>
          <button type="submit" className="btn btn-accent btn-lg" disabled={loading}>
            {loading ? '⏳ Saving...' : `✅ Add Resource (${videos.length} video${videos.length !== 1 ? 's' : ''})`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTechnicalResource;
