/**
 * Cloudflare Worker - Claude API Proxy for Vapourware.ai
 *
 * Handles verse generation requests by forwarding to Claude API
 * with secure API key storage via Cloudflare secrets.
 *
 * Environment variables (set via wrangler secret):
 *   ANTHROPIC_API_KEY - Your Claude API key
 */

const ALLOWED_ORIGINS = [
  'https://vapourware.ai',
  'https://www.vapourware.ai',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080',
];

// CORS headers
function corsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// Handle CORS preflight
function handleOptions(request) {
  const origin = request.headers.get('Origin') || '';
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

// Call Claude API
async function callClaude(apiKey, prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Extract JSON from Claude's response
function extractJSON(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error('Failed to parse JSON from response');
    }
  }
  throw new Error('No JSON found in response');
}

// Main request handler
async function handleRequest(request, env) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    ...corsHeaders(origin),
    'Content-Type': 'application/json',
  };

  try {
    // Parse request body
    const { prompt, verseRef } = await request.json();

    if (!prompt || !verseRef) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt or verseRef' }),
        { status: 400, headers }
      );
    }

    // Check for API key
    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers }
      );
    }

    // Call Claude
    const claudeResponse = await callClaude(env.ANTHROPIC_API_KEY, prompt);

    // Extract text content
    const textContent = claudeResponse.content.find(c => c.type === 'text');
    if (!textContent) {
      throw new Error('No text content in Claude response');
    }

    // Parse and return verse data
    const verseData = extractJSON(textContent.text);

    return new Response(JSON.stringify(verseData), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Worker error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
}

// Worker entry point
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    // Only allow POST to /api/verse
    const url = new URL(request.url);
    if (request.method === 'POST' && (url.pathname === '/api/verse' || url.pathname === '/')) {
      return handleRequest(request, env);
    }

    // 404 for everything else
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
