import React from "react";
import "./Home.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AddProduct from "../../Component/Product/AddProduct/AddProduct";
import ShowProducts from "../../Component/Product/ShowProducts/ShowProducts"
import RemoveAllGithub from "../../Component/Product/RemoveAllGithub";
import AddCategory from "../../Component/Product/AddCategory/AddCategory";
import AddType from "../../Component/Product/AddType/AddType";
const Home = () => {
  return (
    <div className="home_main_container">
      <BrowserRouter>
        <div className="home_left_container">
          <div className="links_container">
            <div>
              <Link className="links" to="/add_product">Add Product</Link>
            </div>
            <div>
              <Link className="links" to="/add_categories">Add Category</Link>
            </div>

            <div>
              <Link className="links" to="/add_type">Add Type</Link>
            </div>
            <div>
              <Link className="links" to="/show_products">Show Products</Link>
            </div>
            <div>
              <Link className="links" to="/remove_all">Remove All</Link>
            </div>
          </div>
        </div>
        <div className="home_right_container">
          <Routes>
            <Route path="/add_product" element={<AddProduct />}></Route>
            <Route path="/show_products" element={<ShowProducts />} ></Route>
            <Route path="/remove_all" element={<RemoveAllGithub />} ></Route>
            <Route path="/add_categories" element={<AddCategory />}></Route>
            <Route path="/add_type" element={<AddType />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Home;
