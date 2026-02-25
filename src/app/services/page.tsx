'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useServices } from '@/hooks/useApi'
import { fmt } from '@/lib/api'
import { Search, Clock, Star, Home, Scissors, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const CATS  = ['All','Hair','Colour','Nails','Facial','Massage','Lashes','Makeup','Waxing','Brows','Treatment','Skincare','Wellness']
const SORTS = [
  { label:'Popular', value:'-reviewCount' },
  { label:'Price ↑', value:'basePrice' },
  { label:'Price ↓', value:'-basePrice' },
  { label:'Newest',  value:'-createdAt' },
]
const GRADS  = ['from-amber-950 to-amber-900','from-rose-950 to-rose-900','from-stone-900 to-stone-800','from-emerald-950 to-emerald-900','from-purple-950 to-purple-900','from-sky-950 to-sky-900']
const EMOJIS = ['✂️','🎨','✨','🌿','◯','💆','💅','👁️','🧖','💄']

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
      <div className="aspect-[4/3] bg-ink-100"/>
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-3.5 bg-ink-100 rounded-full w-3/4"/>
        <div className="h-3 bg-ink-100 rounded-full w-1/2"/>
        <div className="flex justify-between pt-1">
          <div className="h-3 bg-ink-100 rounded-full w-1/3"/>
          <div className="h-3 bg-ink-100 rounded-full w-1/4"/>
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const [search,      setSearch]      = useState('')
  const [cat,         setCat]         = useState('All')
  const [sort,        setSort]        = useState('-reviewCount')
  const [homeOnly,    setHomeOnly]    = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useServices({
    ...(search       ? { search }                           : {}),
    ...(cat !== 'All' ? { category: cat.toLowerCase() }    : {}),
    sort,
    ...(homeOnly     ? { isHomeService: true }              : {}),
    limit: 24,
  })
  const services: any[] = (data as any)?.services ?? []
  const hasFilters = cat !== 'All' || homeOnly || search
  const clearAll = () => { setSearch(''); setCat('All'); setHomeOnly(false) }

  return (
    <div className="min-h-screen bg-cream pb-24 pt-16">
      {/* Dark header */}
      <div className="bg-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'radial-gradient(circle,#fff 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-16 sm:pt-10 sm:pb-20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-px bg-gold"/>
            <span className="text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">Book a Service</span>
          </div>
          <h1 className="font-display font-bold text-cream mb-5" style={{fontSize:'clamp(1.75rem,5vw,3.5rem)'}}>
            Browse <em className="not-italic text-gold">Services</em>
          </h1>

          {/* Search + filter row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"/>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search services…"
                className="w-full pl-10 pr-9 py-3 bg-ink-800/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body text-sm focus:outline-none focus:border-gold/40 transition-all"
                style={{fontSize:'16px'}}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 p-1">
                  <X size={13}/>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-3 rounded-xl border font-body text-sm font-medium transition-all min-w-[44px] justify-center',
                showFilters ? 'bg-gold text-ink-900 border-gold' : 'bg-ink-800/60 border-white/10 text-ink-300'
              )}>
              <SlidersHorizontal size={15}/>
              <span className="hidden sm:block">Filters</span>
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold sm:hidden"/>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-6 sm:-mt-8">
        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-card border border-ink-100/50 p-4 sm:p-5 mb-4">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-body font-semibold text-ink-400 uppercase tracking-widest mb-2">Sort by</p>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {SORTS.map(s => (
                    <button key={s.value} onClick={() => setSort(s.value)}
                      className={clsx(
                        'px-3 py-2 rounded-xl text-[12px] font-body font-medium border transition-all',
                        sort === s.value ? 'bg-ink-900 text-cream border-ink-900' : 'bg-white text-ink-500 border-ink-200'
                      )}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setHomeOnly(v => !v)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-medium border transition-all',
                    homeOnly ? 'bg-gold text-ink-900 border-gold shadow-gold' : 'bg-white text-ink-500 border-ink-200'
                  )}>
                  <Home size={14}/> Home visits only
                </button>
                {hasFilters && (
                  <button onClick={clearAll} className="text-[12px] font-body text-ink-400 underline underline-offset-2 px-2 py-2">
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category chips — scrollable */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={clsx(
                'flex-shrink-0 px-3.5 py-2 rounded-full text-[13px] font-body font-medium transition-all min-h-[36px]',
                cat === c ? 'bg-ink-900 text-cream' : 'bg-white text-ink-500 border border-ink-200'
              )}>
              {c}
            </button>
          ))}
        </div>

        {!isLoading && (
          <p className="text-[12px] font-body text-ink-400 mb-4">
            {services.length} {services.length === 1 ? 'service' : 'services'}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {Array.from({length:8}).map((_,i) => <SkeletonCard key={i}/>)}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4"><Scissors size={22} className="text-ink-300"/></div>
            <h3 className="font-display font-bold text-lg text-ink-700 mb-2">No services found</h3>
            <p className="text-ink-400 font-body text-sm mb-5">Try adjusting your filters</p>
            <button onClick={clearAll} className="px-5 py-2.5 bg-ink-900 text-cream font-body text-sm rounded-xl">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {services.map((s: any, i: number) => {
              const sp    = typeof s.servicePerson === 'object' ? s.servicePerson : null
              const price = s.basePrice ?? s.price ?? 0
              return (
                <Link key={s._id} href={`/services/${s._id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-soft active:scale-[0.98] transition-all duration-200 flex flex-col">
                  <div className="relative overflow-hidden flex-shrink-0 aspect-[4/3]">
                    {s.images?.[0]?.url
                      ? <img src={s.images[0].url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      : <div className={clsx('w-full h-full bg-gradient-to-br flex items-center justify-center text-2xl sm:text-3xl', GRADS[i%6])}>{EMOJIS[i%EMOJIS.length]}</div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-white/90 text-ink-700 text-[9px] sm:text-[10px] font-body font-semibold px-1.5 py-0.5 rounded-full capitalize">{s.category}</span>
                      {s.isHomeService && <span className="bg-gold text-ink-900 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full">🏠</span>}
                    </div>
                    {s.reviewCount > 0 && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur px-1.5 py-0.5 rounded-full">
                        <Star size={8} className="text-gold fill-gold"/><span className="text-[9px] text-cream font-body">{s.rating?.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col">
                    {sp && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center text-gold text-[8px] font-bold shrink-0">{sp.name?.[0]}</div>
                        <span className="text-[10px] text-ink-400 font-body truncate">{sp.name}</span>
                      </div>
                    )}
                    <h3 className="font-display font-bold text-ink-900 text-xs sm:text-sm leading-snug mb-1.5 line-clamp-2">{s.name}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="flex items-center gap-0.5 text-ink-400 text-[10px] font-body"><Clock size={9}/>{s.durationMinutes ?? 60}m</span>
                      <span className="font-display font-bold text-xs sm:text-sm text-ink-900">{fmt(price)}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
