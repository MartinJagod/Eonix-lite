import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason,
} from '@whiskeysockets/baileys';
import * as QR from 'qrcode';

let sockReady: ReturnType<typeof makeWASocket> | null = null;
let pendingQR: string | null = null;
let qrResolvers: ((qr: string | null) => void)[] = [];

export function getPendingQR() {
  return pendingQR;
}

// Nueva función que espera hasta tener un QR o confirmar conexión
export function waitForQR(timeout = 10000): Promise<string | null> {
  // Si ya está conectado, devolver null inmediatamente
  if (sockReady && !pendingQR) {
    return Promise.resolve(null);
  }
  
  // Si ya hay un QR pendiente, devolverlo
  if (pendingQR) {
    return Promise.resolve(pendingQR);
  }

  // Esperar a que se genere un QR o se conecte
  return new Promise((resolve) => {
    qrResolvers.push(resolve);
    
    setTimeout(() => {
      const idx = qrResolvers.indexOf(resolve);
      if (idx > -1) qrResolvers.splice(idx, 1);
      resolve(pendingQR);
    }, timeout);
  });
}

export async function initBaileys() {
  if (sockReady) return sockReady;

  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    browser: ['Chrome', 'Windows', '120.0'],
    printQRInTerminal: false
  });

  sock.ev.on('connection.update', async ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      pendingQR = await QR.toDataURL(qr);
      console.log('📱 QR generado');
      
      // Notificar a todos los que están esperando
      qrResolvers.forEach(resolve => resolve(pendingQR));
      qrResolvers = [];
    }
    
    if (connection === 'open') {
      pendingQR = null;
      console.log('✅ Baileys conectado');
      
      // Notificar que ya está conectado (sin QR)
      qrResolvers.forEach(resolve => resolve(null));
      qrResolvers = [];
    }
    
    if (
      connection === 'close' &&
      (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut
    ) {
      pendingQR = null;
      sockReady = null;
      await initBaileys().catch(console.error);
    }
  });

  sock.ev.on('creds.update', saveCreds);
  sockReady = sock;
  return sock;
}

export const baileysProvider = {
  async sendText({ to, text }: { to: string; text: string }) {
    const sock = await initBaileys();
    const jid = `${to.replace(/\D/g, '')}@s.whatsapp.net`;
    await sock.presenceSubscribe(jid).catch(() => {});
    await sock.sendMessage(jid, { text });
  }
};