'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useMyBookings, useCancelBooking } from '@/hooks/useApi'
import { useStore } from '@/store/store'
import { fmt } from '@/lib/api'
import { Calendar, Clock, Scissors, X, MapPin, Home, ChevronRight } from 'lucide-react'
import { format, isPast } from 'date-fns'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const TABS = ['All','Upcoming','Completed','Cancelled']
const statusStyle: Record<string, string> = {
  pending:     'bg-amber-50 text-amber-700 border-amber-200',
  accepted:    'bg-blue-50 text-blue-700 border-blue-200',
  completed:   'bg-green-50 text-green-700 border-green-200',
  cancelled:   'bg-red-50 text-red-700 border-red-200',
  rejected:    'bg-red-50 text-red-700 border-red-200',
  rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
}

export default function BookingsPage() {
  const { user } = useStore()
  const [tab, setTab]           = useState('All')
  const [cancelId, setCancelId] = useState<string|null>(null)
  const { data, isLoading, refetch } = useMyBookings()
  const cancelMut = useCancelBooking()

  let bookings: any[] = (data as any)?.bookings ?? []
  if (tab==='Upcoming')  bookings = bookings.filter(b => ['pending','accepted','rescheduled'].includes(b.status))
  if (tab==='Completed') bookings = bookings.filter(b => b.status==='completed')
  if (tab==='Cancelled') bookings = bookings.filter(b => ['cancelled','rejected'].includes(b.status))

  const handleCancel = async () => {
    if (!cancelId) return
    try { await cancelMut.mutateAsync(cancelId); toast.success('Booking cancelled'); setCancelId(null); refetch() }
    catch (e: any) { toast.error(e?.response?.data?.message ?? 'Could not cancel') }
  }

  if (!user) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-16">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4"><Calendar size={24} className="text-ink-300"/></div>
        <h2 className="font-display font-bold text-2xl text-ink-800 mb-2">Sign in to view bookings</h2>
        <p className="text-ink-400 font-body text-sm mb-6">You need to be signed in to see your bookings.</p>
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
            <span className="text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">Appointments</span>
          </div>
          <h1 className="font-display font-bold text-cream" style={{fontSize:'clamp(1.75rem,5vw,3rem)'}}>My Bookings</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={clsx('flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-body font-medium transition-all min-h-[36px]',
                tab===t ? 'bg-ink-900 text-cream' : 'bg-white text-ink-500 border border-ink-200')}>
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({length:3}).map((_,i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-soft animate-pulse space-y-3">
                <div className="flex justify-between"><div className="h-5 bg-ink-100 rounded-full w-1/2"/><div className="h-5 bg-ink-100 rounded-full w-20"/></div>
                <div className="h-4 bg-ink-100 rounded-full w-1/3"/>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-soft">
            <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4"><Scissors size={22} className="text-ink-300"/></div>
            <h3 className="font-display font-bold text-lg text-ink-700 mb-2">No bookings yet</h3>
            <p className="text-ink-400 font-body text-sm mb-5">Ready to look amazing?</p>
            <Link href="/services" className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-ink-900 font-body font-bold rounded-xl shadow-gold hover:brightness-110 transition-all text-sm">
              Book a Service <ChevronRight size={14}/>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b:any) => {
              const sp  = b.servicePerson
              const svc = b.services?.[0]
              const date = new Date(b.bookingDate ?? b.scheduledAt)
              const canCancel = ['pending','accepted'].includes(b.status) && !isPast(date)
              return (
                <div key={b._id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-ink-100/50">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-ink-900 text-base leading-tight line-clamp-1">
                        {svc?.name ?? b.service?.name ?? 'Appointment'}
                      </h3>
                      {sp && <p className="text-[12px] text-ink-400 font-body mt-0.5">with {sp.name}</p>}
                    </div>
                    <span className={clsx('shrink-0 text-[10px] sm:text-[11px] font-body font-semibold px-2.5 py-1 rounded-full border capitalize', statusStyle[b.status] ?? 'bg-ink-50 text-ink-500 border-ink-100')}>
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 p-2.5 bg-ink-50 rounded-xl">
                      <Calendar size={13} className="text-gold shrink-0"/>
                      <div>
                        <p className="text-[9px] text-ink-400 font-body">Date</p>
                        <p className="text-[11px] font-body font-semibold text-ink-800">{format(date,'d MMM yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-ink-50 rounded-xl">
                      <Clock size={13} className="text-gold shrink-0"/>
                      <div>
                        <p className="text-[9px] text-ink-400 font-body">Time</p>
                        <p className="text-[11px] font-body font-semibold text-ink-800">{format(date,'h:mm a')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-ink-50 rounded-xl mb-3">
                    {b.serviceType==='home' ? <Home size={13} className="text-gold shrink-0"/> : <MapPin size={13} className="text-gold shrink-0"/>}
                    <p className="text-[12px] font-body text-ink-600 capitalize flex-1">{b.serviceType==='home' ? 'Home visit' : 'Salon visit'}</p>
                    {b.totalAmount && <span className="font-display font-bold text-sm text-ink-900">{fmt(b.totalAmount)}</span>}
                  </div>

                  {canCancel && (
                    <button onClick={() => setCancelId(b._id)}
                      className="w-full py-2.5 border border-red-200 text-red-500 font-body text-sm rounded-xl hover:bg-red-50 active:scale-[0.98] transition-all min-h-[44px]">
                      Cancel Booking
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel confirm */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCancelId(null)}/>
          <div className="relative bg-white rounded-3xl rounded-b-3xl p-6 w-full max-w-sm shadow-2xl animate-sheet-up sm:animate-scale-in">
            <h3 className="font-display font-bold text-xl text-ink-900 mb-2">Cancel booking?</h3>
            <p className="text-ink-400 font-body text-sm mb-6">This cannot be undone. Your slot will be released.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="flex-1 py-3.5 border border-ink-200 text-ink-600 font-body text-sm rounded-2xl min-h-[50px]">Keep it</button>
              <button onClick={handleCancel} disabled={cancelMut.isPending}
                className="flex-1 py-3.5 bg-red-500 text-white font-body font-bold text-sm rounded-2xl disabled:opacity-60 min-h-[50px]">
                {cancelMut.isPending ? 'Cancelling…' : 'Yes, cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
