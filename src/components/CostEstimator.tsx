interface Cost {
  platform: number;
  messaging: number;
  ai: number;
}

interface Props {
  contacts: number;
  unit: Cost;
}

export default function CostEstimator({ contacts, unit }: Props) {
  const subtotal = unit.platform + unit.messaging + unit.ai;
  const total = contacts * subtotal;

  return (
    <div className="border rounded p-4 space-y-1 text-sm bg-gray-50">
      <div>Contactos: <span className="font-medium">{contacts}</span></div>
      <div className="flex justify-between"><span>Plataforma</span><span>${unit.platform}</span></div>
      <div className="flex justify-between"><span>Mensajería</span><span>${unit.messaging}</span></div>
      {unit.ai > 0 && (
        <div className="flex justify-between"><span>IA</span><span>${unit.ai}</span></div>
      )}
      <hr className="my-2"/>
      <div className="flex justify-between font-semibold"><span>Total/contacto</span><span>${subtotal}</span></div>
      <div className="flex justify-between font-bold text-lg"><span>Total campaña</span><span>${total}</span></div>
    </div>
  );
}
