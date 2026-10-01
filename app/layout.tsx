import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokémon Advent Calendar",
  description: "Calendario de adviento Pokémon personalizado para Iván y María",
  icons: {
    icon: [
      { url: '/arca-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/arca-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/arca-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}