import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import MainTitle from '../components/MainTitle';
import Pagination from '../components/Pagination';

const Category = () => {
    const { name } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
                setSearchTerm(""); // Clears search when changing categories
            })
            .catch(error => {
                console.error("Error fetching books:", error);
                setLoading(false);
            });
    }, [name]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

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
            `.toLowerCase();
            return searchableText.includes(term.toLowerCase());
        });
    };

    const filteredBooks = filterBooks(books, searchTerm);

    const totalItems = filteredBooks.length;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const booksToShow = filteredBooks.slice(startIdx, endIdx);

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
            <SearchBar onSearch={setSearchTerm} />
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