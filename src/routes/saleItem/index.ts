import express from "express";

import { authenticateJWT } from "../../middlewares/authenticateJWT";

import {
  getSaleItems,
  getItemsBySale,
  getSaleItemById,
  deleteSaleItem
} from "./controllers";

const router = express.Router();


// =====================
// 📦 SALE ITEMS (ONLY)
// =====================

// 🔥 específico → general
router.get("/sale/:saleId", authenticateJWT, getItemsBySale);
router.get("/", authenticateJWT, getSaleItems);
router.get("/:id", authenticateJWT, getSaleItemById);
router.delete("/:id", authenticateJWT, deleteSaleItem);


export default router;