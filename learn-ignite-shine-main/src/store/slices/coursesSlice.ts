import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockCourses, mockTrainers } from "@/data/mockData";

interface Payment {
  id: string;
  courseId: string;
  amount: number;
  method: string;
  date: string;
  status: "success" | "failed";
}

interface CoursesState {
  courses: typeof mockCourses;
  trainers: typeof mockTrainers;
  enrolledCourseIds: string[];
  payments: Payment[];
}

const initialState: CoursesState = {
  courses: mockCourses,
  trainers: mockTrainers,
  enrolledCourseIds: ["c1", "c6"],
  payments: [
    { id: "p1", courseId: "c1", amount: 2499, method: "UPI", date: "2026-01-15T10:30:00Z", status: "success" },
    { id: "p2", courseId: "c6", amount: 1599, method: "Credit Card", date: "2025-12-20T14:00:00Z", status: "success" },
  ],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    enrollCourse(state, action: PayloadAction<{ courseId: string; payment: Omit<Payment, "id"> }>) {
      const { courseId, payment } = action.payload;
      if (!state.enrolledCourseIds.includes(courseId)) {
        state.enrolledCourseIds.push(courseId);
        const course = state.courses.find((c) => c.id === courseId);
        if (course) course.enrolled += 1;
        state.payments.push({ ...payment, id: `p${Date.now()}` });
      }
    },
    addCourse(state, action: PayloadAction<typeof mockCourses[0]>) {
      state.courses.push(action.payload);
    },
  },
});

export const { enrollCourse, addCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
