'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LOCALES, type Locale } from '@/lib/i18n';

const LABEL: Record<Locale, string> = { en: 'EN', ko: '한국어', ar: 'عربي' };

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    document.cookie = `locale=${next};path=/;max-age=31536000`;
    const rest = pathname.replace(/^\/(en|ko|ar)(?=\/|$)/, '');
    router.push(`/${next}${rest}`);
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`px-2 py-1 transition-colors ${
            l === locale ? 'bg-ink text-accent-ink' : 'text-ink-soft hover:text-ink'
          }`}
          aria-current={l === locale ? 'true' : undefined}
        >
          {LABEL[l]}
        </button>
      ))}
    </div>
  );
}
