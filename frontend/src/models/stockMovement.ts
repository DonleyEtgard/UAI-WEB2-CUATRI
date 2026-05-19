export type StockMovementType =
  | "in"        // ingreso (compra, devolución)
  | "out"       // salida (venta)
  | "adjustment"; // ajuste manual

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string; // útil para UI
  quantity: number;
  type: StockMovementType;
  reason?: StockReason;
  referenceId?: string; // 💥 link a saleId o purchaseId
  createdAt: string;
}

export type StockReason =
  | "sale"
  | "purchase"
  | "return"
  | "adjustment"
  | "damage"
  | "loss";

  export const calculateStock = (
  initialStock: number,
  movements: StockMovement[]
): number => {
  return movements.reduce((stock, movement) => {
    if (movement.type === "in") {
      return stock + movement.quantity;
    }

    if (movement.type === "out") {
      return stock - movement.quantity;
    }

    return stock; // adjustment lo podés manejar aparte
  }, initialStock);
};

export const getMovementsByProduct = (
  movements: StockMovement[],
  productId: string
) => {
  return movements.filter(m => m.productId === productId);
};