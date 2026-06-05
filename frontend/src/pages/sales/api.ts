import API from "../../services/api";

export interface Sale {
  _id: string;
  customer?: {
    name?: string;
    lastName?: string;
    phone?: string;
  };
  user?: {
    email: string;
  };
  createdAt: string;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  status: string;
  notes?: string;
}

export interface SaleItem {
  _id: string;
  quantity: number;
  subtotal: number;
  product?: {
    name: string;
  };
  productName?: string;
}

export interface TicketData {
  sale: Sale;
  items: SaleItem[];
}

export const fetchTicket = async (id: string): Promise<TicketData> => {
  const res = await API.get(`/sales/ticket/${id}`);
  return res.data?.data || res.data;
};