'use client';

import { track, domainOf } from '@/lib/analytics';
import type { ReactNode } from 'react';

interface Props {
  href: string;
  event: string;
  props?: Record<string, unknown>;
  newTab?: boolean;
  className?: string;
  children: ReactNode;
}

/** External/CTA link that fires an analytics event on click. No PII in props. */
export default function TrackedLink({
  href,
  event,
  props = {},
  newTab = false,
  className,
  children,
}: Props) {
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={className}
      onClick={() => track(event, { ...props, targetDomain: domainOf(href) })}
    >
      {children}
    </a>
  );
}
