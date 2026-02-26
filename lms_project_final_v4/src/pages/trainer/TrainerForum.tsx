import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { addThread, addReply } from "@/store/slices/forumSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Pin, Clock, ChevronDown, ChevronUp, Plus } from "lucide-react";

const TrainerForum = () => {
  const threads = useAppSelector((s) => s.forum.threads);
  const courses = useAppSelector((s) => s.courses.courses);
  const { userName } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("c1");
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");

  const filtered = threads
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  const handleCreateThread = () => {
    if (!title.trim() || !content.trim()) return;
    dispatch(addThread({ title, author: userName || "Trainer", role: "trainer", courseId, content }));
    setTitle("");
    setContent("");
    setShowNew(false);
  };

  const handleReply = (threadId: string) => {
    if (!replyText.trim()) return;
    dispatch(addReply({ threadId, author: userName || "Trainer", role: "trainer", content: replyText }));
    setReplyText("");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Discussion Forum</h2>
          <p className="text-muted-foreground text-sm">Engage with students and fellow trainers</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2">
          <Plus className="h-4 w-4" /> New Thread
        </Button>
      </div>

      {showNew && (
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <Input placeholder="Thread title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <Textarea placeholder="Write your message..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreateThread}>Post Thread</Button>
          </div>
        </div>
      )}

      <Input placeholder="Search threads..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="space-y-3">
        {filtered.map((thread) => (
          <div key={thread.id} className="rounded-xl border bg-card shadow-sm">
            <button
              onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
              className="w-full flex items-start gap-3 p-4 text-left"
            >
              <MessageSquare className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {thread.pinned && <Pin className="h-3.5 w-3.5 text-accent" />}
                  <h3 className="font-semibold text-card-foreground">{thread.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {thread.author} · <span className="capitalize text-accent">{thread.role}</span> · {new Date(thread.timestamp).toLocaleDateString()}
                  · {thread.replies.length} replies
                </p>
              </div>
              {expandedThread === thread.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {expandedThread === thread.id && (
              <div className="border-t px-4 pb-4 pt-3 space-y-3">
                <p className="text-sm text-card-foreground">{thread.content}</p>

                {thread.replies.map((reply) => (
                  <div key={reply.id} className="ml-6 rounded-lg bg-muted/50 p-3">
                    <p className="text-sm text-card-foreground">{reply.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reply.author} · <span className="capitalize text-accent">{reply.role}</span> · {new Date(reply.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}

                <div className="ml-6 flex gap-2">
                  <Input
                    placeholder="Write a reply..."
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

export default TrainerForum;
