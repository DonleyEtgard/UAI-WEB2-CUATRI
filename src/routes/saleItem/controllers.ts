import { Request, Response } from "express";
import SaleItem from "../../models/SaleItem";

// 📦 OBTENER TODOS
export const getSaleItems = async (_req: Request, res: Response) => {
  const items = await SaleItem.find()
    .populate("product")
    .populate("sale")
    .sort({ createdAt: -1 });

  res.json(items);
};

// 📦 POR SALE
export const getItemsBySale = async (req: Request, res: Response) => {
  const { saleId } = req.params;

  if (!saleId) {
    return res.status(400).json({ message: "saleId is required" });
  }

  const items = await SaleItem.find({ sale: saleId }).populate("product");

  res.json(items);
};

// 📦 POR ID
export const getSaleItemById = async (req: Request, res: Response) => {
  const item = await SaleItem.findById(req.params.id)
    .populate("product")
    .populate("sale");

  if (!item) {
    return res.status(404).json({ message: "SaleItem not found" });
  }

  res.json(item);
};

// ❌ DELETE
export const deleteSaleItem = async (req: Request, res: Response) => {
  const item = await SaleItem.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ message: "SaleItem not found" });
  }

  res.json({ message: "SaleItem deleted" });
};