import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, pick, formatDateTime, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getEvent } from '@/lib/content';
import Markdown from '@/components/Markdown';
import RsvpForm from '@/components/RsvpForm';
import TrackedLink from '@/components/TrackedLink';
import Impression from '@/components/Impression';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const event = await getEvent(slug);
  if (!event) return {};
  return {
    title: pick(event.title, l),
    description: pick(event.summary, l),
    openGraph: { images: event.cover_image ? [event.cover_image] : undefined },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const event = await getEvent(slug);
  if (!event) notFound();

  const statusKey =
    event.rsvp_status === 'open' ? 'event_open' : event.rsvp_status === 'full' ? 'event_full' : 'event_closed';

  return (
    <Impression event="event_detail_view" props={{ eventSlug: event.slug, status: event.rsvp_status }}>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href={`/${l}/events`} className="text-xs uppercase tracking-widest text-ink-faint hover:text-ink">
          ← {t('back_to_list', l)}
        </Link>

        {event.cover_image && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-surface-muted">
            <Image
              src={event.cover_image}
              alt={pick(event.title, l)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <header className="mt-8">
          <span
            className={`inline-block px-2 py-1 text-xs uppercase tracking-wide ${
              event.rsvp_status === 'open' ? 'bg-ink text-accent-ink' : 'bg-surface-muted text-ink-soft'
            }`}
          >
            {t(statusKey, l)}
          </span>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            {pick(event.title, l)}
          </h1>
          {pick(event.summary, l) && <p className="mt-3 text-ink-soft">{pick(event.summary, l)}</p>}
        </header>

        {/* Key facts */}
        <dl className="mt-8 grid gap-4 border-y border-line py-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink-faint">{t('event_date', l)}</dt>
            <dd className="mt-1 text-sm">
              {formatDateTime(event.starts_at, l)}
              {event.ends_at && ` – ${formatDateTime(event.ends_at, l)}`}
              <span className="ms-1 text-xs text-ink-faint">(GST)</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-ink-faint">{t('event_venue', l)}</dt>
            <dd className="mt-1 text-sm">
              {pick(event.venue, l)}
              {event.map_url && (
                <>
                  {' · '}
                  <TrackedLink
                    href={event.map_url}
                    newTab
                    event="event_link_click"
                    props={{ eventSlug: event.slug, position: 'detail_map_link' }}
                    className="underline underline-offset-2"
                  >
                    {t('map_link', l)}
                  </TrackedLink>
                </>
              )}
            </dd>
          </div>
          {pick(event.price_note, l) && (
            <div className="sm:col-span-2">
              <dd className="text-sm text-ink-soft">{pick(event.price_note, l)}</dd>
            </div>
          )}
        </dl>

        {pick(event.description, l) && (
          <div className="mt-8">
            <Markdown>{pick(event.description, l)}</Markdown>
          </div>
        )}

        {event.external_links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {event.external_links.map((link, i) => (
              <TrackedLink
                key={i}
                href={link.url}
                newTab
                event="event_link_click"
                props={{ eventSlug: event.slug, position: 'detail_secondary_link', linkType: link.type }}
                className="border border-line px-4 py-2 text-sm hover:border-ink"
              >
                {pick(link.label, l)} ↗
              </TrackedLink>
            ))}
          </div>
        )}

        <section id="rsvp" className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl">{t('rsvp_title', l)}</h2>
          <div className="mt-6">
            <RsvpForm
              locale={l}
              eventId={event.id}
              eventSlug={event.slug}
              rsvpStatus={event.rsvp_status}
            />
          </div>
        </section>
      </article>
    </Impression>
  );
}
