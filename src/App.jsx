import Home from "./pages/home";
import Admin from "./admin/admin";
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
import AdminRoute from "./routes/adminRoute"; // Added AdminRoute import
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/resetpassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Orders from "./pages/orders";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Secured Admin Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          <Route path="/downloads" element={<Downloads />} />
          <Route path="/reset-password" element={<ForgotPassword/>}/>
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
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
    </>
  );
}
