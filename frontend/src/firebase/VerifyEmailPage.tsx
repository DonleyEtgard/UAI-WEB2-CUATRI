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
      // Se mantiene el alert, pero se podría reemplazar por un modal si existiera.
      alert(
        "Tu correo aún no ha sido verificado. Por favor, revisa tu bandeja de entrada (y la carpeta de spam)."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4 font-sans">
      <div className="max-w-md w-full bg-[#1E293B] border border-[#2563EB]/20 rounded-2xl shadow-2xl shadow-[#2563EB]/10 p-8 text-center space-y-6 transform transition-all hover:scale-[1.01]">
        <div className="flex justify-center items-center w-16 h-16 bg-[#2563EB]/10 rounded-full mx-auto border-2 border-[#2563EB]/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#2563EB]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#F8FAFC]">
          Verifica tu dirección de correo
        </h1>
        <p className="text-[#94A3B8] text-base">
          Hemos enviado un enlace de verificación a tu correo. Por favor, haz
          clic en él para activar tu cuenta y empezar a usar la plataforma.
        </p>

        {message && (
          <p className="text-sm font-medium text-[#7C3AED] bg-[#7C3AED]/10 py-2.5 px-4 rounded-lg border border-[#7C3AED]/20">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-4 pt-4">
          <button
            onClick={handleVerified}
            className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Ya verifiqué mi correo
          </button>

          <button
            onClick={resendEmail}
            disabled={loading}
            className="w-full py-3 bg-transparent hover:bg-[#94A3B8]/10 text-[#94A3B8] font-semibold rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Reenviar correo de verificación"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;