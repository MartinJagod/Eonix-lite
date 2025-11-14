'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContactPicker from '@/components/ContactPicker';
import CostEstimator from '@/components/CostEstimator';
import FlyerPreview  from '@/components/FlyerPreview';
import ImageCaptureOrUpload from '@/components/ImageCaptureOrUpload';

type Contact = { id: number; name: string; phone: string };

export default function NewCampaignPage() {
  /* ──────────────── estado local ──────────────── */
  const [contacts] = useState<Contact[]>([
    { id: 1, name: 'Martin Jagodnik',  phone: '+5493516017342' },
    { id: 2, name: 'Gio Isorni', phone: '+5493515075340' },
    { id: 3, name: 'María López',phone: '+5493510000003' },
  ]);
  const [selected,   setSelected]   = useState<number[]>([]);
  const [title,      setTitle]      = useState('Venta de alfajores de maizena');
  const [description,setDescription]= useState('Estoy juntando para el viaje. ¿Me ayudás comprando una docena? ¡Son caseros!');
  const [price,      setPrice]      = useState(2000);
  const [imageUrl,   setImageUrl]   = useState<string | undefined>(undefined);
  const [loading,    setLoading]    = useState(false);

  /* ──────────────── constantes de costo ──────────────── */
  const baseCost         = Number(process.env.NEXT_PUBLIC_BASE_COST_PER_CONTACT ?? 300);
  const usdToArs         = Number(process.env.NEXT_PUBLIC_USD_TO_ARS ?? 1000);
  const llmUsdPerContact = 0.01;            // placeholder

  const router = useRouter();
  const count  = selected.length;

  /* ──────────────── handlers ──────────────── */
  const handleToggle = (id: number, checked: boolean) =>
    setSelected(prev => checked ? [...prev, id] : prev.filter(x => x !== id));

  const createCampaign = async () => {
    if (!count) return;
    setLoading(true);
    try {
      const body = {
        title,
        description,
        priceArs: price,
        contacts: contacts
          .filter(c => selected.includes(c.id))
          .map(c => ({ name: c.name, phone: c.phone }))
      };

      const res  = await fetch('/api/campaigns', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(body)
      });
      const json = await res.json();

      /* ─────── lanzar campaña ─────── */
      if (json.ok) {
        const { campaignId } = json;

        if (confirm('Campaña creada. ¿Lanzar mensajes ahora?')) {
          await fetch(`/api/campaigns/${campaignId}/launch`, { method: 'POST' });
          alert('Enviando mensajes en segundo plano 🚀');
        }

        router.push('/dashboard');
      } else {
        alert('Error al crear campaña');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red');
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────── render ──────────────── */
  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-6">
      {/* ─────── formulario ─────── */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Nueva campaña</h1>

        <input
          className="border p-2 w-full rounded bg-white text-gray-900"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título"
        />

        <textarea
          className="border p-2 w-full h-28 rounded bg-white text-gray-900"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descripción"
        />

        <input
          className="border p-2 w-full rounded"
          type="number"
          value={price}
          onChange={e => setPrice(parseInt(e.target.value, 10))}
          placeholder="Precio ARS"
        />

        <h2 className="font-semibold pt-2 text-gray-800">Contactos</h2>
        <ContactPicker contacts={contacts} selected={selected} onToggle={handleToggle} />

        <CostEstimator
          contacts={count}
          unit={{ platform: baseCost, messaging: 0, ai: Math.round(llmUsdPerContact * usdToArs) }}
        />

        <button
          onClick={createCampaign}
          disabled={!count || loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Creando…' : 'Crear campaña'}
        </button>
      </div>

      {/* ─────── preview flyer ─────── */}
      <div className="space-y-4">
        <h2 className="font-semibold">Flyer</h2>

        <ImageCaptureOrUpload onUrl={setImageUrl} />

        <FlyerPreview title={title} price={price} imageUrl={imageUrl} />
      </div>
    </div>
  );
}
