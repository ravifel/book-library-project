import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const navigate = useNavigate();

    // Estados para capturar email e senha digitados
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estado para mostrar erro, se necessário
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('http://localhost:5000/users', {
                params: {
                    email,
                    password
                }
            });

            if (response.data.length > 0) {
                const user = response.data[0];
                console.log('Usuário autenticado:', user);

                // ✅ Aqui salva no localStorage
                localStorage.setItem('user', JSON.stringify(user));

                // Redireciona para a página Home
                navigate('/home');
            } else {
                setError('Email ou senha inválidos.');
            }
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError('Erro no servidor. Tente novamente mais tarde.');
        }
    };


    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">E-mail</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Entrar</button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <a href="/forgot-password">Esqueceu a senha?</a>
                    <br />
                    <a href="/register">Criar uma conta</a>
                </div>
            </div>
        </div>
    );
};

export default Login;