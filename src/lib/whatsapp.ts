// lib/whatsapp.ts

// Más adelante lo conectamos con Baileys vía phone.ts.
// Por ahora lo dejamos mockeado para que compile.

export async function sendWhatsAppMessage(to: string, body: string) {
  console.log("[MOCK WA] Enviando a", to, "=>", body);

  // Ejemplo real cuando lo conectemos:
  // import { getClient } from "./phone";
  // const sock = await getClient();
  // await sock.sendMessage(to, { text: body });
}
