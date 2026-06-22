import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// ================= ROUTES =================
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import customerRoutes from "./routes/customer";
import saleRoutes from "./routes/sale";
import stockRoutes from "./routes/stockMovement";
import saleItem from "./routes/saleItem"; 
import dashboardRoutes from "./routes/dashboard";


// ================= MIDDLEWARES =================
import { authenticateFirebase } from "./middlewares/authenticateFirebase";
import {
  authorizeAdminOrSuperadmin,
  authorizeSuperadminOnly,
} from "./middlewares/AuthorizeRole";

import { checkSubscription } from "./middlewares/checkSubscription";
import { requireVerifiedEmail } from "./middlewares/requireVerifiedEmail";

// ================= DB =================
import connectDB from "./db";
import { createSuperadminIfNotExists } from "./seedSuperadmin";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ============================================================================
// GLOBAL MIDDLEWARES
// ============================================================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// FIX: Increase default JSON body parser limit to accommodate larger payloads
// (avoids PayloadTooLargeError when clients previously sent Base64 images)
app.use(express.json({ limit: "10mb" }));
// FIX: Also allow larger URL-encoded bodies for form submissions
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// FIX: Serve uploaded images from the uploads folder
app.use("/api/dashboard", dashboardRoutes);

console.log(
  "UPLOADS PATH:",
  path.join(process.cwd(), "src", "uploads")
);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src", "uploads"))
);

// LOGGING
app.use((req, _res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
  next();
});

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/", (_req, res) => {
  res.json({
    message: "🚀 API funcionando correctamente",
    version: "1.0.0",
  });
});

// 👇 AGREGALO ACÁ
app.get("/cors-test", (_req, res) => {
  res.json({
    success: true,
    message: "CORS OK",
  });
});


// ============================================================================
// PUBLIC ROUTES (SIN AUTH)
// ============================================================================

// si tenés auth login externo podrías ponerlo acá

// ============================================================================
// PROTECTED ROUTES (FIREBASE + MONGO)
// ============================================================================

// 🔐 USERS (RBAC completo)
app.use("/api/users", 
  authenticateFirebase, 
  userRoutes
);

// 🔐 PRODUCTS (solo admin o superadmin)
app.use(
  "/api/products",
  authenticateFirebase,
  requireVerifiedEmail,
  authorizeAdminOrSuperadmin,
  checkSubscription,
  productRoutes
);

// 🔐 CUSTOMERS
app.use(
  "/api/customers",
  authenticateFirebase,
  requireVerifiedEmail,
  authorizeAdminOrSuperadmin,
  checkSubscription,
  customerRoutes
);

// 🔐 SALES (employees incluidos)
app.use(
  "/api/sales",
  authenticateFirebase,
  requireVerifiedEmail,
  checkSubscription,
  saleRoutes
);

// 🔐 SALE ITEMS
app.use(
  "/api/sale-items",
  authenticateFirebase,
  requireVerifiedEmail,
  checkSubscription,
  saleItem
);


// 🔐 STOCK (solo admin/superadmin)
app.use(
  "/api/stock",
  authenticateFirebase,
  requireVerifiedEmail,
  authorizeAdminOrSuperadmin,
  checkSubscription,
  stockRoutes
);


// ============================================================================
// ERROR HANDLER
// ============================================================================

// FIX: Centralized error handler to return clear 413 for oversized payloads
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      message:
        "Payload too large. Use smaller payloads or upload images as files instead of Base64.",
    });
  }
  next(err);
});

// ============================================================================
// START SERVER
// ============================================================================

const startServer = async () => {
  await connectDB();

  // 🔥 CREA SUPERADMIN SI NO EXISTE
  await createSuperadminIfNotExists();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();
