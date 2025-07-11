import React, { useState } from 'react';
import { useCart } from "../components/CartContext";
import SearchBar from '../components/SearchBar';
import ProductCardCart from '../components/ProductCardCart';
import MainTitle from '../components/MainTitle';
import ProductSortFilter from '../components/ProductSortFilter';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const navigate = useNavigate();

    const filteredCart = cart.filter(product => {
        const searchableText = `
            ${product.nameProduct || product.nameBook}
            ${product.author}
            ${product.category}
        `.toLowerCase();
        return searchableText.includes(searchTerm.toLowerCase());
    });

    // Sorting based on price only
    const sortCart = (products) => {
        const sorted = [...products];
        if (sortOption === 'priceLowHigh') {
            return sorted.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'priceHighLow') {
            return sorted.sort((a, b) => b.price - a.price);
        }
        return sorted;
    };

    const sortedCart = sortCart(filteredCart);

    // Calculate total value of the cart
    const getTotal = (items) =>
        items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    // Filters available for the cart
    const cartSortOptions = [
        { value: 'priceLowHigh', label: 'Price: Low to High' },
        { value: 'priceHighLow', label: 'Price: High to Low' },
    ];

    return (
        <div className="container py-5">
            <MainTitle>Shopping cart 🛒</MainTitle>

            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <SearchBar onSearch={setSearchTerm} />
                <ProductSortFilter
                    sortOption={sortOption}
                    onChange={setSortOption}
                    options={cartSortOptions}
                />
            </div>

            <div className="list-group">
                {sortedCart.length === 0 && (
                    <div className="text-center py-5">
                        <p>No products found{searchTerm ? ` for "${searchTerm}"` : '.'}</p>
                    </div>
                )}

                {sortedCart.map(product => (
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

            {/* Total and Checkout Button */}
            {sortedCart.length > 0 && (
                <>
                    <div className="d-flex justify-content-end align-items-center mt-4">
                        <h5>
                            Total:&nbsp;
                            <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                                ${getTotal(sortedCart).toFixed(2)}
                            </span>
                        </h5>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        <button
                            className="btn btn-success"
                            onClick={() => navigate('/checkout')}
                            style={{ fontWeight: 600 }}
                        >
                            Prosseguir para Finalizar Pedido
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;