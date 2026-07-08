import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getLookbook } from '@/lib/content';
import Gallery from '@/components/Gallery';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const data = await getLookbook(slug);
  if (!data) return {};
  const image = data.lookbook.og_image || data.lookbook.cover_image || undefined;
  return {
    title: pick(data.lookbook.title, l),
    description: pick(data.lookbook.summary, l),
    openGraph: { images: image ? [image] : undefined },
  };
}

export default async function LookbookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const data = await getLookbook(slug);
  if (!data) notFound();
  const { lookbook, images } = data;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link href={`/${l}/lookbook`} className="text-xs uppercase tracking-widest text-ink-faint hover:text-ink">
        ← {t('back_to_list', l)}
      </Link>

      <header className="mt-6 max-w-2xl">
        {lookbook.season && (
          <p className="text-xs uppercase tracking-widest text-accent">{lookbook.season}</p>
        )}
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">{pick(lookbook.title, l)}</h1>
        {pick(lookbook.summary, l) && (
          <p className="mt-4 text-ink-soft">{pick(lookbook.summary, l)}</p>
        )}
      </header>

      <div className="mt-10">
        {images.length === 0 ? (
          <p className="text-center text-ink-faint">{t('no_results', l)}</p>
        ) : (
          <Gallery images={images} locale={l} />
        )}
      </div>
    </div>
  );
}
