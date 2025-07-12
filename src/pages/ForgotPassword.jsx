import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import emailjs from '@emailjs/browser';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
    // State variables for form, feedback, and loading
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handles form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // Simulate user lookup from "database" (localStorage)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);

            if (!user) {
                setError('No account found with this email.');
                setLoading(false);
                return;
            }

            // Generate a token and store it in localStorage
            const token = uuidv4();
            localStorage.setItem(`resetToken_${email}`, token);

            // Build the password reset link
            const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

            // Send email using EmailJS
            await emailjs.send(
                'service_83rdkmi',         // Service ID
                'template_03flhi8',        // Template ID
                {
                    email: email,          // must match {{email}} in the template
                    link: resetLink        // must match {{link}} in the template
                },
                'user_BDnZHtbBaliCgdX54MFVA' // Public Key
            );

            setMessage('Check your email for instructions to reset your password!');
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setError('Failed to send email. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100 px-3" style={{ background: "var(--primary-light)" }}>
            <div className="card p-4 shadow w-100"
                style={{
                    maxWidth: '400px',
                    border: "1.5px solid var(--primary-card)",
                    background: "var(--secondary)",
                    boxShadow: "var(--box-shadow)",
                }}>
                <h2 className="text-center mb-4" style={{ color: "var(--primary)", fontWeight: 'bold' }}>Forgot your password?</h2>
                {/* Feedback messages */}
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}
                <form onSubmit={handleSubmit}>
                    {/* Email input */}
                    <div className="mb-3">
                        <label className="form-label" style={{ color: "var(--primary)" }}>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            style={{
                                background: "var(--secondary-light)",
                                color: "var(--primary)",
                                border: "1.5px solid var(--secondary-dark)"
                            }}
                        />
                    </div>
                    {/* Submit button */}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary"
                            style={{
                                background: "var(--primary)",
                                color: "var(--secondary)",
                                border: "none",
                                fontWeight: 500
                            }}
                            disabled={loading}>
                            {loading ? 'Sending...' : 'Send Recovery Link'}
                        </button>
                    </div>
                </form>
                {/* Link to return to login */}
                <div className="text-center mt-3">
                    <Link to="/" style={{ color: "#2979ff", textDecoration: 'underline', fontSize: 15, display: "block" }}>
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;