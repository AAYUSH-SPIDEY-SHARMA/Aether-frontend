// Wings of AETHER Mock Data

export const wings = {
    wnc: {
        id: 'wnc',
        name: 'Web & Coding Wing',
        shortName: 'WnC Wing',
        tagline: 'Building the digital future, one line at a time',
        description: 'The Web & Coding Wing focuses on competitive programming, web development, AI/ML, and open-source contributions. We train students to excel in hackathons and coding competitions.',
        mission: 'Empowering students with cutting-edge programming skills and fostering a culture of innovation through hands-on projects and competitions.',
        focus: [
            'Competitive Programming',
            'Web Development',
            'AI & ML',
            'Hackathons',
            'Open Source',
            'App Development'
        ],
        coordinators: [
            {
                id: 1,
                name: 'Aayush Sharma',
                role: 'Wing Coordinator',
                program: 'M.Sc. AI/ML (2024)',
                image: '/images/wings/Aayush-WnC.jpg',
                linkedin: 'https://www.linkedin.com/in/aayush-sharma-661179330/',
                github: 'https://github.com/'
            },
            {
                id: 2,
                name: 'Jatin',
                role: 'Wing Coordinator',
                program: 'M.Sc. AI/ML (2024)',
                image: '/images/team/Jatin.jpg',
                linkedin: 'https://www.linkedin.com/in/jatingyass/',
                github: 'https://github.com/'
            }
        ],
        activities: [
            {
                title: 'Weekly Coding Sessions',
                description: 'Practice competitive programming problems together'
            },
            {
                title: 'Hackathon Participation',
                description: 'Represent IIITL in national and international hackathons'
            },
            {
                title: 'Web Dev Workshops',
                description: 'Hands-on sessions on React, Node.js, and modern frameworks'
            },
            {
                title: 'Open Source Contributions',
                description: 'Contribute to real-world open source projects'
            }
        ],
        gallery: [
            { id: 1, title: 'Hackathon 2025', year: '2025' },
            { id: 2, title: 'Coding Bootcamp', year: '2024' },
            { id: 3, title: 'Web Dev Workshop', year: '2024' },
            { id: 4, title: 'CP Contest', year: '2024' },
            { id: 5, title: 'Team Building', year: '2024' },
            { id: 6, title: 'Project Demo', year: '2024' }
        ],
        color: 'cyan'
    },
    climate: {
        id: 'climate',
        name: 'Climate Tech Wing',
        shortName: 'Climate Tech',
        tagline: 'Technology for a sustainable tomorrow',
        description: 'The Climate Tech Wing leverages AI/ML and data science for environmental sustainability. We collaborate with the Climate Research Office (CRO) on cutting-edge research.',
        mission: 'Applying technology to address climate challenges and building solutions for a sustainable future through research and innovation.',
        focus: [
            'AI for Sustainability',
            'Climate Research',
            'Environmental Data Science',
            'CRO Collaboration',
            'Green Tech Solutions',
            'Carbon Footprint Analysis'
        ],
        coordinators: [
            {
                id: 1,
                name: 'Sahil Rafaliya',
                role: 'Wing Coordinator',
                program: 'M.Sc. DS (CDA) (2024)',
                image: null,
                linkedin: 'https://linkedin.com/in/',
                github: 'https://github.com/'
            }
        ],
        activities: [
            {
                title: 'Climate Data Analysis',
                description: 'Analyze environmental datasets for insights'
            },
            {
                title: 'CRO Research Projects',
                description: 'Collaborate with Climate Research Office on real projects'
            },
            {
                title: 'Sustainability Workshops',
                description: 'Learn about green technology and sustainable practices'
            },
            {
                title: 'AI/ML for Environment',
                description: 'Apply machine learning to environmental problems'
            }
        ],
        gallery: [
            { id: 1, title: 'CRO Collaboration', year: '2025' },
            { id: 2, title: 'Climate Hackathon', year: '2024' },
            { id: 3, title: 'Research Presentation', year: '2024' },
            { id: 4, title: 'Green Tech Workshop', year: '2024' },
            { id: 5, title: 'Data Analysis Session', year: '2024' },
            { id: 6, title: 'Team Meeting', year: '2024' }
        ],
        color: 'green'
    }
};

export const getWing = (id) => wings[id];
export const getAllWings = () => Object.values(wings);
