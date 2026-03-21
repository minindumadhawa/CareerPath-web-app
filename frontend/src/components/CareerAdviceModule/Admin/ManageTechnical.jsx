import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageTechnical = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editVideos, setEditVideos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterCat, setFilterCat] = useState('All');

  const categories = ['All', 'Programming', 'Database', 'Web Development', 'Mobile Development', 'Cloud & DevOps', 'Data Science', 'Cybersecurity', 'UI/UX Design'];

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/technical/admin/all');
      setResources(res.data.data);
    } catch { toast.error('Failed to fetch resources'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, []);

  const filtered = filterCat === 'All' ? resources : resources.filter(r => r.category === filterCat);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/technical/${id}`);
      toast.success('Resource deleted!');
      setDeleteId(null);
      fetchResources();
    } catch { toast.error('Failed to delete'); }
  };

  const openEdit = (r) => {
    setEditItem(r);
    setEditForm({ title: r.title, category: r.category, description: r.description, instructor: r.instructor, duration: r.duration, level: r.level, isActive: r.isActive, tags: Array.isArray(r.tags) ? r.tags.join(', ') : '' });
    setEditVideos(r.videos ? r.videos.map(v => ({ title: v.title, url: v.url })) : [{ title: '', url: '' }]);
  };

  const handleEditChange = (e) => setEditForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleVideoChange = (i, field, value) => {
    setEditVideos(prev => { const u = [...prev]; u[i] = { ...u[i], [field]: value }; return u; });
  };

  const addEditVideo = () => setEditVideos(p => [...p, { title: '', url: '' }]);
  const removeEditVideo = (i) => {
    if (editVideos.length === 1) { toast.warning('At least 1 video required'); return; }
    setEditVideos(p => p.filter((_, idx) => idx !== i));
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const payload = { ...editForm, videos: editVideos, tags: editForm.tags ? editForm.tags.split(',').map(t => t.trim()) : [] };
      await axios.put(`/api/technical/${editItem._id}`, payload);
      toast.success('Resource updated!');
      setEditItem(null);
      fetchResources();
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const levelColor = { Beginner: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-danger' };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Technical Resources 💻</h1>
          <p className="page-subtitle">{filtered.length} resource{filtered.length !== 1 ? 's' : ''} shown</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchResources}>🔄 Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(c => (
          <button key={c} className={`btn btn-sm ${filterCat === c ? 'btn-accent' : 'btn-secondary'}`} onClick={() => setFilterCat(c)}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">💻</div><h3>No Resources Found</h3></div>
      ) : (
        <div className="grid-3">
          {filtered.map(r => (
            <div className="card" key={r._id}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <h3 style={{ fontSize: '0.95rem', lineHeight: 1.4, flex: 1 }}>{r.title}</h3>
                  <span className={`badge ${r.isActive ? 'badge-success' : 'badge-danger'}`}>{r.isActive ? 'Active' : 'Off'}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-accent">{r.category}</span>
                  <span className={`badge ${levelColor[r.level] || 'badge-primary'}`}>{r.level}</span>
                  <span className="badge badge-primary">🎬 {r.videos?.length || 0} videos</span>
                </div>
              </div>
              <div style={{ padding: '12px 20px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray)', marginBottom: 8, lineHeight: 1.5 }}>{r.description?.substring(0, 80)}...</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--dark-3)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span>👨‍🏫 {r.instructor}</span>
                  <span>⏱ {r.duration}</span>
                </div>
                {r.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                    {r.tags.slice(0, 3).map(t => (
                      <span key={t} style={{ background: 'var(--light-gray)', padding: '2px 8px', borderRadius: 50, fontSize: '0.72rem', color: 'var(--dark-3)' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)} style={{ flex: 1 }}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(r._id)} style={{ flex: 1 }}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal-box" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>✏️ Edit Resource</h3>
              <button className="modal-close" onClick={() => setEditItem(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" name="title" className="form-control" value={editForm.title || ''} onChange={handleEditChange} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-control" value={editForm.category || ''} onChange={handleEditChange}>
                    {['Programming', 'Database', 'Web Development', 'Mobile Development', 'Cloud & DevOps', 'Data Science', 'Cybersecurity', 'UI/UX Design'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select name="level" className="form-control" value={editForm.level || ''} onChange={handleEditChange}>
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" rows={3} value={editForm.description || ''} onChange={handleEditChange} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Instructor</label>
                  <input type="text" name="instructor" className="form-control" value={editForm.instructor || ''} onChange={handleEditChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input type="text" name="duration" className="form-control" value={editForm.duration || ''} onChange={handleEditChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input type="text" name="tags" className="form-control" value={editForm.tags || ''} onChange={handleEditChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="isActive" className="form-control" value={editForm.isActive} onChange={e => setEditForm(p => ({ ...p, isActive: e.target.value === 'true' }))}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.95rem', margin: 0 }}>🎬 Video Playlist</h4>
                <span className="badge badge-accent">{editVideos.length} videos</span>
              </div>

              {editVideos.map((v, i) => (
                <div key={i} style={{ background: 'var(--light-gray)', borderRadius: 8, padding: 14, marginBottom: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--dark-3)' }}>Video {i + 1}</span>
                    {editVideos.length > 1 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeEditVideo(i)}>🗑</button>}
                  </div>
                  <div className="grid-2" style={{ gap: 10 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Title</label>
                      <input type="text" className="form-control" placeholder="Video title" value={v.title} onChange={e => handleVideoChange(i, 'title', e.target.value)} style={{ background: 'white' }} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>URL</label>
                      <input type="url" className="form-control" placeholder="https://youtube.com/..." value={v.url} onChange={e => handleVideoChange(i, 'url', e.target.value)} style={{ background: 'white' }} />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addEditVideo} style={{ width: '100%', padding: '10px', border: '2px dashed var(--accent)', borderRadius: 8, background: '#cffafe', color: 'var(--accent-dark)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: 20 }}>
                ➕ Add Video
              </button>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
                <button className="btn btn-accent" onClick={handleEditSave} disabled={saving}>
                  {saving ? 'Saving...' : '✅ Save Changes'}
                </button>
              </div>
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
              <p style={{ marginBottom: 24, color: 'var(--dark-3)' }}>Delete this resource? This cannot be undone.</p>
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

export default ManageTechnical;
