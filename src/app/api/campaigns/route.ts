// src/app/api/campaigns/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type CreateCampaignBody = {
  title: string;
  description: string;
  priceArs: number;
  contacts: { name: string; phone: string }[];
};

export async function POST(req: NextRequest) {
  try {
    const body: CreateCampaignBody = await req.json();

    // Validaciones
    if (!body.title || !body.description || !body.priceArs) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (!body.contacts || body.contacts.length === 0) {
      return NextResponse.json(
        { error: 'Debe haber al menos un contacto' },
        { status: 400 }
      );
    }

    // Crear campaña
    const campaign = db.createCampaign({
      title: body.title,
      description: body.description,
      priceArs: body.priceArs,
    });

    // Agregar contactos
    for (const contact of body.contacts) {
      db.addContact(campaign.id, contact);
    }

    console.log(`✅ Campaña ${campaign.id} creada con ${body.contacts.length} contactos`);

    return NextResponse.json({
      ok: true,
      campaignId: campaign.id,
      contactsCount: body.contacts.length,
    });

  } catch (error) {
    console.error('Error creando campaña:', error);
    return NextResponse.json(
      { error: 'Error al crear campaña' },
      { status: 500 }
    );
  }
}

// GET para listar campañas
export async function GET() {
  return NextResponse.json({
    campaigns: db.campaigns,
    contacts: db.contacts,
  });
}