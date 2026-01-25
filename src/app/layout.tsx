import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout';
import { defaultLocale } from '../../i18n';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Mobile Store',
  description: 'Zara Challenge',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages({ locale: defaultLocale });

  return (
    <html lang={defaultLocale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={defaultLocale}>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
