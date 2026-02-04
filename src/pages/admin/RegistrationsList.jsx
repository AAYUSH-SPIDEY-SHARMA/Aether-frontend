// RegistrationsList - Enhanced with full team details and comprehensive CSV export
import { useState, useEffect } from 'react';
import { Download, Eye, X, Users, Mail, Phone, Building, Clock, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import { registrationsAPI, symposiumAPI } from '../../services/api';

export default function RegistrationsList() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [symposiums, setSymposiums] = useState([]);
    const [selectedSymposium, setSelectedSymposium] = useState('');
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());

    useEffect(() => {
        fetchSymposiums();
    }, []);

    useEffect(() => {
        if (selectedSymposium) {
            fetchRegistrations(selectedSymposium);
        } else {
            fetchRegistrations();
        }
    }, [selectedSymposium]);

    const fetchSymposiums = async () => {
        try {
            const res = await symposiumAPI.getAll();
            const symps = res.data?.data?.symposiums || [];
            setSymposiums(symps);
            const active = symps.find(s => s.isActive);
            if (active) setSelectedSymposium(active.id);
        } catch (error) {
            console.error('Failed to fetch symposiums:', error);
        }
    };

    const fetchRegistrations = async (symposiumId) => {
        try {
            setLoading(true);
            const res = await registrationsAPI.getAll(symposiumId);
            setRegistrations(res.data?.data?.registrations || []);
        } catch (error) {
            console.error('Failed to fetch registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRowExpand = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const handleExportCSV = () => {
        // Check if there are registrations
        if (registrations.length === 0) {
            alert('No registrations to export. Register for some events first!');
            return;
        }
        // Comprehensive CSV with all details
        const headers = [
            'Registration ID',
            'Team Name',
            'Event',
            'Event Type',
            'Amount (₹)',
            'Payment Status',
            'Razorpay Order ID',
            'Razorpay Payment ID',
            'Registration Date',
            'Registration Time',
            'Payment Date',
            'Leader Name',
            'Leader Email',
            'Leader Phone',
            'Leader College',
            'Team Size',
            'Member 2 Name',
            'Member 2 Email',
            'Member 2 Phone',
            'Member 2 College',
            'Member 3 Name',
            'Member 3 Email',
            'Member 3 Phone',
            'Member 3 College',
            'Member 4 Name',
            'Member 4 Email',
            'Member 4 Phone',
            'Member 4 College'
        ];

        const rows = registrations.map(r => {
            const participants = r.participants || [];
            const leader = participants.find(p => p.isLeader) || participants[0];
            const members = participants.filter(p => !p.isLeader);

            const regDate = new Date(r.createdAt);
            const paidDate = r.paidAt ? new Date(r.paidAt) : null;

            return [
                r.id,
                `"${r.teamName || '—'}"`,
                `"${r.event?.title || '—'}"`,
                r.event?.eventType || '—',
                r.amount || 0,
                r.status,
                r.razorpayOrderId || '—',
                r.razorpayPaymentId || '—',
                regDate.toLocaleDateString('en-IN'),
                regDate.toLocaleTimeString('en-IN'),
                paidDate ? paidDate.toLocaleDateString('en-IN') : '—',
                `"${leader?.fullName || '—'}"`,
                leader?.email || '—',
                leader?.phone || '—',
                `"${leader?.college || '—'}"`,
                participants.length,
                `"${members[0]?.fullName || ''}"`,
                members[0]?.email || '',
                members[0]?.phone || '',
                `"${members[0]?.college || ''}"`,
                `"${members[1]?.fullName || ''}"`,
                members[1]?.email || '',
                members[1]?.phone || '',
                `"${members[1]?.college || ''}"`,
                `"${members[2]?.fullName || ''}"`,
                members[2]?.email || '',
                members[2]?.phone || '',
                `"${members[2]?.college || ''}"`
            ];
        });

        const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations-complete-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return {
            date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const columns = [
        {
            key: 'expand',
            label: '',
            render: (_, row) => (
                <button
                    className="expand-btn"
                    onClick={(e) => { e.stopPropagation(); toggleRowExpand(row.id); }}
                >
                    {expandedRows.has(row.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            )
        },
        {
            key: 'teamName',
            label: 'Team / Name',
            render: (val, row) => (
                <div className="team-cell">
                    <span className="team-name">{val || '—'}</span>
                    <span className="team-size"><Users size={12} /> {row.participants?.length || 1}</span>
                </div>
            )
        },
        {
            key: 'event',
            label: 'Event',
            render: (_, row) => (
                <div className="event-cell">
                    <span className="event-title">{row.event?.title || '—'}</span>
                    <span className={`event-type ${row.event?.eventType?.toLowerCase()}`}>
                        {row.event?.eventType}
                    </span>
                </div>
            )
        },
        {
            key: 'leader',
            label: 'Leader',
            render: (_, row) => {
                const leader = row.participants?.find(p => p.isLeader) || row.participants?.[0];
                return (
                    <div className="leader-cell">
                        <span className="leader-name">{leader?.fullName || '—'}</span>
                        <span className="leader-email">{leader?.email || ''}</span>
                    </div>
                );
            }
        },
        {
            key: 'amount',
            label: 'Amount',
            render: (val) => (
                <span className={`amount ${val > 0 ? 'paid' : 'free'}`}>
                    {val ? `₹${val}` : 'Free'}
                </span>
            )
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
            label: 'Registered',
            render: (val) => {
                const { date, time } = formatDateTime(val);
                return (
                    <div className="datetime-cell">
                        <span className="date">{date}</span>
                        <span className="time">{time}</span>
                    </div>
                );
            }
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <button
                    className="view-btn"
                    onClick={() => setSelectedRegistration(row)}
                >
                    <Eye size={16} />
                </button>
            )
        }
    ];

    // Custom row renderer to show expanded details
    const renderExpandedRow = (row) => {
        if (!expandedRows.has(row.id)) return null;

        const participants = row.participants || [];

        return (
            <tr className="expanded-row">
                <td colSpan={columns.length}>
                    <div className="expanded-content">
                        <div className="expanded-section">
                            <h4>Team Members ({participants.length})</h4>
                            <div className="participants-grid">
                                {participants.map((p, idx) => (
                                    <div key={p.id || idx} className={`participant-card ${p.isLeader ? 'leader' : ''}`}>
                                        {p.isLeader && <span className="leader-badge">Leader</span>}
                                        <div className="participant-name">{p.fullName}</div>
                                        <div className="participant-detail"><Mail size={12} /> {p.email}</div>
                                        <div className="participant-detail"><Phone size={12} /> {p.phone}</div>
                                        <div className="participant-detail"><Building size={12} /> {p.college}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {row.razorpayOrderId && (
                            <div className="expanded-section">
                                <h4>Payment Details</h4>
                                <div className="payment-details">
                                    <div><strong>Order ID:</strong> {row.razorpayOrderId}</div>
                                    {row.razorpayPaymentId && <div><strong>Payment ID:</strong> {row.razorpayPaymentId}</div>}
                                    {row.paidAt && <div><strong>Paid At:</strong> {new Date(row.paidAt).toLocaleString('en-IN')}</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="list-page registrations-page">
            <div className="list-header">
                <h2>Registrations</h2>
                <div className="stats-row">
                    <div className="stat">Total: <strong>{registrations.length}</strong></div>
                    <div className="stat success">Paid: <strong>{registrations.filter(r => r.status === 'SUCCESS').length}</strong></div>
                    <div className="stat pending">Pending: <strong>{registrations.filter(r => r.status === 'PENDING').length}</strong></div>
                    <div className="stat">Revenue: <strong>₹{registrations.filter(r => r.status === 'SUCCESS').reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString('en-IN')}</strong></div>
                </div>
            </div>

            <div className="list-filters">
                <select
                    value={selectedSymposium}
                    onChange={(e) => setSelectedSymposium(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Symposiums</option>
                    {symposiums.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.title} ({s.year}) {s.isActive ? '✓' : ''}
                        </option>
                    ))}
                </select>

                <button
                    className="btn btn-primary btn-sm export-btn"
                    onClick={handleExportCSV}
                >
                    <Download size={16} />
                    Export CSV ({registrations.length})
                </button>
            </div>

            <DataTable
                columns={columns}
                data={registrations}
                loading={loading}
                searchPlaceholder="Search by team, event, or email..."
                emptyMessage="No registrations found"
            />

            {/* Detail Modal */}
            {selectedRegistration && (
                <div className="modal-overlay" onClick={() => setSelectedRegistration(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedRegistration(null)}>
                            <X size={20} />
                        </button>

                        <h2>Registration Details</h2>

                        <div className="detail-section">
                            <h3>Event Information</h3>
                            <div className="detail-grid">
                                <div><strong>Event:</strong> {selectedRegistration.event?.title}</div>
                                <div><strong>Type:</strong> {selectedRegistration.event?.eventType}</div>
                                <div><strong>Team Name:</strong> {selectedRegistration.teamName}</div>
                                <div><strong>Fee:</strong> ₹{selectedRegistration.amount || 0}</div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Team Members ({selectedRegistration.participants?.length || 0})</h3>
                            <div className="team-detail-grid">
                                {selectedRegistration.participants?.map((p, idx) => (
                                    <div key={p.id || idx} className={`team-member-card ${p.isLeader ? 'leader' : ''}`}>
                                        <div className="member-header">
                                            <span className="member-name">{p.fullName}</span>
                                            {p.isLeader && <span className="leader-tag">Team Leader</span>}
                                        </div>
                                        <div className="member-details">
                                            <div><Mail size={14} /> {p.email}</div>
                                            <div><Phone size={14} /> {p.phone}</div>
                                            <div><Building size={14} /> {p.college}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Payment & Timing</h3>
                            <div className="detail-grid">
                                <div><strong>Status:</strong> <span className={`status-badge ${selectedRegistration.status?.toLowerCase()}`}>{selectedRegistration.status}</span></div>
                                <div><strong>Registered:</strong> {new Date(selectedRegistration.createdAt).toLocaleString('en-IN')}</div>
                                {selectedRegistration.paidAt && <div><strong>Paid At:</strong> {new Date(selectedRegistration.paidAt).toLocaleString('en-IN')}</div>}
                                {selectedRegistration.razorpayOrderId && <div><strong>Order ID:</strong> <code>{selectedRegistration.razorpayOrderId}</code></div>}
                                {selectedRegistration.razorpayPaymentId && <div><strong>Payment ID:</strong> <code>{selectedRegistration.razorpayPaymentId}</code></div>}
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            <style>{`
                .registrations-page .list-header { margin-bottom: 20px; }
                .registrations-page .list-header h2 { font-size: 1.5rem; color: #fff; margin-bottom: 12px; }
                .stats-row { display: flex; gap: 24px; flex-wrap: wrap; }
                .stat { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
                .stat strong { color: #fff; font-size: 1.1rem; }
                .stat.success strong { color: #00d4ff; }
                .stat.pending strong { color: #ffd700; }
                
                .list-filters { margin-bottom: 20px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
                .filter-select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; color: #fff; min-width: 250px; }
                .filter-select:focus { outline: none; border-color: rgba(0,212,255,0.5); }
                .export-btn { display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #00d4ff, #a855f7); border: none; padding: 10px 20px; border-radius: 10px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .export-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,212,255,0.3); }
                .export-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
                
                .expand-btn { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; padding: 4px; }
                .expand-btn:hover { color: #00d4ff; }
                
                .team-cell { display: flex; flex-direction: column; gap: 4px; }
                .team-name { font-weight: 500; color: #fff; }
                .team-size { font-size: 0.75rem; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 4px; }
                
                .event-cell { display: flex; flex-direction: column; gap: 4px; }
                .event-title { color: #fff; }
                .event-type { font-size: 0.7rem; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; display: inline-block; width: fit-content; }
                .event-type.competition { background: rgba(0,212,255,0.2); color: #00d4ff; }
                .event-type.workshop { background: rgba(168,85,247,0.2); color: #a855f7; }
                .event-type.talk { background: rgba(255,215,0,0.2); color: #ffd700; }
                
                .leader-cell { display: flex; flex-direction: column; gap: 2px; }
                .leader-name { color: #fff; }
                .leader-email { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
                
                .amount { font-weight: 600; }
                .amount.paid { color: #00d4ff; }
                .amount.free { color: rgba(255,255,255,0.5); }
                
                .datetime-cell { display: flex; flex-direction: column; gap: 2px; }
                .datetime-cell .date { color: #fff; font-size: 0.85rem; }
                .datetime-cell .time { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
                
                .view-btn { background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); border-radius: 6px; color: #00d4ff; padding: 6px; cursor: pointer; }
                .view-btn:hover { background: rgba(0,212,255,0.2); }
                
                .expanded-row td { padding: 0 !important; background: rgba(0,212,255,0.02); }
                .expanded-content { padding: 20px 24px; border-top: 1px solid rgba(255,255,255,0.05); }
                .expanded-section { margin-bottom: 20px; }
                .expanded-section:last-child { margin-bottom: 0; }
                .expanded-section h4 { font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
                
                .participants-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
                .participant-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px; position: relative; }
                .participant-card.leader { border-color: rgba(0,212,255,0.3); background: rgba(0,212,255,0.05); }
                .leader-badge { position: absolute; top: 8px; right: 8px; font-size: 0.65rem; background: rgba(0,212,255,0.2); color: #00d4ff; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
                .participant-name { font-weight: 600; color: #fff; margin-bottom: 8px; }
                .participant-detail { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.6); font-size: 0.8rem; margin-bottom: 4px; }
                .participant-detail svg { opacity: 0.5; }
                
                .payment-details { background: rgba(255,255,255,0.03); border-radius: 8px; padding: 12px; font-size: 0.85rem; color: rgba(255,255,255,0.7); }
                .payment-details div { margin-bottom: 6px; }
                .payment-details div:last-child { margin-bottom: 0; }
                
                /* Modal */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
                .modal-content { background: #0c0c14; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; }
                .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; }
                .modal-close:hover { color: #fff; }
                .modal-content h2 { font-size: 1.3rem; color: #fff; margin-bottom: 24px; }
                
                .detail-section { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .detail-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                .detail-section h3 { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
                
                .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
                .detail-grid > div { color: rgba(255,255,255,0.7); font-size: 0.9rem; }
                .detail-grid strong { color: rgba(255,255,255,0.5); }
                .detail-grid code { background: rgba(0,212,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; }
                
                .team-detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
                .team-member-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; }
                .team-member-card.leader { border-color: rgba(0,212,255,0.4); background: rgba(0,212,255,0.05); }
                .member-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
                .member-name { font-weight: 600; color: #fff; font-size: 1rem; }
                .leader-tag { font-size: 0.7rem; background: linear-gradient(135deg, #00d4ff, #a855f7); color: #000; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
                .member-details { display: flex; flex-direction: column; gap: 8px; }
                .member-details > div { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); font-size: 0.85rem; }
                .member-details svg { opacity: 0.5; }
                
                @media (max-width: 768px) {
                    .detail-grid { grid-template-columns: 1fr; }
                    .stats-row { gap: 12px; }
                }
            `}</style>
        </div >
    );
}
