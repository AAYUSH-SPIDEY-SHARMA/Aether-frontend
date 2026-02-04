import { Mail, Phone, MapPin, MessageCircle, ExternalLink, Send } from 'lucide-react';
import './Contact.css';

export default function Contact() {
    return (
        <div className="contact-page">
            {/* Hero */}
            <section className="contact-hero">
                <div className="container">
                    <h1 className="page-title heading-display heading-1">
                        Get in <span className="text-gradient">Touch</span>
                    </h1>
                    <p className="page-subtitle">
                        Have questions or want to partner with us? We'd love to hear from you!
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div className="contact-info">
                            <h2>Contact Information</h2>

                            <div className="contact-items">
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <Mail size={24} />
                                    </div>
                                    <div className="contact-details">
                                        <h4>Email Us</h4>
                                        <a href="mailto:aether@iiitl.ac.in">aether@iiitl.ac.in</a>
                                        {/* <a href="mailto:support@aether.tech">support@aether.tech</a> */}
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <Phone size={24} />
                                    </div>
                                    <div className="contact-details">
                                        <h4>Call Us</h4>
                                        <a href="tel:+***********">+91 ***********</a>
                                        <a href="tel:+***********">+91 ***********</a>
                                    </div>
                                </div>

                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="contact-details">
                                        <h4>Visit Us</h4>
                                        <p>IIIT Lucknow</p>
                                        <p>Lucknow, Uttar Pradesh - 226002</p>
                                    </div>
                                </div>
                            </div>

                            {/* Community Links */}
                            <div className="community-links">
                                <h3>Join Our Community</h3>
                                <div className="community-btns">
                                    <a
                                        href="https://chat.whatsapp.com/DzpQbnArztA1gpyCDMc7w6"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="community-link whatsapp"
                                    >
                                        <MessageCircle size={20} />
                                        WhatsApp Group
                                        <ExternalLink size={14} />
                                    </a>
                                    <a
                                        href="https://discord.gg/5rJxqxSTbw"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="community-link discord"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                        </svg>
                                        Discord Server
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <h2>Send us a Message</h2>
                            <form className="contact-form">
                                <div className="form-row">
                                    <div className="input-group">
                                        <label className="input-label">Your Name</label>
                                        <input type="text" className="input" placeholder="SPIDEY Sharma" required />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Your Email</label>
                                        <input type="email" className="input" placeholder="MSA24005@iiitl.ac.in" required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Subject</label>
                                    <input type="text" className="input" placeholder="How can we help?" required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Message</label>
                                    <textarea className="input textarea" rows={5} placeholder="Your message..." required />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    <Send size={18} />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
