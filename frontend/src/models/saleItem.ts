export interface SaleItem {
  productId: string;
  productName?: string; // útil para mostrar en UI sin consultar productos
  quantity: number;
  unitPrice: number; // precio al momento de la venta
  totalPrice: number;
  discount?: number;
}

export const calculateItemTotal = (item: SaleItem): number => {
  const discount = item.discount ?? 0;
  return item.quantity * item.unitPrice - discount;
};
