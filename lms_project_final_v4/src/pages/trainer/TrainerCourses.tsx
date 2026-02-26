import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { addCourse } from "@/store/slices/coursesSlice";
import { toggleQuizEnabled } from "@/store/slices/quizSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen, Plus, Users, Star, Clock, Settings,
  ToggleLeft, ToggleRight, X
} from "lucide-react";

const categories = ["AI & ML", "Cloud Computing", "DevOps", "Data Science", "React Development", "Cyber Security", "Other"];

const TrainerCourses = () => {
  const navigate = useNavigate();
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const quizEnabled = useAppSelector((s) => s.quiz.quizEnabled);
  const { userId } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  // Use t1 as mock trainer
  const trainerCourses = courses.filter((c) => c.trainerId === "t1");

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [modules, setModules] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!title.trim() || !price || !duration.trim() || !modules || !description.trim()) {
      setError("Please fill all fields.");
      return;
    }
    const newCourse = {
      id: `c${Date.now()}`,
      title: title.trim(),
      category,
      trainerId: "t1",
      price: Number(price),
      rating: 0,
      enrolled: 0,
      duration: duration.trim(),
      modules: Number(modules),
      description: description.trim(),
      status: "active" as const,
      learnings: [],
      requirements: [],
    };
    dispatch(addCourse(newCourse));
    dispatch(addNotification({ message: `New course "${title}" created!`, type: "success", read: false }));
    setTitle("");
    setPrice("");
    setDuration("");
    setModules("");
    setDescription("");
    setShowCreate(false);
    setError("");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-accent" /> Course Management
          </h2>
          <p className="text-muted-foreground text-sm">Create, manage, and configure your courses</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2">
          {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreate ? "Cancel" : "Create Course"}
        </Button>
      </div>

      {/* Create Course Form */}
      {showCreate && (
        <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm">
          <h3 className="font-display font-bold text-card-foreground">New Course</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="text-card-foreground">Title</Label>
              <Input placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" maxLength={200} />
            </div>
            <div>
              <Label className="text-card-foreground">Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-card-foreground">Price (₹)</Label>
              <Input type="number" placeholder="1999" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" min={0} />
            </div>
            <div>
              <Label className="text-card-foreground">Duration</Label>
              <Input placeholder="e.g. 30 hours" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-card-foreground">Number of Modules</Label>
              <Input type="number" placeholder="10" value={modules} onChange={(e) => setModules(e.target.value)} className="mt-1" min={1} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-card-foreground">Description</Label>
              <Textarea placeholder="Course description..." value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" rows={3} maxLength={1000} />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end">
            <Button onClick={handleCreate}>Create Course</Button>
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {trainerCourses.map((course) => {
          const isQuizOn = quizEnabled[course.id] ?? false;
          return (
            <div key={course.id} className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    {course.category}
                  </span>
                  <h3 className="mt-1 font-display font-bold text-card-foreground">{course.title}</h3>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${course.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {course.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.enrolled}</span>
                <span className="flex items-center gap-1 text-star"><Star className="h-3.5 w-3.5 fill-current" /> {course.rating || "New"}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
                <span>₹{course.price}</span>
              </div>

              {/* Management link */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground italic">Last update: 2 days ago</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 h-9 px-4 border-accent/50 text-accent hover:bg-accent/10"
                  onClick={() => navigate(`/trainer/course-manage/${course.id}`)}
                >
                  <Settings className="h-4 w-4" /> View Management Center
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {trainerCourses.length === 0 && (
        <div className="py-12 text-center rounded-xl border bg-card">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No courses yet. Create your first course!</p>
        </div>
      )}
    </div>
  );
};

export default TrainerCourses;
