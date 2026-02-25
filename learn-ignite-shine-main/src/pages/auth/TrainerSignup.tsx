import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useRedux";
import { login } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, User } from "lucide-react";

const TrainerSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email || !password || !company.trim() || !designation.trim()) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    dispatch(login({
      role: "trainer",
      userId: `t${Date.now()}`,
      userName: name.trim(),
      email,
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(name.trim())}`,
    }));
    navigate("/trainer");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Rocket className="h-8 w-8 text-accent" />
          <span className="font-display text-2xl font-bold text-hero-foreground">Workshop Hub</span>
        </div>

        <div className="rounded-xl border border-sidebar-border bg-card p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <User className="h-6 w-6 text-accent" />
            <h2 className="font-display text-xl font-bold text-card-foreground">Trainer Sign Up</h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
              <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" maxLength={100} />
            </div>
            <div>
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input id="email" type="email" placeholder="trainer@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" maxLength={255} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="company" className="text-card-foreground">Company</Label>
                <Input id="company" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1" maxLength={100} />
              </div>
              <div>
                <Label htmlFor="designation" className="text-card-foreground">Designation</Label>
                <Input id="designation" placeholder="Your role" value={designation} onChange={(e) => setDesignation(e.target.value)} className="mt-1" maxLength={100} />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-card-foreground">Password</Label>
              <Input id="password" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-card-foreground">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Create Trainer Account
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login/trainer" className="text-accent hover:underline font-medium">Sign In</Link>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button onClick={() => navigate("/")} className="text-sm text-hero-muted hover:text-hero-foreground transition-colors">← Home</button>
        </div>
      </div>
    </div>
  );
};

export default TrainerSignup;
