import React, { createContext, useContext, useEffect, useState } from "react";

// Cart context creation
const CartContext = createContext();

export function CartProvider({ children }) {
    // Initial state: tries to fetch the cart saved in localStorage
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    });

    // Every time the cart changes, save it to localStorage for persistence
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Adds a product to the cart (if it already exists, increases its quantity)
    function addToCart(product) {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    }

    // Completely removes a product from the cart
    function removeFromCart(productId) {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }

    // Decreases the quantity of a product in the cart (if it's 1, removes it)
    function decreaseQuantity(productId) {
        setCart(prevCart =>
            prevCart
                .map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    }

    // Clears the entire cart
    function clearCart() {
        setCart([]);
    }

    // Checks if a product is in the cart
    function isInCart(productId) {
        return cart.some(item => item.id === productId);
    }

    // Total quantity of items in the cart (sum of quantities)
    function getCartCount() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                decreaseQuantity,
                clearCart,
                isInCart,
                getCartCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Hook to use the cart in any component
export function useCart() {
    return useContext(CartContext);
}