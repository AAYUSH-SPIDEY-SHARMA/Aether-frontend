// Mock data for AETHER Symposium 2026 Events
// Theme: AI & Data Science for Sustainability
// Categories: competition, workshop, talk

export const events = [
    // ============ COMPETITIONS ============
    {
        id: 1,
        name: 'A&M Coding Challenge',
        slug: 'am-coding-challenge',
        tagline: 'Speed. Precision. Victory.',
        description: 'Algorithm & Mastery Coding Challenge - A fast-paced coding competition where participants solve algorithmic challenges under intense time pressure. Test your coding speed and problem-solving skills in this thrilling competition.',
        category: 'competition',
        type: 'solo',
        event_type: 'symposium',
        fee: 100,
        prizePool: 15000,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 100,
        currentCount: 0,
        image: '/events/am-coding-challenge.jpg',
        featured: true,
        registrationOpen: true,
        rounds: [
            { name: 'Preliminary Round', description: 'Solve 5 problems in 45 minutes', duration: '45 mins' },
            { name: 'Final Round', description: 'Top coders compete for the title', duration: '60 mins' }
        ],
        rules: [
            'Individual participation only',
            'Languages allowed: C, C++, Python, Java',
            'No external resources or IDE extensions',
            'Plagiarism leads to immediate disqualification'
        ],
        eligibility: [
            'Open to all college students',
            'Must carry valid college ID',
            'Basic programming knowledge required'
        ],
        evaluationCriteria: [
            { criteria: 'Correctness', weight: 60 },
            { criteria: 'Time Taken', weight: 30 },
            { criteria: 'Code Efficiency', weight: 10 }
        ],
        prizes: [
            { position: '1st', amount: 8000, extras: 'Certificate + Trophy' },
            { position: '2nd', amount: 5000, extras: 'Certificate' },
            { position: '3rd', amount: 2000, extras: 'Certificate' }
        ],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '14:30',
            endTime: '17:45',
            venue: 'Computer Lab'
        }
    },
    {
        id: 2,
        name: 'Student Showcase: AI for Sustainability',
        slug: 'student-showcase-ai',
        tagline: 'Innovate for a Greener Future',
        description: 'Present your AI-powered solutions addressing sustainability challenges. Showcase innovative projects that leverage artificial intelligence to create positive environmental impact.',
        category: 'competition',
        type: 'team',
        event_type: 'symposium',
        fee: 200,
        prizePool: 25000,
        teamSizeMin: 2,
        teamSizeMax: 4,
        maxParticipants: 30,
        currentCount: 0,
        image: '/events/showcase-ai.jpg',
        featured: true,
        registrationOpen: true,
        rounds: [
            { name: 'Abstract Submission', description: 'Submit project abstract and proposal', duration: 'Pre-event' },
            { name: 'Project Development', description: 'Build your AI solution', duration: '2 weeks' },
            { name: 'Live Presentation', description: 'Present to judges panel', duration: '15 mins per team' }
        ],
        rules: [
            'Team of 2-4 members',
            'Project must address sustainability using AI',
            'Working prototype required',
            'Original work only - no plagiarism'
        ],
        eligibility: [
            'Open to all undergraduate and postgraduate students',
            'Cross-college teams allowed',
            'Prior submission of abstract required'
        ],
        evaluationCriteria: [
            { criteria: 'Innovation', weight: 30 },
            { criteria: 'Technical Implementation', weight: 30 },
            { criteria: 'Sustainability Impact', weight: 25 },
            { criteria: 'Presentation', weight: 15 }
        ],
        prizes: [
            { position: '1st', amount: 15000, extras: 'Incubation Opportunity' },
            { position: '2nd', amount: 7000, extras: 'Certificate + Goodies' },
            { position: '3rd', amount: 3000, extras: 'Certificate' }
        ],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '15:45',
            endTime: '17:00',
            venue: 'Seminar Hall A'
        }
    },
    {
        id: 3,
        name: 'Student Showcase: Data-Driven Sustainability Solutions',
        slug: 'student-showcase-data',
        tagline: 'Data for a Better Tomorrow',
        description: 'Present data-driven solutions that tackle real-world sustainability problems. Use data science, analytics, and visualization to create impactful solutions for environmental challenges.',
        category: 'competition',
        type: 'team',
        event_type: 'symposium',
        fee: 200,
        prizePool: 25000,
        teamSizeMin: 2,
        teamSizeMax: 4,
        maxParticipants: 30,
        currentCount: 0,
        image: '/events/showcase-data.jpg',
        featured: true,
        registrationOpen: true,
        rounds: [
            { name: 'Abstract Submission', description: 'Submit project abstract and data sources', duration: 'Pre-event' },
            { name: 'Analysis Phase', description: 'Develop your data-driven solution', duration: '2 weeks' },
            { name: 'Live Presentation', description: 'Present insights to judges', duration: '15 mins per team' }
        ],
        rules: [
            'Team of 2-4 members',
            'Must use real or publicly available datasets',
            'Clear visualization of insights required',
            'Original analysis only'
        ],
        eligibility: [
            'Open to all undergraduate and postgraduate students',
            'Cross-college teams allowed',
            'Prior submission of abstract required'
        ],
        evaluationCriteria: [
            { criteria: 'Data Analysis Quality', weight: 30 },
            { criteria: 'Sustainability Relevance', weight: 25 },
            { criteria: 'Visualization', weight: 25 },
            { criteria: 'Presentation', weight: 20 }
        ],
        prizes: [
            { position: '1st', amount: 15000, extras: 'Incubation Opportunity' },
            { position: '2nd', amount: 7000, extras: 'Certificate + Goodies' },
            { position: '3rd', amount: 3000, extras: 'Certificate' }
        ],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '15:45',
            endTime: '17:00',
            venue: 'Seminar Hall B'
        }
    },

    // ============ WORKSHOPS ============
    {
        id: 10,
        name: 'Hands-On Workshop: Linux (LFDT)',
        slug: 'linux-workshop',
        tagline: 'Master the Command Line',
        description: 'A comprehensive hands-on workshop covering Linux fundamentals, command-line operations, and essential tools for developers. Learn the skills that power modern software development.',
        category: 'workshop',
        type: 'solo',
        event_type: 'symposium',
        fee: 50,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 50,
        currentCount: 0,
        image: '/events/linux-workshop.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [
            { name: 'Introduction', description: 'Linux basics and file system', duration: '30 mins' },
            { name: 'Hands-On Practice', description: 'Command-line exercises', duration: '45 mins' }
        ],
        rules: [
            'Bring your own laptop',
            'Pre-install VirtualBox or WSL',
            'Basic computer knowledge required'
        ],
        eligibility: [
            'Open to all students',
            'No prior Linux experience needed'
        ],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '14:30',
            endTime: '15:45',
            venue: 'Computer Lab 2'
        }
    },

    // ============ TALKS & SESSIONS ============
    {
        id: 20,
        name: 'Talk: AI for Climate Modelling',
        slug: 'talk-ai-climate',
        tagline: 'Predicting Our Climate Future',
        description: 'Explore how artificial intelligence is revolutionizing climate modelling approaches. Learn about cutting-edge ML techniques used to predict climate patterns and inform policy decisions.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 200,
        currentCount: 0,
        image: '/events/talk-climate.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '10:05',
            endTime: '10:30',
            venue: 'Auditorium - Hall A'
        }
    },
    {
        id: 21,
        name: 'Talk: Machine Learning for Environmental Monitoring',
        slug: 'talk-ml-environment',
        tagline: 'Sensing Our Planet',
        description: 'Discover how machine learning is being applied to environmental monitoring systems. From satellite imagery analysis to IoT sensor networks, learn about real-world applications protecting our environment.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 200,
        currentCount: 0,
        image: '/events/talk-ml-env.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '10:35',
            endTime: '11:00',
            venue: 'Auditorium - Hall A'
        }
    },
    {
        id: 22,
        name: 'Talk: Sustainable Data Pipelines in Industry',
        slug: 'talk-data-pipelines',
        tagline: 'Green Data Engineering',
        description: 'Learn about building sustainable and energy-efficient data pipelines in modern industry. Explore best practices for reducing the carbon footprint of data infrastructure.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 200,
        currentCount: 0,
        image: '/events/talk-pipelines.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '10:05',
            endTime: '10:30',
            venue: 'Auditorium - Hall B'
        }
    },
    {
        id: 23,
        name: 'Talk: Low-Carbon AI & Green Compute Architectures',
        slug: 'talk-green-ai',
        tagline: 'Sustainable Computing',
        description: 'Explore innovative approaches to reducing the environmental impact of AI systems. Learn about green computing architectures and energy-efficient machine learning.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 200,
        currentCount: 0,
        image: '/events/talk-green-ai.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '10:35',
            endTime: '11:00',
            venue: 'Auditorium - Hall B'
        }
    },
    {
        id: 24,
        name: 'Case Study: Renewable Energy Forecasting',
        slug: 'case-study-energy',
        tagline: 'Powering the Future with Data',
        description: 'A detailed case study on using data science for renewable energy forecasting. Learn how predictive models help optimize solar and wind energy generation.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 200,
        currentCount: 0,
        image: '/events/case-energy.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '11:05',
            endTime: '11:30',
            venue: 'Auditorium - Hall A'
        }
    },
    {
        id: 25,
        name: 'Innovation Spotlight: Emerging Climate-Tech Startups',
        slug: 'innovation-spotlight',
        tagline: 'Startups Saving the Planet',
        description: 'Discover the most promising climate-tech startups and their innovative solutions. Learn about emerging technologies and business models addressing climate change.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 200,
        currentCount: 0,
        image: '/events/innovation.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '11:05',
            endTime: '11:30',
            venue: 'Auditorium - Hall B'
        }
    },
    {
        id: 26,
        name: 'Panel: Frontiers in Climate Informatics',
        slug: 'panel-climate-informatics',
        tagline: 'Leading Minds, Bold Ideas',
        description: 'A panel discussion featuring experts discussing the frontiers of climate informatics. Explore cutting-edge research and future directions in this critical field.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 200,
        currentCount: 0,
        image: '/events/panel-informatics.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '11:35',
            endTime: '12:10',
            venue: 'Auditorium - Hall A'
        }
    },
    {
        id: 27,
        name: 'Panel: AI for Sustainable Industrial Transformation',
        slug: 'panel-industrial',
        tagline: 'Transforming Industry Sustainably',
        description: 'Industry leaders discuss how AI is driving sustainable transformation across manufacturing, logistics, and supply chains. Learn about real-world implementations and success stories.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 200,
        currentCount: 0,
        image: '/events/panel-industrial.jpg',
        featured: false,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '11:35',
            endTime: '12:10',
            venue: 'Auditorium - Hall B'
        }
    },
    {
        id: 28,
        name: 'Keynote: AI, Climate, and the Next Decade',
        slug: 'keynote-ai-climate',
        tagline: 'The Future is Now',
        description: 'The prime time keynote address exploring the intersection of artificial intelligence and climate action. A visionary talk on how AI will shape our response to climate challenges in the coming decade.',
        category: 'talk',
        type: 'solo',
        event_type: 'symposium',
        fee: 0,
        prizePool: 0,
        teamSizeMin: 1,
        teamSizeMax: 1,
        maxParticipants: 500,
        currentCount: 0,
        image: '/events/keynote.jpg',
        featured: true,
        registrationOpen: true,
        rounds: [],
        rules: [],
        eligibility: ['Open to all registered participants'],
        evaluationCriteria: [],
        prizes: [],
        coordinators: [
            { name: 'Event Coordinator', phone: '+91 XXXXX XXXXX' }
        ],
        schedule: {
            date: '2026-02-15',
            startTime: '12:15',
            endTime: '13:15',
            venue: 'Main Auditorium'
        }
    }
];

// Helper functions
export const getFeaturedEvents = () => events.filter(e => e.featured);
export const getEventBySlug = (slug) => events.find(e => e.slug === slug);
export const getEventsByCategory = (category) =>
    category === 'all' ? events : events.filter(e => e.category === category);

// Category-based helpers
export const getCompetitions = () => events.filter(e => e.category === 'competition');
export const getWorkshops = () => events.filter(e => e.category === 'workshop');
export const getTalks = () => events.filter(e => e.category === 'talk');

// Symposium helpers
export const getSymposiumEvents = () => events.filter(e => e.event_type === 'symposium');
export const getEventsByType = (eventType) => events.filter(e => e.event_type === eventType);
