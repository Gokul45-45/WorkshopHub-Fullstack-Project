import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockStudents, mockTrainers } from "@/data/mockData";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: "student" | "trainer" | "admin";
    // Role specific fields
    company?: string;
    designation?: string;
    experience?: number;
    expertise?: string[];
    bio?: string;
    enrolledCourses?: string[];
    completedCourses?: string[];
}

interface UsersState {
    users: User[];
}

const initialState: UsersState = {
    users: [
        ...mockTrainers.map(t => ({ ...t, role: "trainer" as const })),
        ...mockStudents.map(s => ({ ...s, role: "student" as const })),
    ],
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<User>) {
            state.users.push(action.payload);
        },
        updateUser(state, action: PayloadAction<User>) {
            const index = state.users.findIndex((u) => u.id === action.payload.id);
            if (index !== -1) {
                state.users[index] = action.payload;
            }
        },
        deleteUser(state, action: PayloadAction<string>) {
            state.users = state.users.filter((u) => u.id !== action.payload);
        },
    },
});

export const { addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
