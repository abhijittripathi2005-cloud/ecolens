import { useState, useEffect } from 'react';
import MoodCheckIn from './MoodCheckIn';
import MoodHistory from './MoodHistory';
import MoodInsight from './MoodInsight';
import { saveMoodEntry, subscribeToMoods } from '../data/moodApi';

export default function MoodPage({ user, transactions = [] }) {
  const today = new Date().toISOString().slice(0, 10);
  const [moods, setMoods] = useState([]);

  // Subscribe to real mood entries from Firestore
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToMoods(
      user.uid,
      (liveMoods) => setMoods(liveMoods),
      (err) => console.error('Mood subscription error:', err)
    );
    return unsubscribe;
  }, [user]);

  async function handleCheckIn(moodId) {
    if (!user) return;
    try {
      await saveMoodEntry(user.uid, today, moodId);
    } catch (err) {
      console.error('Failed to save mood:', err);
    }
  }

  return (
    <main className="px-6 md:px-10 py-8 space-y-6 page-fade-in">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest">Mood Tracker</h1>
        <p className="text-sm text-ink/50 mt-0.5">See how your spending shifts with how you feel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MoodCheckIn onCheckIn={handleCheckIn} />
        <MoodInsight moods={moods} transactions={transactions} />
      </div>

      <MoodHistory moods={moods} />
    </main>
  );
}
