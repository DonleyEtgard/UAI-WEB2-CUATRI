export interface SaleItem {
  _id?: string;

  productId: string;

  productName?: string;

  quantity: number;

  unitPrice: number;

  discount?: number; // monto fijo (no %)
}

export const calculateItemTotal = (item: SaleItem): number => {
  const discount = item.discount ?? 0;

  const total = item.quantity * item.unitPrice;

  return Math.max(0, total - discount);
};
