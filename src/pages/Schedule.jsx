import { useState } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { schedule } from '../mock/schedule';
import './Schedule.css';

const typeColors = {
    event: 'cyan',
    talk: 'purple',
    workshop: 'purple',
    ceremony: 'success',
    break: 'warning',
    cultural: 'purple',
    general: 'default'
};

export default function Schedule() {
    const [activeDay, setActiveDay] = useState('day1');

    const currentSchedule = schedule[activeDay];

    return (
        <div className="schedule-page">
            {/* Hero */}
            <section className="schedule-hero">
                <div className="container">
                    <h1 className="page-title heading-display heading-1">
                        Event <span className="text-gradient">Schedule</span>
                    </h1>
                    <p className="page-subtitle">
                        Two days packed with events, workshops, talks, and more.
                    </p>
                </div>
            </section>

            {/* Day Tabs */}
            <section className="day-tabs">
                <div className="container">
                    <div className="day-tabs-nav">
                        <button
                            className={`day-tab ${activeDay === 'day1' ? 'active' : ''}`}
                            onClick={() => setActiveDay('day1')}
                        >
                            <Calendar size={18} />
                            <div className="day-tab-content">
                                <span className="day-label">Day 1</span>
                                <span className="day-date">Feb 15, 2026</span>
                            </div>
                        </button>
                        <button
                            className={`day-tab ${activeDay === 'day2' ? 'active' : ''}`}
                            onClick={() => setActiveDay('day2')}
                        >
                            <Calendar size={18} />
                            <div className="day-tab-content">
                                <span className="day-label">Day 2</span>
                                <span className="day-date">Feb 16, 2026</span>
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Schedule Timeline */}
            <section className="schedule-timeline section">
                <div className="container">
                    <h2 className="day-title">{currentSchedule.title}</h2>

                    <div className="timeline-list">
                        {currentSchedule.events.map((event, index) => (
                            <div
                                key={index}
                                className="timeline-item"
                                data-type={typeColors[event.type] || 'default'}
                            >
                                <div className="timeline-time">
                                    <Clock size={14} />
                                    {event.time}
                                </div>
                                <div className="timeline-content">
                                    <h4 className="timeline-title">{event.title}</h4>
                                    {event.speaker && (
                                        <p className="timeline-speaker">by {event.speaker}</p>
                                    )}
                                    <div className="timeline-meta">
                                        <span className="timeline-venue">
                                            <MapPin size={12} />
                                            {event.venue}
                                        </span>
                                        <span className={`timeline-type type-${typeColors[event.type]}`}>
                                            {event.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
