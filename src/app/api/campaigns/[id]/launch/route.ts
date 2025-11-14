// src/app/api/campaigns/[id]/launch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getWhatsAppProvider } from '@/providers/whatsapp';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const campaignId = parseInt(id, 10);

  try {
    // 1. Obtener la campaña
    const campaign = db.campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    // 2. Obtener contactos
    const contacts = db.contacts.filter(c => c.campaignId === campaignId);
    if (!contacts.length) {
      return NextResponse.json({ error: 'No hay contactos' }, { status: 400 });
    }

    // 3. Obtener el provider de WhatsApp
    const whatsapp = getWhatsAppProvider();

    // 4. Enviar mensajes en background
    console.log(`🚀 Lanzando campaña ${campaignId} a ${contacts.length} contactos`);

    // IMPORTANTE: No uses await aquí para no bloquear la respuesta
    // Los mensajes se enviarán en segundo plano
    (async () => {
      for (const contact of contacts) {
        try {
          const message = `Hola ${contact.name}! 👋\n\n${campaign.description}\n\nPrecio: $${campaign.priceArs}`;
          
          console.log(`📤 Enviando a ${contact.name} (${contact.phone})`);
          
          await whatsapp.sendText({
            to: contact.phone,
            text: message
          });

          console.log(`✅ Enviado a ${contact.name}`);

          // Actualizar estado del contacto
          contact.status = 'sent';
          contact.sentAt = new Date().toISOString();

          // Delay entre mensajes (importante para evitar spam)
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          console.error(`❌ Error enviando a ${contact.name}:`, error);
          contact.status = 'failed';
        }
      }

      // Actualizar estado de la campaña
      campaign.status = 'completed';
      campaign.sentAt = new Date().toISOString();
      console.log(`✅ Campaña ${campaignId} completada`);
    })();

    // 5. Responder inmediatamente
    return NextResponse.json({ 
      ok: true, 
      message: 'Enviando mensajes en segundo plano',
      contacts: contacts.length 
    });

  } catch (error) {
    console.error('Error en launch:', error);
    return NextResponse.json({ 
      error: 'Error al lanzar campaña',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}