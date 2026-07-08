import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getArticles } from '@/lib/content';
import { ArticleCard } from '@/components/cards';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t('nav_journal', locale as Locale) };
}

export default async function JournalPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  const { tag } = await searchParams;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const all = await getArticles();
  const tags = Array.from(new Set(all.flatMap((a) => a.tags))).sort();
  const articles = tag ? all.filter((a) => a.tags.includes(tag)) : all;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl sm:text-4xl">{t('nav_journal', l)}</h1>

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href={`/${l}/journal`}
            className={`border px-3 py-1.5 text-xs ${!tag ? 'border-ink bg-ink text-accent-ink' : 'border-line text-ink-soft hover:border-ink'}`}
          >
            {t('all', l)}
          </Link>
          {tags.map((v) => (
            <Link
              key={v}
              href={`/${l}/journal?tag=${encodeURIComponent(v)}`}
              className={`border px-3 py-1.5 text-xs ${tag === v ? 'border-ink bg-ink text-accent-ink' : 'border-line text-ink-soft hover:border-ink'}`}
            >
              {v}
            </Link>
          ))}
        </div>
      )}

      {articles.length === 0 ? (
        <p className="mt-16 text-center text-ink-faint">{t('no_results', l)}</p>
      ) : (
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={l} />
          ))}
        </div>
      )}
    </div>
  );
}
