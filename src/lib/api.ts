import axios from 'axios'

const BASE = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001/api/v1')
  : '/api/v1'

export const api = axios.create({
  baseURL: BASE, withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const KEY = 'luxe_cx_token'
export const getToken   = (): string | null => typeof window !== 'undefined' ? localStorage.getItem(KEY) : null
export const setToken   = (t: string) => localStorage.setItem(KEY, t)
export const clearToken = () => localStorage.removeItem(KEY)

api.interceptors.request.use(cfg => {
  const t = getToken()
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

let busy = false
let q: Array<{ok:(t:string)=>void; fail:(e:unknown)=>void}> = []

api.interceptors.response.use(r => r, async err => {
  const orig = err.config as any
  if (err.response?.status === 401 && !orig._r) {
    if (busy) return new Promise((ok,fail) => q.push({ok,fail})).then(t => { orig.headers.Authorization=`Bearer ${t}`; return api(orig) })
    orig._r = true; busy = true
    try {
      const { data } = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true })
      const t: string = data.data.accessToken
      setToken(t); q.forEach(x => x.ok(t)); q = []
      orig.headers.Authorization = `Bearer ${t}`
      return api(orig)
    } catch(e) {
      clearToken(); q.forEach(x => x.fail(e)); q = []
      return Promise.reject(e)
    } finally { busy = false }
  }
  return Promise.reject(err)
})

export const get    = <T>(url: string, p?: object) => api.get<{data:T}>(url,{params:p}).then(r=>r.data.data)
export const post   = <T>(url: string, b?: unknown) => api.post<{data:T}>(url,b).then(r=>r.data.data)
export const put    = <T>(url: string, b?: unknown) => api.put<{data:T}>(url,b).then(r=>r.data.data)
export const patch  = <T>(url: string, b?: unknown) => api.patch<{data:T}>(url,b).then(r=>r.data.data)
export const del    = <T>(url: string) => api.delete<{data:T}>(url).then(r=>r.data.data)
export const fmt    = (c: number) => new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'}).format((c??0)/100)
