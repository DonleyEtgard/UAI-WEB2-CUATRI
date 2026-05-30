import { useSubscriptionPayment } from "@/features/payments";

export default function PaymentPage() {
  const { 
    qr, 
    loading, 
    generateQR, 
    confirmPayment 
  } = useSubscriptionPayment();

  const handleConfirm = async () => {
    try {
      await confirmPayment("moncash");
      alert("Suscripción activada");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6">Pago de Suscripción</h1>

      <button
        onClick={generateQR}
        disabled={loading}
        className="bg-blue-600 px-6 py-3 rounded-xl disabled:opacity-50"
      >
        {loading ? "Generando..." : "Generar QR"}
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