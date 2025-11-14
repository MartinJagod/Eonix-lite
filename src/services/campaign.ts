// src/services/campaign.ts
import { prisma } from '@/lib/db';
import { getWhatsAppProvider } from '@/providers/whatsapp';
import { jidNormalizedUser } from '@whiskeysockets/baileys';  // helper oficial

export async function sendCampaign(campaignId: number) {
  const provider = getWhatsAppProvider();

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { recipients: { include: { contact: true } } }
  });
  if (!campaign) return;

  for (const r of campaign.recipients) {
      const jid = jidNormalizedUser(r.contact.phoneE164 ?? r.contact.phone); // "+549..." → "549...@s.whatsapp.net"

    try {
    await provider.sendText({ to: jid, text: msg });
    await prisma.campaignContact.update({ where: { id: r.id }, data: { state: 'SENT' } });
  } catch (err: any) {
    await prisma.campaignContact.update({ where: { id: r.id }, data: {
      state: 'FAILED',
      lastError: err?.message ?? 'err'
    }});
  }
  await new Promise(r => setTimeout(r, 1500));
}
}