// WingsList - List all wings with CRUD actions
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../../../components/admin/DataTable';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { wingsAPI } from '../../../services/api';

export default function WingsList() {
    const navigate = useNavigate();
    const [wings, setWings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, wing: null });

    useEffect(() => {
        fetchWings();
    }, []);

    const fetchWings = async () => {
        try {
            setLoading(true);
            const res = await wingsAPI.getAll();
            setWings(res.data?.data?.wings || []);
        } catch (error) {
            console.error('Failed to fetch wings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.wing) return;
        try {
            await wingsAPI.delete(deleteModal.wing.id);
            setWings(wings.filter(w => w.id !== deleteModal.wing.id));
            setDeleteModal({ open: false, wing: null });
        } catch (error) {
            console.error('Failed to delete wing:', error);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (val, row) => (
                <div className="cell-with-badge">
                    <span>{val}</span>
                    <span className="slug-badge">{row.slug}</span>
                </div>
            )
        },
        { key: 'tagline', label: 'Tagline' },
        {
            key: 'color',
            label: 'Color',
            render: (val) => (
                <div className="color-preview" style={{ background: val || '#00d4ff' }}>
                    {val || 'cyan'}
                </div>
            )
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
                    <button
                        className="action-btn"
                        onClick={() => navigate(`/admin/wings/${row.id}/edit`)}
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        className="action-btn delete"
                        onClick={() => setDeleteModal({ open: true, wing: row })}
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
                data={wings}
                loading={loading}
                searchPlaceholder="Search wings..."
                emptyMessage="No wings found"
                actions={
                    <Link to="/admin/wings/new" className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        Add Wing
                    </Link>
                }
            />

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, wing: null })}
                onConfirm={handleDelete}
                title="Delete Wing"
                message={`Are you sure you want to delete "${deleteModal.wing?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />

            <style>{`
                .cell-with-badge {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .slug-badge {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.4);
                    font-family: monospace;
                }
                .color-preview {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}
