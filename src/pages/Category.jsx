import React from 'react';
import { useParams } from 'react-router-dom';

const Category = () => {
    const { name } = useParams(); // Captura a categoria da URL

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h2 className="mb-3">📚 Categoria: {name?.toUpperCase()}</h2>
                <p className="text-muted">Aqui serão exibidos os livros da categoria selecionada.</p>
            </div>
        </div>
    );
};

export default Category;
