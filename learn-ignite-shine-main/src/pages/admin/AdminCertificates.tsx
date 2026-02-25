import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { generateCertificate, addEmailLog } from "@/store/slices/forumSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Award, Download, Mail, Plus, CheckCircle } from "lucide-react";

const AdminCertificates = () => {
  const certificates = useAppSelector((s) => s.forum.certificates);
  const courses = useAppSelector((s) => s.courses.courses);
  const trainers = useAppSelector((s) => s.courses.trainers);
  const emailLogs = useAppSelector((s) => s.forum.emailLogs);
  const dispatch = useAppDispatch();

  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || "");
  const [studentName, setStudentName] = useState("Aisha Bano");

  const handleGenerate = () => {
    const course = courses.find((c) => c.id === selectedCourse);
    const trainer = trainers.find((t) => t.id === course?.trainerId);
    if (!course || !trainer) return;

    dispatch(generateCertificate({
      studentName,
      courseId: course.id,
      courseTitle: course.title,
      instructorName: trainer.name,
      completionDate: new Date().toISOString().split("T")[0],
    }));
    dispatch(addEmailLog({
      to: "student@demo.com",
      subject: `Certificate Generated — ${course.title}`,
      body: `Congratulations ${studentName}! Your certificate for ${course.title} has been generated. Download it from your dashboard.`,
    }));
    dispatch(addNotification({ message: `Certificate generated for ${course.title}!`, type: "success", read: false }));
    setShowGenerate(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Award className="h-6 w-6 text-accent" /> Certificate Management
          </h2>
          <p className="text-muted-foreground text-sm">Generate and manage course completion certificates</p>
        </div>
        <Button onClick={() => setShowGenerate(!showGenerate)} className="gap-2">
          <Plus className="h-4 w-4" /> Generate Certificate
        </Button>
      </div>

      {showGenerate && (
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <input
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowGenerate(false)}>Cancel</Button>
            <Button size="sm" onClick={handleGenerate}>Generate & Notify</Button>
          </div>
        </div>
      )}

      {/* Certificates Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Student</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden sm:table-cell">Course</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Code</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} className="border-b last:border-0">
                <td className="px-4 py-3 text-card-foreground">{cert.studentName}</td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{cert.courseTitle}</td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden md:table-cell">{cert.certificateCode}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{cert.completionDate}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    <CheckCircle className="h-3 w-3" /> Generated
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Log */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Mail className="h-5 w-5 text-accent" /> Email Simulation Log
        </h3>
        <div className="space-y-2">
          {emailLogs.map((em) => (
            <div key={em.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-card-foreground">{em.subject}</p>
                <p className="text-xs text-muted-foreground">{new Date(em.timestamp).toLocaleString()}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">To: {em.to}</p>
              <p className="text-sm text-muted-foreground mt-1">{em.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCertificates;
