'use client'
import { ReactNode, forwardRef, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

// ── Button ────────────────────────────────────────────────────────────────────
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}
export const Button = forwardRef<HTMLButtonElement, BtnProps>(
  ({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none'
    const variants = {
      primary:   'bg-brand-500 text-white hover:bg-brand-600 shadow-sm hover:shadow-md hover:shadow-brand-500/20 active:scale-[0.98]',
      secondary: 'bg-dark-900 text-white hover:bg-dark-700 shadow-sm active:scale-[0.98]',
      ghost:     'bg-transparent text-dark-600 hover:bg-gray-100 hover:text-dark-900',
      danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-[0.98]',
      outline:   'bg-white border border-gray-200 text-dark-700 hover:bg-gray-50 hover:border-gray-300',
    }
    const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }
    return (
      <button ref={ref} disabled={disabled || loading} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}
export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-dark-700">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={clsx(
            'w-full bg-gray-50 border rounded-xl py-2.5 text-sm text-dark-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400',
            icon ? 'pl-10 pr-4' : 'px-4',
            error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={clsx('bg-white rounded-2xl border border-gray-100 shadow-sm', onClick && 'cursor-pointer hover:shadow-md transition-shadow', className)}>
      {children}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold'
export function Badge({ children, variant = 'default', className }: { children: ReactNode; variant?: BadgeVariant; className?: string }) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    danger:  'bg-red-50 text-red-700 ring-1 ring-red-200',
    info:    'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    gold:    'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
  }
  return <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>{children}</span>
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton rounded-xl', className)} />
}

// ── Star Rating ───────────────────────────────────────────────────────────────
export function StarRating({ value, max = 5, onChange }: { value: number; max?: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i + 1)}
          className={clsx('text-xl transition-transform', onChange && 'hover:scale-110', i < value ? 'text-yellow-400' : 'text-gray-200')}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-300">{icon}</div>
      <h3 className="font-semibold text-dark-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ src, name, size = 'md' }: { src?: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }
  return src ? (
    <img src={src} alt={name} className={clsx(sizes[size], 'rounded-full object-cover')} />
  ) : (
    <div className={clsx(sizes[size], 'rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center')}>
      {name[0]?.toUpperCase()}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto animate-fade-up">
          {title && (
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-dark-900">{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-dark-700 transition-colors text-xl leading-none">×</button>
            </div>
          )}
          <div className="p-5">{children}</div>
        </div>
      </div>
    </>
  )
}
