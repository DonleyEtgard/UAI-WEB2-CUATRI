import express from "express";
import { authenticateFirebase } from '../../middlewares/authenticateFirebase';

import {
  createSale,
  updateSaleStatus,
  getDailySales,
  getMonthlySales,
  getTopProducts,
  getSaleItems,
  getItemsBySale,
  getSaleItemById,
  deleteSaleItem
} from "./controllers";

import { getTicket } from "./ticket.controllers";

const router = express.Router();

// 📊 STATS
router.get("/stats/daily", authenticateFirebase, getDailySales);
router.get("/stats/monthly", authenticateFirebase, getMonthlySales);
router.get("/stats/top-products", authenticateFirebase, getTopProducts);

// 🧾 TICKET
router.get("/ticket/:id", authenticateFirebase, getTicket);

// 🛒 SALES
router.post("/", authenticateFirebase, createSale);
router.patch("/:id/status", authenticateFirebase, updateSaleStatus);

// 📦 ITEMS
router.get("/items", authenticateFirebase, getSaleItems);
router.get("/items/sale/:saleId", authenticateFirebase, getItemsBySale);
router.get("/items/:id", authenticateFirebase, getSaleItemById);
router.delete("/items/:id", authenticateFirebase, deleteSaleItem);

export default router;