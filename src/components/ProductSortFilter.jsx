import React from 'react';

const ProductSortFilter = ({ sortOption, onChange }) => {
    return (
        <div className="mb-4" style={{ minWidth: 250 }}>
            <select
                className="form-select"
                value={sortOption}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Sort by (optional)</option>
                <option value="pagesAsc">Number of Pages: Low to High</option>
                <option value="pagesDesc">Number of Pages: High to Low</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="newest">Newest Publications</option>
                <option value="oldest">Oldest Publications</option>
                <option value="titleAZ">Title A-Z</option>
                <option value="titleZA">Title Z-A</option>
                <option value="bestRated">Best Rated</option>
                <option value="worstRated">Worst Rated</option>
            </select>
        </div>
    );
};

export default ProductSortFilter;
