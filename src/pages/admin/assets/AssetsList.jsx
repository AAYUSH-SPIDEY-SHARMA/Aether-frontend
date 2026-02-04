// Admin Assets Management Page
// Advanced image management with Cloudinary transformations

import { useState, useEffect } from 'react';
import { Image, Upload, Settings, Trash2, Plus, Crop, ZoomIn, Move, Check, X, RefreshCw } from 'lucide-react';
import ImageUpload from '../../../components/admin/ImageUpload';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { assetsAPI } from '../../../services/api';
import './AssetsList.css';

// Asset categories
const CATEGORIES = [
    { key: 'all', label: 'All Assets', icon: Image },
    { key: 'logo', label: 'Logos', icon: Image },
    { key: 'hero', label: 'Hero Images', icon: Image },
    { key: 'background', label: 'Backgrounds', icon: Image },
    { key: 'general', label: 'General', icon: Image },
];

// Crop modes
const CROP_MODES = [
    { value: 'fill', label: 'Fill', desc: 'Fill the dimensions, crop if needed' },
    { value: 'crop', label: 'Crop', desc: 'Crop to exact dimensions' },
    { value: 'scale', label: 'Scale', desc: 'Scale to fit, may distort' },
    { value: 'fit', label: 'Fit', desc: 'Fit within dimensions, preserve aspect' },
    { value: 'thumb', label: 'Thumbnail', desc: 'Smart thumbnail generation' },
];

// Gravity options (focal point)
const GRAVITY_OPTIONS = [
    { value: 'center', label: 'Center' },
    { value: 'auto', label: 'Auto (Smart)' },
    { value: 'face', label: 'Face Detection' },
    { value: 'faces', label: 'Multiple Faces' },
    { value: 'north', label: 'Top' },
    { value: 'south', label: 'Bottom' },
    { value: 'east', label: 'Right' },
    { value: 'west', label: 'Left' },
    { value: 'north_west', label: 'Top Left' },
    { value: 'north_east', label: 'Top Right' },
    { value: 'south_west', label: 'Bottom Left' },
    { value: 'south_east', label: 'Bottom Right' },
];

// Preset sizes for different use cases
const PRESET_SIZES = [
    { name: 'Profile Card', width: 200, height: 200, crop: 'fill', gravity: 'face' },
    { name: 'Event Card', width: 400, height: 225, crop: 'fill', gravity: 'center' },
    { name: 'Hero Banner', width: 1920, height: 600, crop: 'fill', gravity: 'center' },
    { name: 'Logo Square', width: 100, height: 100, crop: 'fit', gravity: 'center' },
    { name: 'Gallery Thumb', width: 300, height: 200, crop: 'fill', gravity: 'auto' },
    { name: 'Wing Logo', width: 80, height: 80, crop: 'fit', gravity: 'center' },
];

export default function AssetsList() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ open: false, asset: null });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const res = await assetsAPI.getAll();
            setAssets(res.data?.data?.assets || []);
        } catch (error) {
            console.error('Failed to fetch assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssets = activeCategory === 'all'
        ? assets
        : assets.filter(a => a.category === activeCategory);

    const handleDelete = async () => {
        if (!deleteModal.asset) return;
        try {
            await assetsAPI.delete(deleteModal.asset.id);
            setAssets(assets.filter(a => a.id !== deleteModal.asset.id));
            setDeleteModal({ open: false, asset: null });
        } catch (error) {
            console.error('Failed to delete asset:', error);
        }
    };

    return (
        <div className="assets-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Site Assets</h1>
                    <p className="text-muted">Manage all website images with advanced Cloudinary transformations</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                    <Plus size={16} />
                    Add New Asset
                </button>
            </div>

            {/* Category Tabs */}
            <div className="asset-categories">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.key)}
                    >
                        <cat.icon size={16} />
                        <span>{cat.label}</span>
                        <span className="count">
                            {cat.key === 'all' ? assets.length : assets.filter(a => a.category === cat.key).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Assets Grid */}
            <div className="assets-grid">
                {loading ? (
                    <div className="loading-state">
                        <RefreshCw className="spinner" size={32} />
                        <span>Loading assets...</span>
                    </div>
                ) : filteredAssets.length === 0 ? (
                    <div className="empty-state">
                        <Image size={48} />
                        <h3>No assets found</h3>
                        <p>Upload your first asset to get started</p>
                        <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                            <Upload size={16} />
                            Upload Asset
                        </button>
                    </div>
                ) : (
                    filteredAssets.map(asset => (
                        <AssetCard
                            key={asset.id}
                            asset={asset}
                            onEdit={() => {
                                setSelectedAsset(asset);
                                setShowEditModal(true);
                            }}
                            onDelete={() => setDeleteModal({ open: true, asset })}
                        />
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <AssetUploadModal
                    onClose={() => setShowUploadModal(false)}
                    onSave={async (assetData) => {
                        try {
                            await assetsAPI.create(assetData);
                            fetchAssets();
                            setShowUploadModal(false);
                        } catch (error) {
                            console.error('Failed to create asset:', error);
                        }
                    }}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && selectedAsset && (
                <AssetEditModal
                    asset={selectedAsset}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedAsset(null);
                    }}
                    onSave={async (id, updates) => {
                        try {
                            await assetsAPI.update(id, updates);
                            fetchAssets();
                            setShowEditModal(false);
                            setSelectedAsset(null);
                        } catch (error) {
                            console.error('Failed to update asset:', error);
                        }
                    }}
                />
            )}

            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={deleteModal.open}
                title="Delete Asset"
                message={`Are you sure you want to delete "${deleteModal.asset?.name}"?`}
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ open: false, asset: null })}
            />
        </div>
    );
}

// Asset Card Component
function AssetCard({ asset, onEdit, onDelete }) {
    const transformedUrl = buildTransformedUrl(asset.imageUrl, asset.transformations, { width: 200, height: 150 });

    return (
        <div className="asset-card">
            <div className="asset-preview">
                <img src={transformedUrl} alt={asset.name} loading="lazy" />
                <div className="asset-overlay">
                    <button className="btn-icon" onClick={onEdit} title="Edit transformations">
                        <Settings size={18} />
                    </button>
                    <button className="btn-icon danger" onClick={onDelete} title="Delete">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <div className="asset-info">
                <h4>{asset.name}</h4>
                <span className="asset-key">{asset.key}</span>
                <span className={`asset-category cat-${asset.category}`}>{asset.category}</span>
            </div>
        </div>
    );
}

// Asset Upload Modal
function AssetUploadModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        key: '',
        name: '',
        category: 'general',
        imageUrl: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.key || !formData.name || !formData.imageUrl) {
            alert('Please fill in all required fields');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Asset</h2>
                    <button className="btn-icon" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Asset Key *</label>
                                <input
                                    type="text"
                                    value={formData.key}
                                    onChange={e => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                    placeholder="e.g. navbar_logo, hero_bg"
                                    required
                                />
                                <small>Unique identifier (lowercase, underscores)</small>
                            </div>
                            <div className="form-group">
                                <label>Display Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Navbar Logo"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Image *</label>
                            <ImageUpload
                                folder="assets"
                                onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                                currentImage={formData.imageUrl}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description..."
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            <Check size={16} /> Save Asset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Asset Edit Modal with Advanced Transformations
function AssetEditModal({ asset, onClose, onSave }) {
    const [transforms, setTransforms] = useState(() => {
        try {
            return asset.transformations ? JSON.parse(asset.transformations) : {};
        } catch {
            return {};
        }
    });
    const [previewSize, setPreviewSize] = useState({ width: 400, height: 300 });
    const [selectedPreset, setSelectedPreset] = useState(null);

    const previewUrl = buildTransformedUrl(asset.imageUrl, JSON.stringify(transforms), previewSize);

    const handlePresetClick = (preset) => {
        setTransforms({
            ...transforms,
            width: preset.width,
            height: preset.height,
            crop: preset.crop,
            gravity: preset.gravity,
        });
        setPreviewSize({ width: preset.width, height: preset.height });
        setSelectedPreset(preset.name);
    };

    const handleSave = () => {
        onSave(asset.id, {
            transformations: JSON.stringify(transforms),
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-xl" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <Settings size={20} />
                        Edit Transformations - {asset.name}
                    </h2>
                    <button className="btn-icon" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body transform-editor">
                    {/* Left: Preview */}
                    <div className="transform-preview">
                        <h3>Live Preview</h3>
                        <div className="preview-frame" style={{ maxWidth: previewSize.width, maxHeight: previewSize.height }}>
                            <img src={previewUrl} alt="Preview" />
                        </div>
                        <div className="preview-info">
                            <span>{previewSize.width} × {previewSize.height}px</span>
                            {selectedPreset && <span className="preset-badge">{selectedPreset}</span>}
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="transform-controls">
                        {/* Presets */}
                        <div className="control-section">
                            <h4><Crop size={16} /> Quick Presets</h4>
                            <div className="presets-grid">
                                {PRESET_SIZES.map(preset => (
                                    <button
                                        key={preset.name}
                                        className={`preset-btn ${selectedPreset === preset.name ? 'active' : ''}`}
                                        onClick={() => handlePresetClick(preset)}
                                    >
                                        <span className="preset-name">{preset.name}</span>
                                        <span className="preset-size">{preset.width}×{preset.height}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Crop Mode */}
                        <div className="control-section">
                            <h4><Crop size={16} /> Crop Mode</h4>
                            <div className="crop-options">
                                {CROP_MODES.map(mode => (
                                    <label key={mode.value} className={`crop-option ${transforms.crop === mode.value ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="crop"
                                            value={mode.value}
                                            checked={transforms.crop === mode.value}
                                            onChange={() => setTransforms({ ...transforms, crop: mode.value })}
                                        />
                                        <span className="crop-label">{mode.label}</span>
                                        <span className="crop-desc">{mode.desc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Gravity / Focal Point */}
                        <div className="control-section">
                            <h4><Move size={16} /> Focal Point (Gravity)</h4>
                            <select
                                value={transforms.gravity || 'center'}
                                onChange={(e) => setTransforms({ ...transforms, gravity: e.target.value })}
                                className="gravity-select"
                            >
                                {GRAVITY_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dimensions */}
                        <div className="control-section">
                            <h4><ZoomIn size={16} /> Dimensions</h4>
                            <div className="dimension-inputs">
                                <div className="form-group">
                                    <label>Width (px)</label>
                                    <input
                                        type="number"
                                        value={transforms.width || ''}
                                        onChange={(e) => setTransforms({ ...transforms, width: parseInt(e.target.value) || undefined })}
                                        placeholder="Auto"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Height (px)</label>
                                    <input
                                        type="number"
                                        value={transforms.height || ''}
                                        onChange={(e) => setTransforms({ ...transforms, height: parseInt(e.target.value) || undefined })}
                                        placeholder="Auto"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Advanced */}
                        <div className="control-section">
                            <h4>Advanced</h4>
                            <div className="advanced-inputs">
                                <div className="form-group">
                                    <label>Zoom</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        max="10"
                                        value={transforms.zoom || ''}
                                        onChange={(e) => setTransforms({ ...transforms, zoom: parseFloat(e.target.value) || undefined })}
                                        placeholder="1.0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Quality</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={transforms.quality || ''}
                                        onChange={(e) => setTransforms({ ...transforms, quality: parseInt(e.target.value) || undefined })}
                                        placeholder="Auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>
                        <Check size={16} /> Save Transformations
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper: Build Cloudinary transformed URL
function buildTransformedUrl(baseUrl, transformationsJson, overrides = {}) {
    if (!baseUrl || !baseUrl.includes('cloudinary')) {
        return baseUrl || '/images/placeholder.png';
    }

    try {
        const transforms = transformationsJson ? { ...JSON.parse(transformationsJson), ...overrides } : overrides;
        const { width, height, crop, gravity, zoom, quality } = transforms;

        const parts = [];
        if (width) parts.push(`w_${width}`);
        if (height) parts.push(`h_${height}`);
        if (crop) parts.push(`c_${crop}`);
        if (gravity) parts.push(`g_${gravity}`);
        if (zoom) parts.push(`z_${zoom}`);
        if (quality) parts.push(`q_${quality}`);

        if (parts.length === 0) return baseUrl;

        const transformString = parts.join(',');
        return baseUrl.replace('/upload/', `/upload/${transformString}/`);
    } catch {
        return baseUrl;
    }
}
