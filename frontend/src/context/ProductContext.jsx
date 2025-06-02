import React, {useState, createContext, useContext, useEffect } from 'react'
import { products } from '../assets/frontend_assets/assets.js';


const ProductContext = createContext();


const ProductContextProvider = ({ children }) => {

    const [product, setProduct] = React.useState([]);

    useEffect(()=>{
        setProduct(products)
    },[])
    
    return (
        <ProductContext.Provider value={{product, setProduct}}>{children}</ProductContext.Provider>
    )
}

export default ProductContextProvider

export const UseProductContext = () => {
    return useContext(ProductContext);
}
