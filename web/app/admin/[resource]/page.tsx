'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { RESOURCES } from '@/lib/admin/resources';
import { pick } from '@/lib/i18n';

type Row = Record<string, unknown>;

function titleOf(row: Row, titleField: string): string {
  if (titleField.startsWith('ml:')) {
    const v = row[titleField.slice(3)] as Record<string, string> | null;
    return pick(v, 'ko') || pick(v, 'en') || '(제목 없음)';
  }
  return String(row[titleField] ?? '');
}

function toCsv(rows: Row[]): string {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

export default function ResourceListPage() {
  const params = useParams<{ resource: string }>();
  const def = RESOURCES[params.resource];
  const [rows, setRows] = useState<Row[] | null>(null);
  const [eventTitles, setEventTitles] = useState<Map<string, string>>(new Map());

  const load = useCallback(async () => {
    if (!def) return;
    const { data } = await supabaseBrowser
      .from(def.table)
      .select('*')
      .order(def.orderBy.column, { ascending: def.orderBy.ascending });
    setRows((data as Row[]) ?? []);
    if (def.table === 'rsvp_submissions') {
      const { data: evs } = await supabaseBrowser.from('events').select('id,title');
      setEventTitles(
        new Map((evs ?? []).map((e) => [e.id as string, pick(e.title, 'ko') || pick(e.title, 'en')]))
      );
    }
  }, [def]);

  useEffect(() => {
    load();
  }, [load]);

  if (!def) notFound();

  async function remove(id: string) {
    if (!confirm('정말 삭제할까요? 되돌릴 수 없습니다.')) return;
    const { error } = await supabaseBrowser.from(def.table).delete().eq('id', id);
    if (error) alert(`삭제 실패: ${error.message}`);
    else load();
  }

  function downloadCsv() {
    const csv = toCsv(rows ?? []);
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${def.table}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const isSubmission = def.readonly;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">{def.label}</h1>
        <div className="flex gap-2">
          {def.csv && (
            <button onClick={downloadCsv} className="border border-line bg-surface px-4 py-2 text-sm hover:border-ink">
              CSV 내보내기
            </button>
          )}
          {!def.readonly && (
            <Link
              href={`/admin/${params.resource}/new`}
              className="bg-ink px-4 py-2 text-sm text-accent-ink"
            >
              + 새로 만들기
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 border border-line bg-surface">
        {rows === null ? (
          <p className="p-4 text-sm text-ink-faint">불러오는 중…</p>
        ) : rows.length === 0 ? (
          <p className="p-4 text-sm text-ink-faint">아직 항목이 없습니다.</p>
        ) : isSubmission ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-2">이름</th>
                <th className="px-4 py-2">연락처</th>
                {def.table === 'rsvp_submissions' && <th className="px-4 py-2">이벤트</th>}
                {def.table === 'rsvp_submissions' && <th className="px-4 py-2">인원</th>}
                {def.table === 'waitlist_submissions' && <th className="px-4 py-2">취향 태그</th>}
                <th className="px-4 py-2">언어</th>
                <th className="px-4 py-2">제출일</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={String(r.id)} className="border-b border-line last:border-0">
                  <td className="px-4 py-2">{String(r.name ?? '')}</td>
                  <td className="px-4 py-2">{String(r.email ?? r.phone ?? '')}</td>
                  {def.table === 'rsvp_submissions' && (
                    <td className="px-4 py-2">{eventTitles.get(String(r.event_id)) ?? '—'}</td>
                  )}
                  {def.table === 'rsvp_submissions' && (
                    <td className="px-4 py-2">{String(r.party_size ?? '')}</td>
                  )}
                  {def.table === 'waitlist_submissions' && (
                    <td className="px-4 py-2 text-xs text-ink-soft">
                      {Array.isArray(r.preference_tags) ? (r.preference_tags as string[]).join(', ') : ''}
                    </td>
                  )}
                  <td className="px-4 py-2 text-xs">{String(r.locale ?? '')}</td>
                  <td className="px-4 py-2 text-xs text-ink-soft">
                    {String(r.created_at ?? '').slice(0, 10)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => remove(String(r.id))} className="text-xs text-red-700 underline">
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {rows.map((r) => (
                <tr key={String(r.id)} className="border-b border-line last:border-0">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/${params.resource}/${r.id}`} className="hover:underline">
                      {titleOf(r, def.titleField)}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-ink-soft">
                    {'status' in r ? statusLabel(String(r.status)) : ''}
                    {'is_visible' in r ? (r.is_visible ? '노출' : '숨김') : ''}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link href={`/admin/${params.resource}/${r.id}`} className="text-xs underline">
                      수정
                    </Link>
                    <button
                      onClick={() => remove(String(r.id))}
                      className="ms-3 text-xs text-red-700 underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    published: '공개',
    draft: '초안',
    current: '진행중',
    upcoming: '예정',
    hidden: '숨김',
  };
  return map[s] ?? s;
}
