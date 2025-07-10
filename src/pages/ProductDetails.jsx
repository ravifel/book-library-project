import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import StarRating from "../components/StarRating";


const ProductDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { addToCart, isInCart } = useCart();

    useEffect(() => {
        axios.get(`http://localhost:5000/books/${id}`)
            .then(response => {
                setBook(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching book details:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
                <div className="spinner-border" style={{ color: "var(--primary)" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
                <h4 style={{ color: "var(--primary)" }}>Book not found.</h4>
                <Link to="/home" className="btn btn-primary mt-3" style={{ background: "var(--primary)", border: "none" }}>Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="container py-4 py-md-5">
            <div className="row g-4 g-lg-5">
                {/* Image column */}
                <div className="col-lg-5 d-flex justify-content-center align-items-start">
                    <div className="position-sticky" style={{ top: '80px' }}>
                        <img
                            src={book.coverImage}
                            alt={book.nameBook}
                            className="img-fluid rounded-3 shadow-sm"
                            style={{
                                maxHeight: '500px',
                                border: "1px solid var(--primary-card)"
                            }}
                        />
                    </div>
                </div>

                {/* Details and actions column */}
                <div className="col-lg-7">
                    <div className="d-flex flex-column">

                        <div className="mb-2">
                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Author: {book.author}</span>
                            <span className="mx-2">|</span>
                            <Link to={`/category/${book.category?.toLowerCase()}`} className="text-decoration-none" style={{ color: "var(--primary)", fontSize: '0.9rem' }}>
                                {book.category}
                            </Link>
                        </div>

                        <h1 className="mb-2" style={{ fontWeight: 700, color: "var(--primary)", fontSize: '2.2rem' }}>{book.nameBook}</h1>

                        {/* Actions block: stars, favorite, cart */}
                        <div className="mb-3" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <StarRating rating={book.stars || 0} size={20} />

                            {/* Favorite button */}
                            <button
                                className="btn btn-favorite"
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    marginLeft: "10px",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                                onClick={() => toggleFavorite(book)}
                                aria-label={isFavorite(book.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                                {isFavorite(book.id) ? (
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="#FF3333" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 21.35l-1.45-1.32C5.2 15.36 2 12.28 2 8.5 2 5.42 
          4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3
          19.58 3 22 5.42 22 8.5c0 3.78-3.2 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                ) : (
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FF3333" strokeWidth="2.2" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 21.35l-1.45-1.32C5.2 15.36 2 12.28 2 8.5 2 5.42 
          4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3
          19.58 3 22 5.42 22 8.5c0 3.78-3.2 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                )}
                            </button>

                            {/* Cart button next to favorite */}
                            <button
                                className="btn btn-cart"
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    marginLeft: "2px",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                                onClick={() => addToCart({ ...book, nameProduct: book.nameBook, price: book.price })}
                                aria-label={isInCart(book.id) ? "Already in cart" : "Add to cart"}
                                disabled={isInCart(book.id)}
                            >
                                {isInCart(book.id) ? (
                                    <i className="bi bi-cart-check-fill" style={{ fontSize: 30, color: "#43a047" }}></i>
                                ) : (
                                    <i className="bi bi-cart-plus" style={{ fontSize: 30, color: "#2979ff" }}></i>
                                )}
                            </button>
                        </div>

                        <div className="price-section my-3">
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: "var(--primary)" }}>
                                ${book.price?.toFixed(2)}
                            </span>
                        </div>

                        <div className="shipping-info mb-4 p-3 rounded-3" style={{ background: 'var(--secondary-light)', border: '1px solid var(--primary-card)' }}>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-truck me-2" style={{ color: 'var(--green)', fontSize: '1.5rem' }}></i>
                                <div>
                                    <span style={{ color: 'var(--green)', fontWeight: 500 }}>Free Shipping</span>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>Receive quickly at your address.</p>
                                </div>
                            </div>
                        </div>

                        <div className="description mt-3">
                            <h5 style={{ color: "var(--primary)", fontWeight: 600 }}>Description</h5>
                            <p style={{ color: "#34495e", lineHeight: 1.6 }}>{book.description}</p>
                        </div>

                        <div className="more-details mt-3">
                            <h5 style={{ color: "var(--primary)", fontWeight: 600 }}>Product Details</h5>
                            <ul className="list-unstyled text-muted">
                                <li><strong>ID:</strong> {book.id}</li>
                                <li><strong>Publication Date:</strong> {new Date(book.publicationDate).toLocaleDateString()}</li>
                                <li><strong>Number of Pages:</strong> {book.numberOfPages}</li>
                            </ul>
                        </div>

                        <div className="mt-4">
                            <Link to="/home" className="text-decoration-none" style={{ color: "var(--primary)", fontWeight: 500 }}>
                                <i className="bi bi-arrow-left"></i> Back to store
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;