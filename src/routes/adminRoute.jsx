import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  Loader2,
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserX,
  Crown,
} from "lucide-react";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
          setError(null);
        } else {
          setIsAdmin(false);
          setError("You do not have admin privileges");
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        setError("Failed to verify admin credentials");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-amber-500/20 blur-[150px] rounded-full -top-32 -right-32 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-yellow-500/15 blur-[120px] rounded-full -bottom-32 -left-32 animate-pulse delay-1000" />
          <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Animated Shield Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full animate-ping" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-2xl shadow-amber-400/30">
              <Shield className="w-10 h-10 text-black" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
              Verifying Admin Access
            </h1>
            <p className="text-sm text-zinc-400 font-medium">
              Please wait while we verify your credentials
            </p>
          </div>

          {/* Animated Loading Dots */}
          <div className="flex gap-2">
            <div
              className="w-3 h-3 rounded-full bg-amber-400 animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="w-3 h-3 rounded-full bg-amber-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-3 h-3 rounded-full bg-amber-400 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>

          {/* Loading Progress Bar */}
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full animate-progress" />
          </div>

          <p className="text-[10px] text-zinc-500 font-mono tracking-widest animate-pulse">
            SECURE CONNECTION ESTABLISHED
          </p>
        </div>

        <style jsx>{`
          @keyframes progress {
            0% {
              width: 0%;
            }
            50% {
              width: 70%;
            }
            100% {
              width: 100%;
            }
          }
          .animate-progress {
            animation: progress 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Not Admin - Redirect with nice transition
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-rose-500/20 blur-[150px] rounded-full -top-32 -right-32" />
          <div className="absolute w-[500px] h-[500px] bg-red-500/15 blur-[120px] rounded-full -bottom-32 -left-32" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 p-8 max-w-md w-full">
          {/* Error Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
            <div className="relative w-24 h-24 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-2xl shadow-rose-500/10">
              <UserX className="w-12 h-12 text-rose-400" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Access Denied
            </h1>
            <p className="text-sm text-zinc-400">
              {error || "You don't have permission to access this page"}
            </p>
            <div className="pt-4">
              <Navigate to="/" replace />
            </div>
          </div>

          {/* Status Card */}
          <div className="w-full bg-zinc-900/50 border border-rose-500/20 rounded-xl p-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <div className="flex-1">
                <p className="text-xs text-zinc-400 font-medium">
                  Access Status
                </p>
                <p className="text-xs text-rose-400 font-bold">Unauthorized</p>
              </div>
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
          </div>

          {/* Redirecting Message */}
          <p className="text-xs text-zinc-500 font-mono animate-pulse">
            Redirecting to homepage...
          </p>
        </div>
      </div>
    );
  }

  // Admin - Render children with admin indicator
  return (
    <div className="relative">
      {/* Admin Status Badge - Floating indicator */}
      <div className="fixed bottom-6 right-6 z-50"></div>
      {children}
    </div>
  );
}
