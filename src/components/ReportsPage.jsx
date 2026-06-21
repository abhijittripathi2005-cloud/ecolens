import { useState } from 'react';
import { FileText, Download, Share2, Loader2, Check } from 'lucide-react';
import { generateReportPDF } from '../data/reportGenerator';
import { calculateGreenScore } from '../data/carbonEngine';

export default function ReportsPage({ user, transactions = [] }) {
  const [status, setStatus] = useState('idle'); // idle | generating | ready
  const [error, setError] = useState('');

  const totalSpent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalCO2 = transactions.reduce((sum, t) => sum + (t.co2 || 0), 0);
  const greenScore = calculateGreenScore(transactions);
  const userName = user?.displayName?.split(' ')[0] || 'Your';

  function handleGenerate() {
    setStatus('generating');
    setError('');

    // Small delay purely so the loading state is visible — jsPDF itself
    // runs synchronously and finishes almost instantly.
    setTimeout(() => {
      try {
        generateReportPDF({
          userName,
          transactions,
          totalSpent,
          totalCO2,
          greenScore,
        });
        setStatus('ready');
      } catch (err) {
        console.error('PDF generation failed:', err);
        setError("Couldn't generate the PDF. Please try again.");
        setStatus('idle');
      }
    }, 600);
  }

  return (
    <main className="px-6 md:px-10 py-8 space-y-6 page-fade-in">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest">Monthly Report</h1>
        <p className="text-sm text-ink/50 mt-0.5">A shareable summary of your spending and footprint.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Report preview card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] receipt-edge pt-5 overflow-hidden">
          <div className="px-6 pb-5 border-b border-dashed border-ink/15">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40">
              EcoLens — {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
            <h2 className="font-display text-xl font-semibold text-forest mt-1">{userName}'s Monthly Impact</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-paper-dim rounded-lg p-3 text-center">
                <p className="font-display text-2xl font-semibold text-amber">₹{totalSpent.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-ink/50 mt-1">Total spent</p>
              </div>
              <div className="bg-paper-dim rounded-lg p-3 text-center">
                <p className="font-display text-2xl font-semibold text-forest">{totalCO2.toFixed(1)}</p>
                <p className="text-[10px] text-ink/50 mt-1">kg CO₂</p>
              </div>
              <div className="bg-paper-dim rounded-lg p-3 text-center">
                <p className="font-display text-2xl font-semibold text-coral">{greenScore}</p>
                <p className="text-[10px] text-ink/50 mt-1">Green Score</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-ink/60 mb-2">Included in this report</p>
              <ul className="space-y-1.5 text-xs text-ink/50">
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-sage" />Spending & carbon summary</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-sage" />Transaction table (up to 20 most recent)</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-sage" />Green Score</li>
              </ul>
              {transactions.length === 0 && (
                <p className="text-xs text-coral mt-3">
                  No transactions yet — add some first so your report has data to show.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action panel */}
        <div className="bg-forest rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.15)] p-6 text-paper flex flex-col">
          <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-amber-light" strokeWidth={2} />
          </div>
          <p className="font-display text-lg font-semibold mb-1">Export your report</p>
          <p className="text-xs text-sage-light mb-6">Download as a real PDF, ready to share.</p>

          <div className="mt-auto space-y-2.5">
            <button
              onClick={handleGenerate}
              disabled={status === 'generating' || transactions.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-amber hover:bg-amber-light disabled:opacity-50 disabled:cursor-not-allowed text-forest font-semibold text-sm py-3 rounded-lg transition-colors"
            >
              {status === 'generating' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                  Generating…
                </>
              ) : status === 'ready' ? (
                <>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  Downloaded — generate again?
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" strokeWidth={2.5} />
                  Generate PDF
                </>
              )}
            </button>

            {error && <p className="text-xs text-coral text-center">{error}</p>}

            <button
              disabled
              className="w-full flex items-center justify-center gap-2 border border-sage-light/30 text-sage-light/50 font-semibold text-sm py-3 rounded-lg cursor-not-allowed"
              title="Coming soon"
            >
              <Share2 className="w-4 h-4" strokeWidth={2} />
              Share Green Score card
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
