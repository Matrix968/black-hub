import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Sparkles,
  PackageOpen,
  Filter,
  Grid3x3,
  LayoutGrid,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");

  const { addToCart, cart } = useCart();
  const { wishlist, addWishlist, removeWishlist } = useWishlist();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "products"));

      const data = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const reviewsSnap = await getDocs(
            collection(db, "products", docSnap.id, "reviews"),
          );

          const reviews = reviewsSnap.docs.map((r) => r.data());
          let average = 0;

          if (reviews.length > 0) {
            average =
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length;
          }

          return {
            id: docSnap.id,
            ...docSnap.data(),
            averageRating: average,
            totalReviews: reviews.length,
          };
        }),
      );

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load store catalog.");
    } finally {
      setLoading(false);
    }
  }

  // Safe handler for adding to cart with debug checks
  const handleAddToCart = (product) => {
    try {
      const isInCart = cart.some((item) => item.id === product.id);

      if (isInCart) {
        toast("Item is already in your cart", { icon: "🛒" });
        return;
      }

      addToCart(product);
      toast.success(`${product.title} added to cart!`);
  
    } catch (err) {
      console.error("Cart action error:", err);
      toast.error("Failed to add product to cart");
    }
  };

  // Safe handler for toggling wishlist items
  const handleWishlistToggle = (product) => {
    try {
      const isWishlisted = wishlist?.some((item) => item.id === product.id);

      if (isWishlisted) {
        if (removeWishlist) {
          removeWishlist(product.id);
        } else {
          addWishlist(product);
        }
        toast.error(`Removed ${product.title} from wishlist`, { icon: "💔" });
      } else {
        addWishlist(product);
        toast.success(`Saved ${product.title} to wishlist!`, { icon: "❤️" });
      }
    } catch (err) {
      console.error("Wishlist action error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const categories = [
    "All",
    "Netflix",
    "Spotify",
    "Canva",
    "Website",
    "Design",
    "Other",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans antialiased selection:bg-yellow-400 selection:text-black">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/wishlist"
            className="bg-zinc-900/80 hover:bg-zinc-800 text-gray-300 border border-zinc-800 hover:border-amber-500/30 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs tracking-wide uppercase transition flex items-center gap-2"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Wishlist</span>
          </Link>

          <Link
            to="/cart"
            className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black px-3 sm:px-4 py-2 rounded-xl font-bold text-xs tracking-wide uppercase transition flex items-center gap-2 shadow-lg shadow-amber-400/20"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Cart ({cart.length})</span>
          </Link>
        </div>
      </header>

      {/* ========================================== */}
      {/* MAIN CONTAINER                            */}
      {/* ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* ========================================== */}
        {/* HERO BANNER                               */}
        {/* ========================================== */}
        <div className="relative bg-gradient-to-r from-zinc-900/80 via-zinc-900/40 to-zinc-900/20 border border-amber-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl shadow-amber-500/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />

          <div className="space-y-2 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Digital Storefront</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Explore Digital Assets & Services
            </h1>
            <p className="text-sm text-gray-400 max-w-lg">
              Browse verified software accounts, design assets, and premium web
              tools instantly delivered to your dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2">
              <span className="text-xs text-zinc-400 font-bold">Products</span>
              <span className="text-xs font-black text-amber-400">
                {filteredProducts.length}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* SEARCH & FILTERS                          */}
        {/* ========================================== */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search products by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none transition text-white placeholder-gray-500 shadow-inner focus:shadow-amber-500/5"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition shrink-0 cursor-pointer whitespace-nowrap ${
                    category === cat
                      ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-black shadow-lg shadow-amber-400/20"
                      : "bg-zinc-950/80 text-gray-400 border border-zinc-800 hover:border-amber-500/30 hover:text-white"
                  }`}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition ${
                  viewMode === "grid"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-zinc-950/80 text-zinc-500 border border-zinc-800 hover:text-white"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition ${
                  viewMode === "list"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-zinc-950/80 text-zinc-500 border border-zinc-800 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PRODUCTS GRID LAYER                       */}
        {/* ========================================== */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/20 border border-zinc-800/60 rounded-2xl sm:rounded-3xl overflow-hidden p-4 space-y-4 animate-pulse"
              >
                <div className="w-full h-44 bg-zinc-900 rounded-2xl" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-900 rounded w-1/2" />
                <div className="h-6 bg-zinc-800 rounded w-1/3 pt-2" />
                <div className="space-y-2 pt-2">
                  <div className="h-10 bg-zinc-900 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto space-y-3">
            <div className="inline-flex p-4 bg-zinc-900 rounded-2xl text-amber-400 mb-1">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-gray-500">
              We couldn't find any products matching your search criteria. Try
              clearing your filters.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist?.some(
                (item) => item.id === product.id,
              );

              return (
                <div
                  key={product.id}
                  className={`group bg-zinc-900/20 border border-zinc-800/85 hover:border-amber-400/50 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 flex flex-col shadow-xl hover:shadow-2xl hover:shadow-amber-400/5 ${
                    viewMode === "list" ? "sm:flex-row" : ""
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "grid"
                        ? "aspect-video sm:h-44"
                        : "sm:w-48 md:w-64 aspect-square sm:aspect-auto"
                    } bg-zinc-950 shrink-0`}
                  >
                    <img
                      src={
                        product.image ||
                        "https://via.placeholder.com/400x250?text=Black+Hub"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {product.type && (
                      <span className="absolute top-3 left-3 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-lg bg-black/60 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                        {product.type}
                      </span>
                    )}
                    {isWishlisted && (
                      <div className="absolute top-3 right-3 bg-rose-500/90 backdrop-blur-md rounded-full p-1.5 shadow-lg">
                        <Heart className="w-3 h-3 fill-white text-white" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div
                    className={`p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3 ${
                      viewMode === "list" ? "sm:py-4" : ""
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase">
                        {product.category}
                      </span>
                      <h3 className="text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition line-clamp-1">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs font-mono pt-1">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="ml-1 font-bold">
                            {product.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-500 text-[11px]">
                          ({product.totalReviews} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-zinc-900/50">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black font-mono text-white">
                          ₦{Number(product.price).toLocaleString()}
                        </span>
                        {product.stock && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            In Stock
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition transform active:scale-[0.98] shadow-lg shadow-amber-400/10 cursor-pointer"
                        >
                          Add to Cart
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="w-full bg-black hover:bg-zinc-900 text-gray-300 border border-zinc-800 text-center py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Details</span>
                          </Link>

                          <button
                            onClick={() => handleWishlistToggle(product)}
                            className={`w-full border py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                              isWishlisted
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                                : "bg-black hover:bg-zinc-900 text-rose-400 border-zinc-800"
                            }`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isWishlisted ? "fill-rose-400" : ""
                              }`}
                            />
                            <span>{isWishlisted ? "Saved" : "Save"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
