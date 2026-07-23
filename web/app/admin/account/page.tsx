'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function AccountPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (password.length < 8) {
      setMessage({ kind: 'err', text: '비밀번호는 8자 이상이어야 합니다.' });
      return;
    }
    if (password !== confirm) {
      setMessage({ kind: 'err', text: '비밀번호가 서로 일치하지 않습니다.' });
      return;
    }
    setBusy(true);
    const { error } = await supabaseBrowser.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage({ kind: 'err', text: `변경 실패: ${error.message}` });
      return;
    }
    setPassword('');
    setConfirm('');
    setMessage({ kind: 'ok', text: '비밀번호가 변경되었습니다.' });
  }

  return (
    <div className="max-w-sm">
      <h1 className="font-display text-2xl">내 계정</h1>
      <p className="mt-1 text-sm text-ink-soft">임시 비밀번호로 로그인했다면 여기서 변경하세요.</p>
      <form onSubmit={submit} className="mt-6 space-y-4 border border-line bg-surface p-6">
        <div>
          <label htmlFor="pw" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            새 비밀번호
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label htmlFor="pw2" className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            새 비밀번호 확인
          </label>
          <input
            id="pw2"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink py-3 text-sm uppercase tracking-widest text-accent-ink disabled:opacity-50"
        >
          {busy ? '변경 중…' : '비밀번호 변경'}
        </button>
        {message && (
          <p className={`text-sm ${message.kind === 'ok' ? 'text-green-700' : 'text-red-700'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
