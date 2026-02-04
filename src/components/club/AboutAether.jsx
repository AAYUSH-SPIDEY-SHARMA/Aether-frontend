import { useEffect, useRef, useState } from 'react';
import './AboutAether.css';

/**
 * AboutAether - Editorial two-column section
 * Left: Research-driven paragraph
 * Right: AI mesh illustration with parallax
 */
export default function AboutAether() {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Intersection Observer for fade-in animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Parallax effect on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!imageRef.current || !sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

            if (scrollProgress >= 0 && scrollProgress <= 1) {
                const parallaxOffset = (scrollProgress - 0.5) * 40;
                imageRef.current.style.transform = `translateY(${parallaxOffset}px)`;
            }
        };

        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`about-editorial section ${isVisible ? 'about-visible' : ''}`}
        >
            <div className="container">
                <div className="about-grid">
                    {/* Text Content */}
                    <div className="about-content">
                        <span className="section-label">About Us</span>
                        <h2 className="section-title heading-display heading-2">
                            About <span className="text-gradient">AETHER</span>
                        </h2>

                        <div className="about-text">
                            <p className="about-paragraph">
                                <strong>AETHER</strong> is the official Data Science and AI/ML Club of
                                IIIT Lucknow, dedicated to advancing technical excellence through
                                research-driven innovation and competitive programming.
                            </p>
                            <p className="about-paragraph">
                                We focus on building production-grade systems, fostering competitive
                                excellence in hackathons and coding contests, and driving research
                                initiatives in emerging technologies. Our members work on real-world
                                projects spanning machine learning, data science, web development,
                                and climate technology.
                            </p>
                            <p className="about-paragraph about-highlight">
                                From workshops and mentorship programs to representing IIIT Lucknow
                                in national competitions, AETHER provides a platform for students to
                                learn, build, and lead in the tech community.
                            </p>
                        </div>
                    </div>

                    {/* Image with Parallax */}
                    <div className="about-image-container">
                        <div className="about-image-wrapper" ref={imageRef}>
                            <img
                                src="/images/wings/LOGO.png"
                                alt="AI Neural Network Visualization"
                                className="about-image"
                                loading="lazy"
                            />
                            <div className="about-image-glow" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
