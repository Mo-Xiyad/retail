import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../styles/global.css';
import './styles.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div vaul-drawer-wrapper="" className=" flex-col flex">
          <div className="flex-1 space-y-4 w-full mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}