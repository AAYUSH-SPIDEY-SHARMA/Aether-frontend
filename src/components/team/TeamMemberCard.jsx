import { Linkedin, Github, Mail, Instagram } from 'lucide-react';
import { getCropStyle } from '../../utils/imageUtils';
import './TeamMemberCard.css';

export default function TeamMemberCard({ member, variant = 'default' }) {
    const initials = member.name.split(' ').slice(0, 2).map(n => n[0]).join('');

    return (
        <div className={`member-card-epic ${variant} ${member.highlightTag ? 'highlighted' : ''}`}>
            {/* HUD Frame */}
            <div className="member-hud-frame">
                <span className="hud-corner hud-corner--tl" />
                <span className="hud-corner hud-corner--tr" />
                <span className="hud-corner hud-corner--bl" />
                <span className="hud-corner hud-corner--br" />
            </div>

            {/* Status Badge */}
            <div className="member-status-badge">
                <span className="status-dot" />
                <span>TEAM</span>
            </div>

            {/* Image Area */}
            <div className="member-image-area">
                {member.image ? (
                    (() => {
                        const cropStyles = getCropStyle(member.imageCrop);

                        if (cropStyles.hasData) {
                            return (
                                <div style={cropStyles.wrapper}>
                                    <img src={member.image} alt={member.name} style={cropStyles.image} />
                                </div>
                            );
                        }
                        return <img src={member.image} alt={member.name} className="member-image" />;
                    })()
                ) : (
                    <div className="member-avatar-large">
                        {initials}
                    </div>
                )}
            </div>

            {/* Data Panel */}
            <div className="member-data-panel">
                <h4 className="member-name">{member.name}</h4>

                {/* Role Badge - Show highlight tag if exists, otherwise regular role */}
                {member.highlightTag ? (
                    <div className="member-highlight-tag">
                        {member.highlightTag}
                    </div>
                ) : (
                    <span className="member-role-badge">
                        {member.role}
                    </span>
                )}

                {/* Social Icons */}
                <div className="member-socials">
                    {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin size={14} />
                        </a>
                    )}
                    {member.github && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github size={14} />
                        </a>
                    )}
                    {member.instagram && (
                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram size={14} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
