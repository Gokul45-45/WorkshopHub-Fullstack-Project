import { useAppSelector } from "@/hooks/useRedux";
import { BookOpen, Users, Star, TrendingUp, DollarSign, BarChart3 } from "lucide-react";

const TrainerDashboard = () => {
  const { userName, userId } = useAppSelector((s) => s.auth);
  const courses = useAppSelector((s) => s.courses.courses);
  const trainerCourses = courses.filter((c) => c.trainerId === "t1"); // mock: use first trainer

  const totalStudents = trainerCourses.reduce((sum, c) => sum + c.enrolled, 0);
  const totalRevenue = trainerCourses.reduce((sum, c) => sum + c.price * c.enrolled, 0);
  const avgRating = (trainerCourses.reduce((sum, c) => sum + c.rating, 0) / (trainerCourses.length || 1)).toFixed(1);

  const stats = [
    { label: "My Courses", value: trainerCourses.length, icon: BookOpen, color: "text-info" },
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "text-success" },
    { label: "Avg Rating", value: avgRating, icon: Star, color: "text-star" },
    { label: "Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Welcome, {userName?.split(" ")[0]}! 🎓</h2>
        <p className="text-muted-foreground">Your teaching overview</p>
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

      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Your Courses</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {trainerCourses.map((course) => (
            <div key={course.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    {course.category}
                  </span>
                  <h4 className="mt-2 font-display font-bold text-card-foreground">{course.title}</h4>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${course.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {course.status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.enrolled}</span>
                <span className="flex items-center gap-1 text-star"><Star className="h-3.5 w-3.5 fill-current" /> {course.rating}</span>
                <span>₹{course.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
