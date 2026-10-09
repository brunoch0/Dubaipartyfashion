import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import {
  getSiteContent,
  getLookbooks,
  getProducts,
  type HeroContent,
  type AboutSection,
} from '@/lib/content';
import Impression from '@/components/Impression';
import HeroCta from '@/components/HeroCta';
import HeroVisual from '@/components/HeroVisual';
import { LookbookCard, ProductCard } from '@/components/cards';

export const revalidate = 60;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const [hero, intro, lookbooks, products] = await Promise.all([
    getSiteContent<HeroContent>('hero'),
    getSiteContent<AboutSection>('landing_intro'),
    getLookbooks(3),
    getProducts(3),
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
              {pick(hero?.headline, l) || 'Bellinagrigia'}
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


      {/* ===== Shop preview ===== */}
      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl sm:text-3xl">Shop</h2>
            <Link href={`/${l}/shop`} className="text-sm uppercase tracking-widest text-ink-soft hover:text-ink">
              {t('view_all', l)}
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={l} />
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

    </>
  );
}
