import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { updateSuggestionStatus } from "@/store/slices/forumSlice";
import { addNotification } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, CheckCircle, Clock, XCircle, Rocket } from "lucide-react";

const statusConfig = {
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  reviewed: { icon: CheckCircle, color: "text-info", bg: "bg-info/10", label: "Reviewed" },
  implemented: { icon: Rocket, color: "text-success", bg: "bg-success/10", label: "Implemented" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
};

const AdminSuggestions = () => {
  const suggestions = useAppSelector((s) => s.forum.suggestions);
  const dispatch = useAppDispatch();
  const [responding, setResponding] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [newStatus, setNewStatus] = useState<"reviewed" | "implemented" | "rejected">("reviewed");

  const handleRespond = (id: string) => {
    dispatch(updateSuggestionStatus({ id, status: newStatus, response }));
    dispatch(addNotification({ message: `Your suggestion has been ${newStatus}!`, type: "info", read: false }));
    setResponding(null);
    setResponse("");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" /> Suggestion Management
        </h2>
        <p className="text-muted-foreground text-sm">Review and respond to student feedback</p>
      </div>

      <div className="grid gap-4">
        {suggestions.map((sg) => {
          const cfg = statusConfig[sg.status];
          const Icon = cfg.icon;
          return (
            <div key={sg.id} className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-card-foreground">{sg.subject}</h3>
                  <p className="text-xs text-muted-foreground">{sg.studentName} · {new Date(sg.timestamp).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                  <Icon className="h-3 w-3" /> {cfg.label}
                </span>
              </div>
              <p className="text-sm text-card-foreground">{sg.message}</p>

              {sg.adminResponse && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Admin Response</p>
                  <p className="text-sm text-card-foreground">{sg.adminResponse}</p>
                </div>
              )}

              {responding === sg.id ? (
                <div className="space-y-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as typeof newStatus)}
                    className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="reviewed">Reviewed</option>
                    <option value="implemented">Implemented</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Textarea placeholder="Write your response..." value={response} onChange={(e) => setResponse(e.target.value)} rows={2} />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => setResponding(null)}>Cancel</Button>
                    <Button size="sm" onClick={() => handleRespond(sg.id)}>Submit</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setResponding(sg.id)}>Respond</Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSuggestions;
