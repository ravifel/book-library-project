import React from 'react';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                className="form-control"
                placeholder="Search books..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ maxWidth: 400 }}
            />
        </div>
    );
};

export default SearchBar;
