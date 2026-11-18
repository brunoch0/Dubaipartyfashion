import { supabase } from '@/lib/supabase';
import { boundedString, clientIp, plainObject, rateLimited, readJsonObject } from '@/lib/api-guard';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) return Response.json({ error: 'invalid_json' }, { status: 400 });

  // Honeypot: bots fill hidden fields — pretend success, store nothing
  if (typeof body.website === 'string' && body.website.length > 0) {
    return Response.json({ ok: true });
  }

  if (rateLimited(clientIp(request))) {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }

  // Over-length input is rejected, not silently truncated
  const name = boundedString(body.name, 120);
  const email = boundedString(body.email, 254)?.toLowerCase() ?? null;
  if (!name || !email || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'validation' }, { status: 400 });
  }

  const locale = ['ko', 'en', 'ar'].includes(body.locale as string) ? (body.locale as string) : 'en';
  const tags = Array.isArray(body.preference_tags)
    ? (body.preference_tags as unknown[]).filter((v): v is string => typeof v === 'string' && v.length <= 40).slice(0, 10)
    : [];

  const { error } = await supabase.from('waitlist_submissions').insert({
    name,
    email,
    preference_tags: tags,
    locale,
    section_id: boundedString(body.section_id, 80),
    utm: plainObject(body.utm),
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
