import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { BookOpen, Users, DollarSign, TrendingUp, ShieldCheck, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userName } = useAppSelector((s) => s.auth);
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);

  const totalStudents = courses.reduce((sum, c) => sum + c.enrolled, 0);
  const totalRevenue = courses.reduce((sum, c) => sum + c.price * c.enrolled, 0);

  const stats = [
    { label: "Total Courses", value: courses.length, icon: BookOpen, color: "text-info" },
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "text-success" },
    { label: "Total Trainers", value: trainers.length, icon: ShieldCheck, color: "text-accent" },
    { label: "Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-warning" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Admin Overview 👑</h2>
          <p className="text-muted-foreground text-sm">Platform-wide statistics and management</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-accent/20 text-accent hover:bg-accent/10"
          onClick={() => navigate('/admin/analytics')}
        >
          <BarChart3 className="h-4 w-4" /> View Detailed Analytics <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent courses */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4">All Courses</h3>
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Course</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground hidden sm:table-cell">Trainer</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Enrolled</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const trainer = trainers.find((t) => t.id === course.trainerId);
                return (
                  <tr key={course.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-card-foreground">{course.title}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{trainer?.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{course.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-card-foreground">{course.enrolled}</td>
                    <td className="px-4 py-3 text-right text-card-foreground">₹{course.price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
