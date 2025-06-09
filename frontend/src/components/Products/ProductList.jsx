import React, { useState, useEffect } from 'react';
import { UseProductContext } from '../../context/ProductContext';
import { useUserContext } from '../../context/UserContext.jsx';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductList = () => {
    const { _id } = useParams();
    const { product, cart, addToCart, removeFromCart } = UseProductContext();
    // Find the selected product from the product context
    const selectedProduct = product.find(item => item._id === _id);

    // Initialize thumbnail and selected size based on selectedProduct
    // Use useEffect to update state if selectedProduct changes (e.g., on initial load)
    const [thumbnail, setThumbnail] = useState(''); // Initialize with empty string
    const [selectedSize, setSelectedSize] = useState(''); // Initialize with empty string

    useEffect(() => {
        if (selectedProduct) {
            // Set initial thumbnail to the first image if available
            if (selectedProduct.image && selectedProduct.image.length > 0) {
                setThumbnail(selectedProduct.image[0]);
            } else {
                setThumbnail(''); // Fallback if no images
            }
            // Set initial selected size to the first available size if any
            if (selectedProduct.sizes && selectedProduct.sizes.length > 0) {
                setSelectedSize(selectedProduct.sizes[0]);
            } else {
                setSelectedSize(undefined); // Explicitly set to undefined if no sizes
            }
        }
    }, [selectedProduct]); // Re-run when selectedProduct changes

    const { isLogin } = useUserContext();

    // Find if this product with the currently selected size is in the cart
    // **IMPORTANT:** Use optional chaining for `ci.productId?._id` as it might be populated or just an ID string.
    // Also, handle the case where `selectedSize` might be `undefined` (for products without sizes).
    const cartItem = cart.find(
        ci =>
            (ci.productId?._id === selectedProduct?._id || ci.productId === selectedProduct?._id) &&
            (ci.selectedSize === selectedSize || (!ci.selectedSize && !selectedSize))
    );

    // Handle loading state
    if (!selectedProduct) {
        return <div className="text-center py-10">Loading product details...</div>;
    }

    // Function to handle adding/removing from cart
    const handleCartAction = () => {
        if (!isLogin) {
            toast.error('Please login first to manage your cart.');
            return;
        }

        // Only show size error if the product actually has sizes and none is selected
        if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
            toast.error('Please select a size.');
            return;
        }

        if (cartItem) {
            // Remove from cart: pass the product's actual ID and the selected size
            removeFromCart(selectedProduct._id, selectedSize);
        } else {
            // Add to cart: pass product ID, quantity (1), selected size, and price
            addToCart(selectedProduct._id, 1, selectedSize, selectedProduct.price);
        }
    };

    return (
        <div className="max-w-6xl w-full px-10 mx-auto py-8"> {/* Added mx-auto and py-8 for better layout */}
            <p className="text-gray-600 mb-4">
                <span>Home</span> /
                <span> Products</span> /
                <span> {selectedProduct.category}</span> /
                <span className="text-indigo-500"> {selectedProduct.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {selectedProduct.image.map((img, idx) => (
                            <div
                                key={idx}
                                className={`border max-w-24 rounded overflow-hidden cursor-pointer ${
                                    thumbnail === img ? 'border-indigo-500 border-2' : 'border-gray-500/30'
                                }`}
                                onClick={() => setThumbnail(img)}
                            >
                                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-[400px] w-full rounded overflow-hidden flex items-center justify-center"> {/* Set max-w for responsiveness */}
                        <img src={thumbnail || (selectedProduct.image && selectedProduct.image[0])} alt="Selected product" className="max-w-full h-auto object-contain" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium mb-2">{selectedProduct.name}</h1>

                    {selectedProduct.rating && (
                        <div className="flex items-center gap-0.5 mt-1">
                            {Array(5).fill('').map((_, i) => (
                                selectedProduct.rating > i ? (
                                    <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#615fff" />
                                    </svg>
                                ) : (
                                    <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#615fff" fillOpacity="0.35" />
                                    </svg>
                                )
                            ))}
                            <p className="text-base ml-2">({selectedProduct.rating})</p>
                        </div>
                    )}

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: ${selectedProduct.price}</p>
                        <p className="text-2xl font-medium">MRP: ${selectedProduct.offerPrice || selectedProduct.price}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {Array.isArray(selectedProduct.description)
                            ? selectedProduct.description.map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))
                            : <li>{selectedProduct.description}</li>
                        }
                    </ul>

                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && ( // Only show if sizes exist
                        <div className="mt-4">
                            <p className="text-base font-medium">Available Sizes:</p>
                            <div className="flex gap-2 mt-2">
                                {selectedProduct.sizes.map((size, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-3 py-1 border border-gray-400 rounded text-sm bg-gray-50 cursor-pointer ${
                                            selectedSize === size ? 'bg-indigo-200 border-indigo-500' : ''
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button
                            className={`w-full py-3.5 cursor-pointer font-medium transition
                                ${cartItem
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-gray-100 text-gray-800/80 hover:bg-gray-200"}
                            `}
                            onClick={handleCartAction} // Call the centralized handler
                        >
                            {cartItem ? "Remove from cart" : "Add to cart"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductList;