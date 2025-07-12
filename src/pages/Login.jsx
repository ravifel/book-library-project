import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('http://localhost:5000/users', {
                params: { email, password }
            });

            if (response.data.length > 0) {
                const user = response.data[0];
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/home');
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error. Please try again later.');
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
                <h2 className="text-center mb-4" style={{ color: "var(--primary)", fontWeight: 'bold' }}>Login</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: "var(--primary)" }}>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            style={{
                                background: "var(--secondary-light)",
                                color: "var(--primary)",
                                border: "1.5px solid var(--secondary-dark)"
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" style={{ color: "var(--primary)" }}>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            style={{
                                background: "var(--secondary-light)",
                                color: "var(--primary)",
                                border: "1.5px solid var(--secondary-dark)"
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary"
                            style={{
                                background: "var(--primary)",
                                color: "var(--secondary)",
                                border: "none",
                                fontWeight: 500
                            }}>
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <Link to="/forgot-password"
                        style={{
                            color: "#2979ff",
                            textDecoration: 'underline',
                            fontSize: 15,
                            display: "block"
                        }}>
                        Forgot your password?
                    </Link>
                    <Link to="/register"
                        style={{
                            color: "#2979ff",
                            textDecoration: 'underline',
                            fontSize: 15,
                            display: "block"
                        }}>
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;