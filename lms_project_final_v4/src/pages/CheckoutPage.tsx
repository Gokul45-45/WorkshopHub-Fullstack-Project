import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { enrollCourse } from "@/store/slices/coursesSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, CreditCard, Smartphone, Landmark, CheckCircle2,
  ShieldCheck, Lock, PartyPopper
} from "lucide-react";

type PaymentMethod = "upi" | "credit" | "debit" | "netbanking";

const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"];

const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const enrolledIds = useAppSelector((s) => s.courses.enrolledCourseIds);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const course = courses.find((c) => c.id === courseId);
  const trainer = course ? trainers.find((t) => t.id === course.trainerId) : null;

  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form fields
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  if (!course || !trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Course not found</h2>
          <Link to="/courses" className="mt-4 inline-block text-accent hover:underline">← Back to Courses</Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">Please log in first</h2>
          <Link to="/login"><Button className="bg-accent text-accent-foreground">Go to Login</Button></Link>
        </div>
      </div>
    );
  }

  if (courseId && enrolledIds.includes(courseId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
          <h2 className="font-display text-2xl font-bold text-foreground">Already Enrolled!</h2>
          <p className="text-muted-foreground">You're already enrolled in this course.</p>
          <Link to="/student"><Button className="bg-accent text-accent-foreground">Go to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (method === "upi") {
      if (!upiId.trim()) errs.upiId = "UPI ID is required";
      else if (!/^[\w.-]+@[\w]+$/.test(upiId.trim())) errs.upiId = "Invalid UPI ID (e.g. name@upi)";
    }

    if (method === "credit" || method === "debit") {
      if (!cardNumber.trim()) errs.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) errs.cardNumber = "Must be 16 digits";
      if (!cardExpiry.trim()) errs.cardExpiry = "Expiry is required";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) errs.cardExpiry = "Format: MM/YY";
      if (!cardCvv.trim()) errs.cardCvv = "CVV is required";
      else if (!/^\d{3}$/.test(cardCvv.trim())) errs.cardCvv = "Must be 3 digits";
      if (!cardName.trim()) errs.cardName = "Name is required";
      else if (cardName.trim().length > 100) errs.cardName = "Name too long";
    }

    if (method === "netbanking") {
      if (!selectedBank) errs.bank = "Please select a bank";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePayment = () => {
    if (!validate()) return;
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);

      const methodLabel =
        method === "upi" ? "UPI" :
        method === "credit" ? "Credit Card" :
        method === "debit" ? "Debit Card" : "Net Banking";

      dispatch(enrollCourse({
        courseId: course.id,
        payment: {
          courseId: course.id,
          amount: course.price,
          method: methodLabel,
          date: new Date().toISOString(),
          status: "success",
        },
      }));

      dispatch(addNotification({
        message: `Payment of ₹${course.price} successful! You're now enrolled in "${course.title}".`,
        type: "success",
        read: false,
      }));
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-6 animate-fade-in-up">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 animate-pulse-accent">
            <PartyPopper className="h-10 w-10 text-success" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Payment Successful! 🎉</h2>
          <p className="text-muted-foreground">You've been enrolled in <strong>{course.title}</strong></p>
          <div className="rounded-xl border bg-card p-4 text-sm text-left space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-card-foreground">₹{course.price}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Course</span><span className="text-card-foreground">{course.title}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono text-card-foreground">TXN{Date.now()}</span></div>
          </div>
          <Button onClick={() => navigate("/student")} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const methodTabs: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { key: "upi", label: "UPI", icon: <Smartphone className="h-4 w-4" /> },
    { key: "credit", label: "Credit Card", icon: <CreditCard className="h-4 w-4" /> },
    { key: "debit", label: "Debit Card", icon: <CreditCard className="h-4 w-4" /> },
    { key: "netbanking", label: "Net Banking", icon: <Landmark className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-3xl py-8">
        <Link to={`/course/${course.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Link>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Payment Form */}
          <div className="lg:col-span-3 space-y-6">
            <h1 className="font-display text-2xl font-bold text-foreground">Checkout</h1>

            {/* Payment method tabs */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {methodTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setMethod(tab.key); setErrors({}); }}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm font-medium transition-all ${
                    method === tab.key
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-foreground/20"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* UPI */}
            {method === "upi" && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-display font-bold text-card-foreground">Pay via UPI</h3>
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-1"
                    maxLength={50}
                  />
                  {errors.upiId && <p className="text-xs text-destructive mt-1">{errors.upiId}</p>}
                </div>
              </div>
            )}

            {/* Credit / Debit Card */}
            {(method === "credit" || method === "debit") && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-display font-bold text-card-foreground">
                  {method === "credit" ? "Credit" : "Debit"} Card Details
                </h3>
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} className="mt-1" maxLength={100} />
                  {errors.cardName && <p className="text-xs text-destructive mt-1">{errors.cardName}</p>}
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))} className="mt-1 font-mono" maxLength={16} />
                  {errors.cardNumber && <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                    <Input id="cardExpiry" placeholder="12/28" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="mt-1" maxLength={5} />
                    {errors.cardExpiry && <p className="text-xs text-destructive mt-1">{errors.cardExpiry}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input id="cardCvv" type="password" placeholder="•••" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} className="mt-1" maxLength={3} />
                    {errors.cardCvv && <p className="text-xs text-destructive mt-1">{errors.cardCvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === "netbanking" && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-display font-bold text-card-foreground">Select Your Bank</h3>
                <div className="grid grid-cols-2 gap-2">
                  {banks.map((bank) => (
                    <button
                      key={bank}
                      onClick={() => { setSelectedBank(bank); setErrors({}); }}
                      className={`rounded-lg border p-3 text-sm text-left transition-all ${
                        selectedBank === bank
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-border text-card-foreground hover:border-foreground/20"
                      }`}
                    >
                      <Landmark className="h-4 w-4 mb-1 inline-block mr-1.5" />
                      {bank}
                    </button>
                  ))}
                </div>
                {errors.bank && <p className="text-xs text-destructive mt-1">{errors.bank}</p>}
              </div>
            )}

            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold h-12 text-base"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Processing Payment...
                </span>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" /> Pay ₹{course.price}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Secure payment · 256-bit SSL encryption (simulated)</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-20">
              <h3 className="font-display font-bold text-card-foreground mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div>
                  <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">{course.category}</span>
                  <h4 className="mt-1 font-display font-bold text-card-foreground">{course.title}</h4>
                  <p className="text-sm text-muted-foreground">{trainer.name}</p>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="text-card-foreground">₹{course.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-success">-₹0</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between font-display font-bold text-lg">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-foreground">₹{course.price}</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-muted p-3 space-y-1">
                <p className="text-xs font-medium text-foreground">Includes:</p>
                <p className="text-xs text-muted-foreground">✓ Lifetime access</p>
                <p className="text-xs text-muted-foreground">✓ Certificate of completion</p>
                <p className="text-xs text-muted-foreground">✓ {course.modules} modules · {course.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
