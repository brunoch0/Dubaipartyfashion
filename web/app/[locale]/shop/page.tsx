import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import WaitlistForm from '@/components/WaitlistForm';

export const revalidate = 300;

// Future category expansion slots — data-driven later, placeholder for IA now
const CATEGORIES = ['fashion', 'partywear', 'fragrance'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: `${t('nav_shop', locale as Locale)} — ${t('shop_coming_soon', locale as Locale)}` };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">{t('nav_shop', l)}</p>
      <h1 className="mt-4 font-display text-4xl sm:text-5xl">{t('shop_coming_soon', l)}</h1>
      <p className="mx-auto mt-5 max-w-md text-ink-soft">{t('shop_notice', l)}</p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="border border-line bg-surface px-5 py-2.5 text-sm capitalize text-ink-faint"
          >
            {cat}
          </span>
        ))}
      </div>

      <section id="waitlist" className="mx-auto mt-16 max-w-xl border-t border-line pt-12 text-start">
        <h2 className="text-center font-display text-2xl">{t('join_waitlist', l)}</h2>
        <div className="mt-8">
          <WaitlistForm locale={l} sectionId="shop_waitlist" />
        </div>
      </section>
    </div>
  );
}
