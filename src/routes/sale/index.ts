import express from "express";
import { authenticateJWT } from '../../middlewares/authenticateJWT';

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
router.get("/stats/daily", authenticateJWT, getDailySales);
router.get("/stats/monthly", authenticateJWT, getMonthlySales);
router.get("/stats/top-products", authenticateJWT, getTopProducts);

// 🧾 TICKET
router.get("/ticket/:id", authenticateJWT, getTicket);

// 🛒 SALES
router.post("/", authenticateJWT, createSale);
router.patch("/:id/status", authenticateJWT, updateSaleStatus);

// 📦 ITEMS
router.get("/items", authenticateJWT, getSaleItems);
router.get("/items/sale/:saleId", authenticateJWT, getItemsBySale);
router.get("/items/:id", authenticateJWT, getSaleItemById);
router.delete("/items/:id", authenticateJWT, deleteSaleItem);

export default router;