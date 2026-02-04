import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Leaf } from 'lucide-react';
import { wingsAPI } from '../../services/api';
import './OurWings.css';

/**
 * OurWings - Fetches data from API to display wing logos from Cloudinary
 */
export default function OurWings() {
    const [wings, setWings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWings = async () => {
            try {
                const res = await wingsAPI.getAll();
                const wingsData = res.data?.data?.wings || [];
                // Transform API data to component format
                const formattedWings = wingsData.map(wing => ({
                    id: wing.slug,
                    name: wing.name,
                    shortName: wing.name.includes('Climate') ? 'Climate Tech' : 'WnC Wing',
                    logo: wing.logoUrl, // Cloudinary URL from database
                    description: wing.description,
                    focusAreas: wing.focus?.map(f => f.title).join(', ') || '',
                    color: wing.color || 'cyan'
                }));
                setWings(formattedWings);
            } catch (error) {
                console.error('Failed to fetch wings:', error);
                // Fallback to hardcoded data if API fails
                setWings([
                    {
                        id: 'wnc',
                        name: 'Web & Coding Wing',
                        shortName: 'WnC Wing',
                        logo: '/images/wings/wnc-logo.png',
                        description: 'The technical backbone of AETHER, focused on competitive programming, web development, AI/ML, hackathons, and open-source contributions.',
                        focusAreas: 'Competitive Programming, Web Development, AI/ML, Hackathons, Open Source',
                        color: 'cyan'
                    },
                    {
                        id: 'climate',
                        name: 'Climate Tech Wing',
                        shortName: 'Climate Tech',
                        logo: '/images/wings/climate-logo.png',
                        description: 'Leveraging AI and data science for environmental sustainability, collaborating with the Climate Research Office on cutting-edge research.',
                        focusAreas: 'AI for Sustainability, Climate Research, Environmental Data Science, CRO Collaboration',
                        color: 'green'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchWings();
    }, []);

    return (
        <section className="our-wings section">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">Specialized Teams</span>
                    <h2 className="section-title heading-display heading-2">
                        Our <span className="text-gradient">Wings</span>
                    </h2>
                    <p className="section-description">
                        Dedicated teams driving innovation and impact across different domains.
                    </p>
                </div>

                <div className="wings-grid">
                    {wings.map((wing) => (
                        <WingCard key={wing.id} wing={wing} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/**
 * WingCard - Futuristic panel with logo, content, and animated border
 */
function WingCard({ wing }) {
    return (
        <Link
            to={`/wings#${wing.id}`}
            className={`wing-card wing-${wing.color}`}
            aria-label={`Learn more about ${wing.name}`}
        >
            {/* Animated border sweep */}
            <div className="wing-border-sweep" />

            {/* Glow effect */}
            <div className="wing-glow" />

            {/* Logo */}
            <div className="wing-logo">
                {wing.logo ? (
                    <img
                        src={wing.logo}
                        alt={`${wing.name} logo`}
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : wing.color === 'cyan' ? (
                    <Flame size={48} className="wing-logo-fallback" />
                ) : (
                    <Leaf size={48} className="wing-logo-fallback" />
                )}
            </div>

            {/* Content */}
            <div className="wing-content">
                <h3 className="wing-name">{wing.name}</h3>
                <p className="wing-description">{wing.description}</p>

                {/* Focus areas as inline text */}
                <p className="wing-focus">{wing.focusAreas}</p>

                {/* CTA */}
                <span className="wing-cta">
                    Explore Wing
                    <ArrowRight size={16} />
                </span>
            </div>
        </Link>
    );
}

