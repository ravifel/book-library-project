import React, { useState, useEffect } from 'react';
import { useFavorites } from "../components/FavoritesContext";
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import MainTitle from '../components/MainTitle';
import Pagination from '../components/Pagination';

const Favorites = () => {
    const { favorites } = useFavorites();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

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

    const totalItems = filteredFavorites.length;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const booksToShow = filteredFavorites.slice(startIdx, endIdx);

    if (favorites.length === 0) {
        return (
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <h2 className="mb-3" style={{ color: "var(--primary)", fontWeight: "bold" }}> Favorites ♡ </h2>
                    <p className="text-muted">You haven't added any books to your favorites yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <MainTitle> Favorites ♡ </MainTitle>
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={() => { }}
            />
            <div className="row">
                {booksToShow.length > 0 ? (
                    booksToShow.map(book => (
                        <div key={book.id} className="col-md-3 mb-4">
                            <ProductCard product={book} />
                        </div>
                    ))
                ) : (
                    <p className="text-center">No favorite books found for "{searchTerm}"</p>
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </div>
    );
};

export default Favorites;