import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useRedux";
import { login } from "@/store/slices/authSlice";
import { mockAdmins } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, ShieldCheck, RefreshCw } from "lucide-react";

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@workshop.hub");
  const [password, setPassword] = useState("demo123");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill all fields."); return; }
    if (captchaInput !== captcha) {
      setError("CAPTCHA mismatch. Try again.");
      refreshCaptcha();
      return;
    }
    const user = mockAdmins[0];
    dispatch(login({ role: "admin", userId: user.id, userName: user.name, email: user.email, avatar: user.avatar }));
    navigate("/admin");
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
            <ShieldCheck className="h-6 w-6 text-accent" />
            <h2 className="font-display text-xl font-bold text-card-foreground">Admin Login</h2>
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

            {/* CAPTCHA */}
            <div>
              <Label className="text-card-foreground">CAPTCHA Verification</Label>
              <div className="mt-1 flex items-center gap-3">
                <div className="flex-1 rounded-md bg-muted px-4 py-2.5 font-mono text-lg tracking-[0.3em] text-foreground select-none text-center line-through decoration-muted-foreground/30">
                  {captcha}
                </div>
                <button type="button" onClick={refreshCaptcha} className="rounded-md bg-muted p-2.5 text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <Input className="mt-2" placeholder="Enter CAPTCHA" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Sign In as Admin
            </Button>
          </form>

          <p className="mt-2 text-center text-xs text-muted-foreground">Admin access requires CAPTCHA verification.</p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button onClick={() => navigate("/")} className="text-sm text-hero-muted hover:text-hero-foreground transition-colors">← Home</button>
          <span className="text-hero-muted">·</span>
          <Link to="/login/student" className="text-sm text-hero-muted hover:text-hero-foreground transition-colors">Student Login</Link>
          <span className="text-hero-muted">·</span>
          <Link to="/login/trainer" className="text-sm text-hero-muted hover:text-hero-foreground transition-colors">Trainer Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
