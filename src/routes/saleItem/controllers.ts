import { Request, Response } from "express";
import SaleItem from "../../models/SaleItem";
import Product from "../../models/Product";
import Sale from "../../models/Sale";


// 🛒 CREAR VENTA
export const createSale = async (req: Request, res: Response) => {
  try {
    const { customer, user, paymentMethod, items, amountPaid, notes } = req.body;

    if (!user || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    let total = 0;

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

      total += product.price * item.quantity;
    }

    // 💰 comisión plataforma
    const commissionRate = 5;
    const platformFee = total * (commissionRate / 100);
    const netAmount = total - platformFee;

    // 💵 cambio
    let change = 0;

    if (paymentMethod === "cash") {
      if (!amountPaid || amountPaid < total) {
        return res.status(400).json({
          message: "Insufficient payment"
        });
      }

      change = amountPaid - total;
    }

    // 📄 crear venta
    const sale = await Sale.create({
      customer,
      user,
      paymentMethod,
      total,
      platformFee,
      netAmount,
      notes
    });

    // 📦 crear items + actualizar stock
    for (const item of items) {
      const product = await Product.findById(item.product);

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

export const getMonthlySales = async (_req: Request, res: Response) => {
  res.json({ message: "monthly" });
};

export const getTopProducts = async (_req: Request, res: Response) => {
  res.json({ message: "top products" });
};

export const updateSaleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const sale = await Sale.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);

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
// 📊 VENTAS DEL DÍA
export const getDailySales = async (_req: Request, res: Response) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const sales = await Sale.find({
      createdAt: { $gte: start }
    });

    const total = sales.reduce((acc, s: any) => acc + (s.total || 0), 0);

    res.json({ total, count: sales.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
