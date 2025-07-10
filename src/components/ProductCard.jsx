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
            className="card shadow-sm h-100 d-flex flex-column justify-content-between product-card"
            tabIndex={-1}
            style={{
                background: "var(--secondary)",
                border: "1px solid var(--primary-card)",
                borderRadius: "10px",
                transition: "box-shadow 0.2s, border-color 0.2s, background 0.2s",
            }}
        >
            <Link
                to={`/product/${product.id}`}
                className="text-decoration-none text-dark product-card-link d-flex flex-column flex-grow-1"
                style={{ padding: "12px", minHeight: 0, flex: 1 }}
                tabIndex={0}
                aria-label={`Ver detalhes de ${productName}`}
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
                <p className="text-muted mb-1" style={{ fontSize: "0.95em" }}>{productAuthor}</p>
                <div style={{ fontWeight: 600, color: "var(--primary)" }}>${productPrice}</div>
            </Link>
            <div className="card-footer d-flex p-0 product-card-footer">
                <button
                    className="btn btn-sm w-50 m-0 rounded-0 border-0 border-end product-card-cart-btn"
                    style={{
                        background: "var(--button-cart-bg)",
                        color: "var(--button-cart-text)",
                        fontWeight: 500,
                        borderRight: "1.5px solid var(--secondary-dark)",
                        borderBottomLeftRadius: "10px"
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
                    className="btn btn-sm w-50 m-0 rounded-0 border-0 product-card-fav-btn"
                    style={{
                        background: "var(--button-fav-bg)",
                        color: "var(--button-fav-text)",
                        fontWeight: 500,
                        borderBottomRightRadius: "10px"
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