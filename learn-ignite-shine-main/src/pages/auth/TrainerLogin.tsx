import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useRedux";
import { login } from "@/store/slices/authSlice";
import { mockTrainers } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, User } from "lucide-react";

const TrainerLogin = () => {
  const [email, setEmail] = useState("ananya@techcorp.in");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill all fields."); return; }
    const user = mockTrainers[0];
    dispatch(login({ role: "trainer", userId: user.id, userName: user.name, email: user.email, avatar: user.avatar }));
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
            <h2 className="font-display text-xl font-bold text-card-foreground">Trainer Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password" className="text-card-foreground">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Sign In as Trainer
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup/trainer" className="text-accent hover:underline font-medium">Sign Up</Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">Demo credentials are pre-filled.</p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button onClick={() => navigate("/")} className="text-sm text-hero-muted hover:text-hero-foreground transition-colors">← Home</button>
          <span className="text-hero-muted">·</span>
          <Link to="/login/student" className="text-sm text-hero-muted hover:text-hero-foreground transition-colors">Student Login</Link>
          <span className="text-hero-muted">·</span>
          <Link to="/login/admin" className="text-sm text-hero-muted hover:text-hero-foreground transition-colors">Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

export default TrainerLogin;
