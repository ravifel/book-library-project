import React, { useState } from 'react';
import { useCart } from "../components/CartContext";
import SearchBar from '../components/SearchBar';

const Cart = () => {
    const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCart = cart.filter(product => {
        const searchableText = `
      ${product.nameProduct || product.nameBook}
      ${product.author}
      ${product.category}
    `.toLowerCase();
        return searchableText.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="container py-5">
            <h2 className="mb-3">Bag</h2>

            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
            />

            <div className="list-group">
                {filteredCart.length === 0 && (
                    <div className="text-center py-5">
                        <p>No products found{searchTerm ? ` for "${searchTerm}"` : '.'}</p>
                    </div>
                )}

                {filteredCart.map(product => (
                    <div key={product.id} className="list-group-item mb-3">
                        <div className="row align-items-center">
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
                                    Product code: <span className="text-muted">{product.code || product.id}</span>
                                </div>
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
                                    <button
                                        className="btn btn-link text-danger p-0 mt-1"
                                        onClick={() => removeFromCart(product.id)}
                                    >
                                        Remove
                                    </button>
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
    );
};

export default Cart;
