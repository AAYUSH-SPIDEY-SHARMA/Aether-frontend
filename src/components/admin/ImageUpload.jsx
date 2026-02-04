// ImageUpload Component - Upload images to Cloudinary with Crop Tool
// Reusable across all admin forms with Instagram-style crop

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Crop } from 'lucide-react';
import api from '../../services/api';
import ImageCropTool from './ImageCropTool';
import './ImageUpload.css';

// Aspect ratio mapping based on usage context
const CONTEXT_ASPECTS = {
    'profile': 'profile',      // Team members, coordinators
    'event': 'event',          // Event cards
    'gallery': 'gallery',      // Wing gallery
    'logo': 'logo',            // Wing logos, sponsor logos
    'speaker': 'profile',      // Speakers
    'sponsor': 'logo',         // Sponsors
    'general': 'square',       // Default
};

export default function ImageUpload({
    value,
    onChange,
    folder = 'general',
    label = 'Image',
    accept = 'image/*',
    aspectRatio = 'general',  // Context for crop aspect ratio
    cropData = null,          // Existing crop data
    onCropChange = null,      // Callback for crop data changes
}) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [showCropTool, setShowCropTool] = useState(false);
    const [pendingImageUrl, setPendingImageUrl] = useState(null);
    const inputRef = useRef(null);

    const aspectKey = CONTEXT_ASPECTS[aspectRatio] || 'square';

    const handleUpload = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post(`/uploads/image/${folder}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = response.data.data.imageUrl;

            // If crop callback is provided, show crop tool
            if (onCropChange) {
                setPendingImageUrl(imageUrl);
                setShowCropTool(true);
            } else {
                // No crop needed, just set the image
                onChange(imageUrl);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleCropSave = (newCropData) => {
        const imageUrl = pendingImageUrl || value;
        onChange(imageUrl);
        if (onCropChange) {
            onCropChange(newCropData);
        }
        setShowCropTool(false);
        setPendingImageUrl(null);
    };

    const handleCropCancel = () => {
        // If was pending (new upload), discard
        if (pendingImageUrl) {
            setPendingImageUrl(null);
        }
        setShowCropTool(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer?.files?.[0];
        if (file) handleUpload(file);
    };

    const handleRemove = () => {
        onChange('');
        if (onCropChange) onCropChange(null);
        setError(null);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleEditCrop = () => {
        if (value) {
            setPendingImageUrl(null);
            setShowCropTool(true);
        }
    };

    // Build preview URL with current crop settings
    const getPreviewUrl = () => {
        if (!value) return null;
        if (!cropData || !value.includes('cloudinary')) return value;

        try {
            const data = typeof cropData === 'string' ? JSON.parse(cropData) : cropData;
            const { width = 200, height = 200, zoom = 1 } = data;
            const transforms = `w_${width},h_${height},c_fill${zoom > 1 ? `,z_${zoom}` : ''}`;
            return value.replace('/upload/', `/upload/${transforms}/`);
        } catch {
            return value;
        }
    };

    return (
        <div className="image-upload">
            <label className="upload-label">{label}</label>

            {value ? (
                <div className="image-preview">
                    <img src={getPreviewUrl()} alt="Preview" />
                    <div className="preview-actions">
                        {onCropChange && (
                            <button
                                type="button"
                                className="crop-btn"
                                onClick={handleEditCrop}
                                title="Adjust crop"
                            >
                                <Crop size={16} />
                            </button>
                        )}
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={handleRemove}
                            title="Remove image"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`upload-zone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileSelect}
                        hidden
                    />

                    {uploading ? (
                        <>
                            <Loader2 size={32} className="spinner" />
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="upload-icon">
                                {dragActive ? <ImageIcon size={32} /> : <Upload size={32} />}
                            </div>
                            <span className="upload-text">
                                {dragActive ? 'Drop image here' : 'Click or drag image to upload'}
                            </span>
                            <span className="upload-hint">Max 5MB • JPG, PNG, GIF, WebP</span>
                        </>
                    )}
                </div>
            )}

            {error && <p className="upload-error">{error}</p>}

            {/* Crop Tool Modal */}
            {showCropTool && (
                <ImageCropTool
                    imageUrl={pendingImageUrl || value}
                    aspectRatioKey={aspectKey}
                    initialCropData={cropData}
                    onSave={handleCropSave}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}
