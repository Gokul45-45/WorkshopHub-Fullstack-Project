import { useAppSelector } from "@/hooks/useRedux";
import { Award, Download, QrCode, Calendar, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentCertificates = () => {
  const certificates = useAppSelector((s) => s.forum.certificates);
  const studentCerts = certificates.filter((c) => c.studentName === "Aisha Bano");

  const handleDownload = (cert: typeof certificates[0]) => {
    // Simulate PDF download
    const content = `
========================================
       WORKSHOP HUB - CERTIFICATE
========================================

This is to certify that

        ${cert.studentName}

has successfully completed the course

        ${cert.courseTitle}

Instructor: ${cert.instructorName}
Date of Completion: ${cert.completionDate}
Certificate ID: ${cert.certificateCode}

========================================
    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificate-${cert.certificateCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Award className="h-6 w-6 text-accent" /> My Certificates
        </h2>
        <p className="text-muted-foreground text-sm">Download your course completion certificates</p>
      </div>

      {studentCerts.length === 0 ? (
        <div className="py-16 text-center rounded-xl border bg-card">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No certificates yet. Complete a course to earn one!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {studentCerts.map((cert) => (
            <div key={cert.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              {/* Certificate Preview */}
              <div className="bg-primary p-6 text-center space-y-2 relative">
                <div className="absolute top-3 right-3 bg-accent rounded-full p-1.5">
                  <QrCode className="h-4 w-4 text-accent-foreground" />
                </div>
                <Award className="h-10 w-10 text-accent mx-auto" />
                <p className="text-xs uppercase tracking-widest text-primary-foreground/70">Certificate of Completion</p>
                <p className="text-lg font-bold text-primary-foreground">{cert.studentName}</p>
                <p className="text-sm text-primary-foreground/80">{cert.courseTitle}</p>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" /> Instructor: {cert.instructorName}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> Completed: {cert.completionDate}
                </div>
                <div className="flex items-center gap-2 text-sm font-mono text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" /> {cert.certificateCode}
                </div>
                <Button className="w-full mt-2 gap-2" onClick={() => handleDownload(cert)}>
                  <Download className="h-4 w-4" /> Download Certificate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
