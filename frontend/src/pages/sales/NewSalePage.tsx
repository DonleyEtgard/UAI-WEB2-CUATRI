import { useState } from "react";
import API from "../../services/api";

const NewSalePage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const addItem = () => {
    setItems([...items, { product: "", quantity: 1 }]);
  };

  const createSale = async () => {
    await API.post("/sales", {
      user: "123",
      paymentMethod,
      items
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* LEFT - ITEMS */}
      <div className="col-span-2 bg-white p-6 rounded-xl shadow space-y-4">

        <h1 className="text-xl font-bold">New Sale</h1>

        {items.map((_item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="border p-2 rounded w-full"
              placeholder="Product"
            />
            <input
              type="number"
              className="border p-2 rounded w-24"
              placeholder="Qty"
            />
          </div>
        ))}

        <button
          onClick={addItem}
          className="bg-gray-200 px-3 py-2 rounded"
        >
          + Add Item
        </button>

      </div>

      {/* RIGHT - SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <h2 className="font-bold">Summary</h2>

        <select
          className="w-full border p-2 rounded"
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="transfer">Transfer</option>
        </select>

        <button
          onClick={createSale}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Confirm Sale
        </button>

      </div>

    </div>
  );
};

export default NewSalePage;