// SymposiumForm - Create/Edit symposium
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { symposiumAPI } from '../../../services/api';

export default function SymposiumForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        title: '',
        theme: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        venueDetails: '',
        isActive: false
    });

    useEffect(() => {
        if (isEdit) fetchSymposium();
    }, [id]);

    const fetchSymposium = async () => {
        try {
            const res = await symposiumAPI.getAll();
            const symposium = (res.data?.data?.symposiums || []).find(s => s.id === id);
            if (symposium) {
                setFormData({
                    year: symposium.year,
                    title: symposium.title || '',
                    theme: symposium.theme || '',
                    description: symposium.description || '',
                    startDate: symposium.startDate?.split('T')[0] || '',
                    endDate: symposium.endDate?.split('T')[0] || '',
                    location: symposium.location || '',
                    venueDetails: symposium.venueDetails || '',
                    isActive: symposium.isActive ?? false
                });
            }
        } catch (error) {
            console.error('Failed to fetch symposium:', error);
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
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate)
            };
            if (isEdit) {
                await symposiumAPI.update(id, data);
            } else {
                await symposiumAPI.create(data);
            }
            navigate('/admin/symposium');
        } catch (error) {
            console.error('Failed to save symposium:', error);
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
                <button className="back-btn" onClick={() => navigate('/admin/symposium')}>
                    <ArrowLeft size={18} /> Back to Symposiums
                </button>
                <h2>{isEdit ? 'Edit Symposium' : 'Create New Symposium'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Year *</label>
                        <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="AETHER Symposium 2026" required />
                    </div>
                    <div className="form-group full-width">
                        <label>Theme</label>
                        <input type="text" name="theme" value={formData.theme} onChange={handleChange} placeholder="AI & Data Science for Sustainability" />
                    </div>
                    <div className="form-group full-width">
                        <label>Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
                    </div>
                    <div className="form-group">
                        <label>Start Date *</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>End Date *</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Location *</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="IIIT Lucknow Campus" required />
                    </div>
                    <div className="form-group">
                        <label>Venue Details</label>
                        <input type="text" name="venueDetails" value={formData.venueDetails} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/symposium')}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <><Loader2 className="spinner" size={16} /> Saving...</> : <><Save size={16} /> Save Symposium</>}
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
                .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
                .form-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: rgba(255,255,255,0.5); }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
