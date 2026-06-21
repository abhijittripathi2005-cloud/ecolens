// Mock parsed-receipt result. Member C's OCR call (Claude API with image input)
// should return something shaped like this so the UI can render it directly.

export const mockParsedReceipt = {
  merchant: 'Big Bazaar',
  date: '2026-06-19',
  total: 845,
  suggestedCategory: 'groceries',
  items: [
    { name: 'Basmati Rice 5kg', price: 320 },
    { name: 'Cooking Oil 1L', price: 180 },
    { name: 'Toor Dal 1kg', price: 145 },
    { name: 'Mixed Vegetables', price: 200 },
  ],
};
