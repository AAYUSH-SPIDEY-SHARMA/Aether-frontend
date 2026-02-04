import { useEffect, useRef, useState } from 'react';
import { BookOpen, Code, Trophy, Users } from 'lucide-react';
import './HowItWorks.css';

/**
 * HowItWorks - Vertical/horizontal timeline showing AETHER journey
 * Steps: Learn → Build → Compete → Lead
 */
const steps = [
    {
        id: 1,
        title: 'Learn',
        description: 'Start with workshops, bootcamps, and mentorship from experienced seniors.',
        icon: BookOpen,
        color: 'cyan'
    },
    {
        id: 2,
        title: 'Build',
        description: 'Work on real projects with real-world impact using cutting-edge technologies.',
        icon: Code,
        color: 'purple'
    },
    {
        id: 3,
        title: 'Compete',
        description: 'Represent IIIT Lucknow in hackathons, coding contests, and technical competitions.',
        icon: Trophy,
        color: 'cyan'
    },
    {
        id: 4,
        title: 'Lead',
        description: 'Guide the next generation and shape the future of AETHER.',
        icon: Users,
        color: 'purple'
    }
];

export default function HowItWorks() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

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

    return (
        <section
            ref={sectionRef}
            className={`how-it-works section ${isVisible ? 'hiw-visible' : ''}`}
        >
            <div className="container">
                <div className="hiw-header">
                    <span className="section-label">Your Journey</span>
                    <h2 className="section-title heading-display heading-2">
                        How AETHER <span className="text-gradient">Works</span>
                    </h2>
                    <p className="section-description">
                        Your path from learner to leader
                    </p>
                </div>

                <div className="timeline">
                    {/* Connection Line */}
                    <div className="timeline-line">
                        <div className="timeline-line-fill" />
                    </div>

                    {/* Steps */}
                    <div className="timeline-steps">
                        {steps.map((step, index) => (
                            <TimelineStep
                                key={step.id}
                                step={step}
                                index={index}
                                isVisible={isVisible}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineStep({ step, index, isVisible }) {
    const Icon = step.icon;
    const delay = index * 150;

    return (
        <div
            className={`timeline-step step-${step.color}`}
            style={{
                transitionDelay: isVisible ? `${delay}ms` : '0ms',
                animationDelay: `${delay}ms`
            }}
        >
            {/* Step Node */}
            <div className="step-node">
                <div className="step-icon">
                    <Icon size={24} />
                </div>
                <div className="step-number">{step.id}</div>
            </div>

            {/* Step Content */}
            <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
            </div>
        </div>
    );
}
