import React, { useState, createContext, useContext, useEffect } from 'react';
import { useUserContext } from './UserContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import dotenv from 'dotenv';
dotenv.config();

const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
    const [product, setProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [error, setError] = useState(null);
    const [cart, setCart] = React.useState([]);

    const { isLogin, user } = useUserContext();

    // Fetches cart items from the backend
    const getCartItems = async () => {
        if (!isLogin) {
            setCart([]); // Clear cart if not logged in
            return;
        }
        try {
            const axiosResponse = await axios.get('process.env.Backend_URL/cart', {
                withCredentials: true,
            });
            setCart(axiosResponse?.data);
            setError('');
        } catch (error) {
            // Log the error for debugging
            console.error('Error fetching cart items:', error);
            setError('Error fetching cart items. Please try again.');
            // Optionally, clear the cart if there's an error fetching
            setCart([]);
        }
    };

    // Add to cart
    const addToCart = async (productId, quantity, selectedSize, price) => {
        if (!isLogin) {
            toast.error('Please log in to add items to your cart.');
            return;
        }
        try {
            const axiosResponse = await axios.post(
                'process.env.Backend_URL/cart',
                { productId, quantity, selectedSize, price },
                { withCredentials: true }
            );
            setCart(axiosResponse?.data);
            toast.success('Item added to cart!');
            setError('');
        } catch (error) {
            console.error('Error adding items to cart:', error);
            setError('Error adding items to cart. Please try again.');
            toast.error('Failed to add item to cart.');
        }
    };

    // Update cart item quantity/size
    const updateCartItem = async (productId, quantity, selectedSize) => {
        if (!isLogin) {
            toast.error('Please log in to update your cart.');
            return;
        }
        try {
            const axiosResponse = await axios.put(
                `process.env.Backend_URL/cart/${productId}`,
                { quantity, selectedSize },
                { withCredentials: true }
            );
            setCart(axiosResponse?.data);
            toast.success('Cart updated successfully!');
            setError('');
        } catch (error) {
            console.error('Error updating cart item:', error);
            setError('Error updating cart item. Please try again.');
            toast.error('Failed to update cart.');
        }
    };

    // Remove from cart
    const removeFromCart = async (productId, selectedSize) => {
        if (!isLogin) {
            toast.error('Please log in to manage your cart.');
            return;
        }
        try {
            const axiosResponse = await axios.delete(
                `process.env.Backend_URL/cart/${productId}`,
                {
                    data: { selectedSize }, // Axios allows sending body in DELETE like this
                    withCredentials: true,
                }
            );
            setCart(axiosResponse?.data);
            toast.success('Item removed from cart!');
            setError('');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            setError('Error removing item from cart. Please try again.');
            toast.error('Failed to remove item from cart.');
        }
    };

    const fetchProductsFromBackend = async () => {
        try {
            const axiosResponse = await axios.get('process.env.Backend_URL/products');
            setProduct(axiosResponse?.data?.products || []);
            setError('');
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products. Please try again.');
        }
    };

    const fetchSingleProductFromBackend = async (id) => {
        try {
            const axiosResponse = await axios.get(`process.env.Backend_URL/products/${id}`);
            setSelectedProduct(axiosResponse?.data);
            setError('');
        } catch (error) {
            console.error('Error fetching single product:', error);
            setError('Error fetching product details. Please try again.');
        }
    };

    useEffect(() => {
        fetchProductsFromBackend();
    }, []);

    // Fetch cart items whenever the login status changes
    useEffect(() => {
        getCartItems();
    }, [isLogin]); // Depend on isLogin

    return (
        <ProductContext.Provider
            value={{
                product,
                setProduct,
                addToCart,
                removeFromCart,
                cart,
                updateCartItem,
                selectedProduct,
                setSelectedProduct,
                fetchProductsFromBackend,
                fetchSingleProductFromBackend,
                error, // Expose error for potential UI feedback
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContextProvider;

export const UseProductContext = () => {
    return useContext(ProductContext);
};