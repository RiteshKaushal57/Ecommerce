// frontend/src/components/Collection.jsx

import React, { useState } from 'react';
import { UseProductContext } from '../../context/ProductContext.jsx';
import { useUserContext } from '../../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Collection = ({ limit, paginate, perPage }) => {
    const { product, addToCart, removeFromCart, cart = [] } = UseProductContext();
    const { isLogin } = useUserContext();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    let displayedProducts = product;
    if (paginate) {
        const itemsPerPage = perPage || 20;
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        displayedProducts = product.slice(startIdx, endIdx);
    } else if (limit) {
        displayedProducts = product.slice(0, limit);
    }
    const totalPages = paginate ? Math.ceil(product.length / (perPage || 20)) : 1;

    // Helper: Find cart item by productId and selectedSize
    const findCartItem = (item) => {
        // Determine the default size if product has sizes, otherwise it's undefined
        const defaultSelectedSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined;

        return cart.find(
            ci =>
                // Check if productId matches (ci.productId._id for populated, ci._id for unpopulated - though backend should fix this)
                // Use optional chaining for ci.productId._id as it might be an ObjectId string or a populated object
                (ci.productId?._id === item._id || ci.productId === item._id) &&
                // Correctly compare selectedSize, handling undefined/null for both
                (ci.selectedSize === defaultSelectedSize || (!ci.selectedSize && !defaultSelectedSize))
        );
    };

    // Handle add/remove cart logic
    const handleCartAction = async (item, cartItem, e) => {
        e.stopPropagation();
        if (!isLogin) {
            toast.error('Please login first.');
            return;
        }

        const selectedSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined;

        if (cartItem) {
            // Remove from cart: pass item._id (product ID) and selectedSize
            await removeFromCart(item._id, selectedSize);
        } else {
            // Add to cart: pass productId, quantity, selectedSize, price
            await addToCart(item._id, 1, selectedSize, item.price);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 py-10">
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-700">
                    <span className="text-gray-400">LATEST </span>
                    <span className="text-blue-900">COLLECTIONS</span>
                </h2>
                <p className="text-gray-400 text-center max-w-2xl">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
                </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 w-full max-w-7xl px-4">
                {displayedProducts.map((item) => {
                    const cartItem = findCartItem(item);

                    return (
                        <div
                            key={item._id}
                            className="flex flex-col items-center bg-white rounded-md border border-gray-200 shadow-sm p-3 cursor-pointer"
                            onClick={() => navigate(`/product-list/${item._id}`)}
                        >
                            <div className="flex items-center justify-center h-64 w-full mb-2">
                                <img
                                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                                    alt={item.name}
                                    className="object-contain h-full w-full"
                                    style={{ pointerEvents: 'none' }}
                                />
                            </div>
                            <p className="text-gray-700 font-medium text-base text-center mb-1">{item.name}</p>
                            <p className="text-gray-500 text-sm text-center mb-2">{item.category}</p>
                            <div className="text-black font-semibold text-lg mb-2">${item.price}</div>
                            <div className="flex gap-2 items-center">
                                <button
                                    type="button"
                                    className="bg-pink-100 border border-pink-300 w-fit px-4 h-9 rounded text-pink-600 font-medium focus:outline-none hover:bg-pink-200 transition"
                                    onClick={(e) => handleCartAction(item, cartItem, e)}
                                >
                                    {cartItem ? "Remove from cart" : "Add to cart"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {paginate && totalPages > 1 && (
                <div className="flex gap-2 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx + 1}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Collection;