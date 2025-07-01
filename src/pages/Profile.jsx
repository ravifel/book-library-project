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
        <div className="container mt-5">
            <h2>Meu Perfil</h2>

            {user ? (
                <>
                    <p><strong>Nome:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </>
            ) : (
                <p>Carregando dados do usuário...</p>
            )}

            <button onClick={handleLogout} className="btn btn-danger mt-3">
                Sair
            </button>
        </div>
    );
};

export default Profile;
