// src/providers/whatsapp/TwilioProvider.ts
import type { WhatsAppProvider } from '.';
export const twilioProvider: WhatsAppProvider = {
  async sendText({ to, text }) {
    console.log(`[Twilio] → ${to}: ${text}`);
    // aquí iría client.messages.create(...)
  }
};
