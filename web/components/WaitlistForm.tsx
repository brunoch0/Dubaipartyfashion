'use client';

import { useState } from 'react';
import { t } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import { track, utmProps } from '@/lib/analytics';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TAG_OPTIONS = ['fashion', 'partywear', 'fragrance', 'events', 'community'];

type Status = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error';

export default function WaitlistForm({
  locale,
  sectionId = 'landing_waitlist',
}: {
  locale: Locale;
  sectionId?: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [fieldError, setFieldError] = useState<{ name?: string; email?: string }>({});

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((v) => v !== tag) : [...prev, tag]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errors: typeof fieldError = {};
    if (!name.trim()) errors.name = t('required_field', locale);
    if (!EMAIL_RE.test(email)) errors.email = t('invalid_email', locale);
    setFieldError(errors);
    if (Object.keys(errors).length) return;

    setStatus('submitting');
    track('waitlist_submit_start', { sectionId });
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          preference_tags: tags,
          locale,
          section_id: sectionId,
          utm: utmProps(),
          website,
        }),
      });
      if (res.status === 409) {
        setStatus('duplicate');
        track('waitlist_submit_fail', { sectionId, errorCode: 'duplicate' });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      track('waitlist_submit_success', { sectionId });
    } catch {
      setStatus('error');
      track('waitlist_submit_fail', { sectionId, errorCode: 'network' });
    }
  }

  if (status === 'success' || status === 'duplicate') {
    return (
      <div className="border border-line bg-surface p-6 text-center">
        <p className="font-display text-lg">
          {status === 'success' ? t('waitlist_success', locale) : t('waitlist_duplicate', locale)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {/* Honeypot — hidden from humans */}
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
          <label htmlFor="wl-name" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            {t('waitlist_name', locale)} *
          </label>
          <input
            id="wl-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          {fieldError.name && <p className="mt-1 text-xs text-red-700">{fieldError.name}</p>}
        </div>
        <div>
          <label htmlFor="wl-email" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            {t('waitlist_email', locale)} *
          </label>
          <input
            id="wl-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          {fieldError.email && <p className="mt-1 text-xs text-red-700">{fieldError.email}</p>}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">{t('waitlist_tags', locale)}</p>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`border px-3 py-1.5 text-xs capitalize transition-colors ${
                tags.includes(tag)
                  ? 'border-ink bg-ink text-accent-ink'
                  : 'border-line bg-surface text-ink-soft hover:border-ink'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-ink px-8 py-3 text-sm uppercase tracking-widest text-accent-ink transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {status === 'submitting' ? t('waitlist_submitting', locale) : t('waitlist_submit', locale)}
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
