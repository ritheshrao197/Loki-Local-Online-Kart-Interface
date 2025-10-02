import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';
import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SnackbarProvider } from 'notistack';

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
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider maxSnack={3}>
                {children}
              </SnackbarProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}