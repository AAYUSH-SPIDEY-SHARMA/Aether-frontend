export const faqs = [
    {
        id: 1,
        category: 'General',
        question: 'What is AETHER Symposium?',
        answer: 'AETHER is an annual technical symposium featuring competitions, workshops, hackathons, and talks from industry leaders. It brings together students from across the country to innovate, compete, and learn.'
    },
    {
        id: 2,
        category: 'General',
        question: 'When and where is the event?',
        answer: 'AETHER 2026 will be held on February 15-16, 2026 at XYZ Engineering College, City. All indoor events will be held in the main academic block, while outdoor events will be in the open arena.'
    },
    {
        id: 3,
        category: 'Registration',
        question: 'How do I register for events?',
        answer: 'Click on "Register Now" and select the events you wish to participate in. Fill out the registration form and complete the payment. You\'ll receive a confirmation email with your registration details.'
    },
    {
        id: 4,
        category: 'Registration',
        question: 'Can I register for multiple events?',
        answer: 'Yes! You can register for multiple events as long as their timings don\'t overlap. Check the schedule page to plan your participation accordingly.'
    },
    {
        id: 5,
        category: 'Registration',
        question: 'Is there a team registration process?',
        answer: 'For team events, one member registers as the team leader and adds team member details during registration. All team members will receive confirmation emails.'
    },
    {
        id: 6,
        category: 'Payment',
        question: 'What payment methods are accepted?',
        answer: 'We accept UPI (GPay, PhonePe, Paytm), debit/credit cards, and net banking through our secure Razorpay payment gateway.'
    },
    {
        id: 7,
        category: 'Payment',
        question: 'What is the refund policy?',
        answer: 'Refunds are available up to 7 days before the event with a 10% processing fee. No refunds within 7 days of the event. Contact us at refunds@aether.tech for queries.'
    },
    {
        id: 8,
        category: 'Payment',
        question: 'My payment failed but money was deducted. What do I do?',
        answer: 'Don\'t worry! If payment was deducted but registration failed, it will be auto-refunded within 5-7 business days. If not, contact us with your transaction ID at support@aether.tech.'
    },
    {
        id: 9,
        category: 'Events',
        question: 'Do I need to bring my own laptop?',
        answer: 'For hackathons and coding events, yes, you need your own laptop. For other events, necessary equipment will be provided. Check individual event pages for specific requirements.'
    },
    {
        id: 10,
        category: 'Events',
        question: 'What if I\'m from a different college?',
        answer: 'AETHER is open to students from all colleges! Carry your valid college ID card for verification. Accommodation can be arranged at an additional cost.'
    },
    {
        id: 11,
        category: 'Events',
        question: 'Are there any age restrictions?',
        answer: 'Participants must be enrolled in a recognized college or university. There\'s no specific age restriction, but you must carry valid student ID.'
    },
    {
        id: 12,
        category: 'Logistics',
        question: 'Is accommodation available?',
        answer: 'Yes, limited accommodation is available on a first-come-first-served basis at ₹500/night. Contact logistics@aether.tech to book your stay.'
    },
    {
        id: 13,
        category: 'Logistics',
        question: 'Will food be provided?',
        answer: 'Registered participants get access to the food court with discounted rates. For hackathon participants, meals are included in the registration fee.'
    },
    {
        id: 14,
        category: 'Logistics',
        question: 'Is there parking available?',
        answer: 'Yes, free parking is available for two-wheelers and four-wheelers. Follow the signs to the designated parking area.'
    }
];

export const getFaqsByCategory = (category) =>
    category === 'all' ? faqs : faqs.filter(faq => faq.category === category);

export const getCategories = () => [...new Set(faqs.map(faq => faq.category))];
