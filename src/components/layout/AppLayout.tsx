'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStore } from '@/store/store'
import { useUnreadCount, useCart } from '@/hooks/useApi'
import {
  Home, Scissors, ShoppingBag, Calendar, MessageCircle,
  User, LogOut, Menu, X, ShoppingCart, Bell, Star,
  FileText, Tag, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const NAV = [
  { href: '/home',       label: 'Home',       icon: Home },
  { href: '/services',   label: 'Services',   icon: Scissors },
  { href: '/shop',       label: 'Shop',       icon: ShoppingBag },
  { href: '/bookings',   label: 'Bookings',   icon: Calendar },
  { href: '/messages',   label: 'Messages',   icon: MessageCircle },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useStore()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const { data: unread } = useUnreadCount()
  const { data: cart } = useCart()
  const cartCount = (cart as any)?.items?.length ?? 0
  const unreadCount = (unread as any)?.unreadCount ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/home" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Scissors size={15} className="text-white" />
              </div>
              <span className="font-bold text-lg text-dark-900 hidden sm:block">
                Salon<span className="text-brand-500">Pro</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link key={href} href={href} className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all relative',
                    active ? 'bg-brand-50 text-brand-600' : 'text-dark-500 hover:bg-gray-100 hover:text-dark-800'
                  )}>
                    <Icon size={16} />
                    {label}
                    {href === '/messages' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-xl text-dark-500 hover:bg-gray-100 transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {user?.profileImage?.url ? (
                    <img src={user.profileImage.url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 text-xs font-bold flex items-center justify-center">
                      {user?.name?.[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium text-dark-700 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={clsx('text-dark-400 transition-transform', profileOpen && 'rotate-180')} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-20 animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-dark-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      {[
                        { href: '/profile',    icon: User,      label: 'My Profile' },
                        { href: '/orders',     icon: ShoppingBag, label: 'My Orders' },
                        { href: '/bookings',   icon: Calendar,  label: 'My Bookings' },
                        { href: '/promotions', icon: Tag,       label: 'Promotions' },
                        { href: '/reports',    icon: FileText,  label: 'Reports' },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link key={href} href={href} onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 hover:bg-gray-50 hover:text-dark-900 transition-colors"
                        >
                          <Icon size={15} className="text-gray-400" />
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1">
                        <button onClick={() => { setProfileOpen(false); logout() }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl text-dark-500 hover:bg-gray-100">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white py-2 px-4">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className={clsx('flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium my-0.5 transition-colors relative',
                  pathname === href || pathname.startsWith(href + '/') ? 'bg-brand-50 text-brand-600' : 'text-dark-600 hover:bg-gray-100'
                )}
              >
                <Icon size={18} />
                {label}
                {href === '/messages' && unreadCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-dark-600 hover:bg-gray-100"><User size={18} />Profile</Link>
              <Link href="/orders"  onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-dark-600 hover:bg-gray-100"><ShoppingBag size={18} />My Orders</Link>
              <Link href="/reports" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-dark-600 hover:bg-gray-100"><FileText size={18} />Reports</Link>
              <button onClick={() => logout()} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full"><LogOut size={18} />Sign Out</button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
