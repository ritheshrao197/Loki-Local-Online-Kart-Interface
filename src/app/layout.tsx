import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

const fontHeadline = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'Loki',
  description: 'Connecting local manufacturers with buyers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeadline.variable
        )}
        suppressHydrationWarning={true}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
