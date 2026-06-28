import type { ReactNode } from 'react';

export const metadata = {
  title: 'กล่องพักใจ',
  description: 'พักความกังวลไว้ก่อน ค่อยมาคิดทีหลัง',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
