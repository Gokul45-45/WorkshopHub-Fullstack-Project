import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const trainers = [
  { id: "t1", name: "Dr. Ananya Sharma", role: "Chief AI Officer", org: "TechCorp India", rating: 4.9, students: 4520, seed: "ananya" },
  { id: "t2", name: "Rajesh Kumar", role: "Solutions Architect", org: "CloudPro Solutions", rating: 4.8, students: 3800, seed: "rajesh" },
  { id: "t3", name: "Priya Patel", role: "Senior Frontend Lead", org: "WebForge Labs", rating: 4.9, students: 5200, seed: "priya" },
  { id: "t4", name: "Vikram Singh", role: "Security Consultant", org: "SecureTech", rating: 4.7, students: 2900, seed: "vikram" },
];

const TrainersSection = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Top Trainers</h2>
          <p className="mt-2 text-muted-foreground">Learn from the best in the industry</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map((t) => (
            <Link
              key={t.id}
              to={`/trainer-profile/${t.id}`}
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${t.seed}`}
                alt={t.name}
                className="h-20 w-20 rounded-full bg-secondary"
              />
              <h3 className="mt-4 font-display text-base font-bold text-card-foreground">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.role}</p>
              <p className="text-sm text-muted-foreground">{t.org}</p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-star">
                  <Star className="h-3.5 w-3.5 fill-current" /> {t.rating}
                </span>
                <span className="text-muted-foreground">{t.students.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
