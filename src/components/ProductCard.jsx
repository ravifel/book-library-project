import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from './FavoritesContext';
import { useCart } from './CartContext';

const ProductCard = ({ product }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { addToCart, isInCart } = useCart();

    const productName = product.nameProduct || product.nameBook;
    const productAuthor = product.author || product.seller || "Unknown";
    const productPrice = product.price?.toFixed(2);
    const productCategory = product.category || "Unknown";

    // Function to truncate the description
    const truncateDescription = (desc, length = 40) => {
        if (!desc) return "";
        return desc.length > length ? desc.slice(0, length) + "..." : desc;
    };

    const shortDescription = truncateDescription(product.description, 80); // 80 characters

    return (
        <div
            className="card shadow-sm h-100 d-flex flex-column justify-content-between"
            style={{
                background: "var(--secondary)",
                border: "1px solid var(--primary-card)",
                borderRadius: "10px"
            }}
        >
            {/* Image + Clickable Name */}
            <Link
                to={`/book/${product.id}`}
                className="text-decoration-none text-dark"
                style={{ padding: "12px" }}
            >
                <img
                    src={product.coverImage}
                    alt={productName}
                    className="card-img-top mb-3"
                    style={{
                        height: "260px",
                        objectFit: "contain",
                        background: "var(--secondary-light)",
                        border: "1px solid var(--primary-card)",
                        borderRadius: "8px",
                        padding: "6px"
                    }}
                />
                <h5 className="card-title fw-bold">{productName}</h5>
                <p
                    className="text-secondary mb-1"
                    style={{ fontSize: "0.85em", fontStyle: "italic" }}
                >
                    {productCategory}
                </p>
                <p className="text-muted" style={{ fontSize: "0.85em", minHeight: '48px' }}>
                    {shortDescription}
                </p>
            </Link>
            <div className="px-3">
                <p className="text-muted mb-1" style={{ fontSize: "0.95em" }}>{productAuthor}</p>
                <div style={{ fontWeight: 600, color: "var(--primary)" }}>${productPrice}</div>
            </div>
            <div className="d-flex justify-content-between align-items-center px-3 pb-3 mt-3">
                <button
                    className="btn btn-sm"
                    style={{
                        background: "var(--button-cart-bg)",
                        color: "var(--button-cart-text)",
                        border: "none",
                        fontWeight: 500
                    }}
                    onClick={() =>
                        addToCart({
                            ...product,
                            nameProduct: productName,
                            price: product.price
                        })
                    }
                    disabled={isInCart(product.id)}
                >
                    <i className="bi bi-cart"></i> {isInCart(product.id) ? "Added" : "Add"}
                </button>

                <button
                    className="btn btn-sm"
                    style={{
                        background: "var(--button-fav-bg)",
                        color: "var(--button-fav-text)",
                        border: "none",
                        fontWeight: 500
                    }}
                    onClick={() => toggleFavorite(product)}
                >
                    <i className={`bi ${isFavorite(product.id) ? "bi-heart-fill" : "bi-heart"}`}></i>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
