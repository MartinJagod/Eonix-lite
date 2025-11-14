'use client';
import React, { useRef } from 'react';
import * as htmlToImage from 'html-to-image';

interface Props {
  title: string;
  price: number;
  imageUrl?: string;
  onImageReady?: (dataUrl: string) => void;
}

export default function FlyerPreview({ title, price, imageUrl, onImageReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current, { cacheBust: true });
    onImageReady?.(dataUrl);
  };

  return (
    <>
      <div
        ref={ref}
        className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow bg-white flex flex-col"
      >
        <h2 className="text-center text-2xl font-bold p-4">{title}</h2>
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          {imageUrl
            ? <img src={imageUrl} alt="producto" className="max-h-full" />
            : <span className="text-gray-400">Subí una imagen…</span>}
        </div>
        <p className="text-center text-xl font-semibold py-4">Precio: ${price}</p>
        <p className="text-xs text-gray-500 pb-2 text-center">Hecho con Eonix-Lite</p>
      </div>

      <button
        onClick={handleExport}
        className="mt-3 w-full rounded bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-sm"
      >
        Exportar a PNG
      </button>
    </>
  );
}
