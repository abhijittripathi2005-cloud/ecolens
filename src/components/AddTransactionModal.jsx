import { useState } from 'react';
import { X, IndianRupee } from 'lucide-react';
import { categories } from '../data/mockData';
import { estimateCO2 } from '../data/carbonEngine';
import ReceiptScanner from './ReceiptScanner';

export default function AddTransactionModal({ open, onClose, onSubmit }) {
  const [mode, setMode] = useState('manual'); // 'manual' | 'scan'
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const estimatedCO2 = amount && !isNaN(amount) && Number(amount) > 0
    ? estimateCO2(category, Number(amount))
    : null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Enter an amount greater than 0.');
      return;
    }
    if (!label.trim()) {
      setError('Give this transaction a short label.');
      return;
    }
    setError('');

    onSubmit({
      id: `t${Date.now()}`,
      category,
      amount: Number(amount),
      co2: estimatedCO2,
      date,
      label: label.trim(),
    });

    // reset form
    setAmount('');
    setLabel('');
    setCategory('food');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md receipt-edge pt-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pb-4 border-b border-dashed border-ink/15">
          <h2 className="font-display text-xl font-semibold text-forest">Add Transaction</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-paper-dim transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-ink/60" strokeWidth={2} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 px-6 pt-4">
          {[
            { id: 'manual', label: 'Manual Entry' },
            { id: 'scan', label: 'Scan Receipt' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`flex-1 text-xs font-semibold py-2.5 rounded-lg transition-colors ${
                mode === t.id ? 'bg-forest text-paper' : 'bg-paper-dim text-ink/50 hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mode === 'manual' ? (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 space-y-4">
              {/* Label */}
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1.5">What was it?</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Zomato — Dinner"
                  className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm focus:border-sage outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-ink/60 mb-1.5">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-[11px] font-medium transition-colors
                        ${category === c.id
                          ? 'border-sage bg-paper-dim text-forest'
                          : 'border-ink/10 text-ink/50 hover:border-ink/20'}`}
                    >
                      <span className="text-lg leading-none">{c.icon}</span>
                      {c.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-1.5">Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/40" strokeWidth={2.5} />
                    <input
                      type="number"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-lg border border-ink/15 pl-8 pr-3 py-2.5 text-sm font-mono focus:border-sage outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink/60 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm font-mono focus:border-sage outline-none"
                  />
                </div>
              </div>

              {/* Live CO2 estimate */}
              {estimatedCO2 && (
                <div className="flex items-center justify-between bg-paper-dim rounded-lg px-4 py-3 border border-dashed border-sage/40">
                  <span className="text-xs text-ink/60">Estimated footprint</span>
                  <span className="font-mono text-sm font-semibold text-sage">{estimatedCO2} kg CO₂</span>
                </div>
              )}

              {error && <p className="text-xs text-coral font-medium">{error}</p>}
            </div>

            <div className="px-6 pb-6 pt-2">
              <button
                type="submit"
                className="w-full bg-forest hover:bg-forest-light text-paper font-semibold text-sm py-3 rounded-lg transition-colors"
              >
                Save Transaction
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 pt-5">
            <ReceiptScanner
              onConfirm={(txn) => {
                onSubmit(txn);
                onClose();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
