// EventsList - List all events with CRUD
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../../../components/admin/DataTable';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { eventsAPI } from '../../../services/api';

export default function EventsList() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, event: null });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await eventsAPI.getAll();
            setEvents(res.data?.data?.events || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.event) return;
        try {
            await eventsAPI.delete(deleteModal.event.id);
            setEvents(events.filter(e => e.id !== deleteModal.event.id));
            setDeleteModal({ open: false, event: null });
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const columns = [
        {
            key: 'title',
            label: 'Title',
            render: (val, row) => (
                <div className="cell-with-badge">
                    <span>{val}</span>
                    <span className="slug-badge">{row.slug}</span>
                </div>
            )
        },
        {
            key: 'eventType',
            label: 'Type',
            render: (val) => (
                <span className={`type-badge type-${val?.toLowerCase()}`}>
                    {val}
                </span>
            )
        },
        {
            key: 'teamType',
            label: 'Team Type',
            render: (val) => val || 'SOLO'
        },
        {
            key: 'fee',
            label: 'Fee',
            render: (val) => val ? `₹${val}` : 'Free'
        },
        {
            key: 'isLive',
            label: 'Status',
            render: (val) => (
                <span className={`status-badge ${val ? 'active' : 'inactive'}`}>
                    {val ? 'Live' : 'Draft'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="action-buttons">
                    <button
                        className="action-btn"
                        onClick={() => navigate(`/admin/events/${row.id}/edit`)}
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        className="action-btn delete"
                        onClick={() => setDeleteModal({ open: true, event: row })}
                        title="Delete"
                    >
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
                data={events}
                loading={loading}
                searchPlaceholder="Search events..."
                emptyMessage="No events found"
                actions={
                    <Link to="/admin/events/new" className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        Add Event
                    </Link>
                }
            />

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, event: null })}
                onConfirm={handleDelete}
                title="Delete Event"
                message={`Are you sure you want to delete "${deleteModal.event?.title}"?`}
                confirmText="Delete"
                variant="danger"
            />

            <style>{`
                .cell-with-badge { display: flex; flex-direction: column; gap: 4px; }
                .slug-badge { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-family: monospace; }
                .type-badge { display: inline-flex; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
                .type-badge.type-competition { background: rgba(0,212,255,0.15); color: #00d4ff; }
                .type-badge.type-workshop { background: rgba(168,85,247,0.15); color: #a855f7; }
                .type-badge.type-talk { background: rgba(251,191,36,0.15); color: #fbbf24; }
                .type-badge.type-hackathon { background: rgba(16,185,129,0.15); color: #10b981; }
            `}</style>
        </div>
    );
}
