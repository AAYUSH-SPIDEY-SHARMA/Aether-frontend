import './WingLogo.css';

/**
 * WingLogo - Uses actual logo images from /public/images/wings/
 * Falls back to styled icon if image not available
 */
export default function WingLogo({ wingId, size = 24, className = '' }) {
    const logoPath = `/images/wings/${wingId}-logo.png`;

    return (
        <div
            className={`wing-logo-wrapper wing-${wingId}-logo ${className}`}
            style={{ width: size, height: size }}
        >
            <img
                src={logoPath}
                alt={`${wingId} wing logo`}
                className="wing-logo-img"
                onError={(e) => {
                    // If image fails, hide it - CSS will show fallback
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('logo-fallback');
                }}
            />
        </div>
    );
}
