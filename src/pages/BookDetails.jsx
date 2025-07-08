import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const BookDetails = () => {
    const { id } = useParams(); // Get the ID from the URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`http://localhost:5000/books/${id}`)
            .then(response => {
                setBook(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar detalhes do livro:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container py-5 text-center">
                <h4>Livro não encontrado.</h4>
                <Link to="/home" className="btn btn-primary mt-3">Voltar para a página inicial</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={book.coverImage}
                        alt={book.nameBook}
                        className="img-fluid shadow-sm rounded"
                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                    />
                </div>
                <div className="col-md-8">
                    <h2>{book.nameBook}</h2>
                    <p><strong>Autor:</strong> {book.author}</p>
                    <p><strong>Categoria:</strong> {book.category}</p>
                    <p><strong>Publicado em:</strong> {new Date(book.publicationDate).toLocaleDateString()}</p>
                    <p><strong>Número de páginas:</strong> {book.numberOfPages}</p>

                    <div className="mt-4 d-flex gap-3">
                        <button className="btn btn-outline-primary">
                            <i className="bi bi-cart"></i> Adicionar ao Carrinho
                        </button>
                        <button className="btn btn-outline-danger">
                            <i className="bi bi-heart"></i> Favoritar
                        </button>
                    </div>
                    <div className="mt-4">
                        <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
                            ⬅ Voltar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
