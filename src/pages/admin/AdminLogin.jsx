// AdminLogin - Admin authentication
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';
import './Admin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Call actual backend API
            const res = await authAPI.login(email, password);
            const data = res.data;

            // Check if login successful
            if (data.success && data.data?.tokens?.accessToken) {
                // Check if user is admin
                const user = data.data.user;
                if (user.role !== 'ADMIN') {
                    setError('Access denied. Admin privileges required.');
                    setLoading(false);
                    return;
                }

                // Store token and redirect
                localStorage.setItem('adminToken', data.data.tokens.accessToken);
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            // Handle API errors
            const errorMessage = err.response?.data?.message || 'Invalid email or password';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="login-header">
                    <div className="admin-logo">
                        <span className="logo-text">AETHER</span>
                        <span className="logo-badge">ADMIN</span>
                    </div>
                    <h1>Admin Login</h1>
                    <p>Sign in to access the admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input
                                type="email"
                                className="input"
                                placeholder="admin@aether.tech"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="spinner" size={18} />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>

            <style>{`
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
