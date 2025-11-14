// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Eonix-Lite', description: 'WhatsApp campaigns' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
