import express from "express";
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

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// 🔥 stock
router.patch("/:id/stock", updateStock);

// 🔥 stats (NUEVO)
router.get("/:id/stats", getProductStats);

export default router;