import { useNavigate } from "react-router-dom";
import { useEmailVerification } from "./useEmailVerification";

const VerifyEmailPage = () => {
  const { resendEmail, checkStatus, loading, message } = useEmailVerification();
  const navigate = useNavigate();

  const handleVerified = async () => {
    const isVerified = await checkStatus();
    if (isVerified) {
      navigate("/app/dashboard");
    } else {
      alert("Tu correo aún no ha sido verificado. Por favor, revisa tu bandeja de entrada.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6">
        <div className="text-5xl">📧</div>
        <h1 className="text-2xl font-bold text-white">Verifica tu correo</h1>
        <p className="text-zinc-400">
          Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, haz clic en el enlace para activar tu cuenta.
        </p>
        
        {message && (
          <p className="text-sm font-medium text-indigo-400 bg-indigo-500/10 py-2 rounded-lg">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleVerified}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
          >
            Ya verifiqué mi correo
          </button>
          
          <button
            onClick={resendEmail}
            disabled={loading}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Reenviar correo de verificación"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;