'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 }, mutations: { retry: 0 } } }))
  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster position="top-right" toastOptions={{ style:{ background:'#0D0D0D', color:'#FAF8F3', borderRadius:'12px', fontFamily:'var(--font-dm-sans)', fontSize:'13px' }, success:{ iconTheme:{ primary:'#C9A84C', secondary:'#0D0D0D' } } }}/>
    </QueryClientProvider>
  )
}
