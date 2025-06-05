import React, { useState, createContext, useContext, useEffect } from 'react'
import { useUserContext } from './UserContext.jsx'
import axios from 'axios';
import toast from 'react-hot-toast'

const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {

    const [product, setProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({})
    const [error, setError] = useState(null)
    const [cart, setCart] = React.useState([]);

    const { isLogin } = useUserContext();



    // Add to cart
    const addToCart = (product) => {
        const cartItem = cart.find(item => item._id === product._id);
        if (!cartItem) {
            setCart([...cart, { ...product, quantity: 1 }]);
            toast.success('Added to cart')
        } else {
            setCart(
                cart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        }
    };

    // Remove from cart
    const removeFromCart = (product) => {
        const updatedCart = cart.map(item =>
            item._id === product._id
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        const filteredCart = updatedCart.filter(item => item.quantity > 0);
        setCart(filteredCart);
        toast.success('Removed from cart')
    };


    const deleteProduct = (product) => {
        setCart(prev => prev.filter(item => item._id !== product._id));
    };


    const fetchProductsFromBackend = async () => {
        try {
            const axiosResponse = await axios.get('http://localhost:4000/products')
            setProduct(axiosResponse?.data)
            setError('')
        } catch (error) {
            setError('Error fetching products in context')
        }
    }

    const fetchSingleProductFromBackend = async (id) => {
        try {
            const axiosResponse = await axios.get(`http://localhost:4000/products/${id}`)
            setSelectedProduct(axiosResponse?.data)
            setError('')
        } catch (error) {
            setError('Error fetching products in context')
        }
    }

    useEffect(() => {
        fetchProductsFromBackend();
    }, []);


    return (
        <ProductContext.Provider value={{ product, setProduct, addToCart, removeFromCart, cart, deleteProduct, selectedProduct, setSelectedProduct, fetchProductsFromBackend, fetchSingleProductFromBackend }}>{children}</ProductContext.Provider>
    )
}


export default ProductContextProvider

export const UseProductContext = () => {
    return useContext(ProductContext);

};