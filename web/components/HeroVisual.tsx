'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/**
 * Hero background visual: cinematic slow-motion video with an image fallback.
 * Video loads only on larger screens without reduced-motion preference
 * (mobile-first performance per spec); otherwise the poster image shows.
 * Film tone is enforced in CSS (grayscale + contrast) so any source footage
 * stays on-brand, and playbackRate slows the footage for the slow-motion feel.
 */
export default function HeroVisual({
  videoUrl,
  imageUrl,
  alt,
}: {
  videoUrl?: string;
  imageUrl?: string;
  alt: string;
}) {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoUrl) return;
    const wide = window.matchMedia('(min-width: 768px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setShowVideo(wide.matches && !reducedMotion.matches);
    update();
    wide.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, [videoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!showVideo || !v) return;
    // React does not reliably render the `muted` attribute, which breaks
    // autoplay policies — set it imperatively, then kick playback.
    v.muted = true;
    v.defaultMuted = true;
    v.playbackRate = 0.6; // slow-motion feel
    v.play().catch(() => setShowVideo(false)); // blocked (e.g. low-power mode) → poster
  }, [showVideo]);

  const filmTone = { filter: 'grayscale(1) contrast(1.08) brightness(0.95)' };

  if (videoUrl && showVideo) {
    return (
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={filmTone}
        src={videoUrl}
        poster={imageUrl}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt}
      />
    );
  }

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={filmTone}
      />
    );
  }

  return <div className="brand-gradient absolute inset-0" aria-hidden="true" />;
}
