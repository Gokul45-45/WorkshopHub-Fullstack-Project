import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserRole = "student" | "trainer" | "admin" | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  userId: string | null;
  userName: string | null;
  email: string | null;
  avatar: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  userId: null,
  userName: null,
  email: null,
  avatar: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ role: UserRole; userId: string; userName: string; email: string; avatar: string }>) {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.role = null;
      state.userId = null;
      state.userName = null;
      state.email = null;
      state.avatar = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
