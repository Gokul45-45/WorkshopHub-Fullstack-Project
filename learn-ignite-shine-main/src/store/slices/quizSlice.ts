import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizResult {
  courseId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  quizScore: number;
  attendance: number;
  completion: number;
  totalScore: number;
}

interface AttendanceRecord {
  courseId: string;
  date: string;
  present: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "class" | "quiz" | "assignment" | "exam";
  courseId: string;
}

interface QuizState {
  results: QuizResult[];
  leaderboard: LeaderboardEntry[];
  attendance: Record<string, number>; // courseId -> percentage
  calendarEvents: CalendarEvent[];
  quizEnabled: Record<string, boolean>; // courseId -> enabled
}

const initialState: QuizState = {
  results: [
    { courseId: "c6", score: 8, totalQuestions: 10, percentage: 80, completedAt: "2026-01-20T14:00:00Z" },
  ],
  leaderboard: [
    { studentId: "s1", studentName: "Aisha Bano", quizScore: 80, attendance: 85, completion: 75, totalScore: 80 },
    { studentId: "s2", studentName: "Rohit Mehta", quizScore: 92, attendance: 90, completion: 88, totalScore: 90 },
    { studentId: "s3", studentName: "Divya Krishnan", quizScore: 75, attendance: 95, completion: 92, totalScore: 87 },
    { studentId: "s4", studentName: "Suresh Yadav", quizScore: 88, attendance: 78, completion: 70, totalScore: 79 },
    { studentId: "s5", studentName: "Priya Nair", quizScore: 95, attendance: 88, completion: 85, totalScore: 89 },
    { studentId: "s6", studentName: "Arjun Das", quizScore: 70, attendance: 92, completion: 80, totalScore: 81 },
  ],
  attendance: { c1: 78, c6: 92 },
  calendarEvents: [
    { id: "e1", title: "ML Bootcamp - Live Session", date: "2026-02-25", type: "class", courseId: "c1" },
    { id: "e2", title: "ML Quiz #3", date: "2026-02-26", type: "quiz", courseId: "c1" },
    { id: "e3", title: "React Capstone Due", date: "2026-02-28", type: "assignment", courseId: "c6" },
    { id: "e4", title: "ML Mid-term Exam", date: "2026-03-05", type: "exam", courseId: "c1" },
    { id: "e5", title: "React Live Workshop", date: "2026-02-24", type: "class", courseId: "c6" },
    { id: "e6", title: "Cloud Computing Quiz", date: "2026-02-27", type: "quiz", courseId: "c3" },
  ],
  quizEnabled: { c1: true, c6: true, c3: true, c2: false, c4: false, c5: false, c7: false },
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    submitQuizResult(state, action: PayloadAction<QuizResult>) {
      state.results.push(action.payload);
      // Update leaderboard for s1
      const entry = state.leaderboard.find((e) => e.studentId === "s1");
      if (entry) {
        entry.quizScore = Math.round(
          state.results.reduce((sum, r) => sum + r.percentage, 0) / state.results.length
        );
        entry.totalScore = Math.round(entry.quizScore * 0.4 + entry.attendance * 0.3 + entry.completion * 0.3);
      }
    },
    toggleQuizEnabled(state, action: PayloadAction<string>) {
      state.quizEnabled[action.payload] = !state.quizEnabled[action.payload];
    },
    markAttendance(state, action: PayloadAction<{ courseId: string; percentage: number }>) {
      state.attendance[action.payload.courseId] = action.payload.percentage;
    },
    addCalendarEvent(state, action: PayloadAction<Omit<CalendarEvent, "id">>) {
      state.calendarEvents.push({ ...action.payload, id: `e${Date.now()}` });
    },
  },
});

export const { submitQuizResult, toggleQuizEnabled, markAttendance, addCalendarEvent } = quizSlice.actions;
export default quizSlice.reducer;
