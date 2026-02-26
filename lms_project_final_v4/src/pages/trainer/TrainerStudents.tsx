import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { markAttendance } from "@/store/slices/quizSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, BarChart3 } from "lucide-react";

// Mock student list per course
const mockStudentList = [
  { id: "s1", name: "Aisha Bano" },
  { id: "s2", name: "Rohit Mehta" },
  { id: "s3", name: "Divya Krishnan" },
  { id: "s4", name: "Suresh Yadav" },
  { id: "s5", name: "Priya Nair" },
  { id: "s6", name: "Arjun Das" },
];

const TrainerStudents = () => {
  const courses = useAppSelector((s) => s.courses.courses);
  const attendance = useAppSelector((s) => s.quiz.attendance);
  const dispatch = useAppDispatch();

  const trainerCourses = courses.filter((c) => c.trainerId === "t1");
  const [selectedCourse, setSelectedCourse] = useState(trainerCourses[0]?.id || "");
  const [presentStudents, setPresentStudents] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const toggleStudent = (id: string) => {
    setPresentStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const saveAttendance = () => {
    const percentage = Math.round((presentStudents.length / mockStudentList.length) * 100);
    dispatch(markAttendance({ courseId: selectedCourse, percentage }));
    dispatch(addNotification({
      message: `Attendance marked for ${courses.find(c => c.id === selectedCourse)?.title}: ${percentage}%`,
      type: "success",
      read: false,
    }));
    setSaved(true);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Student Management</h2>
        <p className="text-muted-foreground">Mark attendance and view student progress</p>
      </div>

      {/* Course selector */}
      <div className="flex flex-wrap gap-2">
        {trainerCourses.map((c) => (
          <button
            key={c.id}
            onClick={() => { setSelectedCourse(c.id); setPresentStudents([]); setSaved(false); }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCourse === c.id
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.title.slice(0, 25)}
          </button>
        ))}
      </div>

      {/* Current attendance stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Students</span>
            <Users className="h-5 w-5 text-info" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{mockStudentList.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Present Today</span>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{presentStudents.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Attendance</span>
            <BarChart3 className="h-5 w-5 text-accent" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-card-foreground">{attendance[selectedCourse] || 0}%</p>
        </div>
      </div>

      {/* Attendance marking */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <h3 className="font-display font-bold text-card-foreground">Mark Attendance</h3>
          <Button
            size="sm"
            onClick={() => setPresentStudents(presentStudents.length === mockStudentList.length ? [] : mockStudentList.map(s => s.id))}
            variant="outline"
          >
            {presentStudents.length === mockStudentList.length ? "Unselect All" : "Select All"}
          </Button>
        </div>
        <div className="divide-y">
          {mockStudentList.map((student) => {
            const isPresent = presentStudents.includes(student.id);
            return (
              <button
                key={student.id}
                onClick={() => toggleStudent(student.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
              >
                <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  isPresent ? "bg-success border-success" : "border-border"
                }`}>
                  {isPresent && <CheckCircle className="h-3.5 w-3.5 text-success-foreground" />}
                </div>
                <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${student.name.toLowerCase().replace(" ", "")}`} alt="" className="h-8 w-8 rounded-full bg-muted" />
                <span className="text-sm font-medium text-card-foreground">{student.name}</span>
                <span className={`ml-auto text-xs font-medium ${isPresent ? "text-success" : "text-muted-foreground"}`}>
                  {isPresent ? "Present" : "Absent"}
                </span>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t">
          <Button
            onClick={saveAttendance}
            disabled={saved}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          >
            {saved ? "✓ Attendance Saved" : `Save Attendance (${presentStudents.length}/${mockStudentList.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrainerStudents;
