import Image from 'next/image';
import Link from 'next/link';
import { t } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
import { getLinks } from '@/lib/content';
import { pick } from '@/lib/i18n';
import TrackedLink from './TrackedLink';

export default async function Footer({ locale }: { locale: Locale }) {
  const links = await getLinks('footer');

  return (
    <footer className="border-t border-line bg-surface-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Image
            src="/brand/logo.png"
            alt="Bellinagrigia — Est. 2016"
            width={129}
            height={135}
            className="h-24 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm text-ink-soft">
            {t('shop_notice', locale)}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-ink-soft">
          {links.map((link) => (
            <TrackedLink
              key={link.id}
              href={link.url}
              newTab={link.new_tab}
              event="landing_link_click"
              props={{ sectionId: 'footer', linkType: link.link_type, platform: link.platform }}
              className="hover:text-ink transition-colors"
            >
              {pick(link.label, locale)}
            </TrackedLink>
          ))}
          <Link href={`/${locale}/about`} className="hover:text-ink transition-colors">
            {t('nav_about', locale)}
          </Link>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-ink-faint">
        © {new Date().getFullYear()} Bellinagrigia · Est. 2016 · Dubai, UAE
      </p>
    </footer>
  );
}
