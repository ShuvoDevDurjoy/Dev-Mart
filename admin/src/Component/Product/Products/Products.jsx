import React, { useContext } from "react";
import "../../Product/product.css";
import axios from "axios";
import { Context } from "../../../Context";
const Products = ({ products }) => {
  const { fetchProducts } = useContext(Context);

  const removeProduct = async (product_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/product/remove/product_id/${product_id}`
      );
      fetchProducts();
    } catch (e) {
      console.log("Error with removing the item");
    }
  };
  return (
    <div className="product fl_col gap_1">
      {products.map((product, index) => {
        return (
          <div
            className="product_inner_container fl ju_sp_bet"
            key={`product-${index}`}
          >
            <div className="product_left fl_col gap_1 ju_sp_bet">
              <p className="para_type_1">{`Product Name : ${product.product_name}`}</p>
              <p className="para_type_1">{`Product Category : ${product.product_category}`}</p>
              <div className="fl">
                <p>{`product available : ${product.available}`}</p>
                {/* <p>{`product unit quantity : ${product.product_quantity}${product.product_unit}`}</p> */}
              </div>
              <p className="para_type_1">{`product price : ${product.product_price} ${product.currency_code}`}</p>
              <div className="fl">
                <div className="button_type_2 modify_product">Modify Item</div>
                <div
                  className="button_type_2 remove_product"
                  onClick={() => {
                    removeProduct(product.product_id);
                  }}
                >
                  Remove Item
                </div>
              </div>
            </div>
            <div className="product_right">
              <div class="image_holder">
                <a
                  href={product.images[0].image_links}
                  target="_blank"
                >
                  <img src={product.images[0].image_links} alt="" />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Products;

/*
import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    asin: '',
    title: '',
    price: '',
    rating: '',
    image_url: '',
    category: '',
    description: '',
    features: '',
    brand: '',
    availability: true,
    stock_count: '',
    amazon_link: '',
    shipping_info: '',
    dimensions: '',
    weight: '',
    reviews_count: '',
    bestseller_rank: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox change (for availability)
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/product_amazon', formData);
      if (response.data.success) {
        alert('Product data submitted successfully!');
      }
    } catch (error) {
      console.error('There was an error submitting the form:', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <div>
      <h2>Product Submission Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ASIN</label>
          <input
            type="text"
            name="asin"
            value={formData.asin}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Features (comma separated)</label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Availability</label>
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleCheckboxChange}
          />
        </div>
        <div>
          <label>Stock Count</label>
          <input
            type="number"
            name="stock_count"
            value={formData.stock_count}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Amazon Link</label>
          <input
            type="url"
            name="amazon_link"
            value={formData.amazon_link}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Shipping Info</label>
          <textarea
            name="shipping_info"
            value={formData.shipping_info}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Dimensions</label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Weight</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Reviews Count</label>
          <input
            type="number"
            name="reviews_count"
            value={formData.reviews_count}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bestseller Rank</label>
          <input
            type="number"
            name="bestseller_rank"
            value={formData.bestseller_rank}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit Product</button>
      </form>
    </div>
  );
};

export default ProductForm;




*/
