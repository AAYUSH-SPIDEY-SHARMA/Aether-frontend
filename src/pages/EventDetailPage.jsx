import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    Trophy,
    Loader2,
    AlertCircle,
    Phone,
    CheckCircle,
    Target,
    Award,
    Zap,
    FileText,
    UserCheck
} from 'lucide-react';
import Badge from '../components/common/Badge';
import './EventDetailPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fallback to mock data if API doesn't have detailed fields
import { getEventBySlug } from '../mock/events';

export default function EventDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch event from API with fallback to mock data
    useEffect(() => {
        async function fetchEvent() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/events/${slug}`);

                if (!res.ok) {
                    // Fallback to mock data
                    const mockEvent = getEventBySlug(slug);
                    if (mockEvent) {
                        setEvent(mockEvent);
                        return;
                    }
                    throw new Error('Event not found');
                }

                const data = await res.json();
                const apiEvent = data.data.event;

                // Merge with mock data for detailed fields if not present in API
                const mockEvent = getEventBySlug(slug);
                if (mockEvent) {
                    setEvent({
                        ...mockEvent,
                        ...apiEvent,
                        // Use mock data for detailed fields if API doesn't have them
                        rounds: apiEvent.rounds || mockEvent.rounds,
                        rules: apiEvent.rules || mockEvent.rules,
                        eligibility: apiEvent.eligibility || mockEvent.eligibility,
                        evaluationCriteria: apiEvent.evaluationCriteria || mockEvent.evaluationCriteria,
                        prizes: apiEvent.prizeDetails || mockEvent.prizes,
                        coordinators: apiEvent.coordinators || mockEvent.coordinators,
                        schedule: apiEvent.eventSchedule || mockEvent.schedule,
                        prizePool: apiEvent.prizePool || mockEvent.prizePool,
                        tagline: apiEvent.tagline || mockEvent.tagline,
                    });
                } else {
                    setEvent(apiEvent);
                }
            } catch (err) {
                // Final fallback to pure mock data
                const mockEvent = getEventBySlug(slug);
                if (mockEvent) {
                    setEvent(mockEvent);
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchEvent();
        }
    }, [slug]);

    const handleRegister = () => {
        navigate(`/register/${event.slug || event.id}`);
    };

    if (loading) {
        return (
            <div className="event-detail-page">
                <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <Loader2 className="spinner" size={48} />
                    <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading event...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="event-not-found">
                <AlertCircle size={48} />
                <h2>Event not found</h2>
                <p>{error || 'The event you are looking for does not exist.'}</p>
                <Link to="/events" className="btn btn-primary">Back to Events</Link>
            </div>
        );
    }

    // Normalize data from both API and mock formats
    const teamTypeLabel = event.teamType === 'TEAM' || event.type === 'team'
        ? `Team (${event.minTeamSize || event.teamSizeMin}-${event.maxTeamSize || event.teamSizeMax})`
        : 'Solo';
    const isTeamEvent = event.teamType === 'TEAM' || event.type === 'team';
    const registeredCount = event.registeredCount || event._count?.registrations || event.currentCount || 0;
    const maxSeats = event.maxSeats || event.maxParticipants;
    const spotsRemaining = maxSeats ? maxSeats - registeredCount : null;
    const eventTitle = event.title || event.name;
    const eventTagline = event.tagline || event.description;
    const prizePoolAmount = event.prizePool || 0;

    // Parse schedule
    const schedule = event.schedule || event.eventSchedule || {};
    const scheduleDate = schedule.date ? new Date(schedule.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : null;

    return (
        <div className="event-detail-page">
            {/* Back Button */}
            <div className="container">
                <Link to="/events" className="back-link">
                    <ArrowLeft size={18} />
                    Back to Events
                </Link>
            </div>

            {/* Event Header */}
            <section className="event-header">
                <div className="container">
                    <motion.div
                        className="event-header-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="event-badges">
                            <Badge variant="cyan" size="lg">
                                {event.eventType || event.category || 'Competition'}
                            </Badge>
                            <Badge variant={isTeamEvent ? 'purple' : 'cyan'} size="lg">
                                {teamTypeLabel}
                            </Badge>
                        </div>

                        <h1 className="event-name heading-display heading-1">{eventTitle}</h1>
                        <p className="event-tagline">{eventTagline}</p>

                        <div className="event-quick-info">
                            {(event.venue || schedule.venue) && (
                                <div className="info-item">
                                    <MapPin size={18} />
                                    <span>{event.venue || schedule.venue}</span>
                                </div>
                            )}
                            {scheduleDate && (
                                <div className="info-item">
                                    <Calendar size={18} />
                                    <span>{scheduleDate}</span>
                                </div>
                            )}
                            {(schedule.startTime && schedule.endTime) && (
                                <div className="info-item">
                                    <Clock size={18} />
                                    <span>{schedule.startTime} - {schedule.endTime}</span>
                                </div>
                            )}
                        </div>

                        <div className="event-stats-header">
                            {prizePoolAmount > 0 && (
                                <div className="stat-box">
                                    <Trophy size={24} />
                                    <div>
                                        <span className="stat-value">₹{prizePoolAmount.toLocaleString()}</span>
                                        <span className="stat-label">Prize Pool</span>
                                    </div>
                                </div>
                            )}
                            <div className="stat-box">
                                <Users size={24} />
                                <div>
                                    <span className="stat-value">
                                        {registeredCount}{maxSeats ? `/${maxSeats}` : ''}
                                    </span>
                                    <span className="stat-label">Registered</span>
                                </div>
                            </div>
                            <div className="stat-box fee-box">
                                <div>
                                    <span className="stat-value">
                                        {event.fee === 0 ? 'Free' : `₹${event.fee}`}
                                    </span>
                                    <span className="stat-label">Entry Fee</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Event Content */}
            <section className="event-content section">
                <div className="container">
                    <div className="content-grid">
                        <div className="main-content">
                            {/* About */}
                            <motion.div
                                className="content-block"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2><FileText size={24} /> About the Event</h2>
                                <p>{event.longDescription || event.description}</p>
                            </motion.div>

                            {/* Rounds/Timeline */}
                            {event.rounds && event.rounds.length > 0 && (
                                <motion.div
                                    className="content-block rounds-section"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h2><Zap size={24} /> Event Rounds</h2>
                                    <div className="rounds-timeline">
                                        {event.rounds.map((round, index) => (
                                            <div key={index} className="round-item">
                                                <div className="round-marker">
                                                    <span className="round-number">{index + 1}</span>
                                                </div>
                                                <div className="round-content">
                                                    <h4>{round.name}</h4>
                                                    <p>{round.description}</p>
                                                    {round.duration && (
                                                        <span className="round-duration">
                                                            <Clock size={14} /> {round.duration}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Rules */}
                            {event.rules && (
                                <motion.div
                                    className="content-block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h2><CheckCircle size={24} /> Rules & Guidelines</h2>
                                    {Array.isArray(event.rules) ? (
                                        <ul className="rules-list">
                                            {event.rules.map((rule, index) => (
                                                <li key={index}>
                                                    <CheckCircle size={16} />
                                                    <span>{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{ whiteSpace: 'pre-line' }}>{event.rules}</p>
                                    )}
                                </motion.div>
                            )}

                            {/* Eligibility */}
                            {event.eligibility && event.eligibility.length > 0 && (
                                <motion.div
                                    className="content-block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h2><UserCheck size={24} /> Eligibility</h2>
                                    <ul className="eligibility-list">
                                        {event.eligibility.map((item, index) => (
                                            <li key={index}>
                                                <UserCheck size={16} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Evaluation Criteria */}
                            {event.evaluationCriteria && event.evaluationCriteria.length > 0 && (
                                <motion.div
                                    className="content-block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <h2><Target size={24} /> Evaluation Criteria</h2>
                                    <div className="criteria-grid">
                                        {event.evaluationCriteria.map((item, index) => (
                                            <div key={index} className="criteria-item">
                                                <div className="criteria-header">
                                                    <span className="criteria-name">{item.criteria}</span>
                                                    <span className="criteria-weight">{item.weight}%</span>
                                                </div>
                                                <div className="criteria-bar">
                                                    <div
                                                        className="criteria-fill"
                                                        style={{ width: `${item.weight}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Prizes */}
                            {event.prizes && Array.isArray(event.prizes) && event.prizes.length > 0 && (
                                <motion.div
                                    className="content-block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <h2><Award size={24} /> Prizes</h2>
                                    <div className="prizes-grid">
                                        {event.prizes.map((prize, index) => (
                                            <div key={index} className={`prize-card prize-card--${index + 1}`}>
                                                <div className="prize-position">{prize.position}</div>
                                                <div className="prize-amount">₹{prize.amount?.toLocaleString()}</div>
                                                {prize.extras && (
                                                    <div className="prize-extras">{prize.extras}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Coordinators */}
                            {event.coordinators && event.coordinators.length > 0 && (
                                <motion.div
                                    className="content-block"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <h2><Phone size={24} /> Event Coordinators</h2>
                                    <div className="coordinators-grid">
                                        {event.coordinators.map((coord, index) => (
                                            <div key={index} className="coordinator-card">
                                                <div className="coordinator-avatar">
                                                    {coord.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="coordinator-info">
                                                    <h4>{coord.name}</h4>
                                                    <a href={`tel:${coord.phone}`} className="coordinator-phone">
                                                        <Phone size={14} />
                                                        {coord.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="event-sidebar">
                            <div className="sidebar-card">
                                <h3>Ready to compete?</h3>
                                <p>Secure your place now!</p>
                                <button
                                    onClick={handleRegister}
                                    className="btn btn-primary btn-lg w-full"
                                    disabled={spotsRemaining !== null && spotsRemaining <= 0}
                                >
                                    {spotsRemaining !== null && spotsRemaining <= 0
                                        ? 'Fully Booked'
                                        : 'Register Now'}
                                </button>
                                {spotsRemaining !== null && spotsRemaining > 0 && (
                                    <p className="spots-left">
                                        {spotsRemaining} spots remaining
                                    </p>
                                )}
                            </div>

                            {/* Quick Info Card */}
                            {schedule.date && (
                                <div className="sidebar-card sidebar-schedule">
                                    <h4>Event Schedule</h4>
                                    <div className="schedule-item">
                                        <Calendar size={18} />
                                        <span>{scheduleDate}</span>
                                    </div>
                                    {schedule.startTime && (
                                        <div className="schedule-item">
                                            <Clock size={18} />
                                            <span>{schedule.startTime} - {schedule.endTime}</span>
                                        </div>
                                    )}
                                    {schedule.venue && (
                                        <div className="schedule-item">
                                            <MapPin size={18} />
                                            <span>{schedule.venue}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </section>

            {/* Sticky Mobile Register Button */}
            <div className="mobile-register-bar">
                <div className="mobile-register-info">
                    <span className="mobile-fee">
                        {event.fee === 0 ? 'Free' : `₹${event.fee}`}
                    </span>
                    {spotsRemaining !== null && (
                        <span className="mobile-spots">
                            {spotsRemaining} spots left
                        </span>
                    )}
                </div>
                <button
                    onClick={handleRegister}
                    className="btn btn-primary"
                    disabled={spotsRemaining !== null && spotsRemaining <= 0}
                >
                    Register
                </button>
            </div>
        </div>
    );
}
