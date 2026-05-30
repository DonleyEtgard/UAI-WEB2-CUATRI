export interface Sale {
  _id: string;

  customerId: string;

  items: SaleItem[];

  subtotal: number;

  tax?: number;

  discount?: number;

  totalAmount: number;

  amountPaid: number;

  currency: Currency;

  status: SaleStatus;

  paymentId?: string;

  createdAt: string;

  updatedAt?: string;
}

export interface SaleItem {
  productId: string;

  productName?: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;
}

export type SaleStatus =
  | "pending"
  | "completed"
  | "cancelled"
  | "refunded";

export type Currency = "ARS" | "USD" | "EUR";

// ==========================
// HELPERS
// ==========================

export const getChange = (sale: Sale): number => {
  return Math.max(0, sale.amountPaid - sale.totalAmount);
};

export const getSalesByMonth = (
  sales: Sale[],
  month: number,
  year: number
) => {
  return sales
    .filter(s => {
      const d = new Date(s.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((acc, s) => acc + s.totalAmount, 0);
};

export const getProductStats = (sales: Sale[]) => {
  const result: Record<string, number> = {};

  sales.forEach(sale => {
    sale.items.forEach(item => {
      result[item.productId] =
        (result[item.productId] || 0) + item.quantity;
    });
  });

  return result;
};