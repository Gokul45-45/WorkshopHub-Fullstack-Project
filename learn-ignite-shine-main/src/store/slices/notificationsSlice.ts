import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockNotifications } from "@/data/mockData";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
}

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: mockNotifications,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<Notification, "id" | "timestamp">>) {
      state.items.unshift({
        ...action.payload,
        id: `n${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
    },
    markRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const { addNotification, markRead, markAllRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
