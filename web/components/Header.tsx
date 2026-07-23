import Link from 'next/link';
import { t } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header({ locale }: { locale: Locale }) {
  const nav = [
    { href: `/${locale}/about`, label: t('nav_about', locale) },
    { href: `/${locale}/journal`, label: t('nav_journal', locale) },
    { href: `/${locale}/lookbook`, label: t('nav_lookbook', locale) },
    { href: `/${locale}/events`, label: t('nav_events', locale) },
    { href: `/${locale}/shop`, label: t('nav_shop', locale) },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="font-display text-lg tracking-widest uppercase">
          Bellinagrigia
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <LocaleSwitcher locale={locale} />
      </div>
      {/* Mobile nav */}
      <nav className="flex gap-4 overflow-x-auto px-4 pb-2 text-sm text-ink-soft md:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-ink">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
