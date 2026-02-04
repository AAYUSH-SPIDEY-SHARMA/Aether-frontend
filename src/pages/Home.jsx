// Home.jsx - AETHER Club Home Page
// Premium rework with research-driven, authoritative design

import ClubHero from '../components/club/ClubHero';
import LeadershipTeam from '../components/club/LeadershipTeam';
import AboutAether from '../components/club/AboutAether';
import OurWings from '../components/club/OurWings';
import HowItWorks from '../components/club/HowItWorks';
import FlagshipEvent from '../components/club/FlagshipEvent';
import CommunityJoin from '../components/shared/CommunityJoin';

/**
 * AETHER Club Home Page
 * 
 * Section Order:
 * 1. Hero - AETHER identity with neural grid
 * 2. Leadership Team - Establish credibility early
 * 3. About AETHER - Editorial two-column layout
 * 4. Our Wings - Specialized teams with logos
 * 5. How It Works - Timeline (Learn → Build → Compete → Lead)
 * 6. Flagship Event - Symposium 2026 highlight
 * 7. Community - Tech command center
 */
export default function Home() {
    return (
        <main>
            {/* Club Hero - AETHER Identity with Neural Grid */}
            <ClubHero />

            {/* Leadership Team - Moved up for credibility */}
            <LeadershipTeam />

            {/* About AETHER - Editorial Section */}
            <AboutAether />

            {/* Our Wings - WnC & Climate Tech with logos */}
            <OurWings />

            {/* How It Works - Timeline */}
            <HowItWorks />

            {/* Flagship Event - Symposium 2026 */}
            <FlagshipEvent />

            {/* Stay Connected - Tech Command Center */}
            <CommunityJoin />
        </main>
    );
}
