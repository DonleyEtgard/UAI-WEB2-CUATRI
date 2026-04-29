import { Request, Response } from "express";
import Sale from "../../models/Sale";
import SaleItem from "../../models/SaleItem";

export const getTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findById(id)
      .populate("customer")
      .populate("user");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const items = await SaleItem.find({ sale: sale._id }).populate("product");

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