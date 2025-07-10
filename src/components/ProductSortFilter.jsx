import React from 'react';

const ProductSortFilter = ({ sortOption, onChange, options }) => {
    // Full default list (if options is not passed)
    const defaultOptions = [
        { value: "pagesAsc", label: "Number of Pages: Low to High" },
        { value: "pagesDesc", label: "Number of Pages: High to Low" },
        { value: "priceLowHigh", label: "Price: Low to High" },
        { value: "priceHighLow", label: "Price: High to Low" },
        { value: "newest", label: "Newest Publications" },
        { value: "oldest", label: "Oldest Publications" },
        { value: "titleAZ", label: "Title A-Z" },
        { value: "titleZA", label: "Title Z-A" },
        { value: "bestRated", label: "Best Rated" },
        { value: "worstRated", label: "Worst Rated" }
    ];

    const availableOptions = options || defaultOptions;

    return (
        <div className="mb-4" style={{ minWidth: 250 }}>
            <select
                className="form-select"
                value={sortOption}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Sort by (optional)</option>
                {availableOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProductSortFilter;
