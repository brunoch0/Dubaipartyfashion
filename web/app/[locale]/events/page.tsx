import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getEvents } from '@/lib/content';
import { EventCard } from '@/components/cards';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t('nav_events', locale as Locale) };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const events = await getEvents();
  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.starts_at).getTime() >= now)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  const past = events.filter((e) => new Date(e.starts_at).getTime() < now);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl sm:text-4xl">{t('nav_events', l)}</h1>

      {events.length === 0 && <p className="mt-16 text-center text-ink-faint">{t('no_results', l)}</p>}

      {upcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-6 text-sm uppercase tracking-widest text-ink-soft">
            {t('upcoming_events', l)}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} locale={l} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-sm uppercase tracking-widest text-ink-faint">Past</h2>
          <div className="grid gap-8 opacity-70 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} locale={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
