'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { api, fmt } from '@/lib/api'
import { ArrowRight, Star, Clock, Scissors, ShoppingBag, Shield, Check, Sparkles, Zap, Calendar, Heart, Users, Award, Package, TrendingUp } from 'lucide-react'
import clsx from 'clsx'

function usePublic<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  useEffect(() => { api.get(url).then(r => setData(r.data.data)).catch(() => {}) }, [url])
  return data
}

function Counter({ to, suffix='' }: { to:number; suffix?:string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect()
      let v = 0; const step = to/60
      const id = setInterval(() => { v=Math.min(v+step,to); setVal(Math.round(v)); if(v>=to) clearInterval(id) }, 16)
    }, { threshold:0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const WORDS = ['Radiant','Flawless','Stunning','Luminous','Iconic']

function Hero() {
  const [idx, setIdx] = useState(0)
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const id = setInterval(() => {
      setVis(false)
      setTimeout(() => { setIdx(i => (i+1)%WORDS.length); setVis(true) }, 300)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-[100dvh] bg-ink-900 flex flex-col overflow-hidden pt-16">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-10 w-72 sm:w-[500px] h-72 sm:h-[500px] rounded-full bg-gold/[0.07] blur-[80px] sm:blur-[120px]"/>
        <div className="absolute bottom-0 right-0 w-48 sm:w-[350px] h-48 sm:h-[350px] rounded-full bg-gold/[0.05] blur-[60px] sm:blur-[100px]"/>
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage:'radial-gradient(circle,#fff 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ink-900 to-transparent"/>
      </div>

      {/* Desktop right panel */}
      <div className="hidden lg:block absolute right-0 top-0 w-[42%] h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/40 to-transparent z-10"/>
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full bg-gradient-to-b from-amber-950/80 via-amber-900/50 to-stone-900/70"/>
          <div className="w-1/2 h-full bg-gradient-to-b from-rose-950/70 via-rose-900/40 to-ink-900/90"/>
        </div>
        {[
          { top:'22%', left:'8%',  delay:'0.4s', node: <><p className="font-display font-bold text-2xl text-cream">4.9<span className="text-gold">★</span></p><p className="text-ink-400 text-xs font-body mt-0.5">Avg. rating</p></> },
          { top:'48%', left:'38%', delay:'0.7s', node: <><p className="font-display font-bold text-2xl text-gold">2.4k+</p><p className="text-ink-400 text-xs font-body mt-0.5">Happy clients</p></> },
          { top:'70%', left:'5%',  delay:'1.0s', node: (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center shrink-0"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse block"/></div>
              <div><p className="text-cream text-xs font-body font-semibold">Stylists online</p><p className="text-gold text-xs font-body">Available now</p></div>
            </div>
          )},
        ].map((c,i) => (
          <div key={i} className="absolute z-20 animate-slide-up" style={{top:c.top,left:c.left,animationDelay:c.delay}}>
            <div className="bg-ink-900/75 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">{c.node}</div>
          </div>
        ))}
      </div>

      {/* Hero copy — mobile optimised */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="max-w-[560px]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-6 animate-slide-up" style={{animationDelay:'0.1s'}}>
            <Sparkles size={10} className="text-gold"/><span className="text-[10px] sm:text-[11px] font-body font-semibold text-gold tracking-[0.15em] uppercase">Premium Beauty Platform</span>
          </div>

          <h1 className="font-display font-bold text-cream leading-[0.95] mb-5 animate-slide-up"
            style={{fontSize:'clamp(2.6rem,9vw,5.5rem)',animationDelay:'0.2s'}}>
            Look{' '}
            <span className="text-gold italic inline-block transition-all duration-300"
              style={{opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(-8px)'}}>
              {WORDS[idx]}
            </span>.<br/>
            <span className="text-ink-400">Feel</span> Amazing.
          </h1>

          <p className="text-sm sm:text-base text-ink-300 font-body leading-relaxed mb-8 max-w-sm animate-slide-up" style={{animationDelay:'0.3s'}}>
            Book expert stylists, shop salon-grade products, and manage your beauty routine — all in one place.
          </p>

          <div className="flex gap-2.5 mb-8 animate-slide-up" style={{animationDelay:'0.4s'}}>
            <Link href="/services" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 bg-gold text-ink-900 font-body font-bold rounded-2xl hover:brightness-110 active:scale-[0.97] transition-all shadow-gold text-sm sm:text-[15px]">
              Book Now<ArrowRight size={14}/>
            </Link>
            <Link href="/shop" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 bg-white/6 border border-white/12 text-cream font-body font-medium rounded-2xl hover:bg-white/10 active:scale-[0.97] transition-all text-sm sm:text-[15px]">
              <ShoppingBag size={14} className="text-ink-400"/>Shop
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 animate-slide-up" style={{animationDelay:'0.5s'}}>
            {[{icon:Shield,label:'Verified stylists'},{icon:Star,label:'4.9 / 5 rating'},{icon:Zap,label:'Instant booking'}].map(({icon:Icon,label}) => (
              <div key={label} className="flex items-center gap-1.5 text-ink-500">
                <Icon size={11} className="text-gold/70"/><span className="text-[11px] sm:text-[12px] font-body">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 pb-6 flex justify-center">
        <div className="w-5 h-7 rounded-full border border-white/15 flex items-start justify-center pt-1">
          <div className="w-1 h-1.5 bg-white/30 rounded-full animate-bounce"/>
        </div>
      </div>
    </section>
  )
}

function StatsRibbon() {
  return (
    <div className="bg-gold py-4 sm:py-5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'repeating-linear-gradient(45deg,#000 0,#000 1px,transparent 0,transparent 50%)',backgroundSize:'12px 12px'}}/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[{label:'Happy clients',v:2400,s:'+'},{label:'Expert stylists',v:120,s:'+'},{label:'Reviews',v:680,s:'+'},{label:'Bookings',v:8500,s:'+'}].map(x => (
          <div key={x.label} className="text-center">
            <p className="font-display font-bold text-xl sm:text-3xl text-ink-900"><Counter to={x.v} suffix={x.s}/></p>
            <p className="text-ink-700 text-[10px] sm:text-[11px] font-body mt-0.5 uppercase tracking-widest">{x.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const FALLBACK_SVCS = [
  { name:'Hair Cut & Style',   category:'hair',      duration:60,  basePrice:45000,  emoji:'✂️', g:'from-amber-950 to-amber-900' },
  { name:'Balayage Colour',    category:'colour',    duration:180, basePrice:180000, emoji:'🎨', g:'from-rose-950 to-rose-900' },
  { name:'Keratin Treatment',  category:'treatment', duration:150, basePrice:120000, emoji:'✨', g:'from-stone-900 to-stone-800' },
  { name:'Luxury Facial',      category:'skincare',  duration:75,  basePrice:85000,  emoji:'🌿', g:'from-emerald-950 to-emerald-900' },
  { name:'Brow Sculpt & Tint', category:'brows',     duration:30,  basePrice:25000,  emoji:'◯', g:'from-purple-950 to-purple-900' },
  { name:'Deep Scalp Massage', category:'wellness',  duration:45,  basePrice:35000,  emoji:'💆', g:'from-sky-950 to-sky-900' },
]

function ServicesSection() {
  const raw: any = usePublic('/services?limit=6')
  const list = (raw?.services?.length ? raw.services : FALLBACK_SVCS).slice(0,6).map((s:any,i:number)=>({...s,g:s.g||FALLBACK_SVCS[i%6].g,emoji:s.emoji||FALLBACK_SVCS[i%6].emoji}))
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3"><div className="w-6 sm:w-8 h-px bg-gold"/><span className="text-[10px] sm:text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">What We Offer</span></div>
            <h2 className="font-display font-bold text-ink-900 leading-[0.95]" style={{fontSize:'clamp(1.6rem,4.5vw,3.5rem)'}}>Services crafted<br/><em className="not-italic text-gold">for you</em></h2>
          </div>
          <Link href="/services" className="hidden sm:inline-flex items-center gap-2 text-[13px] font-body text-ink-400 hover:text-ink-900 transition-colors px-4 py-2 border border-ink-200 rounded-xl hover:border-ink-400">View all <ArrowRight size={13}/></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {list.map((s:any,i:number) => (
            <Link key={s._id??i} href="/services" className="group relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all" style={{aspectRatio:i<3?'3/4':'4/3'}}>
              <div className={clsx('absolute inset-0 bg-gradient-to-br',s.g)}/>
              {s.images?.[0]?.url && <img src={s.images[0].url} alt={s.name} className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity duration-500"/>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"/>
              <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between">
                <span className="text-xl sm:text-3xl">{s.emoji}</span>
                <div>
                  <span className="text-[9px] sm:text-[10px] font-body text-gold/80 uppercase tracking-widest mb-1 block capitalize">{s.category}</span>
                  <h3 className="font-display font-bold text-cream text-xs sm:text-base leading-tight mb-1.5 sm:mb-2">{s.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-0.5 text-ink-400 text-[10px] font-body"><Clock size={9}/>{s.duration??60}m</span>
                    <span className="font-body font-bold text-gold text-xs sm:text-sm">{fmt(s.basePrice??s.price??0)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-5 sm:hidden text-center">
          <Link href="/services" className="inline-flex items-center gap-2 px-5 py-3 border border-ink-200 rounded-2xl text-sm font-body text-ink-600">All services <ArrowRight size={13}/></Link>
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { n:'01', icon:Calendar, title:'Discover', body:'Browse verified stylists. Filter by specialty, rating, or location.' },
  { n:'02', icon:Zap,      title:'Book',     body:'Pick your time, instant confirmation. Zero fees.' },
  { n:'03', icon:Star,     title:'Enjoy',    body:'Arrive and enjoy a world-class session. Pay securely.' },
  { n:'04', icon:Heart,    title:'Shine',    body:'Rate your stylist, shop products used, rebook instantly.' },
]

function HowItWorks() {
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-ink-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'48px 48px'}}/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3"><div className="w-6 h-px bg-gold"/><span className="text-[10px] sm:text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">Simple Process</span><div className="w-6 h-px bg-gold"/></div>
          <h2 className="font-display font-bold text-cream leading-[0.95]" style={{fontSize:'clamp(1.6rem,4.5vw,3.5rem)'}}>Four steps to<br/><em className="not-italic text-gold">looking amazing</em></h2>
        </div>
        {/* Desktop */}
        <div className="hidden md:grid grid-cols-4 gap-6 relative">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"/>
          {STEPS.map(s => (
            <div key={s.n} className="group">
              <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-white/8 flex items-center justify-center mb-6 relative group-hover:border-gold/30 group-hover:bg-gold/5 transition-all">
                <s.icon size={19} className="text-ink-500 group-hover:text-gold transition-colors"/>
                <span className="absolute -top-2 -right-2 text-[10px] font-mono text-gold/50 font-bold">{s.n}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-cream mb-2">{s.title}</h3>
              <p className="text-[13px] text-ink-500 font-body leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        {/* Mobile */}
        <div className="md:hidden space-y-3">
          {STEPS.map(s => (
            <div key={s.n} className="flex gap-4 p-4 bg-ink-800/40 rounded-2xl border border-white/5">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-ink-700 flex items-center justify-center"><s.icon size={16} className="text-gold/70"/></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-gold/50">{s.n}</span>
                  <h3 className="font-display font-bold text-base text-cream">{s.title}</h3>
                </div>
                <p className="text-[12px] text-ink-400 font-body leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const MOCK_SPS = [
  { name:'Amara Khumalo', specialization:['Balayage','Cuts'],       bio:'Award-winning colourist, 8 years experience.', rating:4.9, jobs:312 },
  { name:'Devon Langa',   specialization:['Keratin','Extensions'],  bio:'Texture treatment specialist & educator.',     rating:4.8, jobs:205 },
  { name:'Zoë Mthembu',  specialization:['Skincare','Brows'],      bio:'Holistic beauty & certified esthetician.',     rating:5.0, jobs:178 },
  { name:'Kai Pienaar',   specialization:['Braids','Natural Hair'], bio:'Natural hair guru. Every texture, every style.',rating:4.9, jobs:290 },
]
const SP_COLORS = ['from-amber-100 to-amber-50','from-rose-100 to-rose-50','from-emerald-100 to-emerald-50','from-blue-100 to-blue-50']

function StylistsSection() {
  const raw: any = usePublic('/users/nearby?lat=-26.2041&lng=28.0473&radius=50000&limit=4')
  const list = (raw?.servicePersons?.length ? raw.servicePersons : MOCK_SPS).slice(0,4)
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3"><div className="w-6 sm:w-8 h-px bg-gold"/><span className="text-[10px] sm:text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">Our Experts</span></div>
            <h2 className="font-display font-bold text-ink-900 leading-[0.95]" style={{fontSize:'clamp(1.6rem,4.5vw,3.5rem)'}}>Meet your<br/><em className="not-italic text-gold">stylists</em></h2>
          </div>
          <Link href="/stylists" className="hidden sm:inline-flex items-center gap-2 text-[13px] font-body text-ink-400 hover:text-ink-900 transition-colors px-4 py-2 border border-ink-200 rounded-xl hover:border-ink-400">Browse all <ArrowRight size={13}/></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {list.map((sp:any,i:number) => (
            <Link key={sp._id??i} href="/stylists" className="group bg-white rounded-2xl overflow-hidden shadow-soft active:scale-[0.98] transition-all">
              <div className="aspect-[4/5] relative overflow-hidden">
                {sp.profileImage?.url
                  ? <img src={sp.profileImage.url} alt={sp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                  : <div className={clsx('w-full h-full bg-gradient-to-br flex items-center justify-center',SP_COLORS[i%4])}><span className="font-display font-bold text-5xl sm:text-6xl opacity-20 text-ink-700">{sp.name?.[0]}</span></div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
                <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-4">
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/15 backdrop-blur-sm rounded-full w-fit">
                    <Star size={8} className="text-gold fill-gold"/><span className="text-[9px] sm:text-[10px] text-cream font-body font-semibold">{sp.rating ?? MOCK_SPS[i]?.rating ?? 4.9}</span>
                  </div>
                </div>
              </div>
              <div className="p-2.5 sm:p-4">
                <h3 className="font-display font-bold text-ink-900 text-sm sm:text-base leading-tight mb-1">{sp.name}</h3>
                <div className="flex flex-wrap gap-1">
                  {(sp.specialization??[]).slice(0,2).map((t:string) => (
                    <span key={t} className="text-[9px] sm:text-[10px] font-body text-ink-500 bg-ink-50 border border-ink-100 px-1.5 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-5 sm:hidden text-center">
          <Link href="/stylists" className="inline-flex items-center gap-2 px-5 py-3 border border-ink-200 rounded-2xl text-sm font-body text-ink-600">All stylists <ArrowRight size={13}/></Link>
        </div>
      </div>
    </section>
  )
}

const FALLBACK_PRODS = [
  { name:'Argan Silk Serum',    price:89000, category:'styling'   },
  { name:'Deep Hydration Mask', price:65000, category:'treatment' },
  { name:'Volumising Shampoo',  price:42000, category:'shampoo'   },
  { name:'Curl Define Cream',   price:55000, category:'styling'   },
]
const PROD_BG = ['bg-amber-50','bg-rose-50','bg-stone-50','bg-emerald-50']

function ProductsSection() {
  const raw: any = usePublic('/products?isFeatured=true&limit=4')
  const list = raw?.products?.length ? raw.products : FALLBACK_PRODS
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3"><div className="w-6 sm:w-8 h-px bg-gold"/><span className="text-[10px] sm:text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">The Edit</span></div>
            <h2 className="font-display font-bold text-ink-900 leading-[0.95]" style={{fontSize:'clamp(1.6rem,4.5vw,3.5rem)'}}>Shop what the<br/><em className="not-italic text-gold">pros use</em></h2>
          </div>
          <Link href="/shop" className="hidden sm:inline-flex items-center gap-2 text-[13px] font-body text-ink-400 hover:text-ink-900 transition-colors px-4 py-2 border border-ink-200 rounded-xl hover:border-ink-400">Shop all <ArrowRight size={13}/></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {list.slice(0,4).map((p:any,i:number) => (
            <Link key={p._id??i} href="/shop" className="group bg-white rounded-2xl overflow-hidden shadow-soft active:scale-[0.98] transition-all">
              <div className={clsx('aspect-square relative overflow-hidden',!p.images?.[0]?.url && PROD_BG[i%4])}>
                {p.images?.[0]?.url
                  ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                  : <div className="w-full h-full flex items-center justify-center"><Package size={28} className="text-ink-200"/></div>
                }
                {p.discountPrice!=null && <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">SALE</span>}
              </div>
              <div className="p-2.5 sm:p-4">
                <p className="text-[9px] sm:text-[10px] font-body text-ink-400 uppercase tracking-widest mb-1 capitalize">{p.category}</p>
                <h3 className="font-display font-semibold text-ink-900 text-xs sm:text-sm leading-snug mb-1.5 line-clamp-1">{p.name}</h3>
                {p.discountPrice!=null
                  ? <div className="flex items-center gap-1.5"><span className="font-bold text-xs sm:text-sm text-gold">{fmt(p.discountPrice)}</span><span className="text-[10px] text-ink-300 line-through">{fmt(p.price)}</span></div>
                  : <span className="font-bold text-xs sm:text-sm text-ink-900">{fmt(p.price)}</span>
                }
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-5 sm:hidden text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-3 border border-ink-200 rounded-2xl text-sm font-body text-ink-600">All products <ArrowRight size={13}/></Link>
        </div>
      </div>
    </section>
  )
}

const REVIEWS = [
  { name:'Lerato M.', a:'L', text:"Best balayage I've ever had. Booked same-day!", rating:5, service:'Balayage' },
  { name:'Siya N.',   a:'S', text:'The app is so easy. Got a keratin treatment and loved it.', rating:5, service:'Keratin' },
  { name:'Priya K.',  a:'P', text:'Ordered serum after my appointment — arrived next day.', rating:5, service:'Shop' },
  { name:'James O.',  a:'J', text:'Found the perfect stylist near me in under a minute.', rating:5, service:'Styling' },
]

function Reviews() {
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3"><div className="w-6 h-px bg-gold"/><span className="text-[10px] sm:text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">What clients say</span><div className="w-6 h-px bg-gold"/></div>
          <h2 className="font-display font-bold text-ink-900 leading-[0.95]" style={{fontSize:'clamp(1.6rem,4.5vw,3.5rem)'}}>Loved by <em className="not-italic text-gold">thousands</em></h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({length:5}).map((_,i) => <Star key={i} size={14} className="text-gold fill-gold"/>)}
            <span className="ml-2 text-xs sm:text-sm font-body text-ink-500">4.9 · 680+ reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {REVIEWS.map((r,i) => (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-ink-100/60">
              <div className="flex gap-0.5 mb-3">{Array.from({length:r.rating}).map((_,s) => <Star key={s} size={11} className="text-gold fill-gold"/>)}</div>
              <p className="text-[13px] text-ink-600 font-body leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center"><span className="text-gold text-[10px] font-bold">{r.a}</span></div>
                  <span className="text-[12px] font-semibold text-ink-800 font-body">{r.name}</span>
                </div>
                <span className="text-[10px] font-body text-ink-400 bg-ink-50 px-2 py-0.5 rounded-full">{r.service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const PERKS = ['No booking fees','Instant confirmation','Verified professionals','Secure payments','Free cancellation','Loyalty rewards']
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-gold relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage:'repeating-linear-gradient(45deg,#000 0,#000 1px,transparent 0,transparent 50%)',backgroundSize:'14px 14px'}}/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-[10px] sm:text-[11px] font-body font-semibold text-ink-700 tracking-[0.2em] uppercase mb-3">Get started free</p>
          <h2 className="font-display font-bold text-ink-900 leading-[0.95] mb-4" style={{fontSize:'clamp(2rem,5.5vw,4.5rem)'}}>Your best look is<br/><em className="not-italic">one booking away</em></h2>
          <p className="text-ink-700 font-body text-sm sm:text-[15px] leading-relaxed mb-6 sm:mb-8">Join thousands of clients who trust LuxeStudio.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth?tab=register" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-ink-900 text-cream font-body font-bold rounded-2xl hover:bg-ink-800 active:scale-[0.97] transition-all text-sm sm:text-[15px] shadow-2xl">
              Create free account <ArrowRight size={14}/>
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/50 border border-ink-900/10 text-ink-900 font-body font-medium rounded-2xl hover:bg-white/70 transition-all text-sm sm:text-[15px]">Browse services</Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {PERKS.map(p => (
            <div key={p} className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-900/10 rounded-full border border-ink-900/10">
              <Check size={10} className="text-ink-700 shrink-0"/><span className="text-[11px] sm:text-[12px] text-ink-800 font-body">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function JoinBanner() {
  const perks = [
    { icon:Calendar,    label:'Manage bookings' },
    { icon:ShoppingBag, label:'Sell products'   },
    { icon:Users,       label:'Grow clientele'  },
    { icon:TrendingUp,  label:'Track earnings'  },
  ]
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-ink-900 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-5 sm:mb-7">
              <Scissors size={10} className="text-gold"/><span className="text-[10px] sm:text-[11px] font-body font-semibold text-gold tracking-[0.15em] uppercase">For Professionals</span>
            </div>
            <h2 className="font-display font-bold text-cream leading-[0.95] mb-4" style={{fontSize:'clamp(1.6rem,4vw,3.2rem)'}}>Are you a beauty<br/><em className="not-italic text-gold">professional?</em></h2>
            <p className="text-ink-400 font-body text-sm sm:text-[15px] leading-relaxed mb-7 max-w-md">Manage bookings, sell your own products, build your clientele — all from one powerful dashboard.</p>
            <a href="http://localhost:3000/login" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 bg-gold text-ink-900 font-body font-bold rounded-2xl hover:brightness-110 active:scale-[0.97] transition-all shadow-gold text-sm sm:text-[15px]">
              Join as a Stylist <ArrowRight size={14}/>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {perks.map((p,i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.04] border border-white/8 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0"><p.icon size={15} className="text-gold"/></div>
                <span className="text-[12px] sm:text-[13px] text-ink-300 font-body leading-snug">{p.label}</span>
              </div>
            ))}
            <div className="col-span-2 p-4 bg-white/[0.03] border border-white/6 rounded-2xl">
              <div className="flex items-center justify-between mb-3"><span className="text-[10px] text-ink-600 font-body uppercase tracking-widest">Dashboard preview</span><div className="flex gap-1">{['bg-red-500/50','bg-amber-500/50','bg-green-500/50'].map((c,i) => <div key={i} className={clsx('w-1.5 h-1.5 rounded-full',c)}/>)}</div></div>
              {[{l:'Bookings today',v:'8',c:'text-green-400'},{l:'Products sold',v:'24',c:'text-gold'},{l:'Wallet balance',v:'R 4,200',c:'text-cream'}].map(r => (
                <div key={r.l} className="flex items-center justify-between py-1"><span className="text-[11px] text-ink-600 font-body">{r.l}</span><span className={clsx('text-[12px] font-bold font-body',r.c)}>{r.v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero/>
      <StatsRibbon/>
      <ServicesSection/>
      <HowItWorks/>
      <StylistsSection/>
      <ProductsSection/>
      <Reviews/>
      <CTA/>
      <JoinBanner/>
    </>
  )
}
