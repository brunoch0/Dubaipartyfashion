'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

const NAV = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/content', label: '사이트 문구' },
  { href: '/admin/articles', label: '아티클' },
  { href: '/admin/events', label: '이벤트' },
  { href: '/admin/lookbooks', label: '룩북' },
  { href: '/admin/links', label: 'SNS/링크' },
  { href: '/admin/sns', label: 'SNS 피드' },
  { href: '/admin/preorder', label: '사전예약' },
  { href: '/admin/waitlist', label: '대기명단' },
  { href: '/admin/rsvps', label: 'RSVP' },
  { href: '/admin/audit', label: '변경 기록' },
  { href: '/admin/account', label: '내 계정' },
];

/** Auth guard + admin chrome. Children render only with an admin session. */
export default function AdminShell({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'anon' | 'denied' | 'ok'>('loading');
  const [email, setEmail] = useState<string>('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function check() {
      const { data } = await supabaseBrowser.auth.getSession();
      const session = data.session;
      if (!mounted) return;
      if (!session) {
        setState('anon');
        return;
      }
      setEmail(session.user.email ?? '');
      // whitelist check — non-admins can hold a session but see nothing
      const { data: rows } = await supabaseBrowser.from('admin_emails').select('email').limit(1);
      if (!mounted) return;
      setState(rows && rows.length > 0 ? 'ok' : 'denied');
    }
    check();
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(() => check());
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) return;
    if (state === 'anon') router.replace('/admin/login');
  }, [state, router, isLogin]);

  useEffect(() => {
    if (isLogin && state === 'ok') router.replace('/admin');
  }, [state, router, isLogin]);

  if (isLogin) {
    return <div className="min-h-screen bg-bg text-ink">{children}</div>;
  }

  if (state === 'loading' || state === 'anon') {
    return <p className="p-10 text-sm text-ink-faint">확인 중…</p>;
  }
  if (state === 'denied') {
    return (
      <div className="p-10">
        <p className="text-sm">이 계정({email})은 관리자 권한이 없습니다.</p>
        <button
          onClick={() => supabaseBrowser.auth.signOut()}
          className="mt-4 border border-line px-4 py-2 text-sm"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="font-display text-sm tracking-widest uppercase">
            Bellinagrigia — Admin
          </Link>
          <div className="flex items-center gap-3 text-xs text-ink-soft">
            <span className="hidden sm:inline">{email}</span>
            <a href="/en" target="_blank" rel="noopener noreferrer" className="underline">
              사이트 보기
            </a>
            <button onClick={() => supabaseBrowser.auth.signOut()} className="border border-line px-3 py-1.5">
              로그아웃
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 text-sm">
          {NAV.map((item) => {
            const active =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1.5 ${
                  active ? 'bg-ink text-accent-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
