import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

const client = new Anthropic(); // Uses ANTHROPIC_API_KEY env var

// Example tidbits from the static verses to guide the style
const EXAMPLE_TIDBITS = `
- "vanity" (הֶבֶל, he·vel): Vanity — often translated "vanity" but literally means breath, vapor, or mist. Something that appears and quickly vanishes — not worthless, but fleeting and ungraspable.
- "generation" (דּוֹר, dor): Generation — from a root meaning "to circle" or "to dwell." Each generation inhabits its moment, then yields to the next in an endless cycle.
- "sun" (הַשָּׁמֶשׁ, ha·sha·mesh): The sun — "under the sun" appears 29 times in Ecclesiastes. It defines the book's scope: life as experienced in this visible world, under heaven's watchful eye.
- "forever" (לְעוֹלָם, le·o·lam): Forever — "olam" means hidden time, eternity, or age. The earth endures into time beyond human reckoning, a permanence we can name but never know.
- "remains" (עֹמָדֶת, o·me·det): Stands/remains — from "amad" (to stand firm). While generations flow like water, the earth stands like a rock. The verb suggests quiet, steadfast presence.
`;

function buildPrompt(chapter, verse, links) {
  return `You are a Hebrew Bible scholar. Generate word annotations for Ecclesiastes ${chapter}:${verse}.

Words to annotate (by their English link keys): ${links.join(', ')}

## Tidbit Style Guide
Each tidbit should:
- Begin with the English word followed by an em dash (—)
- Include the Hebrew word and its transliteration
- Be 1-2 contemplative sentences on etymology, root meaning, or theological significance
- Use centered dots (·) for syllable breaks in transliteration (NOT hyphens)
- Match the scholarly but accessible tone of the examples below

## Examples of the exact style to match:
${EXAMPLE_TIDBITS}

Return ONLY valid JSON (no markdown, no code fences):
{
  "words": {
    "rises": {
      "hebrew": "וְזָרַח",
      "transliteration": "ve·za·rach",
      "tidbit": "Rises — from 'zarach', to dawn or shine forth. The sun's rising is not mere movement but an act of radiance, light breaking through darkness."
    },
    "sun": {
      "hebrew": "הַשֶּׁמֶשׁ",
      "transliteration": "ha·sha·mesh",
      "tidbit": "The sun — ..."
    }
  }
}

Important:
- Generate tidbits for ALL the link keys provided: ${links.join(', ')}
- Use accurate Hebrew text for each word from Ecclesiastes ${chapter}:${verse}
- Transliterations should use centered dots (·) for syllables, not hyphens
- Each tidbit should reveal layers of meaning without being pedantic
- Connect to broader Ecclesiastes themes when relevant`;
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

  const { ref, links } = req.body;

  if (!ref || !links || !Array.isArray(links) || links.length === 0) {
    return res.status(400).json({ error: 'Missing ref or links parameters' });
  }

  // Parse ref
  const match = ref.match(/^(\d+):(\d+)$/);
  if (!match) {
    return res.status(400).json({ error: 'Invalid ref format' });
  }

  const [, chapter, verse] = match;

  try {
    // Check server-side cache
    const cacheKey = `ecc-verse-tidbits:${ref}`;
    const cached = await kv.get(cacheKey);

    if (cached) {
      console.log(`[Cache hit] Tidbits for ${ref}`);
      return res.status(200).json(cached);
    }

    console.log(`[Generating] Tidbits for ${ref}, links: ${links.join(', ')}`);

    // Generate with Claude
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: buildPrompt(chapter, verse, links)
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
    if (!data.words || typeof data.words !== 'object') {
      console.error('Invalid response structure:', data);
      return res.status(500).json({
        error: 'Invalid response structure from AI',
        retry: true
      });
    }

    // Cache for 30 days
    await kv.set(cacheKey, data, { ex: 86400 * 30 });

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error generating tidbits:', error);

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limited, please wait',
        retry: true,
        retryAfter: 60
      });
    }

    return res.status(500).json({
      error: 'Failed to generate tidbits',
      retry: true
    });
  }
}
