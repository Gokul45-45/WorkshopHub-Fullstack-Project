import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAppSelector } from "@/hooks/useRedux";
import { Bell } from "lucide-react";
import { markAllRead } from "@/store/slices/notificationsSlice";
import { useAppDispatch } from "@/hooks/useRedux";

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
            <button
              onClick={() => dispatch(markAllRead())}
              className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
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
