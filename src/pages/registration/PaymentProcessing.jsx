// Payment Processing Page - Event-Centric model
// Handles Razorpay checkout

import { useEffect, useState, useRef } from 'react';
import { useLocation, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle, CreditCard } from 'lucide-react';
import './Registration.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PaymentProcessing() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventId } = useParams();

    const { registrationId, orderId, amount, keyId, event, teamName } = location.state || {};

    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const razorpayRef = useRef(null);

    useEffect(() => {
        if (!orderId || !registrationId) return;

        // Load Razorpay script
        const loadRazorpay = () => {
            // Check if script already exists
            if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
                initializePayment();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = initializePayment;
            document.body.appendChild(script);
        };

        const initializePayment = () => {
            const options = {
                key: keyId,
                amount: amount,
                currency: 'INR',
                name: 'AETHER Symposium',
                description: `Registration: ${event?.title || 'Event'}`,
                order_id: orderId,
                handler: async function (response) {
                    // Payment callback received - Razorpay will close automatically
                    const paymentId = response.razorpay_payment_id;

                    // Save ALL data to localStorage for persistence across page reload
                    localStorage.setItem('lastRegistrationId', registrationId);
                    localStorage.setItem('lastRegistrationEvent', eventId || '');
                    localStorage.setItem('lastPaymentId', paymentId);
                    localStorage.setItem('lastOrderId', orderId);

                    // Confirm payment with backend (verifies with Razorpay API)
                    try {
                        const confirmRes = await fetch(`${API_BASE}/payments/confirm`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId,
                                paymentId,
                                registrationId,
                            }),
                        });

                        await confirmRes.json();
                    } catch (err) {
                        console.error('Payment confirmation failed:', err);
                    }

                    // CRITICAL FIX: Use window.location.href for GUARANTEED page reload
                    // React navigate() doesn't work reliably after Razorpay modal closes
                    // This forces a full browser navigation which always works
                    window.location.href = `/register/${eventId}/status`;
                },
                modal: {
                    ondismiss: function () {
                        // Only show error if payment wasn't successful
                        setError('Payment was cancelled or incomplete. Please try again.');
                    },
                    escape: false, // Prevent closing with escape key during payment
                    backdropclose: false, // Prevent closing by clicking backdrop
                },
                prefill: {
                    name: teamName,
                },
                theme: {
                    color: '#00d4ff',
                },
            };

            razorpayRef.current = new window.Razorpay(options);
            razorpayRef.current.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                setError(`Payment failed: ${response.error.description}`);
            });
            razorpayRef.current.open();
            setProcessing(true);
        };

        loadRazorpay();

        // Cleanup
        return () => {
            if (razorpayRef.current) {
                razorpayRef.current.close();
            }
        };
    }, [orderId, registrationId, amount, keyId, event, teamName, navigate, eventId]);

    if (!orderId || !registrationId) {
        return <Navigate to="/events" replace />;
    }

    return (
        <div className="registration-page">
            <div className="payment-processing-container">
                <div className="processing-card">
                    {error ? (
                        <>
                            <AlertCircle size={48} className="error-icon" />
                            <h2>Payment Issue</h2>
                            <p>{error}</p>
                            <div className="payment-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/events')}
                                >
                                    Back to Events
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {processing ? (
                                <CreditCard size={48} className="payment-icon" />
                            ) : (
                                <Loader2 size={48} className="spinner" />
                            )}
                            <h2>{processing ? 'Complete Payment' : 'Initializing Payment'}</h2>
                            <p>
                                {processing
                                    ? 'Please complete the payment in the Razorpay window.'
                                    : 'Loading payment gateway...'}
                            </p>
                            <div className="payment-details">
                                <div className="detail-row">
                                    <span>Event</span>
                                    <span>{event?.title}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Team</span>
                                    <span>{teamName}</span>
                                </div>
                                <div className="detail-row total">
                                    <span>Amount</span>
                                    <span>₹{amount / 100}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
