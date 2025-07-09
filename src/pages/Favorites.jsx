import React, { useState } from 'react';
import { useFavorites } from "../components/FavoritesContext";
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const Favorites = () => {
    const { favorites } = useFavorites();
    const [searchTerm, setSearchTerm] = useState("");

    // Function to filter favorites according to the term entered
    const filterFavorites = (favorites, term) => {
        if (!term) return favorites;

        return favorites.filter(book => {
            const searchableText = `
                ${book.nameBook}
                ${book.category}
                ${book.author}
                ${book.description}
                ${book.publicationDate}
                ${book.numberOfPages}
                ${book.price}
            `.toLowerCase();

            return searchableText.includes(term.toLowerCase());
        });
    };

    const filteredFavorites = filterFavorites(favorites, searchTerm);

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
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={() => { }}
            />
            <div className="row">
                {filteredFavorites.length > 0 ? (
                    filteredFavorites.map(book => (
                        <div key={book.id} className="col-md-3 mb-4">
                            <ProductCard product={book} />
                        </div>
                    ))
                ) : (
                    <p className="text-center">No favorite books found for "{searchTerm}"</p>
                )}
            </div>
        </div>
    );
};

export default Favorites;
