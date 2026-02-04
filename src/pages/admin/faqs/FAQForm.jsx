// FAQForm - Create/Edit FAQ
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../../services/api';

const FAQ_CATEGORIES = ['General', 'Registration', 'Payment', 'Events', 'Logistics', 'Technical'];

export default function FAQForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        category: 'General',
        question: '',
        answer: '',
        sortOrder: 0,
        isActive: true
    });

    useEffect(() => {
        if (isEdit) fetchFAQ();
    }, [id]);

    const fetchFAQ = async () => {
        try {
            const res = await api.get('/faqs');
            const faq = (res.data?.data?.faqs || []).find(f => f.id === id);
            if (faq) {
                setFormData({
                    category: faq.category || 'General',
                    question: faq.question || '',
                    answer: faq.answer || '',
                    sortOrder: faq.sortOrder || 0,
                    isActive: faq.isActive ?? true
                });
            }
        } catch (error) {
            console.error('Failed to fetch FAQ:', error);
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
            if (isEdit) {
                await api.put(`/faqs/${id}`, formData);
            } else {
                await api.post('/faqs', formData);
            }
            navigate('/admin/faqs');
        } catch (error) {
            console.error('Failed to save FAQ:', error);
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
                <button className="back-btn" onClick={() => navigate('/admin/faqs')}>
                    <ArrowLeft size={18} /> Back to FAQs
                </button>
                <h2>{isEdit ? 'Edit FAQ' : 'Add FAQ'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            {FAQ_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Sort Order</label>
                        <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} min="0" />
                    </div>
                    <div className="form-group full-width">
                        <label>Question *</label>
                        <input type="text" name="question" value={formData.question} onChange={handleChange} required />
                    </div>
                    <div className="form-group full-width">
                        <label>Answer *</label>
                        <textarea name="answer" value={formData.answer} onChange={handleChange} rows={5} required />
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                            <span>Active (visible to users)</span>
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/faqs')}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <><Loader2 className="spinner" size={16} /> Saving...</> : <><Save size={16} /> Save FAQ</>}
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
                .form-group input, .form-group textarea, .form-group select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; color: #fff; }
                .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: rgba(0,212,255,0.5); }
                .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
                .form-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: rgba(255,255,255,0.5); }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
