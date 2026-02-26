import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { Button } from "@/components/ui/button";
import {
    Play, FileText, Globe, CheckCircle,
    ArrowLeft, Calendar, BookOpen, PenTool,
    Award, ChevronRight, Clock, Zap
} from "lucide-react";
import { submitQuizResult } from "@/store/slices/quizSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { mockCourseModules } from "@/data/mockData";

const LearningHub = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const course = useAppSelector(s => s.courses.courses.find(c => c.id === id));
    const events = useAppSelector(s => s.quiz.calendarEvents.filter(e => e.courseId === id));
    const quizTemplates = useAppSelector(s => s.quiz.quizTemplates.filter(t => t.courseId === id));

    const [activeTab, setActiveTab] = useState<"content" | "schedule" | "quizzes">("content");
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

    const modules = id ? mockCourseModules[id] || [] : [];

    if (!course) return <div className="p-8 text-center text-card-foreground">Course not found</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{course.title}</h2>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">{course.category}</span>
                        <span>{course.duration}</span>
                        <span>{course.modules} Modules</span>
                    </div>
                </div>
            </div>

            {/* Hero Video Placeholder or Interactive Section */}
            <div className="aspect-video rounded-2xl bg-neutral-900 border overflow-hidden relative group">
                {selectedVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="text-center p-6 bg-card border rounded-2xl shadow-2xl max-w-sm animate-scale-in">
                            <Play className="h-12 w-12 text-accent mx-auto mb-4 fill-accent" />
                            <h3 className="font-bold text-lg mb-2">Playing: {selectedVideo}</h3>
                            <p className="text-sm text-muted-foreground mb-4">In a real app, a video player would initialize here.</p>
                            <Button onClick={() => setSelectedVideo(null)}>Close Player</Button>
                        </div>
                    </div>
                ) : (
                    <img
                        src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop`}
                        alt="Course preview"
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <p className="text-white font-bold text-xl">{course.title}</p>
                    <p className="text-white/70 text-sm">
                        {selectedVideo ? `Currently Playing: ${selectedVideo}` : `Module ${activeModuleIndex + 1}: ${modules[activeModuleIndex]?.title || 'Introduction'}`}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b overflow-x-auto no-scrollbar">
                {([
                    { id: "content", label: "Curriculum", icon: BookOpen },
                    { id: "schedule", label: "Classes", icon: Calendar },
                    { id: "quizzes", label: "Assessments", icon: PenTool },
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

            <div className="pt-4 pb-12">
                {activeTab === "content" && (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-display font-bold text-lg flex items-center gap-2">
                                <Zap className="h-5 w-5 text-accent" /> Course Curriculum
                            </h3>
                            <div className="space-y-3">
                                {modules.map((mod, i) => (
                                    <div
                                        key={mod.id}
                                        onClick={() => {
                                            setActiveModuleIndex(i);
                                            if (mod.type === 'video') setSelectedVideo(mod.title);
                                        }}
                                        className={`rounded-xl border p-4 shadow-sm transition-all cursor-pointer group flex items-center justify-between ${activeModuleIndex === i ? 'bg-accent/5 border-accent/50' : 'bg-card hover:border-accent/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${activeModuleIndex === i ? 'bg-accent text-white' : 'bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent'
                                                }`}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${activeModuleIndex === i ? 'text-accent' : 'text-foreground'}`}>{mod.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded">{mod.type}</span>
                                                    <span className="text-[10px] text-muted-foreground">• {mod.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {activeModuleIndex === i ? (
                                            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-transform group-hover:translate-x-1" />
                                        )}
                                    </div>
                                ))}
                                {modules.length === 0 && (
                                    <div className="p-8 text-center rounded-xl border border-dashed text-muted-foreground">
                                        No modules found for this course data.
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-display font-bold text-lg">Materials</h3>
                            <div className="space-y-3">
                                {course.materials?.map(m => (
                                    <div key={m.id} className="p-3 rounded-lg bg-muted/50 border flex items-center gap-3 hover:bg-muted transition-colors cursor-pointer text-card-foreground" onClick={() => m.type === 'video' ? setSelectedVideo(m.title) : window.open(m.url)}>
                                        {m.type === 'video' ? <Play className="h-4 w-4 text-accent" /> : <FileText className="h-4 w-4 text-info" />}
                                        <div>
                                            <p className="text-xs font-bold leading-none">{m.title}</p>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed uppercase mt-1">{m.type}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!course.materials || course.materials.length === 0) && (
                                    <p className="text-sm text-muted-foreground italic">No additional materials available yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "schedule" && (
                    <div className="space-y-4">
                        <h3 className="font-display font-bold text-lg">Upcoming Sessions</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {events.map(ev => (
                                <div key={ev.id} className="rounded-2xl border bg-card p-5 shadow-sm border-l-4 border-l-accent text-card-foreground">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded">Live Session</span>
                                        <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {ev.date}</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-4">{ev.title}</h4>
                                    <Button className="w-full gap-2" variant="outline" size="sm">
                                        <Globe className="h-4 w-4" /> Join Session
                                    </Button>
                                </div>
                            ))}
                            {events.length === 0 && (
                                <div className="col-span-full py-12 text-center rounded-2xl border border-dashed text-muted-foreground">
                                    No upcoming sessions scheduled.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "quizzes" && (
                    <div className="space-y-4 max-w-xl mx-auto">
                        <h3 className="font-display font-bold text-lg text-center mb-6">Course Assessments</h3>
                        {quizTemplates.map(qt => (
                            <div key={qt.id} className="rounded-2xl border bg-card p-6 shadow-md hover:shadow-xl transition-shadow text-card-foreground">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{qt.title}</h4>
                                        <p className="text-xs text-muted-foreground">{qt.questions.length} Questions • {qt.timer} Minutes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-accent">50 Points</p>
                                        <p className="text-[10px] text-muted-foreground">Reward</p>
                                    </div>
                                </div>
                                <Button
                                    className="w-full gap-2 bg-accent hover:bg-accent/90"
                                    onClick={() => {
                                        dispatch(addNotification({ message: `Quiz "${qt.title}" completed! You earned 50 points.`, type: "success", read: false }));
                                        dispatch(submitQuizResult({
                                            courseId: id!,
                                            score: 8, // Mock score
                                            totalQuestions: qt.questions.length,
                                            percentage: 80,
                                            completedAt: new Date().toISOString()
                                        }));
                                    }}
                                >
                                    Start Assessment
                                </Button>
                            </div>
                        ))}
                        {quizTemplates.length === 0 && (
                            <div className="py-12 text-center rounded-2xl border border-dashed text-muted-foreground">
                                No assessments available for this course yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningHub;
