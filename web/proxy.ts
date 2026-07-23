import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, LOCALES, isLocale } from './lib/i18n';

function detectLocale(request: NextRequest): string {
  // English-first: no browser-language detection. Only an explicit choice
  // made via the language switcher (stored in the cookie) overrides it.
  const cookie = request.cookies.get('locale')?.value;
  if (cookie && isLocale(cookie)) return cookie;
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
  // Skip API routes, the admin area, static assets and files with extensions
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
};
