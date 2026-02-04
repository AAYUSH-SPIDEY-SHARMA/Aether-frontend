// SchedulePreview - Conference Schedule Table Layout
// Aether Symposium 2026 - AI & Data Science for Sustainability
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { schedule, getEventsByTimeSlot, tracks } from '../../mock/schedule';
import './SchedulePreview.css';

export default function SchedulePreview() {
    const timeSlots = getEventsByTimeSlot(schedule.day1.events);

    const renderCell = (event, track) => {
        if (!event) {
            return <span className="schedule-empty">—</span>;
        }

        const trackInfo = tracks[track] || tracks.common;

        return (
            <div className={`schedule-event schedule-event--${trackInfo.color}`}>
                <h4 className="schedule-event-title">{event.title}</h4>
                {event.speaker && (
                    <p className="schedule-event-speaker">{event.speaker}</p>
                )}
                <span className="schedule-event-venue">
                    <MapPin size={10} />
                    {event.venue}
                </span>
            </div>
        );
    };

    const isCommonSession = (slot) => {
        return slot.common && !slot.research && !slot.industry && !slot.workshop;
    };

    return (
        <section className="schedule-preview section">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-label">Event Schedule</span>
                    <h2 className="section-title heading-display heading-2">
                        Conference <span className="text-gradient">Schedule</span>
                    </h2>
                    <p className="section-description">
                        Tentative Conference Schedule — Aether Symposium 2026
                        <br />
                        <span className="schedule-theme">Theme: AI & Data Science for Sustainability</span>
                    </p>
                </motion.div>

                {/* Schedule Table */}
                <motion.div
                    className="schedule-table-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="schedule-table">
                        {/* Table Header */}
                        <div className="schedule-header">
                            <div className="schedule-header-cell schedule-time-header">
                                <Clock size={14} />
                                Time
                            </div>
                            <div className="schedule-header-cell schedule-track-header schedule-track--research">
                                <span className="track-icon">{tracks.research.icon}</span>
                                {tracks.research.name}
                            </div>
                            <div className="schedule-header-cell schedule-track-header schedule-track--industry">
                                <span className="track-icon">{tracks.industry.icon}</span>
                                {tracks.industry.name}
                            </div>
                            <div className="schedule-header-cell schedule-track-header schedule-track--workshop">
                                <span className="track-icon">{tracks.workshop.icon}</span>
                                {tracks.workshop.name}
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="schedule-body">
                            {timeSlots.map((slot, index) => (
                                <motion.div
                                    key={index}
                                    className={`schedule-row ${isCommonSession(slot) ? 'schedule-row--common' : ''}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.03 }}
                                >
                                    <div className="schedule-cell schedule-time-cell">
                                        <span className="time-range">
                                            {slot.time}–{slot.endTime}
                                        </span>
                                    </div>

                                    {isCommonSession(slot) ? (
                                        <div className="schedule-cell schedule-common-cell" style={{ gridColumn: '2 / -1' }}>
                                            {renderCell(slot.common, 'common')}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="schedule-cell schedule-track-cell">
                                                {renderCell(slot.research, 'research')}
                                            </div>
                                            <div className="schedule-cell schedule-track-cell">
                                                {renderCell(slot.industry, 'industry')}
                                            </div>
                                            <div className="schedule-cell schedule-track-cell">
                                                {renderCell(slot.workshop, 'workshop')}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Legend */}
                <motion.div
                    className="schedule-legend"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <div className="legend-item legend-item--research">
                        <span className="legend-dot"></span>
                        Research & Academic
                    </div>
                    <div className="legend-item legend-item--industry">
                        <span className="legend-dot"></span>
                        Industry & Climate-Tech
                    </div>
                    <div className="legend-item legend-item--workshop">
                        <span className="legend-dot"></span>
                        Workshops & Competitions
                    </div>
                    <div className="legend-item legend-item--common">
                        <span className="legend-dot"></span>
                        Common Sessions
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
