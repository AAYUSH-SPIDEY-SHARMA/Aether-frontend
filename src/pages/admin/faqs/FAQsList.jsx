// FAQsList - List/manage FAQs
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../../../components/admin/DataTable';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import api from '../../../services/api';

export default function FAQsList() {
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, faq: null });

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/faqs');
            setFaqs(res.data?.data?.faqs || []);
        } catch (error) {
            console.error('Failed to fetch FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.faq) return;
        try {
            await api.delete(`/faqs/${deleteModal.faq.id}`);
            setFaqs(faqs.filter(f => f.id !== deleteModal.faq.id));
            setDeleteModal({ open: false, faq: null });
        } catch (error) {
            console.error('Failed to delete FAQ:', error);
        }
    };

    const columns = [
        {
            key: 'category',
            label: 'Category',
            render: (val) => (
                <span className="category-badge">{val}</span>
            )
        },
        {
            key: 'question',
            label: 'Question',
            render: (val) => (
                <span className="question-text" title={val}>
                    {val.length > 60 ? `${val.substring(0, 60)}...` : val}
                </span>
            )
        },
        { key: 'sortOrder', label: 'Order', width: '70px' },
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
                    <button className="action-btn" onClick={() => navigate(`/admin/faqs/${row.id}/edit`)} title="Edit">
                        <Edit size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => setDeleteModal({ open: true, faq: row })} title="Delete">
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
                data={faqs}
                loading={loading}
                searchPlaceholder="Search FAQs..."
                emptyMessage="No FAQs found"
                actions={
                    <Link to="/admin/faqs/new" className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        Add FAQ
                    </Link>
                }
            />

            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, faq: null })}
                onConfirm={handleDelete}
                title="Delete FAQ"
                message={`Are you sure you want to delete this FAQ?`}
                confirmText="Delete"
                variant="danger"
            />

            <style>{`
                .category-badge { display: inline-flex; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; background: rgba(0,212,255,0.15); color: #00d4ff; text-transform: uppercase; }
                .question-text { display: block; max-width: 400px; }
            `}</style>
        </div>
    );
}
