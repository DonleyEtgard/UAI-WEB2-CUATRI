import { Response } from "express";

import Sale from "../../models/Sale";
import SaleItem from "../../models/SaleItem";
import User from "../../models/User";
import type { AuthRequest } from "../../types/auth";

const getOwnerAdmin = (req: AuthRequest) =>
  req.dbUser?.ownerAdmin || req.dbUser?._id;

const getSaleScope = async (req: AuthRequest, extra: Record<string, any> = {}) => {
  if (req.dbUser?.role === "superadmin") return extra;

  const ownerAdmin = getOwnerAdmin(req);
  const orgUsers = await User.find({
    $or: [
      { _id: ownerAdmin },
      { ownerAdmin },
      { createdBy: ownerAdmin },
    ],
  }).select("_id");

  const orgUserIds = orgUsers.map((user) => user._id);

  return {
    ...extra,
    $or: [
      { ownerAdmin },
      { createdBy: { $in: orgUserIds } },
      { user: { $in: orgUserIds } },
    ],
  };
};


// ======================================================
// 🎟️ OBTENER TICKET
// ======================================================

export const getTicket = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    // ✅ VENTA
    const sale = await Sale.findOne(await getSaleScope(req, {
      _id: id
    }))
      .populate("customer", "name phone")
      .populate("user", "name email")
      .lean();

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found"
      });
    }

    // ✅ ITEMS
    const items = await SaleItem.find({
      sale: sale._id
    })
      .populate("product", "name barcode")
      .sort({ createdAt: 1 })
      .lean();

    // ✅ RESPUESTA
    res.json({
      sale,
      items
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error generating ticket",
      error: error.message
    });
  }
};


// ======================================================
// 📲 ENVIAR TICKET POR WHATSAPP
// ======================================================

export const sendTicketWhatsApp = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { saleId } = req.body;

    const url =
      `http://localhost:5173/app/sales/ticket/${saleId}`;

    const message = `
🧾 Ticket de compra

Ver ticket:
${url}
`;

    const whatsappUrl =
      `https://wa.me/?text=` +
      encodeURIComponent(message);

    res.json({
      whatsappUrl
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
// 📨 ENVIAR TICKET POR TELEGRAM
// ======================================================

export const sendTicketTelegram = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { saleId } = req.body;

    if (!saleId) {
      return res.status(400).json({
        message: "saleId is required"
      });
    }

    // ✅ URL DEL TICKET
    const url = `https://tuapp.com/ticket/${saleId}`;

    // ✅ MENSAJE
    const message = `
🧾 Ticket de compra

Ver ticket:
${url}
`;

    // ✅ LINK TELEGRAM
    const telegramUrl =
      `https://t.me/share/url?url=${encodeURIComponent(url)}` +
      `&text=${encodeURIComponent(message)}`;

    res.json({
      telegramUrl
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};
