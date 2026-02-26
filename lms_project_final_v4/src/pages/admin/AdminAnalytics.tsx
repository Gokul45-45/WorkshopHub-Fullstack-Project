import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import {
  TrendingUp, Users, DollarSign, BookOpen,
  ArrowUpRight, ArrowDownRight, Activity, Zap,
  Clock, RefreshCw, BarChart, PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { addNotification } from "@/store/slices/notificationsSlice";

const AdminAnalytics = () => {
  const courses = useAppSelector((s) => s.courses.courses);
  const users = useAppSelector((s) => s.users.users);
  const dispatch = useAppDispatch();
  const [isSimulating, setIsSimulating] = useState(false);
  const [chartData, setChartData] = useState([45, 62, 58, 75, 90, 82]);

  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrolled, 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.enrolled), 0);
  const avgRating = courses.length > 0
    ? (courses.reduce((acc, c) => acc + (c.rating || 0), 0) / courses.length).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)} L`, trend: "+12.5%", icon: DollarSign, color: "text-accent", details: "Across 14 courses" },
    { label: "Total Users", value: users.length, trend: "+8.2%", icon: Users, color: "text-info", details: "Students & Trainers" },
    { label: "Total Enrollments", value: totalEnrollments, trend: "+15.3%", icon: TrendingUp, color: "text-success", details: "32 New this week" },
    { label: "Avg. Rating", value: avgRating, trend: "+0.2", icon: Zap, color: "text-warning", details: "Based on 450+ reviews" },
  ];

  const simulateTraffic = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      // Randomly update chart data for visual effect
      setChartData(prev => prev.map(v => Math.max(20, Math.min(100, v + (Math.random() * 20 - 10)))));
      dispatch(addNotification({
        message: "Real-time analytics updated with latest traffic data.",
        type: "info",
        read: false
      }));
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-6 w-6 text-accent" /> Platform Intelligence
          </h2>
          <p className="text-muted-foreground text-sm">Real-time monitoring of platform health and performance</p>
        </div>
        <Button
          onClick={simulateTraffic}
          disabled={isSimulating}
          variant="outline"
          className="gap-2 border-accent/20 text-accent hover:bg-accent/10 h-10"
        >
          <RefreshCw className={`h - 4 w - 4 ${isSimulating ? 'animate-spin' : ''} `} />
          {isSimulating ? "Analyzing..." : "Sync Live Data"}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform">
              <stat.icon className="h-24 w-24" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className={`p - 2.5 rounded - xl bg - muted / 50 ${stat.color} `}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text - [10px] font - bold px - 2 py - 0.5 rounded - full flex items - center gap - 1 ${stat.trend.startsWith('+') ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'} `}>
                {stat.trend} {stat.trend.startsWith('+') ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-display font-bold text-card-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-2">{stat.details}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 rounded-2xl border bg-card shadow-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BarChart className="h-48 w-48" />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" /> Revenue Velocity
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Monthly breakdown of gross platform revenue</p>
            </div>
            <div className="flex gap-2">
              {['6M', '1Y', 'ALL'].map(t => (
                <button key={t} className={`px - 3 py - 1 text - [10px] font - bold rounded - md transition - colors ${t === '6M' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'} `}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72 flex items-end gap-3 px-2 relative z-10">
            {chartData.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative">
                  <div
                    className="w-full bg-accent/20 rounded-t-xl relative overflow-hidden transition-all duration-1000 ease-out hover:bg-accent/40 cursor-help"
                    style={{ height: `${height}% ` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
                    <div className="absolute -top-1 ink-0 h-1.5 w-full bg-accent animate-pulse" />
                  </div>
                  {/* Tooltip Simulation */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none">
                    ₹{(height * 2.5).toFixed(1)}k
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Month {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers and Activity */}
        <div className="space-y-8">
          <div className="rounded-2xl border bg-card shadow-md p-6 overflow-hidden relative">
            <div className="absolute -right-4 top-4 opacity-5">
              <PieChart className="h-24 w-24" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-info" /> Performance Rankings
            </h3>
            <div className="space-y-5">
              {courses.sort((a, b) => b.enrolled - a.enrolled).slice(0, 4).map((course, idx) => (
                <div key={course.id} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`h - 6 w - 6 rounded - lg flex items - center justify - center text - [10px] font - bold ${idx === 0 ? 'bg-warning/20 text-warning' : idx === 1 ? 'bg-muted text-muted-foreground' : 'bg-muted/50 text-muted-foreground'
                        } `}>
                        #{idx + 1}
                      </div>
                      <p className="text-xs font-bold text-foreground truncate max-w-[140px] group-hover:text-accent transition-colors">{course.title}</p>
                    </div>
                    <p className="text-xs font-bold text-card-foreground">{course.enrolled}</p>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h - full rounded - full transition - all duration - 1000 ${idx === 0 ? 'bg-warning' : idx === 1 ? 'bg-info' : 'bg-accent'
                        } `}
                      style={{ width: `${(course.enrolled / courses[0].enrolled) * 100}% ` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs text-accent font-bold h-8 border-t border-border/50 rounded-none -mb-6 -mx-6 flex items-center justify-center">
              View All Rankings
            </Button>
          </div>

          <div className="rounded-2xl border bg-card shadow-md p-6">
            <h3 className="font-display font-bold text-sm text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" /> System Activity
            </h3>
            <div className="space-y-4">
              {[
                { user: "Rahul S.", action: "enrolled in", target: "React Suite", time: "2 min ago" },
                { user: "Dr. Ananya", action: "published", target: "AI 2.0", time: "15 min ago" },
                { user: "System", action: "payout", target: "processed", time: "1h ago" },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-[10px]">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 uppercase font-bold text-[8px]">
                    {log.user[0]}
                  </div>
                  <div>
                    <p className="text-card-foreground font-bold">{log.user} <span className="font-normal text-muted-foreground">{log.action}</span> {log.target}</p>
                    <p className="text-[8px] text-muted-foreground mt-0.5 uppercase">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
