import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
import './WingGallery.css';

export default function WingGallery({ gallery, color }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openLightbox = (index) => {
        setSelectedIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className={`wing-gallery gallery-${color}`}>
                {gallery.map((item, index) => (
                    <div
                        key={item.id}
                        className="gallery-item"
                        onClick={() => openLightbox(index)}
                    >
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.title}
                                className="gallery-image"
                            />
                        ) : (
                            <div className="gallery-placeholder">
                                <span className="placeholder-icon">📸</span>
                            </div>
                        )}
                        <div className="gallery-overlay">
                            <ZoomIn size={24} className="zoom-icon" />
                            <span className="gallery-title">{item.title}</span>
                            <span className="gallery-year">{item.year}</span>
                        </div>
                    </div>
                ))}
            </div>

            <ImageLightbox
                images={gallery}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                initialIndex={selectedIndex}
            />
        </>
    );
}
