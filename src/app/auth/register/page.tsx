'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scissors, Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, CheckCircle } from 'lucide-react'
import { useRegister } from '@/hooks/useApi'
import { useStore } from '@/store/store'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useStore()
  const register = useRegister()
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())        e.name     = 'Name is required'
    if (!form.email.includes('@')) e.email   = 'Valid email required'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const data = await register.mutateAsync({ name: form.name, email: form.email, phone: form.phone || undefined, password: form.password })
      setAuth(data.user, data.accessToken)
      toast.success(`Welcome to SalonPro, ${data.user.name.split(' ')[0]}! 🎉`)
      router.push('/home')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Registration failed')
    }
  }

  const perks = ['Book services instantly', 'Exclusive promotions & offers', 'Track orders & bookings', 'Chat with your stylist']

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Scissors size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl text-dark-900">Salon<span className="text-brand-500">Pro</span></span>
          </div>

          <h1 className="text-2xl font-bold text-dark-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">Join thousands of customers loving their experience</p>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-2 text-xs text-dark-600">
                <CheckCircle size={12} className="text-brand-500 flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" required
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all ${errors.name ? 'border-red-300' : 'border-gray-200'}`} />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+27 12 345 6789"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Minimum 8 characters" required
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all ${errors.password ? 'border-red-300' : 'border-gray-200'}`} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat password" required
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all ${errors.confirm ? 'border-red-300' : 'border-gray-200'}`} />
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-brand-500 hover:underline">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={register.isPending}
              className="w-full bg-brand-500 text-white font-semibold py-3 rounded-xl hover:bg-brand-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {register.isPending ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-500 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
