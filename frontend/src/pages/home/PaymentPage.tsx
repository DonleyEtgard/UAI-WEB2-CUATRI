import { useState } from "react";
import { paySubscription, createSubscriptionPayment } from "../../services/payments.service";

export default function PaymentPage() {
  const [qr, setQr] = useState<string | null>(null);
  const [_loading, setLoading] = useState(false);

  const handleQR = async () => {
    setLoading(true);
    try {
      const res = await createSubscriptionPayment();
      setQr(res.data.qr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await paySubscription("moncash");
      alert("Suscripción activada");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6">Pago de Suscripción</h1>

      <button
        onClick={handleQR}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        Generar QR
      </button>

      {qr && (
        <div className="mt-6 text-center">
          <p className="mb-2">Escaneá el QR:</p>
          <div className="bg-white text-black p-4 rounded">
            {qr}
          </div>

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