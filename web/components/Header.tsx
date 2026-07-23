import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header({ locale }: { locale: Locale }) {
  // Navigation stays English in every locale (brand decision, 2026-07-23)
  const nav = [
    { href: `/${locale}/about`, label: 'About' },
    { href: `/${locale}/journal`, label: 'Journal' },
    { href: `/${locale}/lookbook`, label: 'Lookbook' },
    { href: `/${locale}/events`, label: 'Events' },
    { href: `/${locale}/shop`, label: 'Shop' },
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
