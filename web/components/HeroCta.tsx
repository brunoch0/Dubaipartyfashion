'use client';

import { track } from '@/lib/analytics';

/** Hero CTA — supports anchor (#waitlist), internal path, or external URL. */
export default function HeroCta({
  href,
  label,
  purpose,
  secondary = false,
}: {
  href: string;
  label: string;
  purpose: string;
  secondary?: boolean;
}) {
  const external = /^https?:\/\//.test(href);
  const linkType = href.startsWith('#') ? 'anchor' : external ? 'external' : 'internal';

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={() => track('hero_cta_click', { purpose, linkType, position: 'hero' })}
      className={
        secondary
          ? 'border border-white/60 px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white/10'
          : 'bg-white px-8 py-3 text-sm uppercase tracking-widest text-ink transition-opacity hover:opacity-90'
      }
    >
      {label}
    </a>
  );
}
