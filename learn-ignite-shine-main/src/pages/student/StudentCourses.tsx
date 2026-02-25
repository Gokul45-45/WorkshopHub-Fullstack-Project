import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { Star, Clock, Users, CheckCircle, CreditCard } from "lucide-react";

const StudentCourses = () => {
  const enrolledIds = useAppSelector((s) => s.courses.enrolledCourseIds);
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const payments = useAppSelector((s) => s.courses.payments);

  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">My Courses</h2>
        <p className="text-muted-foreground">Courses you're currently enrolled in</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => {
          const trainer = trainers.find((t) => t.id === course.trainerId);
          return (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="group rounded-xl border bg-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                {course.category}
              </span>
              <h3 className="mt-2 font-display font-bold text-card-foreground group-hover:text-accent transition-colors">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{trainer?.name}</p>
              <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 text-star"><Star className="h-3.5 w-3.5 fill-current" /> {course.rating}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{course.id === "c6" ? "100%" : "45%"}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-accent transition-all" style={{ width: course.id === "c6" ? "100%" : "45%" }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Payment History */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-accent" /> Payment History
        </h3>
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Course</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground hidden sm:table-cell">Method</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Amount</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const course = courses.find((c) => c.id === p.courseId);
                return (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-card-foreground">{course?.title || p.courseId}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.method}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right font-medium text-card-foreground">₹{p.amount}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        <CheckCircle className="h-3 w-3" /> {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {enrolledCourses.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="mt-2 inline-block text-accent hover:underline">Browse Courses →</Link>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
