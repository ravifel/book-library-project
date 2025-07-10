import React, { useState } from 'react';
import { useCart } from "../components/CartContext";
import SearchBar from '../components/SearchBar';
import ProductCardCart from '../components/ProductCardCart';
import MainTitle from '../components/MainTitle';

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
            <MainTitle>Shopping cart 🛒</MainTitle>

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
                    <ProductCardCart
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        decreaseQuantity={decreaseQuantity}
                        removeFromCart={removeFromCart}
                        maxQuantity={50}
                    />
                ))}
            </div>
        </div>
    );
};

export default Cart;