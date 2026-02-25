import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'

const syne   = Syne({ subsets:['latin'], variable:'--font-syne',    weight:['400','600','700','800'] })
const dmSans = DM_Sans({ subsets:['latin'], variable:'--font-dm-sans', weight:['300','400','500','600'] })

export const metadata: Metadata = {
  title: 'LuxeStudio — Premium Salon & Beauty',
  description: 'Book expert stylists, shop premium beauty products.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0D0D0D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-body bg-cream text-ink-900 antialiased" suppressHydrationWarning>
        <Providers>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  )
}
