import { ArrowUpRight } from 'lucide-react';
import { marketplaceItems } from '../data/mockMarketplace';

import bottleImg from '../assets/marketplace/bottle.jpg';
import toteImg from '../assets/marketplace/tote.jpg';
import solarImg from '../assets/marketplace/solar.jpg';
import cutleryImg from '../assets/marketplace/cutlery.jpg';
import refillImg from '../assets/marketplace/refill.jpg';
import produceImg from '../assets/marketplace/produce.jpg';

const imageMap = {
  bottle: bottleImg,
  tote: toteImg,
  solar: solarImg,
  cutlery: cutleryImg,
  refill: refillImg,
  produce: produceImg,
};

export default function MarketplacePage() {
  return (
    <main className="px-6 md:px-10 py-8 space-y-6 page-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest">Marketplace</h1>
          <p className="text-sm text-ink/50 mt-0.5">Sustainable swaps for things you already buy.</p>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 bg-paper-dim text-ink/50 text-[11px] font-mono px-3 py-1.5 rounded-full shrink-0">
          Coming soon — preview
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {marketplaceItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,46,29,0.08)] overflow-hidden flex flex-col card-lift"
          >
            <div className="w-full aspect-square bg-paper-dim overflow-hidden">
              <img
                src={imageMap[item.image]}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="p-5 flex flex-col flex-1">
              <span className="text-[10px] font-mono uppercase tracking-wide text-sage mb-1">{item.tag}</span>
              <h3 className="font-display text-base font-semibold text-ink leading-snug">{item.name}</h3>
              <p className="text-xs text-ink/40 mb-3">{item.brand}</p>

              <div className="mt-auto flex items-center justify-between pt-3 border-t border-dashed border-ink/15">
                <div>
                  <p className="font-mono text-sm font-semibold text-ink">₹{item.price}</p>
                  <p className="text-[11px] text-sage">Saves {item.co2Saved}</p>
                </div>
                <button
                  disabled
                  className="flex items-center gap-1 text-xs font-semibold text-ink/30 cursor-not-allowed px-3 py-2 rounded-lg bg-paper-dim"
                >
                  View <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
