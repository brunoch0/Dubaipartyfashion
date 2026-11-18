import { supabase } from '@/lib/supabase';
import { plainObject, readJsonObject } from '@/lib/api-guard';

const NAME_RE = /^[a-z0-9_]{1,64}$/;

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) return Response.json({ error: 'invalid_json' }, { status: 400 });

  const eventName = typeof body.event_name === 'string' ? body.event_name : '';
  if (!NAME_RE.test(eventName)) {
    return Response.json({ error: 'validation' }, { status: 400 });
  }

  const props = plainObject(body.props);

  // Fire and forget — analytics must never block the client
  const { error } = await supabase.from('analytics_events').insert({
    event_name: eventName,
    props,
    locale: typeof body.locale === 'string' ? body.locale.slice(0, 5) : null,
    path: typeof body.path === 'string' ? body.path.slice(0, 200) : null,
  });
  if (error) console.error('[track] insert failed:', error.code);

  return Response.json({ ok: true });
}
