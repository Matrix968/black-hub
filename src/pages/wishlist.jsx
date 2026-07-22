import { Link } from "react-router-dom";
import { useWishlist } from "../context/wishlistContext";
import { useCart } from "../context/cartContext";
import { ShoppingCart, Trash2, ArrowLeft, HeartOff } from "lucide-react";

export default function Wishlist() {
  const { wishlist, removeWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#030009] text-zinc-100 font-sans antialiased">
      {/* Dynamic Font Injection matching institutional theme */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=300;400;500;600;700&family=Space+Grotesk:wght=500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* --- PREMIUM HEADER NAV --- */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[#030009]/80 border-b border-white/[0.06] px-6 lg:px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold text-white tracking-wide">
            Saved Assets{" "}
            <span className="text-zinc-500 font-light text-sm font-body">
              ({wishlist.length})
            </span>
          </h1>
        </div>

        <Link
          to="/shop"
          className="bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-display font-bold tracking-wider uppercase border border-white/[0.06] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {wishlist.length === 0 ? (
          /* High-Fidelity Empty State */
          <div className="h-96 bg-zinc-900/10 border border-white/[0.04] rounded-3xl flex flex-col items-center justify-center p-8 text-center backdrop-blur-md max-w-xl mx-auto mt-12">
            <div className="bg-amber-500/10 text-amber-400 p-4 rounded-full mb-4 border border-amber-500/20">
              <HeartOff className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="font-display font-bold text-lg text-white">
              Wishlist Vault Empty
            </h2>
            <p className="text-xs text-zinc-400 max-w-xs mt-2 font-body font-light leading-relaxed">
              You haven't bookmarked any fractional equity units or
              high-performance hardware nodes yet.
            </p>
            <Link
              to="/shop"
              className="mt-6 px-6 py-3 bg-amber-500 text-black font-display font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-amber-500/5 hover:bg-amber-400 transition-all"
            >
              Explore Node Ecosystem
            </Link>
          </div>
        ) : (
          /* Premium Product Layout Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/10 border border-white/[0.04] rounded-3xl overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] backdrop-blur-md group hover:border-amber-500/20 transition-all duration-300"
              >
                {/* Visual Cover Asset wrapper */}
                <div className="relative h-56 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Technical Product Metadata Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-display font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-display text-amber-500 font-medium">
                      ₦
                    </span>
                    <h3 className="text-3xl font-display font-bold text-white tracking-tight">
                      {Number(item.price).toLocaleString()}
                    </h3>
                  </div>

                  {/* Operational Controls Interface */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/5 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add Asset to Cart
                    </button>

                    <button
                      onClick={() => removeWishlist(item.id)}
                      className="w-full bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white font-display font-bold text-xs tracking-wider uppercase py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Purge from Saved
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
