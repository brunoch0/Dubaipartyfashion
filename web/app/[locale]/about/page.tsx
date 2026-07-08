import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getSiteContent, type AboutSection } from '@/lib/content';
import Markdown from '@/components/Markdown';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t('nav_about', locale as Locale) };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const [brand, founder] = await Promise.all([
    getSiteContent<AboutSection>('about_brand'),
    getSiteContent<AboutSection>('about_founder'),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl sm:text-4xl">{t('nav_about', l)}</h1>

      {brand && (
        <section className="mt-12">
          <h2 className="font-display text-2xl">{pick(brand.title, l)}</h2>
          {brand.image_url && (
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-surface-muted">
              <Image
                src={brand.image_url}
                alt={pick(brand.title, l)}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-6">
            <Markdown>{pick(brand.body, l)}</Markdown>
          </div>
        </section>
      )}

      {founder && (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-display text-2xl">
            {pick(founder.title, l) || t('founders_message', l)}
          </h2>
          {founder.image_url && (
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-surface-muted">
              <Image
                src={founder.image_url}
                alt={pick(founder.title, l)}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-6">
            <Markdown>{pick(founder.body, l)}</Markdown>
          </div>
        </section>
      )}
    </div>
  );
}
