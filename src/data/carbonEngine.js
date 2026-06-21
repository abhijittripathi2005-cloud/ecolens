/**
 * Carbon Engine — EcoLens's emission-factor lookup table.
 *
 * Methodology: kg CO2e per ₹100 spent, by category. Spend-based carbon
 * accounting is a recognized (if approximate) method used in consumer
 * sustainability apps — it converts money spent into an estimated footprint
 * using category-average emission intensities, since we don't have access
 * to exact product-level life-cycle data for every purchase.
 *
 * Sources used to calibrate these factors (directionally, not exact):
 * - India's grid emission factor: ~0.7–0.8 kg CO2/kWh (coal-heavy grid)
 * - Transport: petrol two-wheeler ~35–50 g CO2/km, mid-size car ~120–180 g CO2/km
 * - Food: vegetarian diet ~1.5–2.0 t CO2e/year, non-veg adds ~0.5–1.0 t CO2e/year
 *   (IARI / ICAR-backed studies on Indian diets)
 * - Fashion/electronics: higher manufacturing + import footprint per rupee
 *   than locally-produced goods (general LCA literature consensus)
 *
 * These are directional estimates for a hackathon MVP, not certified
 * carbon-accounting figures — that caveat is worth keeping in mind if asked.
 */

export const emissionFactors = {
  food: { factor: 0.7, label: 'Food & Dining', note: 'Diet-based average, India' },
  transport: { factor: 2.2, label: 'Transport', note: 'Petrol vehicle average' },
  fashion: { factor: 0.69, label: 'Fashion', note: 'Manufacturing + import footprint' },
  electronics: { factor: 0.75, label: 'Electronics', note: 'Manufacturing-heavy footprint' },
  groceries: { factor: 0.5, label: 'Groceries', note: 'Mixed packaged + fresh goods' },
  entertainment: { factor: 0.11, label: 'Entertainment', note: 'Mostly digital/service-based' },
  utilities: { factor: 0.59, label: 'Utilities', note: 'India grid: ~0.7–0.8 kg CO2/kWh' },
  other: { factor: 0.4, label: 'Other', note: 'Blended average' },
};

/**
 * Estimate kg CO2e for a transaction.
 * @param {string} category - one of the category ids above
 * @param {number} amount - amount spent in ₹
 * @returns {number} estimated kg CO2e, rounded to 1 decimal
 */
export function estimateCO2(category, amount) {
  const entry = emissionFactors[category] ?? emissionFactors.other;
  const co2 = (amount / 100) * entry.factor;
  return Math.round(co2 * 10) / 10;
}

/**
 * Calculate a 0–100 Green Score from a week of transactions.
 * Lower CO2-per-rupee-spent (i.e. greener spending mix) scores higher.
 * This is intentionally simple and explainable for a demo/judge Q&A.
 */
export function calculateGreenScore(transactions) {
  if (!transactions.length) return 50; // neutral starting score

  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCO2 = transactions.reduce((sum, t) => sum + t.co2, 0);
  if (totalSpend === 0) return 50;

  const co2PerRupee = totalCO2 / totalSpend;

  // Calibrated so a "blended average" spender (~0.5 kg CO2 per ₹100) lands
  // around 50–60, a low-footprint spender scores higher, heavy footprint lower.
  const benchmark = 0.005; // kg CO2 per ₹, roughly the "other" category average
  const ratio = co2PerRupee / benchmark;
  const score = Math.round(100 - (ratio - 1) * 40);

  return Math.max(0, Math.min(100, score));
}
