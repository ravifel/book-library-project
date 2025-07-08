import React, { createContext, useContext, useEffect, useState } from "react";

// Criação do contexto do carrinho
const CartContext = createContext();

export function CartProvider({ children }) {
    // Estado inicial: tenta buscar o carrinho salvo no localStorage
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    });

    // Sempre que o carrinho mudar, salva no localStorage para persistência
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Adiciona um produto ao carrinho (se já existir, aumenta a quantidade)
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

    // Remove um produto do carrinho completamente
    function removeFromCart(productId) {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }

    // Diminui a quantidade de um produto no carrinho (se for 1, remove)
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

    // Limpa todo o carrinho
    function clearCart() {
        setCart([]);
    }

    // Verifica se um produto está no carrinho
    function isInCart(productId) {
        return cart.some(item => item.id === productId);
    }

    // Quantidade total de itens no carrinho (soma das quantidades)
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

// Hook para usar o carrinho em qualquer componente
export function useCart() {
    return useContext(CartContext);
}