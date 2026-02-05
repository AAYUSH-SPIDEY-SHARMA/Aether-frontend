// TeamForm - Create/Edit team member (ClubMember)
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { teamAPI, wingsAPI, symposiumAPI } from '../../../services/api';
import ImageUpload from '../../../components/admin/ImageUpload';

const MEMBER_TYPES = [
    'FACULTY',
    'CLUB_COORDINATOR',
    'WING_COORDINATOR',
    'CORE_MEMBER',
    'SYMPOSIUM_COORDINATOR',
    'SYMPOSIUM_CORE',
    'SYMPOSIUM_VOLUNTEER'
];

export default function TeamForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [wings, setWings] = useState([]);
    const [symposiums, setSymposiums] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        program: '',
        primaryRole: '',
        secondaryRole: '',
        highlightTag: '',
        type: 'CORE_MEMBER',
        wingId: '',
        symposiumId: '',
        imageUrl: '',
        imageCrop: null,
        linkedin: '',
        github: '',
        instagram: '',
        email: '',
        sortOrder: 0,
        isActive: true
    });

    useEffect(() => {
        fetchOptions();
        if (isEdit) fetchMember();
    }, [id]);

    const fetchOptions = async () => {
        try {
            const [wingsRes, sympRes] = await Promise.all([
                wingsAPI.getAll(),
                symposiumAPI.getAll()
            ]);
            setWings(wingsRes.data?.data?.wings || []);
            setSymposiums(sympRes.data?.data?.symposiums || []);
        } catch (error) {
            console.error('Failed to fetch options:', error);
        }
    };

    const fetchMember = async () => {
        try {
            // For edit, we need to get the member - using team/all and filtering
            const res = await teamAPI.getAll();
            const member = (res.data?.data?.members || []).find(m => m.id === id);
            if (member) {
                setFormData({
                    name: member.name || '',
                    program: member.program || '',
                    primaryRole: member.primaryRole || '',
                    secondaryRole: member.secondaryRole || '',
                    highlightTag: member.highlightTag || '',
                    type: member.type || 'CORE_MEMBER',
                    wingId: member.wingId || '',
                    symposiumId: member.symposiumId || '',
                    imageUrl: member.imageUrl || '',
                    linkedin: member.linkedin || '',
                    github: member.github || '',
                    instagram: member.instagram || '',
                    email: member.email || '',
                    sortOrder: member.sortOrder || 0,
                    isActive: member.isActive ?? true,
                    imageCrop: member.imageCrop || null
                });
            }
        } catch (error) {
            console.error('Failed to fetch member:', error);
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
            const data = { ...formData };
            if (!data.wingId) delete data.wingId;
            if (!data.symposiumId) delete data.symposiumId;

            if (isEdit) {
                await teamAPI.update(id, data);
            } else {
                await teamAPI.create(data);
            }
            navigate('/admin/team');
        } catch (error) {
            console.error('Failed to save member:', error);
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
                <button className="back-btn" onClick={() => navigate('/admin/team')}>
                    <ArrowLeft size={18} /> Back to Team
                </button>
                <h2>{isEdit ? 'Edit Team Member' : 'Add Team Member'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Program *</label>
                        <input type="text" name="program" value={formData.program} onChange={handleChange} placeholder="B.Tech CSE, 3rd Year" required />
                    </div>
                    <div className="form-group">
                        <label>Primary Role *</label>
                        <input type="text" name="primaryRole" value={formData.primaryRole} onChange={handleChange} placeholder="Technical Lead" required />
                    </div>
                    <div className="form-group">
                        <label>Secondary Role</label>
                        <input type="text" name="secondaryRole" value={formData.secondaryRole} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Type *</label>
                        <select name="type" value={formData.type} onChange={handleChange} required>
                            {MEMBER_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Highlight Tag</label>
                        <input type="text" name="highlightTag" value={formData.highlightTag} onChange={handleChange} placeholder="Founder" />
                    </div>
                    <div className="form-group">
                        <label>Wing</label>
                        <select name="wingId" value={formData.wingId} onChange={handleChange}>
                            <option value="">No Wing</option>
                            {wings.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Symposium</label>
                        <select name="symposiumId" value={formData.symposiumId} onChange={handleChange}>
                            <option value="">No Symposium</option>
                            {symposiums.map(s => <option key={s.id} value={s.id}>{s.title} ({s.year})</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <ImageUpload
                            value={formData.imageUrl}
                            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            folder="team"
                            label="Profile Photo"
                            aspectRatio="profile"
                            cropData={formData.imageCrop}
                            onCropChange={(crop) => setFormData(prev => ({ ...prev, imageCrop: JSON.stringify(crop) }))}
                        />
                    </div>
                    <div className="form-group">
                        <label>LinkedIn</label>
                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>GitHub</label>
                        <input type="url" name="github" value={formData.github} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Instagram</label>
                        <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://instagram.com/username" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Sort Order</label>
                        <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} min="0" placeholder="0" />
                        <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Lower numbers appear first</small>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                            <span>Active</span>
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/team')}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <><Loader2 className="spinner" size={16} /> Saving...</> : <><Save size={16} /> Save Member</>}
                    </button>
                </div>
            </form>

            <style>{`
                .form-page { max-width: 900px; }
                .form-header { margin-bottom: 24px; }
                .form-header h2 { font-size: 1.5rem; color: #fff; margin-top: 12px; }
                .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); background: none; border: none; cursor: pointer; }
                .back-btn:hover { color: #00d4ff; }
                .admin-form { background: rgba(12,12,20,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group label { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
                .form-group input, .form-group select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; color: #fff; }
                .form-group select option { background: #1a1a2e; color: #fff; padding: 10px; }
                .form-group input:focus, .form-group select:focus { outline: none; border-color: rgba(0,212,255,0.5); }
                .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
                .form-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: rgba(255,255,255,0.5); }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
