import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

const client = new Anthropic(); // Uses ANTHROPIC_API_KEY env var

function buildPrompt(chapter, verse) {
  return `Generate the HTML structure for Ecclesiastes ${chapter}:${verse}.

You are a Hebrew Bible scholar. Generate the verse with accurate Hebrew text and a scholarly English translation.

Return ONLY valid JSON (no markdown, no code fences):
{
  "ref": "${chapter}:${verse}",
  "hebrew": "<span class=\\"word-he\\" data-link=\\"rises\\">וְזָרַח</span> <span class=\\"word-he\\" data-link=\\"sun\\">הַשֶּׁמֶשׁ</span>...",
  "english": "The <span class=\\"word-en\\" data-link=\\"sun\\">sun</span> <span class=\\"word-en\\" data-link=\\"rises\\">rises</span>...",
  "links": ["rises", "sun", "goes", "place", "hastens"]
}

Rules:
- Use the actual Hebrew text from Ecclesiastes ${chapter}:${verse}
- Every Hebrew word wrapped in <span class="word-he" data-link="...">
- Corresponding English words wrapped in <span class="word-en" data-link="...">
- data-link values are lowercase English keys connecting Hebrew to English (use the primary English word)
- "links" array lists all unique link values used in this verse
- Hebrew text uses right-to-left word order (but HTML is left-to-right, just list words in Hebrew reading order)
- English should be a literary/scholarly translation that flows naturally
- For compound Hebrew words joined by maqef (־), keep them together in one span
- Do NOT include any markdown formatting or code fences in your response`;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ref } = req.body;

  if (!ref) {
    return res.status(400).json({ error: 'Missing ref parameter' });
  }

  // Parse ref (format: "1:5" for chapter:verse)
  const match = ref.match(/^(\d+):(\d+)$/);
  if (!match) {
    return res.status(400).json({ error: 'Invalid ref format. Use chapter:verse (e.g., "1:5")' });
  }

  const [, chapter, verse] = match;
  const chapterNum = parseInt(chapter);
  const verseNum = parseInt(verse);

  // Validate Ecclesiastes bounds (12 chapters, chapter 1 has 18 verses)
  if (chapterNum < 1 || chapterNum > 12) {
    return res.status(400).json({ error: 'Invalid chapter. Ecclesiastes has 12 chapters.' });
  }

  // For now, only supporting chapter 1 (verses 5-18, since 1-4 are static)
  if (chapterNum === 1 && (verseNum < 5 || verseNum > 18)) {
    return res.status(400).json({ error: 'For chapter 1, only verses 5-18 are dynamically loaded.' });
  }

  try {
    // Check server-side cache
    const cacheKey = `ecc-verse-html:${ref}`;
    const cached = await kv.get(cacheKey);

    if (cached) {
      console.log(`[Cache hit] ${ref}`);
      return res.status(200).json(cached);
    }

    console.log(`[Generating] ${ref}`);

    // Generate with Claude
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: buildPrompt(chapter, verse)
      }]
    });

    // Parse response
    const responseText = message.content[0].text;
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return res.status(500).json({
        error: 'Invalid response format from AI',
        retry: true
      });
    }

    // Validate response structure
    if (!data.ref || !data.hebrew || !data.english || !data.links) {
      console.error('Incomplete response:', data);
      return res.status(500).json({
        error: 'Incomplete response from AI',
        retry: true
      });
    }

    // Cache for 30 days
    await kv.set(cacheKey, data, { ex: 86400 * 30 });

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error generating verse:', error);

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limited, please wait',
        retry: true,
        retryAfter: 60
      });
    }

    return res.status(500).json({
      error: 'Failed to generate verse',
      retry: true
    });
  }
}
