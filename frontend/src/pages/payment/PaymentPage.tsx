import { useState } from "react";
import { useSubscriptionPayment } from "@/features/payments";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const {
    qr,
    loading,
    generateQR,
    confirmPayment,
    paymentUrl, 
  } = useSubscriptionPayment() as any; // Casting temporal si el hook no está actualizado en tipos

  const navigate = useNavigate();

  const [method, setMethod] = useState<
    "moncash" | "mercadopago" | "transfer"
  >("moncash");

  const handleGenerate = async () => {
    try {
      await generateQR(method);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async () => {
    try {
      const result = await confirmPayment(method);

      if (!result?.saleId) {
        alert("Pago confirmado pero no hay venta");
        return;
      }

      navigate(`/app/sales/${result.saleId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Pago de Suscripción</h1>

      <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-400">
          Método de pago
        </label>

        <select
          value={method}
          onChange={(e) =>
            setMethod(
              e.target.value as
                | "moncash"
                | "mercadopago"
                | "transfer"
            )
          }
          className="p-2 rounded text-black"
        >
          <option value="moncash">MonCash</option>
          <option value="mercadopago">Mercado Pago</option>
          <option value="transfer">Transferencia Bancaria</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 px-6 py-3 rounded-xl disabled:opacity-50"
      >
        {loading
          ? "Generando..."
          : "Generar QR / Pago"}
      </button>

      {qr && (
        <div className="mt-6 text-center">
          <p className="mb-2 text-gray-400">Escaneá o abre el pago:</p>

          {(method === "moncash" || method === "mercadopago") && qr && (
            <div className="bg-white p-4 rounded inline-block">
              <QRCodeCanvas 
                value={qr} 
                size={200}
                includeMargin={true}
                level="H"
              />
            </div>
          )}

          {method === "mercadopago" && paymentUrl && (
            <a
              href={paymentUrl}
              target="_blank"
              rel="noreferrer"
              className="block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-center"
            >
              Abrir pago en Mercado Pago
            </a>
          )}

          <button
            onClick={handleConfirm}
            className="mt-4 bg-green-600 px-6 py-2 rounded"
          >
            Confirmar pago
          </button>
        </div>
      )}
    </div>
  );
}