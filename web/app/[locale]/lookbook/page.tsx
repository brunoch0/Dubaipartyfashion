import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getLookbooks } from '@/lib/content';
import { LookbookCard } from '@/components/cards';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t('nav_lookbook', locale as Locale) };
}

export default async function LookbookListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const lookbooks = await getLookbooks();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl sm:text-4xl">{t('nav_lookbook', l)}</h1>
      {lookbooks.length === 0 ? (
        <p className="mt-16 text-center text-ink-faint">{t('no_results', l)}</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {lookbooks.map((lb) => (
            <LookbookCard key={lb.id} lookbook={lb} locale={l} />
          ))}
        </div>
      )}
    </div>
  );
}
