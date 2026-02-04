// Next-Gen Event Card V2 - Ultimate Futuristic Design
// Features: Image area, particle effects, lightning, epic animations
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap, ArrowRight, User, UserPlus, Sparkles } from 'lucide-react';
import { useTiltEffect, useGlowEffect } from './EventCardFX';
import { getCropStyle } from '../../utils/imageUtils';
import './EventCard.css';

export default function EventCard({ event, index = 0 }) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    // FX Hooks
    const tilt = useTiltEffect({ maxTilt: 8, scale: 1.03 });
    const glow = useGlowEffect();

    // Event Data
    const {
        title,
        slug,
        eventType = 'COMPETITION',
        teamType = 'SOLO',
        minTeamSize = 1,
        maxTeamSize = 1,
        description,
        fee = 0,
        maxSeats,
        prizes,
        registeredCount,
        _count,
        imageUrl,
        imageCrop,
        isLive = true,
    } = event;

    const registrations = registeredCount || _count?.registrations || 0;
    const isTeam = teamType === 'TEAM';
    const teamLabel = isTeam ? `${minTeamSize}-${maxTeamSize}` : 'Solo';
    const isFull = maxSeats && registrations >= maxSeats;

    // Handlers
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        tilt.handleMouseLeave();
    }, [tilt]);

    const handleMouseMove = useCallback((e) => {
        tilt.handleMouseMove(e);
        glow.handleMouseMove(e);
    }, [tilt, glow]);

    const handleRegister = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isFull && isLive) {
            navigate(`/register/${slug}`);
        }
    }, [navigate, slug, isFull, isLive]);

    const handleViewDetails = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/events/${slug}`);
    }, [navigate, slug]);

    // Animation variants
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 60,
            scale: 0.9,
            rotateX: 15,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    // Get event type color
    const getEventTypeColor = () => {
        switch (eventType?.toUpperCase()) {
            case 'COMPETITION': return 'cyan';
            case 'WORKSHOP': return 'purple';
            case 'HACKATHON': return 'green';
            case 'TALK': return 'gold';
            default: return 'cyan';
        }
    };

    const typeColor = getEventTypeColor();

    return (
        <motion.article
            className={`event-card-v2 event-card-v2--${typeColor} ${isHovered ? 'event-card-v2--hovered' : ''}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            ref={(node) => {
                cardRef.current = node;
                tilt.ref.current = node;
                glow.ref.current = node;
            }}
            style={{
                ...tilt.style,
                '--glow-x': `${glow.glowPosition.x}%`,
                '--glow-y': `${glow.glowPosition.y}%`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            {/* Outer Frame - Gradient Border */}
            <div className="event-card-v2__frame" />

            {/* Lightning Bolts */}
            <div className="event-card-v2__lightning event-card-v2__lightning--left" />
            <div className="event-card-v2__lightning event-card-v2__lightning--right" />

            {/* Particle Effect */}
            <div className="event-card-v2__particles">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="particle" style={{ '--i': i }} />
                ))}
            </div>

            {/* Energy Lines */}
            <svg className="event-card-v2__energy" viewBox="0 0 400 500" preserveAspectRatio="none">
                <path className="energy-line energy-line--1" d="M0,100 Q100,80 200,100 T400,100" />
                <path className="energy-line energy-line--2" d="M0,400 Q100,420 200,400 T400,400" />
            </svg>

            {/* Content Container */}
            <div className="event-card-v2__inner">
                {/* Image Area */}
                <div className="event-card-v2__image">
                    {imageUrl ? (
                        (() => {
                            const cropStyles = getCropStyle(imageCrop);

                            if (cropStyles.hasData) {
                                return (
                                    <div style={cropStyles.wrapper}>
                                        <img src={imageUrl} alt={title} style={cropStyles.image} />
                                    </div>
                                );
                            }
                            return <img src={imageUrl} alt={title} />;
                        })()
                    ) : (
                        <div className="event-card-v2__image-placeholder">
                            <div className="image-grid" />
                            <div className="image-icon">
                                <Zap size={48} />
                            </div>
                            <div className="image-glow" />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="event-card-v2__title">{title}</h3>

                {/* Stats Bar - Registered + Team Type */}
                <div className="event-card-v2__stats">
                    {/* Registered */}
                    <div className="stat-item stat-item--seats">
                        <Users size={16} className="stat-icon" />
                        <div className="stat-content">
                            <span className="stat-label">Registered</span>
                            <span className="stat-value">{registrations}{maxSeats ? `/${maxSeats}` : ''}</span>
                        </div>
                    </div>

                    {/* Team Type - moved from image overlay */}
                    <div className="stat-item stat-item--team">
                        {isTeam ? <UserPlus size={16} className="stat-icon" /> : <User size={16} className="stat-icon" />}
                        <div className="stat-content">
                            <span className="stat-label">Team</span>
                            <span className="stat-value">{isTeam ? `${teamLabel}` : 'SOLO'}</span>
                        </div>
                    </div>
                </div>

                {/* Fee + Event Type Row */}
                <div className={`event-card-v2__fee ${fee === 0 ? 'event-card-v2__fee--free' : ''}`}>
                    <div className="fee-left">
                        <span className="fee-label">Entry Fee</span>
                        <span className="fee-value">{fee === 0 ? 'FREE' : `₹${fee}`}</span>
                    </div>
                    <span className={`event-type-badge event-type-badge--${typeColor}`}>
                        <Sparkles size={10} />
                        {eventType}
                    </span>
                </div>

                {/* CTA Buttons */}
                <div className="event-card-v2__cta">
                    <button className="cta-btn cta-btn--secondary" onClick={handleViewDetails}>
                        Explore
                    </button>
                    <button
                        className={`cta-btn cta-btn--primary ${isFull ? 'cta-btn--disabled' : ''}`}
                        onClick={handleRegister}
                        disabled={isFull || !isLive}
                    >
                        <span>{isFull ? 'Full' : 'Register'}</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Scan Line Effect */}
            <div className="event-card-v2__scanline" />

            {/* Glow Orb */}
            <div className="event-card-v2__glow-orb" />
        </motion.article>
    );
}
