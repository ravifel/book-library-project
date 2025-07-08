import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import ProductCard from '../components/ProductCard';

const Favorites = () => {
    const { favorites, isFavorite, toggleFavorite } = useFavorites();
    const { addToCart, isInCart } = useCart();

    const truncateDescription = (desc, length = 40) => {
        if (!desc) return "";
        return desc.length > length ? desc.slice(0, length) + "..." : desc;
    };

    if (favorites.length === 0) {
        return (
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <h2 className="mb-3" style={{ color: "var(--primary)", fontWeight: "bold" }}>📚 Favorites </h2>
                    <p className="text-muted">You haven't added any books to your favorites yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center" style={{ color: "var(--primary)", fontWeight: "bold" }}>📚 Favorites </h1>
            <div className="row">
                {favorites.map(book => (
                    <div key={book.id} className="col-md-3 mb-4">
                        <ProductCard product={book} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;