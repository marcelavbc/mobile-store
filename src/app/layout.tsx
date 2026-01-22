import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Mobile Store",
  description: "Catálogo de teléfonos móviles - Zara Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
