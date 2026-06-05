import express from "express";
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


// ================= MIDDLEWARES =================
import { authenticateFirebase } from "./middlewares/authenticateFirebase";
import {
  authorizeAdminOrSuperadmin,
  authorizeSuperadminOnly,
} from "./middlewares/AuthorizeRole";

import { checkSubscription } from "./middlewares/checkSubscription";

// ================= DB =================
import connectDB from "./db";
import { createSuperadminIfNotExists } from "./seedSuperadmin";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ============================================================================
// GLOBAL MIDDLEWARES
// ============================================================================

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

// LOGGING
app.use((req, _res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
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

// ============================================================================
// PUBLIC ROUTES (SIN AUTH)
// ============================================================================

// si tenés auth login externo podrías ponerlo acá

// ============================================================================
// PROTECTED ROUTES (FIREBASE + MONGO)
// ============================================================================

// 🔐 USERS (RBAC completo)
app.use(
  "/api/users",
  authenticateFirebase,
  authorizeAdminOrSuperadmin,
  checkSubscription,
  userRoutes
);

// 🔐 PRODUCTS (solo admin o superadmin)
app.use(
  "/api/products",
  authenticateFirebase,
  authorizeAdminOrSuperadmin,
  checkSubscription,
  productRoutes
);

// 🔐 CUSTOMERS
app.use(
  "/api/customers",
  authenticateFirebase,
  authorizeAdminOrSuperadmin,
  checkSubscription,
  customerRoutes
);

// 🔐 SALES (employees incluidos)
app.use(
  "/api/sales",
  authenticateFirebase,
  checkSubscription,
  saleRoutes
);

// 🔐 SALE ITEMS
app.use(
  "/api/sale-items",
  authenticateFirebase,
  checkSubscription,
  saleItem
);


// 🔐 STOCK (solo admin/superadmin)
app.use(
  "/api/stock",
  authenticateFirebase,
  authorizeAdminOrSuperadmin,
  checkSubscription,
  stockRoutes
);


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