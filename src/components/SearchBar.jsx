import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); // avoid page reload
        onSearch(input.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 d-flex" style={{ maxWidth: 500 }}>
            <input
                type="text"
                className="form-control me-2"
                placeholder="Search books..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
                <i className="bi bi-search"></i> Search
            </button>
        </form>
    );
};

export default SearchBar;
