import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import MainTitle from '../components/MainTitle';
import Pagination from '../components/Pagination';
import ProductSortFilter from '../components/ProductSortFilter';

const Category = () => {
    const { name } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortOption, setSortOption] = useState("");

    const categoryDisplayNames = {
        aventura: 'Adventure',
        ficcao: 'Fiction',
        autoajuda: 'Self-Help',
        classicos: 'Classics',
        terror: 'Horror',
        romance: 'Romance'
    };

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/books')
            .then(response => {
                const filtered = response.data.filter(book =>
                    book.category.toLowerCase() === name.toLowerCase()
                );
                setBooks(filtered);
                setLoading(false);
                setSearchTerm(""); // Clear search on category change
            })
            .catch(error => {
                console.error("Error fetching books:", error);
                setLoading(false);
            });
    }, [name]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage, sortOption]);

    const filterBooks = (books, term) => {
        if (!term) return books;
        return books.filter(book => {
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

    // Sorting function
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

    const filteredBooks = filterBooks(books, searchTerm);
    const sortedBooks = sortBooks(filteredBooks);

    const totalItems = sortedBooks.length;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const booksToShow = sortedBooks.slice(startIdx, endIdx);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" style={{ color: "var(--primary)" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <MainTitle>
                {(categoryDisplayNames[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())} 🕮
            </MainTitle>

            {/* Search bar + sort filter */}
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
                    <p className="text-center" style={{ color: "var(--primary)" }}>
                        No books found matching "{searchTerm}" in this category.
                    </p>
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

export default Category;
