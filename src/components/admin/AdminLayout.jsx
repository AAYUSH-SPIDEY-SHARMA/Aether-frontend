// AdminLayout - Wrapper with Sidebar and Topbar
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AdminLayout.css';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Check auth on mount
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

    // Get page title from path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'Dashboard';
        if (path.includes('/wings')) return 'Wings Management';
        if (path.includes('/events')) return 'Events Management';
        if (path.includes('/symposium')) return 'Symposium Management';
        if (path.includes('/team')) return 'Team Management';
        if (path.includes('/registrations')) return 'Registrations';
        if (path.includes('/sponsors')) return 'Sponsors';
        return 'Admin';
    };

    return (
        <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                onLogout={handleLogout}
            />

            <main className="admin-main">
                {/* Topbar */}
                <header className="admin-topbar">
                    <h1 className="topbar-title">{getPageTitle()}</h1>
                    <div className="topbar-right">
                        <span className="topbar-date">
                            {new Date().toLocaleDateString('en-IN', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="admin-page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
