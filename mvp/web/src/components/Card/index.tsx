// src/components/ProductCard.tsx
import React from "react";

interface ProductCardProps {
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    date: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    title,
    description,
    price,
    imageUrl,
    date
}) => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            maxWidth: "400px",
            width: "100%",   
            gap: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>

            <img
                src={imageUrl}
                alt={title}
                style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{title}</h3>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#555" }}>{description}</p>
                <strong style={{ fontSize: "16px", marginRight:"10px" }}>{price}</strong>
                <strong style={{ fontSize: "10px" }}>{date}</strong>
            </div>
        </div>
    );
};
