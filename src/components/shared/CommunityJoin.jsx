import { useState } from 'react';
import { MessageCircle, ExternalLink, Mail, Linkedin } from 'lucide-react';
import './CommunityJoin.css';

/**
 * CommunityJoin - Tech Command Center style
 * Features: Animated connection lines, icon hover pulses, click ripples
 */
export default function CommunityJoin() {
    return (
        <section className="community-section section">
            <div className="container">
                <div className="command-center">
                    {/* Background Grid */}
                    <div className="command-grid" />

                    {/* Connection Lines SVG */}
                    <svg className="connection-lines" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(0, 240, 255, 0)" />
                                <stop offset="50%" stopColor="rgba(0, 240, 255, 0.5)" />
                                <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                            </linearGradient>
                        </defs>
                        <path
                            className="connection-path"
                            d="M50,50 Q100,30 150,50 Q200,70 250,50 Q300,30 350,50"
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="1"
                        />
                    </svg>

                    {/* Content */}
                    <div className="command-content">
                        <span className="section-label">Join the Network</span>
                        <h2 className="section-title heading-display heading-2">
                            Stay <span className="text-gradient">Connected</span>
                        </h2>
                        <p className="command-description">
                            Get instant updates, connect with fellow members, and never miss an announcement.
                        </p>

                        {/* Channel Buttons */}
                        <div className="channel-grid">
                            <ChannelButton
                                href="https://discord.gg/5rJxqxSTbw"
                                icon={
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                }
                                label="Discord"
                                sublabel="Team finding & discussions"
                                color="discord"
                            />
                            <ChannelButton
                                href="https://chat.whatsapp.com/DzpQbnArztA1gpyCDMc7w6"
                                icon={<MessageCircle size={22} />}
                                label="WhatsApp"
                                sublabel="Instant announcements"
                                color="whatsapp"
                            />
                            <ChannelButton
                                href="https://www.linkedin.com/company/aether-iiit-lucknow/"
                                icon={<Linkedin size={22} />}
                                label="LinkedIn"
                                sublabel="Professional updates"
                                color="linkedin"
                            />
                            <ChannelButton
                                href="mailto:aether@iiitl.ac.in"
                                icon={<Mail size={22} />}
                                label="Email"
                                sublabel="aether@iiitl.ac.in"
                                color="email"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/**
 * ChannelButton - Individual channel with pulse and ripple effects
 */
function ChannelButton({ href, icon, label, sublabel, color }) {
    const [ripple, setRipple] = useState(null);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setRipple({ x, y });
        setTimeout(() => setRipple(null), 600);
    };

    return (
        <a
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            className={`channel-btn channel-${color}`}
            onClick={handleClick}
        >
            {/* Ripple effect */}
            {ripple && (
                <span
                    className="channel-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                />
            )}

            {/* Pulse indicator */}
            <span className="channel-pulse" />

            {/* Icon */}
            <span className="channel-icon">{icon}</span>

            {/* Text */}
            <span className="channel-text">
                <span className="channel-label">{label}</span>
                <span className="channel-sublabel">{sublabel}</span>
            </span>

            {/* External indicator */}
            {!href.startsWith('mailto') && (
                <ExternalLink size={14} className="channel-external" />
            )}
        </a>
    );
}
