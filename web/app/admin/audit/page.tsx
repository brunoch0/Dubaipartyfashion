'use client';

import { Fragment, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { pick, type MLText } from '@/lib/i18n';

interface AuditRow {
  id: string;
  at: string;
  actor_email: string | null;
  table_name: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  row_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
}

const TABLE_LABEL: Record<string, string> = {
  articles: '아티클',
  events: '이벤트',
  lookbooks: '룩북',
  lookbook_images: '룩북 이미지',
  links: 'SNS/링크',
  sns_posts: 'SNS 피드',
  preorder_campaigns: '사전예약',
  site_content: '사이트 문구',
  waitlist_submissions: '대기명단',
  rsvp_submissions: 'RSVP',
};

const ACTION_LABEL: Record<string, { label: string; cls: string }> = {
  INSERT: { label: '생성', cls: 'text-green-700' },
  UPDATE: { label: '수정', cls: 'text-ink' },
  DELETE: { label: '삭제', cls: 'text-red-700' },
};

/** Ignore noise fields when computing what changed */
const SKIP_KEYS = new Set(['updated_at', 'created_at']);

function titleOf(row: AuditRow): string {
  const d = row.new_data ?? row.old_data ?? {};
  for (const key of ['title', 'label', 'caption']) {
    if (d[key] && typeof d[key] === 'object') {
      const v = pick(d[key] as MLText, 'ko') || pick(d[key] as MLText, 'en');
      if (v) return v;
    }
  }
  if (typeof d.name === 'string') return d.name;
  if (typeof d.key === 'string') return String(d.key);
  if (typeof d.slug === 'string') return String(d.slug);
  if (typeof d.platform === 'string') return String(d.platform);
  return row.row_id?.slice(0, 8) ?? '';
}

function changedKeys(row: AuditRow): string[] {
  if (row.action !== 'UPDATE' || !row.old_data || !row.new_data) return [];
  const keys = new Set([...Object.keys(row.old_data), ...Object.keys(row.new_data)]);
  return [...keys].filter(
    (k) =>
      !SKIP_KEYS.has(k) &&
      JSON.stringify(row.old_data![k]) !== JSON.stringify(row.new_data![k])
  );
}

const PAGE = 50;

export default function AuditPage() {
  const [rows, setRows] = useState<AuditRow[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    supabaseBrowser
      .from('audit_log')
      .select('*')
      .order('at', { ascending: false })
      .limit(limit)
      .then(({ data }) => setRows((data as AuditRow[]) ?? []));
  }, [limit]);

  return (
    <div>
      <h1 className="font-display text-2xl">변경 기록</h1>
      <p className="mt-1 text-sm text-ink-soft">
        관리자가 콘텐츠를 생성·수정·삭제한 내역이 자동으로 남습니다. 행을 클릭하면 상세를 볼 수 있어요.
      </p>

      <div className="mt-6 border border-line bg-surface">
        {rows === null ? (
          <p className="p-4 text-sm text-ink-faint">불러오는 중…</p>
        ) : rows.length === 0 ? (
          <p className="p-4 text-sm text-ink-faint">아직 기록이 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-2">일시</th>
                <th className="px-4 py-2">누가</th>
                <th className="px-4 py-2">무엇을</th>
                <th className="px-4 py-2">동작</th>
                <th className="px-4 py-2">변경 항목</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const action = ACTION_LABEL[r.action];
                const changes = changedKeys(r);
                const isOpen = expanded === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr
                      onClick={() => setExpanded(isOpen ? null : r.id)}
                      className="cursor-pointer border-b border-line last:border-0 hover:bg-surface-muted"
                    >
                      <td className="whitespace-nowrap px-4 py-2 text-xs text-ink-soft">
                        {new Date(r.at).toLocaleString('ko-KR', { timeZone: 'Asia/Dubai' })}
                      </td>
                      <td className="px-4 py-2 text-xs">{r.actor_email ?? '—'}</td>
                      <td className="px-4 py-2">
                        <span className="text-xs text-ink-faint">{TABLE_LABEL[r.table_name] ?? r.table_name}</span>{' '}
                        {titleOf(r)}
                      </td>
                      <td className={`px-4 py-2 text-xs font-medium ${action.cls}`}>{action.label}</td>
                      <td className="px-4 py-2 text-xs text-ink-soft">
                        {r.action === 'UPDATE' ? changes.join(', ') : ''}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-line bg-surface-muted">
                        <td colSpan={5} className="px-4 py-3">
                          <div className="grid gap-4 md:grid-cols-2">
                            {r.old_data && (
                              <div>
                                <p className="mb-1 text-xs font-medium text-ink-soft">변경 전</p>
                                <pre className="max-h-64 overflow-auto border border-line bg-surface p-3 text-[11px]">
                                  {JSON.stringify(
                                    r.action === 'UPDATE'
                                      ? Object.fromEntries(changes.map((k) => [k, r.old_data![k]]))
                                      : r.old_data,
                                    null,
                                    2
                                  )}
                                </pre>
                              </div>
                            )}
                            {r.new_data && (
                              <div>
                                <p className="mb-1 text-xs font-medium text-ink-soft">
                                  {r.action === 'INSERT' ? '생성 내용' : '변경 후'}
                                </p>
                                <pre className="max-h-64 overflow-auto border border-line bg-surface p-3 text-[11px]">
                                  {JSON.stringify(
                                    r.action === 'UPDATE'
                                      ? Object.fromEntries(changes.map((k) => [k, r.new_data![k]]))
                                      : r.new_data,
                                    null,
                                    2
                                  )}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {rows !== null && rows.length >= limit && (
        <button
          onClick={() => setLimit((l) => l + PAGE)}
          className="mt-4 border border-line bg-surface px-4 py-2 text-sm hover:border-ink"
        >
          더보기
        </button>
      )}
    </div>
  );
}
