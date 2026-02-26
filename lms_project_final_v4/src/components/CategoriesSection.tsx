import { Link } from "react-router-dom";

const categories = [
  "AI & ML", "Cloud Computing", "Data Science", "Cyber Security",
  "Web Development", "React Development", "HTML & CSS", "DevOps",
  "Blockchain", "Mobile App Development", "Software Engineering",
  "Networking", "Database Systems", "Operating Systems", "UI/UX Design",
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container text-center">
        <h2 className="font-display text-3xl font-bold text-foreground">Browse by Category</h2>
        <p className="mt-2 text-muted-foreground">15 specialized domains to choose from</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/courses?category=${encodeURIComponent(cat)}`}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground hover:border-accent"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
