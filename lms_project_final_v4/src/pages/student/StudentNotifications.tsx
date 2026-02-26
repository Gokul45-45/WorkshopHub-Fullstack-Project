import { useAppSelector } from "@/hooks/useRedux";
import { markAsRead, markAllRead } from "@/store/slices/notificationsSlice";
import { useAppDispatch } from "@/hooks/useRedux";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentNotifications = () => {
  const notifications = useAppSelector((s) => s.notifications.items);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Notifications</h2>
        <Button variant="outline" size="sm" onClick={() => dispatch(markAllRead())}>
          <CheckCheck className="h-4 w-4 mr-1" /> Mark all read
        </Button>
      </div>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-xl border bg-card p-4 flex items-start gap-3 transition-colors ${!n.read ? "border-accent/30 bg-accent/5" : ""}`}
            onClick={() => dispatch(markAsRead(n.id))}
          >
            <Bell className={`h-5 w-5 mt-0.5 shrink-0 ${!n.read ? "text-accent" : "text-muted-foreground"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleString()}</p>
            </div>
            {!n.read && <span className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentNotifications;
