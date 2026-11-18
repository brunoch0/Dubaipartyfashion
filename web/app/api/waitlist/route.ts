import { supabase } from '@/lib/supabase';
import { boundedString, clientIp, plainObject, rateLimited, readJsonObject, validEmail } from '@/lib/api-guard';

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
  const email = validEmail(body.email);
  if (!name || !email) {
    return Response.json({ error: 'validation' }, { status: 400 });
  }

  const locale = ['ko', 'en', 'ar'].includes(body.locale as string) ? (body.locale as string) : 'en';
  // Tags: absent means none; anything else must be a valid array (no coercion, no truncation)
  const rawTags = body.preference_tags ?? [];
  if (
    !Array.isArray(rawTags) ||
    rawTags.length > 10 ||
    rawTags.some((v) => typeof v !== 'string' || v.length > 40)
  ) {
    return Response.json({ error: 'validation' }, { status: 400 });
  }
  const tags = rawTags as string[];

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
