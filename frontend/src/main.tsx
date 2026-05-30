// ============================================================================
// MAIN.TSX - Application Entry Point
// ============================================================================

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { registerServiceWorker } from "./pwa/registerServiceWorker";
import { AuthProvider } from "./context/AuthContext";
import { GlobalSearchProvider } from "./context/GlobalSearchContext";
import { BrowserRouter } from "react-router-dom";

createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <GlobalSearchProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalSearchProvider>
    </AuthProvider>
  </React.StrictMode>
);

// ============================================================================
// SERVICE WORKER
// ============================================================================

registerServiceWorker();