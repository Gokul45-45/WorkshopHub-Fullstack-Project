const testimonials = [
  {
    quote: "The React bootcamp transformed my career. I landed my dream job within 2 months of completing the course!",
    name: "Aisha Bano",
    role: "Software Engineer at Infosys",
  },
  {
    quote: "Dr. Sharma's ML course is the most practical and well-structured course I've ever taken. Highly recommended!",
    name: "Rohit Mehta",
    role: "Data Analyst at Wipro",
  },
  {
    quote: "The AWS certification prep was exactly what I needed. Passed on my first attempt thanks to this platform.",
    name: "Divya Krishnan",
    role: "Cloud Engineer at TCS",
  },
  {
    quote: "Affordable, high-quality courses with real industry experts. This platform is a game-changer for Indian tech education.",
    name: "Suresh Yadav",
    role: "Freelance Developer",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/50">
      <div className="container">
        <h2 className="font-display text-3xl font-bold text-foreground text-center">What Our Students Say</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <p className="text-foreground italic leading-relaxed">"{t.quote}"</p>
              <div className="mt-4">
                <p className="font-display font-bold text-card-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
