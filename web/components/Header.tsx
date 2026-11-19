import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header({ locale }: { locale: Locale }) {
  // Navigation stays English in every locale (brand decision, 2026-07-23)
  // Simplified site (2026-10-09): Lookbook + Shop only.
  // Hidden but still routable: /about (footer link), /journal, /events.
  const nav = [
    { href: `/${locale}/lookbook`, label: 'Lookbook' },
    { href: `/${locale}/shop`, label: 'Shop' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={`/${locale}`} className="font-script text-2xl leading-none text-ink">
          Bellinagrigia
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:opacity-70 transition-opacity">
              {item.label}
            </Link>
          ))}
        </nav>
        <LocaleSwitcher locale={locale} />
      </div>
      {/* Mobile nav */}
      <nav className="flex gap-4 overflow-x-auto px-4 pb-2 text-sm font-medium text-ink md:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap hover:opacity-70">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
