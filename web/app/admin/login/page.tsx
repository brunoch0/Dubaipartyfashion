'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      setError('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
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
        <div className="mt-6 space-y-4">
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
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
              autoComplete="current-password"
            />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-ink py-3 text-sm uppercase tracking-widest text-accent-ink disabled:opacity-50"
        >
          {busy ? '확인 중…' : '로그인'}
        </button>
      </form>
    </div>
  );
}
