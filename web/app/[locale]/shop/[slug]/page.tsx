import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { t } from '@/lib/dictionary';
import { getProduct, getWhatsApp } from '@/lib/content';
import Gallery from '@/components/Gallery';
import Markdown from '@/components/Markdown';
import TrackedLink from '@/components/TrackedLink';
import Impression from '@/components/Impression';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const data = await getProduct(slug);
  if (!data) return {};
  return {
    title: pick(data.product.title, l),
    description: pick(data.product.summary, l),
    openGraph: { images: data.product.cover_image ? [data.product.cover_image] : undefined },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const data = await getProduct(slug);
  if (!data) notFound();
  const { product, images } = data;
  const whatsapp = await getWhatsApp();

  const soldout = product.status === 'soldout';
  const waText = encodeURIComponent(
    `Hi Bellinagrigia! I'd like to order: ${pick(product.title, 'en')}`
  );
  const waHref = `https://wa.me/${whatsapp}?text=${waText}`;

  const orderLabel =
    l === 'ko' ? '와츠앱으로 주문' : l === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp';

  return (
    <Impression event="product_detail_view" props={{ productSlug: product.slug }}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link href={`/${l}/shop`} className="text-xs uppercase tracking-widest text-ink-faint hover:text-ink">
          ← {t('back_to_list', l)}
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div>
            <Gallery images={images} locale={l} />
          </div>

          <div>
            {pick(product.badge, l) && (
              <p className="text-xs uppercase tracking-[0.25em] text-accent">
                {pick(product.badge, l)}
              </p>
            )}
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">{pick(product.title, l)}</h1>
            {product.price_aed !== null && (
              <p className="mt-3 text-xl">
                AED {Number(product.price_aed).toLocaleString()}
                {product.compare_price_aed ? (
                  <s className="ms-3 text-base text-ink-faint">
                    AED {Number(product.compare_price_aed).toLocaleString()}
                  </s>
                ) : null}
              </p>
            )}
            {pick(product.summary, l) && (
              <p className="mt-4 text-ink-soft">{pick(product.summary, l)}</p>
            )}

            {product.sizes.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs uppercase tracking-widest text-ink-faint">Size</p>
                <div className="flex gap-2">
                  {product.sizes.map((s) => (
                    <span key={s} className="border border-line bg-surface px-4 py-2 text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 space-y-3">
              {soldout ? (
                <p className="border border-line bg-surface-muted px-6 py-4 text-center text-sm uppercase tracking-widest text-ink-soft">
                  Sold out
                </p>
              ) : (
                <>
                  <TrackedLink
                    href={waHref}
                    newTab
                    event="order_whatsapp_click"
                    props={{ productSlug: product.slug }}
                    className="block bg-ink px-8 py-4 text-center text-sm uppercase tracking-widest text-accent-ink hover:opacity-85"
                  >
                    {orderLabel}
                  </TrackedLink>
                  {product.payment_link && (
                    <TrackedLink
                      href={product.payment_link}
                      newTab
                      event="pay_link_click"
                      props={{ productSlug: product.slug }}
                      className="block border border-ink px-8 py-4 text-center text-sm uppercase tracking-widest hover:bg-surface"
                    >
                      {l === 'ko' ? '바로 결제하기' : l === 'ar' ? 'ادفع الآن' : 'Pay Now'}
                    </TrackedLink>
                  )}
                  <p className="text-center text-xs text-ink-faint">
                    {l === 'ko'
                      ? '사이즈·수령 방법은 와츠앱 대화에서 안내드려요'
                      : l === 'ar'
                        ? 'نرتب المقاس والاستلام عبر واتساب'
                        : 'Size & delivery arranged in the WhatsApp chat'}
                  </p>
                </>
              )}
            </div>

            {pick(product.details, l) && (
              <div className="mt-10 border-t border-line pt-8">
                <Markdown>{pick(product.details, l)}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </Impression>
  );
}
