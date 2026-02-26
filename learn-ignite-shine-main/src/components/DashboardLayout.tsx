import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAppSelector } from "@/hooks/useRedux";
import { Bell } from "lucide-react";
import { useAppDispatch } from "@/hooks/useRedux";
import NotificationBell from "./layout/NotificationBell";

const DashboardLayout = () => {
  const { userName, role } = useAppSelector((s) => s.auth);
  const unreadCount = useAppSelector((s) => s.notifications.items.filter((n) => !n.read).length);
  const dispatch = useAppDispatch();

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="glass-nav sticky top-0 z-30 flex h-14 items-center justify-between px-6">
          <div className="md:pl-0 pl-12">
            <h1 className="font-display text-lg font-bold text-foreground capitalize">{role} Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
