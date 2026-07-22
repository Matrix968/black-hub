import Home from "./pages/home";
import Admin from "./pages/admin";
import Shop from "./pages/shop";
import Cart from "./pages/cart";
import Login from "./pages/login";
import Register from "./pages/register";
import Checkout from "./pages/checkout";
import Payment from "./pages/payment";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import ProductDetails from "./pages/productDetails";
import Wishlist from "./pages/wishlist";
import Downloads from "./pages/downloads";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/downloads" element={<Downloads />} />;
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </BrowserRouter>
  );
}
