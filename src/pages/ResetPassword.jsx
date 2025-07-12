import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
    const query = useQuery();
    const email = query.get('email');
    const token = query.get('token');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Validate token
    const validToken = token && localStorage.getItem(`resetToken_${email}`) === token;

    const handleSubmit = e => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        if (password !== confirm) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (!validToken) {
            setError('Invalid or expired reset link.');
            setLoading(false);
            return;
        }

        // Simula atualização de senha no "banco" (localStorage)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(u => u.email === email);
        if (idx === -1) {
            setError('User not found.');
            setLoading(false);
            return;
        }
        users[idx].password = password;
        localStorage.setItem('users', JSON.stringify(users));

        // Invalida o token
        localStorage.removeItem(`resetToken_${email}`);

        setMessage('Password changed successfully! Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
        setLoading(false);
    };

    if (!email || !token) {
        return (
            <div className="container d-flex align-items-center justify-content-center vh-100 px-3">
                <div className="card p-4 w-100" style={{ maxWidth: '400px' }}>
                    <h2 className="text-center mb-4">Invalid reset link</h2>
                    <Link to="/">Back to login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100 px-3" style={{ background: "var(--primary-light)" }}>
            <div className="card p-4 shadow w-100"
                style={{
                    maxWidth: '400px',
                    border: "1.5px solid var(--primary-card)",
                    background: "var(--secondary)",
                    boxShadow: "var(--box-shadow)",
                }}>
                <h2 className="text-center mb-4" style={{ color: "var(--primary)", fontWeight: 'bold' }}>Reset your password</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: "var(--primary)" }}>New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                background: "var(--secondary-light)",
                                color: "var(--primary)",
                                border: "1.5px solid var(--secondary-dark)"
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: "var(--primary)" }}>Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm new password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            style={{
                                background: "var(--secondary-light)",
                                color: "var(--primary)",
                                border: "1.5px solid var(--secondary-dark)"
                            }}
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary"
                            style={{
                                background: "var(--primary)",
                                color: "var(--secondary)",
                                border: "none",
                                fontWeight: 500
                            }}
                            disabled={loading}>
                            {loading ? 'Saving...' : 'Change Password'}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-3">
                    <Link to="/" style={{ color: "#2979ff", textDecoration: 'underline', fontSize: 15, display: "block" }}>
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;