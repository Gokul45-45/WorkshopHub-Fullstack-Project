import { useAppSelector } from "@/hooks/useRedux";
import {
  TrendingUp, Users, DollarSign, BookOpen,
  ArrowUpRight, ArrowDownRight, Activity, Zap
} from "lucide-react";

const AdminAnalytics = () => {
  const courses = useAppSelector((s) => s.courses.courses);
  const users = useAppSelector((s) => s.users.users);

  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrolled, 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.enrolled), 0);
  const avgRating = (courses.reduce((acc, c) => acc + (c.rating || 0), 0) / courses.length).toFixed(1);

  const stats = [
    { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, trend: "+12.5%", icon: DollarSign, color: "text-accent" },
    { label: "Total Users", value: users.length, trend: "+8.2%", icon: Users, color: "text-info" },
    { label: "Total Enrollments", value: totalEnrollments, trend: "+15.3%", icon: TrendingUp, color: "text-success" },
    { label: "Avg. Rating", value: avgRating, trend: "+0.2", icon: Zap, color: "text-warning" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">System Analytics</h2>
        <p className="text-muted-foreground text-sm">Deep dive into platform performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-medium flex items-center ${stat.trend.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.trend} {stat.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Courses & Growth Chart Simulation */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" /> Revenue Growth
            </h3>
            <select className="bg-muted text-xs font-semibold rounded-md px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end gap-2 px-2">
            {[45, 62, 58, 75, 90, 82].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-accent/20 rounded-t-md relative overflow-hidden transition-all duration-500 hover:bg-accent/40" style={{ height: `${height}%` }}>
                  <div className="absolute inset-0 bg-accent/30 animate-pulse" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">Month {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-info" /> Top Courses
          </h3>
          <div className="space-y-4">
            {courses.sort((a, b) => b.enrolled - a.enrolled).slice(0, 5).map((course, idx) => (
              <div key={course.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}.</span>
                  <div className="max-w-[120px]">
                    <p className="text-xs font-semibold text-foreground truncate">{course.title}</p>
                    <p className="text-[10px] text-muted-foreground">{course.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-accent">{course.enrolled}</p>
                  <p className="text-[10px] text-muted-foreground">students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
