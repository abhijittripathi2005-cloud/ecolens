import { doc, setDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Mood entries are stored as "moods/{uid}_{date}" so each user has at most
 * one entry per day — saving today's mood again just overwrites it.
 *
 * Document shape:
 * { uid, date: 'YYYY-MM-DD', mood: 'great'|'okay'|'stressed'|'angry'|'tired' }
 */

export async function saveMoodEntry(uid, date, mood) {
  const docId = `${uid}_${date}`;
  return setDoc(doc(db, 'moods', docId), { uid, date, mood }, { merge: true });
}

// Real-time subscription to a user's mood history.
export function subscribeToMoods(uid, onUpdate, onError) {
  const q = query(collection(db, 'moods'), where('uid', '==', uid), orderBy('date', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const moods = snapshot.docs.map((d) => d.data());
      onUpdate(moods);
    },
    (error) => {
      console.error('Mood subscription error:', error);
      onError?.(error);
    }
  );
}
