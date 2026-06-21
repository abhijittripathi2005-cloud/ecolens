import { Plus, Leaf, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TopBar({ onAddTransaction, user }) {
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <header className="px-5 sm:px-6 md:px-10 py-5 md:py-6 border-b border-ink/8">
      {/* Mobile-only logo row */}
      <div className="flex items-center justify-between mb-3 md:hidden">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-forest" strokeWidth={2.5} />
          <span className="font-display text-lg font-semibold text-forest tracking-tight">EcoLens</span>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="text-ink/40 hover:text-ink/70 transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt=""
              className="w-9 h-9 rounded-full hidden sm:block shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-forest truncate">
              {getGreeting()}, {firstName} 🌿
            </h1>
            <p className="text-xs sm:text-sm text-ink/50 mt-0.5 truncate">Here's your footprint this week</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAddTransaction}
            className="flex items-center gap-2 bg-amber hover:bg-amber-light text-forest font-semibold text-sm px-3.5 sm:px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
          <button
            onClick={() => signOut(auth)}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-ink/40 hover:text-ink/70 hover:bg-paper-dim transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
