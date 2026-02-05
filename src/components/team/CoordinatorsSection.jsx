import { useState, useEffect } from 'react';
import { Linkedin, Github, Mail, Instagram } from 'lucide-react';
import { teamAPI } from '../../services/api';
import { getCropStyle } from '../../utils/imageUtils';
import './CoordinatorsSection.css';

export default function CoordinatorsSection() {
    const [coordinators, setCoordinators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoordinators = async () => {
            try {
                const res = await teamAPI.getAll();
                const allMembers = res.data?.data?.members || [];
                // Filter for club coordinators only (wing coordinators show on Wings page)
                const coords = allMembers
                    .filter(m => m.type === 'CLUB_COORDINATOR' && m.isActive)
                    .map(m => ({
                        id: m.id,
                        name: m.name,
                        role: m.primaryRole || 'Coordinator',
                        image: m.imageUrl, // Map imageUrl to image
                        imageCrop: m.imageCrop,
                        linkedin: m.linkedin,
                        github: m.github,
                        instagram: m.instagram,
                        email: m.email,
                    }));
                setCoordinators(coords);
            } catch (error) {
                console.error('Failed to fetch coordinators:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoordinators();
    }, []);

    if (loading) {
        return (
            <section className="coordinators-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title heading-display heading-2">
                            Club <span className="text-gradient-purple">Coordinators</span>
                        </h2>
                    </div>
                    <div className="loading-state">Loading...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="coordinators-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title heading-display heading-2">
                        Club <span className="text-gradient-purple">Coordinators</span>
                    </h2>
                    <p className="section-subtitle">
                        Leading the charge in innovation and excellence
                    </p>
                </div>

                <div className="coordinators-grid">
                    {coordinators.map((coordinator) => (
                        <div key={coordinator.id} className="coord-card-epic">
                            {/* HUD Frame Corners */}
                            <div className="coord-hud-frame">
                                <span className="hud-corner hud-corner--tl" />
                                <span className="hud-corner hud-corner--tr" />
                                <span className="hud-corner hud-corner--bl" />
                                <span className="hud-corner hud-corner--br" />
                            </div>

                            {/* Status Badge - Role-based */}
                            {(() => {
                                const role = coordinator.role?.toLowerCase() || '';
                                if (role.includes('overall')) {
                                    return (
                                        <div className="coord-status-badge badge-aether">
                                            <span className="status-dot" />
                                            <span>AETHER</span>
                                        </div>
                                    );
                                } else if (role.includes('web') || role.includes('coding') || role.includes('wnc')) {
                                    return (
                                        <div className="coord-status-badge badge-wnc">
                                            <span className="status-dot" />
                                            <span>WnC</span>
                                        </div>
                                    );
                                } else if (role.includes('climate') || role.includes('cro')) {
                                    return (
                                        <div className="coord-status-badge badge-cro">
                                            <span className="status-dot" />
                                            <span>CRO</span>
                                        </div>
                                    );
                                }
                                return (
                                    <div className="coord-status-badge">
                                        <span className="status-dot" />
                                        <span>ACTIVE</span>
                                    </div>
                                );
                            })()}

                            {/* Image Area */}
                            <div className="coord-image-area">
                                <div className="coord-image-bg" />
                                {coordinator.image ? (
                                    (() => {
                                        const cropStyles = getCropStyle(coordinator.imageCrop);

                                        if (cropStyles.hasData) {
                                            return (
                                                <div style={cropStyles.wrapper}>
                                                    <img src={coordinator.image} alt={coordinator.name} style={cropStyles.image} />
                                                </div>
                                            );
                                        }
                                        return (
                                            <img
                                                src={coordinator.image}
                                                alt={coordinator.name}
                                                className="coord-image"
                                            />
                                        );
                                    })()
                                ) : (
                                    <div className="coord-avatar-large">
                                        {coordinator.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                )}
                            </div>

                            {/* Data Panel */}
                            <div className="coord-data-panel">
                                <h4 className="coord-name">{coordinator.name}</h4>
                                <span className="coord-role-badge">
                                    {coordinator.role}
                                </span>

                                {/* Social Icons */}
                                <div className="coord-socials">
                                    {coordinator.linkedin && (
                                        <a
                                            href={coordinator.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="LinkedIn"
                                            className="social-icon"
                                        >
                                            <Linkedin size={16} />
                                        </a>
                                    )}
                                    {coordinator.github && (
                                        <a
                                            href={coordinator.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="GitHub"
                                            className="social-icon"
                                        >
                                            <Github size={16} />
                                        </a>
                                    )}
                                    {coordinator.instagram && (
                                        <a
                                            href={coordinator.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            className="social-icon"
                                        >
                                            <Instagram size={16} />
                                        </a>
                                    )}
                                    <a
                                        href={`mailto:aether@iiitl.ac.in`}
                                        aria-label="Email"
                                        className="social-icon"
                                    >
                                        <Mail size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
