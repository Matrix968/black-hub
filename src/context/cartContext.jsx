import { createContext, useContext, useState, useEffect } from "react";

import { auth, db } from "../firebase/firebase";

import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart whenever auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadCart(user.uid);
      } else {
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load cart from Firestore
  async function loadCart(uid) {
    const snap = await getDocs(collection(db, "users", uid, "cart"));

    const items = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCart(items);
  }

  // Add to Cart
  async function addToCart(product) {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }
    console.log(auth.currentUser);
    const cartRef = doc(db, "users", user.uid, "cart", product.id);

    const existing = await getDoc(cartRef);

    if (existing.exists()) {
      const data = existing.data();

      await updateDoc(cartRef, {
        quantity: data.quantity + 1,
      });
    } else {
      await setDoc(cartRef, {
        title: product.title,
        category: product.category,
        price: product.price,
        image: product.image || "",
        type: product.type,
        description: product.description,
        quantity: 1,
      });
    }

    loadCart(user.uid);
  }

  // Increase quantity
  async function increase(id) {
    const user = auth.currentUser;

    const cartRef = doc(db, "users", user.uid, "cart", id);

    const snap = await getDoc(cartRef);

    if (!snap.exists()) return;

    await updateDoc(cartRef, {
      quantity: snap.data().quantity + 1,
    });

    loadCart(user.uid);
  }

  // Decrease quantity
  async function decrease(id) {
    const user = auth.currentUser;

    const cartRef = doc(db, "users", user.uid, "cart", id);

    const snap = await getDoc(cartRef);

    if (!snap.exists()) return;

    const qty = snap.data().quantity;

    if (qty <= 1) {
      await deleteDoc(cartRef);
    } else {
      await updateDoc(cartRef, {
        quantity: qty - 1,
      });
    }

    loadCart(user.uid);
  }

  // Remove item completely
  async function removeFromCart(id) {
    const user = auth.currentUser;

    await deleteDoc(doc(db, "users", user.uid, "cart", id));

    loadCart(user.uid);
  }

  // Clear cart
  async function clearCart() {
    const user = auth.currentUser;

    if (!user) return;

    const snap = await getDocs(collection(db, "users", user.uid, "cart"));

    for (const item of snap.docs) {
      await deleteDoc(item.ref);
    }

    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increase,
        decrease,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
