import { supabase } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort in-memory rate limit (per serverless instance)
const hits = new Map<string, { count: number; ts: number }>();
function rateLimited(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > windowMs) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields — pretend success, store nothing
  if (typeof body.website === 'string' && body.website.length > 0) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
  if (!name || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'validation' }, { status: 400 });
  }

  const locale = ['ko', 'en', 'ar'].includes(body.locale as string) ? (body.locale as string) : 'en';
  const tags = Array.isArray(body.preference_tags)
    ? (body.preference_tags as string[]).filter((v) => typeof v === 'string').slice(0, 10)
    : [];

  const { error } = await supabase.from('waitlist_submissions').insert({
    name,
    email,
    preference_tags: tags,
    locale,
    section_id: typeof body.section_id === 'string' ? body.section_id.slice(0, 80) : null,
    utm: typeof body.utm === 'object' && body.utm !== null ? body.utm : {},
  });

  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'duplicate' }, { status: 409 });
    }
    console.error('[waitlist] insert failed:', error.code, error.message);
    return Response.json({ error: 'server' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
