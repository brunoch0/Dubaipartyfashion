'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { track } from '@/lib/analytics';

/** Fires an impression event once when the wrapped section enters the viewport. */
export default function Impression({
  event,
  props = {},
  children,
  className,
}: {
  event: string;
  props?: Record<string, unknown>;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !fired.current) {
          fired.current = true;
          track(event, props);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
