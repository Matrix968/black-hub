import { useState } from "react";
import { useAuth } from "../context/authContext";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setSuccess(true);
    } catch (err) {
      // Strips generic Firebase prefixes if present, keeping UI messages clean
      setError(
        err.message?.replace("Firebase: ", "") || "Authentication failure.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4 font-sans antialiased">
      <div className="w-full max-w-md bg-gray-950 border border-gray-900/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />

        {/* Brand System Logo Matrix */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
          <h1 className="text-sm font-black tracking-widest text-gray-400 uppercase">
            Black Hub Suite
          </h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Access Gate Node
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Provide cryptography credentials to initialize session.
          </p>
        </div>

        {/* State Banners */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/30 border border-rose-900/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-400 font-mono">
            <svg
              className="w-4 h-4 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 bg-emerald-950/30 border border-emerald-900/40 rounded-xl flex items-start gap-2.5 text-xs text-emerald-400 font-mono">
            <svg
              className="w-4 h-4 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Handshake complete. Access permissions verified. Redirecting...
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-1.5 ml-1">
              Routing Endpoint (Email)
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              required
              disabled={loading || success}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 disabled:opacity-40 transition duration-150 placeholder:text-gray-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-1.5 ml-1">
              Security Key Phrase
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              required
              disabled={loading || success}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 disabled:opacity-40 transition duration-150 placeholder:text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-900 disabled:text-gray-600 text-black py-3 rounded-xl text-xs font-black uppercase tracking-wider transition duration-150 shadow-lg shadow-yellow-400/5 mt-2"
          >
            {loading
              ? "Authenticating Session..."
              : success
                ? "Authorized"
                : "Establish Handshake"}
          </button>
        </form>
      </div>

      {/* Decorative Footprint Subtext */}
      <p className="text-[10px] text-gray-700 font-mono mt-4 uppercase tracking-widest">
        Secure Token Engine v2.4.6-LIVE
      </p>
    </div>
  );
}
