import { BatteryCharging, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'

export default function Header({ onAdmin }) {
  const [open, setOpen] = useState(false)
  const links = [
    ['الرئيسية', '#home'],
    ['المنتجات', '#products'],
    ['العروض', '#offers'],
    ['من نحن', '#about'],
    ['تواصل معنا', '#contact'],
  ]
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="العالمية للبطاريات - الرئيسية">
        <span className="brand-mark"><img src="/assets/logo-mark.png" alt="" onError={(e) => { e.currentTarget.style.display='none' }} /><BatteryCharging size={29} /></span>
        <span className="brand-copy"><strong>العالمية للبطاريات</strong><small>بطاريات سيارات</small></span>
      </a>
      <button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-label="فتح القائمة">{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'nav nav-open' : 'nav'}>
        {links.map(([label, href], i) => <a key={href} className={i === 0 ? 'nav-active' : ''} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="icon-button" href="#products" aria-label="البحث عن المنتجات"><Search size={19} /></a>
        <a className="icon-button whatsapp-icon" href="https://wa.me/201221266672" target="_blank" rel="noreferrer" aria-label="واتساب">W</a>
        <button className="admin-link" onClick={onAdmin}>لوحة الإدارة</button>
      </div>
    </header>
  )
}
