import { useState, useRef } from 'react';
import { Receipt, Upload, X, AlertCircle, Check, RotateCw } from 'lucide-react';
import { categories } from '../data/mockData';
import { estimateCO2 } from '../data/carbonEngine';

function catMeta(id) {
  return categories.find((c) => c.id === id) ?? { icon: '📦', label: id };
}

// Converts a File object into a base64 string (without the data: prefix),
// which is what Gemini's inlineData field expects.
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = typeof result === 'string' ? result.split(',')[1] : '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Receipt scanner. Calls our own /api/receipt serverless function, which
 * holds the Gemini API key server-side and never exposes it to the browser.
 */
export default function ReceiptScanner({ onConfirm }) {
  const [status, setStatus] = useState('empty');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [category, setCategory] = useState('groceries');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setStatus('preview');
  }

  async function handleScan() {
    if (!imageFile) return;
    setStatus('loading');
    setErrorMessage('');

    try {
      const imageBase64 = await fileToBase64(imageFile);

      const res = await fetch('/api/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType: imageFile.type }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const result = await res.json();
      setParsedData(result);
      setCategory(result.suggestedCategory || 'other');
      setStatus('parsed');
    } catch (err) {
      console.error('Receipt scan failed:', err);
      setErrorMessage('Try a clearer photo, or enter it manually.');
      setStatus('error');
    }
  }

  function handleConfirm() {
    if (!parsedData) return;
    onConfirm?.({
      id: `t${Date.now()}`,
      category,
      amount: parsedData.total,
      co2: estimateCO2(category, parsedData.total),
      date: parsedData.date,
      label: parsedData.merchant,
    });
    handleReset();
  }

  function handleReset() {
    setStatus('empty');
    setImageFile(null);
    setImagePreviewUrl(null);
    setParsedData(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] overflow-hidden">
      <div className="bg-forest px-6 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center">
          <Receipt className="w-4 h-4 text-amber-light" strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-paper leading-tight">Scan a Receipt</h3>
          <p className="text-[11px] text-sage-light">Upload a photo — we'll read the rest</p>
        </div>
      </div>

      <div className="p-6">
        {/* EMPTY — upload zone */}
        {status === 'empty' && (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-ink/15 hover:border-sage rounded-xl py-10 flex flex-col items-center gap-3 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-paper-dim flex items-center justify-center">
              <Upload className="w-5 h-5 text-sage" strokeWidth={2} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">Tap to upload a receipt photo</p>
              <p className="text-xs text-ink/40 mt-0.5">JPG or PNG, up to 10MB</p>
            </div>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* PREVIEW — image chosen, ready to scan */}
        {status === 'preview' && imagePreviewUrl && (
          <div>
            <div className="relative rounded-lg overflow-hidden border border-ink/10 mb-4">
              <img src={imagePreviewUrl} alt="Receipt preview" className="w-full max-h-64 object-contain bg-paper-dim" />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink/60 hover:bg-ink/80 flex items-center justify-center transition-colors"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </button>
            </div>
            <button
              onClick={handleScan}
              className="w-full bg-amber hover:bg-amber-light text-forest font-semibold text-sm py-3 rounded-lg transition-colors"
            >
              Scan Receipt
            </button>
          </div>
        )}

        {/* LOADING */}
        {status === 'loading' && (
          <div className="py-10 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-sage-light border-t-sage animate-spin" />
            <p className="text-xs text-ink/40 font-mono">Reading your receipt…</p>
          </div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-coral mx-auto mb-3" strokeWidth={1.8} />
            <p className="text-sm font-medium text-ink mb-1">Couldn't read that receipt</p>
            <p className="text-xs text-ink/50 mb-4">{errorMessage || 'Try a clearer photo, or enter it manually.'}</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleScan}
                className="flex items-center gap-1.5 text-xs font-semibold text-forest border border-forest/20 hover:bg-paper-dim px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" strokeWidth={2} />
                Try again
              </button>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-ink/50 hover:text-ink px-4 py-2 transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        )}

        {/* PARSED — show extracted data, allow category confirm */}
        {status === 'parsed' && parsedData && (
          <div>
            <div className="bg-paper-dim rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-display text-base font-semibold text-forest">{parsedData.merchant}</p>
                <p className="font-mono text-sm font-semibold text-ink">₹{parsedData.total}</p>
              </div>
              <p className="font-mono text-[11px] text-ink/40 mb-3">{parsedData.date}</p>

              <div className="space-y-1.5 pt-3 border-t border-dashed border-ink/15">
                {parsedData.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-ink/60">{item.name}</span>
                    <span className="font-mono text-ink/60">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <label className="block text-xs font-medium text-ink/60 mb-1.5">Category</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {categories.map((c) => (
                <button
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

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-lg text-sm font-semibold text-ink/50 hover:text-ink hover:bg-paper-dim transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 bg-forest hover:bg-forest-light text-paper font-semibold text-sm py-3 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" strokeWidth={2.5} />
                Add Transaction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
