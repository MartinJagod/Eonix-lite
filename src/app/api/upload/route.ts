import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  /* 1. Lee multipart/form-data */
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ ok: false, error: 'No file' }, { status: 400 });

  /* 2. Convierte a ArrayBuffer → Buffer */
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  /* 3. Genera nombre único y path local */
  const id = randomUUID();
  const ext = file.name.split('.').pop() || 'png';
  const fileName = `${id}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  /* 4. Devuelve URL pública (sirviéndose desde /public) */
  const url = `/uploads/${fileName}`;
  return NextResponse.json({ ok: true, url });
}
