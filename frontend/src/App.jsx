import { Routes, Route, useLocation, Outlet } from "react-router-dom";
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
import AdminPanel from "./components/Admin Panel/AdminPanel.jsx";
import AddProduct from "./components/Admin Panel/AddProduct.jsx";
import AllProducts from "./components/Admin Panel/AllProducts.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

function AdminLayout() {
  return (
    <div className="flex-1">
      <AdminPanel />
    </div>
  );
}

function App() {
  const location = useLocation();
  const hideNavbarFooter = location.pathname.startsWith("/admin-panel");

  return (
    <>
      <Toaster />
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/collection" element={<Collection paginate={true} perPage={20} />} />
        <Route path="/product-list/:_id" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Panel Nested Routes */}
        <Route path="/admin-panel" element={<AdminLayout />}>
          <Route index element={<AddProduct />} />
          <Route path="overview" element={<AllProducts />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
