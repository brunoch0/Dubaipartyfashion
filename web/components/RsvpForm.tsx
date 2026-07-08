'use client';

import { useState } from 'react';
import Link from 'next/link';
import { t } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import { track, utmProps } from '@/lib/analytics';
import Impression from './Impression';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error';

export default function RsvpForm({
  locale,
  eventId,
  eventSlug,
  rsvpStatus,
}: {
  locale: Locale;
  eventId: string;
  eventSlug: string;
  rsvpStatus: 'open' | 'closed' | 'full';
}) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [note, setNote] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [fieldError, setFieldError] = useState<{ name?: string; contact?: string }>({});

  // Closed / full → disabled form with alternative CTA back to waitlist
  if (rsvpStatus !== 'open') {
    return (
      <ClosedNotice locale={locale} rsvpStatus={rsvpStatus} eventSlug={eventSlug} />
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errors: typeof fieldError = {};
    if (!name.trim()) errors.name = t('required_field', locale);
    if (!contact.trim()) errors.contact = t('required_field', locale);
    setFieldError(errors);
    if (Object.keys(errors).length) return;

    const isEmail = EMAIL_RE.test(contact.trim());
    setStatus('submitting');
    track('rsvp_submit_start', { eventId, status: rsvpStatus });
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          name: name.trim(),
          email: isEmail ? contact.trim().toLowerCase() : null,
          phone: isEmail ? null : contact.trim(),
          party_size: partySize,
          note: note.trim() || null,
          locale,
          utm: utmProps(),
          website,
        }),
      });
      if (res.status === 409) {
        setStatus('duplicate');
        track('rsvp_submit_fail', { eventId, failReason: 'duplicate' });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      track('rsvp_submit_success', { eventId });
    } catch {
      setStatus('error');
      track('rsvp_submit_fail', { eventId, failReason: 'network' });
    }
  }

  if (status === 'success' || status === 'duplicate') {
    return (
      <div className="border border-line bg-surface p-6 text-center">
        <p className="font-display text-lg">
          {status === 'success' ? t('rsvp_success', locale) : t('rsvp_duplicate', locale)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rsvp-name" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            {t('waitlist_name', locale)} *
          </label>
          <input
            id="rsvp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          {fieldError.name && <p className="mt-1 text-xs text-red-700">{fieldError.name}</p>}
        </div>
        <div>
          <label htmlFor="rsvp-contact" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            {t('rsvp_contact', locale)} *
          </label>
          <input
            id="rsvp-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          {fieldError.contact && <p className="mt-1 text-xs text-red-700">{fieldError.contact}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rsvp-size" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            {t('rsvp_party_size', locale)}
          </label>
          <select
            id="rsvp-size"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="w-full border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rsvp-note" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            {t('rsvp_note', locale)}
          </label>
          <input
            id="rsvp-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-ink px-8 py-3 text-sm uppercase tracking-widest text-accent-ink transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {status === 'submitting' ? t('waitlist_submitting', locale) : t('rsvp_submit', locale)}
        </button>
        {status === 'error' && (
          <p className="text-sm text-red-700">
            {t('form_error', locale)}{' '}
            <button type="button" onClick={submit as never} className="underline">
              {t('form_retry', locale)}
            </button>
          </p>
        )}
      </div>
      <p className="text-xs text-ink-faint">{t('privacy_note', locale)}</p>
    </form>
  );
}

function ClosedNotice({
  locale,
  rsvpStatus,
  eventSlug,
}: {
  locale: Locale;
  rsvpStatus: 'closed' | 'full';
  eventSlug: string;
}) {
  return (
    <Impression event="soldout_notice_impression" props={{ eventSlug }}>
      <div className="border border-line bg-surface-muted p-6 text-center">
        <p className="font-display text-lg">
          {rsvpStatus === 'full' ? t('event_full', locale) : t('event_closed', locale)}
        </p>
        <p className="mt-2 text-sm text-ink-soft">{t('rsvp_closed_notice', locale)}</p>
        <Link
          href={`/${locale}#waitlist`}
          className="mt-4 inline-block bg-ink px-6 py-2.5 text-sm uppercase tracking-widest text-accent-ink"
          onClick={() => track('rsvp_alt_cta_click', { eventSlug, from: rsvpStatus })}
        >
          {t('join_waitlist', locale)}
        </Link>
      </div>
    </Impression>
  );
}
