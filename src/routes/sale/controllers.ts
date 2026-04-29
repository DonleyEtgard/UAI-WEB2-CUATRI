import { Request, Response } from "express";
import SaleItem from "../../models/SaleItem";
import Product from "../../models/Product";
import Sale from "../../models/Sale";

// 🛒 CREAR VENTA
export const createSale = async (req: Request, res: Response) => {
  try {
    const { customer, user, paymentMethod, items, amountPaid = 0, notes } = req.body;

    if (!user || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    let total = 0;
    const productMap: any = {}; // 🔥 cache

    // 🔄 calcular total
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `No stock for ${product.name}`
        });
      }

      productMap[item.product] = product;
      total += product.price * item.quantity;
    }

    // 💵 cambio
    let change = 0;

    if (paymentMethod === "cash") {
      if (amountPaid === undefined || amountPaid === null) {
        return res.status(400).json({
          message: "Amount paid is required for cash"
        });
      }

      if (amountPaid < total) {
        return res.status(400).json({
          message: "Insufficient payment"
        });
      }

      change = amountPaid - total;
    }

    // 📊 status
    let status: "pending" | "paid" | "cancelled" = "pending";

    if (paymentMethod === "cash") {
      if (amountPaid >= total) status = "paid";
    } else {
      status = "paid";
    }

    // 📄 crear venta
    const sale = await Sale.create({
      customer,
      user,
      paymentMethod,
      total,
      amountPaid: paymentMethod === "cash" ? amountPaid : 0,
      change: paymentMethod === "cash" ? change : 0,
      status,
      notes
    });

    // 📦 crear items + actualizar stock
    for (const item of items) {
      const product = productMap[item.product];

      if (!product) continue;

      await SaleItem.create({
        sale: sale._id,
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
        productName: product.name
      });

      product.stock -= item.quantity;
      await product.save();
    }

    res.status(201).json({
      sale,
      change
    });

  } catch (error: any) {
    res.status(500).json({
      message: "Error creating sale",
      error: error.message
    });
  }
};


// 📌 OBTENER TODOS LOS ITEMS
export const getSaleItems = async (_req: Request, res: Response) => {
  try {
    const items = await SaleItem.find()
      .populate("product")
      .populate("sale")
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 ITEMS POR VENTA
export const getItemsBySale = async (req: Request, res: Response) => {
  try {
    const { saleId } = req.params;

    const items = await SaleItem.find({ sale: saleId })
      .populate("product");

    res.json(items);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// 📌 ITEM POR ID
export const getSaleItemById = async (req: Request, res: Response) => {
  try {
    const item = await SaleItem.findById(req.params.id)
      .populate("product")
      .populate("sale");

    if (!item) {
      return res.status(404).json({
        message: "SaleItem not found"
      });
    }

    res.json(item);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ ELIMINAR ITEM
export const deleteSaleItem = async (req: Request, res: Response) => {
  try {
    const item = await SaleItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "SaleItem not found"
      });
    }

    res.json({ message: "SaleItem deleted" });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};