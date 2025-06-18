import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | FitMarket',
    default: 'FitMarket - Premium Gym Clothes',
  },
  description:
    'Discover premium gym clothes designed for performance and style. Shop the latest athletic wear collection at FitMarket.',
  keywords: [
    'gym clothes',
    'athletic wear',
    'fitness apparel',
    'performance clothing',
    'sportswear',
  ],
  authors: [{ name: 'FitMarket Team' }],
  creator: 'FitMarket',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fitmarket.com',
    title: 'FitMarket - Premium Gym Clothes',
    description:
      'Discover premium gym clothes designed for performance and style.',
    siteName: 'FitMarket',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitMarket - Premium Gym Clothes',
    description:
      'Discover premium gym clothes designed for performance and style.',
    creator: '@fitmarket',
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 