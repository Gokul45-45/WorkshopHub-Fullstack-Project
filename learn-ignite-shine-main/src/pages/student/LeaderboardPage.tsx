import { useAppSelector } from "@/hooks/useRedux";
import { Trophy, Medal, Award } from "lucide-react";

const rankIcons = [
  <Trophy className="h-5 w-5 text-accent" />,
  <Medal className="h-5 w-5 text-muted-foreground" />,
  <Award className="h-5 w-5 text-warning" />,
];

const LeaderboardPage = () => {
  const leaderboard = useAppSelector((s) => s.quiz.leaderboard);
  const { userId } = useAppSelector((s) => s.auth);

  const sorted = [...leaderboard].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Leaderboard 🏆</h2>
        <p className="text-muted-foreground">Ranked by Quiz (40%) + Attendance (30%) + Completion (30%)</p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground w-14">Rank</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Student</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground hidden sm:table-cell">Quiz</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground hidden sm:table-cell">Attendance</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground hidden md:table-cell">Completion</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, i) => {
              const isMe = entry.studentId === "s1";
              return (
                <tr key={entry.studentId} className={`border-b last:border-0 transition-colors ${isMe ? "bg-accent/5" : "hover:bg-muted/30"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {i < 3 ? rankIcons[i] : <span className="text-muted-foreground font-bold">{i + 1}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {entry.studentName}
                    {isMe && <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">You</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{entry.quizScore}%</td>
                  <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{entry.attendance}%</td>
                  <td className="px-4 py-3 text-center text-muted-foreground hidden md:table-cell">{entry.completion}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-display font-bold text-card-foreground">{entry.totalScore}</span>
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

export default LeaderboardPage;
