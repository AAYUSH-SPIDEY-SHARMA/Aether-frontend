import { useState, useEffect } from 'react';
import { teamAPI } from '../../services/api';
import TeamMemberCard from './TeamMemberCard';
import './SymposiumCommitteeSection.css';

export default function SymposiumCommitteeSection() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await teamAPI.getAll();
                const allMembers = res.data?.data?.members || [];
                // Filter for symposium types
                const sympTypes = ['SYMPOSIUM_COORDINATOR', 'SYMPOSIUM_CORE', 'SYMPOSIUM_VOLUNTEER'];
                const teamMembers = allMembers
                    .filter(m => sympTypes.includes(m.type) && m.isActive)
                    .map(m => ({
                        id: m.id,
                        name: m.name,
                        role: m.primaryRole,
                        image: m.imageUrl, // Map imageUrl to image
                        imageCrop: m.imageCrop,
                        highlightTag: m.highlightTag,
                        linkedin: m.linkedin,
                        github: m.github,
                        instagram: m.instagram,
                    }));
                setMembers(teamMembers);
            } catch (error) {
                console.error('Failed to fetch symposium team:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    if (loading) {
        return (
            <section className="symposium-committee-section">
                <div className="container">
                    <div className="committee-header">
                        <h2 className="section-title heading-display heading-2">
                            Organizing <span className="text-gradient-purple">Committee</span>
                        </h2>
                    </div>
                    <div className="loading-state">Loading...</div>
                </div>
            </section>
        );
    }

    if (members.length === 0) return null;

    return (
        <section className="symposium-committee-section">
            <div className="container">
                {/* Section Header */}
                <div className="committee-header">
                    <div className="header-badge">
                        <span>AETHER Symposium 2026</span>
                    </div>
                    <h2 className="section-title heading-display heading-2">
                        Organizing <span className="text-gradient-purple">Committee</span>
                    </h2>
                    <p className="section-subtitle">
                        The team behind AETHER Symposium 2026
                    </p>
                </div>

                {/* Single Grid - All Members */}
                <div className="committee-grid">
                    {members.map((member) => (
                        <TeamMemberCard
                            key={member.id}
                            member={member}
                            variant="symposium"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
