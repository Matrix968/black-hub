import { Link } from "react-router-dom";
import { useWishlist } from "../context/wishlistContext";
import { useCart } from "../context/cartContext";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  HeartOff,
  Sparkles,
  Star,
  Shield,
  Clock,
  TrendingUp,
  Package,
  ExternalLink,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Wishlist() {
  const { wishlist, removeWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.title} added to cart!`);
  };

  const handleRemoveFromWishlist = (id, title) => {
    removeWishlist(id);
    toast.error(`Removed ${title} from wishlist`, { icon: "💔" });
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans antialiased selection:bg-yellow-400 selection:text-black">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/5 via-yellow-500/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-b from-purple-500/5 to-transparent blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/3 rounded-full blur-[100px]" />
      </div>

      {/* ========================================== */}
      {/* PREMIUM HEADER                            */}
      {/* ========================================== */}
      <header className="sticky top-0 z-40 bg-[#050507]/90 backdrop-blur-2xl border-b border-amber-500/20 px-4 sm:px-6 lg:px-12 py-4 sm:py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Wishlist
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        <Link
          to="/shop"
          className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/30 text-gray-300 hover:text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Continue Shopping</span>
          <span className="sm:hidden">Shop</span>
        </Link>
      </header>

      {/* ========================================== */}
      {/* MAIN CONTENT                              */}
      {/* ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 relative z-10">
        {wishlist.length === 0 ? (
          /* ========================================== */
          /* EMPTY WISHLIST STATE                       */
          /* ========================================== */
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto space-y-6">
              <div className="inline-flex p-4 bg-zinc-900 rounded-2xl text-amber-400 border border-amber-500/20">
                <HeartOff className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white">
                  Your Wishlist is Empty
                </h2>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                  Start saving your favorite digital assets and premium
                  services.
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-block bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black px-8 py-3.5 rounded-xl font-black text-xs tracking-wider uppercase transition shadow-lg shadow-amber-400/20"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        ) : (
          /* ========================================== */
          /* WISHLIST GRID                             */
          /* ========================================== */
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-amber-400">
                  {wishlist.length}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  Saved Items
                </p>
              </div>
              <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-white">
                  ₦
                  {wishlist
                    .reduce((sum, item) => sum + (item.price || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  Total Value
                </p>
              </div>
              <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-emerald-400">
                  {wishlist.filter((item) => item.type === "premium").length}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  Premium Items
                </p>
              </div>
              <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-blue-400">
                  {wishlist.filter((item) => item.category).length}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  Categories
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="group bg-zinc-900/20 border border-zinc-800/85 hover:border-amber-500/40 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative h-48 sm:h-52 lg:h-56 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/400x300?text=Black+Hub"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {item.type && (
                        <span className="text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white border border-emerald-400/20 backdrop-blur-sm">
                          {item.type}
                        </span>
                      )}
                      {item.category && (
                        <span className="text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-lg bg-amber-500/90 text-black border border-amber-400/20 backdrop-blur-sm">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black transition-all shadow-lg shadow-amber-400/20 hover:scale-110"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleRemoveFromWishlist(item.id, item.title)
                        }
                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/20 transition-all hover:scale-110"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Wishlist Heart Indicator */}
                    <div className="absolute top-3 right-3">
                      <Heart className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Rating & Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="ml-1 text-xs font-bold text-white">
                            {item.rating || 4.8}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          ({item.reviews || 0} reviews)
                        </span>
                      </div>
                      {item.stock && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {item.stock}
                        </span>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-3 border-t border-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">
                            Price
                          </span>
                          <span className="text-xl font-black text-amber-400">
                            ₦{Number(item.price).toLocaleString()}
                          </span>
                        </div>
                        <Link
                          to={`/product/${item.id}`}
                          className="text-xs text-zinc-400 hover:text-amber-400 transition flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black py-3 rounded-xl font-black text-xs tracking-wider uppercase transition shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
