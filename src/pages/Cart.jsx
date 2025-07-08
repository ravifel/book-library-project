import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../components/CartContext";

const Cart = () => {
    const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart, getCartCount } = useCart();
    const [cep, setCep] = useState('');
    const [cupom, setCupom] = useState('');

    // Calculate totals
    const totalItems = getCartCount();
    const totalPrice = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    const pixDiscount = 0.05; // Example: 5% discount for Pix
    const totalPix = (totalPrice * (1 - pixDiscount)).toFixed(2);

    return (
        <div className="container py-5">
            {/* Progress bar illustration */}
            <div className="mb-4">
                <div className="d-flex justify-content-center align-items-center gap-4">
                    <div className="text-center">
                        <div style={{
                            border: "2px solid var(--primary)",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)",
                            fontWeight: "bold",
                            margin: "0 auto"
                        }}>🛒</div>
                        <div>Shopping Cart</div>
                    </div>
                    <div style={{ width: "40px", height: "2px", background: "var(--secondary-dark)" }}></div>
                    <div className="text-center text-muted">
                        <div style={{
                            border: "2px solid var(--secondary-dark)",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>👤</div>
                        <div>Identification</div>
                    </div>
                    <div style={{ width: "40px", height: "2px", background: "var(--secondary-dark)" }}></div>
                    <div className="text-center text-muted">
                        <div style={{
                            border: "2px solid var(--secondary-dark)",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>🚚</div>
                        <div>Delivery</div>
                    </div>
                    <div style={{ width: "40px", height: "2px", background: "var(--secondary-dark)" }}></div>
                    <div className="text-center text-muted">
                        <div style={{
                            border: "2px solid var(--secondary-dark)",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>💳</div>
                        <div>Payment</div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Product list */}
                <div className="col-lg-8">
                    <h2 className="mb-3">Bag</h2>
                    <div className="list-group">
                        {cart.length === 0 && (
                            <div className="text-center py-5">
                                <p>Your bag is empty.</p>
                                <Link to="/home" className="btn btn-primary">View products</Link>
                            </div>
                        )}
                        {cart.map(product => (
                            <div key={product.id} className="list-group-item mb-3">
                                <div className="row align-items-center">
                                    <div className="col-md-2 text-center">
                                        <img src={product.coverImage} alt={product.nameProduct || product.nameBook} style={{ width: 70, height: 90, objectFit: "contain" }} />
                                    </div>
                                    <div className="col-md-5">
                                        <b>{product.nameProduct || product.nameBook}</b>
                                        <div style={{ fontSize: "0.93em" }}>Product code: <span className="text-muted">{product.code || product.id}</span></div>
                                        {product.seller && <div style={{ fontSize: "0.93em" }}>Sold by <b>{product.seller}</b></div>}
                                    </div>
                                    <div className="col-md-2">
                                        <select
                                            value={product.quantity}
                                            className="form-select"
                                            style={{ width: 70 }}
                                            onChange={e => {
                                                const qty = parseInt(e.target.value, 10);
                                                if (qty > product.quantity) addToCart(product);
                                                else decreaseQuantity(product.id);
                                            }}
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                        <div>
                                            <button className="btn btn-link text-danger p-0 mt-1" onClick={() => removeFromCart(product.id)}>Remove</button>
                                        </div>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <div><b>${(product.price * product.quantity).toFixed(2)}</b> with Pix</div>
                                        <div className="text-muted" style={{ fontSize: "0.93em" }}>
                                            or ${(product.price * product.quantity * 1.05).toFixed(2)} with credit card
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order summary */}
                <div className="col-lg-4">
                    <div className="card shadow-sm p-3 mb-4">
                        <div className="mb-2">
                            {/* Alterado para azul */}
                            <b>
                                Other <span style={{ color: "var(--primary)" }}>delivery</span> options on the next step.
                            </b>
                            <br />
                            <span style={{ fontSize: "0.95em" }}>Shipping to ZIP code</span>
                            <div className="d-flex gap-2 mt-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ZIP code"
                                    value={cep}
                                    onChange={e => setCep(e.target.value)}
                                    style={{ maxWidth: 120 }}
                                />
                                <button className="btn btn-outline-secondary">OK</button>
                                <button className="btn btn-link">I don't know my ZIP code</button>
                            </div>
                        </div>
                        <hr />
                        <div className="mb-3">
                            <button className="btn btn-primary btn-sm mb-2" style={{ fontWeight: 500 }}>
                                Have a coupon code?
                            </button>
                            <div className="d-flex gap-2">
                                <input type="text" className="form-control" placeholder="Insert" style={{ maxWidth: 120 }} value={cupom} onChange={e => setCupom(e.target.value)} />
                                <button className="btn btn-outline-primary">Apply</button>
                            </div>
                        </div>
                        <div style={{ fontSize: "1.05em" }}>
                            <div className="d-flex justify-content-between">
                                <span>Products ({totalItems} items)</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Total shipping</span>
                                <span>$0.00</span>
                            </div>
                            {/* Alterado para azul */}
                            <div className="mt-2 d-flex justify-content-between">
                                <b>Total:</b>
                                <b style={{ color: "var(--primary)", fontSize: "1.25em" }}>${totalPix} with Pix</b>
                            </div>
                            <div className="d-flex justify-content-end text-muted" style={{ fontSize: "0.98em" }}>
                                or ${totalPrice.toFixed(2)} with credit card
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <button className="btn btn-success btn-lg w-100" disabled={cart.length === 0}>Continue</button>
                            <div className="mt-2">
                                <button className="btn btn-link" onClick={clearCart} disabled={cart.length === 0}>Shop more products</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;