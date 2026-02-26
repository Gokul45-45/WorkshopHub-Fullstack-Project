import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { addMaterial, Course } from "@/store/slices/coursesSlice";
import { addCalendarEvent, addQuizTemplate, simulateUpdate } from "@/store/slices/quizSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Users, Calendar, BookOpen, PenTool, ArrowLeft,
    Plus, Video, FileText, Link, Zap, Clock, Trash2
} from "lucide-react";

const CourseManagementCenter = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const course = useAppSelector(s => s.courses.courses.find(c => c.id === id));
    const performance = useAppSelector(s => s.quiz.studentPerformance.filter(p => p.courseId === id));
    const users = useAppSelector(s => s.users.users);

    const [activeTab, setActiveTab] = useState<"students" | "schedule" | "content" | "quizzes">("students");

    if (!course) return <div className="p-8 text-center">Course not found</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{course.title}</h2>
                    <p className="text-muted-foreground text-sm">Course Management Center</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b overflow-x-auto no-scrollbar">
                {([
                    { id: "students", label: "Students", icon: Users },
                    { id: "schedule", label: "Schedule", icon: Calendar },
                    { id: "content", label: "Materials", icon: BookOpen },
                    { id: "quizzes", label: "Quizzes", icon: PenTool },
                ] as const).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all shrink-0 ${activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <tab.icon className="h-4 w-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="pt-4">
                {activeTab === "students" && <StudentProgressTab courseId={course.id} performance={performance} users={users} />}
                {activeTab === "schedule" && <ScheduleTab courseId={course.id} />}
                {activeTab === "content" && <ContentTab courseId={course.id} course={course} />}
                {activeTab === "quizzes" && <QuizzesTab courseId={course.id} />}
            </div>
        </div>
    );
};

const StudentProgressTab = ({ courseId, performance, users }: { courseId: string, performance: any[], users: any[] }) => {
    const dispatch = useAppDispatch();
    return (
        <div className="space-y-4">
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden text-card-foreground">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold">Student</th>
                            <th className="px-6 py-4 text-sm font-semibold">Progress</th>
                            <th className="px-6 py-4 text-sm font-semibold">Last Active</th>
                            <th className="px-6 py-4 text-sm font-semibold">Avg. Quiz</th>
                            <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {performance.map((p) => {
                            const student = users.find(u => u.id === p.studentId);
                            const avgScore = p.quizScores.length > 0
                                ? Math.round(p.quizScores.reduce((a: number, b: number) => a + b, 0) / p.quizScores.length)
                                : 0;
                            return (
                                <tr key={p.studentId} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={student?.avatar} alt="" className="h-8 w-8 rounded-full bg-muted border" />
                                            <span className="text-sm font-medium">{student?.name || "Unknown Student"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-muted rounded-full max-w-[100px]">
                                                <div className="h-full bg-accent rounded-full" style={{ width: `${p.progress}%` }} />
                                            </div>
                                            <span className="text-xs font-semibold">{p.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{p.lastActive}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-success">{avgScore}%</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2 h-8"
                                            onClick={() => {
                                                dispatch(simulateUpdate({ studentId: p.studentId, courseId }));
                                                dispatch(addNotification({ message: `Simulated update for ${student?.name}`, type: "info", read: false }));
                                            }}
                                        >
                                            <Zap className="h-3 w-3 fill-accent text-accent" /> Live Update
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ScheduleTab = ({ courseId }: { courseId: string }) => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [link, setLink] = useState("");

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addCalendarEvent({
            title: `${title} (${time})`,
            date,
            type: "class",
            courseId
        }));
        dispatch(addNotification({ message: "Class scheduled successfully", type: "success", read: false }));
        setTitle(""); setDate(""); setTime(""); setLink("");
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-6 shadow-sm text-card-foreground">
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" /> Schedule New Class
                </h3>
                <form onSubmit={handleSchedule} className="space-y-4">
                    <div>
                        <Label>Topic Title</Label>
                        <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Intro to Neural Networks" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Date</Label>
                            <Input required type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Time</Label>
                            <Input required type="time" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>Meeting Link</Label>
                        <Input required value={link} onChange={e => setLink(e.target.value)} placeholder="https://zoom.us/j/..." />
                    </div>
                    <Button type="submit" className="w-full">Schedule Class</Button>
                </form>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm flex items-center justify-center text-muted-foreground text-center">
                <div>
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Upcoming scheduled events for this course will appear here.</p>
                </div>
            </div>
        </div>
    );
};

const ContentTab = ({ courseId, course }: { courseId: string, course: Course }) => {
    const dispatch = useAppDispatch();
    const [mtit, setMtit] = useState("");
    const [mtype, setMtype] = useState<"video" | "pdf" | "link">("video");
    const [murl, setMurl] = useState("");
    const [mmod, setMmod] = useState("Module 1");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addMaterial({
            courseId,
            material: { title: mtit, type: mtype, url: murl, module: mmod }
        }));
        dispatch(addNotification({ message: "Material added", type: "success", read: false }));
        setMtit(""); setMurl("");
    };

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 rounded-xl border bg-card p-6 shadow-sm text-card-foreground h-fit">
                <h3 className="font-display font-bold mb-4">Add Material</h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input required value={mtit} onChange={e => setMtit(e.target.value)} placeholder="Handout PDF..." />
                    </div>
                    <div>
                        <Label>Module</Label>
                        <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm" value={mmod} onChange={e => setMmod(e.target.value)}>
                            {[...Array(course.modules)].map((_, i) => <option key={i} value={`Module ${i + 1}`}>Module {i + 1}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Type</Label>
                        <div className="flex gap-2 mt-1">
                            {(["video", "pdf", "link"] as const).map(t => (
                                <button
                                    key={t} type="button" onClick={() => setMtype(t)}
                                    className={`flex-1 flex flex-col items-center p-2 rounded-lg border text-[10px] font-bold transition-all ${mtype === t ? "bg-accent/10 border-accent text-accent" : "bg-muted/50 border-transparent text-muted-foreground"
                                        }`}
                                >
                                    {t === 'video' && <Video className="h-4 w-4" />}
                                    {t === 'pdf' && <FileText className="h-4 w-4" />}
                                    {t === 'link' && <Link className="h-4 w-4" />}
                                    {t.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label>URL / Link</Label>
                        <Input required value={murl} onChange={e => setMurl(e.target.value)} placeholder="https://..." />
                    </div>
                    <Button type="submit" className="w-full">Upload & Add</Button>
                </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
                {course.materials?.length ? (
                    course.materials.map(m => (
                        <div key={m.id} className="rounded-xl border bg-card p-4 flex items-center justify-between shadow-sm text-card-foreground">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-accent">
                                    {m.type === 'video' && <Video className="h-5 w-5" />}
                                    {m.type === 'pdf' && <FileText className="h-5 w-5" />}
                                    {m.type === 'link' && <Link className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{m.title}</p>
                                    <p className="text-xs text-muted-foreground">{m.module} • {m.type.toUpperCase()}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center rounded-xl border border-dashed text-muted-foreground">
                        No materials added yet for this course.
                    </div>
                )}
            </div>
        </div>
    );
};

const QuizzesTab = ({ courseId }: { courseId: string }) => {
    const dispatch = useAppDispatch();
    const [step, setStep] = useState(1);
    const [qtitle, setQtitle] = useState("");
    const [timer, setTimer] = useState(15);
    const [questions, setQuestions] = useState<{ question: string, options: string[], correct: number }[]>([]);

    const addQ = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""], correct: 0 }]);
    };

    const handleFinish = () => {
        dispatch(addQuizTemplate({
            id: `q${Date.now()}`,
            courseId,
            title: qtitle,
            questions,
            timer
        }));
        dispatch(addNotification({ message: "Quiz built successfully!", type: "success", read: false }));
        setStep(1); setQuestions([]); setQtitle("");
    };

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm text-card-foreground max-w-2xl mx-auto">
            {step === 1 ? (
                <div className="space-y-4">
                    <h3 className="font-display font-bold text-center text-xl">Quiz Builder</h3>
                    <div>
                        <Label>Quiz Title</Label>
                        <Input value={qtitle} onChange={e => setQtitle(e.target.value)} placeholder="Final Assessment..." />
                    </div>
                    <div>
                        <Label>Timer (Minutes)</Label>
                        <Input type="number" value={timer} onChange={e => setTimer(Number(e.target.value))} />
                    </div>
                    <Button className="w-full" onClick={() => { if (qtitle) setStep(2); }}>Next: Add Questions</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold">Adding Questions ({questions.length})</h3>
                        <Button size="sm" variant="outline" onClick={addQ} className="gap-2"><Plus className="h-4 w-4" /> Add Question</Button>
                    </div>

                    <div className="space-y-8 max-h-[50vh] overflow-y-auto px-1">
                        {questions.map((q, qidx) => (
                            <div key={qidx} className="space-y-3 p-4 bg-muted/30 rounded-xl relative">
                                <Label className="text-accent">Question {qidx + 1}</Label>
                                <Input
                                    value={q.question}
                                    onChange={e => {
                                        const n = [...questions];
                                        n[qidx].question = e.target.value;
                                        setQuestions(n);
                                    }}
                                    placeholder="Enter your question here..."
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    {q.options.map((opt, oidx) => (
                                        <div key={oidx} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`q-${qidx}`}
                                                checked={q.correct === oidx}
                                                onChange={() => {
                                                    const n = [...questions];
                                                    n[qidx].correct = oidx;
                                                    setQuestions(n);
                                                }}
                                            />
                                            <Input
                                                value={opt}
                                                onChange={e => {
                                                    const n = [...questions];
                                                    n[qidx].options[oidx] = e.target.value;
                                                    setQuestions(n);
                                                }}
                                                placeholder={`Option ${oidx + 1}`}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                        <Button className="flex-1" onClick={handleFinish} disabled={questions.length === 0}>Finish Builder</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagementCenter;
