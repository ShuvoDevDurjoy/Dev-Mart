import React,{useContext, useEffect,useState} from 'react'
import axios from 'axios'
import Products from '../Products/Products';
import { Context } from '../../../Context';

const ShowProducts = () => {
    const {products, fetchProducts } = useContext(Context);
    useEffect(()=>{fetchProducts()},[]);
  return (
    <div className="show_product_main_container">
        <div className="top_fixed">
            <p>This is All the Products</p>
        </div>
        <div className="show_product_inner_container">
            <Products products={products} />
        </div>
    </div>
  )
}

export default ShowProducts
