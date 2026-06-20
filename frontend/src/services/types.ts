export type SalesSummary = {
  totalRevenue: number;
  totalSales: number;
  averageTicket: number;
  bestSellers: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  revenueByDay: {
    date: string;
    amount: number;
  }[];
};

export type StockReport = {
  totalStockValue: number;
  totalProducts: number;
  lowStockAlerts: {
    _id: string;
    name: string;
    currentStock: number;
  }[];
};