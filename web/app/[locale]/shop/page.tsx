import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getProducts } from '@/lib/content';
import { ProductCard } from '@/components/cards';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t('nav_shop', locale as Locale) };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl sm:text-4xl">Shop</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {l === 'ko'
          ? '주문은 와츠앱 대화로 진행됩니다.'
          : l === 'ar'
            ? 'تتم الطلبات عبر محادثة واتساب.'
            : 'Orders are placed through a WhatsApp conversation.'}
      </p>
      {products.length === 0 ? (
        <p className="mt-16 text-center text-ink-faint">{t('no_results', l)}</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={l} />
          ))}
        </div>
      )}
    </div>
  );
}
