import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqs, getCategories } from '../mock/faqs';
import './FAQ.css';

export default function FAQ() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [openFaq, setOpenFaq] = useState(null);

    const categories = ['all', ...getCategories()];
    const filteredFaqs = activeCategory === 'all'
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory);

    return (
        <div className="faq-page">
            {/* Hero */}
            <section className="faq-hero">
                <div className="container">
                    <h1 className="page-title heading-display heading-1">
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </h1>
                    <p className="page-subtitle">
                        Got questions? We've got answers. Can't find what you're looking for? Contact us!
                    </p>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="faq-categories">
                <div className="container">
                    <div className="category-tabs">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="faq-list section">
                <div className="container">
                    <div className="faq-accordion">
                        {filteredFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className={`faq-item ${openFaq === faq.id ? 'open' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                >
                                    <span>{faq.question}</span>
                                    {openFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still Have Questions */}
                    <div className="faq-contact">
                        <h3>Still have questions?</h3>
                        <p>Can't find the answer you're looking for? Reach out to our team.</p>
                        <a href="mailto:aether@iiitl.ac.in" className="btn btn-primary">
                            Contact Support
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
