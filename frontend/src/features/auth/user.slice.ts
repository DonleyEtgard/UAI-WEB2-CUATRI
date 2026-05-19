import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
  _id: string;
  email: string;
  role: "admin" | "employee";
  isActive: boolean;
};

type UsersState = {
  list: User[];
};

const initialState: UsersState = {
  list: [],
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.list = action.payload;
    },

    updateUser(state, action: PayloadAction<User>) {
      const index = state.list.findIndex(u => u._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setUsers, updateUser } = userSlice.actions;
export default userSlice.reducer;