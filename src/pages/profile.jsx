import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import {
  User,
  Phone,
  MapPin,
  Save,
  Loader2,
  ShieldCheck,
  Mail,
  ArrowLeft,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    photo: "",
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const user = auth.currentUser;
    if (!user) {
      setFetching(false);
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setProfile(snap.data());
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      toast.error("Failed to load user profile.");
    } finally {
      setFetching(false);
    }
  }

  // Handle Cloudinary Image Upload
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_UPLOAD_PRESET || "black-hub",
    );

    try {
      setUploadProgress(50);
      const cloudName = import.meta.env.VITE_CLOUD_NAME || "id4h6uqb";

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      setUploadProgress(85);
      const data = await response.json();

      if (data.secure_url) {
        setProfile((prev) => ({ ...prev, photo: data.secure_url }));
        setUploadProgress(100);
        toast.success("Avatar uploaded successfully!");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error("Image upload failed. Verify your Cloudinary configuration.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  async function saveProfile() {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please log in again to save changes.");
      return;
    }

    setLoading(true);

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...profile,
          email: user.email,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
          Loading Profile Matrix...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased p-6 lg:p-12 relative">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition bg-gray-900/60 border border-gray-800 px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back To Dashboard</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Metadata */}
        <div className="border-b border-gray-900 pb-6">
          <div className="flex items-center gap-2 text-yellow-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] font-mono tracking-widest uppercase">
              Account Security & Configuration
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
            My Profile
          </h1>
        </div>

        {/* Profile Form Card */}
        <div className="bg-gray-900/30 border border-gray-800/80 rounded-3xl p-6 lg:p-8 backdrop-blur-sm space-y-6">
          {/* Circular Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-800/80">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-yellow-400/50 bg-black flex items-center justify-center shadow-xl relative">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-600" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-yellow-400 gap-1">
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    Edit ✏️
                  </span>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <h3 className="text-lg font-bold text-white">
                {profile.name || "Anonymous User"}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                {auth.currentUser?.email}
              </p>

              {/* Upload Progress Bar */}
              {uploading ? (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-mono text-yellow-400">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <span className="inline-block text-[10px] font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2.5 py-1 rounded-full">
                  Click avatar to change photo
                </span>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-2 tracking-wider">
                Full Name / Entity ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Chidi Okoro"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full bg-black border border-gray-800 focus:border-yellow-400 pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition text-white placeholder-gray-600"
                />
              </div>
            </div>

            {/* Email (Read-Only) */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-500 mb-2 tracking-wider">
                System Locked Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={auth.currentUser?.email || ""}
                  readOnly
                  className="w-full bg-zinc-950 border border-zinc-900 pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none text-gray-500 cursor-not-allowed font-mono select-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-2 tracking-wider">
                Communications Link (Phone Number)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full bg-black border border-gray-800 focus:border-yellow-400 pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition text-white placeholder-gray-600"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-2 tracking-wider">
                Destination Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <MapPin className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  className="w-full bg-black border border-gray-800 focus:border-yellow-400 pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition text-white placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-800/80">
            <button
              onClick={saveProfile}
              disabled={loading || uploading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-black py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition transform hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synchronizing Profile...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile Configuration
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
