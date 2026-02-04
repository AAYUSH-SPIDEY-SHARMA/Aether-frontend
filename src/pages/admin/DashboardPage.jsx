// AdminDashboard - Live data from API
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Calendar, Layers, DollarSign, Download, Trophy } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';
import { registrationsAPI, eventsAPI, wingsAPI, teamAPI, symposiumAPI } from '../../services/api';
import './Dashboard.css';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        successfulRegistrations: 0,
        pendingRegistrations: 0,
        totalRevenue: 0,
        totalEvents: 0,
        totalWings: 0,
        totalTeamMembers: 0
    });
    const [recentRegistrations, setRecentRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSymposium, setActiveSymposium] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Get active symposium first
            let symposium = null;
            try {
                const sympRes = await symposiumAPI.getActive();
                symposium = sympRes.data?.data?.symposium;
                setActiveSymposium(symposium);
            } catch (error) {
                console.error('Failed to fetch active symposium:', error);
            }

            // Fetch each data source independently to prevent one failure from breaking all
            let registrations = [];
            let events = [];
            let wings = [];
            let members = [];

            // Registrations (requires symposium)
            if (symposium) {
                try {
                    const res = await registrationsAPI.getAll(symposium.id);
                    registrations = res.data?.data?.registrations || [];
                } catch (error) {
                    console.error('Failed to fetch registrations:', error);
                }
            }

            // Events
            try {
                const res = await eventsAPI.getAll();
                events = res.data?.data?.events || [];
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }

            // Wings
            try {
                const res = await wingsAPI.getAll();
                wings = res.data?.data?.wings || [];
            } catch (error) {
                console.error('Failed to fetch wings:', error);
            }

            // Team
            try {
                const res = await teamAPI.getAll();
                members = res.data?.data?.members || [];
            } catch (error) {
                console.error('Failed to fetch team:', error);
            }

            // Calculate stats
            const successfulRegs = registrations.filter(r => r.status === 'SUCCESS');
            const pendingRegs = registrations.filter(r => r.status === 'PENDING');
            const totalRevenue = successfulRegs.reduce((sum, r) => sum + (r.amount || 0), 0);

            setStats({
                totalRegistrations: registrations.length,
                successfulRegistrations: successfulRegs.length,
                pendingRegistrations: pendingRegs.length,
                totalRevenue,
                totalEvents: events.length,
                totalWings: wings.length,
                totalTeamMembers: members.length
            });

            // Recent registrations (last 10)
            setRecentRegistrations(registrations.slice(0, 10));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (recentRegistrations.length === 0) {
            alert('No registrations to export');
            return;
        }
        const headers = ['Team Name', 'Event', 'Leader', 'Email', 'Amount', 'Status', 'Date'];
        const rows = recentRegistrations.map(r => {
            const leader = r.participants?.find(p => p.isLeader) || r.participants?.[0];
            return [
                `"${r.teamName || '—'}"`,
                `"${r.event?.title || '—'}"`,
                `"${leader?.fullName || '—'}"`,
                leader?.email || '—',
                r.amount || 0,
                r.status,
                new Date(r.createdAt).toLocaleDateString('en-IN')
            ];
        });
        const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const registrationColumns = [
        {
            key: 'teamName',
            label: 'Team / Name',
            render: (val) => val || '—'
        },
        {
            key: 'event',
            label: 'Event',
            render: (_, row) => row.event?.title || '—'
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (val) => val ? `₹${val}` : 'Free'
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span className={`status-badge ${val?.toLowerCase()}`}>
                    {val}
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Date',
            render: (val) => new Date(val).toLocaleDateString('en-IN')
        }
    ];

    return (
        <div className="dashboard-page">
            {/* Stats Grid */}
            <div className="stats-grid">
                <StatsCard
                    title="Total Registrations"
                    value={stats.totalRegistrations}
                    icon={Users}
                    color="cyan"
                />
                <StatsCard
                    title="Successful Payments"
                    value={stats.successfulRegistrations}
                    icon={CreditCard}
                    color="green"
                />
                <StatsCard
                    title="Pending Payments"
                    value={stats.pendingRegistrations}
                    icon={CreditCard}
                    color="gold"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
                    icon={DollarSign}
                    color="purple"
                />
            </div>

            {/* Secondary Stats */}
            <div className="stats-grid stats-grid--secondary">
                <StatsCard
                    title="Active Events"
                    value={stats.totalEvents}
                    icon={Trophy}
                    color="cyan"
                />
                <StatsCard
                    title="Wings"
                    value={stats.totalWings}
                    icon={Layers}
                    color="purple"
                />
                <StatsCard
                    title="Team Members"
                    value={stats.totalTeamMembers}
                    icon={Users}
                    color="green"
                />
            </div>

            {/* Recent Registrations */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>Recent Registrations</h2>
                    <div className="section-actions">
                        <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
                            <Download size={16} />
                            Export CSV
                        </button>
                        <Link to="/admin/registrations" className="btn btn-primary btn-sm">
                            View All
                        </Link>
                    </div>
                </div>
                <DataTable
                    columns={registrationColumns}
                    data={recentRegistrations}
                    loading={loading}
                    searchable={false}
                    pageSize={10}
                    emptyMessage="No registrations yet"
                />
            </div>
        </div>
    );
}
