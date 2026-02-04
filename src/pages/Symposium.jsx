// Symposium.jsx - AETHER Symposium 2026 Landing Page
// Uses ONLY symposium/ and shared/ components - NO club/ components

import SymposiumHero from '../components/symposium/SymposiumHero';
import FeaturedEvents from '../components/symposium/FeaturedEvents';
import SchedulePreview from '../components/symposium/SchedulePreview';
// import Speakers from '../components/symposium/Speakers'; // Hidden for now
import Sponsors from '../components/symposium/Sponsors';
import CommunityJoin from '../components/shared/CommunityJoin';
import './Symposium.css';

export default function Symposium() {
    return (
        <main className="symposium-page">
            {/* Symposium Hero with Countdown */}
            <SymposiumHero />

            {/* Featured Symposium Events */}
            <FeaturedEvents />

            {/* Schedule Preview */}
            <SchedulePreview />

            {/* Speakers - Hidden for future */}
            {/* <Speakers /> */}

            {/* Sponsors */}
            <Sponsors />

            {/* Community Join */}
            <CommunityJoin />
        </main>
    );
}

