'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

interface Stats {
  waitlistTotal: number;
  waitlistWeek: number;
  rsvpTotal: number;
  events7d: { event_name: string; count: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
      const [wl, wlWeek, rsvp, events] = await Promise.all([
        supabaseBrowser.from('waitlist_submissions').select('id', { count: 'exact', head: true }),
        supabaseBrowser
          .from('waitlist_submissions')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', weekAgo),
        supabaseBrowser.from('rsvp_submissions').select('id', { count: 'exact', head: true }),
        supabaseBrowser
          .from('analytics_events')
          .select('event_name')
          .gte('created_at', weekAgo)
          .limit(5000),
      ]);
      const counts = new Map<string, number>();
      for (const row of events.data ?? []) {
        counts.set(row.event_name, (counts.get(row.event_name) ?? 0) + 1);
      }
      setStats({
        waitlistTotal: wl.count ?? 0,
        waitlistWeek: wlWeek.count ?? 0,
        rsvpTotal: rsvp.count ?? 0,
        events7d: [...counts.entries()]
          .map(([event_name, count]) => ({ event_name, count }))
          .sort((a, b) => b.count - a.count),
      });
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl">대시보드</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="대기명단 (전체)" value={stats?.waitlistTotal} href="/admin/waitlist" />
        <StatCard label="대기명단 (최근 7일)" value={stats?.waitlistWeek} href="/admin/waitlist" />
        <StatCard label="RSVP 신청 (전체)" value={stats?.rsvpTotal} href="/admin/rsvps" />
      </div>

      <h2 className="mt-10 text-sm uppercase tracking-widest text-ink-soft">
        최근 7일 방문 이벤트
      </h2>
      <div className="mt-3 max-w-xl border border-line bg-surface">
        {stats === null ? (
          <p className="p-4 text-sm text-ink-faint">불러오는 중…</p>
        ) : stats.events7d.length === 0 ? (
          <p className="p-4 text-sm text-ink-faint">아직 수집된 이벤트가 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {stats.events7d.map((e) => (
                <tr key={e.event_name} className="border-b border-line last:border-0">
                  <td className="px-4 py-2 font-mono text-xs">{e.event_name}</td>
                  <td className="px-4 py-2 text-right">{e.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="mt-10 text-sm uppercase tracking-widest text-ink-soft">빠른 작업</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Quick href="/admin/articles/new" label="+ 새 아티클" />
        <Quick href="/admin/events/new" label="+ 새 이벤트" />
        <Quick href="/admin/lookbooks/new" label="+ 새 룩북" />
        <Quick href="/admin/content" label="사이트 문구 수정" />
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value?: number; href: string }) {
  return (
    <Link href={href} className="border border-line bg-surface p-5 hover:border-ink">
      <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl">{value ?? '—'}</p>
    </Link>
  );
}

function Quick({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="border border-line bg-surface px-4 py-2 text-sm hover:border-ink">
      {label}
    </Link>
  );
}
