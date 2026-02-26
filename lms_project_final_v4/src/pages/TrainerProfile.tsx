import { useParams, Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { Star, Briefcase, Award, BookOpen, Users, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const trainers = useAppSelector((s) => s.courses.trainers);
  const courses = useAppSelector((s) => s.courses.courses);

  const trainer = trainers.find((t) => t.id === trainerId);
  const trainerCourses = courses.filter((c) => c.trainerId === trainerId);

  if (!trainer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">Trainer not found</h2>
            <Link to="/" className="mt-4 inline-block text-accent hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-hero py-12">
          <div className="container">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-hero-muted hover:text-hero-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img src={trainer.avatar} alt={trainer.name} className="h-24 w-24 rounded-full bg-muted" />
              <div className="text-center sm:text-left">
                <h1 className="font-display text-3xl font-bold text-hero-foreground">{trainer.name}</h1>
                <p className="text-hero-muted">{trainer.designation} at {trainer.company}</p>
                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-hero-muted">
                  <span className="flex items-center gap-1 text-star"><Star className="h-4 w-4 fill-current" /> {trainer.rating}</span>
                  <span className="flex items-center gap-1"><Award className="h-4 w-4" /> {trainer.experience} years</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {trainerCourses.length} courses</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-10 space-y-8">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">About</h2>
            <p className="text-muted-foreground">{trainer.bio}</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {trainer.expertise.map((skill) => (
                <span key={skill} className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">{skill}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Courses by {trainer.name.split(" ")[0]}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trainerCourses.map((course) => (
                <Link key={course.id} to={`/course/${course.id}`} className="group rounded-xl border bg-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                  <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">{course.category}</span>
                  <h3 className="mt-2 font-display font-bold text-card-foreground group-hover:text-accent transition-colors">{course.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 text-star"><Star className="h-3.5 w-3.5 fill-current" /> {course.rating}</span>
                    <span><Users className="inline h-3.5 w-3.5" /> {course.enrolled.toLocaleString()}</span>
                    <span className="font-bold text-foreground">₹{course.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrainerProfile;
