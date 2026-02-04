// Events Page - AETHER Symposium 2026 Events with Category Tabs
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Trophy, BookOpen, Mic } from 'lucide-react';
import { EventCard, EventCardSkeletonGrid } from '../components/events';
import { events as mockEvents } from '../mock/events';
import './Events.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
    { id: 'all', label: 'All Events', icon: null },
    { id: 'COMPETITION', label: 'Competitions', icon: Trophy },
    { id: 'WORKSHOP', label: 'Workshops', icon: BookOpen },
    { id: 'TALK', label: 'Talks & Sessions', icon: Mic }
];

export default function Events() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);

    // Fetch events from API
    useEffect(() => {
        async function fetchEvents() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/events`);

                if (res.ok) {
                    const data = await res.json();
                    // Map API events to expected format
                    const apiEvents = (data.data?.events || []).map(event => ({
                        ...event,
                        title: event.title,
                        eventType: event.eventType || 'COMPETITION',
                        category: event.eventType || 'COMPETITION',
                        prizes: event.prizePool ? `₹${event.prizePool.toLocaleString('en-IN')}` : null,
                        teamType: event.teamType || 'SOLO',
                        maxSeats: event.maxSeats,
                        registeredCount: event._count?.registrations || 0,
                    }));
                    setEvents(apiEvents);
                } else {
                    // Fallback to mock data if API fails
                    console.warn('API fetch failed, using mock data');
                    const fallbackEvents = mockEvents.map(event => ({
                        ...event,
                        title: event.name,
                        eventType: event.category?.toUpperCase() || 'COMPETITION',
                        category: event.category?.toUpperCase() || 'COMPETITION',
                        prizes: event.prizePool > 0 ? `₹${event.prizePool.toLocaleString('en-IN')}` : null,
                        teamType: event.type?.toUpperCase() || 'SOLO',
                        maxSeats: event.maxParticipants,
                        registeredCount: event.currentCount || 0
                    }));
                    setEvents(fallbackEvents);
                }
            } catch (err) {
                console.error('Failed to fetch events:', err);
                // Fallback to mock data on error
                const fallbackEvents = mockEvents.map(event => ({
                    ...event,
                    title: event.name,
                    eventType: event.category?.toUpperCase() || 'COMPETITION',
                    category: event.category?.toUpperCase() || 'COMPETITION',
                    prizes: event.prizePool > 0 ? `₹${event.prizePool.toLocaleString('en-IN')}` : null,
                    teamType: event.type?.toUpperCase() || 'SOLO',
                    maxSeats: event.maxParticipants,
                    registeredCount: event.currentCount || 0
                }));
                setEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    // Filter events by category and search
    const filteredEvents = useMemo(() => {
        let filtered = events;

        // Filter by category
        if (activeCategory !== 'all') {
            filtered = filtered.filter(e =>
                e.eventType?.toUpperCase() === activeCategory.toUpperCase() ||
                e.category?.toUpperCase() === activeCategory.toUpperCase()
            );
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(event =>
                event.title?.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [events, activeCategory, searchQuery]);

    // Get counts per category
    const categoryCounts = useMemo(() => ({
        all: events.length,
        COMPETITION: events.filter(e => e.eventType?.toUpperCase() === 'COMPETITION' || e.category?.toUpperCase() === 'COMPETITION').length,
        WORKSHOP: events.filter(e => e.eventType?.toUpperCase() === 'WORKSHOP' || e.category?.toUpperCase() === 'WORKSHOP').length,
        TALK: events.filter(e => e.eventType?.toUpperCase() === 'TALK' || e.category?.toUpperCase() === 'TALK').length
    }), [events]);

    return (
        <div className="events-page">
            {/* Hero Section */}
            <section className="events-hero">
                <div className="events-hero__bg">
                    <div className="events-hero__grid" />
                    <div className="events-hero__glow" />
                </div>

                <div className="container">
                    <motion.div
                        className="events-hero__content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="events-hero__badge">AETHER SYMPOSIUM 2026</span>
                        <h1 className="events-hero__title">
                            Explore <span className="text-gradient">Events</span>
                        </h1>
                        <p className="events-hero__subtitle">
                            Competitions, workshops, and talks on AI & Data Science for Sustainability
                        </p>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        className="events-search"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Search size={20} className="events-search__icon" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="events-search__input"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="events-categories">
                <div className="container">
                    <motion.div
                        className="category-tabs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.icon && <cat.icon size={18} />}
                                <span>{cat.label}</span>
                                <span className="category-count">{categoryCounts[cat.id]}</span>
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="events-section">
                <div className="container">
                    {/* Section Header */}
                    <div className="events-section__header">
                        <div>
                            <h2 className="events-section__title">
                                <span className="text-gradient">
                                    {CATEGORIES.find(c => c.id === activeCategory)?.label || 'All Events'}
                                </span>
                            </h2>
                            <p className="events-section__count">
                                {filteredEvents.length} events available
                            </p>
                        </div>
                        <Link to="/symposium" className="events-section__link">
                            View Symposium
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="events-grid">
                            <EventCardSkeletonGrid count={4} />
                        </div>
                    )}

                    {/* Events Grid */}
                    {!loading && (
                        <>
                            {filteredEvents.length === 0 ? (
                                <div className="events-empty">
                                    <p>
                                        {searchQuery
                                            ? `No events found matching "${searchQuery}"`
                                            : 'No events available in this category'}
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    className="events-grid"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: {
                                            transition: { staggerChildren: 0.1 }
                                        }
                                    }}
                                >
                                    {filteredEvents.map((event, index) => (
                                        <EventCard key={event.id} event={event} index={index} />
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
