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
    default: "SyntaRay - Create Beautiful Code Snippets & Screenshots",
    template: "%s | SyntaRay"
  },
  description: "Transform your code into stunning visual presentations with SyntaRay. Professional code screenshot generator with 50+ themes, syntax highlighting, and customizable layouts. Perfect for documentation, social media, and portfolios.",
  keywords: [
    "code snippets",
    "code screenshot",
    "code visualization",
    "syntax highlighting",
    "developer tools",
    "code image generator",
    "carbon alternative",
    "ray.so alternative",
    "code beautifier",
    "programming screenshots",
    "syntaray",
    "code to image",
    "monokai theme",
    "code presentation",
    "github readme images"
  ],
  authors: [{ name: "Ayaz Doruk", url: "https://github.com/ayazdoruck" }],
  creator: "Ayaz Doruk",
  publisher: "SyntaRay",
  applicationName: "SyntaRay",
  category: "Developer Tools",
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
    title: 'SyntaRay - Create Beautiful Code Snippets & Screenshots',
    description: 'Transform your code into stunning visual presentations. 50+ themes, professional layouts, instant export.',
    siteName: 'SyntaRay',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SyntaRay - Beautiful Code Screenshot Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SyntaRay - Beautiful Code Screenshots',
    description: 'Transform your code into stunning visuals. 50+ themes, professional layouts.',
    creator: '@ayazdoruck',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google803ea4830a188e10',
  },
  alternates: {
    canonical: 'https://syntaray.vercel.app',
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
