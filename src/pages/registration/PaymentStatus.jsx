// Payment Status Page - Event-Centric model
// Shows registration status after payment

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import './Registration.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PaymentStatus() {
    const location = useLocation();
    const { eventId } = useParams();

    // Get registrationId: localStorage is PRIMARY source now (for window.location.href redirect)
    // location.state is backup for direct navigation
    const getRegistrationId = () => {
        // First check localStorage (set by PaymentProcessing before redirect)
        const storedEventId = localStorage.getItem('lastRegistrationEvent');
        const storedRegId = localStorage.getItem('lastRegistrationId');

        if (storedEventId === eventId && storedRegId) {
            return storedRegId;
        }

        // Fallback: check location.state
        if (location.state?.registrationId) {
            // Save to localStorage for refresh persistence
            localStorage.setItem('lastRegistrationId', location.state.registrationId);
            localStorage.setItem('lastRegistrationEvent', eventId || '');
            return location.state.registrationId;
        }

        return null;
    };

    const registrationId = getRegistrationId();

    const [status, setStatus] = useState('PENDING');
    const [loading, setLoading] = useState(true);
    const [registration, setRegistration] = useState(null);
    const [error, setError] = useState(null);

    // Use refs to avoid dependency issues
    const pollCountRef = useRef(0);
    const intervalRef = useRef(null);

    const pollStatus = useCallback(async () => {
        if (!registrationId) return false;

        try {
            const res = await fetch(`${API_BASE}/registration/status/${registrationId}`);
            if (!res.ok) throw new Error('Failed to fetch status');

            const data = await res.json();
            setRegistration(data.data);
            setStatus(data.data.status);
            setLoading(false);

            if (data.data.status === 'SUCCESS' || data.data.status === 'FAILED') {
                return true; // Done polling
            }
            return false; // Continue polling
        } catch (err) {
            console.error('Status poll error:', err);
            setError('Failed to fetch registration status');
            setLoading(false);
            return false;
        }
    }, [registrationId]);


    useEffect(() => {
        // If we have registrationId, ALWAYS fetch from API
        if (registrationId) {
            // Initial poll immediately
            pollStatus();

            // Start interval for polling only if status is PENDING/PROCESSING
            intervalRef.current = setInterval(async () => {
                pollCountRef.current += 1;
                const done = await pollStatus();
                if (done && intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }, 2000); // Poll every 2 seconds

            // Cleanup on unmount
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            };
        } else {
            // No registrationId - show error
            setLoading(false);
            setError('Registration information not found. Please try registering again.');
        }
    }, [registrationId, pollStatus]);

    // Error state - show helpful message
    if (error && !registrationId) {
        return (
            <div className="registration-page">
                <div className="payment-status-container">
                    <div className="status-content failed">
                        <AlertCircle size={64} className="status-icon" />
                        <h1>Session Expired</h1>
                        <p>Your registration session has expired or the page was refreshed.</p>
                        <p className="processing-note">
                            If you completed payment, please check your email for confirmation or contact support.
                        </p>
                        <div className="status-actions">
                            <Link to="/events" className="btn btn-primary">
                                View Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderStatusContent = () => {
        if (loading) {
            return (
                <div className="status-content processing">
                    <Loader2 size={64} className="status-icon spinner" />
                    <h1>Loading Status</h1>
                    <p>Please wait while we fetch your registration status...</p>
                </div>
            );
        }

        switch (status) {
            case 'SUCCESS':
                return (
                    <div className="status-content success">
                        <CheckCircle size={64} className="status-icon" />
                        <h1>Registration Successful!</h1>
                        <p>You have been successfully registered for the event.</p>

                        <div className="registration-details">
                            <div className="detail-row">
                                <span>Registration ID</span>
                                <span className="mono">{(registration?.id || registrationId || '').slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Event</span>
                                <span>{registration?.event?.title || 'Loading...'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Team Name</span>
                                <span>{registration?.teamName || 'Loading...'}</span>
                            </div>
                            {registration?.paidAt && (
                                <div className="detail-row">
                                    <span>Paid On</span>
                                    <span>{new Date(registration.paidAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="status-actions">
                            <Link to="/events" className="btn btn-primary">
                                Browse More Events
                            </Link>
                        </div>

                        <p className="confirmation-note">
                            A confirmation email has been sent to your registered email address.
                        </p>
                    </div>
                );

            case 'FAILED':
                return (
                    <div className="status-content failed">
                        <XCircle size={64} className="status-icon" />
                        <h1>Payment Failed</h1>
                        <p>Your payment could not be processed. Please try again.</p>

                        <div className="status-actions">
                            <Link to={`/register/${eventId}`} className="btn btn-primary">
                                Try Again
                            </Link>
                            <Link to="/events" className="btn btn-secondary">
                                View Other Events
                            </Link>
                        </div>
                    </div>
                );

            case 'PENDING':
            case 'PROCESSING':
            default:
                return (
                    <div className="status-content processing">
                        <Loader2 size={64} className="status-icon spinner" />
                        <h1>Processing Payment</h1>
                        <p>Please wait while we confirm your payment...</p>
                        <p className="processing-note">
                            This may take a few moments. Do not close this page.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="registration-page">
            <div className="payment-status-container">
                {renderStatusContent()}
            </div>
        </div>
    );
}
