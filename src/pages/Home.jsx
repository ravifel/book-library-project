import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import ProductSortFilter from '../components/ProductSortFilter';
import MainTitle from '../components/MainTitle';
import Pagination from '../components/Pagination';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
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

  // Return to page 1 when changing search, filter or items per page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption, itemsPerPage]);

  const filterBooks = (books, term) => {
    if (!term) return books;
    return books.filter(book => {
      const text = `
        ${book.nameBook}
        ${book.category}
        ${book.author}
        ${book.description}
        ${book.publicationDate}
        ${book.numberOfPages}
        ${book.price}
      `.toLowerCase();
      return text.includes(term.toLowerCase());
    });
  };

  const sortBooks = (books, option) => {
    if (!option) return books;

    const sorted = [...books];

    const getTitle = (book) => (book.nameBook || book.nameProduct || "").toLowerCase();
    const getPages = (book) => Number(book.numberOfPages) || 0;
    const getPrice = (book) => Number(book.price) || 0;
    const getDate = (book) => new Date(book.publicationDate || "1900-01-01");
    const getRating = (book) => Number(book.stars) || 0;

    switch (option) {
      case "pagesAsc":
        return sorted.sort((a, b) => getPages(a) - getPages(b));
      case "pagesDesc":
        return sorted.sort((a, b) => getPages(b) - getPages(a));
      case "priceLowHigh":
        return sorted.sort((a, b) => getPrice(a) - getPrice(b));
      case "priceHighLow":
        return sorted.sort((a, b) => getPrice(b) - getPrice(a));
      case "newest":
        return sorted.sort((a, b) => getDate(b) - getDate(a));
      case "oldest":
        return sorted.sort((a, b) => getDate(a) - getDate(b));
      case "titleAZ":
        return sorted.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
      case "titleZA":
        return sorted.sort((a, b) => getTitle(b).localeCompare(getTitle(a)));
      case "bestRated":
        return sorted.sort((a, b) => getRating(b) - getRating(a));
      case "worstRated":
        return sorted.sort((a, b) => getRating(a) - getRating(b));
      default:
        return books;
    }
  };


  const filteredBooks = filterBooks(books, searchTerm);
  const sortedBooks = sortBooks(filteredBooks, sortOption);

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
      <MainTitle>All Books</MainTitle>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <SearchBar onSearch={setSearchTerm} />
        <ProductSortFilter sortOption={sortOption} onChange={setSortOption} />
      </div>

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
