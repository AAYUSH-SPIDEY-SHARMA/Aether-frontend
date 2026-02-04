// SymposiumList - List all symposiums
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, CheckCircle } from 'lucide-react';
import DataTable from '../../../components/admin/DataTable';
import { symposiumAPI } from '../../../services/api';

export default function SymposiumList() {
    const navigate = useNavigate();
    const [symposiums, setSymposiums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSymposiums();
    }, []);

    const fetchSymposiums = async () => {
        try {
            setLoading(true);
            const res = await symposiumAPI.getAll();
            setSymposiums(res.data?.data?.symposiums || []);
        } catch (error) {
            console.error('Failed to fetch symposiums:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetActive = async (id) => {
        try {
            await symposiumAPI.setActive(id);
            await fetchSymposiums();
        } catch (error) {
            console.error('Failed to set active:', error);
        }
    };

    const columns = [
        { key: 'year', label: 'Year', width: '80px' },
        { key: 'title', label: 'Title' },
        { key: 'theme', label: 'Theme' },
        {
            key: 'startDate',
            label: 'Dates',
            render: (val, row) => (
                <span>
                    {new Date(val).toLocaleDateString('en-IN')} - {new Date(row.endDate).toLocaleDateString('en-IN')}
                </span>
            )
        },
        { key: 'location', label: 'Location' },
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
                    {!row.isActive && (
                        <button
                            className="action-btn activate"
                            onClick={() => handleSetActive(row.id)}
                            title="Set as Active"
                        >
                            <CheckCircle size={16} />
                        </button>
                    )}
                    <button
                        className="action-btn"
                        onClick={() => navigate(`/admin/symposium/${row.id}/edit`)}
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="list-page">
            <DataTable
                columns={columns}
                data={symposiums}
                loading={loading}
                searchPlaceholder="Search symposiums..."
                emptyMessage="No symposiums found"
                actions={
                    <Link to="/admin/symposium/new" className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        Add Symposium
                    </Link>
                }
            />

            <style>{`
                .action-btn.activate { color: #10b981; }
                .action-btn.activate:hover { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); }
            `}</style>
        </div>
    );
}
