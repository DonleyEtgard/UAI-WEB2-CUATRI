import API from "../../services/api";

// ==========================
// 🛒 SALES
// ==========================

export const createSale = async (data: any) => {
  const res = await API.post("/sales", data);
  return res.data;
};

// ==========================
// 📦 SALE ITEMS
// ==========================

export const getSaleItems = async () => {
  const res = await API.get("/sale-items");
  return res.data;
};

export const getSaleItemById = async (id: string) => {
  const res = await API.get(`/sale-items/${id}`);
  return res.data;
};

export const getItemsBySale = async (saleId: string) => {
  const res = await API.get(`/sale-items/sale/${saleId}`);
  return res.data;
};

export const deleteSaleItem = async (id: string) => {
  const res = await API.delete(`/sale-items/${id}`);
  return res.data;
};

// ==========================
// 🧾 TICKET
// ==========================

export const getTicket = async (id: string) => {
  const res = await API.get(`/ticket/${id}`);
   return res.data;
};