import express from "express";

import {
  createSale,
  getSaleItems,
  getItemsBySale,
  getSaleItemById,
  deleteSaleItem
} from "./controllers";

import {
  getDailySales,
  getMonthlySales,
  getTopProducts,
  updateSaleStatus
} from "./controllers";

import { getTicket } from "../sale/ticket.controllers";

const router = express.Router();

// 📊 STATS
router.get("/stats/daily", getDailySales);
router.get("/stats/monthly", getMonthlySales);
router.get("/stats/top-products", getTopProducts);

// 🧾 TICKET
router.get("/ticket/:id", getTicket);

// 🛒 VENTA
router.post("/", createSale);

// 🔄 CAMBIAR ESTADO (IMPORTANTE)
router.patch("/:id/status", updateSaleStatus);

// 📦 ITEMS
router.get("/items", getSaleItems);
router.get("/items/sale/:saleId", getItemsBySale);
router.get("/items/:id", getSaleItemById);
router.delete("/items/:id", deleteSaleItem);

export default router;