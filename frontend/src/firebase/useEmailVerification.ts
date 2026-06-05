import { useState } from "react";
import { auth } from "../firebase/config";
import { sendEmailVerificationEmail } from "../firebase/auth";

export const useEmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resendEmail = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await sendEmailVerificationEmail(auth.currentUser);
      setMessage("Enlace de verificación enviado con éxito.");
    } catch (error) {
      setMessage("Error al enviar el enlace. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    return auth.currentUser.emailVerified;
  };

  return {
    resendEmail,
    checkStatus,
    loading,
    message,
  };
};