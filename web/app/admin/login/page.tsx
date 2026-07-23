'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Mode = 'login' | 'signup';

export default function AdminLoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');

    if (mode === 'login') {
      const { error: err } = await supabaseBrowser.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (err) {
        setError('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
        return;
      }
      router.replace('/admin');
      return;
    }

    // signup — admin whitelist emails are auto-confirmed by a DB trigger
    if (password.length < 8) {
      setBusy(false);
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    const { data, error: err } = await supabaseBrowser.auth.signUp({ email, password });
    if (err) {
      setBusy(false);
      setError(
        err.message.includes('already registered')
          ? '이미 가입된 이메일입니다. 로그인해주세요.'
          : `가입 실패: ${err.message}`
      );
      return;
    }
    if (data.session) {
      // project allows immediate session
      setBusy(false);
      router.replace('/admin');
      return;
    }
    // confirmed by trigger (whitelisted) → sign in right away
    const { error: loginErr } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (loginErr) {
      setMode('login');
      setNotice('가입 처리되었습니다. 확인 메일이 발송된 경우 링크 클릭 후 로그인해주세요.');
      return;
    }
    router.replace('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm border border-line bg-surface p-8">
        <h1 className="font-display text-center text-lg tracking-widest uppercase">
          Bellinagrigia
        </h1>
        <p className="mt-1 text-center text-xs text-ink-faint">Admin</p>

        <div className="mt-6 flex border border-line text-sm">
          {(['login', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError('');
                setNotice('');
              }}
              className={`flex-1 py-2 ${
                mode === m ? 'bg-ink text-accent-ink' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {m === 'login' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
              비밀번호 {mode === 'signup' && <span className="normal-case">(8자 이상)</span>}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
        </div>

        {mode === 'signup' && (
          <p className="mt-3 text-xs text-ink-faint">
            관리자로 등록된 이메일만 가입 후 접근할 수 있습니다.
          </p>
        )}
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        {notice && <p className="mt-3 text-sm text-green-700">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-ink py-3 text-sm uppercase tracking-widest text-accent-ink disabled:opacity-50"
        >
          {busy ? '처리 중…' : mode === 'login' ? '로그인' : '가입하기'}
        </button>
      </form>
    </div>
  );
}
