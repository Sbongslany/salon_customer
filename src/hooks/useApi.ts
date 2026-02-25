import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { api, get, post, put, patch, del } from '@/lib/api'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const useLogin = () =>
  useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api.post('/auth/login', body).then(r => r.data.data)
  })

export const useRegister = () =>
  useMutation({
    mutationFn: (body: { name: string; email: string; password: string; phone?: string }) =>
      api.post('/auth/register', { ...body, role: 'customer' }).then(r => r.data.data)
  })

// ── Services ──────────────────────────────────────────────────────────────────
export const useServices = (params?: object) =>
  useQuery({
    queryKey: ['services', params],
    queryFn: () => get<{ services: any[]; pagination: any }>('/services', params),
  })

export const useService = (id: string) =>
  useQuery({
    queryKey: ['service', id],
    queryFn: () => get<any>(`/services/${id}`),
    enabled: !!id,
  })

export const useServicePerson = (id: string) =>
  useQuery({
    queryKey: ['sp', id],
    queryFn: () => get<any>(`/users/${id}`),
    enabled: !!id,
  })

export const useAvailableSlots = (spId: string, date: string) =>
  useQuery({
    queryKey: ['slots', spId, date],
    queryFn: () => get<{ date: string; slots: string[] }>(`/bookings/slots/${spId}`, { date }),
    enabled: !!spId && !!date,
  })

export const useNearbyServicePersons = (lat?: number, lng?: number) =>
  useQuery({
    queryKey: ['nearby', lat, lng],
    queryFn: () => get<{ users: any[] }>('/users/nearby', { lat, lng, radius: 20000 }),
    enabled: !!lat && !!lng,
  })

// ── Bookings ──────────────────────────────────────────────────────────────────
export const useMyBookings = (params?: object) =>
  useQuery({
    queryKey: ['my-bookings', params],
    queryFn: () => get<{ bookings: any[]; pagination: any }>('/bookings/my', params),
  })

export const useCreateBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) => post<{ booking: any; clientSecret: string }>('/bookings', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-bookings'] }),
  })
}

export const useCancelBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => patch<any>(`/bookings/${id}/cancel`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-bookings'] }),
  })
}

export const useRescheduleBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, newBookingDate }: { id: string; newBookingDate: string }) =>
      patch<any>(`/bookings/${id}/reschedule`, { newBookingDate }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-bookings'] }),
  })
}

// ── Shop ──────────────────────────────────────────────────────────────────────
export const useProducts = (params?: object) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => get<{ products: any[]; pagination: any }>('/products', params),
  })

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => get<any>(`/products/${id}`),
    enabled: !!id,
  })

export const useCart = () =>
  useQuery({
    queryKey: ['cart'],
    queryFn: () => get<any>('/cart'),
  })

export const useAddToCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      post<any>('/cart/items', { productId, quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export const useUpdateCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      put<any>(`/cart/items/${productId}`, { quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export const useRemoveFromCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => del(`/cart/items/${productId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export const useCheckout = () =>
  useMutation({
    // Returns { clientSecret, totalAmount } — use PaymentModal to confirm with Stripe.
    // Order is created by the webhook after payment succeeds.
    mutationFn: (body: any) => post<any>('/orders/checkout', body),
  })

// ── Orders ────────────────────────────────────────────────────────────────────
export const useMyOrders = () =>
  useQuery({
    queryKey: ['my-orders'],
    queryFn: () => get<{ orders: any[]; pagination: any }>('/orders/my'),
  })

// ── Reviews ───────────────────────────────────────────────────────────────────
export const useReviews = (spId: string) =>
  useQuery({
    queryKey: ['reviews', spId],
    queryFn: () => get<{ reviews: any[] }>(`/reviews/${spId}`),
    enabled: !!spId,
  })

export const useCreateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { servicePersonId: string; bookingId: string; rating: number; comment: string }) =>
      post<any>('/reviews', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  })
}

// ── Messages ──────────────────────────────────────────────────────────────────
export const useConversations = () =>
  useQuery({
    queryKey: ['conversations'],
    queryFn: () => get<any[]>('/messages'),
    refetchInterval: 5000,
  })

export const useMessages = (convId: string) =>
  useQuery({
    queryKey: ['messages', convId],
    queryFn: () => get<{ messages: any[]; pagination: any }>(`/messages/${convId}/messages`),
    enabled: !!convId,
    refetchInterval: 3000,
  })

export const useStartConversation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { targetUserId: string; bookingId?: string; orderId?: string; type?: string }) =>
      post<any>('/messages', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  })
}

export const useSendMessage = (convId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => post<any>(`/messages/${convId}/messages`, { text }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages', convId] }),
  })
}

export const useUnreadCount = () =>
  useQuery({
    queryKey: ['unread'],
    queryFn: () => get<{ unreadCount: number }>('/messages/unread'),
    refetchInterval: 10000,
  })

// ── Reports ───────────────────────────────────────────────────────────────────
export const useMyReports = () =>
  useQuery({
    queryKey: ['my-reports'],
    queryFn: () => get<{ reports: any[] }>('/reports/mine'),
  })

export const useSubmitReport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) => post<any>('/reports', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-reports'] }),
  })
}

// ── Promotions ────────────────────────────────────────────────────────────────
export const useActivePromotions = () =>
  useQuery({
    queryKey: ['promotions-active'],
    queryFn: () => get<{ promotions: any[] }>('/promotions', { active: 'true' }),
  })

// ── Profile ───────────────────────────────────────────────────────────────────
export const useUpdateProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) => put<any>('/users/me', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  })
}

export const useFavourites = () =>
  useQuery({
    queryKey: ['favourites'],
    queryFn: () => get<{ favourites: any[] }>('/favourites'),
  })

export const useToggleFavourite = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (serviceId: string) => post<any>(`/favourites/${serviceId}`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favourites'] }),
  })
}
