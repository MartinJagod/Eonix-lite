// src/providers/whatsapp/index.ts
export interface WhatsAppProvider {
  sendText(input: { to: string; text: string }): Promise<void>;
  sendMedia?(input: { to: string; url: string; caption?: string }): Promise<void>;
}

// Stubs — puedes mejorar luego
import { baileysProvider } from './BaileysProvider';
import { twilioProvider }  from './TwilioProvider';

export function getWhatsAppProvider(): WhatsAppProvider {
  const provider = process.env.WHATSAPP_PROVIDER ?? 'baileys';
  return provider === 'twilio' ? twilioProvider : baileysProvider;
}
