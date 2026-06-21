// Mock friends leaderboard. Real version reads from a Firestore "groups" or
// "friends" collection — same shape, just live scores instead of fixed ones.

export const leaderboard = [
  { id: 'u1', name: 'Ananya Sharma', score: 91, avatarColor: '#0F2E1D', streak: 12 },
  { id: 'u2', name: 'Riya (You)', score: 68, avatarColor: '#D4922A', streak: 5, isYou: true },
  { id: 'u3', name: 'Karan Mehta', score: 84, avatarColor: '#4A7856', streak: 9 },
  { id: 'u4', name: 'Priya Nair', score: 77, avatarColor: '#E8634A', streak: 3 },
  { id: 'u5', name: 'Dev Kapoor', score: 62, avatarColor: '#7FA98C', streak: 2 },
  { id: 'u6', name: 'Sara Iyer', score: 55, avatarColor: '#1C4A2E', streak: 1 },
];
