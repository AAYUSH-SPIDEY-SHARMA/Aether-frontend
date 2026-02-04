// Sponsors - Simple display without tier labels
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { sponsors } from '../../mock/sponsors';
import './Sponsors.css';

export default function Sponsors() {
    // Flatten all sponsors into one list
    const allSponsors = [
        ...sponsors.title,
        ...sponsors.platinum,
        ...sponsors.gold,
        ...sponsors.silver
    ];

    return (
        <section className="symposium-sponsors section">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-label">Our Partners</span>
                    <h2 className="section-title heading-display heading-2">
                        Backed by <span className="text-gradient">Industry Leaders</span>
                    </h2>
                </motion.div>

                {/* All Sponsors in Grid - No Labels */}
                <motion.div
                    className="sponsors-grid"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {allSponsors.map((sponsor, index) => (
                        <motion.a
                            key={sponsor.id}
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sponsor-card"
                            whileHover={{ scale: 1.05, y: -4 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <span className="sponsor-name">{sponsor.name}</span>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Become a Sponsor CTA */}
                <motion.div
                    className="sponsor-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <p>Interested in sponsoring AETHER Symposium 2026?</p>
                    <a href="mailto:aether@iiitl.ac.in" className="btn btn-outline">
                        Become a Sponsor
                        <ArrowRight size={16} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
