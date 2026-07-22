import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadWishlist(user.uid);
      } else {
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadWishlist(uid) {
    const userId = uid || auth.currentUser?.uid;

    if (!userId) return;

    const snap = await getDocs(collection(db, "users", userId, "wishlist"));

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setWishlist(data);
  }

  async function addWishlist(product) {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const ref = doc(db, "users", user.uid, "wishlist", product.id);

    const existing = await getDoc(ref);

    if (existing.exists()) {
      alert("Already in wishlist");
      return;
    }

    await setDoc(ref, {
      ...product,
      createdAt: Date.now(),
    });

    await loadWishlist(user.uid);

    alert("Added to wishlist");
  }

  async function removeWishlist(id) {
    const user = auth.currentUser;

    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "wishlist", id));

    await loadWishlist(user.uid);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addWishlist,
        removeWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
