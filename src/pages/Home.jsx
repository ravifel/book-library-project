import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import MainTitle from '../components/MainTitle';
import Pagination from '../components/Pagination';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios.get('http://localhost:5000/books')
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  // Volta para página 1 ao mudar busca ou itemsPerPage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ color: "var(--primary)" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const filterBooks = (books, searchTerm) => {
    if (!searchTerm) return books;
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
      return searchableText.includes(searchTerm.toLowerCase());
    });
  };

  const filteredBooks = filterBooks(books, searchTerm);

  // Paginação
  const totalItems = filteredBooks.length;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const booksToShow = filteredBooks.slice(startIdx, endIdx);

  return (
    <div className="container py-5">
      <MainTitle>All Books</MainTitle>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <div className="row">
        {booksToShow.length === 0 && (
          <div className="text-center py-5">
            <p>No products found{searchTerm ? ` for "${searchTerm}"` : '.'}</p>
          </div>
        )}
        {booksToShow.map(book => (
          <div key={book.id} className="col-md-3 mb-4">
            <ProductCard product={book} />
          </div>
        ))}
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

export default Home;