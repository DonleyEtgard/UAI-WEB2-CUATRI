export type StockMovementType =
  | "in"        // ingreso (compra, devolución, ajuste positivo)
  | "out";      // salida (venta, daño, pérdida, ajuste negativo)

export type StockReason =
  | "sale"
  | "purchase"
  | "return"
  | "initial_stock"
  | "adjustment"
  | "damage"
  | "loss";

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string; // UI only

  quantity: number;

  type: StockMovementType;

  reason?: StockReason;

  /**
   * Link opcional a entidades externas
   * (saleId, purchaseId, etc)
   */
  referenceId?: string;

  createdAt: string;
}