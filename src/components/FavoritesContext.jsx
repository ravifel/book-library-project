import React, { createContext, useContext, useEffect, useState } from "react";

// Favorites context creation
const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    // Initial state: tries to fetch the favorites saved in localStorage
    const [favorites, setFavorites] = useState(() => {
        const stored = localStorage.getItem("favorites");
        return stored ? JSON.parse(stored) : [];
    });

    // Every time the favorites change, save them to localStorage for persistence
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // Always saves the complete book object
    function toggleFavorite(book) {
        setFavorites((prev) => {
            const alreadyFavorite = prev.some((fav) => fav.id === book.id);
            if (alreadyFavorite) {
                // Removes from favorites
                return prev.filter((fav) => fav.id !== book.id);
            } else {
                // Adds the complete object, replacing any older one (to guarantee all fields are present)
                // If there is already an incomplete favorite, it will be overwritten by the new complete one
                const filtered = prev.filter((fav) => fav.id !== book.id);
                return [...filtered, { ...book }];
            }
        });
    }

    function isFavorite(bookId) {
        return favorites.some((fav) => fav.id === bookId);
    }

    function clearFavorites() {
        setFavorites([]);
        localStorage.removeItem("favorites");
    }

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}