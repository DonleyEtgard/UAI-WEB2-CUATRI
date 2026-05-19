import { useEffect, useState } from "react";
import { useProducts } from "../products/useProducts";
import { useSales } from "./hooks";

type CartItem = {
  product: any;
  quantity: number;
};

const POSPage = () => {
  const { products, loadProducts } = useProducts();
  const { createNewSale, loading, resetSale } = useSales();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [amountPaid, setAmountPaid] = useState(0);

  // 🔄 cargar productos
  useEffect(() => {
    loadProducts();
  }, []);

  // 🛒 agregar producto
  const addToCart = (product: any) => {
    const existing = cart.find((i) => i.product._id === product._id);

    if (existing) {
      setCart((prev) =>
        prev.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  // ➖ disminuir cantidad
  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product._id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // ❌ eliminar item
  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product._id !== id));
  };

  // 💰 total
  const total = cart.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const change = paymentMethod === "cash" ? amountPaid - total : 0;

  // 🧾 finalizar venta
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (paymentMethod === "cash" && amountPaid < total) {
      alert("Pago insuficiente");
      return;
    }

    try {
      await createNewSale({
        // Requiere que en el backend se use req.user.id (idealmente) o
        // que el frontend tome el user desde tu auth (JWT).
        // Mientras tanto, enviamos el id guardado localmente.
        user: JSON.parse(localStorage.getItem("user") || "null")?._id,
        paymentMethod,
        items: cart.map((i) => ({
          product: i.product._id,
          quantity: i.quantity
        })),
        amountPaid: paymentMethod === "cash" ? amountPaid : undefined
      });

      alert("Venta realizada correctamente ✅");

      // reset
      setCart([]);
      setAmountPaid(0);
      resetSale();

      // 🔄 recargar productos (por stock)
      loadProducts();

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen">

      {/* 🟦 PRODUCTOS */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Productos</h2>

        <div className="grid grid-cols-3 gap-4">
          {products.map((p: any) => (
            <div
              key={p._id}
              onClick={() => addToCart(p)}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-lg">${p.price}</p>
              <p className="text-sm text-gray-500">
                Stock: {p.stock}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🟩 CARRITO */}
      <div className="w-1/3 bg-gray-100 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Carrito</h2>

        <div className="flex-1 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.product._id} className="mb-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm">
                  {item.quantity} x ${item.product.price}
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => decreaseQty(item.product._id)}>➖</button>
                <button onClick={() => addToCart(item.product)}>➕</button>
                <button onClick={() => removeItem(item.product._id)}>❌</button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              No hay productos en el carrito
            </p>
          )}
        </div>

        {/* 💳 MÉTODO DE PAGO */}
        <div className="mt-4">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="w-full p-2 mb-2"
          >
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </select>

          {paymentMethod === "cash" && (
            <input
              type="number"
              placeholder="Monto recibido"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-full p-2"
            />
          )}
        </div>

        {/* 💰 TOTAL */}
        <div className="mt-4">
          <p className="text-lg font-bold">Total: ${total}</p>

          {paymentMethod === "cash" && (
            <p className="text-green-600">
              Cambio: ${change >= 0 ? change : 0}
            </p>
          )}
        </div>

        {/* ✅ BOTÓN */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-4 bg-green-500 text-white p-3 rounded hover:bg-green-600"
        >
          {loading ? "Procesando..." : "Finalizar venta"}
        </button>
      </div>
    </div>
  );
};

export default POSPage;