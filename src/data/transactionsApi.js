import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Transactions are stored in a top-level "transactions" collection,
 * each document tagged with the owning user's uid so we can query
 * just that user's data.
 *
 * Document shape:
 * {
 *   uid: string,
 *   category: string,
 *   amount: number,
 *   co2: number,
 *   date: 'YYYY-MM-DD',
 *   label: string,
 *   createdAt: server timestamp
 * }
 */

export async function addTransaction(uid, txn) {
  return addDoc(collection(db, 'transactions'), {
    uid,
    category: txn.category,
    amount: txn.amount,
    co2: txn.co2,
    date: txn.date,
    label: txn.label,
    createdAt: serverTimestamp(),
  });
}

// Subscribes to real-time updates for a user's transactions.
// Calls onUpdate(transactionsArray) whenever data changes.
// Returns an unsubscribe function — call it on component unmount.
export function subscribeToTransactions(uid, onUpdate, onError) {
  const q = query(
    collection(db, 'transactions'),
    where('uid', '==', uid),
    orderBy('date', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const txns = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onUpdate(txns);
    },
    (error) => {
      console.error('Transaction subscription error:', error);
      onError?.(error);
    }
  );
}
