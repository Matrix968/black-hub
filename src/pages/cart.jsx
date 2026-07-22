import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";

export default function Cart() {
  const { cart, increase, decrease, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {/* Unified Suite Header */}
      <header className="bg-gray-950 border-b border-gray-900/80 px-6 lg:px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
          <h1 className="text-xl font-black tracking-widest text-white uppercase">
            BLACK HUB
          </h1>
        </div>

        <Link
          to="/shop"
          className="border border-gray-800 hover:bg-gray-900/60 text-gray-300 px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition duration-150"
        >
          ← Return to Terminal Shop
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Shopping Allocation Cart
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review and manage your queued product data nodes before checkout
            initialization.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Premium Empty Repository View */
          <div className="bg-gray-900/20 border border-dashed border-gray-800 rounded-2xl p-16 text-center max-w-xl mx-auto mt-6">
            <h2 className="text-xl font-bold">Your Repository Cart is Empty</h2>
            <p className="text-gray-500 text-xs mt-2 max-w-xs mx-auto">
              No product instances detected inside the staging directory. Head
              back to the shop to provision elements.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-bold text-xs mt-6 tracking-wide transition shadow-lg shadow-yellow-400/5"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Operational Core Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Hand Allocation: Item Stream */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:border-gray-700/60 transition duration-200"
                >
                  {/* Aspect Locked Thumbnail */}
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.title}
                    className="w-24 h-24 rounded-xl object-cover bg-gray-950 border border-gray-800/60 shrink-0 self-center sm:self-auto"
                  />

                  {/* Allocation Metadata Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start flex-wrap gap-2">
                      <span className="text-[9px] font-mono tracking-widest text-yellow-400/80 uppercase">
                        {item.category}
                      </span>
                      {item.type && (
                        <span className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.type}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-white mt-1 truncate">
                      {item.title}
                    </h2>
                    <h3 className="text-xl font-black text-white mt-2 font-mono">
                      ₦{Number(item.price).toLocaleString()}
                    </h3>
                  </div>

                  {/* Vector Metrics Control Stack */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-800/60">
                    {/* Quantity Adjustment Row */}
                    <div className="flex items-center bg-black border border-gray-800 rounded-xl p-1">
                      <button
                        onClick={() => decrease(item.id)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-900/80 text-gray-400 hover:text-white font-bold transition flex items-center justify-center text-sm"
                      >
                        -
                      </button>

                      <span className="text-sm font-mono font-bold px-3 min-w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increase(item.id)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-900/80 text-gray-400 hover:text-white font-bold transition flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Purge / Remove Action Anchor */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-transparent hover:bg-rose-950/20 text-rose-400 border border-transparent hover:border-rose-900/40 px-4 py-1.5 rounded-xl text-[11px] font-semibold tracking-wider transition font-mono uppercase"
                    >
                      Purge Node
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Hand Allocation: Sticky Checkout Ledger Block */}
            <div className="bg-gray-900/30 border border-gray-800/80 rounded-2xl p-6 sticky top-6">
              <h3 className="text-xs font-semibold text-gray-500 font-mono tracking-widest uppercase border-b border-gray-800/60 pb-3 mb-4">
                Ledger Accounting Matrix
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Active Parameters</span>
                  <span className="font-mono text-white">
                    {cart.reduce((a, b) => a + b.quantity, 0)} Units
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Logistics Pipeline</span>
                  <span className="font-mono text-emerald-400">
                    Instantiated
                  </span>
                </div>
                <div className="border-t border-gray-800/60 pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">
                    Aggregated Total
                  </span>
                  <span className="text-2xl font-black text-yellow-400 font-mono">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition duration-150 shadow-lg shadow-yellow-400/5"
              >
                Proceed to Checkout Pipeline
              </button>

              <p className="text-[10px] text-center text-gray-600 font-mono mt-4 uppercase tracking-wider">
                Encryption Handshake Guaranteed
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
