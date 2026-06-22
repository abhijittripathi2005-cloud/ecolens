import { useState } from 'react';
import { Sparkles, IndianRupee, Leaf, RotateCw, AlertCircle } from 'lucide-react';

/**
 * AI Eco-Advisor panel.
 * Calls our own /api/advisor serverless function, which holds the Gemini
 * API key server-side and never exposes it to the browser.
 */
export default function AIAdvisorPanel({ transactions = [] }) {
  const [status, setStatus] = useState('idle'); // idle | loading | loaded | error
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleGenerate() {
    if (transactions.length === 0) {
      setErrorMessage('Add a few transactions first so there is something to analyze.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: transactions.slice(0, 20) }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setStatus('loaded');
    } catch (err) {
      console.error('AI advisor request failed:', err);
      setErrorMessage('Could not reach the advisor. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] overflow-hidden">
      {/* Header */}
      <div className="bg-forest px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-light" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-paper leading-tight">AI Eco-Advisor</h3>
            <p className="text-[11px] text-sage-light">Personalized suggestions, powered by Gemini</p>
          </div>
        </div>
        {status === 'loaded' && (
          <button
            onClick={handleGenerate}
            className="flex items-center gap-1.5 text-xs font-medium text-sage-light hover:text-paper transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
            Refresh
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        {status === 'idle' && (
          <div className="text-center py-8">
            <p className="text-sm text-ink/60 mb-4 max-w-xs mx-auto">
              See how this week's spending could be greener — and cheaper.
            </p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 bg-amber hover:bg-amber-light text-forest font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
              Get my suggestions
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse flex gap-3 p-4 rounded-lg bg-paper-dim">
                <div className="w-9 h-9 rounded-full bg-sage-light/40 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-sage-light/40 rounded w-full" />
                  <div className="h-3 bg-sage-light/40 rounded w-3/4" />
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-ink/40 font-mono pt-1">
              Reading your transactions…
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-coral mx-auto mb-3" strokeWidth={1.8} />
            <p className="text-sm font-medium text-ink mb-1">Couldn't reach the advisor</p>
            <p className="text-xs text-ink/50 mb-4">{errorMessage || 'Please try again.'}</p>
            <button
              onClick={handleGenerate}
              className="text-xs font-semibold text-forest border border-forest/20 hover:bg-paper-dim px-4 py-2 rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'loaded' && (
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="flex gap-3 p-4 rounded-lg bg-paper-dim border border-transparent hover:border-sage/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-light" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink leading-relaxed">{s.suggestion}</p>
                  <div className="flex items-center gap-4 mt-2.5">
                    <span className="flex items-center gap-1 text-xs font-mono font-semibold text-amber">
                      <IndianRupee className="w-3 h-3" strokeWidth={2.5} />
                      {s.moneySaved} saved
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono font-semibold text-sage">
                      <Leaf className="w-3 h-3" strokeWidth={2.5} />
                      {s.carbonSaved} kg CO₂ saved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
