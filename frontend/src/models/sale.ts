export interface Sale {
  id: string;
  customerId: string;
  items: SaleItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  totalAmount: number;
  amountPaid: number; // 💥 NUEVO → cuánto pagó el cliente
  currency: Currency;
  status: SaleStatus;
  paymentId?: string;
  createdAt: string; // mejor obligatorio para stats
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

export type Currency = "ARS" | "USD" | "HT";

export const getChange = (sale: Sale): number => {
  return sale.amountPaid - sale.totalAmount;
};

export const getSalesByMonth = (sales: Sale[], month: string) => {
  return sales
    .filter(s => s.createdAt.startsWith(month))
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