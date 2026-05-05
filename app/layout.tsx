import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amsita - Browser Agent',
  description: 'Agente de automatizacion de navegador con IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#0f0f0f] text-white min-h-screen">{children}</body>
    </html>
  );
}
