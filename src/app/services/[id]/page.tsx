'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useService, useAvailableSlots, useCreateBooking, useCreateReview, useReviews } from '@/hooks/useApi'
import { useStore } from '@/store/store'
import { fmt } from '@/lib/api'
import PaymentModal from '@/components/PaymentModal'
import { Clock, Star, MapPin, Calendar, ChevronLeft, Scissors, X } from 'lucide-react'
import { format, addDays } from 'date-fns'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const DATES = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1))

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useStore()
  const id = params.id as string

  const { data: service, isLoading } = useService(id)
  const spId = typeof service?.servicePerson === 'object' ? (service.servicePerson as any)._id : service?.servicePerson
  const sp   = typeof service?.servicePerson === 'object' ? service.servicePerson as any : null
  const { data: reviewsData } = useReviews(spId ?? '')
  const reviews: any[] = (reviewsData as any)?.reviews ?? []

  const [bookingDate,      setBookingDate]      = useState('')
  const [bookingSlot,      setBookingSlot]       = useState('')
  const [bookingSlotLabel, setBookingSlotLabel]  = useState('')
  const [bookingType,      setBookingType]       = useState<'salon'|'home'>('salon')
  const [imgIdx,           setImgIdx]            = useState(0)
  const [showBookingSheet, setShowBookingSheet]  = useState(false)
  const [showReview,       setShowReview]        = useState(false)
  const [reviewRating,     setReviewRating]      = useState(5)
  const [reviewComment,    setReviewComment]     = useState('')
  const [submittingRev,    setSubmittingRev]     = useState(false)

  // Payment
  const [clientSecret, setClientSecret] = useState('')
  const [payAmount,    setPayAmount]    = useState(0)
  const [paymentOpen,  setPaymentOpen]  = useState(false)

  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(spId ?? '', bookingDate)
  const rawSlots: any[] = (slotsData as any)?.slots ?? []
  const slots = rawSlots.filter((s: any) => s.available !== false)
  const createBooking = useCreateBooking()
  const createReview  = useCreateReview()

  const price       = service?.basePrice ?? service?.price ?? 0
  const homeFee     = service?.homeServiceFee ?? 0
  const totalAmount = price + (bookingType === 'home' ? homeFee : 0)

  const handleBook = async () => {
    if (!user) { toast.error('Sign in to book'); router.push(`/auth?next=/services/${id}`); return }
    if (!bookingDate || !bookingSlot) { toast.error('Select a date and time'); return }
    try {
      const result = await createBooking.mutateAsync({
        servicePersonId: spId,
        serviceIds: [id],
        bookingDate: bookingSlot,
        bookingType,
      })
      const { booking, clientSecret: cs } = result as any
      setClientSecret(cs)
      setPayAmount(booking.totalAmount ?? totalAmount)
      setShowBookingSheet(false)
      setPaymentOpen(true)
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Could not create booking')
    }
  }

  const handleReview = async () => {
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return }
    setSubmittingRev(true)
    try {
      await createReview.mutateAsync({ servicePersonId: spId, bookingId: '', rating: reviewRating, comment: reviewComment })
      toast.success('Review submitted!')
      setShowReview(false); setReviewComment('')
    } catch (e: any) { toast.error(e?.response?.data?.message ?? 'Failed') }
    setSubmittingRev(false)
  }

  if (isLoading) return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="h-64 sm:h-80 bg-ink-100 animate-pulse"/>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="h-8 bg-ink-100 rounded-xl animate-pulse w-2/3"/>
        <div className="h-4 bg-ink-100 rounded-xl animate-pulse w-1/3"/>
        <div className="h-32 bg-ink-100 rounded-2xl animate-pulse"/>
      </div>
    </div>
  )

  if (!service) return (
    <div className="min-h-screen bg-cream pt-16 flex items-center justify-center">
      <div className="text-center px-4">
        <Scissors size={40} className="text-ink-200 mx-auto mb-4"/>
        <h2 className="font-display font-bold text-xl text-ink-700 mb-4">Service not found</h2>
        <Link href="/services" className="text-gold font-body text-sm hover:underline">← Back to services</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pt-16 pb-32">
      {/* Hero image */}
      <div className="relative bg-ink-900 overflow-hidden" style={{height:'min(60vw,400px)'}}>
        {service.images?.length > 0 ? (
          <>
            <img src={service.images[imgIdx]?.url} alt={service.name} className="w-full h-full object-cover opacity-80"/>
            {service.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {service.images.map((_:any, i:number) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={clsx('h-1.5 rounded-full transition-all', i===imgIdx ? 'bg-white w-5' : 'bg-white/40 w-1.5')}/>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-950 to-amber-900">
            <Scissors size={56} className="text-ink-700"/>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent"/>
        <Link href="/services" className="absolute top-4 left-4 flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-body bg-black/30 backdrop-blur px-3 py-2 rounded-xl transition-colors">
          <ChevronLeft size={15}/> Services
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex gap-2 mb-2">
            <span className="bg-white/15 backdrop-blur text-cream text-[10px] font-body font-semibold px-2.5 py-1 rounded-full capitalize">{service.category}</span>
            {service.isHomeService && <span className="bg-gold text-ink-900 text-[10px] font-bold px-2.5 py-1 rounded-full">🏠 Home</span>}
          </div>
          <h1 className="font-display font-bold text-cream leading-tight" style={{fontSize:'clamp(1.4rem,4vw,2.5rem)'}}>{service.name}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-4">
        {/* Quick stats */}
        <div className="flex flex-wrap gap-2">
          {[
            { label:`${service.durationMinutes ?? 60} min`, icon: Clock },
            ...(reviews.length > 0 ? [{ label:`${(reviews.reduce((a:number,r:any)=>a+r.rating,0)/reviews.length).toFixed(1)} (${reviews.length})`, icon: Star }] : []),
            ...(sp?.salonAddress?.city ? [{ label: sp.salonAddress.city, icon: MapPin }] : []),
          ].map((s,i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-ink-100 shadow-soft">
              <s.icon size={13} className="text-gold"/><span className="font-body text-xs sm:text-sm text-ink-700">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        {service.description && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-ink-100/50">
            <h2 className="font-display font-bold text-ink-900 mb-2">About this service</h2>
            <p className="font-body text-sm text-ink-500 leading-relaxed">{service.description}</p>
          </div>
        )}

        {/* Stylist */}
        {sp && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-ink-100/50">
            <h2 className="font-display font-bold text-ink-900 mb-3">Your Stylist</h2>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gold/10 shrink-0 flex items-center justify-center">
                {sp.profileImage?.url
                  ? <img src={sp.profileImage.url} alt={sp.name} className="w-full h-full object-cover"/>
                  : <span className="font-display font-bold text-xl text-gold">{sp.name?.[0]}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-ink-900">{sp.name}</h3>
                {sp.specialization?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sp.specialization.slice(0,3).map((t:string) => (
                      <span key={t} className="text-[10px] font-body text-ink-500 bg-ink-50 border border-ink-100 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-ink-100/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-ink-900 flex items-center gap-1.5">
              <Star size={14} className="text-gold fill-gold"/> Reviews ({reviews.length})
            </h2>
            {user && !showReview && (
              <button onClick={() => setShowReview(true)} className="text-xs font-body text-gold min-h-[36px] px-2">Write one</button>
            )}
          </div>
          {showReview && (
            <div className="bg-ink-50 rounded-xl p-4 mb-4">
              <div className="flex gap-1 mb-3">
                {Array.from({length:5}).map((_,i) => (
                  <button key={i} onClick={() => setReviewRating(i+1)} className="text-2xl">
                    <span className={i < reviewRating ? 'text-gold' : 'text-ink-200'}>★</span>
                  </button>
                ))}
              </div>
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={3}
                placeholder="Share your experience…"
                className="w-full px-3 py-2.5 bg-white border border-ink-200 rounded-xl font-body text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:border-gold/50 resize-none"
                style={{fontSize:'16px'}}/>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setShowReview(false)} className="flex-1 py-2.5 text-sm font-body text-ink-500 border border-ink-200 rounded-xl">Cancel</button>
                <button onClick={handleReview} disabled={submittingRev} className="flex-1 py-2.5 text-sm font-body font-bold bg-gold text-ink-900 rounded-xl disabled:opacity-60">
                  {submittingRev ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </div>
          )}
          {reviews.length === 0
            ? <p className="text-sm text-ink-400 font-body">No reviews yet.</p>
            : <div className="space-y-3">
                {reviews.slice(0,4).map((r:any) => (
                  <div key={r._id} className="border-b border-ink-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                          <span className="text-gold text-[10px] font-bold">{r.customer?.name?.[0]??'A'}</span>
                        </div>
                        <span className="font-body font-semibold text-sm text-ink-800">{r.customer?.name??'Anonymous'}</span>
                      </div>
                      <div className="text-gold text-xs">{'★'.repeat(r.rating)}<span className="text-ink-200">{'★'.repeat(5-r.rating)}</span></div>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-500 font-body leading-relaxed pl-9">{r.comment}</p>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Sticky bottom CTA — mobile */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-ink-100 p-4 shadow-2xl">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div>
            <p className="font-display font-bold text-xl text-ink-900">{fmt(price)}</p>
            <p className="text-[11px] text-ink-400 font-body">{service.durationMinutes ?? 60} min</p>
          </div>
          <button
            onClick={() => setShowBookingSheet(true)}
            className="flex-1 py-3.5 bg-gold text-ink-900 font-body font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold text-sm">
            Book Now
          </button>
        </div>
      </div>

      {/* Booking bottom sheet */}
      {showBookingSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBookingSheet(false)}/>
          <div className="relative bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-sheet-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-ink-200 rounded-full"/>
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-ink-100">
              <h2 className="font-display font-bold text-lg text-ink-900">Book {service.name}</h2>
              <button onClick={() => setShowBookingSheet(false)} className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center">
                <X size={15}/>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Service type */}
              {service.isHomeService && (
                <div>
                  <p className="text-[11px] font-body font-semibold text-ink-400 uppercase tracking-widest mb-2">Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[{v:'salon',l:'💈 Salon'},{v:'home',l:'🏠 Home'}].map(opt => (
                      <button key={opt.v} onClick={() => setBookingType(opt.v as any)}
                        className={clsx('py-3 rounded-xl text-sm font-body font-medium border transition-all',
                          bookingType===opt.v ? 'bg-ink-900 text-cream border-ink-900' : 'bg-white border-ink-200 text-ink-600')}>
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div>
                <p className="text-[11px] font-body font-semibold text-ink-400 uppercase tracking-widest mb-2">Date</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                  {DATES.map(d => {
                    const ds = format(d, 'yyyy-MM-dd')
                    return (
                      <button key={ds} onClick={() => { setBookingDate(ds); setBookingSlot(''); setBookingSlotLabel('') }}
                        className={clsx(
                          'flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl text-xs border transition-all min-w-[52px]',
                          bookingDate===ds ? 'bg-gold text-ink-900 border-gold shadow-gold' : 'bg-white border-ink-200 text-ink-600'
                        )}>
                        <span className="font-body font-semibold">{format(d,'EEE')}</span>
                        <span className="font-body text-[10px] mt-0.5">{format(d,'d MMM')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Slots */}
              {bookingDate && (
                <div>
                  <p className="text-[11px] font-body font-semibold text-ink-400 uppercase tracking-widest mb-2">Time</p>
                  {slotsLoading ? (
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({length:8}).map((_,i) => <div key={i} className="h-10 bg-ink-100 rounded-xl animate-pulse"/>)}
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-ink-400 font-body bg-ink-50 rounded-xl px-3 py-3">No slots available</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map((slot:any) => (
                        <button key={slot.start}
                          onClick={() => { setBookingSlot(slot.start); setBookingSlotLabel(slot.label) }}
                          className={clsx(
                            'py-2.5 rounded-xl text-xs font-body font-medium border transition-all',
                            bookingSlot===slot.start ? 'bg-ink-900 text-cream border-ink-900' : 'bg-white border-ink-200 text-ink-600'
                          )}>
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              {bookingDate && bookingSlot && (
                <div className="bg-ink-50 rounded-2xl p-4">
                  <div className="flex justify-between text-ink-600 text-sm mb-1.5 font-body">
                    <span>Service</span><span className="font-semibold">{fmt(price)}</span>
                  </div>
                  {bookingType==='home' && homeFee > 0 && (
                    <div className="flex justify-between text-ink-600 text-sm mb-1.5 font-body">
                      <span>Home fee</span><span className="font-semibold">{fmt(homeFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-ink-900 border-t border-ink-200 pt-2 mt-1 font-display">
                    <span>Total</span><span>{fmt(totalAmount)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={createBooking.isPending || !bookingDate || !bookingSlot}
                className="w-full py-4 bg-gold text-ink-900 font-body font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold disabled:opacity-50 text-base">
                {createBooking.isPending ? 'Creating booking…' : !bookingDate || !bookingSlot ? 'Select date & time' : 'Confirm & Pay'}
              </button>
              <p className="text-center text-[11px] text-ink-400 font-body">Free cancellation up to 24h before</p>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        clientSecret={clientSecret}
        amount={payAmount}
        description={service.name}
        onSuccess={() => { toast.success('Booking confirmed! 🎉'); router.push('/bookings') }}
      />
    </div>
  )
}
