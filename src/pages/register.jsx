import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await register(form.fullName, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(
        err.message || "Authentication initial node generation failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white flex justify-center items-center p-4 sm:p-6 selection:bg-yellow-400 selection:text-black antialiased relative overflow-hidden">
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

      <div className="w-full max-w-md bg-zinc-950/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/5 relative z-10 hover:border-amber-500/40 transition-all duration-500">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />

        {/* Hub Title Identification */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center font-black text-black text-2xl mx-auto mb-3 shadow-[0_0_25px_rgba(234,179,8,0.2)]">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-amber-400/60 uppercase mt-1">
            Join the premium digital asset marketplace
          </p>
        </div>

        {/* Dynamic Error Messaging Output Module */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs font-mono mb-5 flex items-start gap-2.5 backdrop-blur-sm">
            <span className="mt-0.5">⚠️</span>
            <div>
              <span className="font-bold uppercase tracking-wider block mb-0.5">
                Registration Error
              </span>
              {errorMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-2">
              <User className="w-3 h-3 text-amber-400" />
              Full Legal Identity
            </label>
            <input
              required
              type="text"
              name="fullName"
              value={form.fullName}
              placeholder="e.g. John Doe"
              className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-300 placeholder:text-zinc-700 focus:ring-4 focus:ring-amber-500/10"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3 text-amber-400" />
              Communication Relay (Email)
            </label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              placeholder="name@domain.com"
              className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all duration-300 placeholder:text-zinc-700 focus:ring-4 focus:ring-amber-500/10"
              onChange={handleChange}
            />
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-2">
              <Lock className="w-3 h-3 text-amber-400" />
              Secure Cipher Key (Password)
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none transition-all duration-300 placeholder:text-zinc-700 focus:ring-4 focus:ring-amber-500/10"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black font-bold p-3.5 rounded-xl transition-all duration-300 flex items-center justify-center text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 mt-6"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="font-mono text-xs tracking-widest lowercase">
                  compiling...
                </span>
              </div>
            ) : (
              "Deploy Signature Node"
            )}
          </button>
        </form>

        {/* Navigation Routing Redirection Sub-deck */}
        <div className="mt-6 pt-5 border-t border-zinc-800/50 text-center">
          <p className="text-xs text-zinc-500 font-mono">
            Already mapped inside the database?{" "}
            <Link
              to="/login"
              className="text-amber-400 hover:text-amber-300 font-bold transition ml-1 underline underline-offset-4"
            >
              Sign In Vector
            </Link>
          </p>
        </div>

        {/* Security Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            256-bit SSL
          </span>
          <span className="w-px h-3 bg-zinc-800" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
            Secure Auth
          </span>
          <span className="w-px h-3 bg-zinc-800" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-2.5 h-2.5 text-blue-400" />
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}
