import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Press_Start_2P, Silkscreen } from 'next/font/google';
import './globals.css';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel-title',
  display: 'swap'
});

const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pixel-ui',
  display: 'swap'
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'XII TJKT 2 — Retro OS (Windows 98) Class Edition',
  description:
    'Landing page resmi kelas XII TJKT 2 bertema Retro OS Windows 98: profil kelas, wali kelas, 34 kartu anggota, dan galeri kenangan.',
  icons: {
    icon: '/logo-tjkt2.png',
    apple: '/logo-tjkt2.png'
  },
  openGraph: {
    title: 'XII TJKT 2 — Retro OS (Windows 98) Class Edition',
    description:
      'Satu Kabel, Satu Sinyal, Satu Guild Sampai Lulus! Jelajahi desktop Windows 98 kelas XII TJKT 2 beserta 34 profil anggota dan galeri kenangan.',
    type: 'website'
  }
};

export const viewport: Viewport = {
  themeColor: '#040b1a',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-fx="on"
      data-wallpaper="teal"
      className={`${pressStart.variable} ${silkscreen.variable} ${jakarta.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
