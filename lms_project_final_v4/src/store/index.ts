import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import coursesReducer from "./slices/coursesSlice";
import notificationsReducer from "./slices/notificationsSlice";
import quizReducer from "./slices/quizSlice";
import forumReducer from "./slices/forumSlice";

import usersReducer from "./slices/usersSlice";
import gamificationReducer from "./slices/gamificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    notifications: notificationsReducer,
    quiz: quizReducer,
    forum: forumReducer,
    users: usersReducer,
    gamification: gamificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
