// src/app/api/campaigns/[id]/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma"; // asumiendo que ya tenés este helper
import { sendWhatsAppMessage } from "@/lib/whatsapp"; // wrapper alrededor de Baileys

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const campaignId = Number(params.id);

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      contacts: true, // o la relación que tengas
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const results: any[] = [];

  for (const contact of campaign.contacts) {
    const msg = await generateIaMessageForContact({ campaign, contact });

    // mandar por WhatsApp
    const waResult = await sendWhatsAppMessage({
      to: contact.phone,
      text: msg,
      imageUrl: campaign.imageUrl ?? undefined,
    });

    // guardar log
    await prisma.messageLog.create({
      data: {
        campaignId,
        contactId: contact.id,
        message: msg,
        status: waResult.ok ? "SENT" : "ERROR",
      },
    });

    results.push({ contactId: contact.id, ok: waResult.ok });
  }

  return NextResponse.json({ ok: true, results });
}
