// SpeakersList - List/manage speakers
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import DataTable from '../../../components/admin/DataTable';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import api from '../../../services/api';

export default function SpeakersList() {
    const navigate = useNavigate();
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, speaker: null });

    useEffect(() => {
        fetchSpeakers();
    }, []);

    const fetchSpeakers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/speakers');
            setSpeakers(res.data?.data?.speakers || []);
        } catch (error) {
            console.error('Failed to fetch speakers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.speaker) return;
        try {
            await api.delete(`/speakers/${deleteModal.speaker.id}`);
            setSpeakers(speakers.filter(s => s.id !== deleteModal.speaker.id));
            setDeleteModal({ open: false, speaker: null });
        } catch (error) {
            console.error('Failed to delete speaker:', error);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (val, row) => (
                <div className="speaker-cell">
                    {row.imageUrl && <img src={row.imageUrl} alt={val} className="speaker-avatar" />}
                    <div>
                        <span className="speaker-name">{val}</span>
                        <span className="speaker-company">{row.company}</span>
                    </div>
                    {row.isFeatured && <Star size={14} className="featured-star" fill="#fbbf24" />}
                </div>
            )
        },
        { key: 'title', label: 'Title' },
        {
            key: 'topics',
            label: 'Topics',
            render: (val) => {
                const topics = Array.isArray(val) ? val : [];
                return topics.slice(0, 2).join(', ') + (topics.length > 2 ? '...' : '');
            }
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
                    <button className="action-btn" onClick={() => navigate(`/admin/speakers/${row.id}/edit`)} title="Edit">
                        <Edit size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => setDeleteModal({ open: true, speaker: row })} title="Delete">
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
                data={speakers}
                loading={loading}
                searchPlaceholder="Search speakers..."
                emptyMessage="No speakers found"
                actions={
                    <Link to="/admin/speakers/new" className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        Add Speaker
                    </Link>
                }
            />

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, speaker: null })}
                onConfirm={handleDelete}
                title="Delete Speaker"
                message={`Are you sure you want to delete "${deleteModal.speaker?.name}"?`}
                confirmText="Delete"
                variant="danger"
            />

            <style>{`
                .speaker-cell { display: flex; align-items: center; gap: 12px; }
                .speaker-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
                .speaker-name { display: block; font-weight: 500; color: #fff; }
                .speaker-company { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
                .featured-star { color: #fbbf24; margin-left: 8px; }
            `}</style>
        </div>
    );
}
