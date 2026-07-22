import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MyDownloads() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const user = auth.currentUser;

    if (!user) return;

    const snap = await getDocs(collection(db, "users", user.uid, "orders"));

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(data.filter((o) => o.status === "Delivered"));
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">My Downloads</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl p-10 text-center">
          <h2 className="text-2xl">No Delivered Products Yet</h2>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>

              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-800 py-4"
                >
                  <div>
                    <h3 className="font-bold">{item.title}</h3>

                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>

                  {item.downloadUrl ? (
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-red-400">File Not Uploaded</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
