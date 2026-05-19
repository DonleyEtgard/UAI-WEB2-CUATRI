import express from "express";
import { authenticateJWT } from '../../middlewares/authenticateJWT';
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

router.post("/", authenticateJWT, createProduct);
router.get("/", authenticateJWT, getProducts);
router.get("/:id", authenticateJWT, getProductById);
router.put("/:id", authenticateJWT, updateProduct);
router.delete("/:id", authenticateJWT, deleteProduct);

// 🔥 stock
router.patch("/:id/stock", authenticateJWT, updateStock);

// 🔥 stats (NUEVO)
router.get("/:id/stats", authenticateJWT, getProductStats);

export default router;