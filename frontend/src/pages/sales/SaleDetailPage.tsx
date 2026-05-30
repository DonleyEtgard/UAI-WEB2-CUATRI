import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

export interface SaleItem {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  _id: string;
  customerId: string;
  totalAmount: number;
  amountPaid: number;
  status: string;
  currency: string;
  createdAt: string;
  items: SaleItem[];
}

const SaleDetailPage = () => {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================
  // LOAD
  // ==========================
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await API.get<Sale>(`/sales/${id}`);
        setSale(res.data);
      } catch (err) {
        console.error("Error loading sale:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async () => {
    if (!id || deleting) return;

    const ok = confirm("¿Eliminar venta?");
    if (!ok) return;

    try {
      setDeleting(true);
      await API.delete(`/sales/${id}`);
      navigate("/sales");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================
  // METRICS
  // ==========================
  const metrics = useMemo(() => {
    if (!sale) return null;

    const subtotal = sale.items.reduce(
      (acc: number, i: SaleItem) => acc + i.totalPrice,
      0
    );

    const avgItem = subtotal / sale.items.length || 0;

    const change = sale.amountPaid - sale.totalAmount;

    return {
      subtotal,
      avgItem,
      change,
      profitEstimate: subtotal * 0.25, // simulación (ejemplo ERP)
    };
  }, [sale]);

  // ==========================
  // SIMPLE CHART DATA
  // ==========================
  const chartData = useMemo(() => {
    if (!sale) return [];

    return sale.items.map((i: SaleItem) => ({
      name: i.productName || i.productId,
      value: i.totalPrice,
    }));
  }, [sale]);

  // ==========================
  // LOADING
  // ==========================
  if (loading) return <p>Cargando...</p>;
  if (!sale || !metrics) return <div className="p-10 text-center">Venta no encontrada.</div>;

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Detalle de Venta #{sale._id.slice(-6)}</h1>

      {/* ===================== */}
      {/* HEADER INFO */}
      {/* ===================== */}
      <div className="card">
        <p>Cliente: {sale.customerId}</p>
        <p>Total: {sale.totalAmount}</p>
        <p>Pagado: {sale.amountPaid}</p>
        <p>Vuelto: {metrics.change}</p>
        <p>Estado: {sale.status}</p>
        <p>Moneda: {sale.currency}</p>
        <p>
          Fecha: {new Date(sale.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* ===================== */}
      {/* KPI SECTION */}
      {/* ===================== */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="card">
          <p>Subtotal Items</p>
          <h2>{metrics.subtotal}</h2>
        </div>

        <div className="card">
          <p>Promedio por item</p>
          <h2>{metrics.avgItem.toFixed(2)}</h2>
        </div>

        <div className="card">
          <p>Ganancia estimada</p>
          <h2>{metrics.profitEstimate.toFixed(2)}</h2>
        </div>
      </div>

      {/* ===================== */}
      {/* ITEMS TABLE */}
      {/* ===================== */}
      <h3>Items</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {sale.items.map((i: SaleItem, idx: number) => (
            <tr key={idx}>
              <td>{i.productName || i.productId}</td>
              <td>{i.quantity}</td>
              <td>{i.unitPrice}</td>
              <td>{i.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===================== */}
      {/* MINI CHART (SVG BAR) */}
      {/* ===================== */}
      <div className="card mt-6">
        <h3>Distribución de venta (visual)</h3>

        <svg width="100%" height="200">
          {chartData.map((item: { name: string; value: number }, index: number) => {
            const barWidth = 40;
            const gap = 20;
            const maxHeight = 150;
            const maxValue = Math.max(
              ...chartData.map((d: { value: number }) => d.value)
            );

            const height =
              (item.value / maxValue) * maxHeight;

            return (
              <g key={index}>
                <rect
                  x={index * (barWidth + gap)}
                  y={200 - height}
                  width={barWidth}
                  height={height}
                  fill="#4f46e5"
                />

                <text
                  x={index * (barWidth + gap)}
                  y={195}
                  fontSize="10"
                >
                  {item.name.slice(0, 5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ===================== */}
      {/* ACTIONS */}
      {/* ===================== */}
      <div className="flex gap-4 mt-6">
        <button onClick={() => navigate("/sales")}>
          Volver
        </button>

        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
};

export default SaleDetailPage;