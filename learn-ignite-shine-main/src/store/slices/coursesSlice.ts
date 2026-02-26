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

export interface Course {
  id: string;
  title: string;
  category: string;
  trainerId: string;
  price: number;
  rating: number;
  enrolled: number;
  duration: string;
  modules: number;
  description: string;
  status: "active" | "inactive";
  learnings: string[];
  requirements: string[];
  materials?: { id: string; title: string; type: "video" | "pdf" | "link"; url: string; module: string }[];
}

interface CoursesState {
  courses: Course[];
  trainers: any[]; // Trainers will be moved to usersSlice soon
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
    addCourse(state, action: PayloadAction<Course>) {
      state.courses.push(action.payload);
    },
    updateCourse(state, action: PayloadAction<Course>) {
      const index = state.courses.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse(state, action: PayloadAction<string>) {
      state.courses = state.courses.filter((c) => c.id !== action.payload);
    },
    addMaterial(state, action: PayloadAction<{ courseId: string; material: any }>) {
      const course = state.courses.find(c => c.id === action.payload.courseId);
      if (course) {
        if (!course.materials) course.materials = [];
        course.materials.push({ ...action.payload.material, id: `mat${Date.now()}` });
      }
    },
  },
});

export const { enrollCourse, addCourse, updateCourse, deleteCourse, addMaterial } = coursesSlice.actions;
export default coursesSlice.reducer;
