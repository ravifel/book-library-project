import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/books')
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar livros:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Todos os Livros</h1>
      <div className="row">
        {books.map(book => (
          <div className="col-md-3 mb-4" key={book.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={book.coverImage}
                className="card-img-top"
                alt={book.nameBook}
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{book.nameBook}</h5>
                <p className="card-text mb-1">
                  <strong>Author:</strong> {book.author}
                </p>
                <p className="card-text mb-1">
                  <strong>Category:</strong> {book.category}
                </p>
                <p className="card-text mb-1">
                  <strong>Published:</strong> {new Date(book.publicationDate).getFullYear()}
                </p>
                <p className="card-text">
                  <strong>Pages:</strong> {book.numberOfPages}
                </p>
                <div className="mt-auto d-flex flex-column gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-cart"></i> Add to Cart
                  </button>
                  <button className="btn btn-outline-danger">
                    <i className="bi bi-heart"></i> Favorite
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-eye"></i> View Details
                  </button>
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