'use client'
import { useState, useEffect, useRef } from 'react'
import { X, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  clientSecret: string
  amount: number
  description: string
  onSuccess: () => void
}

declare global { interface Window { Stripe?: any } }

const fmt = (cents: number) =>
  new Intl.NumberFormat('en-ZA', { style:'currency', currency:'ZAR' }).format((cents ?? 0) / 100)

export default function PaymentModal({ open, onClose, clientSecret, amount, description, onSuccess }: PaymentModalProps) {
  const stripeRef   = useRef<any>(null)
  const cardRef     = useRef<any>(null)
  const mountedRef  = useRef(false)
  const prevOpenRef = useRef(false)

  const [cardReady, setCardReady] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [succeeded, setSucceeded] = useState(false)
  const [stripeErr, setStripeErr] = useState('')

  useEffect(() => {
    const wasOpen = prevOpenRef.current
    prevOpenRef.current = open

    if (open && !wasOpen) {
      setCardReady(false); setError(''); setSucceeded(false); setStripeErr(''); setLoading(false)

      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!key || key.includes('YOUR_STRIPE')) {
        setStripeErr('Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local')
        return
      }

      const init = async () => {
        if (!window.Stripe) {
          await new Promise<void>((res, rej) => {
            const s = document.createElement('script')
            s.src = 'https://js.stripe.com/v3/'
            s.onload = () => res()
            s.onerror = () => rej(new Error('Failed to load Stripe.js'))
            document.head.appendChild(s)
          })
        }
        stripeRef.current = window.Stripe(key)
        const elements = stripeRef.current.elements()
        cardRef.current = elements.create('card', {
          style: {
            base: { fontSize:'16px', color:'#0D0D0D', fontFamily:'DM Sans, sans-serif', '::placeholder':{ color:'#888' }, iconColor:'#C9A84C' },
            invalid: { color:'#ef4444', iconColor:'#ef4444' },
          },
        })
        await new Promise(r => setTimeout(r, 60))
        const el = document.getElementById('stripe-card-mount')
        if (el && !mountedRef.current) {
          cardRef.current.mount('#stripe-card-mount')
          mountedRef.current = true
          cardRef.current.on('ready', () => setCardReady(true))
          cardRef.current.on('change', (e:any) => setError(e.error?.message ?? ''))
        }
      }
      init().catch(e => setStripeErr(e.message))
    }

    if (!open && wasOpen) {
      if (cardRef.current && mountedRef.current) {
        try { cardRef.current.destroy() } catch {}
        cardRef.current = null; mountedRef.current = false
      }
      setCardReady(false)
    }
  }, [open])

  const handlePay = async () => {
    if (!stripeRef.current || !cardRef.current) return
    setLoading(true); setError('')
    try {
      const { error: stripeError, paymentIntent } = await stripeRef.current.confirmCardPayment(
        clientSecret, { payment_method: { card: cardRef.current } }
      )
      if (stripeError) {
        setError(stripeError.message ?? 'Payment failed.')
      } else if (paymentIntent?.status === 'succeeded') {
        setSucceeded(true)
        setTimeout(() => { onSuccess(); onClose() }, 2000)
      }
    } catch (e:any) { setError(e.message ?? 'Unexpected error') }
    setLoading(false)
  }

  return (
    /* Always in DOM — hidden via pointer-events + opacity */
    <div className={clsx(
      'fixed inset-0 z-[60] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 transition-opacity duration-200',
      open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    )}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!loading ? onClose : undefined}/>

      {/* Sheet — slides up on mobile, scales in on desktop */}
      <div className={clsx(
        'relative bg-white w-full sm:max-w-md sm:rounded-3xl shadow-2xl overflow-hidden',
        'rounded-t-3xl sm:rounded-3xl',
        open ? 'animate-sheet-up sm:animate-scale-in' : ''
      )}>
        {/* Pull handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-ink-200 rounded-full"/>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-ink-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
              <Lock size={16} className="text-gold"/>
            </div>
            <div>
              <h2 className="font-display font-bold text-ink-900 text-base sm:text-lg">Secure Payment</h2>
              <p className="text-[10px] sm:text-[11px] text-ink-400 font-body">256-bit SSL encrypted</p>
            </div>
          </div>
          {!loading && (
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center hover:bg-ink-200 transition-colors">
              <X size={15}/>
            </button>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {succeeded ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600"/>
              </div>
              <h3 className="font-display font-bold text-xl text-ink-900 mb-2">Payment Successful!</h3>
              <p className="text-sm text-ink-400 font-body">Redirecting you now…</p>
            </div>

          ) : stripeErr ? (
            <div className="py-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5"/>
                <div>
                  <p className="font-body font-semibold text-red-700 text-sm mb-1">Stripe not configured</p>
                  <p className="font-body text-red-600 text-xs leading-relaxed">{stripeErr}</p>
                </div>
              </div>
            </div>

          ) : (
            <>
              {/* Summary */}
              <div className="bg-ink-50 rounded-2xl p-4 mb-5">
                <p className="text-[10px] sm:text-[11px] font-body text-ink-400 uppercase tracking-widest mb-1">Paying for</p>
                <p className="font-body font-semibold text-ink-900 text-sm mb-1 line-clamp-1">{description}</p>
                <p className="font-display font-bold text-2xl text-ink-900">{fmt(amount)}</p>
              </div>

              {/* Card field */}
              <div className="mb-5">
                <label className="block text-[11px] font-body font-semibold text-ink-400 uppercase tracking-widest mb-2">Card Details</label>
                {!cardReady && !stripeErr && (
                  <div className="flex items-center gap-3 px-4 py-[14px] border border-ink-200 rounded-2xl bg-white mb-0">
                    <div className="h-4 bg-ink-100 rounded animate-pulse w-8"/>
                    <div className="h-4 bg-ink-100 rounded animate-pulse flex-1"/>
                    <div className="h-4 bg-ink-100 rounded animate-pulse w-14"/>
                    <div className="h-4 bg-ink-100 rounded animate-pulse w-8"/>
                  </div>
                )}
                <div id="stripe-card-mount"
                  className={clsx('w-full px-4 py-[14px] border rounded-2xl transition-colors',
                    !cardReady ? 'hidden' : 'block',
                    error ? 'border-red-300 bg-red-50/20' : 'border-ink-200 bg-white'
                  )}
                />
                <p className="text-[11px] text-ink-400 font-body mt-2 flex items-center gap-1">
                  <Lock size={9}/> Test: 4242 4242 4242 4242 · any future date · any CVC
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                  <AlertCircle size={13} className="text-red-500 shrink-0"/>
                  <p className="text-xs text-red-600 font-body">{error}</p>
                </div>
              )}

              <button onClick={handlePay} disabled={loading || !cardReady}
                className="w-full py-4 bg-gold text-ink-900 font-body font-bold text-base rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold disabled:opacity-50 flex items-center justify-center gap-2 min-h-[56px]">
                <CreditCard size={18}/>
                {loading ? 'Processing…' : !cardReady ? 'Loading…' : `Pay ${fmt(amount)}`}
              </button>
              <p className="text-center text-[11px] text-ink-400 font-body mt-3">Powered by Stripe · Never stored</p>
            </>
          )}
        </div>

        {/* Extra bottom padding on mobile for safe area */}
        <div className="sm:hidden" style={{paddingBottom:'env(safe-area-inset-bottom)'}}/>
      </div>
    </div>
  )
}
