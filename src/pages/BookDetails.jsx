import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";

const StarRating = ({ rating = 0 }) => {
    // rating: float, 0 to 5
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
    const rounded = Math.round(rating * 2) / 2;
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rounded)) {
            stars.push(<i key={i} className="bi bi-star-fill" style={{ color: "#FFD700", fontSize: 22 }}></i>);
        } else if (i === Math.floor(rounded) && rounded % 1 !== 0) {
            stars.push(<i key={i} className="bi bi-star-half" style={{ color: "#FFD700", fontSize: 22 }}></i>);
        } else {
            stars.push(<i key={i} className="bi bi-star" style={{ color: "#FFD700", fontSize: 22 }}></i>);
        }
    }

    return (
        <span>
            {stars}
            <span style={{ marginLeft: 8, color: "var(--primary)", fontWeight: 500, fontSize: 18 }}>
                {rating.toFixed(1)}
            </span>
        </span>
    );
};

const BookDetails = () => {
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
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" style={{ color: "var(--primary)" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container py-5 text-center">
                <h4 style={{ color: "var(--primary)" }}>Book not found.</h4>
                <Link to="/home" className="btn btn-primary mt-3" style={{ background: "var(--primary)", border: "none" }}>Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="row shadow rounded-4 p-4"
                style={{
                    background: "var(--secondary)",
                    maxWidth: 1100,
                    width: "100%",
                    border: "1.5px solid var(--primary-card)",
                    boxShadow: "var(--box-shadow)"
                }}>
                {/* Book image */}
                <div className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0">
                    <img
                        src={book.coverImage}
                        alt={book.nameBook}
                        className="img-fluid shadow-sm rounded-3"
                        style={{
                            maxHeight: '420px',
                            objectFit: 'contain',
                            background: "var(--secondary-light)",
                            padding: "12px",
                            border: "1px solid var(--primary-card)"
                        }}
                    />
                </div>
                {/* Details */}
                <div className="col-md-8 d-flex flex-column justify-content-center">
                    <h2 className="mb-2" style={{ fontWeight: 700, color: "var(--primary)" }}>{book.nameBook}</h2>
                    <div className="mb-1">
                        <StarRating rating={book.stars || 0} />
                    </div>
                    <div className="mb-3">
                        <span className="badge me-1" style={{ background: "var(--primary-card)", color: "var(--primary)", fontWeight: 500 }}>
                            {book.category}
                        </span>
                        <span className="badge" style={{ background: "var(--primary-dark)", color: "#fff", fontWeight: 500 }}>
                            ID: {book.id}
                        </span>
                    </div>
                    <div className="mb-2"><strong style={{ color: "var(--primary)" }}>Author:</strong> {book.author}</div>
                    <div className="mb-2"><strong style={{ color: "var(--primary)" }}>Category:</strong> {book.category}</div>
                    <div className="mb-2" style={{ maxWidth: 600 }}>
                        <strong style={{ color: "var(--primary)" }}>Description:</strong>{" "}
                        <span style={{ color: "#34495e" }}>{book.description}</span>
                    </div>
                    <div className="mb-2" style={{ fontSize: 18 }}>
                        <strong style={{ color: "var(--primary)" }}>Price:</strong>{" "}
                        <span className="price-badge" style={{ color: "var(--primary)", fontWeight: 700, marginLeft: 4 }}>
                            ${book.price?.toFixed(2)}
                        </span>
                    </div>
                    <div className="mb-2"><strong style={{ color: "var(--primary)" }}>Publication Date:</strong> {new Date(book.publicationDate).toLocaleDateString()}</div>
                    <div className="mb-4"><strong style={{ color: "var(--primary)" }}>Number of Pages:</strong> {book.numberOfPages}</div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <button
                            className="btn"
                            style={{
                                background: isInCart(book.id) ? "var(--button-cart-bg)" : "var(--button-cart-bg)",
                                color: "var(--button-cart-text)",
                                border: "none",
                                fontWeight: 500
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "var(--button-cart-bg-hover)"}
                            onMouseOut={e => e.currentTarget.style.background = "var(--button-cart-bg)"}
                            onClick={() =>
                                addToCart({
                                    ...book,
                                    nameProduct: book.nameBook,
                                    price: book.price,
                                })
                            }
                            disabled={isInCart(book.id)}
                        >
                            <i className="bi bi-cart"></i>
                            {isInCart(book.id) ? " Added to Cart" : " Add to Cart"}
                        </button>
                        <button
                            className="btn"
                            style={{
                                background: isFavorite(book.id) ? "var(--button-fav-bg)" : "var(--button-fav-bg)",
                                color: "var(--button-fav-text)",
                                border: "none",
                                fontWeight: 500
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "var(--button-fav-bg-hover)"}
                            onMouseOut={e => e.currentTarget.style.background = "var(--button-fav-bg)"}
                            onClick={() => toggleFavorite(book)}
                        >
                            <i className={`bi ${isFavorite(book.id) ? "bi-heart-fill" : "bi-heart"}`}></i>
                            {isFavorite(book.id) ? " Remove Favorite" : " Favorite"}
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="btn"
                            style={{
                                background: "var(--primary)",
                                color: "var(--secondary)",
                                border: "none",
                                fontWeight: 500
                            }}
                        >
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                    </div>
                    <Link to="/home" className="btn btn-link p-0" style={{ color: "var(--primary)", fontWeight: 500 }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;