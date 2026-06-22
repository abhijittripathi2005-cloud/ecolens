import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import TopBar from './components/TopBar';
import DashboardPage from './components/DashboardPage';
import TransactionsPage from './components/TransactionsPage';
import MoodPage from './components/MoodPage';
import LeaderboardPage from './components/LeaderboardPage';
import MarketplacePage from './components/MarketplacePage';
import ReportsPage from './components/ReportsPage';
import OnboardingScreen from './components/OnboardingScreen';
import LoginScreen from './components/LoginScreen';
import AddTransactionModal from './components/AddTransactionModal';
import { addTransaction, subscribeToTransactions } from './data/transactionsApi';
import { calculateGreenScore } from './data/carbonEngine';
import { transactions as initialTransactions } from './data/mockData';

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [onboarded, setOnboarded] = useState(false);
  const [active, setActive] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [loadingTxns, setLoadingTxns] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  // Once we know who's logged in, subscribe to their real transactions.
  // Falls back to mock data only if there's a connection error, so the
  // demo never shows a totally empty dashboard.
  useEffect(() => {
    if (!user) return;
    setLoadingTxns(true);
    const unsubscribe = subscribeToTransactions(
      user.uid,
      (liveTxns) => {
        setTransactions(liveTxns);
        setLoadingTxns(false);
      },
      () => setLoadingTxns(false)
    );
    return unsubscribe;
  }, [user]);

  async function handleAddTransaction(newTxn) {
    // Optimistic UI update so it feels instant, then Firestore's
    // real-time listener will reconcile with the saved version.
    setTransactions((prev) => [newTxn, ...prev]);
    try {
      await addTransaction(user.uid, newTxn);
    } catch (err) {
      console.error('Failed to save transaction:', err);
    }
  }

  // Wait for Firebase to tell us whether someone's already logged in
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-3 border-sage-light border-t-amber animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!onboarded) {
    return <OnboardingScreen onFinish={() => setOnboarded(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar active={active} onNavigate={setActive} />

      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <TopBar onAddTransaction={() => setModalOpen(true)} user={user} />

        {active === 'dashboard' && <DashboardPage transactions={transactions} />}
        {active === 'transactions' && <TransactionsPage transactions={transactions} />}
        {active === 'mood' && <MoodPage user={user} transactions={transactions} />}
        {active === 'leaderboard' && <LeaderboardPage user={user} greenScore={calculateGreenScore(transactions)} />}
        {active === 'marketplace' && <MarketplacePage />}
        {active === 'reports' && <ReportsPage user={user} transactions={transactions} />}
      </div>

      <MobileNav active={active} onNavigate={setActive} />

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}
