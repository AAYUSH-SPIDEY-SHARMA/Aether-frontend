// SponsorForm - Create/Edit sponsor
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { sponsorsAPI, symposiumAPI } from '../../../services/api';
import ImageUpload from '../../../components/admin/ImageUpload';

const SPONSOR_TIERS = ['TITLE', 'GOLD', 'SILVER', 'BRONZE', 'PARTNER'];

export default function SponsorForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [symposiums, setSymposiums] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        tier: 'PARTNER',
        logoUrl: '',
        logoCrop: null,
        website: '',
        symposiumId: ''
    });

    useEffect(() => {
        fetchSymposiums();
        if (isEdit) fetchSponsor();
    }, [id]);

    const fetchSymposiums = async () => {
        try {
            const res = await symposiumAPI.getAll();
            const symps = res.data?.data?.symposiums || [];
            setSymposiums(symps);
            // Default to active symposium
            const active = symps.find(s => s.isActive);
            if (active && !isEdit) {
                setFormData(prev => ({ ...prev, symposiumId: active.id }));
            }
        } catch (error) {
            console.error('Failed to fetch symposiums:', error);
        }
    };

    const fetchSponsor = async () => {
        try {
            // Sponsors are in symposium data
            const res = await symposiumAPI.getActive();
            const sponsor = (res.data?.data?.symposium?.sponsors || []).find(s => s.id === id);
            if (sponsor) {
                setFormData({
                    name: sponsor.name || '',
                    tier: sponsor.tier || 'PARTNER',
                    logoUrl: sponsor.logoUrl || '',
                    logoCrop: sponsor.logoCrop || null,
                    website: sponsor.website || '',
                    symposiumId: sponsor.symposiumId || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch sponsor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await sponsorsAPI.update(id, formData);
            } else {
                await sponsorsAPI.create(formData);
            }
            navigate('/admin/sponsors');
        } catch (error) {
            console.error('Failed to save sponsor:', error);
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
                <button className="back-btn" onClick={() => navigate('/admin/sponsors')}>
                    <ArrowLeft size={18} /> Back to Sponsors
                </button>
                <h2>{isEdit ? 'Edit Sponsor' : 'Add Sponsor'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Tier *</label>
                        <select name="tier" value={formData.tier} onChange={handleChange} required>
                            {SPONSOR_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Symposium *</label>
                        <select name="symposiumId" value={formData.symposiumId} onChange={handleChange} required>
                            <option value="">Select symposium</option>
                            {symposiums.map(s => <option key={s.id} value={s.id}>{s.title} ({s.year})</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <ImageUpload
                            value={formData.logoUrl}
                            onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                            folder="sponsors"
                            label="Sponsor Logo"
                            aspectRatio="sponsor"
                            cropData={formData.logoCrop}
                            onCropChange={(crop) => setFormData(prev => ({ ...prev, logoCrop: JSON.stringify(crop) }))}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Website</label>
                        <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/sponsors')}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <><Loader2 className="spinner" size={16} /> Saving...</> : <><Save size={16} /> Save Sponsor</>}
                    </button>
                </div>
            </form>

            <style>{`
                .form-page { max-width: 700px; }
                .form-header { margin-bottom: 24px; }
                .form-header h2 { font-size: 1.5rem; color: #fff; margin-top: 12px; }
                .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); background: none; border: none; cursor: pointer; }
                .back-btn:hover { color: #00d4ff; }
                .admin-form { background: rgba(12,12,20,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
                .form-group input, .form-group select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; color: #fff; }
                .form-group input:focus, .form-group select:focus { outline: none; border-color: rgba(0,212,255,0.5); }
                .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
                .form-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: rgba(255,255,255,0.5); }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
