import API from "../../api/axios";

// 📌 OBTENER TODOS LOS PRODUCTOS
export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

// 📌 OBTENER PRODUCTO POR ID
export const getProductById = async (id: string) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

// 📌 CREAR PRODUCTO
export const createProduct = async (data: {
  name: string;
  price: number;
  cost: number;
  stock: number;
  description?: string;
  category?: string;
}) => {
  const res = await API.post("/products", data);
  return res.data;
};

// 📌 ACTUALIZAR PRODUCTO
export const updateProduct = async (
  id: string,
  data: {
    name?: string;
    price?: number;
    cost?: number;
    stock?: number;
    description?: string;
    category?: string;
    isActive?: boolean;
  }
) => {
  const res = await API.put(`/products/${id}`, data);
  return res.data;
};

// 📌 ELIMINAR PRODUCTO (SOFT DELETE)
export const deleteProduct = async (id: string) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

// 🔥 ACTUALIZAR STOCK (MUY IMPORTANTE)
export const updateStock = async (id: string, quantity: number) => {
  const res = await API.patch(`/products/${id}/stock`, {
    quantity
  });
  return res.data;
};

// 📊 OBTENER ESTADÍSTICAS DEL PRODUCTO
export const getProductStats = async (id: string) => {
  const res = await API.get(`/products/${id}/stats`);
  return res.data;
};