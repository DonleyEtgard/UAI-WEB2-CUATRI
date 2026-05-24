import express from "express";
import { authenticateFirebase } from '../../middlewares/authenticateFirebase';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  getProductStats // 👈 agregar
} from "./controllers";

const router = express.Router();

router.post("/", authenticateFirebase, createProduct);
router.get("/", authenticateFirebase, getProducts);
router.get("/:id", authenticateFirebase, getProductById);
router.put("/:id", authenticateFirebase, updateProduct);
router.delete("/:id", authenticateFirebase, deleteProduct);

// 🔥 stock
router.patch("/:id/stock", authenticateFirebase, updateStock);

// 🔥 stats (NUEVO)
router.get("/:id/stats", authenticateFirebase, getProductStats);

export default router;