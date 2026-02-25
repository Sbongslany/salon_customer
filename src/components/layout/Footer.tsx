import Link from 'next/link'
import { Scissors, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-400 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gold flex items-center justify-center shrink-0"><Scissors size={14} className="text-ink-900" strokeWidth={2.5}/></div>
              <span className="font-display font-bold text-base text-cream">Luxe<span className="text-gold">Studio</span></span>
            </div>
            <p className="text-sm text-ink-500 font-body leading-relaxed mb-4">Premium salon & beauty at your fingertips.</p>
            <div className="flex gap-2">
              {[Instagram, Facebook, Twitter].map((Icon,i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-ink-800 flex items-center justify-center text-ink-500 hover:text-gold transition-all">
                  <Icon size={14}/>
                </a>
              ))}
            </div>
          </div>
          {[
            { title:'Explore',  links:[['Services','/services'],['Stylists','/stylists'],['Shop','/shop']] },
            { title:'Account',  links:[['Sign Up','/auth?tab=register'],['Sign In','/auth'],['Bookings','/bookings'],['Orders','/orders']] },
            { title:'Company',  links:[['Staff Login','http://localhost:3000/login']] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-cream text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    {href.startsWith('http')
                      ? <a href={href} target="_blank" rel="noreferrer" className="text-sm text-ink-500 hover:text-cream transition-colors font-body">{label}</a>
                      : <Link href={href} className="text-sm text-ink-500 hover:text-cream transition-colors font-body">{label}</Link>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-600 font-body">© {new Date().getFullYear()} LuxeStudio. All rights reserved.</p>
          <a href="http://localhost:3000/login" target="_blank" rel="noreferrer" className="text-xs text-gold font-body hover:underline">Beauty professional? Join our network →</a>
        </div>
      </div>
    </footer>
  )
}
