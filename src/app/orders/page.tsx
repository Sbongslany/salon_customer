'use client'
import Link from 'next/link'
import { useMyOrders } from '@/hooks/useApi'
import { useStore } from '@/store/store'
import { fmt } from '@/lib/api'
import { ShoppingBag, Package, ChevronRight, Truck } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'

const statusStyle: Record<string,string> = {
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  paid:       'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
}

export default function OrdersPage() {
  const { user } = useStore()
  const { data, isLoading } = useMyOrders()
  const orders: any[] = (data as any)?.orders ?? []

  if (!user) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-16">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4"><ShoppingBag size={22} className="text-ink-300"/></div>
        <h2 className="font-display font-bold text-xl text-ink-800 mb-2">Sign in to view orders</h2>
        <p className="text-ink-400 font-body text-sm mb-5">Track your beauty product orders here.</p>
        <Link href="/auth" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gold text-ink-900 font-body font-bold rounded-xl shadow-gold hover:brightness-110 transition-all">Sign In</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pb-24 pt-16">
      <div className="bg-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'radial-gradient(circle,#fff 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16 sm:pt-10 sm:pb-20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-px bg-gold"/>
            <span className="text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">Order History</span>
          </div>
          <h1 className="font-display font-bold text-cream" style={{fontSize:'clamp(1.75rem,5vw,3rem)'}}>My Orders</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({length:3}).map((_,i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-soft animate-pulse space-y-3">
                <div className="flex justify-between"><div className="h-5 bg-ink-100 rounded-full w-1/3"/><div className="h-5 bg-ink-100 rounded-full w-20"/></div>
                <div className="h-4 bg-ink-100 rounded-full w-1/2"/>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-soft">
            <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4"><Package size={22} className="text-ink-300"/></div>
            <h3 className="font-display font-bold text-lg text-ink-700 mb-2">No orders yet</h3>
            <p className="text-ink-400 font-body text-sm mb-5">Shop professional beauty products.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-ink-900 font-body font-bold rounded-xl shadow-gold text-sm">
              Browse Shop <ChevronRight size={14}/>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o:any) => (
              <div key={o._id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-ink-100/50">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[11px] text-ink-400 font-body">Order #{o._id?.slice(-8).toUpperCase()}</p>
                    <p className="text-[12px] text-ink-500 font-body mt-0.5">{format(new Date(o.createdAt),'d MMM yyyy')}</p>
                  </div>
                  <span className={clsx('shrink-0 text-[10px] sm:text-[11px] font-body font-semibold px-2.5 py-1 rounded-full border capitalize', statusStyle[o.status] ?? 'bg-ink-50 text-ink-500 border-ink-100')}>
                    {o.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {o.items?.slice(0,3).map((item:any, idx:number) => {
                    const prod = item.product
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-ink-50 flex items-center justify-center overflow-hidden shrink-0">
                          {prod?.images?.[0]?.url
                            ? <img src={prod.images[0].url} alt={prod.name} className="w-full h-full object-cover"/>
                            : <Package size={14} className="text-ink-300"/>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] sm:text-[13px] font-body font-medium text-ink-800 line-clamp-1">{prod?.name ?? 'Product'}</p>
                          <p className="text-[10px] sm:text-[11px] text-ink-400 font-body">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-body font-bold text-xs sm:text-sm text-ink-900 shrink-0">{fmt(item.priceAtTime ?? 0)}</span>
                      </div>
                    )
                  })}
                  {o.items?.length > 3 && <p className="text-[11px] text-ink-400 font-body">+{o.items.length - 3} more items</p>}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                  <div className="flex items-center gap-1.5 text-ink-400">
                    <Truck size={13}/><span className="text-[11px] sm:text-[12px] font-body">{o.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                  </div>
                  <span className="font-display font-bold text-base sm:text-lg text-ink-900">{fmt(o.totalAmount ?? 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
