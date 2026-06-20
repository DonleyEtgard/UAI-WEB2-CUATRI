import React, { useEffect, useState } from "react";

// Evento de instalación de PWA
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();

      console.log("✅ PWA instalable detectada");

      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      console.log("🎉 PWA instalada");

      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  const onClick = async () => {
    // Si ya está instalada no hacer nada
    if (isInstalled) return;

    // Si el navegador no soporta instalación
    if (!deferredPrompt) {
      alert(
        "La instalación no está disponible en este navegador o dispositivo."
      );
      return;
    }

    try {
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("✅ Usuario aceptó instalar");
      } else {
        console.log("❌ Usuario canceló instalación");
      }
    } catch (error) {
      console.error("Error al instalar PWA:", error);
    }
  };

  return (
    <button
      onClick={onClick}
      className="hover:text-emerald-300 transition bg-transparent border-none p-0 text-inherit font-inherit cursor-pointer"
      title={
        isInstalled
          ? "La aplicación ya está instalada"
          : "Instalar aplicación"
      }
    >
      {isInstalled ? "App Instalada ✅" : "Descargar App"}
    </button>
  );
};

export default InstallPWAButton;