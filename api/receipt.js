// Vercel Serverless Function for receipt scanning (Gemini vision).
// Accepts a base64-encoded image and returns structured receipt data.

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // receipts photos can be a few MB
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY' });
  }

  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  const prompt = `You are reading a shopping receipt image. Extract the following and respond with ONLY a raw JSON object, no markdown, no code fences, no extra text:
{
  "merchant": "string - the store/restaurant name",
  "date": "string - YYYY-MM-DD, use today's date if not visible",
  "total": number - the final total amount paid,
  "suggestedCategory": "string - one of: food, transport, fashion, electronics, groceries, entertainment, utilities, other",
  "items": [{"name": "string", "price": number}]
}
If you cannot read the receipt clearly, make a reasonable best-effort guess rather than failing.`;

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
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
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
    const cleaned = rawText.replace(/```json\s*|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse Gemini receipt response:', cleaned);
      return res.status(502).json({ error: 'AI returned an unparseable response' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Receipt handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
