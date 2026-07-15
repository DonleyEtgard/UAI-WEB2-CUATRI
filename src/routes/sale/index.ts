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
  getDailySales
);

router.get(
  "/stats/monthly",
  getMonthlySales
);

router.get(
  "/stats/top-products",
  getTopProducts
);

router.get(
  "/",
  getSales
);

// ======================================================
// 🎟️ TICKET
// ======================================================

router.get(
  "/ticket/:id",
  getTicket
);

router.get(
  "/summary",
  getSummary
);

// ======================================================
// 📲 SHARE TICKET
// ======================================================

router.post(
  "/ticket/send-whatsapp",
  sendTicketWhatsApp
);

router.post(
  "/ticket/send-telegram",
  sendTicketTelegram
);


// ======================================================
// 🛒 SALES
// ======================================================

router.post(
  "/",
  createSale
);

router.patch(
  "/:id/status",
  updateSaleStatus
);

// ======================================================
// 📦 ITEMS
// ======================================================

router.get(
  "/items",
  getSaleItems
);

router.get(
  "/items/sale/:saleId",
  getItemsBySale
);

router.get(
  "/items/:id",
  getSaleItemById
);

router.delete(
  "/items/:id",
  deleteSaleItem
);

router.get("/:id",
  getSaleById
);


export default router;