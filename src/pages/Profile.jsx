import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card p-4 w-100 shadow" style={{ maxWidth: '500px' }}>
                <h2 className="mb-4 text-center">Meu Perfil</h2>

                {user ? (
                    <>
                        <p><strong>👤 Nome:</strong> {user.name}</p>
                        <p><strong>📧 Email:</strong> {user.email}</p>
                    </>
                ) : (
                    <p>Carregando dados do usuário...</p>
                )}

                <div className="d-grid">
                    <button onClick={handleLogout} className="btn btn-danger mt-3">
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
