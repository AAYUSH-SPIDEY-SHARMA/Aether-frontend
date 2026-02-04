// Image utilities for Cloudinary transformations
// PRESERVES ORIGINAL QUALITY - no compression applied

/**
 * Build a Cloudinary URL - PRESERVES ORIGINAL QUALITY
 * The original high-quality image is stored and returned AS-IS by default
 * 
 * @param {string} baseUrl - Original Cloudinary URL
 * @param {string|object} cropData - JSON string or object with {x, y, zoom}
 * @param {object} options - Optional overrides
 * @param {boolean} options.useOriginalQuality - If true, returns original URL without transforms (default: true)
 * @param {number} options.width - Optional width to resize to
 * @param {number} options.height - Optional height to resize to
 * @returns {string} Cloudinary URL (original or with minimal transforms)
 */
export function buildCroppedUrl(baseUrl, cropData, options = {}) {
    if (!baseUrl) return baseUrl;

    // If not a Cloudinary URL, return as-is
    if (!baseUrl.includes('cloudinary')) return baseUrl;

    const {
        useOriginalQuality = true,  // DEFAULT: preserve original quality
        width,
        height,
    } = options;

    // If user wants original quality and no specific size is requested, return original URL
    if (useOriginalQuality && !width && !height) {
        return baseUrl;
    }

    try {
        // Parse crop data if it's a JSON string
        const crop = typeof cropData === 'string' ? JSON.parse(cropData) : (cropData || {});

        const { zoom = 1 } = crop;

        // Build transformation string ONLY if size is specified
        const transforms = [];

        if (width) transforms.push(`w_${width}`);
        if (height) transforms.push(`h_${height}`);

        if (transforms.length > 0) {
            transforms.push('c_fill');       // Fill mode
            transforms.push('g_center');     // Center gravity
            transforms.push('q_100');        // 100% quality - NO COMPRESSION
            transforms.push('f_auto');       // Auto format for browser compatibility

            if (zoom > 1) {
                transforms.push(`z_${zoom.toFixed(2)}`);
            }

            const transformString = transforms.join(',');
            return baseUrl.replace('/upload/', `/upload/${transformString}/`);
        }

        return baseUrl;
    } catch (error) {
        console.warn('Failed to build cropped URL:', error);
        return baseUrl;
    }
}

/**
 * Get original full-quality image URL (removes any existing transforms)
 * Use this when you want the ORIGINAL uploaded image with zero modifications
 */
export function getOriginalUrl(url) {
    if (!url || !url.includes('cloudinary')) return url;

    // Remove any existing transformations between /upload/ and the version/path
    const match = url.match(/(.*\/upload\/)(v\d+\/.*|[^/]+\.[a-z]+$)/i);
    if (match) {
        return match[1] + match[2];
    }
    return url;
}

/**
 * Build responsive URL - uses original quality but with optional max dimensions
 * Good for preventing massive images from slowing down the page
 * 
 * @param {string} baseUrl - Original Cloudinary URL
 * @param {number} maxWidth - Maximum width (maintains aspect ratio)
 * @returns {string} Cloudinary URL with limit transform
 */
export function buildResponsiveUrl(baseUrl, maxWidth = 1920) {
    if (!baseUrl || !baseUrl.includes('cloudinary')) return baseUrl;

    const transforms = [
        `w_${maxWidth}`,
        'c_limit',        // Limit mode - don't upscale, only downscale if larger
        'q_100',          // 100% quality - NO COMPRESSION
        'f_auto',
    ].join(',');

    return baseUrl.replace('/upload/', `/upload/${transforms}/`);
}

// Preset dimensions - use these ONLY when you need specific sizes
// By default, original quality is preserved without these
export const IMAGE_PRESETS = {
    // These are OPTIONAL - use only when resizing is needed
    profile: { width: 400, height: 480 },
    event: { width: 800, height: 450 },
    gallery: { width: 800, height: 600 },
    coordinator: { width: 560, height: 600 },
    logo: { width: 400, height: 400 },
    speaker: { width: 400, height: 480 },
    sponsor: { width: 600, height: 400 },
    hero: { width: 1600, height: 500 },

    // Thumbnail versions (for lists/grids where smaller is fine)
    thumb_profile: { width: 200, height: 240 },
    thumb_gallery: { width: 400, height: 300 },
};

// Crop reference sizes (from ImageCropTool ASPECT_RATIOS)
const CROP_REFERENCE_SIZES = {
    profile: { width: 200, height: 240 },
    event: { width: 400, height: 225 },
    gallery: { width: 400, height: 300 },
    coordinator: { width: 280, height: 300 },
    logo: { width: 200, height: 200 },
    speaker: { width: 200, height: 240 },
    sponsor: { width: 300, height: 200 },
};

/**
 * Get CSS style object for applying crop positioning using percentage-based transforms
 * 
 * HYBRID APPROACH:
 * - New data: Uses saved containerWidth/Height for accurate scaling
 * - Old data: Estimates container size based on modal constraints
 * 
 * @param {string|object} cropData - JSON string or object with x, y, zoom, containerWidth, containerHeight
 * @returns {object} - Style object for the wrapper div and image
 */
export function getCropStyle(cropData) {
    if (!cropData) return { wrapper: {}, image: {}, hasData: false };

    try {
        const crop = typeof cropData === 'string' ? JSON.parse(cropData) : cropData;
        const zoom = crop.zoom || 1;

        // Get reference dimensions
        const refWidth = crop.width || 200;
        const refHeight = crop.height || 240;
        const aspectRatio = refWidth / refHeight;

        // HYBRID: Use saved container dimensions if available, otherwise estimate
        let containerWidth, containerHeight;

        if (crop.containerWidth && crop.containerHeight) {
            // New data: use saved dimensions (accurate)
            containerWidth = crop.containerWidth;
            containerHeight = crop.containerHeight;
        } else {
            // Old data: estimate based on modal constraints
            // Modal max-width: 480px, padding: 1rem (32px) = ~448px available
            // Container: maxWidth = min(refWidth * 1.5, 500), capped by modal
            const maxPossibleWidth = Math.min(refWidth * 1.5, 500);
            containerWidth = Math.min(maxPossibleWidth, 448);
            containerHeight = containerWidth / aspectRatio;

            // Also respect maxHeight constraint
            const maxHeight = Math.min(refHeight * 1.5, 400);
            if (containerHeight > maxHeight) {
                containerHeight = maxHeight;
                containerWidth = containerHeight * aspectRatio;
            }
        }

        // Convert pixel offsets to percentages of container
        // This makes the positioning work at any display size
        const xPercent = (crop.x || 0) / containerWidth * 100;
        const yPercent = (crop.y || 0) / containerHeight * 100;

        const wrapperStyle = {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${xPercent}%, ${yPercent}%) scale(${zoom})`,
            transformOrigin: 'center center',
        };

        const imageStyle = {
            width: '100%',
            height: 'auto',
            maxWidth: 'none',
            maxHeight: 'none',
        };

        return { wrapper: wrapperStyle, image: imageStyle, hasData: true };
    } catch {
        return { wrapper: {}, image: {}, hasData: false };
    }
}
