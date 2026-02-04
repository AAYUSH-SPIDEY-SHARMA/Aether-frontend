import { sponsors } from '../mock/sponsors';
import './SponsorsPage.css';

export default function SponsorsPage() {
    return (
        <div className="sponsors-page">
            {/* Hero */}
            <section className="sponsors-hero">
                <div className="container">
                    <h1 className="page-title heading-display heading-1">
                        Our <span className="text-gradient">Sponsors</span>
                    </h1>
                    <p className="page-subtitle">
                        We're grateful to our sponsors for making AETHER possible.
                    </p>
                </div>
            </section>

            {/* Sponsors Display */}
            <section className="sponsors-display section">
                <div className="container">
                    {/* Title Sponsor */}
                    {sponsors.title.length > 0 && (
                        <div className="sponsor-tier">
                            <h2 className="tier-label">Title Sponsor</h2>
                            <div className="sponsors-row sponsors-title">
                                {sponsors.title.map((sponsor) => (
                                    <a
                                        key={sponsor.id}
                                        href={sponsor.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sponsor-card sponsor-card-title"
                                    >
                                        <span className="sponsor-name">{sponsor.name}</span>
                                        <span className="sponsor-link">Visit Website →</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Platinum */}
                    {sponsors.platinum.length > 0 && (
                        <div className="sponsor-tier">
                            <h2 className="tier-label">Platinum Partners</h2>
                            <div className="sponsors-row sponsors-platinum">
                                {sponsors.platinum.map((sponsor) => (
                                    <a
                                        key={sponsor.id}
                                        href={sponsor.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sponsor-card sponsor-card-platinum"
                                    >
                                        <span className="sponsor-name">{sponsor.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gold */}
                    {sponsors.gold.length > 0 && (
                        <div className="sponsor-tier">
                            <h2 className="tier-label">Gold Partners</h2>
                            <div className="sponsors-row sponsors-gold">
                                {sponsors.gold.map((sponsor) => (
                                    <a
                                        key={sponsor.id}
                                        href={sponsor.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sponsor-card sponsor-card-gold"
                                    >
                                        <span className="sponsor-name">{sponsor.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Silver */}
                    {sponsors.silver.length > 0 && (
                        <div className="sponsor-tier">
                            <h2 className="tier-label">Silver Partners</h2>
                            <div className="sponsors-row sponsors-silver">
                                {sponsors.silver.map((sponsor) => (
                                    <a
                                        key={sponsor.id}
                                        href={sponsor.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sponsor-card sponsor-card-silver"
                                    >
                                        <span className="sponsor-name">{sponsor.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Become Sponsor CTA */}
                    <div className="sponsor-cta-section">
                        <h3>Interested in sponsoring AETHER?</h3>
                        <p>Partner with us and reach 2000+ tech-savvy students.</p>
                        <a href="mailto:aether@iiitl.ac.in" className="btn btn-primary">
                            Become a Sponsor
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
