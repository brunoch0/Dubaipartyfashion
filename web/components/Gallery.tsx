'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import type { LookbookImage } from '@/lib/types';
import { pick, type Locale } from '@/lib/i18n';

/** Lookbook detail gallery with a simple lightbox. */
export default function Gallery({ images, locale }: { images: LookbookImage[]; locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) => {
      setOpen((cur) => {
        if (cur === null) return cur;
        return (cur + delta + images.length) % images.length;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, step]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <figure key={img.id}>
            <button
              onClick={() => setOpen(i)}
              className="group relative block aspect-[3/4] w-full overflow-hidden bg-surface-muted"
              aria-label={pick(img.alt, locale) || `Image ${i + 1}`}
            >
              <Image
                src={img.image_url}
                alt={pick(img.alt, locale) || ''}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </button>
            {pick(img.caption, locale) && (
              <figcaption className="mt-2 text-xs text-ink-faint">
                {pick(img.caption, locale)}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {open !== null && images[open] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-4 text-3xl text-white/80 hover:text-white ltr:right-6 rtl:left-6"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 p-4 text-3xl text-white/70 hover:text-white ltr:left-2 rtl:right-2"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="relative h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[open].image_url}
              alt={pick(images[open].alt, locale) || ''}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            className="absolute top-1/2 -translate-y-1/2 p-4 text-3xl text-white/70 hover:text-white ltr:right-2 rtl:left-2"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
