import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { addSuggestion } from "@/store/slices/forumSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Send, Clock, CheckCircle, XCircle, Rocket } from "lucide-react";

const statusConfig = {
  pending: { icon: Clock, color: "text-warning", label: "Pending" },
  reviewed: { icon: CheckCircle, color: "text-info", label: "Reviewed" },
  implemented: { icon: Rocket, color: "text-success", label: "Implemented" },
  rejected: { icon: XCircle, color: "text-destructive", label: "Rejected" },
};

const StudentSuggestions = () => {
  const suggestions = useAppSelector((s) => s.forum.suggestions);
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) return;
    dispatch(addSuggestion({ studentName: "Aisha Bano", subject, message }));
    dispatch(addNotification({ message: "Suggestion submitted successfully!", type: "success", read: false }));
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" /> Suggestion Box
        </h2>
        <p className="text-muted-foreground text-sm">Share your feedback and ideas to improve the platform</p>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <Textarea placeholder="Describe your suggestion..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
        <Button onClick={handleSubmit} className="gap-2">
          <Send className="h-4 w-4" /> Submit Suggestion
        </Button>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-3">My Submissions</h3>
        <div className="space-y-3">
          {suggestions.filter((s) => s.studentName === "Aisha Bano").map((sg) => {
            const cfg = statusConfig[sg.status];
            const Icon = cfg.icon;
            return (
              <div key={sg.id} className="rounded-xl border bg-card p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-card-foreground">{sg.subject}</h4>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
                    <Icon className="h-3 w-3" /> {cfg.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{sg.message}</p>
                {sg.adminResponse && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Admin Response</p>
                    <p className="text-sm text-card-foreground">{sg.adminResponse}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentSuggestions;
