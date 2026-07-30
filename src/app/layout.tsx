import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/components/providers/ThemeProvider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GearUp',
    template: '%s | GearUp',
  },
  description:
    'Rent professional gear from trusted providers and get the equipment you need for your next project.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={spaceGrotesk.variable}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}