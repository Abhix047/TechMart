import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

const Home = () => {
  return (
    <div className="pt-32 text-center text-3xl font-semibold">
      Welcome to TechMart
    </div>
  );
};

const Products = () => {
  return (
    <div className="pt-32 text-center text-3xl font-semibold">
      Products Page
    </div>
  );
};

const Categories = () => {
  return (
    <div className="pt-32 text-center text-3xl font-semibold">
      Categories Page
    </div>
  );
};

const About = () => {
  return (
    <div className="pt-32 text-center text-3xl font-semibold">
      About Page
    </div>
  );
};

const Login = () => {
  return (
    <div className="pt-32 text-center text-3xl font-semibold">
      Login Page
    </div>
  );
};

const Register = () => {
  return (
    <div className="pt-32 text-center text-3xl font-semibold">
      Register Page
    </div>
  );
};

const Cart = () => {
  return (
    <div className="pt-32 text-center text-3xl font-semibold">
      Cart Page
    </div>
  );
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;