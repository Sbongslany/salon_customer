'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Scissors, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useLogin } from '@/hooks/useApi'
import { useStore } from '@/store/store'
import toast from 'react-hot-toast'

function LoginForm() {
  const router  = useRouter()
  const params  = useSearchParams()
  const { login } = useStore()
  const loginMut  = useLogin()
  const [showPw, setShowPw] = useState(false)
  const [form, setForm]     = useState({ email: '', password: '' })
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await loginMut.mutateAsync(form)
      if (data.user.role !== 'customer') {
        toast.error('This portal is for customers only. Staff login is at localhost:3000/login')
        return
      }
      login(data.user, data.accessToken)
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
      router.push(params.get('next') ?? '/')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-gold">
            <Scissors size={18} className="text-ink-900" strokeWidth={2.5}/>
          </div>
          <span className="font-display font-bold text-2xl text-cream">Luxe<span className="text-gold">Studio</span></span>
        </div>

        <div className="bg-ink-800 border border-white/8 rounded-3xl p-8 shadow-2xl">
          <h1 className="font-display font-bold text-2xl text-cream mb-1">Welcome back</h1>
          <p className="text-ink-400 font-body text-sm mb-8">Sign in to your account to continue</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-body font-semibold text-ink-300 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" value={form.email} onChange={f('email')} required placeholder="you@example.com"
                className="w-full px-4 py-3 bg-ink-900/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body text-sm focus:outline-none focus:border-gold/50 focus:bg-ink-900 transition-all"/>
            </div>
            <div>
              <label className="block text-[12px] font-body font-semibold text-ink-300 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={f('password')} required placeholder="••••••••"
                  className="w-full px-4 py-3 bg-ink-900/60 border border-white/10 text-cream placeholder-ink-600 rounded-xl font-body text-sm focus:outline-none focus:border-gold/50 focus:bg-ink-900 transition-all pr-11"/>
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loginMut.isPending}
              className="w-full py-3.5 bg-gold text-ink-900 font-body font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold disabled:opacity-60 mt-2">
              {loginMut.isPending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[13px] font-body text-ink-500 mt-6">
            Don't have an account?{' '}
            <Link href="/auth?tab=register" className="text-gold hover:underline font-semibold">Create one free</Link>
          </p>
        </div>

        <p className="text-center text-[12px] text-ink-700 font-body mt-6">
          Staff member?{' '}
          <a href="http://localhost:3000/login" target="_blank" rel="noreferrer" className="text-ink-500 hover:text-gold transition-colors">Staff login →</a>
        </p>
        <Link href="/" className="flex items-center justify-center gap-1.5 text-[12px] text-ink-600 hover:text-ink-400 font-body mt-4 transition-colors">
          <ArrowLeft size={12}/> Back to home
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm/></Suspense>
}
