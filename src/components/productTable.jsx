import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProductTable({ products, refreshProducts }) {
  async function remove(id) {
    if (!confirm("Delete this product?")) return;

    await deleteDoc(doc(db, "products", id));

    refreshProducts();
  }

  return (
    <div className="bg-[#111827] rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Products</h2>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3">Product</th>

            <th className="text-left">Category</th>

            <th className="text-left">Price</th>

            <th className="text-left">Stock</th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-800">
              <td className="py-4">{product.title}</td>

              <td>{product.category}</td>

              <td>₦{product.price}</td>

              <td>{product.stock}</td>

              <td>
                <button
                  onClick={() => remove(product.id)}
                  className="bg-red-600 px-3 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
