import { useAppSelector } from "@/hooks/useRedux";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Users, BookOpen, Star, DollarSign } from "lucide-react";

const COLORS = ["hsl(45, 88%, 62%)", "hsl(142, 72%, 40%)", "hsl(210, 92%, 55%)"];

const TrainerAnalytics = () => {
  const courses = useAppSelector((s) => s.courses.courses);
  const trainerCourses = courses.filter((c) => c.trainerId === "t1");

  const enrollmentData = trainerCourses.map((c) => ({
    name: c.title.slice(0, 20),
    students: c.enrolled,
  }));

  const revenueData = trainerCourses.map((c) => ({
    name: c.title.slice(0, 20),
    revenue: Math.round((c.price * c.enrolled) / 1000),
  }));

  const totalStudents = trainerCourses.reduce((s, c) => s + c.enrolled, 0);
  const totalRevenue = trainerCourses.reduce((s, c) => s + c.price * c.enrolled, 0);

  // Rating distribution (mock)
  const ratingData = [
    { name: "5 ★", value: 45 },
    { name: "4 ★", value: 35 },
    { name: "3 ★", value: 15 },
    { name: "< 3 ★", value: 5 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="font-display text-2xl font-bold text-foreground">Your Analytics 📈</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "text-info" },
          { label: "Active Courses", value: trainerCourses.length, icon: BookOpen, color: "text-success" },
          { label: "Avg Rating", value: "4.6", icon: Star, color: "text-star" },
          { label: "Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-accent" },
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
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Students per Course</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="students" fill="hsl(45, 88%, 62%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Revenue per Course (₹K)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(142, 72%, 40%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ratingData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {ratingData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrainerAnalytics;
