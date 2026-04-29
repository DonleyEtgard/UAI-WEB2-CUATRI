import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicket } from "./api"; // 🔥 ajusta ruta si hace falta

const TicketPage = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicket(id!);
      setTicket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadTicket();
  }, [id]);

  if (loading) return <p className="p-4">Cargando ticket...</p>;

  if (!ticket) return <p className="p-4">No se encontró el ticket</p>;

  const { sale, items } = ticket;

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded mt-6">

      {/* 🧾 HEADER */}
      <h2 className="text-2xl font-bold mb-2 text-center">
        🧾 Ticket de Venta
      </h2>

      <p className="text-sm text-gray-500 text-center mb-4">
        ID: {sale._id}
      </p>

      {/* 👤 INFO */}
      <div className="mb-4">
        <p><strong>Cliente:</strong> {sale.customer?.name || "Consumidor Final"}</p>
        <p><strong>Vendedor:</strong> {sale.user?.email}</p>
        <p><strong>Fecha:</strong> {new Date(sale.createdAt).toLocaleString()}</p>
      </div>

      {/* 📦 ITEMS */}
      <div className="border-t border-b py-2 mb-4">
        {items.map((item: any) => (
          <div key={item._id} className="flex justify-between text-sm py-1">
            <span>
              {item.quantity} x {item.product?.name || item.productName}
            </span>
            <span>${item.subtotal}</span>
          </div>
        ))}
      </div>

      {/* 💰 TOTAL */}
      <div className="mb-4">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${sale.total}</span>
        </div>

        {sale.paymentMethod === "cash" && (
          <>
            <div className="flex justify-between text-sm">
              <span>Pagado:</span>
              <span>${sale.amountPaid}</span>
            </div>

            <div className="flex justify-between text-sm text-green-600">
              <span>Cambio:</span>
              <span>${sale.change}</span>
            </div>
          </>
        )}
      </div>

      {/* 💳 MÉTODO */}
      <div className="mb-4">
        <p>
          <strong>Método de pago:</strong>{" "}
          {sale.paymentMethod}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          {sale.status}
        </p>
      </div>

      {/* 📝 NOTAS */}
      {sale.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Nota: {sale.notes}
          </p>
        </div>
      )}

      {/* 🖨️ BOTÓN IMPRIMIR */}
      <button
        onClick={() => window.print()}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Imprimir
      </button>

    </div>
  );
};

export default TicketPage;