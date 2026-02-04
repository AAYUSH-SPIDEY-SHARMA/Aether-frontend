// Event Registration Page - EVENT-CENTRIC model
// ONE REGISTRATION = ONE EVENT = ONE TEAM (or SOLO)

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, Users, User, AlertCircle, Check, Loader2 } from 'lucide-react';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { getEventBySlug } from '../../mock/events';
import './Registration.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function EventRegistration() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        teamName: '',
        participants: [{
            fullName: '',
            email: '',
            phone: '',
            college: '',
            isLeader: true,
        }],
    });

    const [formErrors, setFormErrors] = useState({});

    // Fetch event details
    useEffect(() => {
        async function fetchEvent() {
            try {
                setLoading(true);
                // Fetch event directly by slug or ID
                const res = await fetch(`${API_BASE}/events/${eventId}`);

                if (!res.ok) {
                    // Fallback to mock data
                    const mockEvent = getEventBySlug(eventId);
                    if (mockEvent) {
                        // Map mock event fields to expected format
                        setEvent({
                            ...mockEvent,
                            id: mockEvent.id,
                            title: mockEvent.name,
                            slug: mockEvent.slug,
                            description: mockEvent.description,
                            fee: mockEvent.fee || 0,
                            teamType: mockEvent.type?.toUpperCase() || 'SOLO',
                            minTeamSize: mockEvent.teamSizeMin || 1,
                            maxTeamSize: mockEvent.teamSizeMax || 1,
                        });
                        return;
                    }
                    throw new Error('Event not found');
                }

                const data = await res.json();
                setEvent(data.data.event);
            } catch (err) {
                // Final fallback to mock data
                const mockEvent = getEventBySlug(eventId);
                if (mockEvent) {
                    setEvent({
                        ...mockEvent,
                        id: mockEvent.id,
                        title: mockEvent.name,
                        slug: mockEvent.slug,
                        description: mockEvent.description,
                        fee: mockEvent.fee || 0,
                        teamType: mockEvent.type?.toUpperCase() || 'SOLO',
                        minTeamSize: mockEvent.teamSizeMin || 1,
                        maxTeamSize: mockEvent.teamSizeMax || 1,
                    });
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    const isSolo = event?.teamType === 'SOLO';
    const minSize = event?.minTeamSize || 1;
    const maxSize = event?.maxTeamSize || 1;

    const addParticipant = () => {
        if (formData.participants.length < maxSize) {
            setFormData(prev => ({
                ...prev,
                participants: [...prev.participants, {
                    fullName: '',
                    email: '',
                    phone: '',
                    college: '',
                    isLeader: false,
                }],
            }));
        }
    };

    const removeParticipant = (index) => {
        if (index === 0) return; // Can't remove leader
        setFormData(prev => ({
            ...prev,
            participants: prev.participants.filter((_, i) => i !== index),
        }));
    };

    const updateParticipant = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            participants: prev.participants.map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            ),
        }));
        // Clear error for this field
        setFormErrors(prev => ({
            ...prev,
            [`participant_${index}_${field}`]: null,
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.teamName.trim()) {
            errors.teamName = 'Team name is required';
        }

        formData.participants.forEach((p, i) => {
            if (!p.fullName.trim()) errors[`participant_${i}_fullName`] = 'Name required';
            if (!p.email.trim()) errors[`participant_${i}_email`] = 'Email required';
            else if (!/\S+@\S+\.\S+/.test(p.email)) errors[`participant_${i}_email`] = 'Invalid email';
            if (!p.phone.trim()) errors[`participant_${i}_phone`] = 'Phone required';
            else if (!/^[0-9]{10}$/.test(p.phone)) errors[`participant_${i}_phone`] = '10 digits required';
            if (!p.college.trim()) errors[`participant_${i}_college`] = 'College required';
        });

        // Check team size
        if (formData.participants.length < minSize) {
            errors.teamSize = `Minimum ${minSize} member(s) required`;
        }

        // Check for duplicate emails
        const emails = formData.participants.map(p => p.email.toLowerCase());
        if (new Set(emails).size !== emails.length) {
            errors.duplicateEmail = 'Each participant must have a unique email';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);

        try {
            // Create registration (or get existing pending one for resume)
            const regRes = await fetch(`${API_BASE}/registration/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    teamName: formData.teamName,
                    participants: formData.participants,
                }),
            });

            if (!regRes.ok) {
                const errData = await regRes.json();
                throw new Error(errData.message || 'Registration failed');
            }

            const regData = await regRes.json();
            const registration = regData.data.registration;

            // Save to localStorage for status page
            localStorage.setItem('lastRegistrationId', registration.id);
            localStorage.setItem('lastRegistrationEvent', event.slug || eventId);

            // If free event, go directly to success
            if (event.fee === 0) {
                window.location.href = `/register/${event.slug}/status`;
                return;
            }

            // Create payment order
            const payRes = await fetch(`${API_BASE}/payments/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registrationId: registration.id }),
            });

            if (!payRes.ok) {
                throw new Error('Failed to create payment order');
            }

            const payData = await payRes.json();
            const order = payData.data;

            // Load Razorpay script if not already loaded
            const loadRazorpay = () => {
                return new Promise((resolve) => {
                    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
                        resolve();
                        return;
                    }
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.async = true;
                    script.onload = resolve;
                    document.body.appendChild(script);
                });
            };

            await loadRazorpay();

            // Open Razorpay modal on THIS page
            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: 'INR',
                name: 'AETHER Symposium',
                description: `Registration: ${event.title}`,
                order_id: order.orderId,
                handler: async function (response) {
                    // Payment successful
                    const paymentId = response.razorpay_payment_id;

                    // Confirm payment with backend
                    try {
                        await fetch(`${API_BASE}/payments/confirm`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: order.orderId,
                                paymentId,
                                registrationId: registration.id,
                            }),
                        });
                    } catch (err) {
                        console.error('Payment confirmation failed:', err);
                    }

                    // Redirect to status page using window.location for guaranteed reload
                    window.location.href = `/register/${event.slug}/status`;
                },
                modal: {
                    ondismiss: function () {
                        setSubmitting(false);
                        setFormErrors({ submit: 'Payment was cancelled. Please try again.' });
                    },
                },
                prefill: {
                    name: formData.teamName,
                    email: formData.participants[0]?.email,
                    contact: formData.participants[0]?.phone,
                },
                theme: {
                    color: '#00d4ff',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                setSubmitting(false);
                setFormErrors({ submit: `Payment failed: ${response.error.description}` });
            });
            razorpay.open();

            // Keep submitting state while Razorpay is open
            // It will be reset in ondismiss or on success redirect
        } catch (err) {
            setFormErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="registration-page">
                <div className="loading-state">
                    <Loader2 className="spinner" size={40} />
                    <p>Loading event...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="registration-page">
                <div className="error-state">
                    <AlertCircle size={48} />
                    <h2>Event Not Found</h2>
                    <p>{error || 'The event you are looking for does not exist.'}</p>
                    <button onClick={() => navigate('/events')} className="btn btn-primary">
                        View All Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-page">
            {/* Header */}
            <div className="registration-header">
                <div className="container">
                    <Badge variant={isSolo ? 'cyan' : 'purple'} size="lg">
                        {isSolo ? <><User size={14} /> Solo Event</> : <><Users size={14} /> Team Event</>}
                    </Badge>
                    <h1 className="heading-display heading-2">{event.title}</h1>
                    <p className="event-description">{event.description}</p>

                    <div className="event-meta">
                        <div className="meta-item">
                            <span className="meta-label">Entry Fee</span>
                            <span className="meta-value">{event.fee === 0 ? 'Free' : `₹${event.fee}`}</span>
                        </div>
                        {!isSolo && (
                            <div className="meta-item">
                                <span className="meta-label">Team Size</span>
                                <span className="meta-value">
                                    {minSize === maxSize ? minSize : `${minSize} - ${maxSize}`} members
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Form */}
            <section className="registration-content section">
                <div className="container">
                    <form onSubmit={handleSubmit} className="registration-form">

                        {/* Team Name */}
                        <div className="form-section">
                            <h3 className="form-section-title">
                                {isSolo ? 'Participant Details' : 'Team Details'}
                            </h3>
                            <Input
                                label={isSolo ? 'Display Name / Alias' : 'Team Name'}
                                name="teamName"
                                value={formData.teamName}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, teamName: e.target.value }));
                                    setFormErrors(prev => ({ ...prev, teamName: null }));
                                }}
                                placeholder={isSolo ? 'Your name or alias for certificates' : 'e.g., Code Crushers'}
                                error={formErrors.teamName}
                                required
                            />
                        </div>

                        {/* Leader / First Participant */}
                        <div className="form-section">
                            <div className="participant-header">
                                <h3 className="form-section-title">
                                    {isSolo ? 'Your Information' : 'Team Leader'}
                                </h3>
                                <Badge variant="cyan" size="sm">Leader</Badge>
                            </div>
                            <div className="form-grid">
                                <Input
                                    label="Full Name"
                                    value={formData.participants[0].fullName}
                                    onChange={(e) => updateParticipant(0, 'fullName', e.target.value)}
                                    placeholder="Aayush Sharma"
                                    error={formErrors.participant_0_fullName}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.participants[0].email}
                                    onChange={(e) => updateParticipant(0, 'email', e.target.value)}
                                    placeholder="Example@iiitl.ac.in"
                                    error={formErrors.participant_0_email}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    value={formData.participants[0].phone}
                                    onChange={(e) => updateParticipant(0, 'phone', e.target.value)}
                                    placeholder="0000000000"
                                    error={formErrors.participant_0_phone}
                                    required
                                />
                                <Input
                                    label="College Name"
                                    value={formData.participants[0].college}
                                    onChange={(e) => updateParticipant(0, 'college', e.target.value)}
                                    placeholder="IIIT Lucknow"
                                    error={formErrors.participant_0_college}
                                    required
                                />
                            </div>
                        </div>

                        {/* Additional Team Members (only for team events) */}
                        {!isSolo && formData.participants.slice(1).map((participant, idx) => {
                            const realIndex = idx + 1;
                            return (
                                <div key={realIndex} className="form-section team-member-section">
                                    <div className="team-member-header">
                                        <h3 className="form-section-title">Member {realIndex + 1}</h3>
                                        <button
                                            type="button"
                                            className="remove-member-btn"
                                            onClick={() => removeParticipant(realIndex)}
                                        >
                                            <Minus size={16} />
                                            Remove
                                        </button>
                                    </div>
                                    <div className="form-grid">
                                        <Input
                                            label="Full Name"
                                            value={participant.fullName}
                                            onChange={(e) => updateParticipant(realIndex, 'fullName', e.target.value)}
                                            placeholder="Aayush Sharma"
                                            error={formErrors[`participant_${realIndex}_fullName`]}
                                            required
                                        />
                                        <Input
                                            label="Email"
                                            type="email"
                                            value={participant.email}
                                            onChange={(e) => updateParticipant(realIndex, 'email', e.target.value)}
                                            placeholder="Example@iiitl.ac.in"
                                            error={formErrors[`participant_${realIndex}_email`]}
                                            required
                                        />
                                        <Input
                                            label="Phone Number"
                                            type="tel"
                                            value={participant.phone}
                                            onChange={(e) => updateParticipant(realIndex, 'phone', e.target.value)}
                                            placeholder="0000000000"
                                            error={formErrors[`participant_${realIndex}_phone`]}
                                            required
                                        />
                                        <Input
                                            label="College Name"
                                            value={participant.college}
                                            onChange={(e) => updateParticipant(realIndex, 'college', e.target.value)}
                                            placeholder="IIIT Lucknow"
                                            error={formErrors[`participant_${realIndex}_college`]}
                                            required
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Member Button (team events only) */}
                        {!isSolo && formData.participants.length < maxSize && (
                            <button
                                type="button"
                                className="add-member-btn"
                                onClick={addParticipant}
                            >
                                <Plus size={18} />
                                Add Team Member ({formData.participants.length}/{maxSize})
                            </button>
                        )}

                        {/* Errors */}
                        {formErrors.teamSize && (
                            <div className="form-error">
                                <AlertCircle size={16} />
                                {formErrors.teamSize}
                            </div>
                        )}
                        {formErrors.duplicateEmail && (
                            <div className="form-error">
                                <AlertCircle size={16} />
                                {formErrors.duplicateEmail}
                            </div>
                        )}
                        {formErrors.submit && (
                            <div className="form-error">
                                <AlertCircle size={16} />
                                {formErrors.submit}
                            </div>
                        )}

                        {/* Summary */}
                        <div className="form-section registration-summary">
                            <h3 className="form-section-title">Registration Summary</h3>
                            <div className="summary-content">
                                <div className="summary-row">
                                    <span>Event</span>
                                    <span>{event.title}</span>
                                </div>
                                <div className="summary-row">
                                    <span>{isSolo ? 'Participant' : 'Team'}</span>
                                    <span>{formData.teamName || '—'}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Members</span>
                                    <span>{formData.participants.length}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>{event.fee === 0 ? 'Free' : `₹${event.fee}`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={submitting || formData.participants.length < minSize}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="spinner" size={18} />
                                    Processing...
                                </>
                            ) : event.fee === 0 ? (
                                <>
                                    <Check size={18} />
                                    Complete Registration
                                </>
                            ) : (
                                `Proceed to Payment • ₹${event.fee}`
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
