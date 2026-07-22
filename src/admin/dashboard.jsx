import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "Digital",
    price: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const snap = await getDocs(collection(db, "products"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setProducts(data);
  }

  async function addProduct(e) {
    e.preventDefault();

    // if (!form.title || !form.category || !form.price) {
    //   alert("Fill all fields");
    //   return;
    // }

    await addDoc(collection(db, "products"), {
      ...form,
      price: Number(form.price),
      createdAt: serverTimestamp(),
    });

    setForm({
      title: "",
      category: "",
      price: "",
      description: "",
    });

    loadProducts();
  }

  async function removeProduct(id) {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-gray-400 mt-2">Welcome back, Admin 👋</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl p-6 text-black shadow-lg">
                <h3 className="text-lg font-semibold">Products</h3>

                <h1 className="text-5xl font-black mt-4">{products.length}</h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h3 className="text-gray-400">Orders</h3>

                <h1 className="text-5xl font-black mt-4">0</h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h3 className="text-gray-400">Customers</h3>

                <h1 className="text-5xl font-black mt-4">0</h1>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
                <h3 className="text-gray-400">Revenue</h3>

                <h1 className="text-5xl font-black mt-4">₦0</h1>
              </div>
            </div>
          </>
        );
      case "products":
        return (
          <>
            <h1 className="text-3xl font-bold mb-6">Product Management</h1>

            <form
              onSubmit={addProduct}
              className="bg-gray-900 rounded-xl p-6 space-y-4"
            >
              <input
                type="text"
                placeholder="Product Name"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded-lg p-3"
              />

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
                className="w-full bg-black border border-gray-700 rounded-lg p-3"
              >
                <option>Digital</option>
                <option>Manual Service</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded-lg p-3"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full bg-black border border-gray-700 rounded-lg p-3 h-32"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value,
                  })
                }
                className="w-full bg-black border border-gray-700 rounded-lg p-3"
              />

              <button
                type="submit"
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold"
              >
                Add Product
              </button>
            </form>

            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Products</h2>

              {products.length === 0 ? (
                <p>No products added.</p>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-900 rounded-xl p-5 mb-5 flex gap-5"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-32 h-32 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{product.title}</h2>

                      <p className="text-gray-400">{product.category}</p>

                      <p className="text-green-400">{product.type}</p>

                      <p className="text-yellow-400 text-xl font-bold mt-2">
                        ₦{product.price}
                      </p>

                      <p className="mt-3">{product.description}</p>
                    </div>

                    <button
                      onClick={() => removeProduct(product.id)}
                      className="bg-red-600 px-5 rounded-lg h-12"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        );

      case "orders":
        return <h1 className="text-3xl font-bold">Orders</h1>;

      case "customers":
        return <h1 className="text-3xl font-bold">Customers</h1>;

      case "payments":
        return <h1 className="text-3xl font-bold">Payments</h1>;

      case "settings":
        return <h1 className="text-3xl font-bold">Settings</h1>;

      default:
        return null;
    }
  };
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-10">BLACK HUB</h1>

        <div className="space-y-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="w-full text-left hover:text-yellow-400"
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className="w-full text-left hover:text-yellow-400"
          >
            Products
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className="w-full text-left hover:text-yellow-400"
          >
            Orders
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className="w-full text-left hover:text-yellow-400"
          >
            Customers
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className="w-full text-left hover:text-yellow-400"
          >
            Payments
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className="w-full text-left hover:text-yellow-400"
          >
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
}