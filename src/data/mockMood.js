// Mood entries — shape matches what Member B saves to Firestore:
// { date, mood, spend } where mood is one of the 5 emoji ids below.
// Member C's correlation logic reads this same shape to compute insights.

export const moods = [
  { id: 'great', emoji: '😊', label: 'Great' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'stressed', emoji: '😟', label: 'Stressed' },
  { id: 'angry', emoji: '😤', label: 'Frustrated' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
];

export const moodHistory = [
  { date: '2026-06-14', mood: 'okay', spend: 295 },
  { date: '2026-06-15', mood: 'great', spend: 970 },
  { date: '2026-06-16', mood: 'tired', spend: 530 },
  { date: '2026-06-17', mood: 'stressed', spend: 1800 },
  { date: '2026-06-18', mood: 'okay', spend: 670 },
  { date: '2026-06-19', mood: 'stressed', spend: 1250 },
  { date: '2026-06-20', mood: null, spend: null }, // today, not checked in yet
];

export const moodInsight = {
  text: "You spend 42% more on days you're stressed",
  comparisonText: '₹1,525 avg on stressed days vs ₹1,075 on calm days',
};
