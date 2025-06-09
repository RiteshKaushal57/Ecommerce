import React from 'react';
import { UseProductContext } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import toast for user feedback

const Cart = () => {
    const { cart, removeFromCart, updateCartItem, error } = UseProductContext(); // Get error from context
    const navigate = useNavigate();

    // Calculate totals - ensure item.productId exists before accessing its properties
    const subtotal = cart.reduce(
        (sum, item) => sum + (item.productId?.price * item.quantity || 0), // Use optional chaining and default to 0
        0
    );
    const tax = Math.round(subtotal * 0.02 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    return (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart{' '}
                    <span className="text-sm text-indigo-500">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'}
                    </span>
                </h1>

                {error && ( // Display general errors from context
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cart.length === 0 && (
                    <div className="text-gray-500 text-center py-10">
                        Your cart is empty.
                    </div>
                )}

                {cart.map((item, index) => (
                    // Add a check for item.productId to prevent errors if populate fails
                    item.productId && (
                        <div
                            key={`${item.productId._id}-${item.selectedSize || 'no-size'}`} // More robust key
                            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
                        >
                            <div className="flex items-center md:gap-6 gap-3">
                                <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                    <img
                                        className="max-w-full h-full object-cover"
                                        src={Array.isArray(item.productId.image) ? item.productId.image[0] : item.productId.image}
                                        alt={item.productId.name}
                                    />
                                </div>
                                <div>
                                    <p className="hidden md:block font-semibold">
                                        {item.productId.name}
                                    </p>
                                    <div className="font-normal text-gray-500/70">
                                        <p>
                                            Size:{' '}
                                            <span>
                                                {item.selectedSize || 'N/A'}
                                            </span>
                                        </p>
                                        <div className="flex items-center">
                                            <p>Qty:</p>
                                            <select
                                                className="outline-none"
                                                value={item.quantity}
                                                onChange={e =>
                                                    updateCartItem(
                                                        item.productId._id,
                                                        Number(e.target.value),
                                                        item.selectedSize
                                                    )
                                                }
                                            >
                                                {Array(5) // Assuming max quantity of 5
                                                    .fill('')
                                                    .map((_, idx) => (
                                                        <option key={idx} value={idx + 1}>
                                                            {idx + 1}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center">
                                ${item.productId.price * item.quantity}
                            </p>
                            <button
                                onClick={() =>
                                    removeFromCart(item.productId._id, item.selectedSize)
                                }
                                className="cursor-pointer mx-auto"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                                        stroke="#FF532E"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    )
                ))}

                <button
                    onClick={() => navigate('/')}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
                >
                    <svg
                        width="15"
                        height="11"
                        viewBox="0 0 15 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                            stroke="#615fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Continue Shopping
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span> {/* Format to 2 decimal places */}
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span>
                        <span>${tax.toFixed(2)}</span> {/* Format to 2 decimal places */}
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span>
                        <span>${total.toFixed(2)}</span> {/* Format to 2 decimal places */}
                    </p>
                </div>

                <button onClick={()=>{navigate('/place-order')}} className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition">
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Cart;