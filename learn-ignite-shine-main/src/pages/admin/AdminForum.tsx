import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { deleteThread, togglePin, addReply } from "@/store/slices/forumSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Trash2, Pin, PinOff, Send, ChevronDown, ChevronUp, Shield } from "lucide-react";

const AdminForum = () => {
  const threads = useAppSelector((s) => s.forum.threads);
  const dispatch = useAppDispatch();
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");

  const filtered = threads
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  const handleReply = (threadId: string) => {
    if (!replyText.trim()) return;
    dispatch(addReply({ threadId, author: "Platform Admin", role: "admin", content: replyText }));
    setReplyText("");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-accent" /> Forum Moderation
        </h2>
        <p className="text-muted-foreground text-sm">Manage threads, pin important ones, remove inappropriate content</p>
      </div>

      <Input placeholder="Search threads..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="space-y-3">
        {filtered.map((thread) => (
          <div key={thread.id} className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-start gap-3 p-4">
              <MessageSquare className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <button
                onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
                className="flex-1 text-left min-w-0"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  {thread.pinned && <Pin className="h-3.5 w-3.5 text-accent" />}
                  <h3 className="font-semibold text-card-foreground">{thread.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {thread.author} · <span className="capitalize">{thread.role}</span> · {thread.replies.length} replies
                </p>
              </button>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => dispatch(togglePin(thread.id))} title={thread.pinned ? "Unpin" : "Pin"}>
                  {thread.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => dispatch(deleteThread(thread.id))} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {expandedThread === thread.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>

            {expandedThread === thread.id && (
              <div className="border-t px-4 pb-4 pt-3 space-y-3">
                <p className="text-sm text-card-foreground">{thread.content}</p>
                {thread.replies.map((reply) => (
                  <div key={reply.id} className="ml-6 rounded-lg bg-muted/50 p-3">
                    <p className="text-sm text-card-foreground">{reply.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reply.author} · <span className="capitalize text-accent">{reply.role}</span>
                    </p>
                  </div>
                ))}
                <div className="ml-6 flex gap-2">
                  <Input
                    placeholder="Admin reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReply(thread.id)}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={() => handleReply(thread.id)}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminForum;
