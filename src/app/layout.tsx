import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const Toaster = React.lazy(() => import('@/components/ui/toaster').then(module => ({ default: module.Toaster })));


const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontInter.variable
        )}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Suspense fallback={null}>
              <Toaster />
            </Suspense>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}