// WingSelector - Epic themed toggle buttons with fire/climate icons
import { Leaf, Flame } from 'lucide-react';
import './WingSelector.css';

export default function WingSelector({ activeWing, onWingChange, wings = {} }) {
    // Build wing options using API data with fallback
    const wingOptions = [
        {
            id: 'wnc',
            name: wings.wnc?.shortName || 'WnC Wing',
            logo: wings.wnc?.logoUrl || '/images/wings/wnc-logo.png',
            FallbackIcon: Flame,
            theme: 'fire'
        },
        {
            id: 'climate',
            name: wings.climate?.shortName || 'Climate Tech',
            logo: wings.climate?.logoUrl,
            FallbackIcon: Leaf,
            theme: 'climate'
        }
    ];

    return (
        <div className="wing-selector">
            <div className="wing-selector-container">
                {wingOptions.map((wing) => {
                    const isActive = activeWing === wing.id;
                    return (
                        <button
                            key={wing.id}
                            className={`wing-btn wing-btn--${wing.theme} ${isActive ? 'wing-btn--active' : ''}`}
                            onClick={() => onWingChange(wing.id)}
                            aria-label={`Switch to ${wing.name}`}
                        >
                            <div className="wing-btn-icon">
                                {wing.logo ? (
                                    <img
                                        src={wing.logo}
                                        alt={wing.name}
                                        className="wing-logo-icon"
                                    />
                                ) : (
                                    <wing.FallbackIcon size={20} />
                                )}
                            </div>
                            <span className="wing-btn-text">{wing.name}</span>
                            {isActive && <div className="wing-btn-glow" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

