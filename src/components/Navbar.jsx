// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const categories = ["Aventura", "Ficção", "Autoajuda", "Clássicos", "Terror", "Romance"];

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

    const handleSelectCategory = (category) => {
        navigate(`/category/${category.toLowerCase()}`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <Link className="navbar-brand" to="/home">📚 Book Library</Link>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/home">Início</Link>
                    </li>

                    {/* Dropdown de categorias */}
                    <li className="nav-item dropdown">
                        <span
                            className="nav-link dropdown-toggle"
                            id="categoriesDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ cursor: 'pointer' }}
                        >
                            Categorias
                        </span>
                        <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                            {categories.map((category) => (
                                <li key={category}>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleSelectCategory(category)}
                                    >
                                        {category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/favorites">Favoritos</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile">Perfil</Link>
                    </li>
                </ul>

                {user && (
                    <div className="d-flex align-items-center gap-3">
                        <span className="navbar-text">👤 {user.name}</span>
                        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
