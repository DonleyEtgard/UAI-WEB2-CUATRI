import express from "express";

import { authenticateFirebase } from "../../middlewares/authenticateFirebase";

import {
  createSale,
  getSales,
  updateSaleStatus,
  getDailySales,
  getMonthlySales,
  getTopProducts,
  getSaleItems,
  getSaleById,
  getItemsBySale,
  getSaleItemById,
  getSummary,
  deleteSaleItem
} from "./controllers";

import {
  getTicket,
  sendTicketWhatsApp,
  sendTicketTelegram
} from "./ticket.controllers";

const router = express.Router();


// ======================================================
// 📊 STATS
// ======================================================

router.get(
  "/stats/daily",
  authenticateFirebase,
  getDailySales
);

router.get(
  "/stats/monthly",
  authenticateFirebase,
  getMonthlySales
);

router.get(
  "/stats/top-products",
  authenticateFirebase,
  getTopProducts
);

router.get("/sales/:id", getSaleById);

// ======================================================
// 🎟️ TICKET
// ======================================================

router.get(
  "/ticket/:id",
  authenticateFirebase,
  getTicket
);

router.get(
  "/summary",
  authenticateFirebase,
  getSummary
);

// ======================================================
// 📲 SHARE TICKET
// ======================================================

router.post(
  "/ticket/send-whatsapp",
  authenticateFirebase,
  sendTicketWhatsApp
);

router.post(
  "/ticket/send-telegram",
  authenticateFirebase,
  sendTicketTelegram
);


// ======================================================
// 🛒 SALES
// ======================================================

router.post(
  "/",
  authenticateFirebase,
  createSale
);

router.patch(
  "/:id/status",
  authenticateFirebase,
  updateSaleStatus
);

// ======================================================
// 📦 ITEMS
// ======================================================

router.get(
  "/items",
  authenticateFirebase,
  getSaleItems
);

router.get(
  "/",
  authenticateFirebase,
  getSales
);

router.get(
  "/items/sale/:saleId",
  authenticateFirebase,
  getItemsBySale
);

router.get(
  "/items/:id",
  authenticateFirebase,
  getSaleItemById
);

router.delete(
  "/items/:id",
  authenticateFirebase,
  deleteSaleItem
);

export default router;