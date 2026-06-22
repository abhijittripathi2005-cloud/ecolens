// Vercel Serverless Function — runs on the server, never exposed to the browser.
// The GEMINI_API_KEY env var is only readable here, not in client-side code.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY' });
  }

  const { transactions } = req.body;
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return res.status(400).json({ error: 'transactions array is required' });
  }

  const prompt = `You are EcoLens, an eco-financial advisor.
User's this week transactions: ${JSON.stringify(transactions)}
Generate exactly 3 specific, actionable suggestions to reduce their spending AND carbon footprint. Be personal and specific to the actual transactions listed above.
Respond with ONLY a raw JSON array, no markdown formatting, no code fences, no extra text. Each item must look like:
{"suggestion": "string", "moneySaved": number, "carbonSaved": number, "category": "string"}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return res.status(502).json({ error: 'AI provider error' });
    }

    const data = await geminiRes.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip markdown code fences if Gemini adds them despite instructions
    const cleaned = rawText.replace(/```json\s*|```/g, '').trim();

    let suggestions;
    try {
      suggestions = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse Gemini response as JSON:', cleaned);
      return res.status(502).json({ error: 'AI returned an unparseable response' });
    }

    // Attach stable ids for React keys, since the model won't generate them
    const withIds = suggestions.map((s, i) => ({ id: `ai-${Date.now()}-${i}`, ...s }));

    return res.status(200).json({ suggestions: withIds });
  } catch (err) {
    console.error('Advisor handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
