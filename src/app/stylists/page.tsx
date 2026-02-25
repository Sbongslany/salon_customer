'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useNearbyServicePersons } from '@/hooks/useApi'
import { Star, Search, Scissors, X } from 'lucide-react'
import clsx from 'clsx'

const COLORS = ['from-amber-100 to-amber-50','from-rose-100 to-rose-50','from-emerald-100 to-emerald-50','from-blue-100 to-blue-50','from-purple-100 to-purple-50','from-stone-100 to-stone-50']

export default function StylistsPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useNearbyServicePersons(-26.2041, 28.0473)
  const list: any[] = (data as any)?.servicePersons ?? (data as any)?.users ?? []
  const filtered = list.filter(sp =>
    !search ||
    sp.name?.toLowerCase().includes(search.toLowerCase()) ||
    sp.specialization?.some((s:string) => s.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-cream pb-24 pt-16">
      {/* Dark header */}
      <div className="bg-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'radial-gradient(circle,#fff 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-16 sm:pt-10 sm:pb-20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-px bg-gold"/>
            <span className="text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">Our Experts</span>
          </div>
          <h1 className="font-display font-bold text-cream mb-5" style={{fontSize:'clamp(1.75rem,5vw,3.5rem)'}}>
            Find your <em className="not-italic text-gold">Stylist</em>
          </h1>
          <div className="relative max-w-lg">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"/>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialty…"
              className="w-full pl-10 pr-9 py-3 bg-ink-800/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body text-sm focus:outline-none focus:border-gold/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 p-1">
                <X size={13}/>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-6 sm:-mt-8">
        {!isLoading && (
          <p className="text-[12px] font-body text-ink-400 mb-4">{filtered.length} stylist{filtered.length !== 1 ? 's' : ''} available</p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
                <div className="aspect-[4/5] bg-ink-100"/>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-ink-100 rounded-full w-2/3"/>
                  <div className="h-3 bg-ink-100 rounded-full w-1/2"/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4"><Scissors size={22} className="text-ink-300"/></div>
            <h3 className="font-display font-bold text-lg text-ink-700 mb-2">No stylists found</h3>
            <p className="text-ink-400 font-body text-sm">Try a different search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {filtered.map((sp:any, i:number) => (
              <Link key={sp._id??i} href={`/services?stylist=${sp._id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-soft active:scale-[0.98] transition-all">
                <div className="aspect-[4/5] relative overflow-hidden">
                  {sp.profileImage?.url
                    ? <img src={sp.profileImage.url} alt={sp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                    : <div className={clsx('w-full h-full bg-gradient-to-br flex items-center justify-center', COLORS[i%6])}>
                        <span className="font-display font-bold text-5xl opacity-20 text-ink-700">{sp.name?.[0]}</span>
                      </div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
                  <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/15 backdrop-blur-sm rounded-full">
                      <Star size={8} className="text-gold fill-gold"/>
                      <span className="text-[9px] sm:text-[10px] text-cream font-body font-semibold">{sp.rating?.toFixed(1) ?? '4.9'}</span>
                    </div>
                    {sp.reviewCount > 0 && (
                      <span className="text-[9px] text-white/60 font-body hidden sm:block">{sp.reviewCount} reviews</span>
                    )}
                  </div>
                </div>
                <div className="p-2.5 sm:p-4">
                  <h3 className="font-display font-bold text-ink-900 text-sm sm:text-base leading-tight mb-1.5">{sp.name}</h3>
                  {sp.specialization?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {sp.specialization.slice(0,2).map((t:string) => (
                        <span key={t} className="text-[9px] sm:text-[10px] font-body text-ink-500 bg-ink-50 border border-ink-100 px-1.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                  {sp.bio && <p className="text-[11px] text-ink-400 font-body line-clamp-2 leading-relaxed hidden sm:block">{sp.bio}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
