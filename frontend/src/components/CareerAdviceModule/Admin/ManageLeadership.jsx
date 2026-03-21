import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageLeadership = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editVideos, setEditVideos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/leadership/admin/all');
      setPrograms(res.data.data);
    } catch {
      toast.error('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/leadership/${id}`);
      toast.success('Program deleted!');
      setDeleteId(null);
      fetchPrograms();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (prog) => {
    setEditItem(prog);
    setEditForm({
      title: prog.title,
      category: prog.category,
      description: prog.description,
      instructor: prog.instructor,
      duration: prog.duration,
      level: prog.level,
      isActive: prog.isActive,
    });
    setEditVideos(prog.videos ? [...prog.videos.map(v => ({ title: v.title, url: v.url }))] : [{ title: '', url: '' }]);
  };

  const handleEditChange = (e) => setEditForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleVideoChange = (i, field, value) => {
    setEditVideos(prev => {
      const u = [...prev];
      u[i] = { ...u[i], [field]: value };
      return u;
    });
  };

  const addEditVideo = () => setEditVideos(p => [...p, { title: '', url: '' }]);
  const removeEditVideo = (i) => {
    if (editVideos.length === 1) { toast.warning('At least 1 video required'); return; }
    setEditVideos(p => p.filter((_, idx) => idx !== i));
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/leadership/${editItem._id}`, { ...editForm, videos: editVideos });
      toast.success('Program updated!');
      setEditItem(null);
      fetchPrograms();
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const levelColor = { Beginner: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-danger' };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Leadership Programs 🏆</h1>
          <p className="page-subtitle">{programs.length} program{programs.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchPrograms}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : programs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏆</div>
          <h3>No Programs Yet</h3>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--light-gray)', borderBottom: '2px solid var(--border)' }}>
                {['#', 'Title', 'Category', 'Instructor', 'Level', 'Videos', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {programs.map((p, i) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--light-gray)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', color: 'var(--gray)', fontSize: '0.85rem' }}>{i + 1}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</td>
                  <td style={{ padding: '14px 16px' }}><span className="badge badge-primary">{p.category}</span></td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--dark-3)' }}>{p.instructor}</td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge ${levelColor[p.level] || 'badge-primary'}`}>{p.level}</span></td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-accent">🎬 {p.videos?.length || 0}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p._id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal-box" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>✏️ Edit Program</h3>
              <button className="modal-close" onClick={() => setEditItem(null)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Basic info */}
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" name="title" className="form-control" value={editForm.title || ''} onChange={handleEditChange} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-control" value={editForm.category || ''} onChange={handleEditChange}>
                    {['Leadership', 'Soft Skills', 'Communication', 'Team Management', 'Problem Solving'].map(c => <option key={c}>{c}</option>)}
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
                <label className="form-label">Status</label>
                <select name="isActive" className="form-control" value={editForm.isActive} onChange={e => setEditForm(p => ({ ...p, isActive: e.target.value === 'true' }))}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="divider" />

              {/* Video Playlist */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.95rem', margin: 0 }}>🎬 Video Playlist</h4>
                <span className="badge badge-accent">{editVideos.length} videos</span>
              </div>

              {editVideos.map((v, i) => (
                <div key={i} style={{ background: 'var(--light-gray)', borderRadius: 8, padding: 14, marginBottom: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--dark-3)' }}>Video {i + 1}</span>
                    {editVideos.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeEditVideo(i)}>🗑</button>
                    )}
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

              <button
                type="button"
                onClick={addEditVideo}
                style={{
                  width: '100%', padding: '10px',
                  border: '2px dashed var(--primary)', borderRadius: 8,
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', marginBottom: 20
                }}
              >
                ➕ Add Video
              </button>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleEditSave} disabled={saving}>
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
              <p style={{ marginBottom: 24, color: 'var(--dark-3)' }}>Delete this program? This cannot be undone.</p>
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

export default ManageLeadership;
