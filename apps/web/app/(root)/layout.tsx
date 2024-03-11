import '@repo/ui/src/styles.css';
import { ClientProviders } from '../../hooks/useProvider';
import '../../styles/global.css';
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
