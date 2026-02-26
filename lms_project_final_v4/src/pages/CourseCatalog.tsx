import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { Search, Star, Clock, Users, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allCategories = ["All", "AI & ML", "Cloud Computing", "Data Science", "DevOps", "React Development", "Cyber Security"];

const CourseCatalog = () => {
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high" | "popular">("popular");

  const filtered = useMemo(() => {
    let result = courses.filter((c) => c.status === "active");
    if (category !== "All") result = result.filter((c) => c.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          trainers.find((t) => t.id === c.trainerId)?.name.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "rating": return [...result].sort((a, b) => b.rating - a.rating);
      case "price-low": return [...result].sort((a, b) => a.price - b.price);
      case "price-high": return [...result].sort((a, b) => b.price - a.price);
      case "popular": return [...result].sort((a, b) => b.enrolled - a.enrolled);
      default: return result;
    }
  }, [courses, trainers, search, category, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-hero py-12">
          <div className="container text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-hero-foreground">Explore Courses</h1>
            <p className="mt-2 text-hero-muted">Find the perfect course to level up your skills</p>
            <div className="mx-auto mt-6 max-w-lg relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, topics, or trainers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>
        </section>

        <section className="container py-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" /> Category:
            </div>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="ml-auto rounded-lg border bg-card px-3 py-1.5 text-sm text-foreground"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{filtered.length} courses found</p>

          {/* Course Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const trainer = trainers.find((t) => t.id === course.trainerId);
              return (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="group rounded-xl border bg-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <span className="inline-block rounded-md bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    {course.category}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-card-foreground group-hover:text-accent transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{trainer?.name} · {trainer?.company}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-star">
                      <Star className="h-3.5 w-3.5 fill-current" /> {course.rating}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {course.enrolled.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <span className="font-display text-xl font-bold text-foreground">₹{course.price}</span>
                    <span className="text-sm font-medium text-accent">View Details →</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">No courses found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CourseCatalog;
