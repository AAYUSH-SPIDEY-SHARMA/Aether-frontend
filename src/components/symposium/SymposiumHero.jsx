import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, MessageCircle } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import './SymposiumHero.css';

export default function SymposiumHero() {
    return (
        <section className="symposium-hero">
            {/* Animated Background */}
            <div className="symposium-hero-bg">
                <div className="symposium-gradient" />
                <div className="symposium-grid" />
                <div className="symposium-particles">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                '--delay': `${Math.random() * 5}s`,
                                '--duration': `${15 + Math.random() * 10}s`,
                                '--x': `${Math.random() * 100}%`,
                                '--y': `${Math.random() * 100}%`,
                                '--size': `${2 + Math.random() * 4}px`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="symposium-hero-content container">
                {/* Badge */}
                <div className="symposium-badge animate-fade-in">
                    <span className="badge badge-cyan">Technical Symposium 2026</span>
                </div>

                {/* Title */}
                <h1 className="symposium-title heading-display animate-fade-in-up">
                    <span className="title-line">AETHER</span>
                    <span className="title-line text-gradient">Symposium 2026</span>
                </h1>

                {/* Tagline */}
                <p className="symposium-tagline animate-fade-in-up stagger-1">
                    Where Innovation Meets Excellence. Two days of cutting-edge competitions,
                    workshops, hackathons, and insights from industry leaders.
                </p>

                {/* Event Info */}
                <div className="symposium-info animate-fade-in-up stagger-2">
                    <div className="info-item">
                        <Calendar size={18} />
                        <span>February 15-16, 2026</span>
                    </div>
                    <div className="info-divider" />
                    <div className="info-item">
                        <MapPin size={18} />
                        <span>IIIT Lucknow Campus</span>
                    </div>
                </div>

                {/* Countdown */}
                <div className="symposium-countdown animate-fade-in-up stagger-3">
                    <CountdownTimer targetDate="2026-02-15T09:00:00" />
                </div>

                {/* CTAs */}
                <div className="symposium-ctas animate-fade-in-up stagger-4">
                    <Link to="/events" className="btn btn-primary btn-lg">
                        Register Now
                        <ArrowRight size={18} />
                    </Link>
                    <Link to="/events" className="btn btn-secondary btn-lg">
                        Browse Events
                    </Link>
                </div>

                {/* Stats */}
                <div className="symposium-stats animate-fade-in-up stagger-5">
                    <div className="stat">
                        <span className="stat-value">15+</span>
                        <span className="stat-label">Events</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">₹2L+</span>
                        <span className="stat-label">Prize Pool</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">2000+</span>
                        <span className="stat-label">Participants</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">50+</span>
                        <span className="stat-label">Colleges</span>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-wheel" />
                </div>
                <span>Scroll to explore</span>
            </div>
        </section>
    );
}
