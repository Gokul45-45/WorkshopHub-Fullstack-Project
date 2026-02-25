import { useAppSelector } from "@/hooks/useRedux";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";

const COLORS = ["hsl(45, 88%, 62%)", "hsl(142, 72%, 40%)", "hsl(210, 92%, 55%)", "hsl(0, 84%, 60%)", "hsl(280, 70%, 50%)"];

const AdminAnalytics = () => {
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);

  // Enrollment by course
  const enrollmentData = courses.map((c) => ({
    name: c.title.slice(0, 18),
    enrolled: c.enrolled,
  }));

  // Revenue by course
  const revenueData = courses.map((c) => ({
    name: c.title.slice(0, 18),
    revenue: Math.round((c.price * c.enrolled) / 1000),
  }));

  // Category distribution
  const categoryMap: Record<string, number> = {};
  courses.forEach((c) => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + c.enrolled;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Monthly revenue trend (mock)
  const monthlyTrend = [
    { month: "Sep", revenue: 280 },
    { month: "Oct", revenue: 350 },
    { month: "Nov", revenue: 420 },
    { month: "Dec", revenue: 510 },
    { month: "Jan", revenue: 620 },
    { month: "Feb", revenue: 730 },
  ];

  // Completion rates
  const completionData = courses.map((c) => ({
    name: c.title.slice(0, 18),
    rate: Math.round(40 + Math.random() * 55),
  }));

  const totalStudents = courses.reduce((s, c) => s + c.enrolled, 0);
  const totalRevenue = courses.reduce((s, c) => s + c.price * c.enrolled, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="font-display text-2xl font-bold text-foreground">Platform Analytics 📊</h2>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "text-info" },
          { label: "Active Courses", value: courses.length, icon: BookOpen, color: "text-success" },
          { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-accent" },
          { label: "Avg Completion", value: `${Math.round(completionData.reduce((s, c) => s + c.rate, 0) / completionData.length)}%`, icon: TrendingUp, color: "text-warning" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrollment Chart */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Enrollment by Course</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="enrolled" fill="hsl(45, 88%, 62%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Monthly Revenue Trend (₹K)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="hsl(142, 72%, 40%)" strokeWidth={2} dot={{ fill: "hsl(142, 72%, 40%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Students by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Rates */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Completion Rates</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="rate" fill="hsl(210, 92%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
