// SettingsPage - Site settings management
import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        // Contact Info
        contactEmail: '',
        contactPhone: '',
        address: '',
        // Social Links
        linkedin: '',
        instagram: '',
        twitter: '',
        github: '',
        discord: '',
        // About
        aboutText: '',
        clubName: 'AETHER',
        collegeName: 'IIIT Lucknow'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            const data = res.data?.data?.settings || {};
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/settings/bulk', { settings });
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="form-loading"><Loader2 className="spinner" size={32} /><span>Loading...</span></div>;
    }

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h2>Site Settings</h2>
                <p>Manage global settings for the AETHER website</p>
            </div>

            <div className="settings-sections">
                {/* Contact Information */}
                <div className="settings-section">
                    <h3>Contact Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} placeholder="aether@iiitl.ac.in" />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" name="contactPhone" value={settings.contactPhone} onChange={handleChange} placeholder="+91 1234567890" />
                        </div>
                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea name="address" value={settings.address} onChange={handleChange} rows={2} placeholder="IIIT Lucknow Campus..." />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="settings-section">
                    <h3>Social Links</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input type="url" name="linkedin" value={settings.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/..." />
                        </div>
                        <div className="form-group">
                            <label>Instagram</label>
                            <input type="url" name="instagram" value={settings.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
                        </div>
                        <div className="form-group">
                            <label>Twitter</label>
                            <input type="url" name="twitter" value={settings.twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
                        </div>
                        <div className="form-group">
                            <label>GitHub</label>
                            <input type="url" name="github" value={settings.github} onChange={handleChange} placeholder="https://github.com/..." />
                        </div>
                        <div className="form-group">
                            <label>Discord</label>
                            <input type="url" name="discord" value={settings.discord} onChange={handleChange} placeholder="https://discord.gg/..." />
                        </div>
                    </div>
                </div>

                {/* General */}
                <div className="settings-section">
                    <h3>General</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Club Name</label>
                            <input type="text" name="clubName" value={settings.clubName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>College Name</label>
                            <input type="text" name="collegeName" value={settings.collegeName} onChange={handleChange} />
                        </div>
                        <div className="form-group full-width">
                            <label>About Text</label>
                            <textarea name="aboutText" value={settings.aboutText} onChange={handleChange} rows={4} placeholder="Brief description of AETHER club..." />
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
                    {saving ? <><Loader2 className="spinner" size={18} /> Saving...</> : <><Save size={18} /> Save All Settings</>}
                </button>
            </div>

            <style>{`
                .settings-page { max-width: 900px; }
                .settings-header { margin-bottom: 32px; }
                .settings-header h2 { font-size: 1.75rem; color: #fff; margin-bottom: 8px; }
                .settings-header p { color: rgba(255,255,255,0.5); }
                .settings-sections { display: flex; flex-direction: column; gap: 24px; }
                .settings-section { background: rgba(12,12,20,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; }
                .settings-section h3 { font-size: 1.1rem; color: #00d4ff; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
                .form-group { display: flex; flex-direction: column; gap: 6px; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
                .form-group input, .form-group textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 0.9rem; }
                .form-group input:focus, .form-group textarea:focus { outline: none; border-color: rgba(0,212,255,0.5); }
                .settings-actions { margin-top: 32px; display: flex; justify-content: flex-end; }
                .form-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: rgba(255,255,255,0.5); }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
