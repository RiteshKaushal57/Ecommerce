import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./components/User/Login.jsx";
import Register from "./components/User/Register.jsx";
import { Toaster } from 'react-hot-toast'
import Collection from "./components/Homepage/Collection.jsx";
import ProductList from "./components/Products/ProductList.jsx";
import Cart from "./components/Products/Cart.jsx";
import Orders from "./components/Products/Orders.jsx";
import Footer from "./components/Footer.jsx";
import PlaceOrder from "./components/Products/PlaceOrder.jsx";


function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/collection" element={<Collection paginate={true} perPage={20} />} />
        <Route path="/product-list/:_id" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/place-order" element={<PlaceOrder />} />

      </Routes>
      <Footer />

    </>
  );
}

export default App;
