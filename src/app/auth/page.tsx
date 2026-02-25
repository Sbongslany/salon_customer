'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Scissors, Eye, EyeOff, ArrowLeft, User, Mail, Lock, Phone, CheckCircle } from 'lucide-react'
import { useLogin, useRegister } from '@/hooks/useApi'
import { useStore } from '@/store/store'
import toast from 'react-hot-toast'
import clsx from 'clsx'

function Field({ label, icon, children }: { label:string; icon:React.ReactNode; children:React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-body font-semibold text-ink-300 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-600">{icon}</span>
        {children}
      </div>
    </div>
  )
}

function AuthForm() {
  const router   = useRouter()
  const params   = useSearchParams()
  const { login } = useStore()
  const loginMut    = useLogin()
  const registerMut = useRegister()

  const [tab,        setTab]        = useState<'login'|'register'>(params.get('tab') === 'register' ? 'register' : 'login')
  const [showPw,     setShowPw]     = useState(false)
  const [form,       setForm]       = useState({ name:'', email:'', phone:'', password:'', confirm:'' })
  const [registered, setRegistered] = useState(false)
  const f = (k:string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({...p,[k]:e.target.value}))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (tab === 'login') {
        const data = await loginMut.mutateAsync({ email:form.email, password:form.password })
        if (data.user.role !== 'customer') { toast.error('Use the staff portal'); return }
        login(data.user, data.accessToken)
        toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
        router.push(params.get('next') ?? '/')
      } else {
        if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
        if (form.password.length < 8) { toast.error('Password must be 8+ characters'); return }
        await registerMut.mutateAsync({ name:form.name, email:form.email, phone:form.phone, password:form.password })
        setRegistered(true)
      }
    } catch (err:any) {
      toast.error(err?.response?.data?.message ?? (tab === 'login' ? 'Invalid credentials' : 'Registration failed'))
    }
  }

  const busy = loginMut.isPending || registerMut.isPending

  if (registered) return (
    <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center px-4 py-10 pt-20">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-green-400"/>
        </div>
        <h2 className="font-display font-bold text-2xl text-cream mb-3">Check your email</h2>
        <p className="text-ink-400 font-body text-sm leading-relaxed mb-1">We sent a verification link to</p>
        <p className="text-gold font-body font-semibold mb-6">{form.email}</p>
        <p className="text-ink-500 font-body text-xs mb-8">Click the link to verify your account, then sign in.</p>
        <button onClick={() => { setTab('login'); setRegistered(false) }}
          className="w-full py-4 bg-gold text-ink-900 font-body font-bold rounded-xl hover:brightness-110 transition-all shadow-gold text-sm">
          Go to Sign In
        </button>
        <Link href="/" className="flex items-center justify-center gap-1.5 text-[12px] text-ink-600 hover:text-ink-400 font-body mt-5 transition-colors">
          <ArrowLeft size={12}/> Back to home
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center px-4 py-10 pt-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-gold">
            <Scissors size={18} className="text-ink-900" strokeWidth={2.5}/>
          </div>
          <span className="font-display font-bold text-2xl text-cream">Luxe<span className="text-gold">Studio</span></span>
        </div>

        <div className="bg-ink-800 border border-white/8 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-ink-900/60 p-1 mb-6">
            {(['login','register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={clsx('flex-1 py-2.5 rounded-lg text-[13px] font-body font-semibold transition-all',
                  tab===t ? 'bg-gold text-ink-900 shadow-gold' : 'text-ink-400 hover:text-ink-200')}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {tab === 'register' && (
              <Field label="Full Name" icon={<User size={15}/>}>
                <input type="text" value={form.name} onChange={f('name')} required placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 bg-ink-900/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body focus:outline-none focus:border-gold/50 transition-all"/>
              </Field>
            )}
            <Field label="Email" icon={<Mail size={15}/>}>
              <input type="email" value={form.email} onChange={f('email')} required placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-ink-900/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body focus:outline-none focus:border-gold/50 transition-all"/>
            </Field>
            {tab === 'register' && (
              <Field label="Phone (optional)" icon={<Phone size={15}/>}>
                <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+27 000 000 0000"
                  className="w-full pl-10 pr-4 py-3 bg-ink-900/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body focus:outline-none focus:border-gold/50 transition-all"/>
              </Field>
            )}
            <Field label="Password" icon={<Lock size={15}/>}>
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={f('password')} required placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-ink-900/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body focus:outline-none focus:border-gold/50 transition-all"/>
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors p-1">
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </Field>
            {tab === 'register' && (
              <Field label="Confirm Password" icon={<Lock size={15}/>}>
                <input type="password" value={form.confirm} onChange={f('confirm')} required placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-ink-900/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body focus:outline-none focus:border-gold/50 transition-all"/>
              </Field>
            )}
            <button type="submit" disabled={busy}
              className="w-full py-4 bg-gold text-ink-900 font-body font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold disabled:opacity-60 mt-1 min-h-[52px]">
              {busy ? '…' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[12px] text-ink-500 font-body mt-5">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')} className="text-gold hover:underline">
              {tab === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-[12px] text-ink-700 font-body mt-5">
          Staff member?{' '}
          <a href="http://localhost:3000/login" target="_blank" rel="noreferrer" className="text-ink-500 hover:text-gold transition-colors">Staff login →</a>
        </p>
        <Link href="/" className="flex items-center justify-center gap-1.5 text-[12px] text-ink-600 hover:text-ink-400 font-body mt-3 transition-colors py-2">
          <ArrowLeft size={12}/> Back to home
        </Link>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return <Suspense><AuthForm/></Suspense>
}
