import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const categories = ["Adventure", "Fiction", "Self-Help", "Classics", "Horror", "Romance"];

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

            {/* Botão para abrir o menu em telas pequenas */}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
                    <div className="d-flex align-items-center gap-3 mt-2 mt-lg-0">
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
