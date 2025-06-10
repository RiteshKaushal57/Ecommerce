import React, { useState } from 'react';
import { UseProductContext } from '../../context/ProductContext';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import toast from 'react-hot-toast';


const PlaceOrder = () => {
  const { cart } = UseProductContext();
  const { user } = useUserContext();

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.productId.price * item.quantity),
    0
  );
  const tax = Math.round(subtotal * 0.02 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  // Address form state
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phoneNumber: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  // Handle order submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderData = {
        items: cart,
        totalAmount: total,
        paymentMethod,
        address: address
      };

      // Simulate payment gateway logic here if needed

      const response = await axios.post(`${process.env.REACT_APP_Backend_URL}/orders`, orderData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Order placed successfully!');
        // Redirect or clear cart logic here
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-8">
        {/* Shipping Address Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" name="firstName" value={address.firstName} onChange={handleAddressChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" name="lastName" value={address.lastName} onChange={handleAddressChange} className="w-full p-2 border rounded" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address Line 1</label>
              <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} className="w-full p-2 border rounded" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address Line 2</label>
              <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input type="text" name="state" value={address.state} onChange={handleAddressChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <input type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input type="text" name="country" value={address.country} onChange={handleAddressChange} className="w-full p-2 border rounded" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="tel" name="phoneNumber" value={address.phoneNumber} onChange={handleAddressChange} className="w-full p-2 border rounded" required />
            </div>
          </div>
        </div>

        {/* Order Summary and Payment */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="mb-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.productId.name} (x{item.quantity})</span>
                <span>${item.productId.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (2%):</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>${total}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Payment Method</h3>
            <label className="block mb-1">
              <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={e => setPaymentMethod(e.target.value)} />
              <span className="ml-2">Cash on Delivery</span>
            </label>
            <label className="block mb-1">
              <input type="radio" name="paymentMethod" value="Stripe" checked={paymentMethod === 'Stripe'} onChange={e => setPaymentMethod(e.target.value)} />
              <span className="ml-2">Stripe</span>
            </label>
            <label className="block mb-1">
              <input type="radio" name="paymentMethod" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={e => setPaymentMethod(e.target.value)} />
              <span className="ml-2">Razorpay</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition rounded"
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
