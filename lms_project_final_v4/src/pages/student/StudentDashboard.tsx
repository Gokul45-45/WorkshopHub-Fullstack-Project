import { useAppSelector } from "@/hooks/useRedux";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, BarChart3, Award, Clock, Star,
  TrendingUp, Calendar, Zap, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const enrolledIds = useAppSelector((s) => s.courses.enrolledCourseIds);
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const { userName } = useAppSelector((s) => s.auth);
  const { streak, points } = useAppSelector(s => s.gamification);
  const events = useAppSelector(s => s.quiz.calendarEvents).slice(0, 3);

  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  const stats = [
    { label: "Enrolled", value: enrolledCourses.length, icon: BookOpen, color: "text-info" },
    { label: "Points", value: points, icon: Zap, color: "text-accent" },
    { label: "Streak", value: `${streak} Days`, icon: TrendingUp, color: "text-orange-500" },
    { label: "Certificates", value: 1, icon: Award, color: "text-warning" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Welcome back, {userName?.split(" ")[0]}! 👋</h2>
          <p className="text-muted-foreground text-sm">Focus on your goals and earn rewards today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/student/leaderboard')}>
            <TrophyIcon className="h-4 w-4 text-warning" /> Leaderboard
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-card-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main: Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-foreground">My Learning Journey</h3>
            <Button variant="link" size="sm" onClick={() => navigate('/student/courses')}>View All</Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {enrolledCourses.map((course) => {
              const trainer = trainers.find((t) => t.id === course.trainerId);
              const progressDisplay = course.id === "c6" ? 100 : 45;
              return (
                <div key={course.id} className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="h-32 bg-muted relative overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop`}
                      alt=""
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {course.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-foreground leading-tight group-hover:text-accent transition-colors">{course.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{trainer?.name}</p>

                    {/* Progress */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                        <span>{progressDisplay}% Complete</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-700"
                          style={{ width: `${progressDisplay}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 h-9 gap-2 group/btn"
                      variant="ghost"
                      onClick={() => navigate(`/student/learning-hub/${course.id}`)}
                    >
                      Continue Learning <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming Classes & Quick Actions */}
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" /> Upcoming Classes
            </h3>
            <div className="space-y-3">
              {events.map(ev => (
                <div key={ev.id} className="p-4 rounded-xl border bg-card shadow-sm hover:bg-muted/30 transition-colors cursor-pointer text-card-foreground">
                  <p className="text-xs font-bold text-accent mb-1">{ev.date}</p>
                  <p className="text-sm font-bold leading-tight">{ev.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">{ev.type}</p>
                </div>
              ))}
              {events.length === 0 && <p className="text-sm text-muted-foreground italic">No classes scheduled.</p>}
            </div>
          </div>

          <div className="rounded-2xl bg-neutral-900 border p-6 text-white text-center shadow-xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent opacity-20 blur-3xl group-hover:opacity-40 transition-opacity" />
            <Award className="h-12 w-12 mx-auto mb-4 text-warning animate-bounce" />
            <h3 className="font-bold text-lg mb-2">Claim Your Weekly Reward</h3>
            <p className="text-xs text-white/60 mb-6">Complete all weekly challenges to unlock the 'Elite Learner' badge.</p>
            <Button className="w-full bg-white text-black hover:bg-white/90 font-bold" onClick={() => navigate('/student/leaderboard')}>View Challenges</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrophyIcon = ({ className }: { className?: string }) => (
  <Star className={className} />
);

export default StudentDashboard;
