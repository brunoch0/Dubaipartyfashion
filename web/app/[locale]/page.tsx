import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import {
  getSiteContent,
  getLinks,
  getPreorderCampaigns,
  getArticles,
  getLookbooks,
  getEvents,
  getSnsPosts,
  type HeroContent,
  type AboutSection,
} from '@/lib/content';
import Impression from '@/components/Impression';
import HeroCta from '@/components/HeroCta';
import HeroVisual from '@/components/HeroVisual';
import TrackedLink from '@/components/TrackedLink';
import WaitlistForm from '@/components/WaitlistForm';
import { ArticleCard, EventCard, LookbookCard } from '@/components/cards';

export const revalidate = 60;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const [hero, intro, links, preorders, articles, lookbooks, events, snsPosts] =
    await Promise.all([
      getSiteContent<HeroContent>('hero'),
      getSiteContent<AboutSection>('landing_intro'),
      getLinks('landing_links'),
      getPreorderCampaigns(),
      getArticles(3),
      getLookbooks(3),
      getEvents(3),
      getSnsPosts(),
    ]);

  return (
    <>
      {/* ===== Hero ===== */}
      <Impression event="hero_impression" props={{ position: 'hero' }}>
        <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden">
          <HeroVisual
            videoUrl={hero?.video_url}
            imageUrl={hero?.visual_url}
            alt={pick(hero?.visual_alt, l) || ''}
          />
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center text-white">
            {pick(hero?.badge, l) && (
              <span className="mb-4 inline-block border border-white/50 px-3 py-1 text-xs uppercase tracking-widest">
                {pick(hero?.badge, l)}
              </span>
            )}
            <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              {pick(hero?.headline, l) || 'BellinaGrigia'}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              {pick(hero?.subcopy, l)}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <HeroCta
                href={hero?.cta_href || '#waitlist'}
                label={pick(hero?.cta_label, l) || t('join_waitlist', l)}
                purpose="waitlist"
              />
              {pick(hero?.secondary_label, l) && (
                <HeroCta
                  href={hero?.secondary_href || `/${l}/about`}
                  label={pick(hero?.secondary_label, l)}
                  purpose="secondary"
                  secondary
                />
              )}
            </div>
          </div>
        </section>
      </Impression>

      {/* ===== Brand intro summary ===== */}
      {intro && (
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-2xl sm:text-3xl">{pick(intro.title, l)}</h2>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-ink-soft">
            {pick(intro.body, l)}
          </p>
          <Link
            href={`/${l}/about`}
            className="mt-7 inline-block border-b border-ink pb-0.5 text-sm uppercase tracking-widest hover:opacity-70"
          >
            {t('read_more', l)}
          </Link>
        </section>
      )}

      {/* ===== Preorder / crowdfunding ===== */}
      {preorders.length > 0 && (
        <Impression event="preorder_section_impression" props={{ status: preorders[0].status }}>
          <section className="border-y border-line bg-surface">
            <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center">
              {preorders.map((p) => (
                <div key={p.id} className="md:col-span-2">
                  <p className="text-xs uppercase tracking-widest text-accent">
                    {p.status === 'current' ? t('preorder', l) : t('preorder_upcoming', l)}
                  </p>
                  <h2 className="mt-2 font-display text-2xl sm:text-3xl">{pick(p.title, l)}</h2>
                  <p className="mt-3 max-w-2xl text-ink-soft">{pick(p.summary, l)}</p>
                  <div className="mt-6">
                    {p.status === 'current' && p.url ? (
                      <TrackedLink
                        href={p.url}
                        newTab
                        event="preorder_link_click"
                        props={{ status: p.status }}
                        className="inline-block bg-ink px-8 py-3 text-sm uppercase tracking-widest text-accent-ink hover:opacity-85"
                      >
                        {pick(p.link_label, l) || t('preorder', l)}
                      </TrackedLink>
                    ) : (
                      /* Upcoming → fall back to waitlist CTA so conversion never dead-ends */
                      <a
                        href="#waitlist"
                        className="inline-block bg-ink px-8 py-3 text-sm uppercase tracking-widest text-accent-ink hover:opacity-85"
                      >
                        {t('join_waitlist', l)}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Impression>
      )}

      {/* ===== Upcoming events ===== */}
      {events.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl sm:text-3xl">{t('upcoming_events', l)}</h2>
            <Link href={`/${l}/events`} className="text-sm uppercase tracking-widest text-ink-soft hover:text-ink">
              {t('view_all', l)}
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} locale={l} />
            ))}
          </div>
        </section>
      )}

      {/* ===== Lookbook preview ===== */}
      {lookbooks.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl sm:text-3xl">{t('nav_lookbook', l)}</h2>
              <Link href={`/${l}/lookbook`} className="text-sm uppercase tracking-widest text-ink-soft hover:text-ink">
                {t('view_all', l)}
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {lookbooks.map((lb) => (
                <LookbookCard key={lb.id} lookbook={lb} locale={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Journal preview ===== */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl sm:text-3xl">{t('nav_journal', l)}</h2>
            <Link href={`/${l}/journal`} className="text-sm uppercase tracking-widest text-ink-soft hover:text-ink">
              {t('view_all', l)}
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={l} />
            ))}
          </div>
        </section>
      )}

      {/* ===== SNS links + feed ===== */}
      {(links.length > 0 || snsPosts.length > 0) && (
        <Impression event="landing_link_impression" props={{ sectionId: 'landing_links' }}>
          <section className="border-t border-line bg-surface-muted">
            <div className="mx-auto max-w-6xl px-6 py-20 text-center">
              <h2 className="font-display text-2xl sm:text-3xl">{t('sns_feed', l)}</h2>
              {snsPosts.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                  {snsPosts.slice(0, 6).map((post) => (
                    <TrackedLink
                      key={post.id}
                      href={post.post_url}
                      newTab
                      event="sns_card_click"
                      props={{ platform: post.platform, sectionId: 'sns_feed' }}
                      className="group relative block aspect-square overflow-hidden bg-surface"
                    >
                      {post.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image_url}
                          alt={pick(post.caption, l) || post.platform}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="brand-gradient h-full w-full" />
                      )}
                    </TrackedLink>
                  ))}
                </div>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {links.map((link) => (
                  <TrackedLink
                    key={link.id}
                    href={link.url}
                    newTab={link.new_tab}
                    event="landing_link_click"
                    props={{
                      sectionId: link.section_id,
                      linkType: link.link_type,
                      platform: link.platform,
                    }}
                    className="border border-line bg-surface px-5 py-2.5 text-sm hover:border-ink"
                  >
                    {pick(link.label, l)}
                  </TrackedLink>
                ))}
              </div>
            </div>
          </section>
        </Impression>
      )}

      {/* ===== Waitlist ===== */}
      <section id="waitlist" className="border-t border-line">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <h2 className="text-center font-display text-2xl sm:text-3xl">{t('join_waitlist', l)}</h2>
          <div className="mt-8">
            <WaitlistForm locale={l} />
          </div>
        </div>
      </section>
    </>
  );
}
