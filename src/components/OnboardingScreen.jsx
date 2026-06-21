import { useState } from 'react';
import { Leaf, Receipt, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

const slides = [
  {
    icon: Receipt,
    title: 'Track every rupee',
    body: 'Log transactions manually or just snap a photo of your receipt — EcoLens reads the rest.',
  },
  {
    icon: TrendingUp,
    title: 'See your real footprint',
    body: 'Every purchase is mapped to its CO₂ impact, so your spending and your footprint live in one place.',
  },
  {
    icon: Sparkles,
    title: 'Get smarter suggestions',
    body: 'Your AI Eco-Advisor finds greener, cheaper alternatives — personal to how you actually spend.',
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [step, setStep] = useState(0);
  const isLast = step === slides.length - 1;
  const slide = slides[step];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-between px-6 py-10 text-paper">
      <div className="flex items-center gap-2 self-start">
        <Leaf className="w-6 h-6 text-amber-light" strokeWidth={2.5} />
        <span className="font-display text-xl font-semibold tracking-tight">EcoLens</span>
      </div>

      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-amber/15 flex items-center justify-center mb-8">
          <Icon className="w-9 h-9 text-amber-light" strokeWidth={1.8} />
        </div>
        <h1 className="font-display text-2xl font-semibold mb-3">{slide.title}</h1>
        <p className="text-sm text-sage-light leading-relaxed">{slide.body}</p>
      </div>

      <div className="w-full max-w-sm">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-amber-light' : 'w-1.5 bg-sage-light/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => (isLast ? onFinish() : setStep((s) => s + 1))}
          className="w-full flex items-center justify-center gap-2 bg-amber hover:bg-amber-light text-forest font-semibold text-sm py-3.5 rounded-lg transition-colors"
        >
          {isLast ? "Let's go" : 'Next'}
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {!isLast && (
          <button
            onClick={onFinish}
            className="w-full text-center text-xs text-sage-light/70 hover:text-sage-light mt-3 py-1 transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
