import { supabase } from '@/lib/supabase';
import { boundedString, clientIp, plainObject, rateLimited, readJsonObject } from '@/lib/api-guard';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) return Response.json({ error: 'invalid_json' }, { status: 400 });

  if (typeof body.website === 'string' && body.website.length > 0) {
    return Response.json({ ok: true }); // honeypot
  }

  if (rateLimited(clientIp(request))) {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }

  const eventId = boundedString(body.event_id, 64);
  const name = boundedString(body.name, 120);
  const emailRaw = boundedString(body.email, 254)?.toLowerCase() ?? null;
  const email = emailRaw && EMAIL_RE.test(emailRaw) ? emailRaw : null;
  const phone = boundedString(body.phone, 40);

  if (!eventId || !name || (!email && !phone)) {
    return Response.json({ error: 'validation' }, { status: 400 });
  }

  // Server-side guard: reject when the event is closed/full or unpublished.
  // (Also enforced at the RLS policy level — this gives a clean error message.)
  const { data: event } = await supabase
    .from('events')
    .select('id,rsvp_status')
    .eq('id', eventId)
    .maybeSingle();
  if (!event) {
    return Response.json({ error: 'not_found' }, { status: 404 });
  }
  if (event.rsvp_status !== 'open') {
    return Response.json({ error: 'closed' }, { status: 409 });
  }

  const partySize = Math.min(Math.max(Number(body.party_size) || 1, 1), 20);
  const locale = ['ko', 'en', 'ar'].includes(body.locale as string) ? (body.locale as string) : 'en';

  const { error } = await supabase.from('rsvp_submissions').insert({
    event_id: eventId,
    name,
    email,
    phone,
    party_size: partySize,
    note: boundedString(body.note, 500),
    locale,
    utm: plainObject(body.utm),
  });

  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'duplicate' }, { status: 409 });
    }
    console.error('[rsvp] insert failed:', error.code, error.message);
    return Response.json({ error: 'server' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
