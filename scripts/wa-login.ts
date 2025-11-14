import { initBaileys } from '@/providers/whatsapp/BaileysProvider';

await initBaileys();          // solo inicia, imprime QR
console.log('Escaneá el QR y dejá esta ventana abierta hasta que diga "connected".');
