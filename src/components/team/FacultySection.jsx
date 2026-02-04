import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { teamAPI } from '../../services/api';
import { getCropStyle } from '../../utils/imageUtils';
import './FacultySection.css';

export default function FacultySection() {
    const [advisors, setAdvisors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await teamAPI.getAll();
                const allMembers = res.data?.data?.members || [];
                // Filter for FACULTY type
                const faculty = allMembers
                    .filter(m => m.type === 'FACULTY' && m.isActive)
                    .map(m => ({
                        id: m.id,
                        name: m.name,
                        role: m.primaryRole || 'Faculty Advisor',
                        department: m.secondaryRole || 'IIIT Lucknow',
                        image: m.imageUrl,
                        imageCrop: m.imageCrop,
                        email: m.email,
                    }));
                setAdvisors(faculty);
            } catch (error) {
                console.error('Failed to fetch faculty:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaculty();
    }, []);

    if (loading) {
        return (
            <section className="faculty-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title heading-display heading-2">
                            Faculty <span className="text-gradient-purple">Advisors</span>
                        </h2>
                    </div>
                    <div className="loading-state">Loading...</div>
                </div>
            </section>
        );
    }

    if (advisors.length === 0) return null;

    return (
        <section className="faculty-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title heading-display heading-2">
                        Faculty <span className="text-gradient-purple">Advisors</span>
                    </h2>
                    <p className="section-subtitle">Guiding AETHER with expertise and vision</p>
                </div>

                <div className="faculty-grid">
                    {advisors.map((advisor) => (
                        <div key={advisor.id} className="faculty-card-epic">
                            {/* HUD Frame */}
                            <div className="faculty-hud-frame">
                                <span className="hud-corner hud-corner--tl" />
                                <span className="hud-corner hud-corner--tr" />
                                <span className="hud-corner hud-corner--bl" />
                                <span className="hud-corner hud-corner--br" />
                            </div>

                            {/* Status Badge */}
                            <div className="faculty-status-badge">
                                <span className="status-dot" />
                                <span>ADVISOR</span>
                            </div>

                            {/* Image Area */}
                            <div className="faculty-image-area">
                                {advisor.image ? (
                                    (() => {
                                        const cropStyles = getCropStyle(advisor.imageCrop);

                                        if (cropStyles.hasData) {
                                            return (
                                                <div style={cropStyles.wrapper}>
                                                    <img src={advisor.image} alt={advisor.name} style={cropStyles.image} />
                                                </div>
                                            );
                                        }
                                        return <img src={advisor.image} alt={advisor.name} className="faculty-image" />;
                                    })()
                                ) : (
                                    <div className="faculty-avatar-large">
                                        {advisor.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                                    </div>
                                )}
                            </div>

                            {/* Data Panel */}
                            <div className="faculty-data-panel">
                                <h3 className="faculty-name">{advisor.name}</h3>
                                <span className="faculty-role-badge">{advisor.role}</span>
                                <p className="faculty-department">{advisor.department}</p>
                                {advisor.email && (
                                    <a href={`mailto:${advisor.email}`} className="faculty-email">
                                        <Mail size={14} />
                                        <span>{advisor.email}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
