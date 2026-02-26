import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const courses = [
  { id: "c1", category: "AI & ML", title: "Complete Machine Learning Bootcamp", trainer: "Dr. Ananya Sharma", org: "TechCorp India", rating: 4.6, price: "₹2499" },
  { id: "c2", category: "AI & ML", title: "Deep Learning with TensorFlow", trainer: "Karthik Iyer", org: "DataVerse Analytics", rating: 4.6, price: "₹2999" },
  { id: "c3", category: "Cloud Computing", title: "AWS Cloud Practitioner Masterclass", trainer: "Rajesh Kumar", org: "CloudPro Solutions", rating: 4.4, price: "₹1999" },
  { id: "c4", category: "DevOps", title: "Azure DevOps Complete Guide", trainer: "Rajesh Kumar", org: "CloudPro Solutions", rating: 4.7, price: "₹2299" },
  { id: "c5", category: "Data Science", title: "Data Science with Python", trainer: "Karthik Iyer", org: "DataVerse Analytics", rating: 4.5, price: "₹1799" },
  { id: "c6", category: "React Development", title: "React 18 - The Complete Guide", trainer: "Priya Patel", org: "WebForge Labs", rating: 4.9, price: "₹1599" },
];

const CoursesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/50">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Featured Courses</h2>
          <p className="mt-2 text-muted-foreground">Handpicked by our team for maximum impact</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <span className="inline-block rounded-md bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                {course.category}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-card-foreground group-hover:text-accent transition-colors">
                {course.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {course.trainer} · {course.org}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-star">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold">{course.rating}</span>
                </div>
                <span className="font-display text-lg font-bold text-foreground">{course.price}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/courses"><Button variant="outline" size="lg">View All Courses</Button></Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
