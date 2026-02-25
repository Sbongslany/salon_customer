'use client'
import { useState } from 'react'
import { useProducts, useCart, useAddToCart, useUpdateCart, useRemoveFromCart, useCheckout } from '@/hooks/useApi'
import { fmt } from '@/lib/api'
import { useStore } from '@/store/store'
import PaymentModal from '@/components/PaymentModal'
import { ShoppingBag, Search, Plus, Minus, Trash2, X, Package, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const CATS = ['All','Shampoo','Conditioner','Styling','Treatment','Skincare','Tools','Accessories','Other']
const BG   = ['bg-amber-50','bg-rose-50','bg-stone-50','bg-emerald-50','bg-blue-50','bg-purple-50']

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
      <div className="aspect-square bg-ink-100"/>
      <div className="p-3 space-y-2">
        <div className="h-3 bg-ink-100 rounded-full w-1/3"/>
        <div className="h-4 bg-ink-100 rounded-full w-2/3"/>
        <div className="h-9 bg-ink-100 rounded-xl w-full"/>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const { user }     = useStore()
  const [search, setSearch]     = useState('')
  const [cat, setCat]           = useState('All')
  const [cartOpen, setCartOpen] = useState(false)

  const [clientSecret, setClientSecret] = useState('')
  const [payAmount,    setPayAmount]    = useState(0)
  const [paymentOpen,  setPaymentOpen]  = useState(false)

  const { data, isLoading }              = useProducts({ ...(search ? { search } : {}), ...(cat !== 'All' ? { category: cat.toLowerCase() } : {}), limit: 24 })
  const { data: cartData, refetch }      = useCart()
  const addToCartMut  = useAddToCart()
  const updateCartMut = useUpdateCart()
  const removeCartMut = useRemoveFromCart()
  const checkoutMut   = useCheckout()

  const products: any[] = (data as any)?.products ?? []
  const items: any[]    = (cartData as any)?.items ?? []
  const subtotal  = items.reduce((a:number, i:any) => a + (i.priceAtTime ?? i.product?.discountPrice ?? i.product?.price ?? 0) * i.quantity, 0)
  const cartCount = items.reduce((a:number, i:any) => a + i.quantity, 0)
  const getQty = (pid: string) => items.find((i:any) => (i.product?._id ?? i.product) === pid)?.quantity ?? 0

  const handleAdd = async (productId: string) => {
    if (!user) { toast.error('Sign in to add to cart'); return }
    try { await addToCartMut.mutateAsync({ productId, quantity: 1 }); toast.success('Added to cart') }
    catch { toast.error('Failed to add') }
  }

  const handleQty = async (productId: string, delta: number) => {
    const cur = getQty(productId)
    if (cur + delta < 1) { try { await removeCartMut.mutateAsync(productId) } catch {} return }
    try { await updateCartMut.mutateAsync({ productId, quantity: cur + delta }) } catch {}
  }

  const handleCheckout = async () => {
    if (!user) { toast.error('Sign in to checkout'); return }
    try {
      const result = await checkoutMut.mutateAsync({}) as any
      setClientSecret(result.clientSecret)
      setPayAmount(result.totalAmount)
      setPaymentOpen(true)
    } catch (err: any) { toast.error(err?.response?.data?.message ?? 'Checkout failed') }
  }

  return (
    <div className="min-h-screen bg-cream pb-24 pt-16">
      {/* Dark header */}
      <div className="bg-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'radial-gradient(circle,#fff 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-16 sm:pt-10 sm:pb-20">
          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-px bg-gold"/>
                <span className="text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">The Edit</span>
              </div>
              <h1 className="font-display font-bold text-cream" style={{fontSize:'clamp(1.75rem,5vw,3.5rem)'}}>
                Beauty <em className="not-italic text-gold">Shop</em>
              </h1>
            </div>
            <button
              onClick={() => { if (!user) { toast.error('Sign in to view cart'); return } setCartOpen(true) }}
              className="relative flex items-center gap-2 px-4 py-3 bg-gold text-ink-900 font-body font-bold rounded-2xl hover:brightness-110 transition-all shadow-gold shrink-0 min-h-[44px]">
              <ShoppingBag size={17}/>
              <span className="hidden sm:block text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-ink-900 text-cream text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          </div>
          <div className="relative max-w-lg">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
              className="w-full pl-10 pr-4 py-3 bg-ink-800/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body text-sm focus:outline-none focus:border-gold/40 transition-all"
              style={{fontSize:'16px'}}/>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-6 sm:-mt-8">
        {/* Category chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={clsx('flex-shrink-0 px-3.5 py-2 rounded-full text-[13px] font-body font-medium transition-all min-h-[36px]',
                cat===c ? 'bg-ink-900 text-cream' : 'bg-white text-ink-500 border border-ink-200')}>
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {Array.from({length:8}).map((_,i) => <SkeletonCard key={i}/>)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package size={32} className="text-ink-200 mx-auto mb-4"/>
            <h3 className="font-display font-bold text-lg text-ink-700 mb-2">No products found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {products.map((p:any, i:number) => {
              const qty   = getQty(p._id)
              const price = p.discountPrice ?? p.price ?? 0
              return (
                <div key={p._id} className="group bg-white rounded-2xl overflow-hidden shadow-soft active:scale-[0.98] transition-all flex flex-col">
                  <div className={clsx('relative overflow-hidden aspect-square flex-shrink-0', !p.images?.[0]?.url && BG[i%6])}>
                    {p.images?.[0]?.url
                      ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                      : <div className="w-full h-full flex items-center justify-center"><Package size={28} className="text-ink-200"/></div>
                    }
                    {p.discountPrice!=null && <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">SALE</span>}
                  </div>
                  <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col">
                    <p className="text-[9px] sm:text-[10px] font-body text-ink-400 uppercase tracking-widest mb-1 capitalize">{p.category}</p>
                    <h3 className="font-display font-semibold text-ink-900 text-xs sm:text-sm leading-snug mb-2 line-clamp-2 flex-1">{p.name}</h3>
                    {p.discountPrice!=null
                      ? <div className="flex items-center gap-1 mb-2.5"><span className="font-bold text-xs sm:text-sm text-gold">{fmt(p.discountPrice)}</span><span className="text-[10px] text-ink-300 line-through">{fmt(p.price)}</span></div>
                      : <p className="font-bold text-xs sm:text-sm text-ink-900 mb-2.5">{fmt(price)}</p>
                    }
                    {qty > 0 ? (
                      <div className="flex items-center justify-between bg-ink-50 rounded-xl p-1">
                        <button onClick={() => handleQty(p._id, -1)} className="w-8 h-8 rounded-lg bg-white border border-ink-200 flex items-center justify-center active:scale-95"><Minus size={12}/></button>
                        <span className="font-body font-bold text-sm text-ink-900">{qty}</span>
                        <button onClick={() => handleQty(p._id, 1)} className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center active:scale-95"><Plus size={12} className="text-cream"/></button>
                      </div>
                    ) : (
                      <button onClick={() => handleAdd(p._id)}
                        className="w-full py-2.5 bg-ink-900 text-cream font-body font-semibold text-xs rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 min-h-[40px]">
                        <ShoppingBag size={12}/> Add
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cart drawer — full screen on mobile, right panel on desktop */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)}/>
          {/* Mobile: slide up from bottom. Desktop: slide in from right */}
          <div className="relative w-full sm:w-auto sm:max-w-sm sm:ml-auto bg-white shadow-2xl flex flex-col sm:animate-slide-right animate-sheet-up sm:h-full rounded-t-3xl sm:rounded-none mt-auto sm:mt-0 max-h-[90vh] sm:max-h-full">
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-ink-200 rounded-full"/>
            </div>
            <div className="flex items-center justify-between p-5 border-b border-ink-100">
              <div>
                <h2 className="font-display font-bold text-xl text-ink-900">Your Cart</h2>
                <p className="text-[12px] text-ink-400 font-body">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center"><X size={15}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag size={36} className="text-ink-200 mb-4"/>
                  <p className="font-display font-bold text-lg text-ink-700 mb-1">Cart is empty</p>
                  <p className="text-sm text-ink-400 font-body">Browse products above</p>
                </div>
              ) : items.map((item:any) => {
                const prod = item.product
                const pid  = prod?._id ?? item.product
                const name = prod?.name ?? 'Product'
                const img  = prod?.images?.[0]?.url
                const itemPrice = item.priceAtTime ?? prod?.discountPrice ?? prod?.price ?? 0
                return (
                  <div key={pid} className="flex gap-3 bg-ink-50 rounded-2xl p-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-ink-100">
                      {img ? <img src={img} alt={name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-ink-300"/></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-ink-900 line-clamp-1">{name}</p>
                      <p className="font-body text-xs text-ink-500 mt-0.5">{fmt(itemPrice)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleQty(pid, -1)} className="w-7 h-7 rounded-lg bg-white border border-ink-200 flex items-center justify-center active:scale-95"><Minus size={11}/></button>
                        <span className="text-sm font-bold font-body w-5 text-center">{item.quantity}</span>
                        <button onClick={() => handleQty(pid, 1)} className="w-7 h-7 rounded-lg bg-ink-900 flex items-center justify-center active:scale-95"><Plus size={11} className="text-cream"/></button>
                        <button onClick={() => removeCartMut.mutate(pid)} className="ml-auto text-ink-300 hover:text-red-400 transition-colors p-1"><Trash2 size={13}/></button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-ink-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm text-ink-500">Subtotal</span>
                  <span className="font-display font-bold text-lg text-ink-900">{fmt(subtotal)}</span>
                </div>
                <button onClick={handleCheckout} disabled={checkoutMut.isPending}
                  className="w-full py-4 bg-gold text-ink-900 font-body font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold disabled:opacity-60 flex items-center justify-center gap-2 text-base">
                  {checkoutMut.isPending ? 'Preparing…' : <><span>Pay {fmt(subtotal)}</span><ArrowRight size={15}/></>}
                </button>
                <p className="text-center text-[11px] text-ink-400 font-body mt-2">Secured by Stripe</p>
              </div>
            )}
          </div>
        </div>
      )}

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        clientSecret={clientSecret}
        amount={payAmount}
        description={`${cartCount} product${cartCount!==1?'s':''} from LuxeStudio Shop`}
        onSuccess={() => { refetch(); toast.success('Order placed! 🎉'); setCartOpen(false) }}
      />
    </div>
  )
}
