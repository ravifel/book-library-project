import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import MainTitle from '../components/MainTitle';


const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg width='128' height='128' viewBox='0 0 128 128' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='64' cy='64' r='64' fill='%23eaeaea'/><circle cx='64' cy='52' r='28' fill='%23cccccc'/><ellipse cx='64' cy='100' rx='36' ry='20' fill='%23cccccc'/></svg>";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
    const fileInputRef = useRef(null);

    const { favorites } = useFavorites();
    const { cart } = useCart();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setAvatar(parsedUser.avatar || DEFAULT_AVATAR);
        }
    }, []);

    // Upload handler
    const handleAvatarChange = e => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                setAvatar(evt.target.result);
                // Update user in localStorage
                const updatedUser = { ...user, avatar: evt.target.result };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card p-4 w-100 shadow" style={{
                maxWidth: '420px',
                border: "1.5px solid var(--primary-card)",
                background: "var(--secondary)",
                boxShadow: "var(--box-shadow)",
                marginTop: "3.0rem"
            }}>
                <MainTitle>My Profile</MainTitle>
                {user ? (
                    <>
                        <div className="d-flex flex-column align-items-center mb-3">
                            <img
                                src={avatar}
                                alt="Profile"
                                style={{
                                    width: 108,
                                    height: 108,
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "3px solid var(--primary-card)",
                                    boxShadow: "0 2px 6px var(--primary-light)",
                                    background: "var(--secondary-light)",
                                    cursor: "pointer"
                                }}
                                onClick={handleAvatarClick}
                                title="Click to change profile photo"
                            />
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                            />
                            <button
                                className="btn btn-outline-primary btn-sm mt-2"
                                style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                                onClick={handleAvatarClick}
                            >
                                Change Photo
                            </button>
                        </div>
                        <p><strong style={{ color: "var(--primary)" }}>👤 Name:</strong> {user.name}</p>
                        <p><strong style={{ color: "var(--primary)" }}>📧 Email:</strong> {user.email}</p>
                        <p><strong style={{ color: "var(--primary)" }}>⭐ Favorites:</strong> {favorites.length}</p>
                        <p><strong style={{ color: "var(--primary)" }}>🛒 Cart Items:</strong> {cart.length}</p>
                    </>
                ) : (
                    <p>Loading user data...</p>
                )}

                <div className="d-grid">
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger mt-3"
                        style={{
                            background: "var(--danger)",
                            color: "var(--secondary)",
                            border: "none"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;