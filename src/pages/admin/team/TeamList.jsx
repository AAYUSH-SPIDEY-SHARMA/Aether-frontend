// TeamList - List all team members with section filtering
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Award, Calendar } from 'lucide-react';
import DataTable from '../../../components/admin/DataTable';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { teamAPI } from '../../../services/api';

// Team sections/tabs - Only 2 sections, no "All"
const TEAM_SECTIONS = [
    { key: 'club', label: 'Club Team', icon: Award },
    { key: 'symposium', label: 'Symposium 2026 Team', icon: Calendar },
];

// Member types categorization - matches Prisma enum
const CLUB_TYPES = ['FACULTY', 'CLUB_COORDINATOR', 'WING_COORDINATOR', 'CORE_MEMBER'];
const SYMPOSIUM_TYPES = ['SYMPOSIUM_COORDINATOR', 'SYMPOSIUM_CORE', 'SYMPOSIUM_VOLUNTEER'];

export default function TeamList() {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, member: null });
    const [activeSection, setActiveSection] = useState('club');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const res = await teamAPI.getAll();
            setMembers(res.data?.data?.members || []);
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.member) return;
        try {
            await teamAPI.delete(deleteModal.member.id);
            setMembers(members.filter(m => m.id !== deleteModal.member.id));
            setDeleteModal({ open: false, member: null });
        } catch (error) {
            console.error('Failed to delete member:', error);
        }
    };

    // Filter members by section
    const filteredMembers = members.filter(m => {
        if (activeSection === 'club') return CLUB_TYPES.includes(m.type);
        if (activeSection === 'symposium') return SYMPOSIUM_TYPES.includes(m.type);
        return true;
    });

    // Get counts
    const counts = {
        club: members.filter(m => CLUB_TYPES.includes(m.type)).length,
        symposium: members.filter(m => SYMPOSIUM_TYPES.includes(m.type)).length,
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (val, row) => (
                <div className="member-cell">
                    {row.imageUrl ? (
                        <img src={row.imageUrl} alt={val} className="member-avatar" />
                    ) : (
                        <div className="member-avatar-placeholder">{val?.charAt(0)}</div>
                    )}
                    <div>
                        <span className="member-name">{val}</span>
                        <span className="member-program">{row.program}</span>
                    </div>
                </div>
            )
        },
        { key: 'primaryRole', label: 'Role' },
        {
            key: 'type',
            label: 'Type',
            render: (val) => (
                <span className={`type-badge ${SYMPOSIUM_TYPES.includes(val) ? 'symposium' : 'club'}`}>
                    {val?.replace(/_/g, ' ')}
                </span>
            )
        },
        {
            key: 'wing',
            label: 'Wing',
            render: (_, row) => row.wing?.name || '—'
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (val) => (
                <span className={`status-badge ${val ? 'active' : 'inactive'}`}>
                    {val ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="action-buttons">
                    <button className="action-btn" onClick={() => navigate(`/admin/team/${row.id}/edit`)} title="Edit">
                        <Edit size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => setDeleteModal({ open: true, member: row })} title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="list-page">
            {/* Section Tabs */}
            <div className="team-tabs">
                {TEAM_SECTIONS.map(section => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.key}
                            className={`team-tab ${activeSection === section.key ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.key)}
                        >
                            <Icon size={18} />
                            <span>{section.label}</span>
                            <span className="tab-count">{counts[section.key]}</span>
                        </button>
                    );
                })}
            </div>

            <DataTable
                columns={columns}
                data={filteredMembers}
                loading={loading}
                searchPlaceholder="Search team members..."
                emptyMessage={activeSection === 'symposium'
                    ? "No symposium team members yet. Add members with type 'SYMPOSIUM_COORDINATOR', 'SYMPOSIUM_CORE', or 'SYMPOSIUM_VOLUNTEER'."
                    : "No team members found"
                }
                actions={
                    <Link to="/admin/team/new" className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        Add Member
                    </Link>
                }
            />

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, member: null })}
                onConfirm={handleDelete}
                title="Delete Member"
                message={`Are you sure you want to delete "${deleteModal.member?.name}"?`}
                confirmText="Delete"
                variant="danger"
            />

            <style>{`
                .team-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }
                .team-tab {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    color: rgba(255,255,255,0.6);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .team-tab:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.12);
                }
                .team-tab.active {
                    background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15));
                    border-color: rgba(0,212,255,0.4);
                    color: #fff;
                }
                .tab-count {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 24px;
                    height: 24px;
                    padding: 0 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .team-tab.active .tab-count {
                    background: rgba(0,212,255,0.3);
                }
                .member-cell { display: flex; align-items: center; gap: 12px; }
                .member-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
                .member-avatar-placeholder {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    color: #00d4ff;
                    font-size: 1rem;
                }
                .member-name { display: block; font-weight: 500; color: #fff; }
                .member-program { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
                .type-badge { 
                    display: inline-flex; 
                    padding: 4px 10px; 
                    border-radius: 6px; 
                    font-size: 0.7rem; 
                    font-weight: 600; 
                    text-transform: capitalize; 
                }
                .type-badge.club {
                    background: rgba(168,85,247,0.15);
                    color: #a855f7;
                }
                .type-badge.symposium {
                    background: rgba(0,212,255,0.15);
                    color: #00d4ff;
                }
            `}</style>
        </div>
    );
}

