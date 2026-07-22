import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ProductForm({ refreshProducts }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    type: "digital",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.category ||
      !form.price ||
      !form.stock
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        createdAt: serverTimestamp(),
      });

      alert("✅ Product Added");

      setForm({
        title: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        type: "digital",
      });

      refreshProducts();
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={addProduct}
      className="bg-[#111827] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold mb-6">
        Add Product
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          name="title"
          placeholder="Product Name"
          value={form.title}
          onChange={handleChange}
          className="bg-black p-3 rounded border border-gray-700"
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="bg-black p-3 rounded border border-gray-700"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="bg-black p-3 rounded border border-gray-700"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="bg-black p-3 rounded border border-gray-700"
        />

      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="bg-black p-3 rounded border border-gray-700 w-full mt-4 h-32"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="bg-black p-3 rounded border border-gray-700 w-full mt-4"
      >
        <option value="digital">
          Digital Product
        </option>

        <option value="manual">
          Manual Service
        </option>
      </select>

      <button
        className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300"
      >
        Save Product
      </button>
    </form>
  );
}