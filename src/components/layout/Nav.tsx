'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scissors, ShoppingBag, User, Calendar, Package, LogOut, ChevronDown, X, Menu } from 'lucide-react'
import { useStore } from '@/store/store'
import clsx from 'clsx'

const LINKS = [
  { label:'Services', href:'/services' },
  { label:'Stylists',  href:'/stylists'  },
  { label:'Shop',      href:'/shop'      },
]

export default function Nav() {
  const pathname = usePathname()
  const { user, logout, cart } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const cartCount = cart.reduce((s,i) => s+i.quantity, 0)
  const isHome = pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, {passive:true}); fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdown(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => { setMenuOpen(false); setDropdown(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const solid = scrolled || !isHome || menuOpen

  return (
    <>
      <header className={clsx(
        'fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300',
        solid ? 'bg-ink-900/97 backdrop-blur-xl border-b border-white/6 shadow-2xl' : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shadow-gold">
              <Scissors size={14} className="text-ink-900" strokeWidth={2.5}/>
            </div>
            <span className="font-display font-bold text-base sm:text-lg text-cream">
              Luxe<span className="text-gold">Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {LINKS.map(n => (
              <Link key={n.href} href={n.href} className={clsx(
                'px-4 py-2 rounded-xl text-[13px] font-body font-medium transition-all',
                pathname.startsWith(n.href) ? 'text-gold bg-gold/10' : 'text-ink-300 hover:text-cream hover:bg-white/6'
              )}>{n.label}</Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Cart — visible on all sizes */}
            <Link href="/shop" className="relative p-2.5 rounded-xl text-ink-400 hover:text-cream hover:bg-white/6 transition-all w-11 h-11 flex items-center justify-center">
              <ShoppingBag size={18}/>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-0.5 bg-gold text-ink-900 text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Desktop user menu */}
            {user ? (
              <div className="relative hidden md:block" ref={dropRef}>
                <button onClick={() => setDropdown(v => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/6 transition-all h-11">
                  <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center overflow-hidden shrink-0">
                    {user.profileImage?.url
                      ? <img src={user.profileImage.url} alt="" className="w-full h-full object-cover"/>
                      : <span className="text-gold text-[11px] font-bold">{user.name[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <span className="hidden lg:block text-[13px] text-ink-200 font-body truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={12} className={clsx('text-ink-500 transition-transform', dropdown && 'rotate-180')}/>
                </button>
                {dropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-ink-800 border border-white/10 rounded-2xl shadow-2xl py-1.5 animate-scale-in z-10">
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-[12px] font-semibold text-cream truncate">{user.name}</p>
                      <p className="text-[11px] text-ink-500 truncate">{user.email}</p>
                    </div>
                    {[
                      { icon:User,     label:'Profile',  href:'/profile'  },
                      { icon:Calendar, label:'Bookings', href:'/bookings' },
                      { icon:Package,  label:'Orders',   href:'/orders'   },
                    ].map(({ icon:Icon, label, href }) => (
                      <Link key={href} href={href} onClick={() => setDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-ink-300 hover:text-cream hover:bg-white/5 transition-colors font-body">
                        <Icon size={14}/>{label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-white/8"/>
                    <button onClick={() => { setDropdown(false); logout() }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-400 hover:bg-red-500/8 transition-colors font-body">
                      <LogOut size={14}/>Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5">
                <Link href="/auth" className="px-4 py-2 text-[13px] font-body text-ink-300 hover:text-cream rounded-xl hover:bg-white/6 transition-all">Sign In</Link>
                <Link href="/auth?tab=register" className="px-4 py-2 text-[13px] font-body font-bold bg-gold text-ink-900 rounded-xl hover:brightness-110 transition-all shadow-gold">Join Free</Link>
              </div>
            )}

            {/* Mobile menu burger — hidden on md+ (bottom nav handles mobile nav) */}
            <button onClick={() => setMenuOpen(v => !v)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-ink-400 hover:text-cream hover:bg-white/6 transition-all">
              {menuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay menu */}
      <div className={clsx(
        'fixed inset-0 z-40 bg-ink-900 md:hidden flex flex-col pt-16 transition-transform duration-300',
        menuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      )}>
        <div className="flex-1 overflow-y-auto">
          {/* Big nav links */}
          <div className="px-6 pt-6 pb-4">
            {LINKS.map(n => (
              <Link key={n.href} href={n.href}
                className={clsx(
                  'flex items-center justify-between py-5 border-b border-white/6 font-display font-bold text-2xl transition-colors',
                  pathname.startsWith(n.href) ? 'text-gold' : 'text-cream'
                )}>
                {n.label}
                <ChevronDown size={16} className="-rotate-90 text-ink-600"/>
              </Link>
            ))}
          </div>

          {/* Auth block if not logged in */}
          {!user && (
            <div className="px-6 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth" className="py-4 text-center text-sm font-body text-cream border border-white/15 rounded-2xl">Sign In</Link>
                <Link href="/auth?tab=register" className="py-4 text-center text-sm font-body font-bold text-ink-900 bg-gold rounded-2xl shadow-gold">Join Free</Link>
              </div>
            </div>
          )}

          {/* User profile block */}
          {user && (
            <div className="px-6 pt-4 space-y-1">
              <div className="flex items-center gap-3 pb-4 border-b border-white/8 mb-2">
                <div className="w-11 h-11 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center overflow-hidden shrink-0">
                  {user.profileImage?.url
                    ? <img src={user.profileImage.url} alt="" className="w-full h-full object-cover"/>
                    : <span className="text-gold font-bold font-display text-lg">{user.name[0]?.toUpperCase()}</span>
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-cream font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-ink-500 text-xs truncate">{user.email}</p>
                </div>
              </div>
              {[
                { icon:User,     label:'My Profile', href:'/profile'  },
                { icon:Calendar, label:'Bookings',   href:'/bookings' },
                { icon:Package,  label:'Orders',     href:'/orders'   },
              ].map(({ icon:Icon, label, href }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 py-3.5 text-ink-300 font-body text-sm border-b border-white/5">
                  <Icon size={16}/>{label}
                </Link>
              ))}
              <button onClick={logout} className="flex items-center gap-3 py-3.5 text-red-400 font-body text-sm w-full">
                <LogOut size={16}/>Sign Out
              </button>
            </div>
          )}

          {/* Staff promo */}
          <div className="mx-6 mt-6 mb-8 p-5 rounded-2xl bg-gold/8 border border-gold/15">
            <p className="text-[11px] text-gold font-body font-semibold tracking-widest uppercase mb-1">For Professionals</p>
            <p className="text-sm text-ink-400 font-body mb-4">Manage bookings, sell products, grow your clientele.</p>
            <a href="http://localhost:3000/login" target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold text-ink-900 font-body font-bold rounded-xl text-sm">
              Staff Login
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
