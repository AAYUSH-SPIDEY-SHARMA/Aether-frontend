import { Linkedin, Twitter } from 'lucide-react';
import { speakers } from '../mock/speakers';
import './SpeakersPage.css';

export default function SpeakersPage() {
    return (
        <div className="speakers-page">
            {/* Hero */}
            <section className="speakers-hero">
                <div className="container">
                    <h1 className="page-title heading-display heading-1">
                        Speakers & <span className="text-gradient">Judges</span>
                    </h1>
                    <p className="page-subtitle">
                        Learn from industry leaders and innovators shaping the future of technology.
                    </p>
                </div>
            </section>

            {/* Speakers Grid */}
            <section className="speakers-grid-section section">
                <div className="container">
                    <div className="speakers-full-grid">
                        {speakers.map((speaker) => (
                            <div key={speaker.id} className="speaker-card-full">
                                <div className="speaker-avatar">
                                    <span>{speaker.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <div className="speaker-details">
                                    <h3 className="speaker-name">{speaker.name}</h3>
                                    <p className="speaker-title">{speaker.title}</p>
                                    <p className="speaker-company">{speaker.company}</p>
                                    <p className="speaker-bio">{speaker.bio}</p>
                                    <div className="speaker-topics">
                                        {speaker.topics.map((topic, i) => (
                                            <span key={i} className="topic-tag">{topic}</span>
                                        ))}
                                    </div>
                                    <div className="speaker-social">
                                        {speaker.social.linkedin && (
                                            <a
                                                href={speaker.social.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {speaker.social.twitter && (
                                            <a
                                                href={speaker.social.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Twitter size={18} />
                                            </a>
                                        )}
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
