import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import ProductCard from '../components/ProductCard';


const Category = () => {
    const { name } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isFavorite, toggleFavorite } = useFavorites();
    const { addToCart, isInCart } = useCart();

    const categoryDisplayNames = {
        aventura: 'Adventure',
        ficcao: 'Fiction',
        autoajuda: 'Self-Help',
        classicos: 'Classics',
        terror: 'Horror',
        romance: 'Romance'
    };

    useEffect(() => {
        axios.get('http://localhost:5000/books')
            .then(response => {
                const filtered = response.data.filter(book =>
                    book.category.toLowerCase() === name.toLowerCase()
                );
                setBooks(filtered);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching books:", error);
                setLoading(false);
            });
    }, [name]);

    const truncateDescription = (desc, length = 40) => {
        if (!desc) return "";
        return desc.length > length ? desc.slice(0, length) + "..." : desc;
    };

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
            <h1 className="mb-4 text-center" style={{ color: "var(--primary)", fontWeight: "bold" }}>
                {(categoryDisplayNames[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())}
            </h1>
            <div className="row">
                {books.map(book => (
                    <div key={book.id} className="col-md-3 mb-4">
                        <ProductCard product={book} />
                    </div>
                ))}
                {books.length === 0 && (
                    <p className="text-center" style={{ color: "var(--primary)" }}>No books found for this category.</p>
                )}
            </div>
        </div>
    );
};

export default Category;