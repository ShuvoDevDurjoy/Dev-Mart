import React, { useState, useEffect } from "react";
import { Context } from "./Context";
import axios from "axios";
import io from "socket.io-client";

const socket = io('http://localhost:5000', { withCredentials: true });


const MyContextProvider = ({ children }) => {
  const [type, setType] = useState(null);

  const [authState, setAuthState] = useState("Login");
  const [userName, setUserName] = useState(null);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState([]);
  const [productCurrencies, setProductCurrenies] = useState([]);
  const [productQuantity, setProductQuantity] = useState("");
  const [productUnit, setProductUnit] = useState("kg");
  const [productAvilable, setProductAvailable] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productFile, setProductFile] = useState();
  
  const [products, setProducts] = useState([]);
  
  const resetProductState = () => {
    setProductName('');
    setProductQuantity('');
    setProductAvailable('');
    setProductFile();
    setProductPrice('');
  };
  
  // Fetch categories from server
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/product/categories');
      if (response.data.success) {
        console.log('categories are: ',response.data)
        setProductCategory(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  
  // Fetch product types from server
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/product/get_currency');
      if (response.data.success) {
        console.log("currencies",response.data.currencies);
        setProductCurrenies(response.data.currencies);
      }
    } catch (error) {
      console.error("Failed to fetch types:", error);
    }
  };
  
  // Handle socket event for new category
  useEffect(() => {
    socket.on("new-category", (data) => {
      console.log("Received new categories:");
      console.log(data)
      setProductCategory(data); // Update the category list
    });

    return () => {
      socket.off('c'); // Cleanup socket listener
    };
  }, []);

  // Fetch categories on initial load
  useEffect(() => {
    fetchCategories();
    fetchCurrencies();
    // fetchTypes();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/product/api/product_all");
      if (response.data.success) {
        setProducts(response.data.products);
        console.log(response.data.products)
      }
    } catch (e) {
      console.log("Error with fetching data");
    }
  };

  // Fetch the type info when app loads
  useEffect(() => {
    (async () => {
      try{
        const response = await axios.get("http://localhost:5000/");
        setType(response.data.name);
        fetchProducts();
      }catch(e){
        console.log("Error with loading the product from back-end");
      }
    })();
  }, []);

  // Shared data for the context provider
  const data = {
    type,
    authState, 
    userName,
    setUserName,
    setAuthState,
    products,
    setProducts,
    productName,
    setProductName,
    productCategory,
    setProductCategory,
    productCurrencies,
    setProductCurrenies,
    productQuantity,
    setProductQuantity,
    productAvilable,
    setProductAvailable,
    productFile,
    setProductFile,
    productUnit,
    setProductUnit,
    productPrice,
    setProductPrice,
    fetchProducts,
    resetProductState
  };

  return <Context.Provider value={data}>{children}</Context.Provider>;
};

export default MyContextProvider;
