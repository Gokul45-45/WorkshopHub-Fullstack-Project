import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ForumReply {
  id: string;
  threadId: string;
  author: string;
  role: "student" | "trainer" | "admin";
  content: string;
  timestamp: string;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  role: "student" | "trainer" | "admin";
  courseId: string;
  content: string;
  timestamp: string;
  replies: ForumReply[];
  pinned: boolean;
}

export interface Suggestion {
  id: string;
  studentName: string;
  subject: string;
  message: string;
  status: "pending" | "reviewed" | "implemented" | "rejected";
  adminResponse: string;
  timestamp: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
  certificateCode: string;
  generated: boolean;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
}

interface ForumState {
  threads: ForumThread[];
  suggestions: Suggestion[];
  certificates: Certificate[];
  emailLogs: EmailLog[];
}

const initialState: ForumState = {
  threads: [
    {
      id: "th1",
      title: "Best resources for learning CNNs?",
      author: "Aisha Bano",
      role: "student",
      courseId: "c1",
      content: "Can anyone recommend good supplementary materials for understanding Convolutional Neural Networks beyond the course content?",
      timestamp: "2026-02-20T10:30:00Z",
      pinned: false,
      replies: [
        {
          id: "r1",
          threadId: "th1",
          author: "Dr. Ananya Sharma",
          role: "trainer",
          content: "I recommend the Stanford CS231n lecture notes — they're excellent for visual learners. Also check out 3Blue1Brown's neural network series on YouTube.",
          timestamp: "2026-02-20T14:00:00Z",
        },
      ],
    },
    {
      id: "th2",
      title: "Study group for AWS certification",
      author: "Rohit Mehta",
      role: "student",
      courseId: "c3",
      content: "Looking for study partners preparing for the AWS Cloud Practitioner exam. We can do weekly mock tests together.",
      timestamp: "2026-02-22T09:00:00Z",
      pinned: true,
      replies: [],
    },
    {
      id: "th3",
      title: "React 18 Suspense — real-world patterns",
      author: "Priya Patel",
      role: "trainer",
      courseId: "c6",
      content: "I've added a new bonus module on Suspense patterns used in production. Check the course materials section!",
      timestamp: "2026-02-23T16:00:00Z",
      pinned: true,
      replies: [
        {
          id: "r2",
          threadId: "th3",
          author: "Aisha Bano",
          role: "student",
          content: "This is amazing, thank you! The streaming SSR example was really helpful.",
          timestamp: "2026-02-23T18:30:00Z",
        },
      ],
    },
  ],
  suggestions: [
    {
      id: "sg1",
      studentName: "Aisha Bano",
      subject: "Add dark mode to quiz page",
      message: "The quiz timer is hard to read in bright environments. A dark mode option would be great.",
      status: "reviewed",
      adminResponse: "Great suggestion! We'll include this in the next update.",
      timestamp: "2026-02-18T11:00:00Z",
    },
    {
      id: "sg2",
      studentName: "Rohit Mehta",
      subject: "Mobile app version",
      message: "It would be convenient to have a mobile app for accessing courses on the go.",
      status: "pending",
      adminResponse: "",
      timestamp: "2026-02-21T09:30:00Z",
    },
  ],
  certificates: [
    {
      id: "cert1",
      studentName: "Aisha Bano",
      courseId: "c6",
      courseTitle: "React 18 - The Complete Guide",
      instructorName: "Priya Patel",
      completionDate: "2026-02-15",
      certificateCode: "WH-R18-2026-0001",
      generated: true,
    },
  ],
  emailLogs: [
    {
      id: "em1",
      to: "student@demo.com",
      subject: "Certificate Generated — React 18",
      body: "Congratulations! Your certificate for React 18 - The Complete Guide has been generated. Download it from your dashboard.",
      timestamp: "2026-02-15T12:00:00Z",
    },
  ],
};

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    addThread(state, action: PayloadAction<Omit<ForumThread, "id" | "timestamp" | "replies" | "pinned">>) {
      state.threads.unshift({
        ...action.payload,
        id: `th${Date.now()}`,
        timestamp: new Date().toISOString(),
        replies: [],
        pinned: false,
      });
    },
    addReply(state, action: PayloadAction<Omit<ForumReply, "id" | "timestamp">>) {
      const thread = state.threads.find((t) => t.id === action.payload.threadId);
      if (thread) {
        thread.replies.push({
          ...action.payload,
          id: `r${Date.now()}`,
          timestamp: new Date().toISOString(),
        });
      }
    },
    deleteThread(state, action: PayloadAction<string>) {
      state.threads = state.threads.filter((t) => t.id !== action.payload);
    },
    togglePin(state, action: PayloadAction<string>) {
      const thread = state.threads.find((t) => t.id === action.payload);
      if (thread) thread.pinned = !thread.pinned;
    },
    addSuggestion(state, action: PayloadAction<Omit<Suggestion, "id" | "timestamp" | "status" | "adminResponse">>) {
      state.suggestions.unshift({
        ...action.payload,
        id: `sg${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: "pending",
        adminResponse: "",
      });
    },
    updateSuggestionStatus(state, action: PayloadAction<{ id: string; status: Suggestion["status"]; response: string }>) {
      const sg = state.suggestions.find((s) => s.id === action.payload.id);
      if (sg) {
        sg.status = action.payload.status;
        sg.adminResponse = action.payload.response;
      }
    },
    generateCertificate(state, action: PayloadAction<Omit<Certificate, "id" | "certificateCode" | "generated">>) {
      const code = `WH-${action.payload.courseId.toUpperCase()}-${new Date().getFullYear()}-${String(state.certificates.length + 1).padStart(4, "0")}`;
      state.certificates.push({
        ...action.payload,
        id: `cert${Date.now()}`,
        certificateCode: code,
        generated: true,
      });
    },
    addEmailLog(state, action: PayloadAction<Omit<EmailLog, "id" | "timestamp">>) {
      state.emailLogs.push({
        ...action.payload,
        id: `em${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
    },
  },
});

export const {
  addThread, addReply, deleteThread, togglePin,
  addSuggestion, updateSuggestionStatus,
  generateCertificate, addEmailLog,
} = forumSlice.actions;
export default forumSlice.reducer;
