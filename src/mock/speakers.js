export const speakers = [
    {
        id: 1,
        name: 'Dr. Rajesh Kumar',
        title: 'AI Research Lead',
        company: 'Google DeepMind',
        image: '/speakers/speaker1.jpg',
        bio: 'Leading researcher in artificial intelligence with 15+ years of experience. Published 50+ papers in top conferences.',
        social: {
            linkedin: 'https://linkedin.com/in/rajeshkumar',
            twitter: 'https://twitter.com/rajeshkumar'
        },
        topics: ['Artificial Intelligence', 'Machine Learning', 'Neural Networks'],
        featured: true
    },
    {
        id: 2,
        name: 'Priya Sundaram',
        title: 'Engineering Director',
        company: 'Microsoft',
        image: '/speakers/speaker2.jpg',
        bio: 'Leads Azure cloud infrastructure team. Champion of diversity in tech with 12+ years at Microsoft.',
        social: {
            linkedin: 'https://linkedin.com/in/priyasundaram'
        },
        topics: ['Cloud Computing', 'Distributed Systems', 'Tech Leadership'],
        featured: true
    },
    {
        id: 3,
        name: 'Arjun Mehta',
        title: 'Founder & CEO',
        company: 'TechStartup.io',
        image: '/speakers/speaker3.jpg',
        bio: 'Serial entrepreneur with 3 successful exits. Y Combinator alum and angel investor.',
        social: {
            linkedin: 'https://linkedin.com/in/arjunmehta',
            twitter: 'https://twitter.com/arjunmehta'
        },
        topics: ['Entrepreneurship', 'Startups', 'Product Development'],
        featured: true
    },
    {
        id: 4,
        name: 'Dr. Sneha Patel',
        title: 'Cybersecurity Expert',
        company: 'IBM Security',
        image: '/speakers/speaker4.jpg',
        bio: 'Expert in ethical hacking and network security. Has helped protect Fortune 500 companies from cyber threats.',
        social: {
            linkedin: 'https://linkedin.com/in/snehapatel'
        },
        topics: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
        featured: true
    },
    {
        id: 5,
        name: 'Vikram Rao',
        title: 'Senior Blockchain Developer',
        company: 'Polygon',
        image: '/speakers/speaker5.jpg',
        bio: 'Core contributor to Polygon network. Passionate about Web3 and decentralization.',
        social: {
            linkedin: 'https://linkedin.com/in/vikramrao',
            twitter: 'https://twitter.com/vikramrao'
        },
        topics: ['Blockchain', 'Web3', 'Smart Contracts'],
        featured: false
    },
    {
        id: 6,
        name: 'Ananya Krishnan',
        title: 'UX Design Lead',
        company: 'Figma',
        image: '/speakers/speaker6.jpg',
        bio: 'Award-winning designer who has shaped products used by millions. Speaker at major design conferences.',
        social: {
            linkedin: 'https://linkedin.com/in/ananyakrishnan'
        },
        topics: ['UX Design', 'Product Design', 'Design Systems'],
        featured: false
    }
];

export const getFeaturedSpeakers = () => speakers.filter(s => s.featured);
