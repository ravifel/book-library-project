import React from 'react';

const Favorites = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h2 className="mb-3">📚 Meus Livros Favoritos</h2>
                <p className="text-muted">Você ainda não adicionou nenhum livro aos favoritos.</p>
                {/* Conteúdo futuro (lista de livros, cards, etc) */}
            </div>
        </div>
    );
};

export default Favorites;
