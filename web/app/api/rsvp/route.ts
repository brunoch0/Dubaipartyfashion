import { supabase } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (typeof body.website === 'string' && body.website.length > 0) {
    return Response.json({ ok: true }); // honeypot
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) {
    return Response.json({ error: 'rate_limited' }, { status: 429 });
  }

  const eventId = typeof body.event_id === 'string' ? body.event_id : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email =
    typeof body.email === 'string' && EMAIL_RE.test(body.email.trim())
      ? body.email.trim().toLowerCase().slice(0, 254)
      : null;
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) || null : null;

  if (!eventId || !name || (!email && !phone)) {
    return Response.json({ error: 'validation' }, { status: 400 });
  }

  // Server-side guard: reject when the event is closed/full or unpublished
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
    note: typeof body.note === 'string' ? body.note.trim().slice(0, 500) || null : null,
    locale,
    utm: typeof body.utm === 'object' && body.utm !== null ? body.utm : {},
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
