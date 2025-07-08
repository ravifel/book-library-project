import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart, isInCart } = useCart();

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

  const truncateDescription = (desc, length = 40) => {
    if (!desc) return "";
    return desc.length > length ? desc.slice(0, length) + "..." : desc;
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center" style={{ color: "var(--primary)", fontWeight: "bold" }}>All Books</h1>
      <div className="row">
        {books.map(book => (
          <div key={book.id} className="col-md-3 mb-4">
            <ProductCard product={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;