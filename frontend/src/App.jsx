import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/home/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

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
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const AdminQueries = lazy(() => import("./pages/admin/AdminQueries"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));

function RouteFallback() {
  return (
    <div className="min-h-[60vh] bg-[#fafafa] px-5 py-24 md:px-10 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex gap-4">
           <div className="h-4 w-32 rounded-full bg-black/5 animate-pulse" />
           <div className="h-4 w-4 rounded-full bg-black/5 animate-pulse" />
           <div className="h-4 w-24 rounded-full bg-black/5 animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-16 w-3/4 rounded-3xl bg-black/5 animate-pulse" />
          <div className="h-16 w-1/2 rounded-3xl bg-black/5 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="h-64 rounded-[32px] bg-black/[0.02] border border-black/[0.03] animate-pulse" />
          <div className="h-64 rounded-[32px] bg-black/[0.02] border border-black/[0.03] animate-pulse" />
          <div className="h-64 rounded-[32px] bg-black/[0.02] border border-black/[0.03] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const path = location.pathname;
    let title = "TechMart | Premium Curated Tech";
    
    if (path === "/") title = "TechMart | Home of Premium Tech";
    else if (path.startsWith("/product/")) title = "TechMart | Product Details";
    else if (path === "/cart") title = "TechMart | Your Bag";
    else if (path === "/checkout") title = "TechMart | Secure Checkout";
    else if (path === "/offers") title = "TechMart | Exclusive Offers";
    else if (path === "/about") title = "TechMart | Our Story";
    else if (path === "/connect-us") title = "TechMart | Connect With Us";
    else if (path.startsWith("/admin")) title = "TechMart | Admin Panel";
    
    document.title = title;
  }, [location]);

  return (
    <ErrorBoundary>
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

          {/* Secure Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="product/:id/edit" element={<EditProduct />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="banner" element={<Banner />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="queries" element={<AdminQueries />} />
            <Route path="coupons" element={<AdminCoupons />} />
          </Route>

          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order/:id" element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/order-detail/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />
          <Route path="/connect-us" element={<ConnectUs />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      
      </Suspense>
      {!isAdminRoute ? <Footer /> : null}
    </ErrorBoundary>
  );
}

export default App;
