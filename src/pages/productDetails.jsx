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
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";
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
  Sparkles,
  Award,
  BadgeCheck,
  Zap,
  Crown,
  TrendingUp,
  Users,
  Shield,
  Eye,
  Maximize,
  Minus,
  Plus,
  X,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  Gift,
  Package,
  Layers,
  Database,
  Server,
  Globe,
  Wifi,
  Cpu,
  Fingerprint,
  Key,
  Download,
  ExternalLink,
  Calendar,
  DollarSign,
  Percent,
  FileText,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addWishlist, removeWishlist, wishlist } = useWishlist();

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
  const [showZoomModal, setShowZoomModal] = useState(false);

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

  // Check if product is in wishlist
  useEffect(() => {
    if (product && wishlist) {
      setIsWishlisted(wishlist.some((item) => item.id === product.id));
    }
  }, [product, wishlist]);

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
      toast.error("Failed to load product details");
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
      transform: "scale(2)",
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

    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!comment.trim()) {
      setFormError("Review comment cannot be empty.");
      return;
    }

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, "products", product.id, "reviews"), {
        userId: user.uid,
        email: user.email,
        rating: rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });

      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
      await loadReviews(product.id);
    } catch (err) {
      console.error("Failed to submit review:", err);
      setFormError("Failed to submit review. Please try again.");
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
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopyFeedback(false), 2000);
    }
    setShareMenuOpen(false);
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    if (isWishlisted) {
      removeWishlist(product.id);
      setIsWishlisted(false);
      toast.success("Removed from wishlist");
    } else {
      addWishlist(product);
      setIsWishlisted(true);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, price: Number(product.price) }, quantity);
    toast.success(`${product.title} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-32 -right-32" />
          <div className="absolute w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono text-zinc-400 animate-pulse">
            Loading Product Details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex flex-col items-center justify-center gap-6 p-4">
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-10 text-center max-w-md w-full space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-black text-white">Product Not Found</h2>
          <p className="text-xs text-zinc-400 font-mono">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black rounded-xl text-xs transition shadow-lg shadow-amber-400/20"
          >
            Return to Shop
          </Link>
        </div>
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
  const averageRating = product.averageRating || 4.8;
  const totalReviews = product.totalReviews || 0;

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans antialiased selection:bg-yellow-400 selection:text-black overflow-x-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-48 -right-32" />
        <div className="absolute w-[600px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#050507]/90 backdrop-blur-2xl border-b border-amber-500/20 px-4 sm:px-6 lg:px-12 py-3 sm:py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center font-black text-black text-xs sm:text-sm shadow-lg shadow-amber-400/20">
            BH
          </div>
          <span className="text-xs sm:text-sm font-black tracking-widest uppercase bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
            BLACK HUB
          </span>
        </Link>
        <Link
          to="/shop"
          className="text-[10px] sm:text-xs font-mono text-zinc-400 hover:text-amber-400 transition flex items-center gap-1"
        >
          <ArrowRight className="w-3 h-3 rotate-180" /> Back to Shop
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4 lg:sticky lg:top-28">
            {/* Main Image with Zoom */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square bg-zinc-950 border border-zinc-800 hover:border-amber-500/30 rounded-3xl overflow-hidden cursor-crosshair shadow-2xl shadow-amber-500/5 transition-all duration-300 group"
            >
              {/* Badges */}
              <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-20 flex flex-col sm:flex-row gap-2">
                {product.featured && (
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-black text-[8px] sm:text-[10px] font-black uppercase flex items-center gap-1 shadow-lg shadow-amber-400/20">
                    <Sparkles className="w-2.5 h-2.5" /> Featured
                  </span>
                )}
                {product.discount && (
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-rose-500 text-white text-[8px] sm:text-[10px] font-black uppercase flex items-center gap-1 shadow-lg shadow-rose-500/20">
                    <Percent className="w-2.5 h-2.5" /> -{product.discount}%
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="px-2.5 sm:px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[8px] sm:text-[10px] font-black uppercase">
                    Out of Stock
                  </span>
                )}
              </div>

              <img
                src={images[activeImageIndex]}
                alt={product.title}
                style={zoomStyle}
                className={`w-full h-full object-cover transition-opacity duration-150 ${imageFade ? "opacity-100" : "opacity-0"}`}
              />

              {/* Zoom Indicator */}
              <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-5 bg-black/70 backdrop-blur-md border border-zinc-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-mono text-zinc-400 pointer-events-none flex items-center gap-1 sm:gap-1.5">
                <Search className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />{" "}
                Hover to Zoom
              </div>

              {/* Zoom Modal Button */}
              <button
                onClick={() => setShowZoomModal(true)}
                className="absolute top-3 sm:top-5 right-3 sm:right-5 p-1.5 sm:p-2 bg-black/70 backdrop-blur-md border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-amber-500/30 transition"
              >
                <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`aspect-square rounded-xl sm:rounded-2xl border overflow-hidden bg-zinc-950 transition-all duration-300 ${
                      activeImageIndex === idx
                        ? "border-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.2)] scale-105"
                        : "border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-700"
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

          {/* Right Column: Product Info */}
          <div className="lg:sticky lg:top-28 space-y-6">
            {/* Category & Status */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-amber-400 uppercase px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-bold">
                {product.category || "General Asset"}
              </span>
              {product.stock > 0 ? (
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-emerald-400 uppercase px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> In Stock
                </span>
              ) : (
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-rose-400 uppercase px-2.5 sm:px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 font-bold flex items-center gap-1">
                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.round(averageRating) ? "fill-amber-400" : "text-zinc-700"}`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {averageRating.toFixed(1)} ({totalReviews || reviews.length}{" "}
                reviews)
              </span>
              <span className="w-px h-4 bg-zinc-800" />
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-400 font-mono">
                  ₦{totalPrice.toLocaleString()}
                </h2>
                {product.oldPrice && (
                  <span className="text-zinc-500 line-through text-base sm:text-xl font-mono">
                    ₦{Number(product.oldPrice).toLocaleString()}
                  </span>
                )}
              </div>
              {product.discount && (
                <p className="text-emerald-400 text-xs sm:text-sm font-mono flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Save {product.discount}% today
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl">
              <div className="text-center space-y-1">
                <Truck className="w-4 h-4 text-amber-400 mx-auto" />
                <p className="text-[9px] font-bold text-white">Instant</p>
                <p className="text-[8px] text-zinc-500 font-mono">Delivery</p>
              </div>
              <div className="text-center space-y-1 border-x border-zinc-800">
                <RotateCcw className="w-4 h-4 text-emerald-400 mx-auto" />
                <p className="text-[9px] font-bold text-white">30 Day</p>
                <p className="text-[8px] text-zinc-500 font-mono">Warranty</p>
              </div>
              <div className="text-center space-y-1">
                <Clock className="w-4 h-4 text-cyan-400 mx-auto" />
                <p className="text-[9px] font-bold text-white">24/7</p>
                <p className="text-[8px] text-zinc-500 font-mono">Support</p>
              </div>
            </div>

            {/* Description Preview */}
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
              {product.description ||
                "No description provided for this product."}
            </p>

            {/* Quantity */}
            <div className="flex items-center justify-between bg-zinc-950/80 border border-zinc-800 p-3 sm:p-4 rounded-2xl">
              <span className="text-[10px] sm:text-xs font-mono uppercase text-zinc-400 font-bold">
                Quantity
              </span>
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold hover:border-amber-400 hover:bg-zinc-800 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm w-6 text-center text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold hover:border-amber-400 hover:bg-zinc-800 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate("/checkout");
                  }}
                  className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black py-3.5 sm:py-4 rounded-2xl font-black uppercase tracking-wider shadow-[0_0_40px_rgba(234,179,8,0.2)] hover:shadow-[0_0_60px_rgba(234,179,8,0.35)] transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 text-[10px] sm:text-xs"
                >
                  Buy Now <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/30 text-amber-400 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add To Cart
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleWishlistToggle}
                  className={`flex-1 border py-3 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "bg-rose-500/10 border-rose-500 text-rose-400"
                      : "bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
                  />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShareMenuOpen(!shareMenuOpen)}
                    className="px-4 sm:px-5 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 py-3 rounded-xl text-zinc-300 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-bold uppercase transition"
                  >
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />{" "}
                    Share
                  </button>

                  <AnimatePresence>
                    {shareMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-zinc-950/95 backdrop-blur-xl border border-amber-500/20 rounded-2xl shadow-2xl shadow-amber-500/10 p-2 z-50 space-y-1"
                      >
                        <button
                          onClick={() => handleShare("whatsapp")}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-zinc-900 flex items-center gap-2 text-zinc-300 hover:text-white transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />{" "}
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare("twitter")}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-zinc-900 flex items-center gap-2 text-zinc-300 hover:text-white transition"
                        >
                          <Share2 className="w-3.5 h-3.5 text-cyan-400" /> X /
                          Twitter
                        </button>
                        <button
                          onClick={() => handleShare("copy")}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-zinc-900 flex items-center gap-2 text-zinc-300 hover:text-white transition"
                        >
                          {copyFeedback ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          {copyFeedback ? "Copied!" : "Copy Link"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* TABS SECTION                              */}
        {/* ========================================== */}
        <div className="mt-16 sm:mt-28">
          <div className="flex border-b border-zinc-800/60 gap-4 sm:gap-8 overflow-x-auto">
            {["description", "specifications", "reviews", "faq"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? "text-amber-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab === "description" && (
                  <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                )}
                {tab === "specifications" && (
                  <Layers className="w-3.5 h-3.5 inline mr-1.5" />
                )}
                {tab === "reviews" && (
                  <Star className="w-3.5 h-3.5 inline mr-1.5" />
                )}
                {tab === "faq" && (
                  <HelpCircle className="w-3.5 h-3.5 inline mr-1.5" />
                )}
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-400"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8 sm:py-10">
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
                        "No expanded description provided for this product."}
                    </p>
                    <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold">
                          Verified Asset
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Every asset provisioned through Black Hub undergoes
                        stringent automated compliance verification prior to
                        digital escrow release. Ensure accurate destination
                        coordinates during checkout.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-mono max-w-3xl">
                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex justify-between items-center hover:border-amber-500/30 transition">
                      <span className="text-zinc-500">Category</span>
                      <span className="font-bold text-white">
                        {product.category || "N/A"}
                      </span>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex justify-between items-center hover:border-amber-500/30 transition">
                      <span className="text-zinc-500">Stock Status</span>
                      <span className="font-bold text-emerald-400">
                        {product.stock > 0
                          ? `${product.stock} Available`
                          : "Out of Stock"}
                      </span>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex justify-between items-center hover:border-amber-500/30 transition">
                      <span className="text-zinc-500">Delivery Type</span>
                      <span className="font-bold text-white">Instant Push</span>
                    </div>
                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex justify-between items-center hover:border-amber-500/30 transition">
                      <span className="text-zinc-500">Security</span>
                      <span className="font-bold text-amber-400">
                        256-Bit Escrow
                      </span>
                    </div>
                    {product.type && (
                      <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex justify-between items-center hover:border-amber-500/30 transition">
                        <span className="text-zinc-500">Product Type</span>
                        <span className="font-bold text-white">
                          {product.type}
                        </span>
                      </div>
                    )}
                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex justify-between items-center hover:border-amber-500/30 transition">
                      <span className="text-zinc-500">Warranty</span>
                      <span className="font-bold text-emerald-400">
                        30 Days
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-8 sm:space-y-12">
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      {/* Reviews List */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(averageRating) ? "fill-amber-400" : "text-zinc-700"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-white">
                            {averageRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-zinc-400">
                            ({totalReviews || reviews.length} reviews)
                          </span>
                        </div>

                        {reviews.length === 0 ? (
                          <div className="p-8 bg-zinc-950/80 border border-zinc-800 rounded-2xl text-xs font-mono text-zinc-500 text-center">
                            No reviews yet. Be the first to review this product!
                          </div>
                        ) : (
                          reviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="p-4 sm:p-5 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-2 hover:border-amber-500/20 transition"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-zinc-400">
                                  {rev.email || "Verified User"}
                                </span>
                                <div className="text-amber-400 text-xs">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 inline ${i < (rev.rating || 5) ? "fill-amber-400" : "text-zinc-700"}`}
                                    />
                                  ))}
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

                      {/* Review Form */}
                      <form
                        onSubmit={handleReviewSubmit}
                        className="p-5 sm:p-6 bg-zinc-950/80 border border-zinc-800 rounded-3xl space-y-4 shadow-xl hover:border-amber-500/30 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-400" />
                          <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                            Write a Review
                          </h3>
                        </div>

                        {formError && (
                          <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400 text-xs font-mono flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5" /> {formError}
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                            Rating
                          </label>
                          <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl p-3 text-xs text-amber-400 font-mono outline-none transition"
                          >
                            <option value={5}>★★★★★ (5/5) - Excellent</option>
                            <option value={4}>★★★★☆ (4/5) - Very Good</option>
                            <option value={3}>★★★☆☆ (3/5) - Average</option>
                            <option value={2}>
                              ★★☆☆☆ (2/5) - Below Average
                            </option>
                            <option value={1}>★☆☆☆☆ (1/5) - Poor</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">
                            Your Review
                          </label>
                          <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl p-3 text-xs text-white outline-none resize-none transition placeholder-zinc-600"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview || !auth.currentUser}
                          className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-400/20 disabled:opacity-50"
                        >
                          {submittingReview
                            ? "Submitting..."
                            : auth.currentUser
                              ? "Submit Review"
                              : "Login to Review"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === "faq" && (
                  <div className="max-w-3xl space-y-4 text-xs font-mono">
                    <div className="p-5 bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-2xl space-y-2 transition">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        How fast is delivery after checkout?
                      </h4>
                      <p className="text-zinc-400 leading-relaxed">
                        Deliveries are fully automated and typically push within
                        30 to 60 seconds after payment escrow confirmation.
                      </p>
                    </div>
                    <div className="p-5 bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-2xl space-y-2 transition">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        Are these credentials private and guaranteed?
                      </h4>
                      <p className="text-zinc-400 leading-relaxed">
                        Yes, all credentials are private, non-shared, and
                        protected by our 30-day replacement warranty.
                      </p>
                    </div>
                    <div className="p-5 bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/30 rounded-2xl space-y-2 transition">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        What payment methods are accepted?
                      </h4>
                      <p className="text-zinc-400 leading-relaxed">
                        We accept Paystack, Credit/Debit cards, Bank Transfers,
                        USSD, Apple Pay, and Google Pay.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ========================================== */}
        {/* RELATED PRODUCTS                          */}
        {/* ========================================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-28 border-t border-zinc-800/60 pt-12 sm:pt-16">
            <div className="mb-8">
              <span className="text-[10px] sm:text-xs font-mono uppercase text-amber-400 tracking-widest flex items-center gap-2">
                <Package className="w-3.5 h-3.5" /> Similar Assets
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1 text-white">
                Related Products
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  onClick={() => navigate(`/product/${prod.id}`)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="group p-4 sm:p-5 bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between"
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
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-mono uppercase text-amber-400">
                      {prod.category}
                    </span>
                    <h4 className="font-bold text-white mt-1 line-clamp-1 text-sm sm:text-base">
                      {prod.title}
                    </h4>
                  </div>
                  <div className="mt-4 flex justify-between items-center pt-3 border-t border-zinc-800/50">
                    <span className="text-amber-400 font-mono font-black text-base sm:text-lg">
                      ₦{Number(prod.price).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 group-hover:text-amber-400 transition flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* ZOOM MODAL                                 */}
      {/* ========================================== */}
      <AnimatePresence>
        {showZoomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setShowZoomModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowZoomModal(false)}
                className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition p-2"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={images[activeImageIndex]}
                alt={product.title}
                className="w-full h-full object-contain rounded-2xl"
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition ${
                        activeImageIndex === idx
                          ? "bg-amber-400 w-4"
                          : "bg-zinc-600 hover:bg-zinc-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
