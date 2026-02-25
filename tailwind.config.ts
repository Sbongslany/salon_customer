import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'serif'],
        body:    ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        ink:   { DEFAULT:'#0D0D0D',50:'#F5F5F5',100:'#E8E8E8',200:'#D1D1D1',300:'#B0B0B0',400:'#888',500:'#5A5A5A',600:'#3A3A3A',700:'#2A2A2A',800:'#1A1A1A',900:'#0D0D0D' },
        gold:  { DEFAULT:'#C9A84C',50:'#FDF9EE',100:'#F9F0D3',200:'#F1DFA0',300:'#E8CB6A',400:'#DEB93D',500:'#C9A84C',600:'#A88435',700:'#7E6027' },
        cream: { DEFAULT:'#FAF8F3', dark:'#F0EBE0' },
        sage:  { DEFAULT:'#7D9B76',100:'#DDE8DB',200:'#BBD1B7' },
      },
      animation: {
        'slide-up':    'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':     'fadeIn 0.35s ease forwards',
        'scale-in':    'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-right': 'slideRight 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        slideUp:    { from:{ opacity:'0', transform:'translateY(16px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:     { from:{ opacity:'0' }, to:{ opacity:'1' } },
        scaleIn:    { from:{ opacity:'0', transform:'scale(0.95)' }, to:{ opacity:'1', transform:'scale(1)' } },
        slideRight: { from:{ opacity:'0', transform:'translateX(-16px)' }, to:{ opacity:'1', transform:'translateX(0)' } },
      },
      boxShadow: {
        soft:   '0 2px 16px rgba(13,13,13,0.06)',
        card:   '0 4px 32px rgba(13,13,13,0.08)',
        lifted: '0 8px 48px rgba(13,13,13,0.14)',
        gold:   '0 4px 24px rgba(201,168,76,0.28)',
      },
    },
  },
  plugins: [],
}
export default config
