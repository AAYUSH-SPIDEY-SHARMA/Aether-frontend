// SponsorsList - List sponsors with CRUD
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../../../components/admin/DataTable';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { sponsorsAPI, symposiumAPI } from '../../../services/api';

export default function SponsorsList() {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, sponsor: null });

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            setLoading(true);
            // Sponsors are included in symposium data
            const res = await symposiumAPI.getActive();
            setSponsors(res.data?.data?.symposium?.sponsors || []);
        } catch (error) {
            console.error('Failed to fetch sponsors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.sponsor) return;
        try {
            await sponsorsAPI.delete(deleteModal.sponsor.id);
            setSponsors(sponsors.filter(s => s.id !== deleteModal.sponsor.id));
            setDeleteModal({ open: false, sponsor: null });
        } catch (error) {
            console.error('Failed to delete sponsor:', error);
        }
    };

    const tierColors = {
        TITLE: 'gold',
        GOLD: 'yellow',
        SILVER: 'gray',
        BRONZE: 'orange',
        PARTNER: 'cyan'
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (val, row) => (
                <div className="sponsor-cell">
                    {row.logoUrl && <img src={row.logoUrl} alt={val} className="sponsor-logo" />}
                    <span>{val}</span>
                </div>
            )
        },
        {
            key: 'tier',
            label: 'Tier',
            render: (val) => (
                <span className={`tier-badge tier-${tierColors[val] || 'cyan'}`}>
                    {val}
                </span>
            )
        },
        {
            key: 'website',
            label: 'Website',
            render: (val) => val ? (
                <a href={val} target="_blank" rel="noopener noreferrer" className="website-link">
                    {new URL(val).hostname}
                </a>
            ) : '—'
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="action-buttons">
                    <button className="action-btn" onClick={() => navigate(`/admin/sponsors/${row.id}/edit`)} title="Edit">
                        <Edit size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => setDeleteModal({ open: true, sponsor: row })} title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="list-page">
            <DataTable
                columns={columns}
                data={sponsors}
                loading={loading}
                searchPlaceholder="Search sponsors..."
                emptyMessage="No sponsors found"
                actions={
                    <Link to="/admin/sponsors/new" className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        Add Sponsor
                    </Link>
                }
            />

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, sponsor: null })}
                onConfirm={handleDelete}
                title="Delete Sponsor"
                message={`Are you sure you want to delete "${deleteModal.sponsor?.name}"?`}
                confirmText="Delete"
                variant="danger"
            />

            <style>{`
                .sponsor-cell { display: flex; align-items: center; gap: 12px; }
                .sponsor-logo { width: 40px; height: 40px; object-fit: contain; border-radius: 8px; background: rgba(255,255,255,0.05); padding: 4px; }
                .tier-badge { display: inline-flex; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
                .tier-badge.tier-gold { background: rgba(251,191,36,0.15); color: #fbbf24; }
                .tier-badge.tier-yellow { background: rgba(234,179,8,0.15); color: #eab308; }
                .tier-badge.tier-gray { background: rgba(156,163,175,0.15); color: #9ca3af; }
                .tier-badge.tier-orange { background: rgba(249,115,22,0.15); color: #f97316; }
                .tier-badge.tier-cyan { background: rgba(0,212,255,0.15); color: #00d4ff; }
                .website-link { color: #00d4ff; text-decoration: none; }
                .website-link:hover { text-decoration: underline; }
            `}</style>
        </div>
    );
}
