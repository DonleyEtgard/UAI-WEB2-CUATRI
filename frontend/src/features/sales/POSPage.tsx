import { useEffect, useState } from "react";
import { useProducts } from "../products/hooks";
import { useCreateSale, useSales } from "./hooks";
import { useAuth } from "../../context/AuthContext";

type CartItem = {
  product: any;
  quantity: number;
};

const POSPage = () => {
  const { products, reload: loadProducts } = useProducts();
  const { handleCreate, loading } = useCreateSale();
  const { reload: reloadSales } = useSales();
  const { user } = useAuth();

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
      if (existing.quantity >= product.stock) {
      return;
        }

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
  
  const totalItems = cart.reduce(
  (acc, item) => acc + item.quantity,
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
      await handleCreate({
        user: user?._id || "",
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
      reloadSales();
      loadProducts();

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* 🟦 SECCIÓN PRODUCTOS */}
      <div className="flex-1 flex flex-col min-h-0 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Punto de Venta</h1>
            <p className="text-sm text-zinc-400">Selecciona productos para la venta</p>
          </div>

          <button
            onClick={loadProducts}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
            title="Recargar productos"
          >
            🔄
          </button>
        </div>

        {products.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 font-medium">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            {products.map((p: any) => (
              <div
                key={p._id}
                onClick={() => addToCart(p)}
                className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-zinc-900 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{p.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {p.stock > 0 ? `Stock: ${p.stock}` : 'Sin Stock'}
                  </span>
                </div>
                <p className="text-2xl font-black text-indigo-400">${p.price.toFixed(2)}</p>
                <button className="mt-4 w-full py-2 bg-zinc-800 text-zinc-300 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm font-bold">
                  Añadir +
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🟩 SECCIÓN CARRITO Y PAGO */}
      <div className="w-[400px] bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛒 Detalle de Venta
          </h2>
        </div>

        {/* Items del Carrito */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <span className="text-6xl mb-4">🛒</span>
              <p className="font-medium">Carrito vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product._id} className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-3 flex justify-between items-center group">
                <div className="flex-1">
                  <p className="text-sm font-bold text-zinc-200">{item.product.name}</p>
                  <p className="text-xs text-zinc-500">{item.quantity} x ${item.product.price.toFixed(2)}</p>
                  <p className="text-sm font-black text-indigo-400 mt-1">${(item.quantity * item.product.price).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => decreaseQty(item.product._id)} className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs">➖</button>
                  <span className="w-8 text-center font-bold text-sm text-white">{item.quantity}</span>
                  <button onClick={() => addToCart(item.product)} className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs">➕</button>
                  <button onClick={() => removeItem(item.product._id)} className="ml-2 w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-500/10 rounded-lg">✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen y Checkout */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-zinc-400 font-medium">
              <span>Artículos:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-3xl font-black text-emerald-400">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="grid grid-cols-3 gap-2">
              {(['cash', 'card', 'transfer'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                    paymentMethod === m 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {m === 'cash' ? 'Efectivo' : m === 'card' ? 'Tarjeta' : 'Transf.'}
                </button>
              ))}
            </div>

            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Monto recibido..."
                  value={amountPaid || ''}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 
                  text-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <div className="flex justify-between px-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Cambio:</span>
                  <span className="text-sm font-bold text-emerald-400">${Math.max(change, 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0 || (paymentMethod === 'cash' && amountPaid < total)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            {loading ? "Procesando..." : "FINALIZAR VENTA"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSPage;