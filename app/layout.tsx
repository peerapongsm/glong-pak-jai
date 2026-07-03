import './globals.css';
import type { ReactNode } from 'react';
import CrisisCard from './components/CrisisCard';
import RegisterSW from './components/RegisterSW';

export const metadata = {
  title: 'กล่องพักใจ',
  description: 'พักความกังวลไว้ก่อน ค่อยมาคิดทีหลัง',
  manifest: '/manifest.webmanifest',
};
export const viewport = { themeColor: '#5B9BB5' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <head>
        <script
          defer
          src="https://umami-host-peerapongsms-projects.vercel.app/script.js"
          data-website-id="3f09453d-0b39-443e-8845-5e65611cc58a"
        />
      </head>
      <body>
        {children}
        <CrisisCard />
        <RegisterSW />
      </body>
    </html>
  );
}
