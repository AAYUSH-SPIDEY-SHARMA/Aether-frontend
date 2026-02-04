import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageLightbox.css';

export default function ImageLightbox({ images, isOpen, onClose, initialIndex = 0 }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // SYNC currentIndex with initialIndex when it changes (FIX: opens correct image)
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    // Navigation functions
    const goNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // KEYBOARD NAVIGATION (Arrow keys + Escape)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowRight':
                    goNext();
                    break;
                case 'ArrowLeft':
                    goPrev();
                    break;
                case 'Escape':
                    onClose();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, goNext, goPrev, onClose]);

    if (!isOpen) return null;

    const currentImage = images[currentIndex];

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Stop propagation on nav buttons to prevent backdrop close
    const handleNavClick = (e, action) => {
        e.stopPropagation();
        action();
    };

    return (
        <div className="lightbox-overlay" onClick={handleBackdropClick}>
            {/* Close Button */}
            <button className="lightbox-close" onClick={onClose}>
                <X size={24} />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
                <>
                    <button
                        className="lightbox-nav lightbox-prev"
                        onClick={(e) => handleNavClick(e, goPrev)}
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        className="lightbox-nav lightbox-next"
                        onClick={(e) => handleNavClick(e, goNext)}
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            {/* Image Container */}
            <div className="lightbox-content">
                <div className="lightbox-image-wrapper">
                    {currentImage?.image ? (
                        <img
                            src={currentImage.image}
                            alt={currentImage.title}
                            className="lightbox-image"
                        />
                    ) : (
                        <div className="lightbox-placeholder">
                            <span className="placeholder-icon">📸</span>
                            <span className="placeholder-text">Image Coming Soon</span>
                        </div>
                    )}
                </div>

                {/* Caption */}
                <div className="lightbox-caption">
                    <h3>{currentImage?.title}</h3>
                    <p>{currentImage?.year}</p>
                </div>

                {/* Indicators */}
                {images.length > 1 && (
                    <div className="lightbox-indicators">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

