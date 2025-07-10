import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../components/CartContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    const categories = ["Adventure", "Fiction", "Self-Help", "Classics", "Horror", "Romance"];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        closeMobileMenu();
        navigate('/');
    };

    const handleSelectCategory = (category) => {
        navigate(`/category/${category.toLowerCase()}`);
        closeMobileMenu();
    };

    // Closes the sandwich menu on small screens after clicking an option
    const closeMobileMenu = () => {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarToggler && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-solid-bg py-0">
            <div className="container-fluid px-4 d-flex align-items-center" style={{ minHeight: 64, height: 64 }}>
                <Link
                    className="navbar-brand d-flex align-items-center"
                    to="/home"
                    style={{
                        fontWeight: 700,
                        fontSize: "1.35rem",
                        letterSpacing: "1px",
                        height: "100%",
                        paddingTop: 0,
                        paddingBottom: 0,
                        color: "var(--primary)"
                    }}
                    onClick={closeMobileMenu}
                >
                    📘Bookfy
                </Link>
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
                    <ul className="navbar-nav me-auto mb-0 d-flex align-items-center" style={{ height: "100%" }}>
                        <li className="nav-item d-flex align-items-center">
                            <Link
                                className="nav-link px-3"
                                to="/home"
                                style={{
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    height: 64,
                                    display: "flex",
                                    alignItems: "center",
                                    color: "var(--primary)"
                                }}
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item dropdown d-flex align-items-center position-relative">
                            <span
                                className="nav-link dropdown-toggle px-3"
                                id="categoriesDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{
                                    cursor: 'pointer',
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    height: 64,
                                    display: "flex",
                                    alignItems: "center",
                                    color: "var(--primary)"
                                }}
                            >
                                Categories
                            </span>
                            <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                                {categories.map((category) => (
                                    <li key={category}>
                                        <button
                                            className="dropdown-item"
                                            style={{
                                                fontWeight: 500,
                                                color: "var(--primary)"
                                            }}
                                            onClick={() => handleSelectCategory(category)}
                                        >
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="nav-item d-flex align-items-center">
                            <Link
                                className="nav-link px-3"
                                to="/favorites"
                                style={{
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    height: 64,
                                    display: "flex",
                                    alignItems: "center",
                                    color: "var(--primary)"
                                }}
                                onClick={closeMobileMenu}
                            >
                                Favorites
                            </Link>
                        </li>
                        {/* Cart */}
                        <li className="nav-item d-flex align-items-center position-relative">
                            <Link
                                className="nav-link px-3 d-flex align-items-center"
                                to="/cart"
                                style={{
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    height: 64,
                                    display: "flex",
                                    alignItems: "center",
                                    color: "var(--primary)"
                                }}
                                onClick={closeMobileMenu}
                            >
                                <span style={{ position: "relative", display: "inline-block" }}>
                                    <i className="bi bi-cart" style={{ fontSize: "1.5em" }}></i>
                                    {cartCount > 0 && (
                                        <span className="cart-badge">{cartCount}</span>
                                    )}
                                </span>
                            </Link>
                        </li>
                    </ul>

                    {user && (
                        <div className="d-flex align-items-center gap-3">
                            <Link
                                className="nav-link d-flex align-items-center"
                                to="/profile"
                                style={{ height: 64, color: "var(--primary)" }}
                                onClick={closeMobileMenu}
                            >
                                <span className="navbar-text">👤 {user.name}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-danger btn-sm"
                                style={{
                                    borderColor: "var(--red)",
                                    color: "var(--red)",
                                    background: "var(--white)"
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;