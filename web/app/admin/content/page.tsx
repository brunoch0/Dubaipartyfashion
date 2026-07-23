'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { CONTENT_SLOTS } from '@/lib/admin/resources';
import ResourceForm from '@/components/admin/ResourceForm';

/** Editor for site_content copy slots (hero, landing intro, about sections). */
export default function SiteContentPage() {
  const keys = Object.keys(CONTENT_SLOTS);
  const [active, setActive] = useState(keys[0]);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(null);
    supabaseBrowser
      .from('site_content')
      .select('data')
      .eq('key', active)
      .maybeSingle()
      .then(({ data: row }) => setData((row?.data as Record<string, unknown>) ?? {}));
  }, [active]);

  async function save(values: Record<string, unknown>): Promise<string | null> {
    setSaving(true);
    const { error } = await supabaseBrowser
      .from('site_content')
      .upsert({ key: active, data: values, updated_at: new Date().toISOString() });
    setSaving(false);
    return error ? `저장 실패: ${error.message}` : null;
  }

  const slot = CONTENT_SLOTS[active];

  return (
    <div>
      <h1 className="font-display text-2xl">사이트 문구</h1>
      <p className="mt-1 text-sm text-ink-soft">
        저장 후 1분 내 사이트에 반영됩니다.
      </p>

      <div className="mt-6 flex gap-1 overflow-x-auto">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={`whitespace-nowrap px-4 py-2 text-sm ${
              k === active ? 'bg-ink text-accent-ink' : 'bg-surface text-ink-soft hover:text-ink'
            }`}
          >
            {CONTENT_SLOTS[k].label}
          </button>
        ))}
      </div>

      <div className="mt-6 border border-line bg-surface p-6">
        {data === null ? (
          <p className="text-sm text-ink-faint">불러오는 중…</p>
        ) : (
          <ResourceForm
            key={active}
            fields={slot.fields}
            initial={data}
            onSave={save}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}
