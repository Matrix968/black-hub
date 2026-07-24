import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Lock,
  Send,
  Loader2,
  Key,
  Users,
  Star,
  Globe,
  Fingerprint,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState("");
  const navigate = useNavigate();

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmailSent(email);
      toast.success("Password reset email sent successfully!");
    } catch (err) {
      console.error("Password reset error:", err);

      // Handle specific Firebase errors with friendly messages
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(
          err.message || "Failed to send reset email. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Mask email for display
  const maskEmail = (email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return email;
    const maskedLocal = local.slice(0, 2) + "****" + local.slice(-2);
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col justify-center items-center px-4 font-sans antialiased relative overflow-hidden selection:bg-yellow-400 selection:text-black">
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-48 -right-32 animate-pulse" />
        <div className="absolute w-[600px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32 animate-pulse delay-1000" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-amber-400/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating Glow Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence mode="wait">
          {!success ? (
            // Reset Password Form
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-950/90 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/5 relative overflow-hidden hover:border-amber-500/40 transition-all duration-500 backdrop-blur-xl"
            >
              {/* Decorative Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />

              {/* Brand Logo */}
              <div className="flex items-center gap-3 mb-6 justify-center relative z-10">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-400/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Sparkles className="w-5 h-5 text-black" />
                </motion.div>
                <div>
                  <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                    Black Hub
                  </h1>
                  <p className="text-[8px] font-mono tracking-widest text-amber-400/60 uppercase">
                    Premium Digital Assets
                  </p>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-6 relative z-10">
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono mb-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Lock className="w-3 h-3" />
                  <span>Password Recovery</span>
                </motion.div>
                <motion.h2
                  className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Forgot Your Password?
                  <span className="text-amber-400">🔑</span>
                </motion.h2>
                <motion.p
                  className="text-xs text-zinc-400 mt-1 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Reset your password by entering the email associated with your
                  account.
                </motion.p>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-5 p-3.5 bg-rose-950/30 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-400 font-mono backdrop-blur-sm overflow-hidden"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1.5 ml-1 flex items-center gap-2">
                    <Mail className="w-3 h-3 text-amber-400" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none disabled:opacity-40 transition-all duration-300 placeholder:text-zinc-700 focus:ring-4 focus:ring-amber-500/10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
                      <BadgeCheck className="w-4 h-4 text-emerald-400/50" />
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 flex items-center justify-center gap-2 group"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reset Link
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-zinc-950/90 text-zinc-500 font-mono">
                      OR
                    </span>
                  </div>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-400 transition font-mono group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </div>
              </form>

              {/* Security Note */}
              <motion.div
                className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>
                  Your account security matters. We'll never ask for your
                  password via email.
                </span>
              </motion.div>

              {/* Trust Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                  256-bit SSL
                </span>
                <span className="w-px h-3 bg-zinc-800" />
                <span className="flex items-center gap-1.5">
                  <Fingerprint className="w-2.5 h-2.5 text-emerald-400" />
                  Secure Auth
                </span>
                <span className="w-px h-3 bg-zinc-800" />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-blue-400" />
                  Verified
                </span>
              </div>
            </motion.div>
          ) : (
            // Success State
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
              className="bg-zinc-950/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5 relative overflow-hidden backdrop-blur-xl"
            >
              {/* Decorative Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

              {/* Success Icon */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full animate-ping" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center shadow-2xl shadow-emerald-400/30">
                    <CheckCircle className="w-10 h-10 text-black" />
                  </div>
                </div>
              </motion.div>

              {/* Success Content */}
              <div className="text-center space-y-4 relative z-10">
                <motion.h2
                  className="text-2xl sm:text-3xl font-black text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Email Sent Successfully! 🎉
                </motion.h2>

                <motion.p
                  className="text-xs text-zinc-400 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  We've sent a password reset link to
                </motion.p>

                <motion.div
                  className="bg-black/60 border border-zinc-800 rounded-xl p-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm font-bold text-amber-400 font-mono">
                    {maskEmail(emailSent)}
                  </p>
                </motion.div>

                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-xs text-zinc-400 font-mono flex items-center justify-center gap-2">
                    <Mail className="w-3 h-3 text-amber-400" />
                    Please check your inbox
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    (Don't forget to check your spam folder)
                  </p>
                </motion.div>

                <motion.div
                  className="mt-6 pt-4 border-t border-zinc-800/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition font-mono font-bold group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </Link>
                </motion.div>
              </div>

              {/* Security Note */}
              <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>
                  Check your email for the reset link. It expires in 1 hour.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-4 text-[10px] text-zinc-500 font-mono"
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-amber-400" />
            85K+ Users
          </span>
          <span className="w-px h-3 bg-zinc-800" />
          <span className="flex items-center gap-1.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400/20" />
            4.9/5 Rating
          </span>
          <span className="w-px h-3 bg-zinc-800" />
          <span className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-amber-400" />
            120+ Countries
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
