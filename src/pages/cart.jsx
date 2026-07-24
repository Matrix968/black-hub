import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import {
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Truck,
  Clock,
  Gift,
  CreditCard,
  Lock,
} from "lucide-react";

export default function Cart() {
  const { cart, increase, decrease, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  // Calculate total items
  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans antialiased selection:bg-yellow-400 selection:text-black">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/5 via-yellow-500/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-b from-purple-500/5 to-transparent blur-[100px] rounded-full" />
      </div>

      {/* ========================================== */}
      {/* PREMIUM NAVIGATION HEADER                  */}
      {/* ========================================== */}
      <header className="sticky top-0 z-50 bg-[#050507]/90 backdrop-blur-2xl border-b border-amber-500/20 px-4 sm:px-6 lg:px-12 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full group-hover:scale-125 transition shadow-lg shadow-amber-400/30" />
          <span className="text-lg font-black tracking-wider text-white uppercase bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
            Black Hub
          </span>
        </Link>

        <Link
          to="/shop"
          className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/30 text-gray-300 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Shop</span>
          <span className="sm:hidden">Shop</span>
        </Link>
      </header>

      {/* ========================================== */}
      {/* MAIN CONTAINER                            */}
      {/* ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 relative z-10">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Shopping Cart
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-11">
            Review your selected items and update quantities before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          /* ========================================== */
          /* EMPTY CART VIEW                           */
          /* ========================================== */
          <div className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto mt-6 space-y-4">
            <div className="inline-flex p-4 bg-zinc-900 rounded-2xl text-amber-400 border border-amber-500/20">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Your cart is empty
              </h2>
              <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
                You haven't added any products to your cart yet. Explore our
                shop to find premium digital assets.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-block bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-amber-400/20"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          /* ========================================== */
          /* CART WITH ITEMS                           */
          /* ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group bg-zinc-900/20 border border-zinc-800/85 hover:border-amber-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
                >
                  {/* Product Thumbnail */}
                  <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 self-center sm:self-auto">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 w-full space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase">
                        {item.category || "Digital Asset"}
                      </span>
                      {item.type && (
                        <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.type}
                        </span>
                      )}
                      {item.stock && (
                        <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.stock}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                      {item.title}
                    </h2>

                    <div className="flex items-center gap-3 pt-1">
                      <h3 className="text-xl font-black text-amber-400 font-mono">
                        ₦{Number(item.price).toLocaleString()}
                      </h3>
                      <span className="text-xs text-gray-500">
                        × {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Remove Controls */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/50">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-zinc-950/80 border border-zinc-800 rounded-xl p-1">
                      <button
                        onClick={() => decrease(item.id)}
                        className="w-8 h-8 rounded-lg hover:bg-zinc-900 text-gray-400 hover:text-amber-400 transition flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-xs font-mono font-bold px-3 min-w-8 text-center text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increase(item.id)}
                        className="w-8 h-8 rounded-lg hover:bg-zinc-900 text-gray-400 hover:text-amber-400 transition flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:scale-105"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ========================================== */}
            {/* RIGHT: ORDER SUMMARY SIDEBAR              */}
            {/* ========================================== */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-amber-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/5">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                    Order Summary
                  </h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-gray-400 pb-3 border-b border-zinc-800/50">
                    <span>Total Items</span>
                    <span className="font-mono text-white font-bold">
                      {totalItems} {totalItems === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400 pb-3 border-b border-zinc-800/50">
                    <span>Delivery</span>
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                      <Truck className="w-3 h-3" />
                      Instant
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400 pb-3 border-b border-zinc-800/50">
                    <span>Security</span>
                    <span className="font-mono text-amber-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      Encrypted
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <span className="font-bold text-white text-sm">
                      Total Amount
                    </span>
                    <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-6 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </button>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <CreditCard className="w-3 h-3" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="w-px h-3 bg-zinc-800" />
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Instant Delivery</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-gray-400">256-bit SSL</span>
                </div>
                <div className="w-px h-4 bg-zinc-800" />
                <div className="flex items-center gap-2">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] text-gray-400">
                    Instant Access
                  </span>
                </div>
                <div className="w-px h-4 bg-zinc-800" />
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-gray-400">
                    Auto Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
