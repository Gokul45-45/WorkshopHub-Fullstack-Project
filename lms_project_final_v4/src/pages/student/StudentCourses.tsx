import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { Star, Clock, CheckCircle, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentCourses = () => {
  const navigate = useNavigate();
  const enrolledIds = useAppSelector((s) => s.courses.enrolledCourseIds);
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const payments = useAppSelector((s) => s.courses.payments);

  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">My Courses</h2>
          <p className="text-muted-foreground text-sm">Courses you're currently enrolled in</p>
        </div>
        <Button onClick={() => navigate('/courses')} variant="outline" size="sm">Browse More</Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => {
          const progressDisplay = course.id === 'c6' ? 100 : 45;
          return (
            <div
              key={course.id}
              className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer"
              onClick={() => navigate(`/student/learning-hub/${course.id}`)}
            >
              <div className="flex justify-between mb-3 text-card-foreground">
                <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent uppercase">
                  {course.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {course.duration}</span>
              </div>
              <h4 className="font-bold text-foreground group-hover:text-accent transition-colors leading-tight mb-4 flex-1">{course.title}</h4>

              <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase mb-2">
                <span>Progress</span>
                <span>{progressDisplay}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full mb-6">
                <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${progressDisplay}%` }} />
              </div>

              <Button size="sm" className="w-full h-9 text-[10px] font-bold uppercase tracking-wider gap-2 group-hover:bg-accent transition-colors">
                Continue Learning <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
        {enrolledCourses.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-2xl">
            <BookOpenIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
            <Button variant="link" onClick={() => navigate('/courses')} className="mt-2">Browse Catalog</Button>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="pt-4">
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-accent" /> Payment History
        </h3>
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden text-card-foreground">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Course</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px] text-muted-foreground hidden sm:table-cell">Method</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider text-[10px] text-muted-foreground hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => {
                  const course = courses.find((c) => c.id === p.courseId);
                  return (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium">{course?.title || p.courseId}</td>
                      <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{p.method}</td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right font-bold">₹{p.amount}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success uppercase">
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
      </div>
    </div>
  );
};

const BookOpenIcon = ({ className }: { className?: string }) => (
  <Star className={className} />
);

export default StudentCourses;
