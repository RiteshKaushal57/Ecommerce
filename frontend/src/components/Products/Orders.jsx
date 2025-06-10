import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg"

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.Backend_URL}/orders`, { withCredentials: true });
                setOrders(response.data.orders || []);
            } catch (error) {
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            {orders.length === 0 && <div>No orders found.</div>}
            {orders.map((order, index) => (
                <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
                    <div className="flex gap-5">
                        <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
                        <div>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex flex-col justify-center">
                                    <p className="font-medium">
                                        {item.productId?.name || "Product"}
                                        <span className={`text-indigo-500 ${item.quantity < 2 && "hidden"}`}>x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm">
                        <p className='font-medium mb-1'>
                            {order.addressId?.firstName} {order.addressId?.lastName}
                        </p>
                        <p>
                            {order.addressId?.addressLine1}, {order.addressId?.city}, {order.addressId?.state}, {order.addressId?.zipCode}, {order.addressId?.country}
                        </p>
                    </div>

                    <p className="font-medium text-base my-auto text-black/70">
                        ${order.totalAmount}
                    </p>

                    <div className="flex flex-col text-sm">
                        <p>Method: {order.paymentMethod}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment: {order.paymentStatus === "paid" ? "Paid" : "Pending"}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;
