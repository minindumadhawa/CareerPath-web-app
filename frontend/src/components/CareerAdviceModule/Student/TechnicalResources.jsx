import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStudent } from '../../../context/CareerAdviceModule/StudentContext';
import { generateCertificate } from '../../../utils/CareerAdviceModule/generateCertificate';

const levelColor = { Beginner: 'badge-success', Intermediate: 'badge-warning', Advanced: 'badge-danger' };
const catColors = { Programming: '#7c3aed', Database: '#0891b2', 'Web Development': '#1a56db', 'Mobile Development': '#059669', 'Cloud & DevOps': '#ea580c', 'Data Science': '#db2777', 'Cybersecurity': '#dc2626', 'UI/UX Design': '#d97706' };

const getYoutubeEmbed = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const StudentLoginModal = ({ onLogin, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const submit = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onLogin(name.trim(), email.trim());
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>👋 Enter Your Details</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: 20 }}>Enter your details to enroll and track your progress.</p>
          <div className="form-group">
            <label className="form-label">Full Name <span>*</span></label>
            <input type="text" className={`form-control ${errors.name ? 'error' : ''}`} placeholder="e.g. Kasun Perera" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }} />
            {errors.name && <p className="error-text">⚠ {errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email <span>*</span></label>
            <input type="email" className={`form-control ${errors.email ? 'error' : ''}`} placeholder="e.g. kasun@gmail.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }} />
            {errors.email && <p className="error-text">⚠ {errors.email}</p>}
          </div>
          <button className="btn btn-accent btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={submit}>Continue →</button>
        </div>
      </div>
    </div>
  );
};

const TechnicalResources = () => {
  const { student, login } = useStudent();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const [enrollment, setEnrollment] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingResource, setPendingResource] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [watchTimer, setWatchTimer] = useState(15);
  const [canMarkWatched, setCanMarkWatched] = useState(false);
  const [studentEnrollments, setStudentEnrollments] = useState([]);

  const categories = ['All', 'Programming', 'Database', 'Web Development', 'Mobile Development', 'Cloud & DevOps', 'Data Science', 'Cybersecurity', 'UI/UX Design'];

  useEffect(() => {
    if (student) {
      axios.get(`/api/enrollments/student/${student.email}`)
        .then(res => setStudentEnrollments(res.data.data))
        .catch(() => { });
    } else {
      setStudentEnrollments([]);
    }
  }, [student]);

  useEffect(() => {
    axios.get('/api/technical')
      .then(res => setResources(res.data.data))
      .catch(() => toast.error('Failed to load resources'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter(r =>
    (filter === 'All' || r.category === filter) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.instructor.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  useEffect(() => {
    if (!selected) return;
    setCanMarkWatched(false);
    setWatchTimer(15);
    const interval = setInterval(() => {
      setWatchTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanMarkWatched(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selected, activeVideo]);

  const fetchEnrollment = async (resourceId, email) => {
    try {
      const res = await axios.get(`/api/enrollments/student/${email}`);
      const found = res.data.data.find(e => e.programId?._id === resourceId || e.programId === resourceId);
      setEnrollment(found || null);
    } catch { setEnrollment(null); }
  };

  const openResource = async (r) => {
    setSelected(r);
    setActiveVideo(0);
    if (student) await fetchEnrollment(r._id, student.email);
    else setEnrollment(null);
  };

  const handleEnroll = async (name, email, targetResource = null) => {
    if (name && email) login(name, email);
    const s = name ? { name, email } : student;
    const res = pendingResource || selected || targetResource;

    if (!res) {
      toast.error('Could not determine resource to enroll in.');
      return;
    }

    setEnrolling(true);
    try {
      const response = await axios.post('/api/enrollments', {
        studentName: s.name,
        studentEmail: s.email,
        programId: res._id,
        programType: 'TechnicalResource'
      });
      setEnrollment(response.data.data);
      if (!response.data.alreadyEnrolled) {
        setStudentEnrollments(prev => [...prev, response.data.data]);
      }
      if (response.data.alreadyEnrolled) toast.info('Already enrolled!');
      else toast.success('🎉 Enrolled successfully!');
      setShowLogin(false);
      setPendingResource(null);
      if (!selected) setSelected(res);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
    finally { setEnrolling(false); }
  };

  const handleEnrollClick = (r) => {
    if (!student) { setPendingResource(r); setShowLogin(true); }
    else handleEnroll(null, null, r);
  };

  const markVideoWatched = async (videoIndex) => {
    if (!enrollment || enrollment.watchedVideos?.includes(videoIndex)) return;
    try {
      const res = await axios.patch(`/api/enrollments/${enrollment._id}/watch`, { videoIndex });
      setEnrollment(res.data.data);
    } catch { /* silent */ }
  };

  const markComplete = async () => {
    if (!enrollment) return;
    try {
      const res = await axios.patch(`/api/enrollments/${enrollment._id}/complete`);
      setEnrollment(res.data.data);
      toast.success('🎓 Course completed! Certificate ready.');
    } catch { toast.error('Failed to update'); }
  };

  const downloadCertificate = () => {
    generateCertificate({
      studentName: student?.name && student.name !== 'Student' ? student.name : (student?.email?.split('@')[0] || 'Student'),
      programTitle: selected.title,
      category: selected.category,
      instructor: selected.instructor,
      completedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    });
  };

  const watchedCount = enrollment?.watchedVideos?.length || 0;
  const totalVideos = selected?.videos?.length || 0;
  const progressPct = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Technical Resources 💻</h1>
          <p className="page-subtitle">Enhance your technical skills with curated video courses</p>
        </div>
        {student && (
          <div style={{ background: '#cffafe', padding: '8px 16px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-dark)' }}>
            👋 {student.name}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" className="form-control" placeholder="🔍 Search by title, instructor, or tag..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(c => (
          <button key={c} className={`btn btn-sm ${filter === c ? 'btn-accent' : 'btn-secondary'}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">💻</div><h3>No Resources Found</h3></div>
      ) : (
        <div className="grid-3">
          {filtered.map(r => (
            <div className="card" key={r._id} style={{ cursor: 'pointer' }} onClick={() => openResource(r)}>
              <div style={{ height: 6, background: catColors[r.category] || 'var(--accent)', borderRadius: '12px 12px 0 0' }} />
              <div style={{ height: 110, background: 'linear-gradient(135deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', position: 'relative' }}>
                <span>▶️</span>
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '3px 8px', fontSize: '0.72rem', color: 'white', fontWeight: 600 }}>{r.duration}</div>
              </div>
              <div style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-accent">{r.category}</span>
                  <span className={`badge ${levelColor[r.level] || 'badge-primary'}`}>{r.level}</span>
                  <span className="badge badge-primary">🎬 {r.videos?.length || 0} videos</span>
                </div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: 6, lineHeight: 1.4 }}>{r.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: 8, lineHeight: 1.5 }}>{r.description?.substring(0, 80)}...</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--dark-3)', marginBottom: 8 }}>👨‍🏫 {r.instructor}</div>
                {r.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {r.tags.slice(0, 3).map(t => <span key={t} style={{ background: 'var(--light-gray)', padding: '2px 8px', borderRadius: 50, fontSize: '0.72rem', color: 'var(--dark-3)' }}>{t}</span>)}
                  </div>
                )}
              </div>
              {r.videos?.length > 0 && (
                <div style={{ padding: '0 18px 10px' }}>
                  {r.videos.slice(0, 2).map((v, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderTop: i === 0 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ width: 20, height: 20, background: '#cffafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--accent-dark)', fontWeight: 700, flexShrink: 0 }}>▶</div>
                      <span style={{ fontSize: '0.77rem', color: 'var(--dark-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</span>
                    </div>
                  ))}
                  {r.videos.length > 2 && <p style={{ fontSize: '0.73rem', color: 'var(--accent)', marginTop: 4, fontWeight: 600 }}>+{r.videos.length - 2} more...</p>}
                </div>
              )}
              <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                {studentEnrollments.some(e => e.programId?._id === r._id || e.programId === r._id) ? (
                  <button className="btn btn-success btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={e => { e.stopPropagation(); openResource(r); }}>
                    ✅ Enrolled
                  </button>
                ) : (
                  <button className="btn btn-accent btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={e => { e.stopPropagation(); handleEnrollClick(r); }}>
                    🚀 Enroll
                  </button>
                )}
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>▶ View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resource Detail + Playlist Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" style={{ maxWidth: 860, width: '95%' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: 8, background: catColors[selected.category] || 'var(--accent)', borderRadius: '20px 20px 0 0' }} />
            <div className="modal-header">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-accent">{selected.category}</span>
                  <span className={`badge ${levelColor[selected.level]}`}>{selected.level}</span>
                  <span className="badge badge-primary">🎬 {selected.videos?.length} videos</span>
                  {enrollment?.isCompleted && <span className="badge badge-success">✅ Completed</span>}
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{selected.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 3 }}>👨‍🏫 {selected.instructor} · ⏱ {selected.duration}</p>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* Progress bar */}
            {enrollment && (
              <div style={{ padding: '10px 24px', background: '#cffafe', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-dark)' }}>📊 Your Progress</span>
                  <span style={{ color: 'var(--accent-dark)', fontWeight: 700 }}>{watchedCount}/{totalVideos} videos watched ({progressPct}%)</span>
                </div>
                <div style={{ background: 'rgba(6,182,212,0.2)', borderRadius: 50, height: 8, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${progressPct}%`, background: progressPct === 100 ? 'var(--success)' : 'var(--accent)', borderRadius: 50, transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {progressPct === 100 && !enrollment.isCompleted && (
                    <button className="btn btn-success btn-sm" onClick={markComplete}>🎓 Mark as Complete</button>
                  )}
                  {enrollment.isCompleted && (
                    <>
                      <span className="badge badge-success">✅ Completed</span>
                      <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg, #d4af37, #f0d060)', color: '#1a1a00', fontWeight: 700, border: 'none' }} onClick={downloadCertificate}>
                        🏅 Download Certificate
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Not enrolled banner */}
            {!enrollment && (
              <div style={{ padding: '12px 24px', background: '#fef3c7', borderBottom: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 500 }}>⚠️ Enroll to track your progress and mark videos as watched</span>
                <button className="btn btn-sm" style={{ background: '#f59e0b', color: 'white', fontWeight: 700 }} disabled={enrolling} onClick={() => handleEnrollClick(selected)}>
                  {enrolling ? 'Enrolling...' : '🚀 Enroll Now'}
                </button>
              </div>
            )}

            <div className="modal-body" style={{ padding: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', minHeight: 400 }}>
                {/* Left — Video Player */}
                <div style={{ padding: '20px', borderRight: '1px solid var(--border)' }}>
                  {selected.videos?.[activeVideo] && (
                    <>
                      {getYoutubeEmbed(selected.videos[activeVideo].url) ? (
                        <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 10, overflow: 'hidden', background: '#000', marginBottom: 12 }}>
                          <iframe src={getYoutubeEmbed(selected.videos[activeVideo].url)} title={selected.videos[activeVideo].title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                        </div>
                      ) : (
                        <div style={{ background: '#1e293b', borderRadius: 10, padding: '40px 20px', textAlign: 'center', marginBottom: 12 }}>
                          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎬</div>
                          <a href={selected.videos[activeVideo].url} target="_blank" rel="noreferrer" className="btn btn-accent btn-lg" style={{ display: 'inline-flex', textDecoration: 'none' }}>▶ Open Video</a>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{selected.videos[activeVideo].title}</h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>Video {activeVideo + 1} of {selected.videos.length}</p>
                          {selected.videos[activeVideo].url && (
                            <a href={selected.videos[activeVideo].url} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>🔗 Open in new tab →</a>
                          )}
                        </div>
                        {enrollment && !enrollment.watchedVideos?.includes(activeVideo) && (
                          <button
                            className={`btn ${canMarkWatched ? 'btn-success' : 'btn-secondary'} btn-sm`}
                            onClick={() => canMarkWatched && markVideoWatched(activeVideo)}
                            disabled={!canMarkWatched}
                          >
                            {canMarkWatched ? '✅ Mark as Watched' : `⏳ Playing... (${watchTimer}s to unlock)`}
                          </button>
                        )}
                        {enrollment?.watchedVideos?.includes(activeVideo) && (
                          <span style={{ background: '#d1fae5', color: '#059669', padding: '6px 12px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700 }}>✅ Watched</span>
                        )}
                      </div>
                    </>
                  )}
                  <div className="divider" />
                  <p style={{ fontSize: '0.85rem', color: 'var(--dark-3)', lineHeight: 1.7 }}>{selected.description}</p>
                  {selected.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                      {selected.tags.map(t => <span key={t} style={{ background: '#cffafe', color: 'var(--accent-dark)', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>)}
                    </div>
                  )}
                </div>

                {/* Right — Playlist */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--light-gray)' }}>
                    <h4 style={{ fontSize: '0.875rem', margin: 0 }}>📋 Course Playlist</h4>
                    <p style={{ fontSize: '0.73rem', color: 'var(--gray)', margin: '2px 0 0' }}>{selected.videos?.length} videos</p>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', maxHeight: 420 }}>
                    {selected.videos?.map((v, i) => {
                      const isWatched = enrollment?.watchedVideos?.includes(i);
                      return (
                        <div key={i} onClick={() => setActiveVideo(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', cursor: 'pointer', background: activeVideo === i ? '#cffafe' : 'transparent', borderLeft: activeVideo === i ? '3px solid var(--accent)' : '3px solid transparent', borderBottom: '1px solid var(--border)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { if (activeVideo !== i) e.currentTarget.style.background = 'var(--light-gray)'; }}
                          onMouseLeave={e => { if (activeVideo !== i) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: isWatched ? 'var(--success)' : activeVideo === i ? 'var(--accent)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: (isWatched || activeVideo === i) ? 'white' : 'var(--gray)', fontWeight: 700 }}>
                            {isWatched ? '✓' : activeVideo === i ? '▶' : i + 1}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: activeVideo === i ? 600 : 400, color: activeVideo === i ? 'var(--accent-dark)' : 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{v.title}</p>
                            {isWatched && <span style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 600 }}>Watched</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} disabled={activeVideo === 0} onClick={() => setActiveVideo(v => v - 1)}>← Prev</button>
                    <button className="btn btn-accent btn-sm" style={{ flex: 1, justifyContent: 'center' }} disabled={activeVideo === (selected.videos?.length || 1) - 1} onClick={() => setActiveVideo(v => v + 1)}>Next →</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <StudentLoginModal onLogin={(name, email) => handleEnroll(name, email)} onClose={() => { setShowLogin(false); setPendingResource(null); }} />
      )}
    </div>
  );
};

export default TechnicalResources;
