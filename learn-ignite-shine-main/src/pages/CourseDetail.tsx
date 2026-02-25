import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { mockCourseModules } from "@/data/mockData";
import {
  Star, Clock, Users, BookOpen, CheckCircle, PlayCircle,
  FlaskConical, FolderGit2, ArrowLeft, Briefcase, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const moduleTypeIcon: Record<string, React.ReactNode> = {
  video: <PlayCircle className="h-4 w-4 text-info" />,
  lab: <FlaskConical className="h-4 w-4 text-success" />,
  project: <FolderGit2 className="h-4 w-4 text-accent" />,
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const enrolledIds = useAppSelector((s) => s.courses.enrolledCourseIds);

  const course = courses.find((c) => c.id === courseId);
  const trainer = course ? trainers.find((t) => t.id === course.trainerId) : null;
  const modules = courseId ? mockCourseModules[courseId] || [] : [];
  const isEnrolled = courseId ? enrolledIds.includes(courseId) : false;

  if (!course || !trainer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">Course not found</h2>
            <Link to="/courses" className="mt-4 inline-block text-accent hover:underline">← Back to Courses</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-hero py-10">
          <div className="container">
            <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-hero-muted hover:text-hero-foreground mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> All Courses
            </Link>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <span className="inline-block rounded-md bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
                  {course.category}
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-hero-foreground">{course.title}</h1>
                <p className="text-hero-muted text-lg">{course.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-hero-muted">
                  <span className="flex items-center gap-1 text-star"><Star className="h-4 w-4 fill-current" /> {course.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.enrolled.toLocaleString()} students</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {course.modules} modules</span>
                </div>
              </div>

              {/* Price card */}
              <div className="rounded-xl border border-sidebar-border bg-card p-6 shadow-xl self-start">
                <div className="text-center">
                  <p className="font-display text-4xl font-bold text-card-foreground">₹{course.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">One-time payment · Lifetime access</p>
                </div>
                {isEnrolled ? (
                  <Button className="w-full mt-6 bg-success text-success-foreground" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" /> Already Enrolled
                  </Button>
                ) : (
                  <Button
                    className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                    onClick={() => navigate(`/checkout/${course.id}`)}
                  >
                    Enroll Now
                  </Button>
                )}
                {/* What you'll learn */}
                {course.learnings && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-display font-bold text-card-foreground text-sm">What you'll learn:</h4>
                    {course.learnings.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="container py-10">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Modules */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Course Curriculum</h2>
              <div className="space-y-2">
                {modules.map((mod, i) => (
                  <div key={mod.id} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 hover:bg-muted/30 transition-colors">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground shrink-0">
                      {i + 1}
                    </span>
                    {moduleTypeIcon[mod.type] || null}
                    <span className="flex-1 text-sm font-medium text-card-foreground">{mod.title}</span>
                    <span className="text-xs text-muted-foreground">{mod.duration}</span>
                  </div>
                ))}
              </div>

              {course.requirements && (
                <div className="mt-8">
                  <h2 className="font-display text-xl font-bold text-foreground mb-3">Prerequisites</h2>
                  <ul className="space-y-1.5">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trainer profile (read-only) */}
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Your Instructor</h2>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={trainer.avatar} alt={trainer.name} className="h-16 w-16 rounded-full bg-muted" />
                  <div>
                    <h3 className="font-display font-bold text-card-foreground">{trainer.name}</h3>
                    <p className="text-sm text-muted-foreground">{trainer.designation}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4 shrink-0" /> {trainer.company}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4 shrink-0" /> {trainer.experience} years experience
                  </div>
                  <div className="flex items-center gap-2 text-star">
                    <Star className="h-4 w-4 fill-current" /> {trainer.rating} rating
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{trainer.bio}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {trainer.expertise.map((skill) => (
                    <span key={skill} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
