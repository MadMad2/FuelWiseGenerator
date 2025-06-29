import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Калькулятор палива',
  description: 'Калькулятор палива для дизельних генераторів',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <footer className="text-center p-4 text-sm text-muted-foreground border-t mt-8 bg-card">
          <div className="container mx-auto flex justify-between items-center">
            <span>Розробив: Дмитро Олійник</span>
            <Link href="/source" className="underline hover:text-primary">
              Посмотреть код
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
