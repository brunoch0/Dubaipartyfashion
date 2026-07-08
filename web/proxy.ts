import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, LOCALES, isLocale } from './lib/i18n';

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get('locale')?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get('accept-language') ?? '';
  for (const part of header.split(',')) {
    const code = part.split(';')[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip API routes, static assets and files with extensions
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
