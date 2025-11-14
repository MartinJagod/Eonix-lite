'use client';
import { useRef } from 'react';

interface Props {
  onUrl: (url: string) => void;
}

export default function ImageUploader({ onUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const json = await res.json();
    if (json.ok) onUrl(json.url);
    else alert('Error al subir');
  };

  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded file:border-0
        file:text-sm file:font-semibold
        file:bg-emerald-50 file:text-emerald-700
        hover:file:bg-emerald-100"
    />
  );
}
