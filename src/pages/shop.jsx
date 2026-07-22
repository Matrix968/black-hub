import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";
import { Link } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const { addToCart, cart } = useCart();
  const { addWishlist } = useWishlist();

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
      console.error("Failed to sync system product directory:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      {/* Premium Header Architecture */}
      <header className="bg-gray-950 border-b border-gray-900 px-6 lg:px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
          <h1 className="text-xl font-black tracking-widest text-white uppercase">
            BLACK HUB
          </h1>
        </div>

        <Link
          to="/cart"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition duration-150 relative"
        >
          Cart Allocation ({cart.length})
        </Link>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {/* Title Meta block */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Digital Terminal Directory
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Provision verified elite software matrices, nodes, and premium tier
            accounts.
          </p>
        </div>

        {/* Tactical Search & Filter Matrix */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search verified parameters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-gray-950 border border-gray-900 focus:border-gray-800 p-4 rounded-xl text-sm focus:outline-none transition duration-150 text-white placeholder-gray-600"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-950 border border-gray-900 focus:border-gray-800 p-4 rounded-xl text-sm focus:outline-none transition duration-150 text-gray-400 font-mono cursor-pointer min-w-[180px]"
          >
            <option value="All">// All Repositories</option>
            <option value="Netflix">Netflix Data</option>
            <option value="Spotify">Spotify Data</option>
            <option value="Canva">Canva Access</option>
            <option value="Website">Web Infrastructure</option>
            <option value="Design">Assets & Design</option>
            <option value="Other">Unmapped Assets</option>
          </select>
        </div>

        {/* Dynamic Products Layer */}
        {loading ? (
          /* Custom Matrix Skeleton Loader Engine */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-900/20 border border-gray-900 rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse"
              >
                <div className="w-full h-44 bg-gray-950 rounded-xl" />
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-900 rounded w-1/2" />
                <div className="h-6 bg-gray-800 rounded w-1/3 pt-2" />
                <div className="space-y-2 pt-2">
                  <div className="h-9 bg-gray-900 rounded-xl w-full" />
                  <div className="h-9 bg-gray-900 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-gray-900/10 border border-dashed border-gray-900 rounded-2xl p-20 text-center font-mono text-xs text-gray-500 max-w-xl mx-auto">
            SYSTEM_NOTICE // Zero active records match the specified query
            criteria.
          </div>
        ) : (
          /* Operational Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900/20 border border-gray-900 hover:border-gray-800/80 rounded-2xl overflow-hidden transition duration-200 flex flex-col group"
              >
                {/* Visual Media Node Wrapper */}
                <div className="relative overflow-hidden aspect-video sm:h-44 bg-gray-950 shrink-0">
                  <img
                    src={
                      product.image ||
                      "https://via.placeholder.com/400x250?text=BLACK+HUB"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.type && (
                    <span className="absolute top-3 left-3 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                      {product.type}
                    </span>
                  )}
                </div>

                {/* Info & Configurations Payload */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase">
                      {product.category}
                    </span>
                    <h3 className="text-base font-bold tracking-tight text-white mt-0.5 group-hover:text-yellow-400 transition truncate">
                      {product.title}
                    </h3>

                    {/* Inline Product Verification Metrics */}
                    <div className="mt-1.5 flex items-center gap-2 text-xs font-mono">
                      <span className="text-yellow-500">
                        ★ {product.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-600 text-[10px]">
                        ({product.totalReviews} Logs)
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black font-mono text-white mt-4 border-t border-gray-900 pt-3">
                      ₦{Number(product.price).toLocaleString()}
                    </h4>

                    {/* Operational Actions Stack */}
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition duration-150"
                      >
                        Add to Cart Directory
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="w-full bg-gray-950 hover:bg-gray-900 text-gray-300 border border-gray-800/60 text-center py-2 rounded-xl font-bold text-[11px] transition"
                        >
                          Details
                        </Link>

                        <button
                          onClick={() => addWishlist(product)}
                          className="w-full bg-gray-950 hover:bg-gray-900 text-rose-400 border border-gray-800/60 py-2 rounded-xl font-mono text-[11px] font-bold transition flex items-center justify-center gap-1"
                        >
                          <span>❤️</span> Saved
                        </button>
                      </div>
                    </div>
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
