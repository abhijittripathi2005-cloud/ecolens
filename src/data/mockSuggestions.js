// Shape matches exactly what Claude API will return:
// { suggestion, moneySaved, carbonSaved }
// Member C just needs to replace this array with the parsed API response.

export const mockSuggestions = [
  {
    id: 'a1',
    suggestion: 'You ordered food delivery 4 times this week. Cooking 2 of those meals at home could cut costs and packaging waste significantly.',
    moneySaved: 380,
    carbonSaved: 2.8,
    category: 'food',
  },
  {
    id: 'a2',
    suggestion: 'Your Uber rides this week overlap with metro routes. Switching just the Tuesday and Thursday commutes to metro keeps you on schedule for less.',
    moneySaved: 140,
    carbonSaved: 6.1,
    category: 'transport',
  },
  {
    id: 'a3',
    suggestion: 'The electronics purchase this week (charger + cable) has a refurbished alternative from the same brand with the same warranty.',
    moneySaved: 600,
    carbonSaved: 9.4,
    category: 'electronics',
  },
];
