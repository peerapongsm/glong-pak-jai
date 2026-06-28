import './globals.css';
import type { ReactNode } from 'react';
import CrisisCard from './components/CrisisCard';

export const metadata = {
  title: 'กล่องพักใจ',
  description: 'พักความกังวลไว้ก่อน ค่อยมาคิดทีหลัง',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body>
        {children}
        <CrisisCard />
      </body>
    </html>
  );
}
