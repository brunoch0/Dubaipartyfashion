import type { Metadata } from 'next';
import { Marcellus, Noto_Sans_KR, Noto_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { LOCALES, isLocale, dir, type Locale } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
});

const notoKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-kr',
});

const notoAr = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-ar',
});

export const metadata: Metadata = {
  title: {
    default: 'BellinaGrigia — Dubai Lifestyle Brand',
    template: '%s · BellinaGrigia',
  },
  description:
    'A taste-driven lifestyle brand born from the Dubai community and party network. Fashion, partywear and fragrance — coming soon.',
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  return (
    <html
      lang={l}
      dir={dir(l)}
      className={`${marcellus.variable} ${notoKr.variable} ${notoAr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header locale={l} />
        <main className="flex-1">{children}</main>
        <Footer locale={l} />
      </body>
    </html>
  );
}
