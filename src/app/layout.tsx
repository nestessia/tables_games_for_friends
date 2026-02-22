import type { Metadata, Viewport } from 'next';
import './styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Table Games for friends',
  description: 'Table Games for friends',
};

export default async function RootLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
            {props.children}
      </body>
    </html>
  );
}