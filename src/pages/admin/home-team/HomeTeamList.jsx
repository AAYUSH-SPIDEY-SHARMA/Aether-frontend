// HomeTeamList - Admin page for managing Home page featured coordinators
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Star } from 'lucide-react';
import { teamAPI } from '../../../services/api';
import '../Admin.css';

export default function HomeTeamList() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await teamAPI.getAll();
            const allMembers = res.data?.data?.members || [];
            // Filter for HOME_FEATURED type
            const homeMembers = allMembers.filter(m => m.type === 'HOME_FEATURED');
            setMembers(homeMembers);
        } catch (error) {
            console.error('Failed to fetch home team:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this member?')) return;
        try {
            await teamAPI.delete(id);
            fetchMembers();
        } catch (error) {
            console.error('Failed to delete member:', error);
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="page-header">
                    <h1>Home Page Team</h1>
                </div>
                <div className="loading-state">Loading...</div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <Star size={24} />
                    </div>
                    <div>
                        <h1>Home Page Team</h1>
                        <p className="page-subtitle">
                            Manage the featured coordinators displayed on the Home page
                        </p>
                    </div>
                </div>
                <Link to="/admin/home-team/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Member
                </Link>
            </div>

            <div className="info-card" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 255, 255, 0.2)' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    <strong>Note:</strong> These members appear in the "Leadership & Core Team" section on the Home page.
                    The card aspect ratio is <strong>220×200 (11:10)</strong>. Use the "Home Featured" crop preset when uploading images.
                </p>
            </div>

            {members.length === 0 ? (
                <div className="empty-state">
                    <Users size={64} />
                    <h3>No Home Team Members</h3>
                    <p>Add coordinators to display on the Home page</p>
                    <Link to="/admin/home-team/new" className="btn btn-primary">
                        <Plus size={18} />
                        Add First Member
                    </Link>
                </div>
            ) : (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Program</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        <div className="table-image" style={{ width: '50px', height: '45px', borderRadius: '6px', overflow: 'hidden' }}>
                                            {member.imageUrl ? (
                                                <img src={member.imageUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="table-avatar">{member.name?.split(' ').map(n => n[0]).join('')}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td><strong>{member.name}</strong></td>
                                    <td>{member.primaryRole}</td>
                                    <td>{member.program}</td>
                                    <td>
                                        <span className={`status-badge ${member.isActive ? 'active' : 'inactive'}`}>
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link to={`/admin/home-team/${member.id}/edit`} className="btn btn-icon btn-ghost" title="Edit">
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(member.id)} className="btn btn-icon btn-ghost btn-danger" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
