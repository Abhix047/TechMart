import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/home/Footer";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ProductCard = lazy(() => import("./pages/ProductCard"));
const About = lazy(() => import("./pages/About"));
const Cart = lazy(() => import("./pages/Cart"));
const Offers = lazy(() => import("./pages/Offers"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Order = lazy(() => import("./pages/Order"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const OrderDetail = lazy(() => import("./pages/OrderDetails"));
const ConnectUs = lazy(() => import("./pages/ConnectUs"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const MyProducts = lazy(() => import("./pages/admin/MyProduct"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Users = lazy(() => import("./pages/admin/Users"));
const Banner = lazy(() => import("./pages/admin/AdminBanner"));
const AdminOffers = lazy(() => import("./pages/admin/Offers"));
function RouteFallback() {
  return (
    <div className="min-h-[40vh] bg-white px-5 py-16 md:px-10">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-5 h-4 w-28 rounded-full bg-neutral-200" />
        <div className="mb-4 h-14 w-full max-w-xl rounded-2xl bg-neutral-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 rounded-3xl bg-neutral-100" />
          <div className="h-40 rounded-3xl bg-neutral-100" />
          <div className="h-40 rounded-3xl bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 100000 }}
        toastOptions={{
          style: {
            background: "#0f0f0f",
            color: "#fff",
            borderRadius: "12px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            padding: "12px 20px",
          },
        }}
      />
      {!isAdminRoute ? <Navbar /> : null}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductCard />} />
          <Route path="/offers" element={<Offers />} />


          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="product/:id/edit" element={<EditProduct />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="Users" element={<Users />} />
            <Route path="banner" element={<Banner />} />
            <Route path="offers" element={<AdminOffers />} />
          </Route>

          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order-detail/:id" element={<OrderDetail />} />
          <Route path="/connect-us" element={<ConnectUs />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </Suspense>
      {!isAdminRoute ? <Footer /> : null}
    </>
  );
}

export default App;
