import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

const SaleFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

 useEffect(() => {
  const fetchData = async () => {
    try {
      const [prodRes, custRes] = await Promise.all([
        API.get("/products"),
        API.get("/customers"),
      ]);

      const prods = prodRes.data?.data?.products || prodRes.data?.products || prodRes.data || [];
      const custs = custRes.data?.data?.customers || custRes.data?.customers || custRes.data || [];
      setProducts(prods);
      setCustomers(custs);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, []);

  const addToCart = (product: any) => {
    const exists = cart.find(item => item.productId === product._id);
    if (exists) {
      setCart(cart.map(item => 
        item.productId === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.productId !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || cart.length === 0) return alert("Completa los datos");
    
    try {
      setLoading(true);
      await API.post("/sales", {
        customerId: selectedCustomerId,
        items: cart.map(i => ({ product: i.productId, quantity: i.quantity, price: i.price })),
        total
      });
      navigate("/app/sales");
    } catch (err) {
      alert("Error al procesar la venta");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.isActive
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: Selection Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </span>
              Nueva Transacción
            </h2>

            {/* Customer Picker */}
            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Cliente</label>
              <select
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl 
                focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all 
                text-white appearance-none cursor-pointer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">Selecciona un cliente...</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name} {c.lastName} ({c.email})</option>
                ))}
              </select>
            </div>

            {/* Product Search */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Buscador de Productos</label>
              <div className="relative">
                <input
                  className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-600"
                  placeholder="Escribe el nombre del producto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="w-5 h-5 absolute left-4 top-3.5 text-zinc-600" fill="none" 
                stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                 strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 
              scrollbar-thin scrollbar-thumb-zinc-800">
                {searchQuery && filteredProducts.map(p => (
                  <button
                    key={p._id}
                    onClick={() => addToCart(p)}
                    className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800
                     rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left group"
                  >
                    <div>
                      <div className="font-medium text-zinc-200 group-hover:text-white">{p.name}</div>
                      <div className="text-xs text-zinc-500">${p.price} • Stock: {p.stock}</div>
                    </div>
                    <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Summary & Cart */}
        <div className="lg:w-[400px] space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
              <h3 className="font-bold text-white">Resumen de Venta</h3>
              <p className="text-xs text-zinc-500 mt-1">{cart.length} articulos seleccionados</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto max-h-[400px] space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3 opacity-20">🛒</div>
                  <p className="text-zinc-500 text-sm">El carrito está vacío</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-start group">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-zinc-200">{item.name}</div>
                      <div className="text-xs text-zinc-500">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm font-bold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[10px] text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-zinc-900/30 border-t border-zinc-800 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-medium">Subtotal</span>
                <span className="text-zinc-300">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-medium">Impuestos (0%)</span>
                <span className="text-zinc-300">$0.00</span>
              </div>
              <div className="flex justify-between items-end pt-3 border-t border-zinc-800">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-black text-indigo-400">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || cart.length === 0 || !selectedCustomerId}
                className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    Finalizar Venta
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/app/sales")}
                className="w-full py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest"
              >
                Cancelar Operación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleFormPage;