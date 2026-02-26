import { useAppSelector } from "@/hooks/useRedux";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Zap, Target, Star, ChevronUp, ChevronDown } from "lucide-react";

const LeaderboardPage = () => {
  const { leaderboard } = useAppSelector(s => s.quiz);
  const { points, badges, streak, weeklyChallenges } = useAppSelector(s => s.gamification);
  const { userName } = useAppSelector(s => s.auth);

  // Add dummy trend to leaderboard for visual flair
  const enrichedLeaderboard = [...leaderboard].sort((a, b) => b.totalScore - a.totalScore).map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
    trend: Math.random() > 0.5 ? 'up' : 'down'
  }));

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-warning" /> Hall of Fame
          </h2>
          <p className="text-muted-foreground text-sm">See how you rank against other learners</p>
        </div>
        <div className="flex items-center gap-3 bg-card border rounded-2xl px-6 py-3 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">My Points</p>
            <p className="text-xl font-bold text-accent">{points}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Streak</p>
            <p className="text-xl font-bold text-orange-500 flex items-center gap-1 justify-center">{streak} <Zap className="h-4 w-4 fill-current" /></p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Leaderboard Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border bg-card shadow-lg overflow-hidden text-card-foreground">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="font-bold text-sm">Global Rankings</h3>
            </div>
            <div className="divide-y">
              {enrichedLeaderboard.map((entry) => (
                <div key={entry.studentId} className={`flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors ${entry.studentName === userName ? 'bg-accent/5 border-l-4 border-l-accent' : ''}`}>
                  <div className="w-8 text-center">
                    {entry.rank === 1 ? <span className="text-xl">🥇</span> :
                      entry.rank === 2 ? <span className="text-xl">🥈</span> :
                        entry.rank === 3 ? <span className="text-xl">🥉</span> :
                          <span className="text-sm font-bold text-muted-foreground">{entry.rank}</span>}
                  </div>
                  <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${entry.studentName.toLowerCase().replace(" ", "")}`} alt="" className="h-10 w-10 rounded-full border bg-muted shrink-0" />
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${entry.studentName === userName ? 'text-accent' : ''}`}>{entry.studentName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{entry.completion}% Completion</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold">{entry.totalScore}</p>
                      <p className="text-[10px] text-muted-foreground">pts</p>
                    </div>
                    {entry.trend === 'up' ? <ChevronUp className="h-4 w-4 text-success" /> : <ChevronDown className="h-4 w-4 text-destructive" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gamification Sidebar */}
        <div className="space-y-8">
          {/* Weekly Challenges */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm text-card-foreground">
            <h3 className="font-display font-bold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" /> Weekly Challenges
            </h3>
            <div className="space-y-5">
              {weeklyChallenges.map(challenge => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{challenge.goal}</span>
                    <span className="text-accent">{challenge.progress}/{challenge.total}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${(challenge.progress / challenge.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm text-card-foreground">
            <h3 className="font-display font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-warning" /> My Badges
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {badges.map(badge => (
                <div key={badge.id} className={`p-3 rounded-xl border flex flex-col items-center text-center group transition-all ${badge.unlocked ? 'bg-card border-accent/20' : 'bg-muted/20 opacity-40 grayscale'}`}>
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{badge.icon}</span>
                  <p className="text-[10px] font-bold leading-none">{badge.name}</p>
                  {badge.unlocked && <Star className="h-2 w-2 text-warning fill-current mt-1" />}
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-xs font-bold text-accent">View All Rewards</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
