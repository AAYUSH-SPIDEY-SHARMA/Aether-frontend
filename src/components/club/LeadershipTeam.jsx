import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, ArrowRight, Star, Instagram } from 'lucide-react';
import { teamAPI } from '../../services/api';
import { getCropStyle } from '../../utils/imageUtils';
import { clubCoordinators } from '../../mock/team'; // Fallback mock data
import './LeadershipTeam.css';

/**
 * LeadershipTeam - Epic HUD-style team cards for home page
 * Features: Large images, HUD corners, purple/pink neon theme
 * Fetches HOME_FEATURED members from database, falls back to mock data
 */
export default function LeadershipTeam() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await teamAPI.getAll();
                const allMembers = res.data?.data?.members || [];

                // Filter for HOME_FEATURED type
                const homeMembers = allMembers.filter(m => m.type === 'HOME_FEATURED' && m.isActive);

                if (homeMembers.length > 0) {
                    // Map database data to component format
                    const members = homeMembers
                        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                        .slice(0, 5)
                        .map(m => ({
                            id: m.id,
                            name: m.name,
                            role: m.primaryRole || 'Coordinator',
                            image: m.imageUrl,
                            imageCrop: m.imageCrop,
                            linkedin: m.linkedin,
                            github: m.github,
                            instagram: m.instagram,
                        }));
                    setTeamMembers(members);
                } else {
                    // Fallback to mock data if no HOME_FEATURED members
                    setTeamMembers(clubCoordinators.slice(0, 5));
                }
            } catch (error) {
                console.error('Failed to fetch leadership team:', error);
                // Fallback to mock data on error
                setTeamMembers(clubCoordinators.slice(0, 5));
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    if (loading) {
        return (
            <section className="leadership-section section">
                <div className="container">
                    <div className="leadership-header">
                        <span className="section-label">Our Team</span>
                        <h2 className="section-title heading-display heading-2">
                            Leadership & <span className="text-gradient-purple">Core Team</span>
                        </h2>
                    </div>
                    <div className="loading-state" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        Loading...
                    </div>
                </div>
            </section>
        );
    }

    if (teamMembers.length === 0) return null;

    return (
        <section className="leadership-section section">
            <div className="container">
                <div className="leadership-header">
                    <span className="section-label">Our Team</span>
                    <h2 className="section-title heading-display heading-2">
                        Leadership & <span className="text-gradient-purple">Core Team</span>
                    </h2>
                    <p className="section-description">
                        The people driving AETHER forward
                    </p>
                </div>

                <div className="leadership-grid">
                    {teamMembers.map((member) => (
                        <TeamCard key={member.id} member={member} />
                    ))}
                </div>

                <div className="leadership-cta">
                    <Link to="/team" className="btn btn-outline btn-purple">
                        View Full Team
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

/**
 * TeamCard - HUD-style card component with crop support
 */
function TeamCard({ member }) {
    const isSpecialRole = member.role === 'Overall Coordinator' ||
        member.role?.includes('Co-Chair') ||
        member.role?.includes('Lead');

    // Get crop styles for image
    const cropStyles = getCropStyle(member.imageCrop);

    return (
        <div className={`team-card-epic ${isSpecialRole ? 'team-card-special' : ''}`}>
            {/* HUD Frame Corners */}
            <div className="team-hud-frame">
                <span className="hud-corner hud-corner--tl" />
                <span className="hud-corner hud-corner--tr" />
                <span className="hud-corner hud-corner--bl" />
                <span className="hud-corner hud-corner--br" />
            </div>

            {/* Special Role Star Badge */}
            {isSpecialRole && (
                <div className="team-star-badge">
                    <Star size={12} />
                </div>
            )}

            {/* Image Area */}
            <div className="team-image-area">
                {member.image ? (
                    cropStyles.hasData ? (
                        <div style={cropStyles.wrapper}>
                            <img src={member.image} alt={member.name} style={cropStyles.image} />
                        </div>
                    ) : (
                        <img src={member.image} alt={member.name} className="team-image" />
                    )
                ) : (
                    <div className="team-avatar-large">
                        {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                )}
            </div>

            {/* Data Panel */}
            <div className="team-data-panel">
                <h4 className="team-name">{member.name}</h4>

                <span className={`team-role-badge ${isSpecialRole ? 'role-special' : ''}`}>
                    {member.role}
                </span>

                {/* Social Links */}
                <div className="team-socials">
                    {member.linkedin && (
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={14} />
                        </a>
                    )}
                    {member.github && (
                        <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <Github size={14} />
                        </a>
                    )}
                    {member.instagram && (
                        <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <Instagram size={14} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
