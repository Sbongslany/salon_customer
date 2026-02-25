'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Scissors, Users, ShoppingBag, User } from 'lucide-react'
import { useStore } from '@/store/store'
import clsx from 'clsx'

const ITEMS = [
  { href:'/',          icon:Home,       label:'Home'     },
  { href:'/services',  icon:Scissors,   label:'Services' },
  { href:'/stylists',  icon:Users,      label:'Stylists' },
  { href:'/shop',      icon:ShoppingBag,label:'Shop'     },
  { href:'/profile',   icon:User,       label:'Profile'  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { cart } = useStore()
  const cartCount = cart.reduce((s,i) => s + i.quantity, 0)

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-ink-900/97 backdrop-blur-xl border-t border-white/8"
      style={{ paddingBottom:'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center">
        {ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          const isShop = href === '/shop'
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative transition-colors',
                active ? 'text-gold' : 'text-ink-500'
              )}>
              <span className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8}/>
                {isShop && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 bg-gold text-ink-900 text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </span>
              <span className={clsx('text-[10px] font-body font-medium', active ? 'text-gold' : 'text-ink-600')}>
                {label}
              </span>
              {active && <span className="absolute top-0 inset-x-0 h-0.5 bg-gold rounded-b-full"/>}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
