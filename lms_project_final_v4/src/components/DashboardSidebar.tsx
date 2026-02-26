import { useState } from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/store/slices/authSlice";
import {
  LayoutDashboard, BookOpen, Users, BarChart3, Bell,
  Settings, LogOut, Menu, X, Rocket, GraduationCap,
  MessageSquare, Lightbulb, Award, CalendarDays, User,
  Trophy, ClipboardCheck
} from "lucide-react";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/courses", label: "My Courses", icon: BookOpen },
  { to: "/student/calendar", label: "Calendar & Analytics", icon: CalendarDays },
  { to: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/student/certificates", label: "Certificates", icon: Award },
  { to: "/student/suggestions", label: "Suggestions", icon: Lightbulb },
  { to: "/student/notifications", label: "Notifications", icon: Bell },
];

const trainerLinks = [
  { to: "/trainer", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trainer/courses", label: "My Courses", icon: BookOpen },
  { to: "/trainer/students", label: "Students & Attendance", icon: ClipboardCheck },
  { to: "/trainer/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/trainer/forum", label: "Forum", icon: MessageSquare },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/courses", label: "All Courses", icon: BookOpen },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/suggestions", label: "Suggestions", icon: Lightbulb },
  { to: "/admin/forum", label: "Forum", icon: MessageSquare },
  { to: "/admin/certificates", label: "Certificates", icon: Award },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, userName, avatar } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const links = role === "student" ? studentLinks : role === "trainer" ? trainerLinks : adminLinks;
  const roleLabel = role === "student" ? "Student" : role === "trainer" ? "Trainer" : "Admin";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <Rocket className="h-6 w-6 text-sidebar-primary shrink-0" />
        {!collapsed && <span className="font-display text-lg font-bold text-sidebar-foreground">Workshop Hub</span>}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
          <img src={avatar || ""} alt="" className="h-9 w-9 rounded-full bg-sidebar-accent" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{userName}</p>
            <p className="text-xs text-sidebar-foreground/60">{roleLabel}</p>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map((link) => (
          <RouterNavLink
            key={link.to}
            to={link.to}
            end={link.to === `/${role}`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`
            }
          >
            <link.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </RouterNavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-primary p-2 text-primary-foreground shadow-lg md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 z-10 hidden h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm hover:text-foreground md:flex"
        >
          {collapsed ? "→" : "←"}
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-5 text-sidebar-foreground/70 hover:text-sidebar-foreground md:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
};

export default DashboardSidebar;
