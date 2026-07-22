import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export default function Downloads() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadDownloads();
  }, []);

  async function loadDownloads() {
    const user = auth.currentUser;

    if (!user) return;

    const snap = await getDocs(collection(db, "orders"));

    const data = snap.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (order) =>
          order.userId === user.uid &&
          order.status === "Delivered"
      );

    setOrders(data);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold mb-10">
        My Downloads
      </h1>

      {orders.length === 0 ? (

        <div className="bg-gray-900 rounded-2xl p-12 text-center">

          <h2 className="text-2xl font-bold">
            Nothing Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Delivered products will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-gray-900 rounded-2xl p-6"
            >

              <h2 className="text-2xl font-bold mb-6">
                Order #{order.id}
              </h2>

              {order.items.map((item, index) => (

                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-800 py-5"
                >

                  <div>

                    <h3 className="font-bold">
                      {item.title}
                    </h3>

                    <p className="text-gray-400">
                      {item.category}
                    </p>

                  </div>

                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
                  >
                    Download
                  </a>

                </div>

              ))}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}