import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, pick, formatDate, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getArticle, getArticles } from '@/lib/content';
import Markdown from '@/components/Markdown';
import { ArticleCard } from '@/components/cards';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const article = await getArticle(slug);
  if (!article) return {};

  const title = pick(article.title, l);
  const description = pick(article.summary, l);
  const image = article.og_image || article.cover_image || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: l === 'ko' ? 'ko_KR' : l === 'ar' ? 'ar_AE' : 'en_AE',
      images: image ? [image] : undefined,
      publishedTime: article.published_at ?? undefined,
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const article = await getArticle(slug);
  if (!article) notFound();

  const related = (await getArticles(4)).filter((a) => a.id !== article.id).slice(0, 3);

  // Article structured data (JSON-LD) — safe minimal output even with missing fields
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pick(article.title, l),
    ...(article.published_at ? { datePublished: article.published_at } : {}),
    ...(article.author ? { author: { '@type': 'Person', name: article.author } } : {}),
    ...(article.cover_image ? { image: [article.cover_image] } : {}),
    inLanguage: l,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `/${l}/journal/${article.slug}` },
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <Link href={`/${l}/journal`} className="text-xs uppercase tracking-widest text-ink-faint hover:text-ink">
        ← {t('back_to_list', l)}
      </Link>

      <h1 className="mt-6 font-display text-3xl leading-tight sm:text-4xl">
        {pick(article.title, l)}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-faint">
        {article.author && <span>{article.author}</span>}
        {article.published_at && <span>· {formatDate(article.published_at, l)}</span>}
        {article.reading_minutes ? (
          <span>
            · {article.reading_minutes} {t('min_read', l)}
          </span>
        ) : null}
      </div>

      {article.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/${l}/journal?tag=${encodeURIComponent(tag)}`}
              className="border border-line px-2 py-0.5 text-xs text-ink-faint hover:border-ink"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {article.cover_image && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden bg-surface-muted">
          <Image
            src={article.cover_image}
            alt={pick(article.title, l)}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8">
        <Markdown>{pick(article.body, l)}</Markdown>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-display text-xl">{t('related_articles', l)}</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} locale={l} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
