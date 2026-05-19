import { usePayment } from "./hooks";

const PaymentPage = () => {
  const { generateQR, qr, pay, loading } = usePayment();

  return (
    <div>
      <h1>Paiement</h1>

      <button onClick={generateQR}>
        Creer MonCash QR
      </button>

      {qr && (
        <div>
          <p>Scan le QR:</p>
          <p>{qr}</p>
        </div>
      )}

      <button onClick={() => pay("moncash")}>
       Payment 
      </button>

      {loading && <p>Processing...</p>}
    </div>
  );
};

export default PaymentPage;