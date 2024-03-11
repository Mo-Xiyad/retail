import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import '../../styles/global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Praise Beam',
  description: 'PraiseBeam'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <html lang="en">
        <body
          style={{
            background: '#EDF2F9'
          }}
          className={`${inter.className} h-screen flex items-center justify-center`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
