import express from "express";

import { authenticateFirebase } from "../../middlewares/authenticateFirebase";

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
router.get("/sale/:saleId", authenticateFirebase, getItemsBySale);
router.get("/", authenticateFirebase, getSaleItems);
router.get("/:id", authenticateFirebase, getSaleItemById);
router.delete("/:id", authenticateFirebase, deleteSaleItem);


export default router;