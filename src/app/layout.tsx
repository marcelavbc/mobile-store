import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Mobile Store',
  description: 'Zara Challenge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
