import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';


const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center" style={{ color: "var(--primary)", fontWeight: "bold" }}>All Books</h1>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <div className="row">
        {filteredBooks.length === 0 && (
          <div className="text-center py-5">
            <p>No products found{searchTerm ? ` for "${searchTerm}"` : '.'}</p>
          </div>
        )}
        {filteredBooks.map(book => (
          <div key={book.id} className="col-md-3 mb-4">
            <ProductCard product={book} />
          </div>
        ))}

      </div>
    </div>
  );
};

export default Home;