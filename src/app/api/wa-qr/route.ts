import { NextResponse } from 'next/server';
import { initBaileys, getPendingQR } from '@/providers/whatsapp/BaileysProvider';

export async function GET() {
  await initBaileys();                   // asegura que Baileys corre
  const qr = getPendingQR();             // devuelve string | null
  return NextResponse.json({ qr });      // { qr: "data:image/png;base64,..." }
}
