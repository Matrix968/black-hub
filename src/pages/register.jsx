import { useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";

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
      // Automatically redirect client code matrix to terminal dashboard upon generation
      navigate("/dashboard");
    } catch (err) {
      // Extract a clean error string message
      setErrorMessage(
        err.message || "Authentication initial node generation failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white flex justify-center items-center p-6 selection:bg-yellow-400 selection:text-black antialiased">
      {/* Absolute background visual accent anchor */}
      <div className="absolute w-80 h-80 bg-yellow-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Hub Title Identification */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black tracking-tighter mx-auto mb-3 shadow-[0_0_25px_rgba(234,179,8,0.15)]">
            BH
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Initialize Access Node
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mt-1">
            Create Client Registration Vector
          </p>
        </div>

        {/* Dynamic Error Messaging Output Module */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-mono mb-5 flex items-start gap-2.5">
            <span className="mt-0.5">⚠️</span>
            <div>
              <span className="font-bold uppercase tracking-wider block mb-0.5">
                Matrix Fault
              </span>
              {errorMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
              Full Legal Identity
            </label>
            <input
              required
              type="text"
              name="fullName"
              value={form.fullName}
              placeholder="e.g. John Doe"
              className="w-full bg-black/50 border border-zinc-800/80 focus:border-yellow-400/70 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-600 transition duration-200 outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
              Communication Relay (Email)
            </label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              placeholder="name@domain.com"
              className="w-full bg-black/50 border border-zinc-800/80 focus:border-yellow-400/70 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-600 transition duration-200 outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
              Secure Cipher Key (Password)
            </label>
            <input
              required
              type="password"
              name="password"
              value={form.password}
              placeholder="••••••••••••"
              className="w-full bg-black/50 border border-zinc-800/80 focus:border-yellow-400/70 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-600 transition duration-200 outline-none"
              onChange={handleChange}
            />
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold p-3.5 rounded-xl transition duration-200 flex items-center justify-center text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(234,179,8,0.1)] mt-6"
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
        <div className="mt-6 pt-5 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-500">
            Already mapped inside the database?{" "}
            <Link
              to="/login"
              className="text-yellow-400 hover:text-yellow-300 font-semibold transition ml-1 underline underline-offset-4"
            >
              Sign In Vector
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
