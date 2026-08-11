import './globals.css';
import React from 'react';
import Navbar from '@/components/Navbar';
import AdContainer from '@/components/AdContainer';
import { generateSEOGeoContent } from '@/lib/seoGeoEngine';

const seo = generateSEOGeoContent();

export const metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords.join(', '),
  metadataBase: new URL('https://smartclinic-app.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: 'website',
    locale: 'ar_EG',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Trigger Database setup auto-migration in background if needed
  try {
    const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await fetch(`${host}/api/setup`, { cache: 'no-store' }).catch(() => {});
  } catch (e) {}

  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.jsonLdSchema) }}
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <AdContainer />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/60 py-8 text-center text-xs text-slate-400 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <span>SmartClinic &copy; 2026 - نظام إدارة العيادات والمراكز الطبية الاحترافي</span>
            </div>
            <div className="flex items-center gap-6">
              <span>تحديث SEO & GEO تلقائي يومياً</span>
              <span>دعم بوابات الدفع (PayPal, Paymob, LemonSqueezy, Fawry)</span>
              <span>14 يوماً فترة تجريبية مجانية</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
