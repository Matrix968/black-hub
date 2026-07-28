import { useState } from "react";
import { useAuth } from "../context/authContext";
import {
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Lock,
  Mail,
  Key,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Fingerprint,
  Globe,
  Zap,
  Crown,
  Users,
  Star,
  BadgeCheck,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(
        err.message?.replace("Firebase: ", "") || "Authentication failure.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col justify-center items-center px-4 font-sans antialiased relative overflow-hidden selection:bg-yellow-400 selection:text-black">
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full -top-48 -right-32 animate-pulse" />
        <div className="absolute w-[600px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -bottom-32 -left-32 animate-pulse delay-1000" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141417_1px,transparent_1px),linear-gradient(to_bottom,#141417_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="bg-zinc-950/90 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/5 relative overflow-hidden hover:border-amber-500/40 transition-all duration-500 backdrop-blur-xl">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />

          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-8 justify-center relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono mb-3">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              Welcome Back
              <span className="text-amber-400">👋</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Sign in to access your premium assets
            </p>
          </div>

          {/* State Banners */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 bg-rose-950/30 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-400 font-mono backdrop-blur-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-400 font-mono backdrop-blur-sm"
              >
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Login successful! Redirecting...</span>
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
                  disabled={loading || success}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none disabled:opacity-40 transition-all duration-300 placeholder:text-zinc-700 focus:ring-4 focus:ring-amber-500/10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
                  <BadgeCheck className="w-4 h-4 text-emerald-400/50" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1.5 ml-1 flex items-center gap-2">
                <Key className="w-3 h-3 text-amber-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  disabled={loading || success}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none disabled:opacity-40 transition-all duration-300 placeholder:text-zinc-700 focus:ring-4 focus:ring-amber-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                >
                  {show ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/reset-password"
                className="text-[10px] text-zinc-500 hover:text-amber-400 transition font-mono"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Authorized
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-2">
              <p className="text-[10px] text-zinc-500 font-mono">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-amber-400 hover:text-amber-300 transition font-bold"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>

          {/* Security Badges */}
          <div className="mt-6 pt-4 border-t border-zinc-800/50 flex flex-wrap items-center justify-center gap-4 text-[8px] font-mono text-zinc-500 uppercase tracking-widest relative z-10">
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

          {/* Trust Banner */}
          <div className="mt-3 text-center">
            <p className="text-[7px] text-zinc-600 font-mono">
              Protected by enterprise-grade security • 24/7 monitoring
            </p>
          </div>
        </div>

        {/* Live Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-4 text-[10px] text-zinc-500 font-mono"
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-amber-400" />
            85K+ Active Users
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
