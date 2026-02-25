import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <Rocket className="h-5 w-5 text-accent" />
          Workshop Hub
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/courses" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:inline-block">
            Courses
          </Link>
          <Link to="/login/student">
            <Button variant="outline" size="sm">Student Login</Button>
          </Link>
          <Link to="/login/trainer">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Trainer Login</Button>
          </Link>
          <Link to="/login/admin" className="hidden sm:inline-block">
            <Button variant="ghost" size="sm">Admin</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
