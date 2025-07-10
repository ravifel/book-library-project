import React from "react";

const StarRating = ({ rating = 0, size = 22 }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
    const rounded = Math.round(rating * 2) / 2;
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rounded)) {
            stars.push(<i key={i} className="bi bi-star-fill" style={{ color: "#FFD700", fontSize: size }}></i>);
        } else if (i === Math.floor(rounded) && rounded % 1 !== 0) {
            stars.push(<i key={i} className="bi bi-star-half" style={{ color: "#FFD700", fontSize: size }}></i>);
        } else {
            stars.push(<i key={i} className="bi bi-star" style={{ color: "#FFD700", fontSize: size }}></i>);
        }
    }

    return (
        <div className="d-flex align-items-center">
            {stars}
            <span style={{ marginLeft: 8, color: "var(--primary)", fontWeight: 500, fontSize: size * 0.8 }}>
                {rating.toFixed(1)}
            </span>
        </div>
    );
};

export default StarRating;
