// Speakers - Epic Techy Cards with Animations
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { getFeaturedSpeakers } from '../../mock/speakers';
import './Speakers.css';

export default function Speakers() {
    const speakers = getFeaturedSpeakers();

    return (
        <section className="symposium-speakers section">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-label">Industry Experts</span>
                    <h2 className="section-title heading-display heading-2">
                        Learn from the <span className="text-gradient">Best</span>
                    </h2>
                    <p className="section-description">
                        Industry leaders and innovators sharing their knowledge and experience at Symposium 2026.
                    </p>
                </motion.div>

                {/* Speakers Grid */}
                <div className="speakers-grid">
                    {speakers.map((speaker, index) => (
                        <motion.div
                            key={speaker.id}
                            className="speaker-card"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                        >
                            {/* Holographic Frame */}
                            <div className="speaker-card__frame" />

                            {/* Profile Section */}
                            <div className="speaker-card__profile">
                                <div className="speaker-avatar">
                                    <div className="avatar-glow" />
                                    <span className="avatar-initials">
                                        {speaker.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                    <div className="avatar-ring" />
                                </div>

                                {/* Social Links */}
                                <div className="speaker-card__social">
                                    {speaker.social.linkedin && (
                                        <a
                                            href={speaker.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-btn social-btn--linkedin"
                                        >
                                            <Linkedin size={16} />
                                        </a>
                                    )}
                                    {speaker.social.twitter && (
                                        <a
                                            href={speaker.social.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-btn social-btn--twitter"
                                        >
                                            <Twitter size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="speaker-card__info">
                                <h4 className="speaker-name">{speaker.name}</h4>
                                <p className="speaker-title">{speaker.title}</p>
                                <p className="speaker-company">{speaker.company}</p>
                            </div>

                            {/* Topics */}
                            <div className="speaker-card__topics">
                                {speaker.topics.slice(0, 2).map((topic, i) => (
                                    <span key={i} className="topic-tag">{topic}</span>
                                ))}
                            </div>

                            {/* Scanline Effect */}
                            <div className="speaker-card__scanline" />
                        </motion.div>
                    ))}
                </div>

                {/* View All */}
                <motion.div
                    className="section-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/symposium/speakers" className="btn btn-outline">
                        View All Speakers
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
