// Aether Symposium 2026 - Tentative Conference Schedule
// Theme: AI & Data Science for Sustainability

export const schedule = {
    day1: {
        date: '2026-02-15',
        title: 'AI & Data Science for Sustainability',
        theme: 'AI & Data Science for Sustainability',
        events: [
            // 09:00–09:30 - Registration
            {
                time: '09:00',
                endTime: '09:30',
                title: 'Registration & Welcome Kit Distribution',
                venue: 'Main Gate',
                type: 'general',
                track: 'common'
            },
            // 09:30–10:00 - Opening Ceremony
            {
                time: '09:30',
                endTime: '10:00',
                title: 'Opening Ceremony: Welcome Address, Director\'s Remarks, Thematic Overview (AI for Sustainability)',
                venue: 'Main Auditorium',
                type: 'ceremony',
                track: 'common'
            },
            // 10:05–10:30 - Parallel Sessions
            {
                time: '10:05',
                endTime: '10:30',
                title: 'Talk: AI for Climate Modelling',
                venue: 'Seminar Hall A',
                type: 'talk',
                track: 'research'
            },
            {
                time: '10:05',
                endTime: '10:30',
                title: 'Talk: Sustainable Data Pipelines in Industry',
                venue: 'Seminar Hall B',
                type: 'talk',
                track: 'industry'
            },
            // 10:35–11:00 - Parallel Sessions
            {
                time: '10:35',
                endTime: '11:00',
                title: 'Talk: Machine Learning for Environmental Monitoring',
                venue: 'Seminar Hall A',
                type: 'talk',
                track: 'research'
            },
            {
                time: '10:35',
                endTime: '11:00',
                title: 'Talk: Low-Carbon AI & Green Compute Architectures',
                venue: 'Seminar Hall B',
                type: 'talk',
                track: 'industry'
            },
            // 11:05–11:30 - Parallel Sessions
            {
                time: '11:05',
                endTime: '11:30',
                title: 'Case Study: Renewable Energy Forecasting',
                venue: 'Seminar Hall A',
                type: 'talk',
                track: 'research'
            },
            {
                time: '11:05',
                endTime: '11:30',
                title: 'Innovation Spotlight: Emerging Climate-Tech Startups',
                venue: 'Seminar Hall B',
                type: 'talk',
                track: 'industry'
            },
            // 11:35–12:10 - Parallel Panel Sessions
            {
                time: '11:35',
                endTime: '12:10',
                title: 'Panel: Frontiers in Climate Informatics',
                venue: 'Seminar Hall A',
                type: 'talk',
                track: 'research'
            },
            {
                time: '11:35',
                endTime: '12:10',
                title: 'Panel: AI for Sustainable Industrial Transformation',
                venue: 'Seminar Hall B',
                type: 'talk',
                track: 'industry'
            },
            // 12:15–13:15 - Prime Time Keynote
            {
                time: '12:15',
                endTime: '13:15',
                title: 'Prime Time Keynote Address: AI, Climate, and the Next Decade',
                venue: 'Main Auditorium',
                type: 'ceremony',
                track: 'common'
            },
            // 13:15–14:30 - Lunch Break
            {
                time: '13:15',
                endTime: '14:30',
                title: 'Lunch Break & Green Networking Mixer',
                venue: 'Food Court',
                type: 'break',
                track: 'common'
            },
            // 14:30–15:45 - Workshop
            {
                time: '14:30',
                endTime: '15:45',
                title: 'Hands-On Workshop: Linux (LFDT)',
                venue: 'Computer Lab 1',
                type: 'workshop',
                track: 'workshop'
            },
            // 15:45–17:00 - Parallel Sessions
            {
                time: '15:45',
                endTime: '17:00',
                title: 'Student Showcase: AI for Sustainability',
                venue: 'Seminar Hall A',
                type: 'event',
                track: 'research'
            },
            {
                time: '15:45',
                endTime: '17:00',
                title: 'Student Showcase: Data-Driven Sustainability Solutions',
                venue: 'Seminar Hall B',
                type: 'event',
                track: 'industry'
            },
            {
                time: '15:45',
                endTime: '17:00',
                title: 'A&M Coding Challenge',
                venue: 'Computer Lab 2',
                type: 'event',
                track: 'workshop'
            },
            // 17:00–17:45 - Parallel Sessions
            {
                time: '17:00',
                endTime: '17:45',
                title: 'Student Showcase Coding Competition',
                venue: 'Seminar Hall A',
                type: 'event',
                track: 'research'
            },
            {
                time: '17:00',
                endTime: '17:45',
                title: 'Coding Competition — Final Round',
                venue: 'Computer Lab 2',
                type: 'event',
                track: 'workshop'
            },
            // 17:45–18:30 - Closing Ceremony
            {
                time: '17:45',
                endTime: '18:30',
                title: 'Closing Ceremony & Awards Presentation',
                venue: 'Main Auditorium',
                type: 'ceremony',
                track: 'common'
            }
        ]
    }
};

// Track definitions for the 3-column layout
export const tracks = {
    research: {
        name: 'Research & Academic Sessions',
        color: 'cyan',
        icon: '🔬'
    },
    industry: {
        name: 'Industry & Climate-Tech Sessions',
        color: 'purple',
        icon: '🏭'
    },
    workshop: {
        name: 'Workshops & Competitions',
        color: 'magenta',
        icon: '⚙️'
    },
    common: {
        name: 'Common Sessions',
        color: 'success',
        icon: '🎯'
    }
};

// Helper to get events by time slot
export const getEventsByTimeSlot = (events) => {
    const timeSlots = {};
    events.forEach(event => {
        const key = `${event.time}-${event.endTime}`;
        if (!timeSlots[key]) {
            timeSlots[key] = {
                time: event.time,
                endTime: event.endTime,
                research: null,
                industry: null,
                workshop: null,
                common: null
            };
        }
        timeSlots[key][event.track] = event;
    });
    return Object.values(timeSlots).sort((a, b) => a.time.localeCompare(b.time));
};

export const getScheduleByDay = (day) => schedule[day];
export const getAllSchedule = () => schedule;
