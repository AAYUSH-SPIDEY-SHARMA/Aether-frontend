// Wings.jsx - Epic themed Wings page (uses API data)
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Flame, Leaf, Loader2 } from 'lucide-react';
import WingSelector from '../components/wings/WingSelector';
import WingContent from '../components/wings/WingContent';
import { wingsAPI } from '../services/api';
import { buildCroppedUrl, IMAGE_PRESETS } from '../utils/imageUtils';
import './Wings.css';


export default function Wings() {
    const location = useLocation();
    const [activeWingSlug, setActiveWingSlug] = useState('wnc');
    const [slideDirection, setSlideDirection] = useState('right');
    const [wings, setWings] = useState({});
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    // Fetch wings from API
    useEffect(() => {
        const fetchWings = async () => {
            try {
                setLoading(true);
                const res = await wingsAPI.getAll();
                const wingsData = res.data?.data?.wings || [];
                // Convert array to object keyed by slug for easy lookup
                const wingsMap = {};
                wingsData.forEach(wing => {
                    wingsMap[wing.slug] = {
                        id: wing.slug,
                        name: wing.name,
                        shortName: wing.name.includes('Climate') ? 'Climate Tech' : 'WnC Wing',
                        tagline: wing.tagline,
                        description: wing.description,
                        mission: wing.mission,
                        logoUrl: wing.logoUrl, // This is the Cloudinary URL!
                        focus: wing.focus?.map(f => f.title) || [],
                        coordinators: wing.members?.filter(m => m.type === 'WING_COORDINATOR').map(m => ({
                            id: m.id,
                            name: m.name,
                            role: m.primaryRole,
                            program: m.program,
                            image: m.imageUrl,
                            imageCrop: m.imageCrop,
                            linkedin: m.linkedin,
                            github: m.github
                        })) || [],
                        activities: wing.activities?.map(a => ({
                            title: a.title,
                            description: a.description
                        })) || [],
                        gallery: wing.gallery?.map(g => ({
                            id: g.id,
                            image: g.imageUrl, // Use original quality - no transforms
                            imageCrop: g.imageCrop,
                            title: g.title,
                            year: g.year
                        })) || [],
                        color: wing.color || 'cyan'
                    };
                });
                setWings(wingsMap);
            } catch (error) {
                console.error('Failed to fetch wings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWings();
    }, []);

    // Handle hash-based navigation (e.g., /wings#climate)
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash && (hash === 'wnc' || hash === 'climate')) {
            setActiveWingSlug(hash);
        }
    }, [location.hash]);

    const handleWingChange = (wingId) => {
        if (wingId === activeWingSlug) return;
        const direction = wingId === 'wnc' ? 'left' : 'right';
        setSlideDirection(direction);
        setActiveWingSlug(wingId);
    };

    const currentWing = wings[activeWingSlug];
    const theme = activeWingSlug === 'wnc' ? 'fire' : 'climate';

    // Loading state
    if (loading) {
        return (
            <main className={`wings-page wings-page--${theme}`}>
                <div className="wings-bg-effects">
                    <div className="wings-bg-gradient" />
                </div>
                <div className="wings-loading">
                    <Loader2 className="spinner" size={48} />
                    <span>Loading wings...</span>
                </div>
            </main>
        );
    }

    // No wings found
    if (!currentWing) {
        return (
            <main className={`wings-page wings-page--${theme}`}>
                <div className="wings-bg-effects">
                    <div className="wings-bg-gradient" />
                </div>
                <div className="wings-loading">
                    <span>No wings found</span>
                </div>
            </main>
        );
    }

    return (
        <main className={`wings-page wings-page--${theme}`}>
            {/* Animated Background Effects */}
            <div className="wings-bg-effects">
                <div className="wings-bg-gradient" />
                <div className="wings-bg-particles" />
                {theme === 'fire' && (
                    <>
                        <div className="fire-ember fire-ember--1" />
                        <div className="fire-ember fire-ember--2" />
                        <div className="fire-ember fire-ember--3" />
                        <div className="fire-glow" />
                    </>
                )}
                {theme === 'climate' && (
                    <>
                        <div className="leaf-particle leaf-particle--1" />
                        <div className="leaf-particle leaf-particle--2" />
                        <div className="leaf-particle leaf-particle--3" />
                        <div className="nature-glow" />
                    </>
                )}
            </div>

            {/* Hero Section */}
            <section className="wings-hero">
                <div className="container">
                    <div className="wings-hero-content">
                        <span className="wings-label">Specialized Teams</span>
                        <h1 className="wings-title heading-display">
                            Wings of <span className="text-gradient">AETHER</span>
                        </h1>
                        <p className="wings-subtitle">
                            Specialized teams driving innovation and impact across different domains.
                        </p>
                    </div>
                </div>
            </section>

            {/* Wing Selector - Floating */}
            <WingSelector
                activeWing={activeWingSlug}
                onWingChange={handleWingChange}
                wings={wings}
            />

            {/* Wing Content */}
            <section className="wings-content-section">
                <div className="container" ref={contentRef}>
                    <WingContent
                        key={activeWingSlug}
                        wing={currentWing}
                        direction={slideDirection}
                        theme={theme}
                    />
                </div>
            </section>


            {/* Floating Sidebar - Right Side */}
            <div className="wings-floating-sidebar">
                <button
                    className={`floating-wing-btn floating-wing-btn--fire ${activeWingSlug === 'wnc' ? 'floating-wing-btn--active' : ''}`}
                    onClick={() => handleWingChange('wnc')}
                    aria-label="Switch to WnC Wing"
                    title="WnC Wing"
                >
                    {wings.wnc?.logoUrl ? (
                        <img src={wings.wnc.logoUrl} alt="WnC" className="floating-wing-logo" />
                    ) : (
                        <Flame size={20} />
                    )}
                </button>
                <button
                    className={`floating-wing-btn floating-wing-btn--climate ${activeWingSlug === 'climate' ? 'floating-wing-btn--active' : ''}`}
                    onClick={() => handleWingChange('climate')}
                    aria-label="Switch to Climate Tech"
                    title="Climate Tech"
                >
                    {wings.climate?.logoUrl ? (
                        <img src={wings.climate.logoUrl} alt="Climate" className="floating-wing-logo" />
                    ) : (
                        <Leaf size={20} />
                    )}
                </button>
            </div>
        </main>
    );
}

