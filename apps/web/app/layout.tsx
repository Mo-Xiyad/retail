import '@repo/ui/src/styles.css';
import '../styles/global.css';
import { ClientProviders } from './useProvider';
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProviders>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClientProviders>
  );
}
