'use client';
import { useRef, useState } from 'react';

interface Props {
  onUrl: (url: string) => void;   // recibe la URL devuelta por /api/upload
}

export default function ImageCaptureOrUpload({ onUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [capture, setCapture] = useState<'none' | 'camera'>('none');

  const handleSelect = (mode: 'camera' | 'file') => {
    setCapture(mode === 'camera' ? 'camera' : 'none');
    inputRef.current?.click();
  };

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
    <div className="space-y-2">
      {/* botones */}
      <div className="flex gap-2">
        <button
          type="button"
          className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
          onClick={() => handleSelect('file')}
        >
          Subir imagen
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded bg-emerald-500 text-white text-sm"
          onClick={() => handleSelect('camera')}
        >
          Tomar foto
        </button>
      </div>

      {/* input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture === 'camera' ? 'environment' : undefined}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
