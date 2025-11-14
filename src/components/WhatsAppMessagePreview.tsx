interface Props {
  name: string;
  description: string;
  price: number;
  flyerUrl?: string;
}

export default function WhatsAppMessagePreview({ name, description, price, flyerUrl }: Props) {
  return (
    <div className="border p-4 rounded space-y-2 bg-white">
      <p className="leading-6">
        <span className="font-medium">Hola {name}!</span> {description}{' '}
        <span className="font-semibold">Precio: ${price}</span>. ¿Te interesa?
      </p>
      {flyerUrl && (
        <img
          src={flyerUrl}
          alt="flyer"
          className="w-full max-h-60 object-contain rounded border"
        />
      )}
    </div>
  );
}
