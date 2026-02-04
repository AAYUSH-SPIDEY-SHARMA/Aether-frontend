import { useEffect, useState } from 'react';
import './AnimatedLogo.css';

/**
 * AnimatedLogo - Reusable AETHER logo component
 * @param {string} variant - 'neon' (primary gradient) or 'mono' (monochrome cyan/white)
 * @param {string} size - 'sm' (24px), 'md' (40px), 'lg' (80px), 'xl' (120px)
 * @param {boolean} animate - Enable subtle pulse animation (respects reduced-motion)
 * @param {string} className - Additional CSS classes
 */
export default function AnimatedLogo({
    variant = 'mono',
    size = 'md',
    animate = true,
    className = ''
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Check for reduced motion preference
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const shouldAnimate = animate && !prefersReducedMotion;

    const logoClasses = [
        'animated-logo',
        `logo-${variant}`,
        `logo-${size}`,
        shouldAnimate ? 'logo-animate' : '',
        imageLoaded ? 'logo-loaded' : '',
        className
    ].filter(Boolean).join(' ');

    // Fallback to monochrome if neon fails
    const handleError = () => {
        setImageError(true);
    };

    const handleLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className={logoClasses}>
            <div className="logo-glow" />
            <img
                src="/images/LOGO.png"
                alt="AETHER Logo"
                className="logo-image"
                onLoad={handleLoad}
                onError={handleError}
                loading="eager"
            />
            {/* Fallback if image fails */}
            {imageError && (
                <div className="logo-fallback">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2L12 22M2 12L22 12" />
                        <path d="M12 6L12 18M6 12L18 12" />
                    </svg>
                </div>
            )}
        </div>
    );
}
