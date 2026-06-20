import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Sale = {
  _id: string;
  total: number;
};

type SalesState = {
  list: Sale[];
};

const initialState: SalesState = {
  list: [],
};

const saleSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSales(state, action: PayloadAction<Sale[]>) {
      state.list = action.payload;
    },
  },
});

export const { setSales } = saleSlice.actions;
export default saleSlice.reducer;