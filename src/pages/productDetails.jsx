import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useCart } from "../context/cartContext";
import {
  Star,
  Heart,
  Share2,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  ShoppingCart,
  Check,
  Copy,
  MessageCircle,
  Lock,
  Search,
  Truck,
  RotateCcw,
  Clock,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Core State
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery & Interactive State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [imageFade, setImageFade] = useState(true);

  // Zoom State
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center",
    transform: "scale(1)",
  });
  const [isHovered, setIsHovered] = useState(false);
  const imageContainerRef = useRef(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      loadProductData();
    }
  }, [id]);

  async function loadProductData() {
    try {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        const prodData = { id: snap.id, ...snap.data() };
        setProduct(prodData);

        await Promise.all([
          loadReviews(snap.id),
          loadRelatedProducts(prodData.category, snap.id),
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch product ledger:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews(prodId) {
    try {
      const snap = await getDocs(collection(db, "products", prodId, "reviews"));
      setReviews(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Failed to load reviews subcollection:", err);
    }
  }

  async function loadRelatedProducts(category, currentId) {
    if (!category) return;
    try {
      const q = query(
        collection(db, "products"),
        where("category", "==", category),
        limit(5),
      );
      const snap = await getDocs(q);
      const list = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.id !== currentId);
      setRelatedProducts(list.slice(0, 4));
    } catch (err) {
      console.error("Failed to fetch related assets:", err);
    }
  }

  const handleThumbnailClick = (index) => {
    if (index === activeImageIndex) return;
    setImageFade(false);
    setTimeout(() => {
      setActiveImageIndex(index);
      setImageFade(true);
    }, 150);
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center",
      transform: "scale(1)",
    });
    setIsHovered(false);
  };

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!comment.trim()) {
      setFormError("Review comment field cannot be blank.");
      return;
    }
    setSubmittingReview(true);
    try {
      setComment("");
      setRating(5);
      await loadReviews(product.id);
    } catch (err) {
      setFormError("Failed to publish verification log.");
    } finally {
      setSubmittingReview(false);
    }
  }

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product?.title} on Black Hub!`;
    if (platform === "whatsapp") {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`,
        "_blank",
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
    setShareMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white font-mono text-xs flex flex-col justify-center items-center gap-4">
        <p className="text-zinc-500">
          SYSTEM_ALERT // Product record node was not instantiated correctly.
        </p>
        <Link
          to="/shop"
          className="text-yellow-400 underline hover:text-yellow-500 transition"
        >
          [ Return to Shop Registry ]
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          product.image ||
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
        ];

  const currentPrice = Number(product.price) || 0;
  const totalPrice = currentPrice * quantity;

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-yellow-400 selection:text-black">
      {/* Navigation Header */}
      <header className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-6 lg:px-12 py-5 sticky top-0 z-40 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-yellow-400/20">
            BH
          </div>
          <span className="text-sm font-black tracking-widest uppercase">
            BLACK HUB
          </span>
        </Link>
        <Link
          to="/shop"
          className="text-xs font-mono text-zinc-400 hover:text-yellow-400 transition"
        >
          ← Back to Shop Directory
        </Link>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image Gallery & Zoom */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-video lg:aspect-square bg-zinc-950 border border-zinc-800/80 rounded-3xl overflow-hidden cursor-crosshair shadow-2xl flex items-center justify-center"
            >
              {/* Floating Product Badges */}
              <div className="absolute top-5 left-5 z-20 flex gap-2">
                {product.featured && (
                  <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold uppercase">
                    Featured
                  </span>
                )}
                {product.discount && (
                  <span className="px-3 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <img
                src={images[activeImageIndex]}
                alt={product.title}
                style={zoomStyle}
                className={`w-full h-full object-cover transition-opacity duration-150 ${imageFade ? "opacity-100" : "opacity-0"}`}
              />

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase text-zinc-400 pointer-events-none flex items-center gap-1.5">
                <Search className="w-3 h-3 text-yellow-400" /> Hover to Zoom
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`aspect-square rounded-2xl border overflow-hidden bg-zinc-950 transition-all ${
                      activeImageIndex === idx
                        ? "border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] scale-105"
                        : "border-zinc-800/80 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Action Matrix (Sticky) */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 items-center mb-3">
                <span className="text-[10px] font-mono tracking-widest text-yellow-400 uppercase px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 font-bold">
                  {product.category || "General Asset"}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> In Stock (
                  {product.stock ?? 10} available)
                </span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (product.rating || 5) ? "fill-yellow-400" : "text-zinc-700"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  ({reviews.length || 245} Verified Reviews)
                </span>
              </div>

              {/* Luxury Price Layout */}
              <div className="mt-6 space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl lg:text-5xl font-black text-yellow-400 font-mono">
                    ₦{totalPrice.toLocaleString()}
                  </h2>
                  {product.oldPrice && (
                    <span className="text-zinc-500 line-through text-xl font-mono">
                      ₦{Number(product.oldPrice).toLocaleString()}
                    </span>
                  )}
                </div>
                {product.discount && (
                  <p className="text-emerald-400 text-sm font-mono">
                    Save {product.discount}% today
                  </p>
                )}
              </div>
            </div>

            {/* Delivery & Trust Information Box */}
            <div className="mt-6 grid gap-3 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-xs font-mono">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Instant Delivery</p>
                  <p className="text-zinc-500 text-xs">
                    Usually within 30 seconds
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">30 Days Warranty</p>
                  <p className="text-zinc-500 text-xs">
                    Free replacement if invalid
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">24/7 Support</p>
                  <p className="text-zinc-500 text-xs">
                    Our team is always online
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800/80 p-4 rounded-2xl">
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold">
                Select Quantity
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold hover:border-yellow-400 transition"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold hover:border-yellow-400 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons Stack with Glowing CTA */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    addToCart({ ...product, price: currentPrice }, quantity);
                    navigate("/checkout");
                  }}
                  className="bg-yellow-400 text-black py-4 rounded-2xl font-bold uppercase tracking-wider shadow-[0_0_40px_rgba(234,179,8,0.35)] hover:shadow-[0_0_70px_rgba(234,179,8,0.55)] transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  Buy Now <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    addToCart({ ...product, price: currentPrice }, quantity)
                  }
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-400 text-yellow-400 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add To Cart
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 border py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "bg-rose-500/10 border-rose-500 text-rose-400"
                      : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
                  />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShareMenuOpen(!shareMenuOpen)}
                    className="px-5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 py-3 rounded-xl text-zinc-300 flex items-center justify-center gap-2 text-xs font-bold uppercase transition"
                  >
                    <Share2 className="w-4 h-4 text-yellow-400" /> Share
                  </button>

                  {shareMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                      <button
                        onClick={() => handleShare("whatsapp")}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-zinc-900 flex items-center gap-2"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />{" "}
                        WhatsApp
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-zinc-900 flex items-center gap-2"
                      >
                        <Share2 className="w-3.5 h-3.5 text-cyan-400" /> X /
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-zinc-900 flex items-center gap-2"
                      >
                        {copyFeedback ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-yellow-400" />
                        )}
                        {copyFeedback ? "Link Copied!" : "Copy Link"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tabs Section with Framer Motion AnimatePresence */}
        <div className="mt-28">
          <div className="flex border-b border-zinc-900 gap-8 overflow-x-auto">
            {["description", "specifications", "reviews", "faq"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-wider relative transition capitalize ${
                  activeTab === tab
                    ? "text-yellow-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"></div>
                )}
              </button>
            ))}
          </div>

          <div className="py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "description" && (
                  <div className="max-w-4xl space-y-4 text-zinc-300 leading-relaxed text-sm">
                    <p>
                      {product.description ||
                        "No expanded description provided for this operational node."}
                    </p>
                    <p>
                      Every asset provisioned through Black Hub undergoes
                      stringent automated compliance verification prior to
                      digital escrow release. Ensure accurate destination
                      coordinates during checkout.
                    </p>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="max-w-2xl grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex justify-between">
                      <span className="text-zinc-500">Asset Category</span>
                      <span className="font-bold text-white">
                        {product.category}
                      </span>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex justify-between">
                      <span className="text-zinc-500">Stock Status</span>
                      <span className="font-bold text-emerald-400">
                        Verified Active
                      </span>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex justify-between">
                      <span className="text-zinc-500">Fulfillment Type</span>
                      <span className="font-bold text-white">Instant Push</span>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex justify-between">
                      <span className="text-zinc-500">Security Standard</span>
                      <span className="font-bold text-yellow-400">
                        256-Bit Escrow
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-12">
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-4">
                        {reviews.length === 0 ? (
                          <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-2xl text-xs font-mono text-zinc-500 text-center">
                            No operator logs or reviews published for this
                            product yet.
                          </div>
                        ) : (
                          reviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-zinc-400">
                                  {rev.email || "Verified Operator"}
                                </span>
                                <div className="text-yellow-400 text-xs">
                                  {"★".repeat(rev.rating || 5)}
                                </div>
                              </div>
                              <p className="text-sm text-zinc-300">
                                {rev.comment}
                              </p>
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verified
                                Purchase
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      <form
                        onSubmit={handleReviewSubmit}
                        className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4"
                      >
                        <h3 className="font-bold text-sm uppercase tracking-wider">
                          Publish Verification Log
                        </h3>

                        {formError && (
                          <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400 text-xs font-mono">
                            {formError}
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                            Rating Score
                          </label>
                          <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-yellow-400 font-mono outline-none"
                          >
                            <option value={5}>
                              ★★★★★ (5/5 Excellence Standard)
                            </option>
                            <option value={4}>
                              ★★★★☆ (4/5 Solid Allocation)
                            </option>
                            <option value={3}>
                              ★★★☆☆ (3/5 Baseline Integrity)
                            </option>
                            <option value={2}>
                              ★★☆☆☆ (2/5 Suboptimal Output)
                            </option>
                            <option value={1}>
                              ★☆☆☆☆ (1/5 Critical Failure)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                            Analytical Comment
                          </label>
                          <textarea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this asset..."
                            className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition"
                        >
                          {submittingReview ? "Submitting..." : "Submit Log"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === "faq" && (
                  <div className="max-w-3xl space-y-4 text-xs font-mono">
                    <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2">
                      <h4 className="font-bold text-white text-sm">
                        Q: How fast is delivery after checkout?
                      </h4>
                      <p className="text-zinc-400">
                        A: Deliveries are fully automated and typically push
                        within 30 to 60 seconds after payment escrow
                        confirmation.
                      </p>
                    </div>
                    <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2">
                      <h4 className="font-bold text-white text-sm">
                        Q: Are these credentials private and guaranteed?
                      </h4>
                      <p className="text-zinc-400">
                        A: Yes, all credentials are private, non-shared, and
                        protected by our 30-day replacement warranty.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products Section with Motion Lift on Hover */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-zinc-900 pt-16">
            <div className="mb-8">
              <span className="text-xs font-mono uppercase text-yellow-400 tracking-widest">
                Similar Assets
              </span>
              <h3 className="text-2xl font-black mt-1">Related Products</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  onClick={() => navigate(`/product/${prod.id}`)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl cursor-pointer hover:border-yellow-400 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-zinc-900 rounded-xl mb-4 overflow-hidden">
                      <img
                        src={
                          prod.images?.[0] ||
                          prod.image ||
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                        }
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <span className="text-[9px] font-mono uppercase text-yellow-400">
                      {prod.category}
                    </span>
                    <h4 className="font-bold text-white mt-1 line-clamp-1">
                      {prod.title}
                    </h4>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-yellow-400 font-mono font-black">
                      ₦{Number(prod.price).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 group-hover:text-yellow-400 transition">
                      View →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
