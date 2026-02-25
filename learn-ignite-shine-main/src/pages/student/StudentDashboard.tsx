import { useAppSelector } from "@/hooks/useRedux";
import { BookOpen, BarChart3, Award, Clock, Star, TrendingUp } from "lucide-react";

const StudentDashboard = () => {
  const enrolledIds = useAppSelector((s) => s.courses.enrolledCourseIds);
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const { userName } = useAppSelector((s) => s.auth);

  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  const stats = [
    { label: "Enrolled Courses", value: enrolledCourses.length, icon: BookOpen, color: "text-info" },
    { label: "Avg. Attendance", value: "85%", icon: BarChart3, color: "text-success" },
    { label: "Quiz Avg.", value: "80%", icon: TrendingUp, color: "text-accent" },
    { label: "Certificates", value: 1, icon: Award, color: "text-warning" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Welcome back, {userName?.split(" ")[0]}! 👋</h2>
        <p className="text-muted-foreground">Here's your learning progress</p>
      </div>

      {/* Stats */}
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

      {/* Enrolled Courses */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4">My Courses</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => {
            const trainer = trainers.find((t) => t.id === course.trainerId);
            return (
              <div key={course.id} className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                  {course.category}
                </span>
                <h4 className="mt-2 font-display font-bold text-card-foreground">{course.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{trainer?.name}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-star">
                    <Star className="h-3.5 w-3.5 fill-current" /> {course.rating}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {course.duration}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{course.id === "c6" ? "100%" : "45%"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-accent transition-all"
                      style={{ width: course.id === "c6" ? "100%" : "45%" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
