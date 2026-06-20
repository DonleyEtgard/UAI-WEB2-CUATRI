import type { StockMovement, CreateStockMovement } from "../../services/stock.service";

export type { StockMovement, CreateStockMovement };
export type StockMovementReason = "sale" | "restock" | "adjustment";