// EventForm - Create/Edit event
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { eventsAPI, symposiumAPI } from '../../../services/api';
import ImageUpload from '../../../components/admin/ImageUpload';

const EVENT_TYPES = ['COMPETITION', 'WORKSHOP', 'TALK', 'HACKATHON'];
const TEAM_TYPES = ['SOLO', 'TEAM'];

export default function EventForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [symposiums, setSymposiums] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        symposiumId: '',
        eventType: 'COMPETITION',
        teamType: 'SOLO',
        description: '',
        longDescription: '',
        rules: '',
        fee: 0,
        maxSeats: 100,
        minTeamSize: 1,
        maxTeamSize: 1,
        venue: '',
        duration: '',
        prizes: '',
        imageUrl: '',
        imageCrop: null,
        isLive: true
    });

    useEffect(() => {
        fetchSymposiums();
        if (isEdit) fetchEvent();
    }, [id]);

    const fetchSymposiums = async () => {
        try {
            const res = await symposiumAPI.getAll();
            setSymposiums(res.data?.data?.symposiums || []);
        } catch (error) {
            console.error('Failed to fetch symposiums:', error);
        }
    };

    const fetchEvent = async () => {
        try {
            // Fetch all events and find the one by ID since the edit URL uses UUID
            const res = await eventsAPI.getAll();
            const events = res.data?.data?.events || [];
            const event = events.find(e => e.id === id);
            if (event) {
                setFormData({
                    title: event.title || '',
                    slug: event.slug || '',
                    symposiumId: event.symposiumId || '',
                    eventType: event.eventType || 'COMPETITION',
                    teamType: event.teamType || 'SOLO',
                    description: event.description || '',
                    longDescription: event.longDescription || '',
                    rules: event.rules || '',
                    fee: event.fee || 0,
                    maxSeats: event.maxSeats || 100,
                    minTeamSize: event.minTeamSize || 1,
                    maxTeamSize: event.maxTeamSize || 1,
                    venue: event.venue || '',
                    duration: event.duration || '',
                    prizes: event.prizes || '',
                    imageUrl: event.imageUrl || '',
                    imageCrop: event.imageCrop || null,
                    isLive: event.isLive ?? true
                });
            }
        } catch (error) {
            console.error('Failed to fetch event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await eventsAPI.update(id, formData);
            } else {
                await eventsAPI.create(formData);
            }
            navigate('/admin/events');
        } catch (error) {
            console.error('Failed to save event:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="form-loading"><Loader2 className="spinner" size={32} /><span>Loading...</span></div>;
    }

    return (
        <div className="form-page">
            <div className="form-header">
                <button className="back-btn" onClick={() => navigate('/admin/events')}>
                    <ArrowLeft size={18} /> Back to Events
                </button>
                <h2>{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Slug *</label>
                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Symposium *</label>
                        <select name="symposiumId" value={formData.symposiumId} onChange={handleChange} required>
                            <option value="">Select symposium</option>
                            {symposiums.map(s => <option key={s.id} value={s.id}>{s.title} ({s.year})</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Event Type</label>
                        <select name="eventType" value={formData.eventType} onChange={handleChange}>
                            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Team Type</label>
                        <select name="teamType" value={formData.teamType} onChange={handleChange}>
                            {TEAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Fee (₹)</label>
                        <input type="number" name="fee" value={formData.fee} onChange={handleChange} min="0" />
                    </div>
                    <div className="form-group">
                        <label>Max Seats</label>
                        <input type="number" name="maxSeats" value={formData.maxSeats} onChange={handleChange} min="1" />
                    </div>
                    <div className="form-group">
                        <label>Min Team Size</label>
                        <input type="number" name="minTeamSize" value={formData.minTeamSize} onChange={handleChange} min="1" />
                    </div>
                    <div className="form-group">
                        <label>Max Team Size</label>
                        <input type="number" name="maxTeamSize" value={formData.maxTeamSize} onChange={handleChange} min="1" />
                    </div>
                    <div className="form-group">
                        <label>Venue</label>
                        <input type="text" name="venue" value={formData.venue} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Duration</label>
                        <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="2 hours" />
                    </div>
                    <div className="form-group">
                        <label>Prizes</label>
                        <input type="text" name="prizes" value={formData.prizes} onChange={handleChange} placeholder="₹10,000 + Goodies" />
                    </div>
                    <div className="form-group full-width">
                        <label>Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
                    </div>
                    <div className="form-group full-width">
                        <label>Rules</label>
                        <textarea name="rules" value={formData.rules} onChange={handleChange} rows={4} />
                    </div>
                    <div className="form-group">
                        <ImageUpload
                            value={formData.imageUrl}
                            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            folder="events"
                            label="Event Image"
                            aspectRatio="event"
                            cropData={formData.imageCrop}
                            onCropChange={(crop) => setFormData(prev => ({ ...prev, imageCrop: JSON.stringify(crop) }))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input type="checkbox" name="isLive" checked={formData.isLive} onChange={handleChange} />
                            <span>Live (visible to users)</span>
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/events')}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <><Loader2 className="spinner" size={16} /> Saving...</> : <><Save size={16} /> Save Event</>}
                    </button>
                </div>
            </form>

            <style>{`
                .form-page { max-width: 900px; }
                .form-header { margin-bottom: 24px; }
                .form-header h2 { font-size: 1.5rem; color: #fff; margin-top: 12px; }
                .back-btn { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); background: none; border: none; cursor: pointer; }
                .back-btn:hover { color: #00d4ff; }
                .admin-form { background: rgba(12,12,20,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
                .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { font-size: 0.85rem; color: rgba(255,255,255,0.7); }
                .form-group input, .form-group textarea, .form-group select { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; color: #fff; }
                .form-group select option { background: #1a1a2e; color: #fff; padding: 10px; }
                .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: rgba(0,212,255,0.5); }
                .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
                .form-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: rgba(255,255,255,0.5); }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
