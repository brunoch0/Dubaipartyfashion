'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { ImageField, MLField } from './fields';
import type { LookbookImage } from '@/lib/types';

/** Image manager for one lookbook: add by upload/URL, caption, reorder, delete. */
export default function LookbookImages({ lookbookId }: { lookbookId: string }) {
  const [images, setImages] = useState<LookbookImage[]>([]);
  const [newUrl, setNewUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabaseBrowser
      .from('lookbook_images')
      .select('*')
      .eq('lookbook_id', lookbookId)
      .order('sort');
    setImages((data as LookbookImage[]) ?? []);
  }, [lookbookId]);

  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    if (!newUrl) return;
    const maxSort = images.reduce((m, i) => Math.max(m, i.sort), 0);
    const { error } = await supabaseBrowser.from('lookbook_images').insert({
      lookbook_id: lookbookId,
      image_url: newUrl,
      sort: maxSort + 1,
    });
    if (error) alert(`추가 실패: ${error.message}`);
    setNewUrl(null);
    load();
  }

  async function update(id: string, patch: Partial<LookbookImage>) {
    await supabaseBrowser.from('lookbook_images').update(patch).eq('id', id);
    load();
  }

  async function remove(id: string) {
    if (!confirm('이미지를 삭제할까요?')) return;
    await supabaseBrowser.from('lookbook_images').delete().eq('id', id);
    load();
  }

  async function move(index: number, delta: number) {
    const target = images[index];
    const swap = images[index + delta];
    if (!target || !swap) return;
    await Promise.all([
      supabaseBrowser.from('lookbook_images').update({ sort: swap.sort }).eq('id', target.id),
      supabaseBrowser.from('lookbook_images').update({ sort: target.sort }).eq('id', swap.id),
    ]);
    load();
  }

  return (
    <div>
      <h2 className="font-display text-xl">룩북 이미지 ({images.length})</h2>

      <div className="mt-4 max-w-xl border border-line bg-surface p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">이미지 추가</p>
        <ImageField value={newUrl} onChange={setNewUrl} />
        <button
          onClick={add}
          disabled={!newUrl}
          className="mt-3 bg-ink px-5 py-2 text-sm text-accent-ink disabled:opacity-40"
        >
          추가
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {images.map((img, i) => (
          <div key={img.id} className="flex gap-4 border border-line bg-surface p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.image_url} alt="" className="h-28 w-20 border border-line object-cover" />
            <div className="flex-1">
              <MLField
                field={{ name: 'caption', label: '캡션', type: 'ml' }}
                value={img.caption as Record<string, string> | null}
                onChange={(v) => update(img.id, { caption: v })}
              />
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="border border-line px-2 py-1 disabled:opacity-30">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === images.length - 1} className="border border-line px-2 py-1 disabled:opacity-30">↓</button>
              <button onClick={() => remove(img.id)} className="mt-2 text-red-700 underline">삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
