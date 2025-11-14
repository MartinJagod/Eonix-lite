// src/app/whatsapp/link/page.tsx
'use client';

import { useEffect, useState } from 'react';

type QrState = 'loading' | 'connected' | string; // string = dataURL

export default function WhatsAppLinkPage() {
  const [qrState, setQrState] = useState<QrState>('loading');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchQR = async () => {
      try {
        const res = await fetch('/api/wa-qr', { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        if (data.qr) {
          setQrState(data.qr as string);
          timer = setTimeout(fetchQR, 5000); // por si se renueva el QR
        } else {
          // si no hay qr, asumimos que está conectado
          setQrState('connected');
          // acá podrías dejar de hacer polling
        }
      } catch (e) {
        console.error('Error trayendo QR', e);
        // opcional: reintento
        timer = setTimeout(fetchQR, 5000);
      }
    };

    fetchQR();
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Vincular WhatsApp</h1>

      {qrState === 'loading' && (
        <p className="text-sm text-zinc-600">
          ⏳ Generando QR de WhatsApp...
        </p>
      )}

      {typeof qrState === 'string' && qrState !== 'loading' && qrState !== 'connected' && (
        <>
          <p>Escaneá este código con WhatsApp&nbsp;Web / Dispositivos vinculados:</p>
          <img src={qrState} alt="QR de WhatsApp" className="w-64 h-64 border rounded-lg shadow" />
        </>
      )}

      {qrState === 'connected' && (
        <p className="text-emerald-600">
          ✅ Dispositivo conectado — ya podés enviar campañas.
        </p>
      )}
    </main>
  );
}
