import { useMemo } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const COLORS = ["hsl(45, 88%, 62%)", "hsl(142, 72%, 40%)", "hsl(210, 92%, 55%)", "hsl(0, 84%, 60%)"];

const StudentCalendar = () => {
  const quizResults = useAppSelector((s) => s.quiz.results);
  const attendance = useAppSelector((s) => s.quiz.attendance);
  const enrolledIds = useAppSelector((s) => s.courses.enrolledCourseIds);
  const courses = useAppSelector((s) => s.courses.courses);
  const calendarEvents = useAppSelector((s) => s.quiz.calendarEvents);
  const quizEnabled = useAppSelector((s) => s.quiz.quizEnabled);

  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  // Quiz performance chart data
  const quizChartData = quizResults.map((r) => {
    const course = courses.find((c) => c.id === r.courseId);
    return { name: course?.title?.slice(0, 20) || r.courseId, score: r.percentage };
  });

  // Attendance chart data
  const attendanceData = enrolledCourses.map((c) => ({
    name: c.title.slice(0, 15),
    attendance: attendance[c.id] || 0,
  }));

  // Completion donut data
  const completedCount = enrolledCourses.filter((c) => c.id === "c6").length;
  const inProgressCount = enrolledCourses.length - completedCount;
  const completionData = [
    { name: "Completed", value: completedCount },
    { name: "In Progress", value: inProgressCount },
  ];

  // Upcoming events
  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = calendarEvents
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const eventColors: Record<string, string> = {
    class: "bg-success",
    quiz: "bg-info",
    assignment: "bg-destructive",
    exam: "bg-accent",
  };
  const eventLabels: Record<string, string> = {
    class: "🟢 Class",
    quiz: "🔵 Quiz",
    assignment: "🔴 Assignment",
    exam: "🟡 Exam",
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="font-display text-2xl font-bold text-foreground">Calendar & Analytics</h2>

      {/* Upcoming Events */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3">Upcoming Events</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
              <div className={`h-3 w-3 rounded-full ${eventColors[event.type]} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}</p>
              </div>
              <span className="text-xs text-muted-foreground">{eventLabels[event.type]}</span>
            </div>
          ))}
          {upcomingEvents.length === 0 && <p className="text-muted-foreground text-sm">No upcoming events</p>}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>🟢 Class</span><span>🔵 Quiz</span><span>🔴 Assignment</span><span>🟡 Exam</span>
        </div>
      </div>

      {/* Available Quizzes */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3">Available Quizzes</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => {
            const enabled = quizEnabled[course.id];
            const taken = quizResults.some((r) => r.courseId === course.id);
            const result = quizResults.find((r) => r.courseId === course.id);
            return (
              <div key={course.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <h4 className="font-display font-bold text-card-foreground text-sm">{course.title}</h4>
                {taken && result ? (
                  <p className="mt-2 text-sm text-success font-medium">Completed: {result.percentage}%</p>
                ) : enabled ? (
                  <Link to={`/student/quiz/${course.id}`}>
                    <Button size="sm" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
                      Take Quiz (15 min)
                    </Button>
                  </Link>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">Quiz not enabled yet</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quiz Performance */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Quiz Performance</h3>
          {quizChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={quizChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(45, 88%, 62%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No quiz results yet</p>
          )}
        </div>

        {/* Attendance Trend */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Attendance by Course</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="attendance" fill="hsl(142, 72%, 40%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Donut */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground mb-4">Course Completion</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={completionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {completionData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
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

export default StudentCalendar;
