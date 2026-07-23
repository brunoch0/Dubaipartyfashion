'use client';

import { useState } from 'react';
import type { FieldDef } from '@/lib/admin/resources';
import { Field } from './fields';

/** Generic form over a record. Parent handles persistence. */
export default function ResourceForm({
  fields,
  initial,
  onSave,
  saving,
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  onSave: (values: Record<string, unknown>) => Promise<string | null>; // returns error msg or null
  saving: boolean;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  function set(name: string, v: unknown) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    // minimal validation
    for (const f of fields) {
      if (!f.required) continue;
      const v = values[f.name];
      const empty =
        v === null ||
        v === undefined ||
        v === '' ||
        (typeof v === 'object' && v !== null && Object.values(v).every((x) => !x));
      if (empty) {
        setMessage({ kind: 'err', text: `"${f.label}" 은(는) 필수 항목입니다.` });
        return;
      }
    }
    // parse json fields typed as string
    const payload = { ...values };
    for (const f of fields) {
      if (f.type === 'json' && typeof payload[f.name] === 'string') {
        try {
          payload[f.name] = JSON.parse(payload[f.name] as string);
        } catch {
          setMessage({ kind: 'err', text: `"${f.label}" JSON 형식이 올바르지 않습니다.` });
          return;
        }
      }
    }
    const err = await onSave(payload);
    setMessage(err ? { kind: 'err', text: err } : { kind: 'ok', text: '저장되었습니다.' });
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      {fields.map((f) => (
        <div key={f.name}>
          {f.type !== 'bool' && (
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
              {f.label}
              {f.required && ' *'}
            </label>
          )}
          <Field field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
          {f.hint && <p className="mt-1 text-xs text-ink-faint">{f.hint}</p>}
        </div>
      ))}
      <div className="flex items-center gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={saving}
          className="bg-ink px-8 py-2.5 text-sm uppercase tracking-widest text-accent-ink disabled:opacity-50"
        >
          {saving ? '저장 중…' : '저장'}
        </button>
        {message && (
          <p className={`text-sm ${message.kind === 'ok' ? 'text-green-700' : 'text-red-700'}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
