'use client';

import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { RESOURCES } from '@/lib/admin/resources';
import ResourceForm from '@/components/admin/ResourceForm';
import LookbookImages from '@/components/admin/LookbookImages';

export default function ResourceEditPage() {
  const params = useParams<{ resource: string; id: string }>();
  const router = useRouter();
  const def = RESOURCES[params.resource];
  const isNew = params.id === 'new';
  const [initial, setInitial] = useState<Record<string, unknown> | null>(isNew ? {} : null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!def || isNew) return;
    supabaseBrowser
      .from(def.table)
      .select('*')
      .eq('id', params.id)
      .maybeSingle()
      .then(({ data }) => setInitial(data ?? {}));
  }, [def, isNew, params.id]);

  if (!def || def.readonly) notFound();

  async function save(values: Record<string, unknown>): Promise<string | null> {
    setSaving(true);
    // keep only configured fields (+id for update)
    const payload: Record<string, unknown> = {};
    for (const f of def.fields) {
      if (values[f.name] !== undefined) payload[f.name] = values[f.name];
    }
    let error;
    let newId: string | null = null;
    if (isNew) {
      const res = await supabaseBrowser.from(def.table).insert(payload).select('id').single();
      error = res.error;
      newId = (res.data?.id as string) ?? null;
    } else {
      const res = await supabaseBrowser.from(def.table).update(payload).eq('id', params.id);
      error = res.error;
    }
    setSaving(false);
    if (error) {
      if (error.code === '23505') return '이미 사용 중인 slug입니다.';
      return `저장 실패: ${error.message}`;
    }
    if (isNew && newId) {
      router.replace(`/admin/${params.resource}/${newId}`);
    }
    return null;
  }

  if (initial === null) {
    return <p className="text-sm text-ink-faint">불러오는 중…</p>;
  }

  return (
    <div>
      <Link href={`/admin/${params.resource}`} className="text-xs uppercase tracking-widest text-ink-faint hover:text-ink">
        ← {def.label} 목록
      </Link>
      <h1 className="mt-2 font-display text-2xl">
        {def.label} {isNew ? '만들기' : '수정'}
      </h1>
      <div className="mt-6">
        <ResourceForm fields={def.fields} initial={initial} onSave={save} saving={saving} />
      </div>
      {def.table === 'lookbooks' && !isNew && (
        <div className="mt-12 border-t border-line pt-8">
          <LookbookImages lookbookId={params.id} />
        </div>
      )}
    </div>
  );
}
