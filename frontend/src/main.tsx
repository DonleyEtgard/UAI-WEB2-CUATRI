// ============================================================================
// MAIN.TSX - Application Entry Point
// ============================================================================

import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router/AppRouter";
import "./styles/index.css";
import { registerServiceWorker } from "./pwa/registerServiceWorker";
import { AuthProvider } from "./context/AuthContext";

createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);

// ============================================================================
// SERVICE WORKER
// ============================================================================

registerServiceWorker();