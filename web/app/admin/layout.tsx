import type { Metadata } from 'next';
import { Marcellus, Noto_Sans_KR } from 'next/font/google';
import '../globals.css';
import AdminShell from '@/components/admin/AdminShell';

const marcellus = Marcellus({ weight: '400', subsets: ['latin'], variable: '--font-marcellus' });
const notoKr = Noto_Sans_KR({ subsets: ['latin'], variable: '--font-noto-kr' });

export const metadata: Metadata = {
  title: 'Bellinagrigia Admin',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${marcellus.variable} ${notoKr.variable} antialiased`}>
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
