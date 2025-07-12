import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import MainTitle from '../components/MainTitle';
import axios from 'axios';
import InformationEditingModal from '../components/InformationEditingModal';
import ActionConfirmModal from '../components/ActionConfirmModal';

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg width='128' height='128' viewBox='0 0 128 128' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='64' cy='64' r='64' fill='%23eaeaea'/><circle cx='64' cy='52' r='28' fill='%23cccccc'/><ellipse cx='64' cy='100' rx='36' ry='20' fill='%23cccccc'/></svg>";

const emptyAddress = {
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
};

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
    const [userDbData, setUserDbData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const fileInputRef = useRef(null);

    // State for the profile edit form
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        cpf: '',
        address: emptyAddress,
        deliveryInstructions: '',
    });

    const { favorites } = useFavorites();
    const { cart } = useCart();

    useEffect(() => {
        // Load user data from localStorage and fetch full data from backend
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setAvatar(parsedUser.avatar || DEFAULT_AVATAR);

            // Fetch user from backend by email
            axios
                .get(`http://localhost:5000/users?email=${parsedUser.email}`)
                .then(res => {
                    setUserDbData(res.data[0]);
                    // Populate the edit form with backend data
                    setEditForm({
                        name: res.data[0].name || '',
                        phone: res.data[0].phone || '',
                        cpf: res.data[0].cpf || '',
                        address: typeof res.data[0].address === "object" ? res.data[0].address : emptyAddress,
                        deliveryInstructions: res.data[0].deliveryInstructions || '',
                    });
                })
                .catch(() => setUserDbData(null));
        }
    }, []);

    // Handles avatar upload/change
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
                // Optionally update avatar in backend/db.json
                if (userDbData && userDbData.id) {
                    axios.patch(`http://localhost:5000/users/${userDbData.id}`, {
                        avatar: evt.target.result
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Triggers file input for avatar
    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    // Handles logout and navigation with confirmation
    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('user');
        setShowLogoutModal(false);
        navigate('/');
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    // Helper to render address if available
    const renderAddress = (address) => {
        if (!address) return <span className="text-muted">Not provided</span>;
        if (typeof address === "string") return <span>{address}</span>;
        return (
            <>
                <div>{address.street}, {address.number}</div>
                <div>{address.neighborhood}</div>
                <div>{address.city} - {address.state}, {address.zipCode}</div>
            </>
        );
    };

    // Modal handlers
    const handleEditButton = () => setShowEditModal(true);
    const handleCloseModal = () => setShowEditModal(false);

    // Handles any input change in the edit form
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const key = name.split('.')[1];
            setEditForm(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [key]: value
                }
            }));
        } else {
            setEditForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handles edit form submission
    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update user data in backend/db.json
            await axios.patch(`http://localhost:5000/users/${userDbData.id}`, {
                name: editForm.name,
                phone: editForm.phone,
                // cpf field is intentionally NOT updated to prevent changes
                address: editForm.address,
                deliveryInstructions: editForm.deliveryInstructions,
            });
            // Update local state
            setUserDbData(prev => ({
                ...prev,
                name: editForm.name,
                phone: editForm.phone,
                // cpf stays the same
                address: editForm.address,
                deliveryInstructions: editForm.deliveryInstructions,
            }));
            // Update localStorage as well (if needed for the app)
            localStorage.setItem('user', JSON.stringify({
                ...user,
                name: editForm.name
            }));
            setShowEditModal(false);
        } catch {
            alert("Failed to update your profile.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card p-4 w-100 shadow" style={{
                maxWidth: '480px',
                border: "1.5px solid var(--primary-card)",
                background: "var(--secondary)",
                boxShadow: "var(--box-shadow)",
                marginTop: "3.0rem"
            }}>
                <MainTitle>My Profile</MainTitle>
                {user && userDbData ? (
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
                        <div className="mb-2">
                            <strong style={{ color: "var(--primary)" }}>👤 Name:</strong> {userDbData.name}
                        </div>
                        <div className="mb-2">
                            <strong style={{ color: "var(--primary)" }}>📧 Email:</strong> {userDbData.email}
                        </div>
                        <div className="mb-2">
                            <strong style={{ color: "var(--primary)" }}>📱 Phone:</strong> {userDbData.phone || <span className="text-muted">Not provided</span>}
                        </div>
                        <div className="mb-2">
                            <strong style={{ color: "var(--primary)" }}>🆔 CPF:</strong> {userDbData.cpf || <span className="text-muted">Not provided</span>}
                        </div>
                        <div className="mb-2">
                            <strong style={{ color: "var(--primary)" }}>🏠 Address:</strong>
                            <div style={{ marginLeft: "1.5rem" }}>{renderAddress(userDbData.address)}</div>
                        </div>
                        <div className="mb-2">
                            <strong style={{ color: "var(--primary)" }}>📝 Delivery Instructions:</strong> {userDbData.deliveryInstructions || <span className="text-muted">Not provided</span>}
                        </div>
                        <div className="mb-2">
                            <strong style={{ color: "var(--primary)" }}>⭐ Favorites:</strong> {favorites.length}
                        </div>
                        <div className="mb-2">
                            <strong style={{ color: "var(--primary)" }}>🛒 Cart Items:</strong> {cart.length}
                        </div>
                        <div className="d-grid mb-2">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleEditButton}
                            >
                                Edit profile information
                            </button>
                        </div>
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

            {/* Edit modal using the InformationEditingModal component */}
            <InformationEditingModal
                show={showEditModal}
                onClose={handleCloseModal}
                title="Edit Profile"
            >
                <form onSubmit={handleEditFormSubmit}>
                    <div className="mb-2">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditFormChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">CPF</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cpf"
                            value={editForm.cpf}
                            disabled // CPF is shown but not editable
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-control mb-1"
                            name="address.street"
                            placeholder="Street"
                            value={editForm.address.street}
                            onChange={handleEditFormChange}
                        />
                        <input
                            type="text"
                            className="form-control mb-1"
                            name="address.number"
                            placeholder="Number"
                            value={editForm.address.number}
                            onChange={handleEditFormChange}
                        />
                        <input
                            type="text"
                            className="form-control mb-1"
                            name="address.neighborhood"
                            placeholder="Neighborhood"
                            value={editForm.address.neighborhood}
                            onChange={handleEditFormChange}
                        />
                        <input
                            type="text"
                            className="form-control mb-1"
                            name="address.city"
                            placeholder="City"
                            value={editForm.address.city}
                            onChange={handleEditFormChange}
                        />
                        <input
                            type="text"
                            className="form-control mb-1"
                            name="address.state"
                            placeholder="State"
                            value={editForm.address.state}
                            onChange={handleEditFormChange}
                        />
                        <input
                            type="text"
                            className="form-control"
                            name="address.zipCode"
                            placeholder="Zip Code"
                            value={editForm.address.zipCode}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Delivery Instructions</label>
                        <textarea
                            className="form-control"
                            name="deliveryInstructions"
                            rows={2}
                            value={editForm.deliveryInstructions}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="modal-footer p-0 pt-3">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary ms-2">
                            Save
                        </button>
                    </div>
                </form>
            </InformationEditingModal>

            {/* Logout confirmation modal componentized */}
            <ActionConfirmModal
                show={showLogoutModal}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                confirmLabel="Logout"
                cancelLabel="Cancel"
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
            />
        </div>
    );
};

export default Profile;