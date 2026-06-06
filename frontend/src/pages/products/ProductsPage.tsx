import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import UiCard from "../../components/common/UiCard";
import DataGridWrapper from "../../components/common/DataGridWrapper";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import UiBadge from "../../components/common/UiBadge";

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(Array.isArray(res.data?.data?.products) ? res.data.data.products : []);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desea eliminar este producto?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando producto");
    } finally {
      setDeletingId(null);
    }
  };

  // KPIs
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 5).length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-zinc-950 text-zinc-100">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Productos</h1>
          <p className="text-sm text-zinc-400 mt-1">Gestiona tu inventario, precios y existencias.</p>
        </div>
        <button
          onClick={() => navigate("/app/products/new")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: totalProducts, color: "text-white" },
          { label: "Stock Bajo", value: lowStock, color: "text-amber-400" },
          { label: "Activos", value: activeProducts, color: "text-emerald-400" },
          { label: "Valor Inventario", value: `$${inventoryValue.toLocaleString()}`, color: "text-indigo-400" },
        ].map((kpi, i) => (
          <div key={i} className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
            <h2 className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</h2>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
          <h2 className="font-semibold text-lg text-white">Inventario Detallado</h2>
        <button
             onClick={loadProducts}
             className="w-8 h-8 flex items-center justify-center rounded-lg
             hover:bg-zinc-800 transition-colors
             text-zinc-400 hover:text-white"
             title="Recargar"
              >
             🔄
        </button>
        </div>

        <div className="p-4">
          {loading ? (
            <SkeletonLoader count={6} height={48} />
          ) : products.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No hay productos" description="Crea tu primer producto para comenzar a vender." actionLabel="Crear producto" onAction={() => navigate("/app/products/new")} />
            </div>
          ) : (
            <UiCard sx={{ p: 0 }}>
              <DataGridWrapper
                rows={products.map(p => ({ ...p, id: p._id }))}
                columns={[
                  { field: 'name', headerName: 'Producto', flex: 1, renderCell: (params: any) => (
                      <div style={{display:'flex', alignItems:'center', gap:12}}>
                        <div style={{width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', background:'#0f1724', borderRadius:8, color:'#9ca3af'}}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <div>
                          <div style={{fontWeight:600, color:'#fff'}}>{params.value}</div>
                          <div style={{fontSize:10, color:'#9ca3af', fontFamily:'ui-monospace'}}>{'SKU: ' + params.row.sku}</div>
                        </div>
                      </div>
                  )},
                  { field: 'category', headerName: 'Categoría', width: 140 },
                  { field: 'price', headerName: 'Precio', width: 120, valueFormatter: (v: any)=>`$${Number(v.value).toFixed(2)}` },
                  { field: 'stock', headerName: 'Stock', width: 120, renderCell: (params: any)=> {
                      const s = params.value;
                      const style = s < 5 ? {background:'rgba(239,68,68,0.08)', color:'#fb7185', border:'1px solid rgba(239,68,68,0.12)'} : s < 15 ? {background:'rgba(245,158,11,0.08)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.12)'} : {background:'rgba(16,185,129,0.08)', color:'#10b981', border:'1px solid rgba(16,185,129,0.12)'};
                      return <div style={{padding:'4px 8px', borderRadius:8, fontWeight:700, fontSize:12, ...style}}>{s + ' unidades'}</div>
                  }},
                  { field: 'isActive', headerName: 'Estado', width: 120, renderCell: (params: any)=> params.value ? <UiBadge label='Activo' color='success' /> : <UiBadge label='Oculto' color='default' /> },
                  { field: 'actions', headerName: 'Acciones', width: 120, sortable: false, renderCell: (params: any)=> (
                      <div style={{display:'flex', gap:8, justifyContent:'flex-end', width:'100%'}}>
                        <button onClick={() => navigate(`/app/products/edit/${params.row._id}`)} style={{background:'transparent', border:0, padding:6, borderRadius:8, color:'#9ca3af'}} title="Editar">✏️</button>
                        <button onClick={() => handleDelete(params.row._id)} disabled={deletingId === params.row._id} style={{background:'transparent', border:0, padding:6, borderRadius:8, color:'#9ca3af'}} title="Eliminar">{deletingId === params.row._id ? '...' : '🗑️'}</button>
                      </div>
                  )},
                ]}
                pageSize={10}
                onRowClick={(params:any)=> navigate(`/app/products/edit/${params.row._id}`)}
              />
            </UiCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;