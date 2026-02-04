import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Download,
    LogOut,
    Search,
    Filter,
    ChevronDown
} from 'lucide-react';
import './Admin.css';

// Mock registrations data
const allRegistrations = [
    { id: 'REG001', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', college: 'XYZ Engineering', event: 'HackNova', teamMembers: 'Priya, Amit', amount: 499, status: 'SUCCESS', date: '2026-01-07' },
    { id: 'REG002', name: 'Sneha Gupta', email: 'sneha@example.com', phone: '9876543211', college: 'ABC Institute', event: 'CodeStorm', teamMembers: '', amount: 149, status: 'PENDING', date: '2026-01-06' },
    { id: 'REG003', name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543212', college: 'DEF College', event: 'RoboWars', teamMembers: 'Ankit, Neha, Raj', amount: 799, status: 'SUCCESS', date: '2026-01-06' },
    { id: 'REG004', name: 'Ananya Reddy', email: 'ananya@example.com', phone: '9876543213', college: 'GHI University', event: 'UI/UX Challenge', teamMembers: '', amount: 199, status: 'FAILED', date: '2026-01-05' },
    { id: 'REG005', name: 'Karthik Iyer', email: 'karthik@example.com', phone: '9876543214', college: 'JKL Tech', event: 'TechQuiz', teamMembers: 'Rohit', amount: 99, status: 'SUCCESS', date: '2026-01-05' },
    { id: 'REG006', name: 'Ishaan Kapoor', email: 'ishaan@example.com', phone: '9876543215', college: 'MNO Engineering', event: 'Gaming', teamMembers: 'Dev, Arjun, Saurabh', amount: 299, status: 'SUCCESS', date: '2026-01-04' },
    { id: 'REG007', name: 'Meera Krishnan', email: 'meera@example.com', phone: '9876543216', college: 'PQR Institute', event: 'Photography', teamMembers: '', amount: 99, status: 'SUCCESS', date: '2026-01-04' },
    { id: 'REG008', name: 'Rohan Mehta', email: 'rohan@example.com', phone: '9876543217', college: 'STU College', event: 'Treasure Hunt', teamMembers: 'Anil, Priyanka, Suresh', amount: 149, status: 'PENDING', date: '2026-01-03' },
];

export default function AdminRegistrations() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('all');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const exportCSV = () => {
        // Generate CSV content
        const headers = ['Registration ID', 'Name', 'Email', 'Phone', 'College', 'Event', 'Team Members', 'Amount', 'Status', 'Date'];
        const rows = filteredRegistrations.map(r => [
            r.id, r.name, r.email, r.phone, r.college, r.event, r.teamMembers, r.amount, r.status, r.date
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aether_registrations.csv';
        a.click();
    };

    const filteredRegistrations = allRegistrations.filter(reg => {
        const matchesSearch = reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
        const matchesEvent = eventFilter === 'all' || reg.event === eventFilter;
        return matchesSearch && matchesStatus && matchesEvent;
    });

    const uniqueEvents = [...new Set(allRegistrations.map(r => r.event))];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="admin-logo">
                        <span className="logo-text">AETHER</span>
                        <span className="logo-badge">ADMIN</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/admin/dashboard"
                        className={`sidebar-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/registrations"
                        className={`sidebar-link ${location.pathname === '/admin/registrations' ? 'active' : ''}`}
                    >
                        <Users size={18} />
                        Registrations
                    </Link>
                    <a href="#" className="sidebar-link">
                        <CreditCard size={18} />
                        Payments
                    </a>
                    <a href="#" className="sidebar-link" onClick={exportCSV}>
                        <Download size={18} />
                        Export Data
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-link">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <div className="admin-header">
                    <h1>Registrations</h1>
                    <button onClick={exportCSV} className="btn btn-primary">
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <div className="search-box-admin">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-dropdowns">
                        <div className="filter-dropdown">
                            <Filter size={16} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="SUCCESS">Success</option>
                                <option value="PENDING">Pending</option>
                                <option value="FAILED">Failed</option>
                            </select>
                            <ChevronDown size={16} />
                        </div>

                        <div className="filter-dropdown">
                            <select
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                            >
                                <option value="all">All Events</option>
                                {uniqueEvents.map(event => (
                                    <option key={event} value={event}>{event}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {/* Registrations Table */}
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>College</th>
                                <th>Event</th>
                                <th>Team</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map(reg => (
                                <tr key={reg.id}>
                                    <td>{reg.id}</td>
                                    <td>{reg.name}</td>
                                    <td>{reg.email}</td>
                                    <td>{reg.phone}</td>
                                    <td>{reg.college}</td>
                                    <td>{reg.event}</td>
                                    <td>{reg.teamMembers || '-'}</td>
                                    <td>₹{reg.amount}</td>
                                    <td>
                                        <span className={`status-badge status-${reg.status.toLowerCase()}`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td>{new Date(reg.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredRegistrations.length === 0 && (
                        <div className="no-results">
                            No registrations found matching your criteria.
                        </div>
                    )}
                </div>

                <div className="table-footer">
                    <span className="results-count">
                        Showing {filteredRegistrations.length} of {allRegistrations.length} registrations
                    </span>
                </div>
            </main>

            <style>{`
        .filters-bar {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }
        .search-box-admin {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-4);
          flex: 1;
          max-width: 400px;
        }
        .search-box-admin svg {
          color: var(--text-muted);
        }
        .search-box-admin input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: var(--text-sm);
          outline: none;
        }
        .filter-dropdowns {
          display: flex;
          gap: var(--space-3);
        }
        .filter-dropdown {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-3);
          position: relative;
        }
        .filter-dropdown svg {
          color: var(--text-muted);
        }
        .filter-dropdown select {
          appearance: none;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: var(--text-sm);
          padding-right: var(--space-4);
          outline: none;
          cursor: pointer;
        }
        .no-results {
          padding: var(--space-12);
          text-align: center;
          color: var(--text-muted);
        }
        .table-footer {
          padding: var(--space-4) var(--space-6);
          border-top: 1px solid var(--border-subtle);
        }
        .results-count {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
