import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Download,
    LogOut,
    TrendingUp,
    Calendar,
    DollarSign
} from 'lucide-react';
import './Admin.css';

// Mock data for dashboard
const dashboardStats = {
    totalRegistrations: 156,
    paidRegistrations: 142,
    pendingPayments: 14,
    totalRevenue: 42458,
    todayRegistrations: 23
};

const recentRegistrations = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', event: 'HackNova', status: 'SUCCESS', amount: 499 },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', event: 'CodeStorm', status: 'PENDING', amount: 149 },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', event: 'RoboWars', status: 'SUCCESS', amount: 799 },
    { id: 4, name: 'Sneha Gupta', email: 'sneha@example.com', event: 'TechQuiz', status: 'SUCCESS', amount: 99 },
    { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', event: 'Gaming', status: 'FAILED', amount: 299 },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

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
                    <a href="#" className="sidebar-link">
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
                    <h1>Dashboard</h1>
                    <span className="admin-date">
                        <Calendar size={16} />
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon">
                                <Users size={20} />
                            </div>
                            <TrendingUp size={16} color="var(--success)" />
                        </div>
                        <div className="stat-card-value">{dashboardStats.totalRegistrations}</div>
                        <div className="stat-card-label">Total Registrations</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
                                <CreditCard size={20} />
                            </div>
                        </div>
                        <div className="stat-card-value">{dashboardStats.paidRegistrations}</div>
                        <div className="stat-card-label">Paid Registrations</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon" style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>
                                <CreditCard size={20} />
                            </div>
                        </div>
                        <div className="stat-card-value">{dashboardStats.pendingPayments}</div>
                        <div className="stat-card-label">Pending Payments</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-card-icon" style={{ background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)' }}>
                                <DollarSign size={20} />
                            </div>
                        </div>
                        <div className="stat-card-value">₹{dashboardStats.totalRevenue.toLocaleString()}</div>
                        <div className="stat-card-label">Total Revenue</div>
                    </div>
                </div>

                {/* Recent Registrations Table */}
                <div className="data-table-container">
                    <div className="table-header">
                        <h3>Recent Registrations</h3>
                        <div className="table-actions">
                            <button className="btn btn-secondary btn-sm">
                                <Download size={14} />
                                Export CSV
                            </button>
                            <Link to="/admin/registrations" className="btn btn-primary btn-sm">
                                View All
                            </Link>
                        </div>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Event</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRegistrations.map(reg => (
                                <tr key={reg.id}>
                                    <td>{reg.name}</td>
                                    <td>{reg.email}</td>
                                    <td>{reg.event}</td>
                                    <td>₹{reg.amount}</td>
                                    <td>
                                        <span className={`status-badge status-${reg.status.toLowerCase()}`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <style>{`
        .admin-date {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
