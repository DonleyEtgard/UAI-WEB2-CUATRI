const BASE_URL = "http://localhost:3000/api";

// 🔧 helper
const request = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};


// ==========================
// 🛒 SALES
// ==========================

export const createSale = (data: any) => {
  return request("/sales", {
    method: "POST",
    body: JSON.stringify(data)
  });
};


// ==========================
// 📦 SALE ITEMS
// ==========================

export const getSaleItems = () => {
  return request("/sale-items");
};

export const getSaleItemById = (id: string) => {
  return request(`/sale-items/${id}`);
};

// ⚠️ IMPORTANTE → coincide con tu backend
export const getItemsBySale = (saleId: string) => {
  return request(`/sale-items/sale/${saleId}`);
};

export const deleteSaleItem = (id: string) => {
  return request(`/sale-items/${id}`, {
    method: "DELETE"
  });
};


// ==========================
// 🧾 TICKET
// ==========================

export const getTicket = (id: string) => {
  return request(`/ticket/${id}`);
};