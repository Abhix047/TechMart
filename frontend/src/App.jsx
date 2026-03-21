import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyProducts from "./pages/admin/MyProduct";
import AddProduct from "./pages/admin/AddProduct";
import Dashboard from "./pages/admin/Dashboard";
import EditProduct from "./pages/admin/EditProduct";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/users";
import ProductCard from "./pages/ProductCard"
import Footer from "./components/home/Footer";
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Order from "./pages/Order";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetails";
import Checkout from "./pages/Checkout";
import ConnectUs from "./pages/ConnectUs";
import Banner from "./pages/admin/AdminBanner";
import Wishlist from "./pages/Wishlist";
import AdminOffers from "./pages/admin/Offers";
import Offers from "./pages/Offers";
import About from "./pages/About";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#0f0f0f',
          color: '#fff',
          borderRadius: '12px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          padding: '12px 20px',
        }
      }} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/categories" element={<Categories />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductCard/>} />
        <Route path="/offers" element={<Offers/>} />
        <Route path="/admin/product/:id/edit" element={<EditProduct />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products" element={<MyProducts />} /> 
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/banner" element={<Banner/>} />
        <Route path="/admin/offers" element={<AdminOffers/>} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={ <Cart/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/order/:id" element={<Order />}/>
        <Route path="/orders" element={<MyOrders/>}/>
        <Route path="/order-detail/:id" element={<OrderDetail/>} />
        <Route path="/connect-us" element={<ConnectUs/>} />
        <Route path="/wishlist" element={<Wishlist/>} />

      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  );
}

export default App;