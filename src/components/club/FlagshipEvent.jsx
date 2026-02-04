import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import useCountdown from '../../hooks/useCountdown';
import './FlagshipEvent.css';

export default function FlagshipEvent() {
    const { days, hours, minutes, seconds, isExpired } = useCountdown('2026-02-07T09:00:00');

    return (
        <section className="flagship-event section">
            <div className="container">
                <div className="flagship-content">
                    <div className="flagship-info">
                        <span className="flagship-badge">
                            <Sparkles size={14} />
                            Flagship Event
                        </span>
                        <h2 className="flagship-title heading-display heading-2">
                            AETHER Symposium <span className="text-gradient">2026</span>
                        </h2>
                        <p className="flagship-desc">
                            Our annual technical fest featuring competitions, workshops,
                            and speaker sessions with prizes worth ₹2L+.
                        </p>

                        <div className="flagship-meta">
                            <div className="meta-item">
                                <Calendar size={18} />
                                <span>February 15-16, 2026</span>
                            </div>
                            <div className="meta-item">
                                <MapPin size={18} />
                                <span>IIIT Lucknow Campus</span>
                            </div>
                        </div>

                        <div className="flagship-actions">
                            <Link to="/symposium" className="btn btn-primary btn-lg">
                                Explore Symposium
                                <ArrowRight size={18} />
                            </Link>
                            <Link to="/events" className="btn btn-secondary btn-lg">
                                Register Now
                            </Link>
                        </div>
                    </div>

                    <div className="flagship-countdown">
                        <h4 className="countdown-label">Symposium Starts In</h4>
                        {!isExpired ? (
                            <div className="countdown-grid">
                                <div className="countdown-item">
                                    <span className="countdown-value">{days}</span>
                                    <span className="countdown-unit">Days</span>
                                </div>
                                <div className="countdown-item">
                                    <span className="countdown-value">{hours}</span>
                                    <span className="countdown-unit">Hours</span>
                                </div>
                                <div className="countdown-item">
                                    <span className="countdown-value">{minutes}</span>
                                    <span className="countdown-unit">Mins</span>
                                </div>
                                <div className="countdown-item">
                                    <span className="countdown-value">{seconds}</span>
                                    <span className="countdown-unit">Secs</span>
                                </div>
                            </div>
                        ) : (
                            <div className="countdown-expired">
                                <span>Event is Live! 🎉</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
