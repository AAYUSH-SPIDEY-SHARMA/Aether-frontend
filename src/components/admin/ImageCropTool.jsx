// ImageCropTool - Instagram-style image crop/frame selector
// Shows frame overlay, allows drag to pan, zoom slider
// Returns crop data: { x, y, zoom } to store in DB

import { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Check, X, Move } from 'lucide-react';
import './ImageCropTool.css';

// Preset aspect ratios matching actual page designs
const ASPECT_RATIOS = {
    // Team member cards: height 240px, card width ~200px = portrait 5:6
    'profile': { ratio: 5 / 6, label: 'Profile (5:6)', width: 200, height: 240 },

    // Event cards: CSS aspect-ratio: 16/9 (line 295 EventCard.css)
    'event': { ratio: 16 / 9, label: 'Event (16:9)', width: 400, height: 225 },

    // Wing gallery: CSS aspect-ratio: 4/3 (line 23 WingGallery.css)
    'gallery': { ratio: 4 / 3, label: 'Gallery (4:3)', width: 400, height: 300 },

    // Wing coordinator cards: width 280px, height 300px (lines 203, 395 WingContent.css)
    'coordinator': { ratio: 280 / 300, label: 'Coordinator (14:15)', width: 280, height: 300 },

    // Logos/icons: square
    'logo': { ratio: 1, label: 'Logo (1:1)', width: 200, height: 200 },

    // Speaker photos: similar to team profile
    'speaker': { ratio: 5 / 6, label: 'Speaker (5:6)', width: 200, height: 240 },

    // Sponsor logos: typically wider landscape or square
    'sponsor': { ratio: 3 / 2, label: 'Sponsor (3:2)', width: 300, height: 200 },

    // Home page featured coordinators: max-width 220px, height 200px
    'home_featured': { ratio: 11 / 10, label: 'Home Featured (11:10)', width: 220, height: 200 },

    // Hero banners
    'hero': { ratio: 16 / 5, label: 'Hero Banner', width: 1600, height: 500 },

    // Generic square
    'square': { ratio: 1, label: 'Square', width: 300, height: 300 },
};

export default function ImageCropTool({
    imageUrl,
    aspectRatioKey = 'profile',
    initialCropData = null,
    onSave,
    onCancel,
}) {
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const aspectConfig = ASPECT_RATIOS[aspectRatioKey] || ASPECT_RATIOS.profile;

    // Crop state
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // Initialize from existing crop data
    useEffect(() => {
        if (initialCropData) {
            try {
                const data = typeof initialCropData === 'string' ? JSON.parse(initialCropData) : initialCropData;
                if (data.zoom) setZoom(data.zoom);
                if (data.x !== undefined && data.y !== undefined) {
                    setPosition({ x: data.x, y: data.y });
                }
            } catch { }
        }
    }, [initialCropData]);

    // Handle image load
    const handleImageLoad = () => {
        if (imageRef.current) {
            setImageDimensions({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
            });
            setImageLoaded(true);
        }
    };

    // Mouse/touch handlers for dragging
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    }, [position]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Get container dimensions
        const container = containerRef.current;
        const image = imageRef.current;

        if (container && image) {
            const containerRect = container.getBoundingClientRect();

            // Calculate the displayed image size within container
            // Image is scaled to fit container, then zoom is applied
            const imageAspect = imageDimensions.width / imageDimensions.height;
            const containerAspect = containerRect.width / containerRect.height;

            let displayedWidth, displayedHeight;
            if (imageAspect > containerAspect) {
                // Image is wider - fit to height
                displayedHeight = containerRect.height;
                displayedWidth = displayedHeight * imageAspect;
            } else {
                // Image is taller - fit to width  
                displayedWidth = containerRect.width;
                displayedHeight = displayedWidth / imageAspect;
            }

            // Apply zoom
            const scaledWidth = displayedWidth * zoom;
            const scaledHeight = displayedHeight * zoom;

            // Calculate max drag bounds (allow dragging so image covers container)
            const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
            const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);

            setPosition({
                x: Math.max(-maxX, Math.min(maxX, newX)),
                y: Math.max(-maxY, Math.min(maxY, newY)),
            });
        } else {
            // No constraints if refs not available
            setPosition({ x: newX, y: newY });
        }
    }, [isDragging, dragStart, zoom, imageDimensions]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Touch handlers for mobile
    const handleTouchStart = useCallback((e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            setIsDragging(true);
            setDragStart({
                x: touch.clientX - position.x,
                y: touch.clientY - position.y,
            });
        }
    }, [position]);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];

        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;

        setPosition({ x: newX, y: newY });
    }, [isDragging, dragStart]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    // Zoom handlers
    const handleZoomChange = (e) => {
        setZoom(parseFloat(e.target.value));
    };

    const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
    const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    // Save crop data
    const handleSave = () => {
        // Get actual rendered container dimensions for accurate display later
        const containerRect = containerRef.current?.getBoundingClientRect();
        const cropData = {
            x: Math.round(position.x),
            y: Math.round(position.y),
            zoom: parseFloat(zoom.toFixed(2)),
            width: aspectConfig.width,
            height: aspectConfig.height,
            aspectRatio: aspectRatioKey,
            // Save actual container dimensions for accurate display scaling
            containerWidth: Math.round(containerRect?.width || aspectConfig.width),
            containerHeight: Math.round(containerRect?.height || aspectConfig.height),
        };
        onSave(cropData);
    };

    return (
        <div className="crop-tool-overlay">
            <div className="crop-tool-modal">
                <div className="crop-tool-header">
                    <h3>
                        <Move size={18} />
                        Adjust Image - {aspectConfig.label}
                    </h3>
                    <button className="btn-icon" onClick={onCancel}>
                        <X size={20} />
                    </button>
                </div>

                <div className="crop-tool-body">
                    {/* Target dimensions display */}
                    <div className="crop-dimensions-label">
                        Target: {aspectConfig.width} × {aspectConfig.height}px ({aspectConfig.label})
                    </div>

                    {/* Main crop area - uses exact aspect ratio scaled to fit */}
                    {/* HANDLERS ON CONTAINER for full area drag support when zoomed */}
                    <div
                        ref={containerRef}
                        className="crop-container"
                        style={{
                            aspectRatio: `${aspectConfig.width} / ${aspectConfig.height}`,
                            maxWidth: Math.min(aspectConfig.width * 1.5, 500) + 'px',
                            maxHeight: Math.min(aspectConfig.height * 1.5, 400) + 'px',
                            margin: '0 auto'
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                    >
                        {/* Frame overlay */}
                        <div className="crop-frame">
                            <div className="frame-corner frame-tl" />
                            <div className="frame-corner frame-tr" />
                            <div className="frame-corner frame-bl" />
                            <div className="frame-corner frame-br" />
                        </div>

                        {/* Draggable image - no handlers here, container handles events */}
                        <div
                            className={`crop-image-wrapper ${isDragging ? 'dragging' : ''}`}
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                            }}
                        >
                            <img
                                ref={imageRef}
                                src={imageUrl}
                                alt="Crop preview"
                                onLoad={handleImageLoad}
                                draggable={false}
                            />
                        </div>

                        {/* Instructions overlay */}
                        {imageLoaded && (
                            <div className="crop-instructions">
                                Drag to reposition
                            </div>
                        )}
                    </div>

                    {/* Zoom controls */}
                    <div className="crop-controls">
                        <button className="zoom-btn" onClick={zoomOut} disabled={zoom <= 0.5}>
                            <ZoomOut size={18} />
                        </button>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={handleZoomChange}
                            className="zoom-slider"
                        />
                        <button className="zoom-btn" onClick={zoomIn} disabled={zoom >= 3}>
                            <ZoomIn size={18} />
                        </button>
                        <span className="zoom-value">{Math.round(zoom * 100)}%</span>
                    </div>
                </div>

                <div className="crop-tool-footer">
                    <button className="btn btn-outline" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Check size={16} />
                        Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
}

// Export aspect ratios for use in other components
export { ASPECT_RATIOS };
