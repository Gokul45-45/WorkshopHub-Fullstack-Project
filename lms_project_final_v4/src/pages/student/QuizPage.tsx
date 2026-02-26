import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { submitQuizResult } from "@/store/slices/quizSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { getQuizForCourse } from "@/data/quizData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const QUIZ_DURATION = 900; // 15 minutes in seconds

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((s) => s.courses.courses);
  const quizResults = useAppSelector((s) => s.quiz.results);
  const quizEnabled = useAppSelector((s) => s.quiz.quizEnabled);

  const course = courses.find((c) => c.id === courseId);
  const alreadyTaken = quizResults.some((r) => r.courseId === courseId);
  const isEnabled = courseId ? quizEnabled[courseId] : false;

  const questions = useMemo(() => {
    if (!courseId) return [];
    const raw = getQuizForCourse(courseId);
    return shuffleArray(raw).map((q) => {
      const indices = q.options.map((_, i) => i);
      const shuffledIndices = shuffleArray(indices);
      return {
        ...q,
        options: shuffledIndices.map((i) => q.options[i]),
        correctIndex: shuffledIndices.indexOf(q.correctIndex),
      };
    });
  }, [courseId]);

  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer
  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  // Warn on refresh
  useEffect(() => {
    if (!started || submitted) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [started, submitted]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    const percentage = Math.round((correct / questions.length) * 100);
    dispatch(submitQuizResult({
      courseId: courseId!,
      score: correct,
      totalQuestions: questions.length,
      percentage,
      completedAt: new Date().toISOString(),
    }));
    dispatch(addNotification({
      message: `Quiz completed! You scored ${correct}/${questions.length} (${percentage}%) in "${course?.title}".`,
      type: percentage >= 50 ? "success" : "warning",
      read: false,
    }));
  }, [answers, questions, submitted, courseId, course, dispatch]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const timerColor = timeLeft < 120 ? "text-destructive" : timeLeft < 300 ? "text-warning" : "text-foreground";

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Course not found</h2>
          <Link to="/student" className="mt-4 inline-block text-accent hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="h-16 w-16 text-warning mx-auto" />
          <h2 className="font-display text-2xl font-bold text-foreground">Quiz Not Available</h2>
          <p className="text-muted-foreground">The quiz for this course hasn't been enabled by the trainer yet.</p>
          <Link to="/student"><Button className="bg-accent text-accent-foreground">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  if (alreadyTaken && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
          <h2 className="font-display text-2xl font-bold text-foreground">Quiz Already Completed</h2>
          <p className="text-muted-foreground">You've already taken this quiz. Only one attempt is allowed.</p>
          <Link to="/student"><Button className="bg-accent text-accent-foreground">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  // Results screen
  if (submitted) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 50;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-lg animate-fade-in-up text-center space-y-6">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${passed ? "bg-success/10" : "bg-destructive/10"}`}>
            {passed ? <CheckCircle2 className="h-10 w-10 text-success" /> : <XCircle className="h-10 w-10 text-destructive" />}
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {passed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
          </h2>
          <p className="text-muted-foreground">{course.title}</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="font-display text-2xl font-bold text-card-foreground">{score}/{questions.length}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className={`font-display text-2xl font-bold ${passed ? "text-success" : "text-destructive"}`}>{percentage}%</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="font-display text-2xl font-bold text-card-foreground">{formatTime(QUIZ_DURATION - timeLeft)}</p>
              <p className="text-xs text-muted-foreground">Time Taken</p>
            </div>
          </div>

          {/* Answer review */}
          <div className="text-left space-y-3 max-h-60 overflow-y-auto">
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div key={q.id} className={`rounded-lg border p-3 text-sm ${isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
                  <p className="font-medium text-card-foreground">{i + 1}. {q.question}</p>
                  <p className="text-muted-foreground mt-1">
                    Your answer: {answers[i] !== null ? q.options[answers[i]!] : "Not answered"} {isCorrect ? "✓" : `✗ (Correct: ${q.options[q.correctIndex]})`}
                  </p>
                </div>
              );
            })}
          </div>

          <Button onClick={() => navigate("/student")} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Pre-start screen
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-6 animate-fade-in-up">
          <h2 className="font-display text-2xl font-bold text-foreground">Quiz: {course.title}</h2>
          <div className="rounded-xl border bg-card p-6 space-y-3 text-sm text-left">
            <p className="text-card-foreground"><strong>Questions:</strong> {questions.length} MCQs</p>
            <p className="text-card-foreground"><strong>Time Limit:</strong> 15 minutes</p>
            <p className="text-card-foreground"><strong>Attempts:</strong> 1 (single attempt only)</p>
            <p className="text-card-foreground"><strong>Passing Score:</strong> 50%</p>
            <p className="text-destructive font-medium mt-2">⚠ Auto-submits when timer reaches 00:00</p>
          </div>
          <Button onClick={() => setStarted(true)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold h-12">
            Start Quiz
          </Button>
          <Link to="/student" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const q = questions[currentQ];
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-2xl py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-foreground truncate">{course.title}</h2>
          <div className={`flex items-center gap-2 rounded-lg border bg-card px-4 py-2 font-mono text-lg font-bold ${timerColor}`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{answers.filter((a) => a !== null).length} answered</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-xl border bg-card p-6 shadow-sm animate-fade-in-up">
          <p className="font-display text-lg font-bold text-card-foreground mb-4">{currentQ + 1}. {q.question}</p>
          <div className="space-y-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentQ] = i;
                  setAnswers(newAnswers);
                }}
                className={`w-full text-left rounded-lg border p-4 text-sm font-medium transition-all ${
                  answers[currentQ] === i
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-card-foreground hover:border-foreground/20 hover:bg-muted/30"
                }`}
              >
                <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ((c) => c - 1)}>
            Previous
          </Button>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  i === currentQ ? "bg-accent" : answers[i] !== null ? "bg-success" : "bg-muted"
                }`}
              />
            ))}
          </div>
          {currentQ < questions.length - 1 ? (
            <Button onClick={() => setCurrentQ((c) => c + 1)} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-success text-success-foreground hover:bg-success/90">
              Submit Quiz
            </Button>
          )}
        </div>

        {/* Quick nav */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`h-8 w-8 rounded-md border text-xs font-bold transition-colors ${
                i === currentQ ? "border-accent bg-accent text-accent-foreground"
                : answers[i] !== null ? "border-success bg-success/10 text-success"
                : "border-border text-muted-foreground hover:border-foreground/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
