// Mock data — swap for live Firestore queries once Member B's backend is ready.
// Keep these shapes identical to the real schema so the swap is a one-line change.

export const categories = [
  { id: 'food', label: 'Food & Dining', icon: '🍔' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'fashion', label: 'Fashion', icon: '👕' },
  { id: 'electronics', label: 'Electronics', icon: '🔌' },
  { id: 'groceries', label: 'Groceries', icon: '🛒' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'utilities', label: 'Utilities', icon: '💡' },
  { id: 'other', label: 'Other', icon: '📦' },
];

export const transactions = [
  { id: 't1', category: 'food', amount: 450, co2: 3.2, date: '2026-06-18', label: 'Zomato — Dinner' },
  { id: 't2', category: 'transport', amount: 220, co2: 4.8, date: '2026-06-18', label: 'Uber ride' },
  { id: 't3', category: 'groceries', amount: 1200, co2: 6.1, date: '2026-06-17', label: 'BigBasket order' },
  { id: 't4', category: 'fashion', amount: 1800, co2: 12.4, date: '2026-06-17', label: 'Myntra — T-shirts' },
  { id: 't5', category: 'entertainment', amount: 350, co2: 0.4, date: '2026-06-16', label: 'Netflix subscription' },
  { id: 't6', category: 'food', amount: 180, co2: 1.1, date: '2026-06-16', label: 'Coffee + snacks' },
  { id: 't7', category: 'electronics', amount: 2500, co2: 18.7, date: '2026-06-15', label: 'Phone charger + cable' },
  { id: 't8', category: 'transport', amount: 60, co2: 0.9, date: '2026-06-15', label: 'Metro card recharge' },
  { id: 't9', category: 'utilities', amount: 900, co2: 5.3, date: '2026-06-14', label: 'Electricity bill' },
  { id: 't10', category: 'groceries', amount: 650, co2: 3.0, date: '2026-06-14', label: 'Local kirana store' },
];

export const weeklySpend = [
  { day: 'Mon', spent: 320, co2: 4.1 },
  { day: 'Tue', spent: 540, co2: 6.8 },
  { day: 'Wed', spent: 180, co2: 1.9 },
  { day: 'Thu', spent: 890, co2: 11.2 },
  { day: 'Fri', spent: 410, co2: 5.0 },
  { day: 'Sat', spent: 1250, co2: 16.4 },
  { day: 'Sun', spent: 295, co2: 3.3 },
];

export const categoryBreakdown = [
  { category: 'Food', value: 630, co2: 4.3, color: '#D4922A' },
  { category: 'Transport', value: 280, co2: 5.7, color: '#4A7856' },
  { category: 'Fashion', value: 1800, co2: 12.4, color: '#E8634A' },
  { category: 'Electronics', value: 2500, co2: 18.7, color: '#0F2E1D' },
  { category: 'Groceries', value: 1850, co2: 9.1, color: '#7FA98C' },
];

export const userStats = {
  totalSpent: 7310,
  totalCO2: 56.0,
  greenScore: 68,
  weekChange: { spend: -8, co2: -12 },
};
