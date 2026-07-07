import { configureStore } from "@reduxjs/toolkit";

// slices
import authReducer from "../features/auth/auth.slice";
import userReducer from "../features/auth/user.slice";
import productReducer from "../features/auth/product.slice";
import saleReducer from "../features/auth/sale.slice";
import todosReducer from "../features/todos/todosSlice"; // ✅ IMPORTANTE

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    products: productReducer,
    sales: saleReducer,
    todos: todosReducer, // 🔥 CLAVE (esto arregla tu error)
  },
});

// types globales
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;