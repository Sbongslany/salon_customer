'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/store/store'
import { useUpdateProfile } from '@/hooks/useApi'
import { api } from '@/lib/api'
import { User, Mail, Phone, Camera, LogOut, Scissors, Calendar, ShoppingBag, ChevronRight, Save, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function ProfilePage() {
  const { user, logout, setUser } = useStore()
  const updateProfile = useUpdateProfile()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' })
  const [uploading, setUploading] = useState(false)

  if (!user) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-16">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4"><User size={22} className="text-ink-300"/></div>
        <h2 className="font-display font-bold text-xl text-ink-800 mb-2">Sign in to view profile</h2>
        <Link href="/auth" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gold text-ink-900 font-body font-bold rounded-xl shadow-gold hover:brightness-110 transition-all">Sign In</Link>
      </div>
    </div>
  )

  const handleSave = async () => {
    try {
      const data = await updateProfile.mutateAsync(form)
      setUser(data as any)
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
  }

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const fd = new FormData(); fd.append('image', file)
    setUploading(true)
    try {
      const { data } = await api.post('/users/me/avatar', fd, { headers:{'Content-Type':'multipart/form-data'} })
      setUser({ ...user, profileImage: data.data.profileImage })
      toast.success('Avatar updated!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  return (
    <div className="min-h-screen bg-cream pb-24 pt-16">
      {/* Dark header */}
      <div className="bg-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'radial-gradient(circle,#fff 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-20 sm:pt-10 sm:pb-24">
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <div className="w-6 h-px bg-gold"/>
            <span className="text-[11px] font-body font-semibold text-gold tracking-[0.2em] uppercase">Account</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gold/20 border-2 border-gold/30 overflow-hidden flex items-center justify-center">
                {user.profileImage?.url
                  ? <img src={user.profileImage.url} alt={user.name} className="w-full h-full object-cover"/>
                  : <span className="font-display font-bold text-2xl sm:text-3xl text-gold">{user.name[0]?.toUpperCase()}</span>
                }
              </div>
              <label className={clsx(
                'absolute -bottom-2 -right-2 w-8 h-8 bg-gold rounded-xl flex items-center justify-center cursor-pointer shadow-gold transition-all',
                uploading ? 'opacity-60' : 'hover:brightness-110'
              )}>
                <Camera size={13} className="text-ink-900"/>
                <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" disabled={uploading}/>
              </label>
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-cream text-xl sm:text-2xl truncate">{user.name}</h1>
              <p className="text-ink-400 font-body text-xs sm:text-sm mt-0.5 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 space-y-3">
        {/* Personal info card */}
        <div className="bg-white rounded-2xl shadow-soft border border-ink-100/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-ink-100">
            <h2 className="font-display font-bold text-ink-900">Personal Info</h2>
            <button
              onClick={() => { setEditing(v => !v); setForm({ name:user.name, phone:user.phone??'' }) }}
              className={clsx(
                'flex items-center gap-1.5 text-[13px] font-body font-medium px-3 py-2 rounded-xl transition-all min-h-[36px]',
                editing ? 'text-ink-500 bg-ink-50' : 'text-gold bg-gold/10 hover:bg-gold/20'
              )}>
              {editing ? 'Cancel' : <><Edit2 size={13}/>Edit</>}
            </button>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {[
              { icon:User,  label:'Full Name', key:'name',  value:user.name,       type:'text' },
              { icon:Phone, label:'Phone',     key:'phone', value:user.phone??'',  type:'tel'  },
            ].map(field => (
              <div key={field.key} className="flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 rounded-xl bg-ink-50 flex items-center justify-center shrink-0">
                  <field.icon size={14} className="text-ink-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-body text-ink-400 uppercase tracking-widest mb-1">{field.label}</p>
                  {editing
                    ? <input
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(p => ({...p,[field.key]:e.target.value}))}
                        className="w-full px-3 py-2 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm text-ink-900 focus:outline-none focus:border-gold/50 transition-all"
                      />
                    : <p className="font-body text-sm text-ink-900 truncate">{field.value || '—'}</p>
                  }
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 rounded-xl bg-ink-50 flex items-center justify-center shrink-0"><Mail size={14} className="text-ink-400"/></div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-body text-ink-400 uppercase tracking-widest mb-1">Email</p>
                <p className="font-body text-sm text-ink-900 truncate">{user.email}</p>
              </div>
            </div>
            {editing && (
              <button
                onClick={handleSave}
                disabled={updateProfile.isPending}
                className="w-full py-3.5 bg-gold text-ink-900 font-body font-bold rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold disabled:opacity-60 flex items-center justify-center gap-2 min-h-[50px]">
                <Save size={15}/>{updateProfile.isPending ? 'Saving…' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Quick nav */}
        <div className="bg-white rounded-2xl shadow-soft border border-ink-100/50 overflow-hidden">
          {[
            { icon:Calendar,    label:'My Bookings', href:'/bookings' },
            { icon:ShoppingBag, label:'My Orders',   href:'/orders'   },
          ].map((item, i, arr) => (
            <Link key={item.href} href={item.href}
              className={clsx('flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-ink-50 active:bg-ink-100 transition-colors min-h-[60px]', i < arr.length-1 && 'border-b border-ink-100')}>
              <div className="w-9 h-9 rounded-xl bg-ink-50 flex items-center justify-center shrink-0"><item.icon size={15} className="text-ink-500"/></div>
              <span className="flex-1 font-body font-medium text-sm text-ink-800">{item.label}</span>
              <ChevronRight size={15} className="text-ink-300"/>
            </Link>
          ))}
        </div>

        {/* Staff promo */}
        <div className="bg-gold/8 border border-gold/15 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-body font-semibold text-gold uppercase tracking-widest mb-1">For Professionals</p>
            <p className="font-display font-bold text-ink-900 text-sm sm:text-base">Are you a stylist?</p>
          </div>
          <a href="http://localhost:3000/login" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-gold text-ink-900 font-body font-bold text-sm rounded-xl hover:brightness-110 transition-all shadow-gold shrink-0 min-h-[44px]">
            <Scissors size={12}/>Staff
          </a>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full py-4 text-center text-red-500 font-body font-medium text-sm border border-red-200 rounded-2xl hover:bg-red-50 active:bg-red-100 transition-colors min-h-[52px] flex items-center justify-center gap-2">
          <LogOut size={15}/>Sign Out
        </button>
      </div>
    </div>
  )
}
