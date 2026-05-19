import express from "express";
import mongoose from "mongoose";
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
import ticketRoutes from "./routes/sale/ticket.routes";

// ================= CONFIG =================
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ================= MIDDLEWARES =================
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : ['http://localhost:5173'], // configure allowed origins
  credentials: true
}));
app.use(express.json());

// (Opcional PRO) logging básico
app.use((req, _res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
  next();
});

// ================= ROUTES =================
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/tickets", ticketRoutes); // 👈 separado como módulo limpio

// ================= HEALTH CHECK =================
app.get("/", (_req, res) => {
  res.json({
    message: "🚀 API funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      customers: "/api/customers",
      sales: "/api/sales",
      stock: "/api/stock",
      tickets: "/api/tickets",
    },
  });
});

// ================= DATABASE =================
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("❌ MONGO_URI missing in environment variables");
    }

    await mongoose.connect(uri);

    console.log("🟢 MongoDB connected successfully");
  } catch (err) {
    console.error("🔴 MongoDB connection error:", err);
    process.exit(1); // 👈 PRO: corta si falla DB
  }
};

// ================= START SERVER =================
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

startServer();