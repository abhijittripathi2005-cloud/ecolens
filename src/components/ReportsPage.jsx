import { useState } from 'react';
import { FileText, Download, Share2, Loader2 } from 'lucide-react';
import { userStats } from '../data/mockData';

/**
 * Reports page — PDF generation UI shell.
 *
 * Wiring notes for Member B:
 * - `handleGenerate` simulates the PDF build. Replace the setTimeout with the
 *   real jsPDF call. On success, either trigger a direct browser download
 *   (jsPDF's `.save()`) or setStatus('ready') + provide a blob URL to the
 *   Download button's href.
 * - The "report preview" card below mirrors what should appear in the PDF —
 *   useful as a content checklist when building the jsPDF layout.
 */
export default function ReportsPage() {
  const [status, setStatus] = useState('idle'); // idle | generating | ready

  function handleGenerate() {
    setStatus('generating');
    // --- Member B: replace this timeout with the real jsPDF generation call ---
    setTimeout(() => setStatus('ready'), 1500);
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
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40">EcoLens — June 2026</p>
            <h2 className="font-display text-xl font-semibold text-forest mt-1">Riya's Monthly Impact</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-paper-dim rounded-lg p-3 text-center">
                <p className="font-display text-2xl font-semibold text-amber">₹{userStats.totalSpent.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-ink/50 mt-1">Total spent</p>
              </div>
              <div className="bg-paper-dim rounded-lg p-3 text-center">
                <p className="font-display text-2xl font-semibold text-forest">{userStats.totalCO2}</p>
                <p className="text-[10px] text-ink/50 mt-1">kg CO₂</p>
              </div>
              <div className="bg-paper-dim rounded-lg p-3 text-center">
                <p className="font-display text-2xl font-semibold text-coral">{userStats.greenScore}</p>
                <p className="text-[10px] text-ink/50 mt-1">Green Score</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-ink/60 mb-2">Included in this report</p>
              <ul className="space-y-1.5 text-xs text-ink/50">
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-sage" />Spending & carbon trend charts</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-sage" />Category breakdown</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-sage" />AI eco-suggestions summary</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-sage" />Mood vs spending insight</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action panel */}
        <div className="bg-forest rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.15)] p-6 text-paper flex flex-col">
          <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-amber-light" strokeWidth={2} />
          </div>
          <p className="font-display text-lg font-semibold mb-1">Export your report</p>
          <p className="text-xs text-sage-light mb-6">Download as PDF or share a quick image card.</p>

          <div className="mt-auto space-y-2.5">
            {status !== 'ready' ? (
              <button
                onClick={handleGenerate}
                disabled={status === 'generating'}
                className="w-full flex items-center justify-center gap-2 bg-amber hover:bg-amber-light disabled:opacity-70 text-forest font-semibold text-sm py-3 rounded-lg transition-colors"
              >
                {status === 'generating' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                    Generating…
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" strokeWidth={2.5} />
                    Generate PDF
                  </>
                )}
              </button>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-light text-white font-semibold text-sm py-3 rounded-lg transition-colors">
                <Download className="w-4 h-4" strokeWidth={2.5} />
                Download Report
              </button>
            )}

            <button className="w-full flex items-center justify-center gap-2 border border-sage-light/30 hover:bg-forest-light text-sage-light font-semibold text-sm py-3 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" strokeWidth={2} />
              Share Green Score card
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
