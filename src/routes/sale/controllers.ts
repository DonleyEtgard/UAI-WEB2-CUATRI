import mongoose from "mongoose";
import { Request, Response } from "express";

import SaleItem from "../../models/SaleItem";
import Product from "../../models/Product";
import Sale from "../../models/Sale";
import StockMovement from "../../models/StockMovement";
import type { AuthRequest } from "../../types/auth";

// ======================================================
// 🛒 CREAR VENTA
// ======================================================

export const createSale = async (
  req: AuthRequest,
  res: Response
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customer,
      paymentMethod,
      items,
      amountPaid = 0,
      notes
    } = req.body;

    const user = req.dbUser?._id;

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error("Missing required fields");
    }

    let total = 0;
    const productMap: any = {};

    // =========================
    // VALIDAR PRODUCTOS
    // =========================
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) throw new Error("Product not found");

      if (product.stock < item.quantity) {
        throw new Error(`No stock for ${product.name}`);
      }

      productMap[item.product] = product;
      total += product.price * item.quantity;
    }

    // =========================
    // CASH LOGIC
    // =========================
    let change = 0;

    if (paymentMethod === "cash") {
      if (amountPaid < total) {
        throw new Error("Insufficient payment");
      }
      change = amountPaid - total;
    }

    // =========================
    // CREATE SALE
    // =========================
    const sale = await Sale.create(
      [
        {
          customer,
          user,
          paymentMethod,
          total,
          amountPaid: paymentMethod === "cash" ? amountPaid : 0,
          change,
          status: "paid",
          notes
        }
      ],
      { session }
    );

    const saleId = sale[0]._id;

    // =========================
    // ITEMS + STOCK
    // =========================
    for (const item of items) {
      const product = productMap[item.product];
      if (!product) continue;

      await SaleItem.create(
        [
          {
            sale: saleId,
            product: product._id,
            quantity: item.quantity,
            price: product.price,
            subtotal: product.price * item.quantity,
            productName: product.name
          }
        ],
        { session }
      );

      product.stock -= item.quantity;
      await product.save({ session });

      await StockMovement.create(
        [
          {
            product: product._id,
            type: "out",
            quantity: item.quantity,
            user,
            reason: "sale",
            sale: saleId,
            stockAfter: product.stock
          }
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      sale: sale[0],
      change
    });

  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// 🔄 OBTENER VENTAS
// ======================================================

export const getSales = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const sales = await Sale.find()
      .populate("customer")
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: sales
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// 📊 STATS
// ======================================================

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

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findById(id)
      .populate("customer")
      .populate("user");

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found"
      });
    }

    const items = await SaleItem.find({ sale: id });

    res.json({
      ...sale.toObject(),
      items
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMonthlySales = async (_req: Request, res: Response) => {
  try {
    const start = new Date();
    start.setDate(1);
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

export const getTopProducts = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const topProducts = await SaleItem.aggregate([
      {
        $group: {
          _id: "$product",
          totalSold: {
            $sum: "$quantity"
          }
        }
      },
      {
        $sort: {
          totalSold: -1
        }
      },
      {
        $limit: 10
      }
    ]);

    res.json(topProducts);

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
// 🔄 ACTUALIZAR STATUS
// ======================================================

export const updateSaleStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const sale = await Sale.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found"
      });
    }

    res.json(sale);

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ======================================================
// 📦 ITEMS
// ======================================================

export const getSaleItems = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const items = await SaleItem.find()
      .populate("product")
      .populate("sale")
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const getItemsBySale = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { saleId } = req.params;

    const items = await SaleItem.find({
      sale: saleId
    }).populate("product");

    res.json(items);

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const getSaleItemById = async (
  req: AuthRequest,
  res: Response
) => {
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
    res.status(500).json({
      message: error.message
    });
  }
};

export const getSummary = async (
  req: AuthRequest,
  res: Response
) => {
  try {
     
    const userId = req.dbUser?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user identification"
      });
    }
     
    // Ventas del usuario
    const sales = await Sale.find({
      user: userId,
      status: "paid"
    });

    const revenue = sales.reduce(
      (acc, sale) => acc + sale.total,
      0
    );

    const salesCount = sales.length;

    const avgTicket =
      salesCount > 0
        ? revenue / salesCount
        : 0;

    // ==========================
    // TOP PRODUCTOS
    // ==========================

    const topProducts = await SaleItem.aggregate([
      {
        $lookup: {
          from: "sales",
          localField: "sale",
          foreignField: "_id",
          as: "saleData"
        }
      },
      {
        $unwind: "$saleData"
      },
      {
        $match: {
          "saleData.user":
            new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: "$productName",
          quantity: {
            $sum: "$quantity"
          },
          revenue: {
            $sum: "$subtotal"
          }
        }
      },
      {
        $sort: {
          quantity: -1
        }
      },
      {
        $limit: 10
      }
    ]);

    // ==========================
    // VENTAS POR MES
    // ==========================

    const monthlySales =
      await Sale.aggregate([
        {
          $match: {
            user:
              new mongoose.Types.ObjectId(
                userId
              )
          }
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt"
              },
              month: {
                $month: "$createdAt"
              }
            },
            totalRevenue: {
              $sum: "$total"
            },
            salesCount: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ]);

    res.json({
      success: true,
      data: {
        revenue,
        salesCount,
        avgTicket,
        topProducts,
        monthlySales
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// ❌ ELIMINAR ITEM
// ======================================================

export const deleteSaleItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const item = await SaleItem.findByIdAndDelete(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        message: "SaleItem not found"
      });
    }

    res.json({
      message: "SaleItem deleted"
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message
    });
  }
};