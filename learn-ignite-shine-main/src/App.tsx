import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import CheckoutPage from "./pages/CheckoutPage";
import TrainerProfile from "./pages/TrainerProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Auth pages
import StudentLogin from "./pages/auth/StudentLogin";
import TrainerLogin from "./pages/auth/TrainerLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import StudentSignup from "./pages/auth/StudentSignup";
import TrainerSignup from "./pages/auth/TrainerSignup";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentCalendar from "./pages/student/StudentCalendar";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentSuggestions from "./pages/student/StudentSuggestions";
import QuizPage from "./pages/student/QuizPage";
import LeaderboardPage from "./pages/student/LeaderboardPage";

// Trainer pages
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerCourses from "./pages/trainer/TrainerCourses";
import TrainerStudents from "./pages/trainer/TrainerStudents";
import TrainerAnalytics from "./pages/trainer/TrainerAnalytics";
import TrainerForum from "./pages/trainer/TrainerForum";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSuggestions from "./pages/admin/AdminSuggestions";
import AdminForum from "./pages/admin/AdminForum";
import AdminCertificates from "./pages/admin/AdminCertificates";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Separate auth routes */}
            <Route path="/login" element={<Navigate to="/login/student" replace />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/trainer" element={<TrainerLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/signup/student" element={<StudentSignup />} />
            <Route path="/signup/trainer" element={<TrainerSignup />} />

            {/* Public routes */}
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/checkout/:courseId" element={<CheckoutPage />} />
            <Route path="/trainer-profile/:trainerId" element={<TrainerProfile />} />

            {/* Student routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="calendar" element={<StudentCalendar />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="certificates" element={<StudentCertificates />} />
              <Route path="notifications" element={<StudentNotifications />} />
              <Route path="suggestions" element={<StudentSuggestions />} />
              <Route path="quiz/:courseId" element={<QuizPage />} />
            </Route>

            {/* Trainer routes */}
            <Route path="/trainer" element={<ProtectedRoute allowedRoles={["trainer"]}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<TrainerDashboard />} />
              <Route path="courses" element={<TrainerCourses />} />
              <Route path="students" element={<TrainerStudents />} />
              <Route path="analytics" element={<TrainerAnalytics />} />
              <Route path="forum" element={<TrainerForum />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="suggestions" element={<AdminSuggestions />} />
              <Route path="forum" element={<AdminForum />} />
              <Route path="certificates" element={<AdminCertificates />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
