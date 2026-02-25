import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const stats = [
  { value: "20+", label: "Courses" },
  { value: "8+", label: "Expert Trainers" },
  { value: "25K+", label: "Students" },
];

const HeroSection = () => {
  return (
    <section className="bg-hero text-hero-foreground">
      <div className="container py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent">
              🚀 Learn from Industry Experts
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-[3.5rem]">
              Master New Skills with{" "}
              <span className="text-accent">Live Workshops</span>
            </h1>
            <p className="max-w-lg text-hero-muted text-lg">
              Join 25,000+ professionals upgrading their skills through expert-led workshops in AI, Cloud, Web Dev, and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-hero-muted/30 text-hero-foreground hover:bg-hero-foreground/10">
                  Join as Student
                </Button>
              </Link>
            </div>
            <div className="flex gap-8 pt-2">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-hero-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <img
              src={heroImage}
              alt="Professionals collaborating in online workshop"
              className="rounded-xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
