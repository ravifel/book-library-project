import React, { useState, useEffect } from 'react';
import { useFavorites } from "../components/FavoritesContext";
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import MainTitle from '../components/MainTitle';
import Pagination from '../components/Pagination';
import ProductSortFilter from '../components/ProductSortFilter';

const Favorites = () => {
    const { favorites } = useFavorites();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortOption, setSortOption] = useState("");

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage, sortOption]);

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
                ${book.stars}
            `.toLowerCase();
            return searchableText.includes(term.toLowerCase());
        });
    };

    // Sorting based on ProductSortFilter options
    const sortBooks = (books) => {
        const sorted = [...books];
        switch (sortOption) {
            case 'pagesAsc':
                return sorted.sort((a, b) => a.numberOfPages - b.numberOfPages);
            case 'pagesDesc':
                return sorted.sort((a, b) => b.numberOfPages - a.numberOfPages);
            case 'priceLowHigh':
                return sorted.sort((a, b) => a.price - b.price);
            case 'priceHighLow':
                return sorted.sort((a, b) => b.price - a.price);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.publicationDate) - new Date(b.publicationDate));
            case 'titleAZ':
                return sorted.sort((a, b) => (a.nameBook || '').localeCompare(b.nameBook || ''));
            case 'titleZA':
                return sorted.sort((a, b) => (b.nameBook || '').localeCompare(a.nameBook || ''));
            case 'bestRated':
                return sorted.sort((a, b) => b.stars - a.stars);
            case 'worstRated':
                return sorted.sort((a, b) => a.stars - b.stars);
            default:
                return sorted;
        }
    };

    const filteredFavorites = filterFavorites(favorites, searchTerm);
    const sortedFavorites = sortBooks(filteredFavorites);

    const totalItems = sortedFavorites.length;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const booksToShow = sortedFavorites.slice(startIdx, endIdx);

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

            {/* Search and Filter */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <SearchBar onSearch={setSearchTerm} />
                <ProductSortFilter sortOption={sortOption} onChange={setSortOption} />
            </div>

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
