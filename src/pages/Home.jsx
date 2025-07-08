import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";

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
          <div className="col-md-3 mb-4" key={book.id}>
            <div className="card h-100 shadow-sm"
              style={{ border: "1.5px solid var(--primary-card)", background: "var(--secondary)", boxShadow: "var(--box-shadow)" }}
            >
              <img
                src={book.coverImage}
                alt={book.nameBook}
                className="book-cover"
                style={{
                  background: "var(--secondary)",
                  border: "1px solid var(--primary-card)",
                  boxShadow: "0 0 4px rgba(49, 73, 100, 0.05)",
                  borderRadius: "5px"
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title" style={{ color: "var(--primary)", fontWeight: 600 }}>{book.nameBook}</h5>
                <p className="card-text mb-1">
                  <strong style={{ color: "var(--primary)" }}>Author:</strong> {book.author}
                </p>
                <p className="card-text mb-1">
                  <strong style={{ color: "var(--primary)" }}>Category:</strong> {book.category}
                </p>
                <p className="card-text mb-1">
                  <strong style={{ color: "var(--primary)" }}>Description:</strong> {truncateDescription(book.description)}
                </p>
                <p className="card-text mb-2">
                  <strong style={{ color: "var(--primary)" }}>Price:</strong>
                  <span className="price-badge" style={{ marginLeft: "5px", fontSize: "1.15em" }}>
                    ${book.price?.toFixed(2)}
                  </span>
                </p>
                <div className="mt-auto d-flex flex-column gap-2">
                  {/* Botão Carrinho: verde */}
                  <button
                    className="btn"
                    style={{
                      background: isInCart(book.id) ? "var(--button-cart-bg)" : "var(--button-cart-bg)",
                      color: "var(--button-cart-text)",
                      border: "none",
                      fontWeight: 500
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "var(--button-cart-bg-hover)"}
                    onMouseOut={e => e.currentTarget.style.background = "var(--button-cart-bg)"}
                    onClick={() => addToCart({
                      ...book,
                      nameProduct: book.nameBook,
                      price: book.price,
                    })}
                    disabled={isInCart(book.id)}
                  >
                    <i className="bi bi-cart"></i>
                    {isInCart(book.id) ? " Added" : " Add to Cart"}
                  </button>
                  {/* Botão Favorito: vermelho */}
                  <button
                    className="btn"
                    style={{
                      background: isFavorite(book.id) ? "var(--button-fav-bg)" : "var(--button-fav-bg)",
                      color: "var(--button-fav-text)",
                      border: "none",
                      fontWeight: 500
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "var(--button-fav-bg-hover)"}
                    onMouseOut={e => e.currentTarget.style.background = "var(--button-fav-bg)"}
                    onClick={() => toggleFavorite(book)}
                  >
                    <i className={`bi ${isFavorite(book.id) ? "bi-heart-fill" : "bi-heart"}`}></i>
                    {isFavorite(book.id) ? " Remove Favorite" : " Favorite"}
                  </button>
                  <Link
                    to={`/book/${book.id}`}
                    className="btn"
                    style={{
                      background: "var(--secondary)",
                      border: "1.5px solid var(--primary-card)",
                      color: "var(--primary)",
                      fontWeight: 500
                    }}
                  >
                    <i className="bi bi-eye"></i> View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;