'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import type { FieldDef } from '@/lib/admin/resources';
import type { Locale } from '@/lib/i18n';

const LOCALE_TABS: { code: Locale; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'عربي' },
];

const inputCls =
  'w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink';

/** Multilingual input with ko/en/ar tabs */
export function MLField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: Record<string, string> | null;
  onChange: (v: Record<string, string>) => void;
}) {
  const [tab, setTab] = useState<Locale>('ko');
  const v = value ?? {};
  const rows = field.type === 'mlmd' ? 14 : field.type === 'mltext' ? 3 : undefined;

  return (
    <div>
      <div className="mb-1 flex gap-1">
        {LOCALE_TABS.map((t) => (
          <button
            key={t.code}
            type="button"
            onClick={() => setTab(t.code)}
            className={`px-2 py-0.5 text-xs ${
              tab === t.code ? 'bg-ink text-accent-ink' : 'text-ink-soft hover:text-ink'
            } ${v[t.code] ? '' : 'opacity-60'}`}
          >
            {t.label}
            {v[t.code] ? '' : ' ·비어있음'}
          </button>
        ))}
      </div>
      {rows ? (
        <textarea
          rows={rows}
          dir={tab === 'ar' ? 'rtl' : 'ltr'}
          value={v[tab] ?? ''}
          onChange={(e) => onChange({ ...v, [tab]: e.target.value })}
          className={`${inputCls} font-mono text-[13px]`}
        />
      ) : (
        <input
          dir={tab === 'ar' ? 'rtl' : 'ltr'}
          value={v[tab] ?? ''}
          onChange={(e) => onChange({ ...v, [tab]: e.target.value })}
          className={inputCls}
        />
      )}
    </div>
  );
}

/** Image URL field with optional Supabase Storage upload */
export function ImageField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: err } = await supabaseBrowser.storage.from('media').upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
    });
    setUploading(false);
    if (err) {
      setError(`업로드 실패: ${err.message}`);
      return;
    }
    const { data } = supabaseBrowser.storage.from('media').getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 space-y-1">
        <input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="이미지 URL 또는 아래에서 업로드"
          className={inputCls}
        />
        <label className="inline-block cursor-pointer border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-ink">
          {uploading ? '업로드 중…' : '파일 업로드'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
        {error && <p className="text-xs text-red-700">{error}</p>}
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-20 w-28 border border-line object-cover" />
      )}
    </div>
  );
}

/** Renders one field by type */
export function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (field.type) {
    case 'ml':
    case 'mltext':
    case 'mlmd':
      return (
        <MLField
          field={field}
          value={value as Record<string, string> | null}
          onChange={onChange}
        />
      );
    case 'image':
      return <ImageField value={value as string | null} onChange={onChange} />;
    case 'bool':
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          {field.label}
        </label>
      );
    case 'number':
      return (
        <input
          type="number"
          value={value === null || value === undefined ? '' : String(value)}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          className={inputCls}
        />
      );
    case 'datetime': {
      // stored as ISO; edited as local datetime (Dubai time is the operating norm)
      const s = typeof value === 'string' && value ? value.slice(0, 16) : '';
      return (
        <input
          type="datetime-local"
          value={s}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          className={inputCls}
        />
      );
    }
    case 'tags':
      return (
        <input
          value={Array.isArray(value) ? (value as string[]).join(', ') : ''}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(',')
                .map((v) => v.trim())
                .filter(Boolean)
            )
          }
          placeholder="tag1, tag2"
          className={inputCls}
        />
      );
    case 'select':
      return (
        <select
          value={String(value ?? field.options?.[0]?.value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case 'json':
      return (
        <textarea
          rows={4}
          value={typeof value === 'string' ? value : JSON.stringify(value ?? [], null, 1)}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} font-mono text-xs`}
        />
      );
    default:
      return (
        <input
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          className={inputCls}
        />
      );
  }
}
