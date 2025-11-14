// src/services/llm/generateFirstMessage.ts
import { openai } from "@/lib/openai";

type GenerateParams = {
  campaign: {
    title: string;
    baseMessage: string;
    price: number;
  };
  contact: {
    name: string | null;
  };
};

export async function generateIaMessageForContact({
  campaign,
  contact,
}: GenerateParams) {
  const nombre = contact.name ?? "hola";

  const systemPrompt = `
Sos un vendedor cercano y respetuoso.
Tu objetivo es ofrecer un producto de forma amable, breve y conversada, NO como un folleto.
Respondé en español neutro, tono WhatsApp, con 2–4 oraciones máximo.
No uses mayúsculas exageradas ni emojis en exceso (máx. 2).
Siempre incluí el precio de forma clara.
Si el cliente dice que no puede ahora, agradecés igual y dejás la puerta abierta.
  `;

  const userPrompt = `
Quiero enviarle un mensaje a ${nombre} para ofrecerle:

Título de la campaña: "${campaign.title}"
Mensaje base: "${campaign.baseMessage}"
Precio: $${campaign.price}

Armá un solo mensaje de WhatsApp como si yo le estuviera hablando directamente a esta persona.
No pidas datos personales, solo ofrecé el producto y contá brevemente que me ayuda con mi objetivo.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini", // o el modelo que uses
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0].message?.content?.trim() ?? "";
}
