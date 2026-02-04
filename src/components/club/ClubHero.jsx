import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Users } from 'lucide-react';
import NeuralGrid from '../common/NeuralGrid';
import AnimatedLogo from '../common/AnimatedLogo';
import './ClubHero.css';

export default function ClubHero() {
    return (
        <section className="club-hero">
            {/* Animated Neural Grid Background */}
            <NeuralGrid />

            {/* Background Effects */}
            <div className="club-hero-bg">
                <div className="gradient-spotlight" />
                <div className="glow-orb glow-orb-1" />
                <div className="glow-orb glow-orb-2" />
            </div>

            <div className="container club-hero-content">
                {/* Main Title */}
                <div className="club-hero-title-wrap">
                    <span className="club-hero-badge">
                        Official Data Science & AI/ML Club
                    </span>
                    <h1 className="club-hero-title heading-display">
                        AETHER
                    </h1>
                    <p className="club-hero-institution">
                        IIIT Lucknow
                    </p>
                </div>

                {/* Tagline */}
                <p className="club-hero-tagline">
                    Engineering the future through technology, innovation, and community.
                </p>

                {/* CTAs - Only 2 */}
                <div className="club-hero-actions">
                    <Link to="/events" className="btn btn-primary btn-lg">
                        Explore Events
                        <ArrowRight size={18} />
                    </Link>
                    <Link to="/team" className="btn btn-secondary btn-lg">
                        <Users size={18} />
                        Meet the Team
                    </Link>
                </div>

                {/* Scroll Indicator */}
                <div className="club-scroll-indicator">
                    <span>Explore</span>
                    <ChevronDown size={20} />
                </div>
            </div>
        </section>
    );
}
