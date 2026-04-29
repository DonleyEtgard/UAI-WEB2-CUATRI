const BASE_URL = "http://localhost:3000/api";

// 🔧 helper reutilizable
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
// 💳 PAYMENT METHODS
// ==========================

// 📌 Obtener todos los métodos
export const getPaymentMethods = () => {
  return request("/payment-methods");
};

// 📌 Obtener uno
export const getPaymentMethodById = (id: string) => {
  return request(`/payment-methods/${id}`);
};

// ➕ Crear método de pago
export const createPaymentMethod = (data: {
  name: string;
  type: "cash" | "card" | "transfer";
  isActive?: boolean;
}) => {
  return request("/payment-methods", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// ✏️ Actualizar método
export const updatePaymentMethod = (id: string, data: any) => {
  return request(`/payment-methods/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

// ❌ Eliminar / desactivar
export const deletePaymentMethod = (id: string) => {
  return request(`/payment-methods/${id}`, {
    method: "DELETE"
  });
};