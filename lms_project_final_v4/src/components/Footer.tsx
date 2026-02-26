import { Rocket } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-10">
      <div className="container flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <Rocket className="h-4 w-4 text-accent" />
          Workshop Hub
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 Workshop Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
