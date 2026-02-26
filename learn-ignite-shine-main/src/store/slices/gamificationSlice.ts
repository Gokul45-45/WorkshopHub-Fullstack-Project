import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked: boolean;
}

interface GamificationState {
    points: number;
    badges: Badge[];
    streak: number;
    weeklyChallenges: { id: string; goal: string; progress: number; total: number }[];
}

const initialState: GamificationState = {
    points: 1250,
    streak: 5,
    badges: [
        { id: "b1", name: "Quiz Master", icon: "🏆", description: "Score 100% on any quiz", unlocked: true },
        { id: "b2", name: "Course Conqueror", icon: "⚔️", description: "Complete your first course", unlocked: true },
        { id: "b3", name: "Fast Learner", icon: "⚡", description: "Complete 3 modules in one day", unlocked: false },
        { id: "b4", name: "Community Star", icon: "🌟", description: "Post 5 times in the forum", unlocked: false },
    ],
    weeklyChallenges: [
        { id: "w1", goal: "Complete 2 Quizzes", progress: 1, total: 2 },
        { id: "w2", goal: "Attend 3 Live Classes", progress: 2, total: 3 },
    ],
};

const gamificationSlice = createSlice({
    name: "gamification",
    initialState,
    reducers: {
        addPoints(state, action: PayloadAction<number>) {
            state.points += action.payload;
        },
        unlockBadge(state, action: PayloadAction<string>) {
            const badge = state.badges.find(b => b.id === action.payload);
            if (badge) badge.unlocked = true;
        },
        updateChallenge(state, action: PayloadAction<{ id: string; amount: number }>) {
            const challenge = state.weeklyChallenges.find(c => c.id === action.payload.id);
            if (challenge) {
                challenge.progress = Math.min(challenge.total, challenge.progress + action.payload.amount);
            }
        },
        incrementStreak(state) {
            state.streak += 1;
        },
    },
});

export const { addPoints, unlockBadge, updateChallenge, incrementStreak } = gamificationSlice.actions;
export default gamificationSlice.reducer;
