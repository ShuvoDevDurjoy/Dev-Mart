import React from "react";
import "./ProductCard.css";
const ProductCard = ({ key, classes, product }) => {
  return (
    <div className="product_card_outer_container">
      <div className="product_card_image_container">
        <img
          className="product_image"
          src={product.images[0].image_links}
          alt={`product_image_${key}`}
        ></img>
      </div>
      <div className="product_card_bottom_content_container">
        <div className="product_price_container">
          <h2>{product.product_name}</h2>
          <span>{product.currency_code}</span>{" "}
          <span>{parseFloat(product.product_price).toFixed(2)}</span>
        </div>
        <div className="product_view_button_container">
            <a className="product_view_button" href={`http://localhost:5000/product/${product.product_id}`}>View Product</a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
