// FeaturedEvents - Symposium Events from API
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import EventCard from '../events/EventCard';
import { eventsAPI } from '../../services/api';
import './FeaturedEvents.css';

export default function FeaturedEvents() {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await eventsAPI.getAll();
                const allEvents = res.data?.data?.events || res.data?.events || res.data || [];

                // Get featured/competition/workshop events
                const featured = allEvents
                    .filter(e => e.isFeatured || e.eventType === 'COMPETITION' || e.eventType === 'WORKSHOP')
                    .slice(0, 4)
                    .map(event => ({
                        ...event,
                        title: event.title || event.name,
                        eventType: event.eventType || 'COMPETITION',
                        category: event.eventType || 'COMPETITION',
                        prizes: event.prizePool > 0 ? `₹${event.prizePool.toLocaleString('en-IN')}` : null,
                        teamType: event.teamType || 'SOLO',
                        maxSeats: event.maxSeats,
                        registeredCount: event._count?.registrations || 0
                    }));

                setFeaturedEvents(featured);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <section className="featured-events section">
                <div className="container">
                    <div className="loading-state" style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Loader2 size={32} className="spinning" style={{ color: '#00f0ff' }} />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="featured-events section">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-label">Symposium Events</span>
                    <h2 className="section-title heading-display heading-2">
                        Compete & <span className="text-gradient">Conquer</span>
                    </h2>
                    <p className="section-description">
                        From intense coding battles to hands-on workshops, find your arena and showcase your skills.
                    </p>
                </motion.div>

                {/* Events Grid - Using EventCard V2 */}
                {featuredEvents.length > 0 && (
                    <motion.div
                        className="featured-events-grid"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.15 } }
                        }}
                    >
                        {featuredEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))}
                    </motion.div>
                )}

                {/* View All Button */}
                <motion.div
                    className="section-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/events" className="btn btn-outline">
                        View All Events
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

