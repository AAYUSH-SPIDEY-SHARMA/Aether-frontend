// Sidebar - Admin navigation
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Layers,
    Calendar,
    Trophy,
    Users,
    CreditCard,
    Building2,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Mic2,
    Image,
    Star
} from 'lucide-react';

const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/wings', icon: Layers, label: 'Wings' },
    { path: '/admin/events', icon: Trophy, label: 'Events' },
    { path: '/admin/symposium', icon: Calendar, label: 'Symposium' },
    { path: '/admin/home-team', icon: Star, label: 'Home Page Team' },
    { path: '/admin/team', icon: Users, label: 'Team' },
    { path: '/admin/registrations', icon: CreditCard, label: 'Registrations' },
    { path: '/admin/sponsors', icon: Building2, label: 'Sponsors' },
    { path: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
    { path: '/admin/speakers', icon: Mic2, label: 'Speakers' },
    { path: '/admin/assets', icon: Image, label: 'Site Assets' },
];

export default function Sidebar({ collapsed, onToggle, onLogout }) {
    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span className="logo-icon">A</span>
                    {!collapsed && (
                        <div className="logo-text">
                            <span className="logo-title">AETHER</span>
                            <span className="logo-badge">ADMIN</span>
                        </div>
                    )}
                </div>
                <button className="sidebar-toggle" onClick={onToggle}>
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                        title={collapsed ? label : undefined}
                    >
                        <Icon size={20} />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <NavLink to="/admin/settings" className="sidebar-link" title={collapsed ? 'Settings' : undefined}>
                    <Settings size={20} />
                    {!collapsed && <span>Settings</span>}
                </NavLink>
                <button className="sidebar-link logout-btn" onClick={onLogout} title={collapsed ? 'Logout' : undefined}>
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
