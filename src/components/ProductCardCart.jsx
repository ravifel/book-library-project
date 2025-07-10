import React from "react";
import QuantitySelector from "./QuantitySelector";

const ProductCardCart = ({
    product,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    maxQuantity = 10,
}) => {
    // Functions for integration with QuantitySelector
    const handleDecrease = () => {
        if (product.quantity > 1) {
            decreaseQuantity(product.id);
        }
    };

    const handleIncrease = () => {
        if (product.quantity < maxQuantity) {
            addToCart(product);
        }
    };

    const handleChange = (qty) => {
        // Adjust to the correct quantity
        // If it's larger, call addToCart until it matches
        // If it's smaller, call decreaseQuantity until it matches
        const diff = qty - product.quantity;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) addToCart(product);
        } else if (diff < 0) {
            for (let i = 0; i < Math.abs(diff); i++) decreaseQuantity(product.id);
        }
    };

    return (
        <div className="list-group-item mb-3 product-cart-card">
            <div className="row align-items-center position-relative">
                <div className="col-md-2 text-center">
                    <img
                        src={product.coverImage}
                        alt={product.nameProduct || product.nameBook}
                        style={{ width: 70, height: 90, objectFit: "contain" }}
                    />
                </div>

                <div className="col-md-5">
                    <b>{product.nameProduct || product.nameBook}</b>
                    <div style={{ fontSize: "0.93em" }}>
                        Product code:{" "}
                        <span className="text-muted">
                            {product.code || product.id}
                        </span>
                    </div>
                </div>

                {/* Quantity selector + trash can button */}
                <div className="col-md-2 d-flex flex-column align-items-center position-relative">
                    <div className="quantity-selector">
                        <QuantitySelector
                            value={product.quantity}
                            onDecrease={handleDecrease}
                            onIncrease={handleIncrease}
                            onChange={handleChange}
                            min={1}
                            max={maxQuantity}
                        />
                    </div>
                    {/* Trash button - always rendered, positioned via CSS */}
                    <button
                        className="btn p-0 mt-2 trash-btn"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#e53935"
                        }}
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove item"
                        title="Remove item"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="6" width="18" height="15" rx="2" fill="#fff" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="1" y1="6" x2="23" y2="6" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                    </button>
                </div>

                <div className="col-md-3 text-end">
                    <div>
                        <b>${(product.price * product.quantity).toFixed(2)}</b> with Pix
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.93em" }}>
                        or ${(product.price * product.quantity * 1.05).toFixed(2)} with credit card
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardCart;