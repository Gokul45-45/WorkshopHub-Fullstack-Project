import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="bg-hero py-16 md:py-20 text-hero-foreground">
      <div className="container text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to Start Learning?</h2>
        <p className="mx-auto mt-3 max-w-xl text-hero-muted text-lg">
          Join thousands of professionals building their future with Workshop Hub
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/courses">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Browse Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="border-hero-muted/30 text-hero-foreground hover:bg-hero-foreground/10">
              Become a Trainer
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
