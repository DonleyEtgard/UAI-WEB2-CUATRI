import { Request, Response } from "express";

import Sale from "../../models/Sale";
import SaleItem from "../../models/SaleItem";


// ======================================================
// 🎟️ OBTENER TICKET
// ======================================================

export const getTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // ✅ VENTA
    const sale = await Sale.findById(id)
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
  req: Request,
  res: Response
) => {
  try {
    const { saleId, phone } = req.body;

    if (!saleId || !phone) {
      return res.status(400).json({
        message: "saleId and phone are required"
      });
    }

    // ✅ URL DEL TICKET
    const url =
         `http://localhost:5173/app/sales/ticket/${saleId}`;
         
    // ✅ MENSAJE
    const message = `
🧾 Ticket de compra

Ver ticket:
${url}
`;

    // ✅ LINK WHATSAPP
    const whatsappUrl =
      `https://wa.me/${phone}?text=` +
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
  req: Request,
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