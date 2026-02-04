// WingContent - Epic High-Tech Layout with HUD-style Profile Cards
import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, Mail, ArrowRight, Leaf, Target, Zap, Flame, Instagram } from 'lucide-react';
import WingGallery from './WingGallery';
import { getCropStyle } from '../../utils/imageUtils';
import './WingContent.css';

export default function WingContent({ wing, direction, theme }) {
    // Use logoUrl from database (Cloudinary) or fallback to local path
    const logoPath = wing.logoUrl || (theme === 'fire' ? '/images/wings/wnc-logo.png' : '/images/wings/climate-logo.png');

    return (
        <motion.div
            className={`wing-content wing-content--${theme}`}
            initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Wing Header */}
            <div className="wing-header-section">
                <div className="wing-icon-badge wing-icon-badge--large">
                    {logoPath ? (
                        <img
                            src={logoPath}
                            alt={wing.name}
                            className="wing-header-logo"
                        />
                    ) : theme === 'fire' ? (
                        <Flame size={48} className="wing-header-icon" />
                    ) : (
                        <Leaf size={48} className="wing-header-icon" />
                    )}
                    <div className="icon-pulse" />
                </div>
                <h2 className="wing-main-title">{wing.name}</h2>
                <p className="wing-tagline">{wing.tagline}</p>
            </div>

            {/* About Section */}
            <div className="wing-about">
                <p className="wing-description">{wing.description}</p>
                <p className="wing-mission">{wing.mission}</p>
            </div>

            {/* Focus Areas */}
            <div className="wing-focus-section">
                <h3 className="wing-section-label">Focus Areas</h3>
                <div className="focus-pills">
                    {wing.focus.map((item, index) => (
                        <motion.span
                            key={index}
                            className="focus-pill"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {item}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* ============ HIGH-TECH COORDINATOR CARDS ============ */}
            <section className="wing-coordinators-section">
                <h3 className="wing-section-title">
                    Wing <span className="accent-text">Coordinators</span>
                </h3>
                <div className="coordinators-grid">
                    {wing.coordinators.map((coord, index) => (
                        <motion.div
                            key={coord.id}
                            className="coord-card-epic"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            {/* HUD Frame */}
                            <div className="coord-hud-frame">
                                <div className="hud-corner hud-corner--tl" />
                                <div className="hud-corner hud-corner--tr" />
                                <div className="hud-corner hud-corner--bl" />
                                <div className="hud-corner hud-corner--br" />
                            </div>

                            {/* Wing Badge */}
                            <div className={`coord-status-badge ${theme === 'fire' ? 'badge-wnc' : 'badge-cro'}`}>
                                <span className="status-dot" />
                                <span>{theme === 'fire' ? 'WnC' : 'CRO'}</span>
                            </div>

                            {/* Profile Image Area */}
                            <div className="coord-image-area">
                                <div className="coord-image-bg" />
                                {coord.image ? (
                                    (() => {
                                        const cropStyles = getCropStyle(coord.imageCrop);

                                        if (cropStyles.hasData) {
                                            return (
                                                <div style={cropStyles.wrapper}>
                                                    <img src={coord.image} alt={coord.name} style={cropStyles.image} />
                                                </div>
                                            );
                                        }
                                        return <img src={coord.image} alt={coord.name} className="coord-image" />;
                                    })()
                                ) : (
                                    <div className="coord-avatar-large">
                                        <span>{coord.name.split(' ').map(n => n[0]).join('')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Data Panel */}
                            <div className="coord-data-panel">
                                <div className="data-line" />
                                <h4 className="coord-name-epic">{coord.name}</h4>
                                <span className="coord-role-epic">{coord.role}</span>
                                <span className="coord-program-epic">{coord.program}</span>
                            </div>

                            {/* Floating Social Icons */}
                            <div className="coord-social-float">
                                {coord.linkedin && (
                                    <motion.a
                                        href={coord.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-float-btn"
                                        whileHover={{ y: -4, scale: 1.1 }}
                                    >
                                        <Linkedin size={18} />
                                    </motion.a>
                                )}
                                {coord.github && (
                                    <motion.a
                                        href={coord.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-float-btn"
                                        whileHover={{ y: -4, scale: 1.1 }}
                                    >
                                        <Github size={18} />
                                    </motion.a>
                                )}
                                {coord.instagram && (
                                    <motion.a
                                        href={coord.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-float-btn"
                                        whileHover={{ y: -4, scale: 1.1 }}
                                    >
                                        <Instagram size={18} />
                                    </motion.a>
                                )}
                                <motion.a
                                    href="mailto:aether@iiitl.ac.in"
                                    className="social-float-btn"
                                    whileHover={{ y: -4, scale: 1.1 }}
                                >
                                    <Mail size={18} />
                                </motion.a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Activities */}
            <section className="wing-activities-section">
                <h3 className="wing-section-title">
                    What We <span className="accent-text">Do</span>
                </h3>
                <div className="activities-grid">
                    {wing.activities.map((activity, index) => (
                        <motion.div
                            key={index}
                            className="activity-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                        >
                            <div className="activity-icon-wrap">
                                {index % 2 === 0 ? <Target size={20} /> : <Zap size={20} />}
                            </div>
                            <div className="activity-info">
                                <h4>{activity.title}</h4>
                                <p>{activity.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Gallery */}
            <section className="wing-gallery-section">
                <h3 className="wing-section-title">
                    Moments & <span className="accent-text">Memories</span>
                </h3>
                <WingGallery gallery={wing.gallery} color={wing.color} />
            </section>

            {/* CTA */}
            <div className="wing-cta-section">
                <div className="wing-cta-content">
                    <h3>Want to join {wing.shortName}?</h3>
                    <p>Connect with us and start your journey</p>
                </div>
                <a href="/contact" className="btn btn-primary wing-cta-btn">
                    Get in Touch
                    <ArrowRight size={16} />
                </a>
            </div>
        </motion.div>
    );
}
