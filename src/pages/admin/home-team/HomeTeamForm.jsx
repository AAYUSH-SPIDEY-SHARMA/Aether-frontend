// HomeTeamForm - Admin form for adding/editing Home page featured coordinators
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { teamAPI } from '../../../services/api';
import ImageUpload from '../../../components/admin/ImageUpload';
import '../Admin.css';

export default function HomeTeamForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        program: '',
        primaryRole: '',
        secondaryRole: '',
        highlightTag: '',
        type: 'HOME_FEATURED', // Fixed type for this form
        imageUrl: '',
        imageCrop: null,
        linkedin: '',
        github: '',
        instagram: '',
        email: '',
        isActive: true,
        sortOrder: 0
    });

    useEffect(() => {
        if (isEdit) fetchMember();
    }, [id]);

    const fetchMember = async () => {
        try {
            // Use getAll and filter - same pattern as TeamForm
            const res = await teamAPI.getAll();
            const allMembers = res.data?.data?.members || [];
            const member = allMembers.find(m => m.id === id);
            if (member) {
                setFormData({
                    name: member.name || '',
                    program: member.program || '',
                    primaryRole: member.primaryRole || '',
                    secondaryRole: member.secondaryRole || '',
                    highlightTag: member.highlightTag || '',
                    type: 'HOME_FEATURED',
                    imageUrl: member.imageUrl || '',
                    imageCrop: member.imageCrop || null,
                    linkedin: member.linkedin || '',
                    github: member.github || '',
                    instagram: member.instagram || '',
                    email: member.email || '',
                    isActive: member.isActive ?? true,
                    sortOrder: member.sortOrder || 0
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
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                type: 'HOME_FEATURED',
                sortOrder: parseInt(formData.sortOrder) || 0
            };

            if (isEdit) {
                await teamAPI.update(id, payload);
            } else {
                await teamAPI.create(payload);
            }
            navigate('/admin/home-team');
        } catch (error) {
            console.error('Failed to save member:', error);
            alert('Failed to save member. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading-state">Loading...</div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <div className="header-content">
                    <button onClick={() => navigate('/admin/home-team')} className="btn btn-ghost">
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <div>
                        <h1>{isEdit ? 'Edit' : 'Add'} Home Team Member</h1>
                        <p className="page-subtitle">
                            {isEdit ? 'Update' : 'Add'} a featured coordinator for the Home page
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    {/* Left Column - Basic Info */}
                    <div className="form-section">
                        <h3 className="section-title">Basic Information</h3>

                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Primary Role *</label>
                            <input
                                type="text"
                                name="primaryRole"
                                value={formData.primaryRole}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Overall Coordinator, Wing Lead"
                            />
                        </div>

                        <div className="form-group">
                            <label>Program</label>
                            <input
                                type="text"
                                name="program"
                                value={formData.program}
                                onChange={handleChange}
                                placeholder="e.g., M.Sc. AI/ML 2024"
                            />
                        </div>

                        <div className="form-group">
                            <label>Sort Order</label>
                            <input
                                type="number"
                                name="sortOrder"
                                value={formData.sortOrder}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                            />
                            <small>Lower numbers appear first</small>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                Active (visible on Home page)
                            </label>
                        </div>
                    </div>

                    {/* Right Column - Image & Socials */}
                    <div className="form-section">
                        <h3 className="section-title">Profile Image</h3>

                        <div className="form-group">
                            <ImageUpload
                                value={formData.imageUrl}
                                onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                folder="team"
                                aspectRatio="home_featured"
                                cropData={formData.imageCrop}
                                onCropChange={(crop) => setFormData(prev => ({ ...prev, imageCrop: JSON.stringify(crop) }))}
                            />
                            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                                Recommended: Use "Home Featured (11:10)" crop preset
                            </small>
                        </div>

                        <h3 className="section-title" style={{ marginTop: '1.5rem' }}>Social Links</h3>

                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>GitHub</label>
                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Instagram</label>
                            <input
                                type="url"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@iiitl.ac.in"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/home-team')} className="btn btn-ghost">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        <Save size={18} />
                        {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')} Member
                    </button>
                </div>
            </form>
        </div>
    );
}
