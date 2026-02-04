// SpeakerForm - Create/Edit speaker
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../../services/api';
import ImageUpload from '../../../components/admin/ImageUpload';

export default function SpeakerForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        company: '',
        bio: '',
        imageUrl: '',
        imageCrop: null,
        linkedin: '',
        twitter: '',
        topics: '',
        isFeatured: false,
        sortOrder: 0,
        isActive: true
    });

    useEffect(() => {
        if (isEdit) fetchSpeaker();
    }, [id]);

    const fetchSpeaker = async () => {
        try {
            const res = await api.get('/speakers');
            const speaker = (res.data?.data?.speakers || []).find(s => s.id === id);
            if (speaker) {
                setFormData({
                    name: speaker.name || '',
                    title: speaker.title || '',
                    company: speaker.company || '',
                    bio: speaker.bio || '',
                    imageUrl: speaker.imageUrl || '',
                    linkedin: speaker.linkedin || '',
                    twitter: speaker.twitter || '',
                    topics: Array.isArray(speaker.topics) ? speaker.topics.join(', ') : '',
                    isFeatured: speaker.isFeatured ?? false,
                    sortOrder: speaker.sortOrder || 0,
                    isActive: speaker.isActive ?? true,
                    imageCrop: speaker.imageCrop || null
                });
            }
        } catch (error) {
            console.error('Failed to fetch speaker:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                ...formData,
                topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean)
            };
            if (isEdit) {
                await api.put(`/speakers/${id}`, data);
            } else {
                await api.post('/speakers', data);
            }
            navigate('/admin/speakers');
        } catch (error) {
            console.error('Failed to save speaker:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="form-loading"><Loader2 className="spinner" size={32} /><span>Loading...</span></div>;
    }

    return (
        <div className="form-page">
            <div className="form-header">
                <button className="back-btn" onClick={() => navigate('/admin/speakers')}>
                    <ArrowLeft size={18} /> Back to Speakers
                </button>
                <h2>{isEdit ? 'Edit Speaker' : 'Add Speaker'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="AI Research Lead" required />
                    </div>
                    <div className="form-group">
                        <label>Company</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Google DeepMind" />
                    </div>
                    <div className="form-group">
                        <ImageUpload
                            value={formData.imageUrl}
                            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            folder="speakers"
                            label="Speaker Photo"
                            aspectRatio="speaker"
                            cropData={formData.imageCrop}
                            onCropChange={(crop) => setFormData(prev => ({ ...prev, imageCrop: JSON.stringify(crop) }))}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} />
                    </div>
                    <div className="form-group full-width">
                        <label>Topics (comma-separated)</label>
                        <input type="text" name="topics" value={formData.topics} onChange={handleChange} placeholder="AI, Machine Learning, Neural Networks" />
                    </div>
                    <div className="form-group">
                        <label>LinkedIn</label>
                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Twitter</label>
                        <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Sort Order</label>
                        <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} min="0" />
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                            <span>Featured Speaker</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                            <span>Active</span>
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/speakers')}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <><Loader2 className="spinner" size={16} /> Saving...</> : <><Save size={16} /> Save Speaker</>}
                    </button>
                </div>
            </form>

            <style>{`
                .form-page { max-width: 800px; }
                .form-header { margin-bottom: 24px; }
                .form-header h2 { font-size: 1.5rem; color: #fff; margin-top: 12px; }
                .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); background: none; border: none; cursor: pointer; }
                .back-btn:hover { color: #00d4ff; }
                .admin-form { background: rgba(12,12,20,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
                .form-group input, .form-group textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; color: #fff; }
                .form-group input:focus, .form-group textarea:focus { outline: none; border-color: rgba(0,212,255,0.5); }
                .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; margin-bottom: 8px; }
                .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
                .form-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: rgba(255,255,255,0.5); }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
