import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, setToken, clearToken } from '@/lib/api'

export interface User {
  _id: string; name: string; email: string
  phone?: string; role: string
  profileImage?: { url: string }
  address?: { street?:string; city?:string; state?:string; country?:string; lat?:number; lng?:number }
}

export interface CartItem {
  productId: string; name: string
  price: number; imageUrl?: string; quantity: number
}

interface Store {
  user:  User | null
  cart:  CartItem[]
  login:  (user: User, token: string) => void
  logout: () => void
  setUser:(user: User) => void
  addToCart:     (item: Omit<CartItem,'quantity'> & { quantity?: number }) => void
  removeFromCart:(id: string) => void
  updateQty:     (id: string, qty: number) => void
  clearCart:     () => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      cart: [],

      login: (user, token) => {
        setToken(token)
        set({ user })
      },

      logout: () => {
        clearToken()
        api.post('/auth/logout').catch(() => {})
        set({ user: null })
        if (typeof window !== 'undefined') window.location.href = '/'
      },

      setUser: (user) => set({ user }),

      addToCart: (item) => set(s => {
        const qty = item.quantity ?? 1
        const ex  = s.cart.find(c => c.productId === item.productId)
        if (ex) return { cart: s.cart.map(c => c.productId === item.productId ? { ...c, quantity: c.quantity + qty } : c) }
        return { cart: [...s.cart, { ...item, quantity: qty }] }
      }),

      removeFromCart: (id) => set(s => ({ cart: s.cart.filter(c => c.productId !== id) })),

      updateQty: (id, qty) => set(s => ({
        cart: qty <= 0
          ? s.cart.filter(c => c.productId !== id)
          : s.cart.map(c => c.productId === id ? { ...c, quantity: qty } : c)
      })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: 'luxe-cx', partialize: s => ({ user: s.user, cart: s.cart }) }
  )
)
