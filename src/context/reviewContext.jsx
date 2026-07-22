import { createContext, useContext } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  async function addReview(productId, rating, comment) {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    await addDoc(collection(db, "products", productId, "reviews"), {
      userId: user.uid,
      email: user.email,
      rating,
      comment,
      createdAt: serverTimestamp(),
    });

    alert("Review Added Successfully");
  }

  return (
    <ReviewContext.Provider value={{ addReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export const useReview = () => useContext(ReviewContext);
