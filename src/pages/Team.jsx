// Team.jsx - AETHER Club + Symposium Team Page
// Structure: Faculty Advisors → Club Coordinators → Symposium 2026 Committee (Single Grid)

import FacultySection from '../components/team/FacultySection';
import CoordinatorsSection from '../components/team/CoordinatorsSection';
import SymposiumCommitteeSection from '../components/team/SymposiumCommitteeSection';
import './Team.css';

export default function Team() {
    return (
        <main className="team-page">
            {/* Page Hero */}
            <section className="team-hero">
                <div className="team-hero-bg">
                    <div className="hero-gradient" />
                </div>
                <div className="container">
                    <span className="hero-label">The People Behind AETHER</span>
                    <h1 className="hero-title heading-display">
                        Our <span className="text-gradient">Team</span>
                    </h1>
                    <p className="hero-subtitle">
                        Meet the passionate individuals driving innovation and excellence at IIIT Lucknow.
                    </p>
                </div>
            </section>

            {/* Faculty Advisors - Premium Large Cards */}
            <FacultySection />

            {/* Club Coordinators - Single Cluster Grid */}
            <CoordinatorsSection />

            {/* Symposium 2026 Organizing Committee - Single Grid, No Subsections */}
            <SymposiumCommitteeSection />
        </main>
    );
}
