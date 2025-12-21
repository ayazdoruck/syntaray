import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Feedback from "@/components/Feedback";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://syntaray.vercel.app'),
  title: {
    default: "SyntaRay | Create Beautiful Code Snippets",
    template: "%s | SyntaRay"
  },
  description: "Turn your code into beautiful images. SyntaRay is a minimalist code visualization tool with professional layout controls, syntax highlighting, and custom themes.",
  keywords: ["code snippets", "code visualization", "syntax highlighting", "developer tools", "code image generator", "carbon alternative", "syntaray"],
  authors: [{ name: "Ayaz Doruk", url: "https://github.com/ayazdoruck" }],
  creator: "Ayaz Doruk",
  publisher: "SyntaRay",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syntaray.vercel.app',
    title: 'SyntaRay | Create Beautiful Code Snippets',
    description: 'Turn your code into beautiful images instantly. Professional layout controls and 50+ themes.',
    siteName: 'SyntaRay',
    images: [
      {
        url: '/og-image.png', // Bunu daha sonra eklememiz gerekecek veya varsayılan bir resim kullanacağız
        width: 1200,
        height: 630,
        alt: 'SyntaRay Code Visualizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SyntaRay | Beautiful Code Snippets',
    description: 'Turn your code into beautiful images instantly.',
    creator: '@ayazdoruck',
    images: ['/og-image.png'], // Twitter için de aynı görsel
  },
  verification: {
    google: 'google803ea4830a188e10', // Meta tag ile doğrulama (dosya yöntemine ek olarak garanti olsun)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Fira+Code:wght@300..700&family=IBM+Plex+Mono:wght@400;500;600&family=Inconsolata:wght@200..900&family=JetBrains+Mono:wght@100..800&family=Source+Code+Pro:wght@200..900&display=swap" rel="stylesheet" crossOrigin="anonymous" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Feedback />
      </body>
    </html>
  );
}
