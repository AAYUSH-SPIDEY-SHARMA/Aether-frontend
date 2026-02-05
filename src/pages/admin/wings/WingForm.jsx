// WingForm - Create/Edit wing form with Gallery Management
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { wingsAPI } from '../../../services/api';
import ImageUpload from '../../../components/admin/ImageUpload';

export default function WingForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        tagline: '',
        description: '',
        mission: '',
        color: '#00d4ff',
        logoUrl: '',
        logoCrop: null,
        isActive: true
    });

    // Gallery state
    const [gallery, setGallery] = useState([]);
    const [showAddGallery, setShowAddGallery] = useState(false);
    const [newGalleryItem, setNewGalleryItem] = useState({
        imageUrl: '',
        imageCrop: null,
        title: '',
        year: new Date().getFullYear().toString()
    });
    const [savingGallery, setSavingGallery] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchWing();
            fetchGallery();
        }
    }, [id]);

    const fetchWing = async () => {
        try {
            // Fetch all wings and find the one by ID since the edit URL uses UUID
            const res = await wingsAPI.getAll();
            const wings = res.data?.data?.wings || [];
            const wing = wings.find(w => w.id === id);
            if (wing) {
                setFormData({
                    name: wing.name || '',
                    slug: wing.slug || '',
                    tagline: wing.tagline || '',
                    description: wing.description || '',
                    mission: wing.mission || '',
                    color: wing.color || '#00d4ff',
                    logoUrl: wing.logoUrl || '',
                    logoCrop: wing.logoCrop || null,
                    isActive: wing.isActive ?? true
                });
            }
        } catch (error) {
            console.error('Failed to fetch wing:', error);
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
            if (isEdit) {
                await wingsAPI.update(id, formData);
            } else {
                await wingsAPI.create(formData);
            }
            navigate('/admin/wings');
        } catch (error) {
            console.error('Failed to save wing:', error);
        } finally {
            setSaving(false);
        }
    };

    // Gallery functions
    const fetchGallery = async () => {
        try {
            const res = await wingsAPI.getGallery(id);
            setGallery(res.data?.data?.gallery || []);
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
        }
    };

    const handleAddGalleryImage = async () => {
        if (!newGalleryItem.imageUrl || !newGalleryItem.title) return;

        setSavingGallery(true);
        try {
            await wingsAPI.addGalleryImage({
                wingId: id,
                imageUrl: newGalleryItem.imageUrl,
                imageCrop: newGalleryItem.imageCrop,
                title: newGalleryItem.title,
                year: newGalleryItem.year
            });
            setNewGalleryItem({ imageUrl: '', imageCrop: null, title: '', year: new Date().getFullYear().toString() });
            setShowAddGallery(false);
            fetchGallery();
        } catch (error) {
            console.error('Failed to add gallery image:', error);
        } finally {
            setSavingGallery(false);
        }
    };

    const handleDeleteGalleryImage = async (imageId) => {
        if (!confirm('Delete this gallery image?')) return;
        try {
            await wingsAPI.deleteGalleryImage(imageId);
            fetchGallery();
        } catch (error) {
            console.error('Failed to delete gallery image:', error);
        }
    };

    if (loading) {
        return (
            <div className="form-loading">
                <Loader2 className="spinner" size={32} />
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className="form-page">
            <div className="form-header">
                <button className="back-btn" onClick={() => navigate('/admin/wings')}>
                    <ArrowLeft size={18} />
                    Back to Wings
                </button>
                <h2>{isEdit ? 'Edit Wing' : 'Create New Wing'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Web & Coding Wing"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="wnc"
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Tagline</label>
                        <input
                            type="text"
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            placeholder="Building the future through code"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Full description of the wing..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Mission</label>
                        <textarea
                            name="mission"
                            value={formData.mission}
                            onChange={handleChange}
                            placeholder="Wing mission statement..."
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>Color</label>
                        <div className="color-input">
                            <input
                                type="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                value={formData.color}
                                onChange={handleChange}
                                name="color"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <ImageUpload
                            value={formData.logoUrl}
                            onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                            folder="wings"
                            label="Wing Logo"
                            aspectRatio="logo"
                            cropData={formData.logoCrop}
                            onCropChange={(crop) => setFormData(prev => ({ ...prev, logoCrop: JSON.stringify(crop) }))}
                        />
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                            <span>Active</span>
                        </label>
                    </div>
                </div>

                {/* Gallery Section - Only show when editing */}
                {isEdit && (
                    <div className="gallery-section">
                        <div className="gallery-header">
                            <h3><ImageIcon size={18} /> Wing Gallery</h3>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={() => setShowAddGallery(true)}
                            >
                                <Plus size={14} /> Add Image
                            </button>
                        </div>

                        {/* Add Gallery Modal */}
                        {showAddGallery && (
                            <div className="gallery-add-form">
                                <div className="gallery-add-header">
                                    <span>Add Gallery Image</span>
                                    <button type="button" onClick={() => setShowAddGallery(false)}>
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="gallery-add-body">
                                    <ImageUpload
                                        value={newGalleryItem.imageUrl}
                                        onChange={(url) => setNewGalleryItem(prev => ({ ...prev, imageUrl: url }))}
                                        folder="gallery"
                                        label="Gallery Image"
                                        aspectRatio="gallery"
                                        cropData={newGalleryItem.imageCrop}
                                        onCropChange={(crop) => setNewGalleryItem(prev => ({ ...prev, imageCrop: JSON.stringify(crop) }))}
                                    />
                                    <div className="gallery-add-fields">
                                        <input
                                            type="text"
                                            placeholder="Title *"
                                            value={newGalleryItem.title}
                                            onChange={(e) => setNewGalleryItem(prev => ({ ...prev, title: e.target.value }))}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Year"
                                            value={newGalleryItem.year}
                                            onChange={(e) => setNewGalleryItem(prev => ({ ...prev, year: e.target.value }))}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleAddGalleryImage}
                                        disabled={savingGallery || !newGalleryItem.imageUrl || !newGalleryItem.title}
                                    >
                                        {savingGallery ? <Loader2 size={14} className="spinner" /> : <Plus size={14} />}
                                        Add to Gallery
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Gallery Grid */}
                        <div className="gallery-grid">
                            {gallery.length === 0 ? (
                                <p className="gallery-empty">No gallery images yet. Add some to showcase this wing!</p>
                            ) : (
                                gallery.map((img) => (
                                    <div key={img.id} className="gallery-item">
                                        <img src={img.imageUrl} alt={img.title} />
                                        <div className="gallery-item-info">
                                            <span>{img.title}</span>
                                            {img.year && <small>{img.year}</small>}
                                        </div>
                                        <button
                                            type="button"
                                            className="gallery-delete-btn"
                                            onClick={() => handleDeleteGalleryImage(img.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/wings')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <><Loader2 className="spinner" size={16} /> Saving...</> : <><Save size={16} /> Save Wing</>}
                    </button>
                </div>
            </form>

            <style>{`
                .form-page { max-width: 800px; }
                .form-header { margin-bottom: 24px; }
                .form-header h2 { font-size: 1.5rem; color: #fff; margin-top: 12px; }
                .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); background: none; border: none; cursor: pointer; font-size: 0.9rem; }
                .back-btn:hover { color: #00d4ff; }
                .admin-form { background: rgba(12,12,20,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.7); }
                .form-group input, .form-group textarea, .form-group select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 14px; color: #fff; font-size: 0.9rem; }
                .form-group select option { background: #1a1a2e; color: #fff; padding: 10px; }
                .form-group input:focus, .form-group textarea:focus { outline: none; border-color: rgba(0,212,255,0.5); }
                .color-input { display: flex; gap: 10px; }
                .color-input input[type="color"] { width: 48px; height: 42px; border: none; border-radius: 8px; cursor: pointer; }
                .color-input input[type="text"] { flex: 1; }
                .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .checkbox-label input { width: 18px; height: 18px; }
                .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
                .form-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: rgba(255,255,255,0.5); }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
                
                /* Gallery Section */
                .gallery-section { margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); }
                .gallery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .gallery-header h3 { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; color: #fff; margin: 0; }
                .btn-sm { padding: 8px 14px; font-size: 0.8rem; }
                .btn-outline { background: transparent; border: 1px solid rgba(0,212,255,0.4); color: #00d4ff; }
                .btn-outline:hover { background: rgba(0,212,255,0.1); }
                .gallery-add-form { background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.2); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
                .gallery-add-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: #00d4ff; font-weight: 500; }
                .gallery-add-header button { background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; }
                .gallery-add-header button:hover { color: #fff; }
                .gallery-add-body { display: flex; flex-direction: column; gap: 16px; }
                .gallery-add-fields { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; }
                .gallery-add-fields input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 0.85rem; }
                .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
                .gallery-empty { color: rgba(255,255,255,0.4); font-size: 0.9rem; text-align: center; padding: 32px; }
                .gallery-item { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 3/2; background: rgba(0,0,0,0.3); }
                .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
                .gallery-item-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
                .gallery-item-info span { display: block; font-size: 0.75rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .gallery-item-info small { font-size: 0.65rem; color: rgba(255,255,255,0.5); }
                .gallery-delete-btn { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,59,48,0.9); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
                .gallery-item:hover .gallery-delete-btn { opacity: 1; }
            `}</style>
        </div>
    );
}
