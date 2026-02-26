import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { markAsRead, clearNotifications } from "@/store/slices/notificationsSlice";
import { Bell, Check, Trash2, Zap, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const notifications = useAppSelector(s => s.notifications.items);
    const unreadCount = notifications.filter(n => !n.read).length;
    const dispatch = useAppDispatch();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-muted transition-colors group"
            >
                <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-accent animate-wiggle' : 'text-muted-foreground'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-destructive text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 max-h-[400px] bg-card border shadow-2xl rounded-2xl z-50 overflow-hidden animate-scale-in">
                        <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <Bell className="h-4 w-4 text-accent" /> Notifications
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => dispatch(clearNotifications())} className="text-[10px] font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                                    <Trash2 className="h-3 w-3" /> Clear All
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[300px] divide-y divide-border/50">
                            {notifications.length > 0 ? (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`p-4 flex gap-3 hover:bg-muted/30 transition-colors cursor-pointer relative ${!n.read ? 'bg-accent/5' : ''}`}
                                        onClick={() => dispatch(markRead(n.id))}
                                    >
                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-success' : n.type === 'warning' ? 'bg-warning' : 'bg-info'
                                            }`} />
                                        <div className="flex-1">
                                            <p className={`text-xs leading-relaxed ${!n.read ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-1">Just now</p>
                                        </div>
                                        {!n.read && <Check className="h-3 w-3 text-accent absolute top-4 right-4" />}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Zap className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-xs">No notifications yet</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-muted/30 border-t flex items-center justify-center">
                            <button className="text-[10px] font-bold text-accent hover:underline">View All Alerts</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
