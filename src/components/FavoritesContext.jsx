import React, { createContext, useContext, useEffect, useState } from "react";

// Criação do contexto
const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const stored = localStorage.getItem("favorites");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    function toggleFavorite(book) {
        setFavorites((prev) =>
            prev.some((fav) => fav.id === book.id)
                ? prev.filter((fav) => fav.id !== book.id)
                : [...prev, book]
        );
    }

    function isFavorite(bookId) {
        return favorites.some((fav) => fav.id === bookId);
    }

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}