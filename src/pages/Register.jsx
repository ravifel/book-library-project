import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    // State for form fields, error and success messages
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Handle changes in form fields
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Check if user already exists with the provided email
            const check = await axios.get('http://localhost:5000/users', {
                params: { email: form.email }
            });
            if (check.data.length > 0) {
                setError('Email already registered.');
                return;
            }

            // Create a new user
            await axios.post('http://localhost:5000/users', form);

            setSuccess('Account created! Redirecting...');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError('Registration failed. Try again.');
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
                <h2 className="text-center mb-4" style={{ color: "var(--primary)", fontWeight: 'bold' }}>Create Account</h2>
                {/* Display error or success messages */}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    {/* Name field */}
                    <div className="mb-3">
                        <label className="form-label" style={{ color: "var(--primary)" }}>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            style={{
                                background: "var(--secondary-light)",
                                color: "var(--primary)",
                                border: "1.5px solid var(--secondary-dark)"
                            }}
                        />
                    </div>
                    {/* Email field */}
                    <div className="mb-3">
                        <label className="form-label" style={{ color: "var(--primary)" }}>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            style={{
                                background: "var(--secondary-light)",
                                color: "var(--primary)",
                                border: "1.5px solid var(--secondary-dark)"
                            }}
                        />
                    </div>
                    {/* Password field */}
                    <div className="mb-3">
                        <label className="form-label" style={{ color: "var(--primary)" }}>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
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
                            }}>
                            Create Account
                        </button>
                    </div>
                </form>
                {/* Link back to login */}
                <div className="text-center mt-3">
                    <Link to="/" style={{ color: "#2979ff", textDecoration: 'underline', fontSize: 15, display: "block" }}>
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;