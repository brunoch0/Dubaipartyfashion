'use client';

/**
 * First-party analytics. Events land in Supabase `analytics_events`.
 * Never include PII (names, emails, phones) in props.
 */
export function track(eventName: string, props: Record<string, unknown> = {}) {
  try {
    const payload = JSON.stringify({
      event_name: eventName,
      props: { ...props, ...utmProps() },
      locale: document.documentElement.lang || null,
      path: location.pathname,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', body: payload, keepalive: true });
    }
  } catch {
    // analytics must never break the page
  }
}

export function utmProps(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(location.search);
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
      const v = params.get(k);
      if (v) out[k] = v;
    }
  } catch {
    /* noop */
  }
  return out;
}

export function domainOf(url: string): string {
  try {
    return new URL(url, location.origin).hostname;
  } catch {
    return '';
  }
}
