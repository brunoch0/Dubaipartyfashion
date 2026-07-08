import Image from 'next/image';
import Link from 'next/link';
import { pick, formatDate, formatDateTime, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import type { Article, EventItem, Lookbook } from '@/lib/types';

function CoverImage({ src, alt, ratio }: { src: string | null; alt: string; ratio: string }) {
  return (
    <div className={`relative w-full overflow-hidden bg-surface-muted ${ratio}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      ) : (
        <div className="brand-gradient absolute inset-0" aria-hidden="true" />
      )}
    </div>
  );
}

export function ArticleCard({ article, locale }: { article: Article; locale: Locale }) {
  return (
    <Link href={`/${locale}/journal/${article.slug}`} className="group block">
      <CoverImage src={article.cover_image} alt={pick(article.title, locale)} ratio="aspect-[16/10]" />
      <div className="pt-3">
        <div className="flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-wide text-ink-faint">
          {article.published_at && <span>{formatDate(article.published_at, locale)}</span>}
          {article.reading_minutes ? (
            <span>
              · {article.reading_minutes} {t('min_read', locale)}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1 font-display text-lg leading-snug group-hover:underline">
          {pick(article.title, locale)}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{pick(article.summary, locale)}</p>
        {article.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="border border-line px-2 py-0.5 text-[0.7rem] text-ink-faint">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function LookbookCard({ lookbook, locale }: { lookbook: Lookbook; locale: Locale }) {
  return (
    <Link href={`/${locale}/lookbook/${lookbook.slug}`} className="group block">
      <CoverImage src={lookbook.cover_image} alt={pick(lookbook.title, locale)} ratio="aspect-[3/4]" />
      <div className="pt-3">
        {lookbook.season && (
          <p className="text-[0.7rem] uppercase tracking-widest text-ink-faint">{lookbook.season}</p>
        )}
        <h3 className="mt-0.5 font-display text-lg group-hover:underline">
          {pick(lookbook.title, locale)}
        </h3>
      </div>
    </Link>
  );
}

const STATUS_LABEL = { open: 'event_open', closed: 'event_closed', full: 'event_full' } as const;

export function EventCard({ event, locale }: { event: EventItem; locale: Locale }) {
  return (
    <Link href={`/${locale}/events/${event.slug}`} className="group block">
      <div className="relative">
        <CoverImage src={event.cover_image} alt={pick(event.title, locale)} ratio="aspect-[16/10]" />
        <span
          className={`absolute top-2 px-2 py-1 text-[0.7rem] uppercase tracking-wide ltr:left-2 rtl:right-2 ${
            event.rsvp_status === 'open' ? 'bg-ink text-accent-ink' : 'bg-surface text-ink-soft'
          }`}
        >
          {t(STATUS_LABEL[event.rsvp_status], locale)}
        </span>
      </div>
      <div className="pt-3">
        <p className="text-[0.7rem] uppercase tracking-wide text-ink-faint">
          {formatDateTime(event.starts_at, locale)}
        </p>
        <h3 className="mt-1 font-display text-lg leading-snug group-hover:underline">
          {pick(event.title, locale)}
        </h3>
        <p className="mt-0.5 text-sm text-ink-soft">{pick(event.venue, locale)}</p>
      </div>
    </Link>
  );
}
