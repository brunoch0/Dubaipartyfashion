/** Shared guards for public API routes (Codex review r1 fixes #2, #3, #4). */

// Best-effort in-memory rate limit (per serverless instance)
const hits = new Map<string, { count: number; ts: number }>();
export function rateLimited(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > windowMs) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

export function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

/** JSON body must be a plain object (not null/array/primitive). */
export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Plain object check for jsonb passthrough fields (arrays are objects too). */
export function plainObject(v: unknown): Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

/** Reject-over-length string: returns null when missing/empty/too long (no silent truncation). */
export function boundedString(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!s || s.length > max) return null;
  return s;
}
