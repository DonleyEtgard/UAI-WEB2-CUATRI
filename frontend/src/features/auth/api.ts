import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUser } from "../../services/firebaseAuth";
import type { User } from "firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};


// Thunks
export const login = createAsyncThunk("auth/login", async ({ email, password }: { email: string; password: string; }) => {
  const userCredential = await loginUser(email, password);
  return userCredential.user;
});

export const register = createAsyncThunk("auth/register", async ({ email, password }: { email: string; password: string; }) => {
  const userCredential = await registerUser(email, password);
  return userCredential.user;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al iniciar sesión";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

// EXPORTACIÓN CLAVE: Exporta tanto por defecto como nombrado
export default authSlice.reducer;
export const authReducer = authSlice.reducer;
